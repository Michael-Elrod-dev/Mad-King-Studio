// app/api/blog/route.ts
import { NextRequest, NextResponse } from "next/server";
import { blogsLimiter, getClientIP } from "@/lib/middleware/rateLimit";
import {
  API_LINKS,
  POLLING_INTERVALS,
  HTTP_STATUS,
} from "@/lib/data/constants";

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
    const page = parseInt(searchParams.get("page") || "1");
    const filter = searchParams.get("filter") || "all";

    // Validate inputs
    if (page < 1) {
      return NextResponse.json(
        { error: "Invalid page number" },
        { status: HTTP_STATUS.BAD_REQUEST },
      );
    }

    if (!["all", "devlog", "patch-note"].includes(filter)) {
      return NextResponse.json(
        { error: "Invalid filter type" },
        { status: HTTP_STATUS.BAD_REQUEST },
      );
    }

    if (!gameId) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: HTTP_STATUS.BAD_REQUEST },
      );
    }

    // Fetch the page metadata (just IDs and pagination info)
    const pageMetadataResponse = await fetch(
      `${API_LINKS.S3_CACHE_URL}/blogs/pages/${gameId}/${filter}/page-${page}.json`,
      { next: { revalidate: POLLING_INTERVALS.BLOG_POSTS } },
    );

    if (!pageMetadataResponse.ok) {
      if (pageMetadataResponse.status === 404) {
        // Page doesn't exist - return empty results
        return NextResponse.json({
          blogs: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalPosts: 0,
            hasMore: false,
            postsPerPage: 5,
          },
          cached: true,
          source: "s3",
          timestamp: new Date().toISOString(),
        });
      }
      throw new Error(
        `Failed to fetch page metadata: ${pageMetadataResponse.status}`,
      );
    }

    const pageMetadata = await pageMetadataResponse.json();

    // Fetch full content for each blog ID on this page
    const fullBlogs = await Promise.all(
      pageMetadata.blogs.map(async (blogId: string) => {
        const blogResponse = await fetch(
          `${API_LINKS.S3_CACHE_URL}/blogs/${blogId}.json`,
          { next: { revalidate: POLLING_INTERVALS.BLOG_POSTS } },
        );

        if (!blogResponse.ok) {
          console.error(`Failed to fetch blog ${blogId}`);
          return null;
        }

        return blogResponse.json();
      }),
    );

    // Filter out any failed fetches
    const validBlogs = fullBlogs.filter((blog) => blog !== null);

    return NextResponse.json({
      blogs: validBlogs,
      pagination: pageMetadata.pagination,
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
