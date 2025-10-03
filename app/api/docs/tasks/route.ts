// app/api/docs/tasks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { tasksLimiter, getClientIP } from "@/lib/middleware/rateLimit";
import {
  API_LINKS,
  POLLING_INTERVALS,
  HTTP_STATUS,
} from "@/lib/data/constants";

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);

  if (!tasksLimiter(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: HTTP_STATUS.TOO_MANY_REQUESTS },
    );
  }

  try {
    const response = await fetch(`${API_LINKS.S3_CACHE_URL}/tasks.json`, {
      next: { revalidate: POLLING_INTERVALS.TASKS },
    });

    if (!response.ok) {
      throw new Error(`S3 fetch failed: ${response.status}`);
    }

    const tasks = await response.json();

    return NextResponse.json({
      tasks,
      count: tasks.length,
      cached: true,
      source: "s3",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Tasks API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks from cache" },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    );
  }
}
