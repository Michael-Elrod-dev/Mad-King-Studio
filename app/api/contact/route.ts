// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateEmail } from "@/lib/utils";
import emailjs from "@emailjs/browser";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// EmailJS configuration (server-side only)
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate the form data
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!validateEmail(body.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Send email via EmailJS (server-side)
    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
      try {
        // Initialize EmailJS
        emailjs.init(EMAILJS_PUBLIC_KEY);

        // Prepare template parameters
        const templateParams = {
          from_name: body.name,
          from_email: body.email,
          subject: body.subject,
          message: body.message,
          to_email: "michaelelrod.dev@gmail.com",
          reply_to: body.email,
        };

        // Send email
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams
        );

        return NextResponse.json(
          {
            message: "Message sent successfully",
            data: {
              name: body.name,
              email: body.email,
              subject: body.subject,
              timestamp: new Date().toISOString(),
            },
          },
          { status: 200 }
        );
      } catch (emailError) {
        console.error("EmailJS error:", emailError);
        return NextResponse.json(
          { error: "Failed to send email" },
          { status: 500 }
        );
      }
    } else {
      // EmailJS not configured
      return NextResponse.json(
        {
          message: "Form submitted successfully (email not configured)",
          data: {
            name: body.name,
            email: body.email,
            subject: body.subject,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
