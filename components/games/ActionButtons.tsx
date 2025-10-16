// components/games/ActionButtons.tsx
"use client";

import { GameData } from "@/lib/data/game";
import { useLiveStatus } from "@/contexts/LiveStatusContext";
import { SOCIAL_LINKS, STEAM_BUTTON_TEXT } from "@/lib/data/constants";
import { Tv, Gamepad2 } from "lucide-react";

interface ActionButtonsProps {
  game: GameData;
}

const ActionButtons = ({ game }: ActionButtonsProps) => {
  const { liveStatus } = useLiveStatus();
  const { isLive, isLoading } = liveStatus;

  const getSteamButtonText = (status: string) => {
    return (
      STEAM_BUTTON_TEXT[status as keyof typeof STEAM_BUTTON_TEXT] ||
      "View on Steam"
    );
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {game.steamUrl && (
        <a
          href={game.steamUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 text-blue-400 border-2 border-blue-500/50 hover:border-blue-500/70 font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
        >
          <Gamepad2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-lg">{getSteamButtonText(game.status)}</span>
        </a>
      )}

      {isLive && !isLoading ? (
        <a
          href={SOCIAL_LINKS.TWITCH}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border-2 border-purple-500/70 font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg shadow-purple-500/30 animate-pulse-slow"
        >
          <div className="relative">
            <Tv className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </div>
          <span className="text-lg">Watch Dev Live</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            LIVE
          </span>
        </a>
      ) : (
        <a
          href={SOCIAL_LINKS.TWITCH}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 text-purple-400 border-2 border-purple-500/50 hover:border-purple-500/70 font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
        >
          <Tv className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-lg">Watch on Twitch</span>
        </a>
      )}
    </div>
  );
};

export default ActionButtons;
