// app/api/docs/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { docContentLimiter, getClientIP } from "@/lib/middleware/rateLimit";
import {
  API_LINKS,
  POLLING_INTERVALS,
  HTTP_STATUS,
} from "@/lib/data/constants";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const ip = getClientIP(request);

  if (!docContentLimiter(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: HTTP_STATUS.TOO_MANY_REQUESTS },
    );
  }

  try {
    const { path } = await params;

    if (!path || path.length === 0) {
      return NextResponse.json(
        { error: "Invalid document path" },
        { status: HTTP_STATUS.BAD_REQUEST },
      );
    }

    const slugStr = path.join("/");

    const response = await fetch(
      `${API_LINKS.S3_CACHE_URL}/docs/${slugStr}.json`,
      { next: { revalidate: POLLING_INTERVALS.DOC_CONTENT } },
    );

    if (!response.ok) {
      console.error("Document not found in S3 cache. Slug:", slugStr);
      return NextResponse.json(
        { error: "Document not found", slug: slugStr },
        { status: HTTP_STATUS.NOT_FOUND },
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
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    );
  }
}
