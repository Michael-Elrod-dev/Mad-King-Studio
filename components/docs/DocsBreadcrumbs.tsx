// components/docs/DocsBreadcrumbs.tsx
"use client";

import Link from "next/link";

interface Breadcrumb {
  name: string;
  path: string;
}

interface DocsBreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}

const DocsBreadcrumbs = ({ breadcrumbs }: DocsBreadcrumbsProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-white/60 mb-6">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center">
          {index > 0 && (
            <svg
              className="w-4 h-4 mx-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          )}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-white/90 font-medium">{crumb.name}</span>
          ) : (
            <Link
              href={crumb.path}
              className="hover:text-white transition-colors"
            >
              {crumb.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default DocsBreadcrumbs;
