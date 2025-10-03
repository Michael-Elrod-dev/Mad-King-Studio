// components/games/GameSelector.tsx
"use client";

import { GameData } from "@/lib/data/game";

interface GameSelectorProps {
  games: GameData[];
  selectedIndex: number;
  onGameSelect: (index: number) => void;
}

const GameSelector = ({
  games,
  selectedIndex,
  onGameSelect,
}: GameSelectorProps) => {
  return (
    <div className="bg-transparent">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-center space-x-8 overflow-x-auto">
          {games.map((game, index) => (
            <button
              key={game.id}
              onClick={() => onGameSelect(index)}
              className={`py-4 px-2 whitespace-nowrap text-sm font-medium border-b-2 transition-colors duration-200 ${
                selectedIndex === index
                  ? "text-red-500 border-red-500"
                  : "text-white/70 border-transparent hover:text-white hover:border-white/30"
              }`}
            >
              {game.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSelector;
