// app/api/docs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { docsLimiter, getClientIP } from "@/lib/middleware/rateLimit";
import {
  API_LINKS,
  POLLING_INTERVALS,
  HTTP_STATUS,
} from "@/lib/data/constants";

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);

  if (!docsLimiter(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: HTTP_STATUS.TOO_MANY_REQUESTS },
    );
  }

  try {
    const response = await fetch(`${API_LINKS.S3_CACHE_URL}/docs-tree.json`, {
      next: { revalidate: POLLING_INTERVALS.DOCS_TREE },
    });

    if (!response.ok) {
      throw new Error(`S3 fetch failed: ${response.status}`);
    }

    const tree = await response.json();

    return NextResponse.json({
      tree,
      cached: true,
      source: "s3",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Docs API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch documentation structure from cache" },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    );
  }
}
