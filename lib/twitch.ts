export interface TwitchStream {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  is_mature: boolean;
}

export interface TwitchStreamResponse {
  data: TwitchStream[];
  pagination?: {
    cursor?: string;
  };
}

const TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || '';
const TWITCH_USERNAME = 'aimosthadme'; // Your Twitch username

// Get App Access Token (for public API calls)
async function getTwitchAppToken(): Promise<string | null> {
  try {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET || '',
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) {
      throw new Error(`Token request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Twitch token:', error);
    return null;
  }
}

// Get stream information for a user
export async function getTwitchStreamInfo(): Promise<{
  isLive: boolean;
  streamTitle: string;
  gameName: string;
  startedAt: string | null;
} | null> {
  try {
    // For client-side calls, we'll use a Next.js API route
    const response = await fetch('/api/twitch/stream', {
      next: { revalidate: 60 } // Cache for 1 minute
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Twitch stream info:', error);
    return null;
  }
}

// Server-side function for API route
export async function getTwitchStreamInfoServer(): Promise<{
  isLive: boolean;
  streamTitle: string;
  gameName: string;
  startedAt: string | null;
}> {
  try {
    const token = await getTwitchAppToken();
    if (!token) {
      throw new Error('Failed to get Twitch token');
    }

    const response = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${TWITCH_USERNAME}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Client-Id': TWITCH_CLIENT_ID,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Twitch API error: ${response.status}`);
    }

    const data: TwitchStreamResponse = await response.json();
    const stream = data.data[0]; // Get first stream (should be only one for a user)

    return {
      isLive: !!stream,
      streamTitle: stream?.title || '',
      gameName: stream?.game_name || '',
      startedAt: stream?.started_at || null,
    };
  } catch (error) {
    console.error('Error fetching Twitch stream info:', error);
    // Return fallback data
    return {
      isLive: false,
      streamTitle: '',
      gameName: '',
      startedAt: null,
    };
  }
}

export const isTwitchConfigured = (): boolean => {
  return !!(TWITCH_CLIENT_ID && process.env.TWITCH_CLIENT_SECRET);
};