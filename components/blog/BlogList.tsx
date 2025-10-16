// components/blog/BlogList.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import BlogCard from "./BlogCard";
import { Loader2, AlertCircle, ArrowDown, Inbox } from "lucide-react";
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

  const getFilterText = () => {
    switch (filter) {
      case BLOG_FILTERS.DEVLOG:
        return "dev logs";
      case BLOG_FILTERS.PATCH_NOTE:
        return "patch notes";
      default:
        return "posts";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-xl p-8 animate-pulse"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="h-3 bg-neutral-800 rounded w-24"></div>
              <div className="h-6 bg-neutral-800 rounded-full w-28"></div>
            </div>
            <div className="h-8 bg-neutral-800 rounded w-3/4 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-neutral-800 rounded w-full"></div>
              <div className="h-4 bg-neutral-800 rounded w-5/6"></div>
              <div className="h-4 bg-neutral-800 rounded w-4/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-950/30 to-red-900/20 border border-red-800/50 rounded-xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-500/10 rounded-full p-3">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-3">
          Error Loading Blog Posts
        </h3>
        <p className="text-white/80 mb-6 max-w-md mx-auto">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 font-semibold px-6 py-3 rounded-full transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (pagination.totalPosts === 0) {
    return (
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-xl p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-neutral-800 rounded-full p-4">
            <Inbox className="w-10 h-10 text-neutral-500" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-3">
          No {getFilterText()} Found
        </h3>
        <p className="text-neutral-400 max-w-md mx-auto">
          No {getFilterText()} available for this game yet. Try changing the
          filter or check back later for updates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats bar */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-neutral-400">
          Showing{" "}
          <span className="font-semibold text-white">{allBlogs.length}</span> of{" "}
          <span className="font-semibold text-white">
            {pagination.totalPosts}
          </span>{" "}
          {getFilterText()}
        </p>
      </div>

      {/* Blog cards */}
      <div className="space-y-6">
        {allBlogs.map((post, index) => (
          <div
            key={post.id}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <BlogCard
              post={post}
              isGitHubPost={true}
              isPatchNote={post.type === BLOG_TYPES.PATCH_NOTE}
            />
          </div>
        ))}
      </div>

      {/* Load more button */}
      {pagination.hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 text-red-400 border border-red-500/30 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <ArrowDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                <span>
                  Load{" "}
                  {Math.min(
                    pagination.postsPerPage,
                    pagination.totalPosts - allBlogs.length,
                  )}{" "}
                  More{" "}
                  {getFilterText().charAt(0).toUpperCase() +
                    getFilterText().slice(1)}
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* End message */}
      {!pagination.hasMore && allBlogs.length > pagination.postsPerPage && (
        <div className="text-center pt-6">
          <div className="inline-flex items-center gap-2 bg-neutral-900/50 border border-neutral-800 rounded-full px-6 py-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-sm text-neutral-400">
              You&apos;ve reached the end — all {pagination.totalPosts}{" "}
              {getFilterText()} loaded
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogList;
