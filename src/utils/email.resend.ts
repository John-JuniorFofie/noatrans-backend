import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  email,
  subject,
  text,
}: {
  email: string;
  subject: string;
  text: string;
}) => {
  try {
    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL || "onboarding@resend.dev",
      to: email,
      subject,
      text,
    });

    console.log("Email sent:", response);
    return response;
  } catch (error) {
    console.error("Resend email error:", error);
    throw new Error("Failed to send email");
  }
};


