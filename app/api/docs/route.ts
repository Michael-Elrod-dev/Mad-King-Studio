// app/api/docs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIP } from "@/lib/rateLimit";
import { API_LINKS } from "@/lib/constants";

const docsLimiter = rateLimit(20, 60 * 1000);

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);

  if (!docsLimiter(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  try {
    const response = await fetch(`${API_LINKS.S3_CACHE_URL}/docs-tree.json`, {
      next: { revalidate: 1800 },
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
      { status: 500 },
    );
  }
}
