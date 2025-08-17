// app/api/twitch/stream/route.ts
import { NextResponse } from "next/server";
import { getTwitchStreamInfoServer } from "@/lib/twitch";

export async function GET() {
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
          "Cache-Control": "public, max-age=10", // Shorter cache for errors
          "X-Data-Source": "error",
        },
      }
    );
  }
}
