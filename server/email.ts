import { notifyOwner } from "./_core/notification";

export interface ReservationEmailData {
  guestName: string;
  guestEmail: string;
  apartmentName: string;
  apartmentNumber: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfNights: number;
  totalPrice?: number;
  specialRequests?: string;
  confirmationId: string;
}

/**
 * Generates an HTML email template for reservation confirmation
 */
export function generateReservationEmailHTML(data: ReservationEmailData): string {
  const checkInFormatted = data.checkInDate.toLocaleDateString("bg-BG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const checkOutFormatted = data.checkOutDate.toLocaleDateString("bg-BG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html lang="bg">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
    }
    .header {
      background: linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 100%);
      color: #C5A059;
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      letter-spacing: 0.1em;
      font-weight: 400;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 12px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(234, 234, 234, 0.6);
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      color: #0A0A0A;
      margin-bottom: 20px;
    }
    .confirmation-box {
      background-color: #f9f9f9;
      border-left: 4px solid #C5A059;
      padding: 20px;
      margin: 30px 0;
    }
    .confirmation-box h2 {
      margin: 0 0 15px 0;
      color: #C5A059;
      font-size: 16px;
      letter-spacing: 0.05em;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      font-size: 14px;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #666;
      font-weight: 500;
    }
    .detail-value {
      color: #0A0A0A;
      font-weight: 600;
    }
    .special-requests {
      background-color: #f0f0f0;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
      font-size: 13px;
      color: #555;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #999;
    }
    .footer-link {
      color: #C5A059;
      text-decoration: none;
    }
    .cta-button {
      display: inline-block;
      background-color: #C5A059;
      color: #0A0A0A;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 0.05em;
    }
    .divider {
      height: 1px;
      background-color: #e0e0e0;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>PLAZA APARTMENTS</h1>
      <p>Пампорово · Родопи · България</p>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="greeting">
        Здравей, <strong>${data.guestName}</strong>!
      </div>

      <p>Благодарим ти за резервацията! Твоето бягство в планинския лукс е потвърдено.</p>

      <!-- Confirmation Box -->
      <div class="confirmation-box">
        <h2>📋 ДЕТАЙЛИ НА РЕЗЕРВАЦИЯТА</h2>
        
        <div class="detail-row">
          <span class="detail-label">Апартамент:</span>
          <span class="detail-value">${data.apartmentName} (${data.apartmentNumber})</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Дата на пристигане:</span>
          <span class="detail-value">${checkInFormatted}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Дата на заминаване:</span>
          <span class="detail-value">${checkOutFormatted}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Брой нощи:</span>
          <span class="detail-value">${data.numberOfNights}</span>
        </div>

        ${
          data.totalPrice
            ? `
        <div class="detail-row">
          <span class="detail-label">Обща цена:</span>
          <span class="detail-value">${data.totalPrice.toLocaleString("bg-BG")} лв</span>
        </div>
        `
            : ""
        }

        <div class="detail-row">
          <span class="detail-label">Потвърждение ID:</span>
          <span class="detail-value">${data.confirmationId}</span>
        </div>
      </div>

      ${
        data.specialRequests
          ? `
      <div class="special-requests">
        <strong>Специални пожелания:</strong><br>
        ${data.specialRequests}
      </div>
      `
          : ""
      }

      <div class="divider"></div>

      <h3 style="color: #C5A059; letter-spacing: 0.05em;">ЧЕ ОЧАКВАЙ</h3>
      <ul style="color: #555; line-height: 1.8;">
        <li>Потвърждение на резервацията ще бъде изпратено до твоя имейл</li>
        <li>Консиерж екипът ще се свърже с теб 24 часа преди пристигането</li>
        <li>Вход в апартамента е от 15:00, изход до 11:00</li>
        <li>Всички удобства и услуги са включени в цената</li>
      </ul>

      <div class="divider"></div>

      <p style="color: #666; font-size: 14px;">
        Ако имаш някакви въпроси или нужди, свържи се с нашия консиерж екип:
      </p>
      <p style="text-align: center; font-size: 16px;">
        <strong>+359 888 000 000</strong><br>
        <strong>info@plaza-pamporovo.bg</strong>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 0 0 15px 0;">
        © 2026 PLAZA APARTMENTS Pamporovo. Всички права запазени.
      </p>
      <p style="margin: 0;">
        Това е автоматично генерирано писмо. Моля, не отговаряй директно на този имейл.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Sends a reservation confirmation email to the guest
 */
export async function sendReservationConfirmationEmail(
  data: ReservationEmailData
): Promise<boolean> {
  try {
    const emailHTML = generateReservationEmailHTML(data);

    // Send notification to owner about the reservation
    const notificationSent = await notifyOwner({
      title: `Нова резервация от ${data.guestName}`,
      content: `Апартамент: ${data.apartmentName}\nДати: ${data.checkInDate.toLocaleDateString("bg-BG")} - ${data.checkOutDate.toLocaleDateString("bg-BG")}\nБрой нощи: ${data.numberOfNights}\nИмейл: ${data.guestEmail}\nТелефон: ${data.guestEmail}`,
    });

    if (!notificationSent) {
      console.warn("[Email] Failed to send owner notification");
      // Continue anyway - owner notification is secondary
    }

    console.log(
      `[Email] Reservation confirmation prepared for ${data.guestEmail}`
    );

    // In a production environment, you would send the email here using:
    // - SendGrid API
    // - AWS SES
    // - Brevo (formerly Sendinblue)
    // - Or any other email service

    // For now, we log the email content
    console.log(
      `[Email] HTML template generated for reservation ${data.confirmationId}`
    );

    return true;
  } catch (error) {
    console.error("[Email] Error sending reservation confirmation:", error);
    return false;
  }
}

/**
 * Generates a plain text version of the reservation confirmation
 */
export function generateReservationEmailText(
  data: ReservationEmailData
): string {
  const checkInFormatted = data.checkInDate.toLocaleDateString("bg-BG");
  const checkOutFormatted = data.checkOutDate.toLocaleDateString("bg-BG");

  return `
PLAZA APARTMENTS PAMPOROVO
Пампорово · Родопи · България

---

Здравей, ${data.guestName}!

Благодарим ти за резервацията! Твоето бягство в планинския лукс е потвърдено.

ДЕТАЙЛИ НА РЕЗЕРВАЦИЯТА
========================

Апартамент: ${data.apartmentName} (${data.apartmentNumber})
Дата на пристигане: ${checkInFormatted}
Дата на заминаване: ${checkOutFormatted}
Брой нощи: ${data.numberOfNights}
${data.totalPrice ? `Обща цена: ${data.totalPrice.toLocaleString("bg-BG")} лв` : ""}
Потвърждение ID: ${data.confirmationId}

${
  data.specialRequests
    ? `
СПЕЦИАЛНИ ПОЖЕЛАНИЯ
====================
${data.specialRequests}
`
    : ""
}

ЧЕ ОЧАКВАЙ
==========
- Потвърждение на резервацията ще бъде изпратено до твоя имейл
- Консиерж екипът ще се свърже с теб 24 часа преди пристигането
- Вход в апартамента е от 15:00, изход до 11:00
- Всички удобства и услуги са включени в цената

КОНТАКТ
=======
+359 888 000 000
info@plaza-pamporovo.bg

---

© 2026 PLAZA APARTMENTS Pamporovo. Всички права запазени.
Това е автоматично генерирано писмо. Моля, не отговаряй директно на този имейл.
  `;
}
