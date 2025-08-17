"use client";

import { BlogSection } from "@/lib/blogData";

interface BlogSelectorProps {
  sections: BlogSection[];
  selectedIndex: number;
  onSectionSelect: (index: number) => void;
}

const BlogSelector = ({
  sections,
  selectedIndex,
  onSectionSelect,
}: BlogSelectorProps) => {
  return (
    <div className="bg-transparent">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex justify-center space-x-8 overflow-x-auto">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => onSectionSelect(index)}
              className={`py-4 px-2 whitespace-nowrap text-sm font-medium border-b-2 transition-colors duration-200 ${
                selectedIndex === index
                  ? "text-red-500 border-red-500"
                  : "text-white/70 border-transparent hover:text-white hover:border-white/30"
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSelector;
