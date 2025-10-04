// app/docs/layout.tsx
"use client";

import { useState } from "react";
import FloatingNav from "@/components/layout/FloatingNav";
import DocsSidebar from "@/components/docs/DocsSidebar";
import { useDocs } from "@/contexts/DocsContext";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tree, isLoading } = useDocs();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen">
      <FloatingNav />

      <div className="flex">
        {!isLoading && (
          <DocsSidebar
            tree={tree}
            isOpen={isSidebarOpen}
            onToggle={setIsSidebarOpen}
          />
        )}

        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "lg:ml-80" : "lg:ml-0"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
