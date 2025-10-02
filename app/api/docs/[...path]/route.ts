// app/api/docs/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIP } from "@/lib/rateLimit";
import { API_LINKS } from "@/lib/constants";

// 20 requests per minute
const docContentLimiter = rateLimit(20, 60 * 1000);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const ip = getClientIP(request);

  if (!docContentLimiter(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  try {
    const { path } = await params;

    if (!path || path.length === 0) {
      return NextResponse.json(
        { error: "Invalid document path" },
        { status: 400 },
      );
    }

    const slugStr = path.join("/");

    // Fetch from S3 cache instead of GitHub
    const response = await fetch(
      `${API_LINKS.S3_CACHE_URL}/docs/${slugStr}.json`,
      { next: { revalidate: 1800 } }, // 30 minute cache
    );

    if (!response.ok) {
      console.error("Document not found in S3 cache. Slug:", slugStr);
      return NextResponse.json(
        { error: "Document not found", slug: slugStr },
        { status: 404 },
      );
    }

    const docData = await response.json();

    return NextResponse.json({
      content: docData.content,
      path: docData.path,
      sha: docData.sha,
    });
  } catch (error) {
    console.error("Doc content API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch document content" },
      { status: 500 },
    );
  }
}
