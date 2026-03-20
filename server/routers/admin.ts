import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getAllReservations,
  getReservationById,
  updateReservationStatus,
  blockDate,
  unblockDate,
  getAllApartments,
  getReservationStats,
  getBlockedDatesByApartment,
} from "../db";

/**
 * Admin-only procedure that checks if user has admin role
 */
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to access this resource",
    });
  }
  return next({ ctx });
});

export const adminRouter = router({
  /**
   * Get all reservations with optional filtering
   */
  reservations: router({
    list: adminProcedure.query(async () => {
      try {
        const reservations = await getAllReservations();
        return reservations;
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch reservations",
        });
      }
    }),

    /**
     * Get a specific reservation by ID
     */
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        try {
          const reservation = await getReservationById(input.id);
          if (!reservation) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Reservation not found",
            });
          }
          return reservation;
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          console.error("Failed to fetch reservation:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch reservation",
          });
        }
      }),

    /**
     * Update reservation status
     */
    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await updateReservationStatus(input.id, input.status);
          return { success: true };
        } catch (error) {
          console.error("Failed to update reservation status:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update reservation status",
          });
        }
      }),
  }),

  /**
   * Manage apartment availability and blocked dates
   */
  availability: router({
    /**
     * Block a date for an apartment
     */
    blockDate: adminProcedure
      .input(
        z.object({
          apartmentId: z.number(),
          date: z.date(),
          reason: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await blockDate(input.apartmentId, input.date, input.reason);
          return { success: true };
        } catch (error) {
          console.error("Failed to block date:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to block date",
          });
        }
      }),

    /**
     * Unblock a previously blocked date
     */
    unblockDate: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        try {
          await unblockDate(input.id);
          return { success: true };
        } catch (error) {
          console.error("Failed to unblock date:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to unblock date",
          });
        }
      }),

    /**
     * Get blocked dates for an apartment
     */
    getBlockedDates: adminProcedure
      .input(z.object({ apartmentId: z.number() }))
      .query(async ({ input }) => {
        try {
          const blockedDates = await getBlockedDatesByApartment(
            input.apartmentId
          );
          return blockedDates;
        } catch (error) {
          console.error("Failed to fetch blocked dates:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch blocked dates",
          });
        }
      }),
  }),

  /**
   * Get apartment information
   */
  apartments: router({
    list: adminProcedure.query(async () => {
      try {
        const apartments = await getAllApartments();
        return apartments;
      } catch (error) {
        console.error("Failed to fetch apartments:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch apartments",
        });
      }
    }),
  }),

  /**
   * Get reservation statistics
   */
  stats: adminProcedure.query(async () => {
    try {
      const stats = await getReservationStats();
      return stats;
    } catch (error) {
      console.error("Failed to fetch reservation stats:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch reservation stats",
      });
    }
  }),
});
