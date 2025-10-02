// app/api/blog/route.ts
import { NextRequest, NextResponse } from "next/server";
import { blogsLimiter, getClientIP } from "@/lib/rateLimit";
import { API_LINKS, POLLING_INTERVALS, HTTP_STATUS } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);

  if (!blogsLimiter(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: HTTP_STATUS.TOO_MANY_REQUESTS },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");

    const response = await fetch(`${API_LINKS.S3_CACHE_URL}/blogs.json`, {
      next: { revalidate: POLLING_INTERVALS.BLOG_POSTS },
    });

    if (!response.ok) {
      throw new Error(`S3 fetch failed: ${response.status}`);
    }

    const processedBlogs = await response.json();

    const filteredBlogs = gameId
      ? processedBlogs.filter(
          (blog: { gameId: string }) => blog.gameId === gameId,
        )
      : processedBlogs;

    return NextResponse.json({
      blogs: filteredBlogs,
      count: filteredBlogs.length,
      cached: true,
      source: "s3",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Blog API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts from cache" },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    );
  }
}
