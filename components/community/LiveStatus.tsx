// components/community/LiveStatus.tsx
"use client";

import { useLiveStatus } from "@/contexts/LiveStatusContext";
import { SOCIAL_LINKS } from "@/lib/data/constants";
import { Tv, AlertCircle } from "lucide-react";

const LiveStatus = () => {
  const { liveStatus } = useLiveStatus();
  const { isLive, streamTitle, gameName, isLoading, error } = liveStatus;

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border border-neutral-800/50 rounded-2xl p-8 mb-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-700/50 rounded-lg w-1/2 mx-auto"></div>
          <div className="h-6 bg-neutral-700/50 rounded-lg w-3/4 mx-auto"></div>
          <div className="h-12 bg-neutral-700/50 rounded-full w-64 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border border-neutral-800/50 rounded-2xl p-8 mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl blur-xl opacity-50"></div>
        <div className="relative text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-neutral-400" />
            <h2 className="text-3xl font-bold text-white">Stream Status</h2>
          </div>
          <p className="text-neutral-400 text-lg mb-6">
            Unable to load stream status. Check back later!
          </p>
          <a
            href={SOCIAL_LINKS.TWITCH}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 text-purple-400 border-2 border-purple-500/50 hover:border-purple-500/70 font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <Tv className="w-5 h-5" />
            <span className="text-lg">Visit Twitch Channel</span>
          </a>
        </div>
      </div>
    );
  }

  if (isLive) {
    return (
      <div className="relative bg-gradient-to-br from-purple-900/20 to-neutral-950/50 border-2 border-purple-500/70 rounded-2xl p-8 mb-12 shadow-lg shadow-purple-500/30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl blur-xl"></div>
        <div className="relative text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Tv className="w-8 h-8 text-purple-400" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </div>
            <h2 className="text-3xl font-bold text-white">LIVE NOW</h2>
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              LIVE
            </span>
          </div>
          <p className="text-white/90 text-xl mb-2 font-semibold">
            {streamTitle}
          </p>
          {gameName && (
            <p className="text-purple-300 text-sm mb-6 font-medium">
              Playing: {gameName}
            </p>
          )}

          <a
            href={SOCIAL_LINKS.TWITCH}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border-2 border-purple-500/70 font-bold px-10 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 animate-pulse-slow"
          >
            <Tv className="w-6 h-6" />
            <span className="text-lg">Watch Stream Now</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border border-neutral-800/50 rounded-2xl p-8 mb-12">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Tv className="w-6 h-6 text-neutral-400" />
          <h2 className="text-3xl font-bold text-white">Stream Offline</h2>
        </div>
        <p className="text-neutral-400 text-lg mb-6">
          Not streaming right now, but follow to get notified when I go live!
        </p>
        <a
          href={SOCIAL_LINKS.TWITCH}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 text-purple-400 border-2 border-purple-500/50 hover:border-purple-500/70 font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
        >
          <Tv className="w-5 h-5" />
          <span className="text-lg">Follow for Notifications</span>
        </a>
      </div>
    </div>
  );
};

export default LiveStatus;
