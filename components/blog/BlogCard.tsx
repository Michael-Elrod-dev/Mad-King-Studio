// components/blog/BlogCard.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Calendar,
  FileText,
  Wrench,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  formatDate,
  getRemainingContent,
  getFirstSection,
  getCompleteFirstSection,
} from "@/lib";
import MediaCarousel from "@/components/shared/MediaCarousel";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  dayNumber?: number;
  githubUrl?: string;
  assets?: string[];
  tags?: string[];
  type?: "devlog" | "patch-note";
}

interface BlogCardProps {
  post: BlogPost;
  isGitHubPost?: boolean;
  isPatchNote?: boolean;
}

const BlogCard = ({
  post,
  isGitHubPost = false,
  isPatchNote = false,
}: BlogCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const firstSection =
    isGitHubPost && post.content ? getFirstSection(post.content) : "";
  const remainingContent =
    isGitHubPost && post.content ? getRemainingContent(post.content) : "";
  const completeFirstSection =
    isGitHubPost && post.content ? getCompleteFirstSection(post.content) : "";
  const hasMoreContent = remainingContent.trim().length > 0;

  // Enhanced styling based on type (swapped: devlog=red, patch-note=blue)
  const cardStyles = isPatchNote
    ? "bg-gradient-to-br from-blue-950/30 to-blue-900/20 border-blue-800/40 hover:border-blue-600/60"
    : "bg-gradient-to-br from-neutral-900 to-neutral-950 border-neutral-800 hover:border-red-500/50";

  // Markdown components with enhanced styling (swapped colors)
  const markdownComponents = {
    h1: ({ children }: React.ComponentPropsWithoutRef<"h1">) => (
      <h1 className="group text-2xl font-bold text-white mb-4 mt-6 pb-2 border-b border-neutral-800/50 flex items-center gap-3">
        <span
          className={`w-1 h-6 bg-gradient-to-b ${
            isPatchNote
              ? "from-blue-500/80 to-blue-600/80"
              : "from-red-500/80 to-red-600/80"
          } rounded-full group-hover:h-8 transition-all`}
        />
        {children}
      </h1>
    ),
    h2: ({ children }: React.ComponentPropsWithoutRef<"h2">) => (
      <h2 className="text-xl font-bold text-white mb-3 mt-5 flex items-center gap-2">
        <span
          className={`w-0.5 h-5 ${
            isPatchNote ? "bg-blue-500/60" : "bg-red-500/60"
          } rounded-full`}
        />
        {children}
      </h2>
    ),
    h3: ({ children }: React.ComponentPropsWithoutRef<"h3">) => (
      <h3 className="text-lg font-semibold text-white/95 mb-2 mt-4">
        {children}
      </h3>
    ),
    p: ({ children }: React.ComponentPropsWithoutRef<"p">) => (
      <p className="mb-4 leading-[1.7] text-white/90 text-[15px]">{children}</p>
    ),
    ul: ({ children }: React.ComponentPropsWithoutRef<"ul">) => (
      <ul className="mb-5 ml-1 space-y-2 text-white/90">{children}</ul>
    ),
    ol: ({ children }: React.ComponentPropsWithoutRef<"ol">) => (
      <ol className="mb-5 ml-1 space-y-2 text-white/90">{children}</ol>
    ),
    li: ({ children }: React.ComponentPropsWithoutRef<"li">) => (
      <li className="leading-[1.7] text-[15px] flex items-start gap-3 group">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isPatchNote ? "bg-blue-500" : "bg-red-500"
          } flex-shrink-0 mt-2.5 group-hover:scale-125 transition-transform`}
        />
        <span className="flex-1">{children}</span>
      </li>
    ),
    blockquote: ({
      children,
    }: React.ComponentPropsWithoutRef<"blockquote">) => (
      <blockquote
        className={`relative border-l-4 ${
          isPatchNote ? "border-blue-500" : "border-red-500"
        } pl-6 pr-4 py-3 my-5 bg-neutral-900/50 rounded-r-lg italic text-white/80`}
      >
        <div
          className={`absolute left-2 top-0 text-5xl ${
            isPatchNote ? "text-blue-500/20" : "text-red-500/20"
          } font-serif leading-none`}
        >
          &ldquo;
        </div>
        <div className="relative z-10">{children}</div>
      </blockquote>
    ),
    code: ({ children }: React.ComponentPropsWithoutRef<"code">) => (
      <code className="bg-neutral-800/80 text-red-400 px-2 py-0.5 rounded font-mono text-sm border border-neutral-700/50">
        {children}
      </code>
    ),
    pre: ({ children }: React.ComponentPropsWithoutRef<"pre">) => (
      <pre className="relative bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 p-5 rounded-xl mb-6 overflow-x-auto shadow-lg">
        <div className="absolute top-3 right-3 flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
        </div>
        <div className="pt-3">{children}</div>
      </pre>
    ),
    a: ({ href, children, ...props }: React.ComponentPropsWithoutRef<"a">) => (
      <a
        href={href}
        className={`${
          isPatchNote
            ? "text-blue-400 hover:text-blue-300"
            : "text-red-500 hover:text-red-400"
        } underline transition-colors`}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    strong: ({ children }: React.ComponentPropsWithoutRef<"strong">) => (
      <strong className="font-bold text-white">{children}</strong>
    ),
    em: ({ children }: React.ComponentPropsWithoutRef<"em">) => (
      <em className="italic text-white/90">{children}</em>
    ),
  };

  return (
    <article
      className={`relative border rounded-xl p-6 md:p-8 transition-all duration-300 hover:shadow-xl ${
        isPatchNote ? "hover:shadow-blue-500/10" : "hover:shadow-red-500/10"
      } ${cardStyles}`}
    >
      {/* Type indicator badge */}
      <div className="absolute top-6 right-6">
        {isPatchNote ? (
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-3 py-1.5">
            <Wrench className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
              Patch Notes
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1.5">
            <FileText className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">
              Dev Log
            </span>
          </div>
        )}
      </div>

      {/* Date badge */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-neutral-500" />
        <time
          dateTime={post.date}
          className="text-sm text-neutral-400 font-medium"
        >
          {formatDate(post.date)}
        </time>
      </div>

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pr-32">
        {post.title}
      </h2>

      {/* Media Carousel */}
      {isGitHubPost && post.assets && post.assets.length > 0 && (
        <div className="mb-6 -mx-2">
          <MediaCarousel assets={post.assets} className="rounded-lg" />
        </div>
      )}

      {/* Content */}
      {isGitHubPost && post.content ? (
        <div className="prose-blog max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {isExpanded ? completeFirstSection : firstSection}
          </ReactMarkdown>

          {isExpanded && remainingContent && (
            <div className="mt-6 pt-6 border-t border-neutral-800/50">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {remainingContent}
              </ReactMarkdown>
            </div>
          )}

          {/* Expand/Collapse button */}
          {hasMoreContent && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                isPatchNote
                  ? "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:border-blue-500/50"
                  : "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50"
              }`}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>Show Less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>Read Full Post</span>
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <div>
          <p className="mb-6 leading-relaxed text-white/90 text-[15px]">
            {post.excerpt}
          </p>

          <Link
            href={`/devlog/${post.id}`}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
              isPatchNote
                ? "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:border-blue-500/50"
                : "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50"
            }`}
          >
            Read Full Post
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
          </Link>
        </div>
      )}
    </article>
  );
};

export default BlogCard;
