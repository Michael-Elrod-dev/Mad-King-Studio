// lib/emailjs.ts
import emailjs from '@emailjs/browser';
import { SOCIAL_LINKS } from "@/lib/constants";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

export interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const initEmailJS = () => {
  if (EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
};

export const sendContactEmail = async (data: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      throw new Error("EmailJS configuration is missing");
    }

    initEmailJS();

    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject,
      message: data.message,
      to_email: SOCIAL_LINKS.GMAIL,
      reply_to: data.email,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    return {
      success: true,
      message: "Email sent successfully"
    };
  } catch (error) {
    console.error("EmailJS error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send email"
    };
  }
};

export const isEmailJSConfigured = (): boolean => {
  return !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);
};
