// app/docs/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DOCS_CONFIG } from "@/lib/docsData";
import { useDocs } from "@/contexts/DocsContext";

export default function DocsPage() {
  const { tree, isLoading, error } = useDocs();
  const router = useRouter();

  // Redirect to default doc
  useEffect(() => {
    if (!isLoading && tree.length > 0 && !error) {
      router.push(`/docs/${DOCS_CONFIG.DEFAULT_DOC}`);
    }
  }, [tree, isLoading, error, router]);

  return (
    <main className="flex-1 lg:pl-[340px] pt-20 px-6 lg:px-12 pb-12">
      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mb-4"></div>
            <p className="text-white/70">Loading documentation...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Error Loading Documentation
            </h2>
            <p className="text-white/90 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="border border-red-500 hover:bg-red-500 text-red-500 hover:text-white font-semibold py-3 px-8 rounded-full transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="text-center py-20">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Game Documentation
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Redirecting to documentation...
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
