// app/api/twitch/stream/route.ts
import { NextResponse } from "next/server";
import { getTwitchStreamInfoServer } from "@/lib/twitch";

export async function GET() {
  try {
    const streamInfo = await getTwitchStreamInfoServer();

    return NextResponse.json(streamInfo, {
      headers: {
        "Cache-Control": "public, max-age=1800", // Cache for 30 minute
      },
    });
  } catch (error) {
    console.error("Twitch API route error:", error);

    // Return fallback data instead of error
    return NextResponse.json({
      isLive: false,
      streamTitle: "",
      gameName: "",
      startedAt: null,
    });
  }
}
