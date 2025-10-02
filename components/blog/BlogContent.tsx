// components/blog/BlogContent.tsx
"use client";

import { useState } from "react";
import { GameData } from "@/lib/gameData";
import BlogList from "./BlogList";
import { BLOG_FILTERS } from "@/lib/constants";

interface BlogContentProps {
  games: GameData[];
  selectedIndex: number;
}

type FilterType = (typeof BLOG_FILTERS)[keyof typeof BLOG_FILTERS];

const BlogContent = ({ games, selectedIndex }: BlogContentProps) => {
  const [filter, setFilter] = useState<FilterType>(BLOG_FILTERS.ALL);

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
      >
        {games.map((game, index) => (
          <div key={game.id} className="w-full flex-shrink-0 px-6 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  {game.title} Development
                </h1>
                <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
                  Follow the development journey through detailed logs and patch
                  notes.
                </p>

                {/* Filter Dropdown */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as FilterType)}
                      className="appearance-none bg-neutral-800 border border-neutral-600 text-white px-6 py-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent cursor-pointer hover:bg-neutral-700 transition-colors"
                    >
                      <option value={BLOG_FILTERS.ALL}>All Posts</option>
                      <option value={BLOG_FILTERS.DEVLOG}>Dev Logs</option>
                      <option value={BLOG_FILTERS.PATCH_NOTE}>
                        Patch Notes
                      </option>
                    </select>

                    {/* Custom dropdown arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-white/70"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Show combined blog posts for this game */}
              <BlogList gameId={game.id} filter={filter} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogContent;
