// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateContactForm } from "@/lib/utils";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate the form data
    const validation = validateContactForm(body);
    
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 }
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
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form validation error:", error);
    return NextResponse.json(
      { error: "Invalid form data" },
      { status: 400 }
    );
  }
}
