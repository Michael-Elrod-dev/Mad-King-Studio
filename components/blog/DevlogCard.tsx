// components/blog/DevlogCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDate, getRemainingContent, getFirstSection } from '@/lib/utils';

interface DevlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  dayNumber?: number;
  githubUrl?: string;
  tags?: string[];
}

interface DevlogCardProps {
  post: DevlogPost;
  isGitHubPost?: boolean;
}

const DevlogCard = ({ post, isGitHubPost = false }: DevlogCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const firstSection =
    isGitHubPost && post.content ? getFirstSection(post.content) : "";
  const remainingContent =
    isGitHubPost && post.content ? getRemainingContent(post.content) : "";
  const hasMoreContent = remainingContent.trim().length > 0;

  return (
    <article className="bg-neutral-800 rounded-lg p-6">
      {/* GitHub indicator with date for GitHub posts */}
      {isGitHubPost && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-white/40"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.30A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.30 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="text-white/40 text-xs">Development Log Entry</span>
          </div>
          <time dateTime={post.date} className="text-white/40 text-xs">
            {formatDate(post.date)}
          </time>
        </div>
      )}

      <h2 className="text-2xl font-bold text-white mb-3">{post.title}</h2>

      {/* Render markdown content */}
      {isGitHubPost && post.content ? (
        <div className="max-w-none mb-4">
          {/* First section - always visible */}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-xl font-bold text-white/90 mb-3">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-bold text-white/90 mb-2">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-md font-bold text-white/90 mb-2">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-white/90 mb-3 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="text-white/90 mb-3 ml-4 list-disc">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="text-white/90 mb-3 ml-4 list-decimal">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-neutral-500 pl-4 italic text-white/40 mb-3">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-neutral-950 text-white/90 px-1 py-0.5 rounded text-sm">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-neutral-950 p-4 rounded mb-3 overflow-x-auto">
                  {children}
                </pre>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-red-500 hover:text-red-400 underline transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-white/90">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-white/90">{children}</em>
              ),
            }}
          >
            {firstSection}
          </ReactMarkdown>

          {/* Expanded content - conditionally visible */}
          {isExpanded && remainingContent && (
            <div className="pt-4 mt-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold text-white/90 mb-3">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-bold text-white/90 mb-2">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-md font-bold text-white/90 mb-2">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-white/90 mb-3 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="text-white/90 mb-3 ml-4 list-disc">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="text-white/90 mb-3 ml-4 list-decimal">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-red-500 pl-4 italic text-white/40 mb-3">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="bg-neutral-950 text-white/90 px-1 py-0.5 rounded text-sm">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-neutral-950 p-4 rounded mb-3 overflow-x-auto">
                      {children}
                    </pre>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-red-500 hover:text-red-400 underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-white">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-white/90">{children}</em>
                  ),
                }}
              >
                {remainingContent}
              </ReactMarkdown>
            </div>
          )}

          {/* Combined action row */}
          <div className="flex items-center justify-between mt-4 pt-3">
            {hasMoreContent && (
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
                    Show More
                  </>
                )}
              </button>
            )}

          </div>
        </div>
      ) : (
        <div>
          <p className="text-white/90 mb-4 leading-relaxed">{post.excerpt}</p>

          {/* Date for non-GitHub posts */}
          <div className="flex items-center justify-between text-sm text-white/40 mb-4">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>

          {/* Action for non-GitHub posts */}
          <div className="flex gap-3 mt-4">
            <Link
              href={`/devlog/${post.id}`}
              className="inline-block text-red-500 hover:text-red-400 font-medium transition-colors"
            >
              Read more
            </Link>
          </div>
        </div>
      )}
    </article>
  );
};

export default DevlogCard;
