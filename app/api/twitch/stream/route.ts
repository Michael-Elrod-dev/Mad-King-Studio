// app/api/twitch/stream/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTwitchStreamInfoServer } from "@/lib/api/twitch";
import { twitchLimiter, getClientIP } from "@/lib/middleware/rateLimit";
import { HTTP_STATUS, CACHE_CONFIG } from "@/lib/data/constants";

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);

  if (!twitchLimiter(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: HTTP_STATUS.TOO_MANY_REQUESTS },
    );
  }

  try {
    const streamInfo = await getTwitchStreamInfoServer();

    return NextResponse.json(streamInfo, {
      headers: {
        "Cache-Control": CACHE_CONFIG.TWITCH_STATUS,
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
