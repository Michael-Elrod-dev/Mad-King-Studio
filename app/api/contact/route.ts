// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateContactForm } from "@/lib";
import { contactLimiter, getClientIP } from "@/lib/middleware/rateLimit";
import { HTTP_STATUS, MESSAGES } from "@/lib/data/constants";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    if (!contactLimiter(ip)) {
      return NextResponse.json(
        { error: MESSAGES.ERROR.RATE_LIMIT },
        { status: HTTP_STATUS.TOO_MANY_REQUESTS },
      );
    }

    const body: ContactFormData = await request.json();
    const validation = validateContactForm(body);

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: HTTP_STATUS.BAD_REQUEST },
      );
    }

    return NextResponse.json(
      {
        message: MESSAGES.SUCCESS.FORM_SUBMITTED,
        data: {
          name: body.name,
          email: body.email,
          subject: body.subject,
          timestamp: new Date().toISOString(),
        },
      },
      { status: HTTP_STATUS.OK },
    );
  } catch (error) {
    console.error("Contact form validation error:", error);
    return NextResponse.json(
      { error: "Invalid form data" },
      { status: HTTP_STATUS.BAD_REQUEST },
    );
  }
}
