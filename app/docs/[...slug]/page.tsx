// app/docs/[...slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DocsContent from "@/components/docs/DocsContent";
import DocsBreadcrumbs from "@/components/docs/DocsBreadcrumbs";
import { buildBreadcrumbs, extractTitle } from "@/lib/utils/docsParser";
import { useDocs } from "@/contexts/DocsContext";
import { HTTP_STATUS, MESSAGES } from "@/lib/constants";

export default function DocPage() {
  const params = useParams();
  const slug = params.slug as string[];
  const { isLoading: isLoadingTree, error: treeError } = useDocs();

  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load specific doc content
  useEffect(() => {
    const loadDocContent = async () => {
      if (!slug || slug.length === 0) return;

      try {
        setIsLoadingContent(true);
        setError(null);

        const pathStr = slug.join("/");
        const response = await fetch(`/api/docs/${pathStr}`);

        if (!response.ok) {
          if (response.status === HTTP_STATUS.NOT_FOUND) {
            throw new Error("Document not found");
          }
          throw new Error(MESSAGES.ERROR.DOCS_LOAD_ERROR);
        }

        const data = await response.json();
        setContent(data.content);

        // Extract the actual filename from the returned path
        const actualFileName =
          data.path.split("/").pop() || slug[slug.length - 1];
        const extractedTitle = extractTitle(data.content, actualFileName);
        setTitle(extractedTitle);
      } catch (err) {
        console.error("Error loading doc content:", err);
        setError(
          err instanceof Error ? err.message : MESSAGES.ERROR.DOCS_LOAD_ERROR,
        );
      } finally {
        setIsLoadingContent(false);
      }
    };

    loadDocContent();
  }, [slug]);

  // Build breadcrumbs from slug
  const breadcrumbs = slug ? buildBreadcrumbs(`docs/${slug.join("/")}.md`) : [];

  const isLoading = isLoadingTree || isLoadingContent;
  const displayError = error || treeError;

  return (
    <main className="flex-1 lg:pl-[340px] pt-20 px-6 lg:px-12 pb-12">
      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mb-4"></div>
            <p className="text-white/70">Loading document...</p>
          </div>
        ) : displayError ? (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Error Loading Document
            </h2>
            <p className="text-white/90 mb-6">{displayError}</p>
            <button
              onClick={() => window.location.reload()}
              className="border border-red-500 hover:bg-red-500 text-red-500 hover:text-white font-semibold py-3 px-8 rounded-full transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <DocsBreadcrumbs breadcrumbs={breadcrumbs} />
            <DocsContent
              content={content}
              path={slug.join("/")}
              title={title}
            />
          </>
        )}
      </div>
    </main>
  );
}
