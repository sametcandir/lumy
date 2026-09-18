import nodemailer from 'nodemailer';
import { UserMessage, SiteSettings } from './db';
import { formatWhatsAppPhone } from './whatsapp';

export async function sendNotificationEmail(settings: SiteSettings, message: UserMessage) {
  const config = settings.emailNotification;
  if (!config || !config.enabled || !config.recipientEmail) {
    return { success: false, reason: 'Email notification is disabled or no recipient' };
  }

  const cleanPhone = formatWhatsAppPhone(message.phone);
  const waLink = `https://wa.me/${cleanPhone}`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #fffdfa; border: 1px solid #fedfb2; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #f6841e 0%, #db6512 100%); padding: 25px 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🧸 ${settings.brandName || 'Lumy Toys'}</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Yeni Web Sitesi İletişim Mesajı</p>
      </div>

      <div style="padding: 25px 20px;">
        <div style="display: inline-block; background: #e0f2fe; color: #0369a1; padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: bold; margin-bottom: 20px; text-transform: uppercase;">
          🧸 Yeni İletişim Mesajı
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #78716c; width: 140px;"><strong>Ad Soyad:</strong></td>
            <td style="padding: 8px 0; color: #1c1917; font-weight: bold;">${message.name}</td>
          </tr>
          ${message.company ? `
          <tr>
            <td style="padding: 8px 0; color: #78716c;"><strong>Firma Adı:</strong></td>
            <td style="padding: 8px 0; color: #1c1917;">${message.company}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px 0; color: #78716c;"><strong>Telefon:</strong></td>
            <td style="padding: 8px 0; color: #1c1917; font-weight: bold;">
              <a href="tel:${message.phone}" style="color: #f6841e; text-decoration: none;">${message.phone}</a>
            </td>
          </tr>
          ${message.email ? `
          <tr>
            <td style="padding: 8px 0; color: #78716c;"><strong>E-Posta:</strong></td>
            <td style="padding: 8px 0; color: #1c1917;">
              <a href="mailto:${message.email}" style="color: #f6841e; text-decoration: none;">${message.email}</a>
            </td>
          </tr>` : ''}
          ${message.productInterest ? `
          <tr>
            <td style="padding: 8px 0; color: #78716c;"><strong>İlgilenilen Ürün:</strong></td>
            <td style="padding: 8px 0; color: #1c1917;">${message.productInterest}</td>
          </tr>` : ''}
          ${message.estimatedQty ? `
          <tr>
            <td style="padding: 8px 0; color: #78716c;"><strong>Tahmini Miktar:</strong></td>
            <td style="padding: 8px 0; color: #1c1917; font-weight: bold;">${message.estimatedQty}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px 0; color: #78716c;"><strong>Tarih:</strong></td>
            <td style="padding: 8px 0; color: #78716c;">${message.date}</td>
          </tr>
        </table>

        <div style="background: #fdf6ee; border-left: 4px solid #f6841e; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
          <strong style="display: block; font-size: 13px; color: #b44810; margin-bottom: 5px;">Gelen Mesaj:</strong>
          <p style="margin: 0; font-size: 14px; color: #44403c; line-height: 1.6; white-space: pre-wrap;">${message.message}</p>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <a href="${waLink}" style="display: inline-block; background: #25d366; color: white; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 24px; border-radius: 12px; box-shadow: 0 4px 10px rgba(37,211,102,0.3);">
            💬 Müşteriye WhatsApp'tan Yanıt Ver
          </a>
        </div>
      </div>

      <div style="background: #faf5ee; padding: 15px; text-align: center; font-size: 12px; color: #a8a29e; border-top: 1px solid #fedfb2;">
        Bu e-posta Lumy Toys web sitesi iletişim formu üzerinden otomatik olarak gönderilmiştir.
      </div>
    </div>
  `;

  // If SMTP is provided, send real email via Nodemailer
  if (config.smtpHost && config.smtpUser && config.smtpPass) {
    try {
      const cleanPass = config.smtpPass.replace(/\s+/g, '').trim();
      const isGmail = config.smtpHost.toLowerCase().includes('gmail');
      const port = Number(config.smtpPort) || (isGmail ? 465 : 587);
      const isSecure = port === 465 || Boolean(config.smtpSecure);

      const transporter = isGmail
        ? nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: config.smtpUser.trim(),
              pass: cleanPass,
            },
          })
        : nodemailer.createTransport({
            host: config.smtpHost.trim(),
            port: port,
            secure: isSecure,
            auth: {
              user: config.smtpUser.trim(),
              pass: cleanPass,
            },
            tls: {
              rejectUnauthorized: false,
            },
          });

      const info = await transporter.sendMail({
        from: `"${settings.brandName || 'Lumy Toys'}" <${config.smtpUser.trim()}>`,
        to: config.recipientEmail.trim(),
        subject: `[${settings.brandName || 'Lumy Toys'}] Yeni İletişim Mesajı - ${message.name}`,
        html: htmlContent,
      });

      console.log('Nodemailer email sent successfully! MessageId:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error('Nodemailer error:', error);
      return { success: false, error: error.message };
    }
  } else {
    // If SMTP host is not configured yet, log that notification is ready
    console.log(`[Email Notification Simulation] To: ${config.recipientEmail} | Subject: Yeni Mesaj - ${message.name}`);
    return { success: true, simulated: true };
  }
}
