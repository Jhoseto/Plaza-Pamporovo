import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Apartments table
export const apartments = mysqlTable("apartments", {
  id: int("id").autoincrement().primaryKey(),
  number: varchar("number", { length: 10 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  sqm: int("sqm"),
  bedrooms: int("bedrooms"),
  pricePerNight: int("pricePerNight"),
  minNights: int("minNights").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Apartment = typeof apartments.$inferSelect;
export type InsertApartment = typeof apartments.$inferInsert;

// Reservations table
export const reservations = mysqlTable("reservations", {
  id: int("id").autoincrement().primaryKey(),
  apartmentId: int("apartmentId").notNull(),
  guestName: varchar("guestName", { length: 255 }).notNull(),
  guestEmail: varchar("guestEmail", { length: 320 }).notNull(),
  guestPhone: varchar("guestPhone", { length: 20 }),
  checkInDate: timestamp("checkInDate").notNull(),
  checkOutDate: timestamp("checkOutDate").notNull(),
  numberOfNights: int("numberOfNights").notNull(),
  totalPrice: int("totalPrice"),
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled", "completed"]).default("pending").notNull(),
  specialRequests: text("specialRequests"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = typeof reservations.$inferInsert;

// Availability/Blocked dates table
export const blockedDates = mysqlTable("blockedDates", {
  id: int("id").autoincrement().primaryKey(),
  apartmentId: int("apartmentId").notNull(),
  date: timestamp("date").notNull(),
  reason: varchar("reason", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlockedDate = typeof blockedDates.$inferSelect;
export type InsertBlockedDate = typeof blockedDates.$inferInsert;