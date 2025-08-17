// components/blog/PatchNoteList.tsx
"use client";

import { useState } from "react";
import PatchNoteCard from "./PatchNoteCard";

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

const mockPatchNotes: PatchNote[] = [
  // Empty array for now - when you have real patch notes, add them here
];

const POSTS_PER_PAGE = 5;

const PatchNotesList = () => {
  const [visiblePosts, setVisiblePosts] = useState(POSTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);

    // Simulate loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    setVisiblePosts((prev) =>
      Math.min(prev + POSTS_PER_PAGE, mockPatchNotes.length)
    );
    setIsLoadingMore(false);
  };

  const hasMorePosts = visiblePosts < mockPatchNotes.length;
  const displayedPosts = mockPatchNotes.slice(0, visiblePosts);

  // Empty state (current situation)
  if (mockPatchNotes.length === 0) {
    return (
      <div className="bg-neutral-800 rounded-lg p-8 text-center">
        <h3 className="text-white font-semibold mb-2">No Patch Notes Yet</h3>
        <p className="text-white/70 mb-4">
          Patch notes will appear here once the game is released. Stay tuned for
          updates on bug fixes, new features, and improvements!
        </p>
        <div className="text-neutral-500 text-sm mb-4">
          Follow development progress in the Dev Logs tab while you wait for the
          first release.
        </div>
        <a
          href="#" // Replace with actual Steam page when available
          target="_blank"
          rel="noopener noreferrer"
          className="border border-blue-500 hover:border-blue-400 hover:bg-blue-400 hover:text-white/90 text-blue-500 font-semibold py-3 px-8 rounded-full transition-colors duration-200 text-lg backdrop-blur-sm inline-flex items-center justify-center"
        >
          Wishlist on Steam
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Posts List */}
      {displayedPosts.map((patchNote) => (
        <PatchNoteCard key={patchNote.id} patchNote={patchNote} />
      ))}

      {/* Load More Button */}
      {hasMorePosts && (
        <div className="text-center pt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="border border-red-500 hover:border-red-600 hover:bg-red-500 text-red-500 hover:text-white/90 disabled:bg-red-300 disabled:text-white/90 disabled:cursor-not-allowed font-semibold py-3 px-8 rounded-full transition-colors flex items-center justify-center mx-auto"
          >
            {isLoadingMore ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : (
              `Load More Updates (${Math.min(
                POSTS_PER_PAGE,
                mockPatchNotes.length - visiblePosts
              )} more)`
            )}
          </button>
        </div>
      )}

      {/* End of Posts Message */}
      {!hasMorePosts && mockPatchNotes.length > POSTS_PER_PAGE && (
        <div className="text-center pt-8">
          <p className="text-neutral-400 text-sm">
            You&apos;ve reached the end. All {mockPatchNotes.length} patch notes
            are now visible.
          </p>
        </div>
      )}

      {/* Posts Counter */}
      {mockPatchNotes.length > 0 && (
        <div className="text-center pt-4">
          <p className="text-neutral-500 text-sm">
            Showing {visiblePosts} of {mockPatchNotes.length} patch notes
          </p>
        </div>
      )}
    </div>
  );
};

export default PatchNotesList;
