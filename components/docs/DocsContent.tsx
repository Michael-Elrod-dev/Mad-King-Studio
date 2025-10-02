// components/docs/DocsContent.tsx
"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { convertWikiLinksToRoutes } from "@/lib/utils/docsParser";
import { convertLocalImagesToS3 } from "@/lib/utils/content";

interface DocsContentProps {
  content: string;
  path: string;
  title: string;
}

const DocsContent = ({ content, path, title }: DocsContentProps) => {
  // First convert local images to S3 URLs
  let processedContent = convertLocalImagesToS3(content, path);
  
  // Then convert Obsidian wiki links to proper routes
  processedContent = convertWikiLinksToRoutes(processedContent, path);

  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold text-white mb-8">{title}</h1>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-white mb-4 mt-8">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-white mb-3 mt-6">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-bold text-white mb-2 mt-4">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-bold text-white mb-2 mt-3">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-white/90">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 list-disc text-white/90 space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 list-decimal text-white/90 space-y-2">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-red-500 pl-4 italic mb-4 text-white/70">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-neutral-800 text-red-400 px-1.5 py-0.5 rounded text-sm">
                {children}
              </code>
            ) : (
              <code className={className}>{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-neutral-900 p-4 rounded-lg mb-4 overflow-x-auto">
              {children}
            </pre>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-red-500 hover:text-red-400 underline transition-colors"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse border border-neutral-700">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-neutral-800">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-neutral-700 px-4 py-2 text-left text-white font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-neutral-700 px-4 py-2 text-white/90">
              {children}
            </td>
          ),
          hr: () => <hr className="border-neutral-700 my-8" />,
          strong: ({ children }) => (
            <strong className="font-bold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-white/90">{children}</em>
          ),
          img: ({ src, alt }) => {
            // Type guard: ensure src is a string and exists
            if (!src || typeof src !== 'string') return null;
            
            return (
              <span className="block my-4">
                <Image
                  src={src}
                  alt={alt || ''}
                  width={800}
                  height={600}
                  className="rounded-lg w-full h-auto"
                  unoptimized={src.includes('.gif')} // Don't optimize GIFs
                />
              </span>
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
