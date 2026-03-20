import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getAvailableDatesForMonth } from "./db";

describe("Reservation Management", () => {
  const testApartmentId = 1;
  const testYear = 2026;
  const testMonth = 3;

  describe("getAvailableDatesForMonth", () => {
    it("should return available and booked dates for a given month", async () => {
      const result = await getAvailableDatesForMonth(testApartmentId, testYear, testMonth);

      expect(result).toBeDefined();
      expect(result).toHaveProperty("available");
      expect(result).toHaveProperty("booked");
      expect(Array.isArray(result.available)).toBe(true);
      expect(Array.isArray(result.booked)).toBe(true);
    });

    it("should return dates as Date objects", async () => {
      const result = await getAvailableDatesForMonth(testApartmentId, testYear, testMonth);

      if (result.available.length > 0) {
        expect(result.available[0]).toBeInstanceOf(Date);
      }
      if (result.booked.length > 0) {
        expect(result.booked[0]).toBeInstanceOf(Date);
      }
    });

    it("should handle different months correctly", async () => {
      const march = await getAvailableDatesForMonth(testApartmentId, 2026, 3);
      const april = await getAvailableDatesForMonth(testApartmentId, 2026, 4);

      // March has 31 days, April has 30 days
      const marchTotal = march.available.length + march.booked.length;
      const aprilTotal = april.available.length + april.booked.length;

      expect(marchTotal).toBeLessThanOrEqual(31);
      expect(aprilTotal).toBeLessThanOrEqual(30);
    });

    it("should not have overlapping dates between available and booked", async () => {
      const result = await getAvailableDatesForMonth(testApartmentId, testYear, testMonth);

      const availableStrings = result.available.map((d) => d.toISOString().split("T")[0]);
      const bookedStrings = result.booked.map((d) => d.toISOString().split("T")[0]);

      const overlap = availableStrings.filter((d) => bookedStrings.includes(d));
      expect(overlap.length).toBe(0);
    });
  });
});
