// app/blog/page.tsx
"use client";

import { useState } from "react";
import FloatingNav from "@/components/layout/FloatingNav";
import BlogSelector from "@/components/blog/BlogSelector";
import BlogContent from "@/components/blog/BlogContent";
import { blogSections } from "@/lib/blogData";

export default function BlogPage() {
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);

  return (
    <div className="min-h-screen pb-12">
      <FloatingNav />
      <BlogSelector
        sections={blogSections}
        selectedIndex={selectedSectionIndex}
        onSectionSelect={setSelectedSectionIndex}
      />
      <BlogContent
        sections={blogSections}
        selectedIndex={selectedSectionIndex}
      />
    </div>
  );
}
