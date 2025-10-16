// components/docs/DocsContent.tsx
"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { convertWikiLinksToRoutes } from "@/lib/parsers/docs";
import {
  convertLocalImagesToS3,
  extractAndRemoveAssetsSection,
} from "@/lib/parsers/content";
import MediaCarousel from "@/components/shared/MediaCarousel";
import ProjectOverviewContent from "./ProjectOverviewContent";
import EpicDetailContent from "./EpicDetailContent";

interface DocsContentProps {
  content: string;
  path: string;
  title: string;
}

const DocsContent = ({ content, path, title }: DocsContentProps) => {
  // Check if this is the Project Overview page
  const isProjectOverview = path.includes(
    "00-project-development/project-overview",
  );

  // Check if this is an Epic detail page
  const isEpicDetail = path.includes("00-project-development/epics/");

  // Use custom renderers for Jira-generated pages
  if (isProjectOverview) {
    return <ProjectOverviewContent content={content} title={title} />;
  }

  if (isEpicDetail) {
    return <EpicDetailContent content={content} title={title} />;
  }

  // Extract assets first, before any other processing
  const { assets, cleanedContent } = extractAndRemoveAssetsSection(content);

  // Then convert local images to S3 URLs
  let processedContent = convertLocalImagesToS3(cleanedContent, path);

  // Then convert Obsidian wiki links to proper routes
  processedContent = convertWikiLinksToRoutes(processedContent, path);

  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold text-white mb-8">{title}</h1>

      {/* Show assets carousel if assets exist */}
      {assets.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Assets</h2>
          <MediaCarousel assets={assets} className="mb-6" />
        </div>
      )}

      {/* Single markdown rendering - no more segments */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="group text-3xl font-bold text-white mb-6 mt-10 pb-3 border-b-2 border-neutral-800 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full group-hover:h-10 transition-all" />
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="group text-2xl font-bold text-white mb-4 mt-8 pb-2 border-b border-neutral-800/50 flex items-center gap-3">
              <span className="w-1 h-6 bg-gradient-to-b from-red-500/80 to-red-600/80 rounded-full group-hover:h-8 transition-all" />
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-bold text-white mb-3 mt-6 flex items-center gap-2">
              <span className="w-0.5 h-5 bg-red-500/60 rounded-full" />
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold text-white/95 mb-2 mt-4">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-5 leading-[1.8] text-white/90 text-[15px]">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-6 ml-1 space-y-2.5 text-white/90">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-6 ml-1 space-y-2.5 text-white/90">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-[1.8] text-[15px] flex items-start gap-3 group">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-2.5 group-hover:scale-125 transition-transform" />
              <span className="flex-1">{children}</span>
            </li>
          ),
          blockquote: ({ children }) => {
            // Check if this is a callout/admonition (starts with specific keywords)
            const childText =
              typeof children === "string"
                ? children
                : (Array.isArray(children) && children[0]?.props?.children) ||
                  "";
            const text = String(childText).toLowerCase();

            let icon = "💡";
            let bgColor = "bg-blue-500/10";
            let borderColor = "border-blue-500";
            let textColor = "text-blue-400";
            let title = "Note";

            if (text.startsWith("[!note]") || text.startsWith("note:")) {
              icon = "📝";
              title = "Note";
              bgColor = "bg-blue-500/10";
              borderColor = "border-blue-500";
              textColor = "text-blue-400";
            } else if (
              text.startsWith("[!warning]") ||
              text.startsWith("warning:")
            ) {
              icon = "⚠️";
              title = "Warning";
              bgColor = "bg-yellow-500/10";
              borderColor = "border-yellow-500";
              textColor = "text-yellow-400";
            } else if (
              text.startsWith("[!danger]") ||
              text.startsWith("danger:") ||
              text.startsWith("[!important]")
            ) {
              icon = "🚨";
              title = "Important";
              bgColor = "bg-red-500/10";
              borderColor = "border-red-500";
              textColor = "text-red-400";
            } else if (text.startsWith("[!tip]") || text.startsWith("tip:")) {
              icon = "💡";
              title = "Tip";
              bgColor = "bg-green-500/10";
              borderColor = "border-green-500";
              textColor = "text-green-400";
            } else if (text.startsWith("[!info]") || text.startsWith("info:")) {
              icon = "ℹ️";
              title = "Info";
              bgColor = "bg-cyan-500/10";
              borderColor = "border-cyan-500";
              textColor = "text-cyan-400";
            } else {
              // Default elegant blockquote
              return (
                <blockquote className="relative border-l-4 border-red-500 pl-6 pr-4 py-3 my-6 bg-neutral-900/50 rounded-r-lg italic text-white/80">
                  <div className="absolute left-2 top-0 text-6xl text-red-500/20 font-serif leading-none">
                    &ldquo;
                  </div>
                  <div className="relative z-10">{children}</div>
                </blockquote>
              );
            }

            return (
              <div
                className={`${bgColor} border-l-4 ${borderColor} rounded-r-lg p-4 my-6 not-italic`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
                  <div className="flex-1">
                    <div
                      className={`font-bold ${textColor} mb-2 text-sm uppercase tracking-wide`}
                    >
                      {title}
                    </div>
                    <div className="text-white/90 text-sm leading-relaxed">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            );
          },
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-neutral-800/80 text-red-400 px-2 py-0.5 rounded font-mono text-sm border border-neutral-700/50">
                {children}
              </code>
            ) : (
              <code className={className}>{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className="relative bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 p-5 rounded-xl mb-6 overflow-x-auto shadow-lg">
              <div className="absolute top-3 right-3 flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <div className="pt-4">{children}</div>
            </pre>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-red-500 hover:text-red-400 underline transition-colors"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-8 rounded-lg border border-neutral-800 shadow-lg">
              <table className="min-w-full border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gradient-to-r from-neutral-900 to-neutral-800 border-b-2 border-red-500/30">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-6 py-4 text-left text-white font-bold text-sm uppercase tracking-wide">
              {children}
            </th>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-neutral-800/50 bg-neutral-950/30">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-neutral-800/30 transition-colors">
              {children}
            </tr>
          ),
          td: ({ children }) => (
            <td className="px-6 py-4 text-white/90 text-sm">{children}</td>
          ),
          hr: () => (
            <hr className="border-0 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-12" />
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-white/90">{children}</em>
          ),
          img: ({ src, alt }) => {
            if (!src || typeof src !== "string") return null;

            return (
              <figure className="my-8 group">
                <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 p-2 transition-all duration-300 group-hover:border-red-500/50 group-hover:shadow-xl group-hover:shadow-red-500/10">
                  <Image
                    src={src}
                    alt={alt || ""}
                    width={800}
                    height={600}
                    className="rounded-lg w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
                    unoptimized={src.includes(".gif")}
                  />
                </div>
                {alt && (
                  <figcaption className="mt-3 text-center text-sm text-neutral-500 italic">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </article>
  );
};

export default DocsContent;
