import { describe, it, expect } from "vitest";
import {
  generateReservationEmailHTML,
  generateReservationEmailText,
} from "./email";

describe("Email Templates", () => {
  const testData = {
    guestName: "Иван Петров",
    guestEmail: "ivan@example.com",
    apartmentName: "Апартамент Люкс",
    apartmentNumber: "01",
    checkInDate: new Date("2026-04-15"),
    checkOutDate: new Date("2026-04-20"),
    numberOfNights: 5,
    totalPrice: 6000,
    specialRequests: "Предпочитам висок етаж с гледка към планината",
    confirmationId: "RES123456789",
  };

  describe("generateReservationEmailHTML", () => {
    it("should generate valid HTML email template", () => {
      const html = generateReservationEmailHTML(testData);

      expect(html).toBeDefined();
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("</html>");
    });

    it("should include guest name in the email", () => {
      const html = generateReservationEmailHTML(testData);
      expect(html).toContain(testData.guestName);
    });

    it("should include apartment details", () => {
      const html = generateReservationEmailHTML(testData);
      expect(html).toContain(testData.apartmentName);
      expect(html).toContain(testData.apartmentNumber);
    });

    it("should include check-in and check-out dates", () => {
      const html = generateReservationEmailHTML(testData);
      expect(html).toContain("15");
      expect(html).toContain("20");
      expect(html).toContain("април");
    });

    it("should include number of nights", () => {
      const html = generateReservationEmailHTML(testData);
      expect(html).toContain(String(testData.numberOfNights));
    });

    it("should include total price when provided", () => {
      const html = generateReservationEmailHTML(testData);
      expect(html).toContain("6000");
    });

    it("should include special requests when provided", () => {
      const html = generateReservationEmailHTML(testData);
      expect(html).toContain(testData.specialRequests);
    });

    it("should include confirmation ID", () => {
      const html = generateReservationEmailHTML(testData);
      expect(html).toContain(testData.confirmationId);
    });

    it("should include contact information", () => {
      const html = generateReservationEmailHTML(testData);
      expect(html).toContain("+359 888 000 000");
      expect(html).toContain("info@plaza-pamporovo.bg");
    });

    it("should include company branding", () => {
      const html = generateReservationEmailHTML(testData);
      expect(html).toContain("PLAZA APARTMENTS");
      expect(html).toContain("Пампорово");
    });

    it("should handle missing optional fields", () => {
      const dataWithoutOptionals = {
        ...testData,
        totalPrice: undefined,
        specialRequests: undefined,
      };

      const html = generateReservationEmailHTML(dataWithoutOptionals);
      expect(html).toBeDefined();
      expect(html).toContain(testData.guestName);
    });
  });

  describe("generateReservationEmailText", () => {
    it("should generate valid plain text email template", () => {
      const text = generateReservationEmailText(testData);

      expect(text).toBeDefined();
      expect(typeof text).toBe("string");
      expect(text.length).toBeGreaterThan(0);
    });

    it("should include guest name in plain text", () => {
      const text = generateReservationEmailText(testData);
      expect(text).toContain(testData.guestName);
    });

    it("should include apartment details in plain text", () => {
      const text = generateReservationEmailText(testData);
      expect(text).toContain(testData.apartmentName);
      expect(text).toContain(testData.apartmentNumber);
    });

    it("should include contact information in plain text", () => {
      const text = generateReservationEmailText(testData);
      expect(text).toContain("+359 888 000 000");
      expect(text).toContain("info@plaza-pamporovo.bg");
    });

    it("should have readable structure with sections", () => {
      const text = generateReservationEmailText(testData);
      expect(text).toContain("ДЕТАЙЛИ НА РЕЗЕРВАЦИЯТА");
      expect(text).toContain("ЧЕ ОЧАКВАЙ");
      expect(text).toContain("КОНТАКТ");
    });

    it("should include special requests when provided", () => {
      const text = generateReservationEmailText(testData);
      expect(text).toContain("СПЕЦИАЛНИ ПОЖЕЛАНИЯ");
      expect(text).toContain(testData.specialRequests);
    });
  });

  describe("Email template consistency", () => {
    it("should have matching information between HTML and text versions", () => {
      const html = generateReservationEmailHTML(testData);
      const text = generateReservationEmailText(testData);

      // Both should contain key information
      expect(html).toContain(testData.guestName);
      expect(text).toContain(testData.guestName);

      expect(html).toContain(testData.apartmentName);
      expect(text).toContain(testData.apartmentName);

      expect(html).toContain(testData.confirmationId);
      expect(text).toContain(testData.confirmationId);
    });

    it("should properly format dates in both versions", () => {
      const html = generateReservationEmailHTML(testData);
      const text = generateReservationEmailText(testData);

      // Both should contain date information (day numbers)
      expect(html).toContain("15");
      expect(text).toContain("15");
      expect(html).toContain("20");
      expect(text).toContain("20");
    });
  });
});
