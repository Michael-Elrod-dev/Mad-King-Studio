// components/HeroSection.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLiveStatus } from "@/contexts/LiveStatusContext";
import { SOCIAL_LINKS } from "@/lib/constants";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { liveStatus } = useLiveStatus();
  const { isLive, isLoading } = liveStatus;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="hero-bg min-h-screen flex items-center justify-center relative">
      {/* Hero Content */}
      <div
        className={`text-center text-white transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold leading-tight">
            <span className="text-transparent bg-clip-text bg-red-600">
              MAD KING
            </span>
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold leading-none -mt-2">
            <span className="text-transparent bg-clip-text bg-white/90">
              STUDIO
            </span>
          </h2>
        </div>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          An indie game developer building games, sharing the entire development
          journey with the community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/games"
            className="border border-red-500 hover:border-red-500 hover:bg-red-500 text-red-500 hover:text-white/90 font-semibold py-3 px-8 rounded-full transition-colors duration-200 text-lg inline-block"
          >
            My Games
          </Link>

          {isLive && !isLoading ? (
            <a
              href={SOCIAL_LINKS.TWITCH}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-purple-600 text-purple-600 hover:text-purple-500 font-semibold py-3 px-8 rounded-full transition-all duration-200 text-lg backdrop-blur-sm inline-block"
              style={{
                animation:
                  "pulse-purple 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            >
              Watch Live Dev
            </a>
          ) : (
            <a
              href={SOCIAL_LINKS.TWITCH}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-purple-500 hover:border-purple-500 hover:bg-purple-500 text-purple-500 hover:text-white/90 font-semibold py-3 px-8 rounded-full transition-colors duration-200 text-lg inline-block"
            >
              Watch Live Dev
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
