import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASSWORD;
const from = process.env.SMTP_FROM || user;
const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: {
    user,
    pass,
  },
});

export async function sendMail({
  subject,
  text,
  html,
  to,
}: {
  subject: string;
  text: string;
  html?: string;
  to?: string;
}) {
  if (!transporter) {
    throw new Error('Transporte de correo no está configurado.');
  }

  if (!host || !port || !user || !pass || !from || !adminEmail) {
    throw new Error('Configuración de correo incompleta. Revisa las variables de entorno SMTP.');
  }

  const mailOptions = {
    from,
    to: to || adminEmail,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
}
