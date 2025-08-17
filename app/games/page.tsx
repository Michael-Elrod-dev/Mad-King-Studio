"use client";

import { useState } from "react";
import FloatingNav from "@/components/layout/FloatingNav";
import GameSelector from "@/components/games/GameSelector";
import GameContent from "@/components/games/GameContent";
import { games } from "@/lib/gameData";

export default function GamesPage() {
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);

  return (
    <div className="min-h-screen pb-12">
      <FloatingNav />
      <GameSelector
        games={games}
        selectedIndex={selectedGameIndex}
        onGameSelect={setSelectedGameIndex}
      />
      <GameContent games={games} selectedIndex={selectedGameIndex} />
    </div>
  );
}
