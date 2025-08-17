// components/HeroSection.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

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
          An indie game developer building games in the open, sharing the entire
          development journey with the community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/games"
            className="bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 text-lg inline-block"
          >
            My Games →
          </Link>
          <a
            href="https://twitch.tv/aimosthadme"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/30 hover:border-purple-600 hover:text-purple-600 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 text-lg backdrop-blur-sm inline-block"
          >
            Watch Live Dev
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
