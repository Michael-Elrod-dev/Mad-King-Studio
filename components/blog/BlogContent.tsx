// components/blog/BlogContent.tsx
"use client";

import { BlogSection } from "@/lib/blogData";
import DevlogList from "./DevlogList";
import PatchNotesList from "./PatchNoteList";

interface BlogContentProps {
  sections: BlogSection[];
  selectedIndex: number;
}

const BlogContent = ({ sections, selectedIndex }: BlogContentProps) => {
  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
      >
        {sections.map((section, index) => (
          <div key={section.id} className="w-full flex-shrink-0 px-6 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  {section.title}
                </h1>
                <p className="text-xl text-white/90 max-w-3xl mx-auto">
                  {section.description}
                </p>
              </div>

              {/* Content based on section */}
              {section.id === "dev-logs" && <DevlogList />}
              {section.id === "patch-notes" && <PatchNotesList />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogContent;
