// components/HeroSection.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLiveStatus } from "@/contexts/LiveStatusContext";
import { SOCIAL_LINKS } from "@/lib/data/constants";
import { Gamepad2, Tv } from "lucide-react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { liveStatus } = useLiveStatus();
  const { isLive, isLoading } = liveStatus;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="hero-bg min-h-screen flex items-center justify-center relative px-6">
      {/* Hero Content */}
      <div
        className={`text-center text-white transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
              MAD KING
            </span>
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold leading-none -mt-2">
            <span className="bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">
              STUDIO
            </span>
          </h2>
        </div>
        <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
          An indie game developer building games, sharing the entire development
          journey with the community.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            href="/games"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 text-red-400 border-2 border-red-500/50 hover:border-red-500/70 font-bold px-10 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 hover:scale-105"
          >
            <Gamepad2 className="w-5 h-5" />
            <span className="text-lg">My Games</span>
          </Link>

          {isLive && !isLoading ? (
            <a
              href={SOCIAL_LINKS.TWITCH}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border-2 border-purple-500/70 font-bold px-10 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 animate-pulse-slow"
            >
              <div className="relative">
                <Tv className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </div>
              <span className="text-lg">Watch Live Dev</span>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                LIVE
              </span>
            </a>
          ) : (
            <a
              href={SOCIAL_LINKS.TWITCH}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 text-purple-400 border-2 border-purple-500/50 hover:border-purple-500/70 font-bold px-10 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
            >
              <Tv className="w-5 h-5" />
              <span className="text-lg">Watch Live Dev</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
