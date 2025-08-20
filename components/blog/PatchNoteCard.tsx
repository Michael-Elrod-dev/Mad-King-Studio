// components/blog/PatchNoteCard.tsx
"use client";

import { useState } from "react";
import {
  formatDate,
  getChangeTypeColor,
  getChangeTypeLabel,
} from "@/lib/utils";

interface PatchNote {
  id: string;
  version: string;
  title: string;
  date: string;
  steamUrl?: string;
  changes: {
    type: "feature" | "bugfix" | "improvement" | "balance";
    description: string;
  }[];
  summary?: string;
}

interface PatchNoteCardProps {
  patchNote: PatchNote;
}

const PatchNoteCard = ({ patchNote }: PatchNoteCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleChanges = isExpanded
    ? patchNote.changes
    : patchNote.changes.slice(0, 3);
  const hasMoreChanges = patchNote.changes.length > 3;

  return (
    <article className="bg-neutral-800 rounded-lg p-6">
      {/* Steam indicator with date */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-white/40"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.62 20.51 6.363 24 11.979 24c6.624 0 11.979-5.354 11.979-12C23.958 5.354 18.603.001 11.979 0z" />
          </svg>
          <span className="text-white/40 text-xs">Game Update</span>
        </div>
        <time dateTime={patchNote.date} className="text-white/40 text-xs">
          {formatDate(patchNote.date)}
        </time>
      </div>

      {/* Version and Title */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            v{patchNote.version}
          </span>
          <h2 className="text-2xl font-bold text-white">{patchNote.title}</h2>
        </div>

        {patchNote.summary && (
          <p className="text-white/90 leading-relaxed">{patchNote.summary}</p>
        )}
      </div>

      {/* Changes List */}
      <div className="space-y-3 mb-4">
        {visibleChanges.map((change, index) => (
          <div key={index} className="flex items-start gap-3">
            <span
              className={`text-xs font-bold px-2 py-1 rounded bg-neutral-950 ${getChangeTypeColor(
                change.type
              )}`}
            >
              {getChangeTypeLabel(change.type)}
            </span>
            <p className="text-white/90 leading-relaxed flex-1">
              {change.description}
            </p>
          </div>
        ))}
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between pt-3">
        {/* Show More/Less button - left side */}
        {hasMoreChanges && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-red-500 hover:text-red-400 font-medium transition-colors flex items-center"
          >
            {isExpanded ? (
              <>
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                </svg>
                Show Less
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                </svg>
                Show More ({patchNote.changes.length - 3} more changes)
              </>
            )}
          </button>
        )}

        {/* View on Steam button - right side */}
        {patchNote.steamUrl && (
          <a
            href={patchNote.steamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-medium transition-colors"
          >
            View on Steam
          </a>
        )}
      </div>
    </article>
  );
};

export default PatchNoteCard;
