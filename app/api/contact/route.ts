// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateContactForm } from "@/lib/utils";
import { rateLimit, getClientIP } from "@/lib/rateLimit";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// 3 submissions per 15 minutes
const contactLimiter = rateLimit(3, 15 * 60 * 1000);

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    if (!contactLimiter(ip)) {
      return NextResponse.json(
        {
          error:
            "Too many contact form submissions. Please try again in 15 minutes.",
        },
        { status: 429 },
      );
    }

    const body: ContactFormData = await request.json();
    const validation = validateContactForm(body);

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: "Form validated successfully",
        data: {
          name: body.name,
          email: body.email,
          subject: body.subject,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form validation error:", error);
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }
}
