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
      { status: 429 }
    );
  }

  // MOCK DATA FOR TESTING
  const MOCK_LIVE = false;

  if (MOCK_LIVE) {
    const mockData = {
      isLive: true,
      streamTitle: "Building Path to Valhalla - Live Game Development!",
      gameName: "Software and Game Development",
      startedAt: new Date().toISOString(),
    };

    return NextResponse.json(mockData, {
      headers: {
        // Cache for 30 seconds - shorter than our 1-minute fetch interval
        // This ensures we get fresh data but reduces redundant Twitch API calls
        "Cache-Control": "public, max-age=30",
        "X-Data-Source": "mock",
      },
    });
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
      }
    );
  }
}
