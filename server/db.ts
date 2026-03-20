import { eq, and, between, lt, gte, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, apartments, reservations, blockedDates, Reservation, BlockedDate } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Reservation queries
export async function createReservation(data: {
  apartmentId: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfNights: number;
  totalPrice?: number;
  specialRequests?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(reservations).values({
    apartmentId: data.apartmentId,
    guestName: data.guestName,
    guestEmail: data.guestEmail,
    guestPhone: data.guestPhone,
    checkInDate: data.checkInDate,
    checkOutDate: data.checkOutDate,
    numberOfNights: data.numberOfNights,
    totalPrice: data.totalPrice,
    specialRequests: data.specialRequests,
    status: "pending",
  });
}

export async function getReservationsByApartment(apartmentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(reservations)
    .where(
      and(
        eq(reservations.apartmentId, apartmentId),
        eq(reservations.status, "confirmed")
      )
    );
}

export async function getBlockedDatesByApartment(apartmentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(blockedDates)
    .where(eq(blockedDates.apartmentId, apartmentId));
}

export async function isDateAvailable(
  apartmentId: number,
  date: Date
): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const dateStart = new Date(date);
  dateStart.setHours(0, 0, 0, 0);
  const dateEnd = new Date(date);
  dateEnd.setHours(23, 59, 59, 999);

  // Check blocked dates
  const blocked = await db
    .select()
    .from(blockedDates)
    .where(
      and(
        eq(blockedDates.apartmentId, apartmentId),
        between(blockedDates.date, dateStart, dateEnd)
      )
    )
    .limit(1);

  if (blocked.length > 0) return false;

  // Check reservations
  const reserved = await db
    .select()
    .from(reservations)
    .where(
      and(
        eq(reservations.apartmentId, apartmentId),
        eq(reservations.status, "confirmed"),
        lt(reservations.checkInDate, dateEnd),
        gte(reservations.checkOutDate, dateStart)
      )
    )
    .limit(1);

  return reserved.length === 0;
}

export async function getAvailableDatesForMonth(
  apartmentId: number,
  year: number,
  month: number
): Promise<{ available: Date[]; booked: Date[] }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);

  // Get all reservations for this month
  const monthReservations = await db
    .select()
    .from(reservations)
    .where(
      and(
        eq(reservations.apartmentId, apartmentId),
        eq(reservations.status, "confirmed"),
        lt(reservations.checkInDate, monthEnd),
        gte(reservations.checkOutDate, monthStart)
      )
    );

  // Get all blocked dates for this month
  const monthBlocked = await db
    .select()
    .from(blockedDates)
    .where(
      and(
        eq(blockedDates.apartmentId, apartmentId),
        between(blockedDates.date, monthStart, monthEnd)
      )
    );

  const bookedDates = new Set<string>();
  const availableDates: Date[] = [];

  // Mark all booked dates from reservations
  monthReservations.forEach((res) => {
    const current = new Date(res.checkInDate);
    while (current < res.checkOutDate) {
      bookedDates.add(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
  });

  // Mark all blocked dates
  monthBlocked.forEach((bd) => {
    bookedDates.add(new Date(bd.date).toISOString().split("T")[0]);
  });

  // Generate available dates
  for (let i = 1; i <= monthEnd.getDate(); i++) {
    const date = new Date(year, month - 1, i);
    const dateStr = date.toISOString().split("T")[0];
    if (!bookedDates.has(dateStr)) {
      availableDates.push(date);
    }
  }

  return {
    available: availableDates,
    booked: Array.from(bookedDates).map((d) => new Date(d)),
  };
}

// Admin queries
export async function getAllReservations() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(reservations)
    .orderBy(desc(reservations.createdAt));
}

export async function getReservationById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(reservations)
    .where(eq(reservations.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateReservationStatus(
  id: number,
  status: "pending" | "confirmed" | "cancelled" | "completed"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(reservations)
    .set({ status, updatedAt: new Date() })
    .where(eq(reservations.id, id));
}

export async function blockDate(
  apartmentId: number,
  date: Date,
  reason?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(blockedDates).values({
    apartmentId,
    date,
    reason,
  });
}

export async function unblockDate(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(blockedDates).where(eq(blockedDates.id, id));
}

export async function getAllApartments() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(apartments);
}

export async function getReservationStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const totalReservations = await db.select().from(reservations);
  const confirmedReservations = totalReservations.filter(
    (r) => r.status === "confirmed"
  );
  const totalRevenue = confirmedReservations.reduce(
    (sum, r) => sum + (r.totalPrice || 0),
    0
  );

  return {
    totalReservations: totalReservations.length,
    confirmedReservations: confirmedReservations.length,
    pendingReservations: totalReservations.filter(
      (r) => r.status === "pending"
    ).length,
    cancelledReservations: totalReservations.filter(
      (r) => r.status === "cancelled"
    ).length,
    totalRevenue,
  };
}

// TODO: add more feature queries as needed
