// components/community/LiveStatus.tsx
"use client";

import { useLiveStatus } from "@/contexts/LiveStatusContext";

const LiveStatus = () => {
  const { liveStatus } = useLiveStatus();
  const { isLive, streamTitle, gameName, isLoading, error } = liveStatus;

  if (isLoading) {
    return (
      <div className="bg-neutral-800 rounded-lg p-6 mb-12 text-center">
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-700 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-neutral-700 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral-800 rounded-lg p-6 mb-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Stream Status</h2>
        <p className="text-neutral-400 mb-6">
          Unable to load stream status. Check back later!
        </p>
        <a
          href="https://twitch.tv/aimosthadme"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
        >
          Visit Twitch Channel
        </a>
      </div>
    );
  }

  if (isLive) {
    return (
      <div className="bg-neutral-800 rounded-lg p-6 mb-12 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse mr-3"></div>
          <h2 className="text-2xl font-bold text-white">LIVE NOW</h2>
        </div>
        <p className="text-white/90 text-lg mb-2">{streamTitle}</p>
        {gameName && (
          <p className="text-white/90 text-sm mb-4">Playing: {gameName}</p>
        )}

        {/* Purple pulsing button when live */}
        <a
          href="https://twitch.tv/aimosthadme"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border-2 border-purple-600 text-purple-600 font-bold py-3 px-8 rounded-full transition-all duration-1000 hover:bg-purple-600 hover:text-white text-lg"
          style={{
            animation: "pulse-purple 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        >
          Watch Stream Now
        </a>
      </div>
    );
  }

  return (
    <div className="bg-neutral-800 rounded-lg p-6 mb-12 text-center">
      <h2 className="text-2xl font-bold text-white mb-4">Stream Offline</h2>
      <a
        href="https://twitch.tv/aimosthadme"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-8 rounded-full transition-colors"
      >
        Follow for Notifications
      </a>
    </div>
  );
};

export default LiveStatus;
