// components/blog/BlogContent.tsx
"use client";

import { useState } from "react";
import { GameData } from "@/lib/data/game";
import BlogList from "./BlogList";
import { Filter } from "lucide-react";
import { BLOG_FILTERS } from "@/lib/data/constants";

interface BlogContentProps {
  games: GameData[];
  selectedIndex: number;
}

type FilterType = (typeof BLOG_FILTERS)[keyof typeof BLOG_FILTERS];

const BlogContent = ({ games, selectedIndex }: BlogContentProps) => {
  const [filter, setFilter] = useState<FilterType>(BLOG_FILTERS.ALL);

  const filterOptions = [
    { value: BLOG_FILTERS.ALL, label: "All Posts", color: "text-neutral-400" },
    { value: BLOG_FILTERS.DEVLOG, label: "Dev Logs", color: "text-red-400" },
    {
      value: BLOG_FILTERS.PATCH_NOTE,
      label: "Patch Notes",
      color: "text-blue-400",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
      >
        {games.map((game) => (
          <div key={game.id} className="w-full flex-shrink-0 px-6 py-12">
            <div className="max-w-4xl mx-auto">
              {/* Header section */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">
                  {game.title}
                </h1>
                <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                  Follow the development journey through detailed logs, updates,
                  and patch notes.
                </p>
              </div>

              {/* Filter tabs */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
                    Filter by type
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilter(option.value as FilterType)}
                      className={`relative px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                        filter === option.value
                          ? option.value === BLOG_FILTERS.PATCH_NOTE
                            ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-2 border-blue-500/50 text-blue-400 shadow-lg shadow-blue-500/20"
                            : option.value === BLOG_FILTERS.DEVLOG
                              ? "bg-gradient-to-r from-red-500/20 to-red-600/20 border-2 border-red-500/50 text-red-400 shadow-lg shadow-red-500/20"
                              : "bg-gradient-to-r from-neutral-700/30 to-neutral-800/30 border-2 border-neutral-600/50 text-white shadow-lg shadow-neutral-500/10"
                          : "bg-neutral-900/50 border-2 border-neutral-800/50 text-neutral-400 hover:border-neutral-700 hover:text-neutral-300"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent mb-10"></div>

              {/* Blog list */}
              <BlogList gameId={game.id} filter={filter} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogContent;
