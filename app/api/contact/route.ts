import { NextRequest, NextResponse } from "next/server";

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
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Rate limiting check (basic implementation)
    // In production, you might want to use a more robust rate limiting solution
    const userAgent = request.headers.get("user-agent") || "";
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    // Here you could implement more sophisticated rate limiting
    // For now, we'll just log the submission
    console.log(
      `Contact form submission from IP: ${ip}, User-Agent: ${userAgent}`
    );

    // In a real application, you might want to:
    // 1. Save to database
    // 2. Send email notification
    // 3. Add to CRM system

    // For now, we'll just return success
    // The actual email sending will be handled by EmailJS on the client side

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
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
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
