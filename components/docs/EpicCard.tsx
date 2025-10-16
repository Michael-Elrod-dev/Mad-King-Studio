// components/docs/EpicCard.tsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface EpicCardProps {
  name: string;
  status: string;
  progress: number;
  completedTasks: number;
  totalTasks: number;
  slug: string;
}

const EpicCard = ({
  name,
  status,
  progress,
  completedTasks,
  totalTasks,
  slug,
}: EpicCardProps) => {
  // Determine status color
  const getStatusColor = (status: string) => {
    const lower = status.toLowerCase();
    if (lower.includes("done") || lower.includes("complete")) {
      return "bg-green-500/10 text-green-400 border-green-500/30";
    }
    if (lower.includes("progress") || lower.includes("active")) {
      return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
    return "bg-neutral-500/10 text-neutral-400 border-neutral-500/30";
  };

  // Determine progress bar color
  const getProgressColor = () => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Link href={`/docs/00-project-development/epics/${slug}`}>
      <div className="group relative bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-red-500 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 mb-2">
              {name}
            </h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                status,
              )}`}
            >
              {status}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-red-500 transition-colors flex-shrink-0 ml-2" />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Tasks:</span>
            <span className="text-white font-semibold">
              {completedTasks}/{totalTasks}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Progress:</span>
            <span className="text-white font-semibold">{progress}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-auto">
          <div className="w-full bg-neutral-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full ${getProgressColor()} transition-all duration-500 rounded-full`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Completion Badge */}
        {progress === 100 && (
          <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            COMPLETE
          </div>
        )}
      </div>
    </Link>
  );
};

export default EpicCard;
