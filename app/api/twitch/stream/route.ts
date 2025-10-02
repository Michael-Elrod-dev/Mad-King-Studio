// app/api/twitch/stream/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTwitchStreamInfoServer } from "@/lib/twitch";
import { rateLimit, getClientIP } from "@/lib/rateLimit";

// 10 requests per minute
const twitchLimiter = rateLimit(10, 60 * 1000);

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);

  if (!twitchLimiter(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  try {
    const streamInfo = await getTwitchStreamInfoServer();

    return NextResponse.json(streamInfo, {
      headers: {
        "Cache-Control": "public, max-age=30",
        "X-Data-Source": "twitch",
      },
    });
  } catch (error) {
    console.error("Twitch API route error:", error);
    return NextResponse.json(
      {
        isLive: false,
        streamTitle: "",
        gameName: "",
        startedAt: null,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=10",
          "X-Data-Source": "error",
        },
      },
    );
  }
}
