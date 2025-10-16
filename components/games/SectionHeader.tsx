// components/games/SectionHeader.tsx
"use client";

import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  centered?: boolean;
}

const SectionHeader = ({
  title,
  description,
  icon: Icon,
  centered = false,
}: SectionHeaderProps) => {
  return (
    <div className={`mb-8 ${centered ? "text-center" : ""}`}>
      <h3
        className={`text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3 ${
          centered ? "justify-center" : ""
        }`}
      >
        <span className="w-1.5 h-10 bg-gradient-to-b from-red-500 to-red-600 rounded-full" />
        {Icon && (
          <div className="bg-red-500/10 p-2 rounded-lg border border-red-500/30">
            <Icon className="w-6 h-6 text-red-400" />
          </div>
        )}
        <span>{title}</span>
      </h3>
      {description && (
        <p
          className={`text-white/80 text-lg leading-relaxed ${
            centered ? "max-w-4xl mx-auto" : "max-w-3xl"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
