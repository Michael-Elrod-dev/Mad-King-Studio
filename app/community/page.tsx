// app/community/page.tsx
"use client";

import FloatingNav from "@/components/layout/FloatingNav";
import LiveStatus from "@/components/community/LiveStatus";
import { useLiveStatus } from "@/contexts/LiveStatusContext";
import { SOCIAL_LINKS } from "@/lib/constants";

export default function CommunityPage() {
  const { liveStatus } = useLiveStatus();
  const { isLive, isLoading } = liveStatus;

  return (
    <div className="min-h-screen pb-12">
      <FloatingNav />
      <div className="pt-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Community
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Join the community on Twitch. Watch live coding and be part of the development journey.
            </p>
          </div>

          <LiveStatus />

          {/* Community Links */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-purple-600 rounded-lg p-6 text-center transition-colors relative">
              <div className="flex justify-center mb-4 relative">
                {/* Live dot positioned on the icon itself */}
                <div className="relative">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                  </svg>
                  {/* Live indicator dot for Twitch card */}
                  {isLive && !isLoading && (
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Twitch Stream
              </h3>
              <p className="text-white/90 mb-4">
                Watch live game development and brainstorming
              </p>

              {/* Dynamic button based on live status */}
              {isLive && !isLoading ? (
                <a
                  href={SOCIAL_LINKS.TWITCH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/90 hover:border-purple-500 hover:bg-purple-500 text-white/90 hover:text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 text-lg inline-block"
                >
                  Watch Live Now
                </a>
              ) : (
                <a
                  href={SOCIAL_LINKS.TWITCH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/90 hover:border-purple-500 hover:bg-purple-500 text-white/90 hover:text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 text-lg inline-block"
                >
                  Follow on Twitch
                </a>
              )}
            </div>

            <div className="bg-indigo-600 rounded-lg p-6 text-center transition-colors">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-12 h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Discord Server
              </h3>
              <p className="text-white/90 mb-4">
                Chat with other community members and post memes
              </p>
              <a
                href={SOCIAL_LINKS.DISCORD}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/90 hover:border-indigo-500 hover:bg-indigo-500 text-white/90 hover:text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 text-lg inline-block"
              >
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
