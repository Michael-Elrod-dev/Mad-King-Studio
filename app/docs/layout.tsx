// app/docs/layout.tsx
"use client";

import FloatingNav from "@/components/layout/FloatingNav";
import DocsSidebar from "@/components/docs/DocsSidebar";
import { useDocs } from "@/contexts/DocsContext";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tree, isLoading } = useDocs();

  return (
    <div className="min-h-screen">
      <FloatingNav />
      
      <div className="flex">
        {/* Sidebar - rendered once at layout level, never re-renders */}
        {!isLoading && <DocsSidebar tree={tree} />}

        {/* Page content goes here */}
        {children}
      </div>
    </div>
  );
}
