import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export const sendMail = async ({ to, subject, html, attachments = [] }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP is not configured. Email skipped.");
    return;
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME || "SmartSend AI"}" <${process.env.MAIL_FROM_EMAIL}>`,
    to,
    subject,
    html,
    attachments
  });
};