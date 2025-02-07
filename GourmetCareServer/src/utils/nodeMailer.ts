import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "./.env" });

// Check if email credentials are set
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error("Email credentials are not set in the environment variables");
}

// Create transporter
const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendEmail(mailOptions: SendMailOptions): Promise<boolean> {
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}