// components/blog/BlogList.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
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
  assets?: string[];
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasMore: boolean;
  postsPerPage: number;
}

interface BlogListProps {
  gameId: string;
  filter: (typeof BLOG_FILTERS)[keyof typeof BLOG_FILTERS];
}

const BlogList = ({ gameId, filter }: BlogListProps) => {
  const [allBlogs, setAllBlogs] = useState<ProcessedBlog[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 0,
    totalPages: 0,
    totalPosts: 0,
    hasMore: false,
    postsPerPage: UI_CONFIG.POSTS_PER_PAGE,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use useCallback to memoize loadPage and avoid dependency issues
  const loadPage = useCallback(
    async (page: number, isReset: boolean = false) => {
      try {
        if (isReset) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }
        setError(null);

        const response = await fetch(
          `/api/blog?gameId=${gameId}&page=${page}&filter=${filter}`,
        );

        if (!response.ok) {
          throw new Error(MESSAGES.ERROR.BLOG_LOAD_ERROR);
        }

        const data = await response.json();

        setAllBlogs((prev) =>
          isReset ? data.blogs : [...prev, ...data.blogs],
        );
        setPagination(data.pagination);
      } catch (err) {
        console.error("Error loading blog posts:", err);
        setError(MESSAGES.ERROR.BLOG_LOAD_ERROR);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [gameId, filter],
  );

  // Reset when filter or gameId changes
  useEffect(() => {
    setAllBlogs([]);
    setPagination({
      currentPage: 0,
      totalPages: 0,
      totalPosts: 0,
      hasMore: false,
      postsPerPage: UI_CONFIG.POSTS_PER_PAGE,
    });
    loadPage(1, true);
  }, [gameId, filter, loadPage]);

  const handleLoadMore = () => {
    if (pagination.hasMore && !isLoadingMore) {
      loadPage(pagination.currentPage + 1, false);
    }
  };

  // Get filter text for display
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

  if (pagination.totalPosts === 0) {
    return (
      <div className="bg-neutral-800 rounded-lg p-8 text-center">
        <h3 className="text-white font-semibold mb-2">
          No {getFilterText()} Found
        </h3>
        <p className="text-neutral-50 mb-4">
          No {getFilterText()} available for this game yet. Try changing the
          filter or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {allBlogs.map((post) => (
        <BlogCard
          key={post.id}
          post={post}
          isGitHubPost={true}
          isPatchNote={post.type === BLOG_TYPES.PATCH_NOTE}
        />
      ))}

      {pagination.hasMore && (
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
                pagination.postsPerPage,
                pagination.totalPosts - allBlogs.length,
              )} more)`
            )}
          </button>
        </div>
      )}

      {!pagination.hasMore && allBlogs.length > pagination.postsPerPage && (
        <div className="text-center pt-8">
          <p className="text-neutral-400 text-sm">
            You&apos;ve reached the end. All {pagination.totalPosts}{" "}
            {getFilterText()} are now visible.
          </p>
        </div>
      )}

      <div className="text-center pt-4">
        <p className="text-neutral-500 text-sm">
          Showing {allBlogs.length} of {pagination.totalPosts} {getFilterText()}
        </p>
      </div>
    </div>
  );
};

export default BlogList;
