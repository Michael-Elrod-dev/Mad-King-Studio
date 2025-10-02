// components/games/ActionButtons.tsx
"use client";

import { GameData } from "@/lib/gameData";
import { useLiveStatus } from "@/contexts/LiveStatusContext";
import { SOCIAL_LINKS } from "@/lib/constants";

interface ActionButtonsProps {
  game: GameData;
}

const ActionButtons = ({ game }: ActionButtonsProps) => {
  const { liveStatus } = useLiveStatus();
  const { isLive, isLoading } = liveStatus;

  const getSteamButtonText = (status: string) => {
    switch (status) {
      case "In Development":
        return "Wishlist on Steam";
      case "Early Access":
        return "Get Early Access";
      case "Released":
        return "Buy on Steam";
      default:
        return "View on Steam";
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {game.steamUrl && (
        <a
          href={game.steamUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-blue-600 hover:border-blue-500 hover:bg-blue-500 hover:text-white/90 text-blue-600 font-semibold py-3 px-8 rounded-full transition-colors duration-200 text-lg backdrop-blur-sm inline-flex items-center justify-center"
        >
          {getSteamButtonText(game.status)}
        </a>
      )}

      {/* Twitch button with hardcoded URL */}
      {isLive && !isLoading ? (
        <a
          href={SOCIAL_LINKS.TWITCH}
          target="_blank"
          rel="noopener noreferrer"
          className="border-2 border-purple-600 text-purple-600 hover:text-purple-500 font-semibold py-3 px-8 rounded-full transition-all duration-200 text-lg backdrop-blur-sm inline-block"
          style={{
            animation: "pulse-purple 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        >
          Watch Dev Live
        </a>
      ) : (
        <a
          href={SOCIAL_LINKS.TWITCH}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-purple-500 hover:border-purple-500 hover:bg-purple-500 text-purple-500 hover:text-white/90 font-semibold py-3 px-8 rounded-full transition-colors duration-200 text-lg inline-block"
        >
          Watch Dev Live
        </a>
      )}
    </div>
  );
};

export default ActionButtons;
