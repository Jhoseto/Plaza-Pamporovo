import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createReservation, getAvailableDatesForMonth } from "./db";
import { sendReservationConfirmationEmail } from "./email";
import { nanoid } from "nanoid";
import { adminRouter } from "./routers/admin";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  admin: adminRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  reservations: router({
    create: publicProcedure
      .input(
        z.object({
          apartmentId: z.number(),
          guestName: z.string(),
          guestEmail: z.string().email(),
          guestPhone: z.string().optional(),
          checkInDate: z.date(),
          checkOutDate: z.date(),
          numberOfNights: z.number(),
          totalPrice: z.number().optional(),
          specialRequests: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const confirmationId = nanoid(12);
          await createReservation(input);

          // Send confirmation email to guest
          const emailSent = await sendReservationConfirmationEmail({
            guestName: input.guestName,
            guestEmail: input.guestEmail,
            apartmentName: `Апартамент ${input.apartmentId}`,
            apartmentNumber: String(input.apartmentId),
            checkInDate: input.checkInDate,
            checkOutDate: input.checkOutDate,
            numberOfNights: input.numberOfNights,
            totalPrice: input.totalPrice,
            specialRequests: input.specialRequests,
            confirmationId,
          });

          if (!emailSent) {
            console.warn(
              `[Reservation] Email confirmation failed for ${input.guestEmail}`
            );
            // Don't fail the reservation if email fails
          }

          return { success: true, confirmationId };
        } catch (error) {
          console.error("Failed to create reservation:", error);
          throw new Error("Failed to create reservation");
        }
      }),

    getAvailability: publicProcedure
      .input(
        z.object({
          apartmentId: z.number(),
          year: z.number(),
          month: z.number(),
        })
      )
      .query(async ({ input }) => {
        try {
          const availability = await getAvailableDatesForMonth(
            input.apartmentId,
            input.year,
            input.month
          );
          return availability;
        } catch (error) {
          console.error("Failed to get availability:", error);
          throw new Error("Failed to get availability");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
