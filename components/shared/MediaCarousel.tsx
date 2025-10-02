// components/shared/MediaCarousel.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { getMediaType } from "@/lib/utils";

interface MediaCarouselProps {
  assets: string[];
  showPlaceholder?: boolean;
  placeholderText?: string;
  className?: string;
}

const MediaCarousel = ({
  assets,
  showPlaceholder = false,
  placeholderText = "Media Placeholder",
  className = "",
}: MediaCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {},
  );

  // Show placeholder if no assets and showPlaceholder is true
  if ((!assets || assets.length === 0) && showPlaceholder) {
    return (
      <div
        className={`bg-neutral-900 rounded-lg aspect-video flex items-center justify-center ${className}`}
      >
        <span className="text-white/70 text-lg">{placeholderText}</span>
      </div>
    );
  }

  // Don't render anything if no assets and no placeholder
  if (!assets || assets.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % assets.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + assets.length) % assets.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageError = (asset: string) => {
    setImageErrors((prev) => ({ ...prev, [asset]: true }));
  };

  const getMediaTypeLabel = (asset: string) => {
    const type = getMediaType(asset);
    switch (type) {
      case "video":
        return (
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Video
          </div>
        );
      case "gif":
        return (
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
            GIF
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
            Image
          </div>
        );
    }
  };

  return (
    <div
      className={`relative bg-neutral-900 rounded-lg overflow-hidden ${className}`}
    >
      {/* Main Media Display */}
      <div className="relative aspect-video">
        {assets.map((asset, index) => (
          <div
            key={asset}
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            {getMediaType(asset) === "video" ? (
              <video
                className="w-full h-full object-cover"
                controls
                muted
                playsInline
                preload="metadata"
                poster=""
              >
                <source src={asset} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <>
                {!imageErrors[asset] ? (
                  <Image
                    src={asset}
                    alt={`Media ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    priority={index === 0}
                    onError={() => handleImageError(asset)}
                    unoptimized={getMediaType(asset) === "gif"}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-white/60">
                    <div className="text-center">
                      <svg
                        className="w-12 h-12 mx-auto mb-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                      </svg>
                      <p className="text-sm">Media failed to load</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        {/* Navigation Arrows - Only show if more than 1 asset */}
        {assets.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm z-10"
              aria-label="Previous media"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm z-10"
              aria-label="Next media"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </button>
          </>
        )}

        {/* Media Type Indicator */}
        <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-10">
          {getMediaTypeLabel(assets[currentIndex])}
        </div>

        {/* Counter */}
        {assets.length > 1 && (
          <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-10">
            {currentIndex + 1} / {assets.length}
          </div>
        )}
      </div>

      {/* Dots Indicators - Only show if more than 1 asset */}
      {assets.length > 1 && (
        <div className="flex justify-center gap-2 p-4 bg-neutral-950">
          {assets.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex
                  ? "bg-red-500"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to media ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaCarousel;
