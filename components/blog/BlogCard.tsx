// components/blog/BlogCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  formatDate,
  getRemainingContent,
  getFirstSection,
  getCompleteFirstSection,
} from "@/lib/utils";
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

  // Dynamic styling based on whether it's a patch note
  const cardBgColor = isPatchNote
    ? "bg-red-900/30 border border-red-800/50"
    : "bg-neutral-800";
  const indicatorColor = isPatchNote ? "text-red-400" : "text-white/40";
  const indicatorText = isPatchNote ? "Patch Notes" : "Development Log Entry";
  const titleColor = isPatchNote ? "text-red-100" : "text-white";

  return (
    <article className={`rounded-lg p-6 ${cardBgColor}`}>
      {/* GitHub indicator with date for GitHub posts */}
      {isGitHubPost && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isPatchNote ? (
              // Patch note icon
              <svg
                className={`w-4 h-4 ${indicatorColor}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            ) : (
              // Dev log icon (existing GitHub icon)
              <svg
                className={`w-4 h-4 ${indicatorColor}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.30A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.30 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            )}
            <span className={`text-xs ${indicatorColor}`}>{indicatorText}</span>
          </div>
          <time dateTime={post.date} className={`text-xs ${indicatorColor}`}>
            {formatDate(post.date)}
          </time>
        </div>
      )}

      <h2 className={`text-2xl font-bold mb-3 ${titleColor}`}>{post.title}</h2>

      {/* MediaCarousel */}
      {isGitHubPost && post.assets && post.assets.length > 0 && (
        <MediaCarousel assets={post.assets} className="mb-6" />
      )}

      {/* Render markdown content */}
      {isGitHubPost && post.content ? (
        <div className="max-w-none mb-4">
          {/* Show either truncated or complete first section based on expanded state */}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1
                  className={`text-xl font-bold mb-3 ${
                    isPatchNote ? "text-red-100" : "text-white/90"
                  }`}
                >
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2
                  className={`text-lg font-bold mb-2 ${
                    isPatchNote ? "text-red-100" : "text-white/90"
                  }`}
                >
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3
                  className={`text-md font-bold mb-2 ${
                    isPatchNote ? "text-red-100" : "text-white/90"
                  }`}
                >
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p
                  className={`mb-3 leading-relaxed ${
                    isPatchNote ? "text-red-50" : "text-white/90"
                  }`}
                >
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul
                  className={`mb-3 ml-4 list-disc ${
                    isPatchNote ? "text-red-50" : "text-white/90"
                  }`}
                >
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol
                  className={`mb-3 ml-4 list-decimal ${
                    isPatchNote ? "text-red-50" : "text-white/90"
                  }`}
                >
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote
                  className={`border-l-4 pl-4 italic mb-3 ${
                    isPatchNote
                      ? "border-red-500 text-red-300"
                      : "border-neutral-500 text-white/40"
                  }`}
                >
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code
                  className={`px-1 py-0.5 rounded text-sm ${
                    isPatchNote
                      ? "bg-red-950 text-red-100"
                      : "bg-neutral-950 text-white/90"
                  }`}
                >
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre
                  className={`p-4 rounded mb-3 overflow-x-auto ${
                    isPatchNote ? "bg-red-950" : "bg-neutral-950"
                  }`}
                >
                  {children}
                </pre>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className={`underline transition-colors ${
                    isPatchNote
                      ? "text-red-400 hover:text-red-300"
                      : "text-red-500 hover:text-red-400"
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong
                  className={`font-bold ${
                    isPatchNote ? "text-red-100" : "text-white/90"
                  }`}
                >
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em
                  className={`italic ${
                    isPatchNote ? "text-red-100" : "text-white/90"
                  }`}
                >
                  {children}
                </em>
              ),
            }}
          >
            {isExpanded ? completeFirstSection : firstSection}
          </ReactMarkdown>

          {/* Expanded content - only remaining sections, not the first section */}
          {isExpanded && remainingContent && (
            <div className="mt-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1
                      className={`text-xl font-bold mb-3 ${
                        isPatchNote ? "text-red-100" : "text-white/90"
                      }`}
                    >
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2
                      className={`text-lg font-bold mb-2 ${
                        isPatchNote ? "text-red-100" : "text-white/90"
                      }`}
                    >
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3
                      className={`text-md font-bold mb-2 ${
                        isPatchNote ? "text-red-100" : "text-white/90"
                      }`}
                    >
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p
                      className={`mb-3 leading-relaxed ${
                        isPatchNote ? "text-red-50" : "text-white/90"
                      }`}
                    >
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul
                      className={`mb-3 ml-4 list-disc ${
                        isPatchNote ? "text-red-50" : "text-white/90"
                      }`}
                    >
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol
                      className={`mb-3 ml-4 list-decimal ${
                        isPatchNote ? "text-red-50" : "text-white/90"
                      }`}
                    >
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote
                      className={`border-l-4 pl-4 italic mb-3 ${
                        isPatchNote
                          ? "border-red-500 text-red-300"
                          : "border-red-500 text-white/40"
                      }`}
                    >
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code
                      className={`px-1 py-0.5 rounded text-sm ${
                        isPatchNote
                          ? "bg-red-950 text-red-100"
                          : "bg-neutral-950 text-white/90"
                      }`}
                    >
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre
                      className={`p-4 rounded mb-3 overflow-x-auto ${
                        isPatchNote ? "bg-red-950" : "bg-neutral-950"
                      }`}
                    >
                      {children}
                    </pre>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className={`underline transition-colors ${
                        isPatchNote
                          ? "text-red-400 hover:text-red-300"
                          : "text-red-500 hover:text-red-400"
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong
                      className={`font-bold ${
                        isPatchNote ? "text-red-100" : "text-white"
                      }`}
                    >
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em
                      className={`italic ${
                        isPatchNote ? "text-red-100" : "text-white/90"
                      }`}
                    >
                      {children}
                    </em>
                  ),
                }}
              >
                {remainingContent}
              </ReactMarkdown>
            </div>
          )}

          {/* Show More/Less button */}
          {hasMoreContent && (
            <div className="flex items-center justify-between mt-4 pt-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`font-medium transition-colors flex items-center ${
                  isPatchNote
                    ? "text-red-400 hover:text-red-300"
                    : "text-red-500 hover:text-red-400"
                }`}
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
                    Show More
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p
            className={`mb-4 leading-relaxed ${
              isPatchNote ? "text-red-50" : "text-white/90"
            }`}
          >
            {post.excerpt}
          </p>

          {/* Date for non-GitHub posts */}
          <div
            className={`flex items-center justify-between text-sm mb-4 ${
              isPatchNote ? "text-red-300" : "text-white/40"
            }`}
          >
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>

          {/* Action for non-GitHub posts */}
          <div className="flex gap-3 mt-4">
            <Link
              href={`/devlog/${post.id}`}
              className={`inline-block font-medium transition-colors ${
                isPatchNote
                  ? "text-red-400 hover:text-red-300"
                  : "text-red-500 hover:text-red-400"
              }`}
            >
              Read more
            </Link>
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogCard;
