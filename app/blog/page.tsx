// app/blog/page.tsx
"use client";

import { useState } from "react";
import FloatingNav from "@/components/layout/FloatingNav";
import GameSelector from "@/components/games/GameSelector";
import BlogContent from "@/components/blog/BlogContent";
import { blogGames } from "@/lib/blogData";

export default function BlogPage() {
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);

  return (
    <div className="min-h-screen pb-12">
      <FloatingNav />
      <GameSelector
        games={blogGames}
        selectedIndex={selectedGameIndex}
        onGameSelect={setSelectedGameIndex}
      />
      <BlogContent
        games={blogGames}
        selectedIndex={selectedGameIndex}
      />
    </div>
  );
}
