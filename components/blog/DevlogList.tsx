// components/blog/DevlogList.tsx
"use client";

import { useState, useEffect } from "react";
import DevlogCard from "./DevlogCard";
import { fetchDevLogs, processDevLogs, ProcessedDevLog } from "@/lib/github";

const POSTS_PER_PAGE = 5;

const DevlogList = () => {
  const [devLogs, setDevLogs] = useState<ProcessedDevLog[]>([]);
  const [visiblePosts, setVisiblePosts] = useState(POSTS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch dev logs on component mount
  useEffect(() => {
    const loadDevLogs = async () => {
      try {
        setIsLoading(true);
        const rawLogs = await fetchDevLogs();
        const processedLogs = await processDevLogs(rawLogs);
        setDevLogs(processedLogs);
        setError(null);
      } catch (err) {
        console.error("Error loading dev logs:", err);
        setError("Failed to load development logs");
      } finally {
        setIsLoading(false);
      }
    };

    loadDevLogs();
  }, []);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);

    // Simulate loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    setVisiblePosts((prev) => Math.min(prev + POSTS_PER_PAGE, devLogs.length));
    setIsLoadingMore(false);
  };

  const hasMorePosts = visiblePosts < devLogs.length;
  const displayedPosts = devLogs.slice(0, visiblePosts);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-neutral-800 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-neutral-700 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-neutral-700 rounded w-full mb-2"></div>
            <div className="h-3 bg-neutral-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-center">
        <h3 className="text-red-400 font-semibold mb-2">
          Error Loading Dev Logs
        </h3>
        <p className="text-red-300 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-500 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (devLogs.length === 0) {
    return (
      <div className="bg-neutral-800 rounded-lg p-8 text-center">
        <h3 className="text-white font-semibold mb-2">No Dev Logs Yet</h3>
        <p className="text-neutral-50 mb-4">
          Development logs will appear here as they&apos;re added to the GitHub
          repository.
        </p>
        <a
          href="https://github.com/Michael-Elrod-dev/Path-to-Valhalla/tree/main/docs/00-Development%20Logs/Logs"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-white/90 hover:bg-white/70 text-white/90 hover:text-white/90 font-semibold py-3 px-8 rounded-full transition-colors inline-flex items-center justify-center"
        >
          View on GitHub →
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Posts List */}
      {displayedPosts.map((post) => (
        <DevlogCard key={post.id} post={post} isGitHubPost={true} />
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
              `Load More Posts (${Math.min(
                POSTS_PER_PAGE,
                devLogs.length - visiblePosts
              )} more)`
            )}
          </button>
        </div>
      )}

      {/* End of Posts Message */}
      {!hasMorePosts && devLogs.length > POSTS_PER_PAGE && (
        <div className="text-center pt-8">
          <p className="text-neutral-400 text-sm">
            You&apos;ve reached the end. All {devLogs.length} development logs
            are now visible.
          </p>
        </div>
      )}

      {/* Posts Counter */}
      <div className="text-center pt-4">
        <p className="text-neutral-500 text-sm">
          Showing {visiblePosts} of {devLogs.length} development logs
        </p>
      </div>
    </div>
  );
};

export default DevlogList;
