// components/blog/BlogList.tsx
"use client";

import { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import {
  UI_CONFIG,
  BLOG_FILTERS,
  BLOG_TYPES,
  MESSAGES,
} from "@/lib/data/constants";

interface ProcessedBlog {
  id: string;
  title: string;
  date: string;
  dayNumber: number;
  excerpt: string;
  content: string;
  githubUrl: string;
  downloadUrl: string;
  type: "devlog" | "patch-note";
  gameId: string;
}

interface BlogListProps {
  gameId: string;
  filter: (typeof BLOG_FILTERS)[keyof typeof BLOG_FILTERS];
}

const BlogList = ({ gameId, filter }: BlogListProps) => {
  const [allBlogs, setAllBlogs] = useState<ProcessedBlog[]>([]);
  const [visiblePosts, setVisiblePosts] = useState<number>(
    UI_CONFIG.POSTS_PER_PAGE,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredBlogs = allBlogs.filter((blog) => {
    if (filter === BLOG_FILTERS.ALL) return true;
    return blog.type === filter;
  });

  useEffect(() => {
    setVisiblePosts(UI_CONFIG.POSTS_PER_PAGE);
  }, [filter]);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/blog?gameId=${gameId}`);

        if (!response.ok) {
          throw new Error(MESSAGES.ERROR.BLOG_LOAD_ERROR);
        }

        const data = await response.json();
        setAllBlogs(data.blogs);
        setError(null);
      } catch (err) {
        console.error("Error loading blog posts:", err);
        setError(MESSAGES.ERROR.BLOG_LOAD_ERROR);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogs();
  }, [gameId]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setVisiblePosts((prev) =>
      Math.min(prev + UI_CONFIG.POSTS_PER_PAGE, filteredBlogs.length),
    );
    setIsLoadingMore(false);
  };

  const hasMorePosts = visiblePosts < filteredBlogs.length;
  const displayedPosts = filteredBlogs.slice(0, visiblePosts);

  const totalDevLogCount = allBlogs.filter(
    (blog) => blog.type === BLOG_TYPES.DEVLOG,
  ).length;
  const totalPatchNoteCount = allBlogs.filter(
    (blog) => blog.type === BLOG_TYPES.PATCH_NOTE,
  ).length;
  const filteredCount = filteredBlogs.length;

  const getFilterText = () => {
    switch (filter) {
      case BLOG_FILTERS.DEVLOG:
        return "dev logs";
      case BLOG_FILTERS.PATCH_NOTE:
        return "patch notes";
      default:
        return "entries";
    }
  };

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

  if (error) {
    return (
      <div className="bg-red-600 border border-red-600 rounded-lg p-6 text-center">
        <h3 className="text-white/90 font-semibold mb-2">
          Error Loading Blog Posts
        </h3>
        <p className="text-white/90 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-500 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (allBlogs.length === 0) {
    return (
      <div className="bg-neutral-800 rounded-lg p-8 text-center">
        <h3 className="text-white font-semibold mb-2">No Blog Posts Yet</h3>
        <p className="text-neutral-50 mb-4">
          Blog posts will appear here as they&apos;re created for this game.
        </p>
      </div>
    );
  }

  if (filteredBlogs.length === 0) {
    return (
      <div className="bg-neutral-800 rounded-lg p-8 text-center">
        <h3 className="text-white font-semibold mb-2">
          No {getFilterText()} Found
        </h3>
        <p className="text-neutral-50 mb-4">
          No {getFilterText()} available for this game yet. Try changing the
          filter or check back later.
        </p>
        <div className="text-neutral-400 text-sm">
          Total available: {totalDevLogCount} dev logs, {totalPatchNoteCount}{" "}
          patch notes
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {displayedPosts.map((post) => (
        <BlogCard
          key={post.id}
          post={post}
          isGitHubPost={true}
          isPatchNote={post.type === BLOG_TYPES.PATCH_NOTE}
        />
      ))}

      {hasMorePosts && (
        <div className="text-center pt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="border border-red-500 hover:border-red-600 hover:bg-red-500 text-red-500 hover:text-white/90 disabled:bg-red-400 disabled:text-white/90 disabled:cursor-not-allowed font-semibold py-3 px-8 rounded-full transition-colors flex items-center justify-center mx-auto"
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
              `Load More ${
                getFilterText().charAt(0).toUpperCase() +
                getFilterText().slice(1)
              } (${Math.min(
                UI_CONFIG.POSTS_PER_PAGE,
                filteredBlogs.length - visiblePosts,
              )} more)`
            )}
          </button>
        </div>
      )}

      {!hasMorePosts && filteredBlogs.length > UI_CONFIG.POSTS_PER_PAGE && (
        <div className="text-center pt-8">
          <p className="text-neutral-400 text-sm">
            You&apos;ve reached the end. All {filteredCount} {getFilterText()}{" "}
            are now visible.
          </p>
        </div>
      )}

      <div className="text-center pt-4">
        <p className="text-neutral-500 text-sm">
          {filter === BLOG_FILTERS.ALL ? (
            <>
              Showing {Math.min(visiblePosts, filteredCount)} of {filteredCount}{" "}
              entries ({totalDevLogCount} dev logs, {totalPatchNoteCount} patch
              notes)
            </>
          ) : (
            <>
              Showing {Math.min(visiblePosts, filteredCount)} of {filteredCount}{" "}
              {getFilterText()}
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default BlogList;
