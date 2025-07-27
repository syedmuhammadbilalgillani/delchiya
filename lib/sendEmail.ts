// utils/sendEmail.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey', // literally the string "apikey"
    pass: process.env.SENDGRID_API_KEY!,
  },
});

/**
 * Send an email using SendGrid via Nodemailer
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  await transporter.sendMail({
    from: `"Villa Booking" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
}
