import nodemailer from 'nodemailer';

/**
 * Minimal email helper. Uses SMTP credentials from env. If SMTP is not
 * configured (e.g. local dev), it logs the message to the server console and
 * returns `{ sent: false }` so flows can still continue in development.
 */

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

export function isEmailConfigured(): boolean {
  return !!(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);
}

export async function sendEmail(to: string, subject: string, text: string, html?: string): Promise<{ sent: boolean }> {
  if (!isEmailConfigured()) {
    console.warn('[email] SMTP not configured — message not sent. Subject:', subject, '\n', text);
    return { sent: false };
  }
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  await transporter.sendMail({
    from: SMTP_FROM || SMTP_USER,
    to,
    subject,
    text,
    html: html || `<pre style="font-family:inherit">${text}</pre>`,
  });
  return { sent: true };
}

/** Fixed recipient for owner-confirmation codes (overridable via env). */
export const ADMIN_CONFIRM_EMAIL = process.env.ADMIN_CONFIRM_EMAIL || 'valdeslando15@gmail.com';
