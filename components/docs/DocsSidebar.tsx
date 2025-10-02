// components/docs/DocsSidebar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cleanDisplayName, pathToSlug } from "@/lib/utils/docsParser";
import type { DocFile } from "@/lib/docsData";

interface DocsSidebarProps {
  tree: DocFile[];
}

interface SidebarItemProps {
  item: DocFile;
  level: number;
  currentPath: string;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
}

const SidebarItem = ({
  item,
  level,
  currentPath,
  expandedFolders,
  onToggleFolder,
}: SidebarItemProps) => {
  const isFolder = item.type === "dir";
  const hasChildren = isFolder && item.children && item.children.length > 0;

  // Generate the link path for files
  const itemSlug = pathToSlug(item.path);
  const itemPath = isFolder ? "#" : `/docs/${itemSlug}`;
  const isActive = !isFolder && currentPath === `/docs/${itemSlug}`;
  const isExpanded = expandedFolders.has(item.path);

  const displayName = cleanDisplayName(item.name);

  const handleFolderClick = () => {
    if (isFolder && hasChildren) {
      onToggleFolder(item.path);
    }
  };

  return (
    <div className="mb-1">
      <div
        className={`flex items-center py-2 px-3 rounded-lg transition-colors ${
          isActive
            ? "bg-red-500 text-white font-medium"
            : "text-white/80 hover:bg-white/5 hover:text-white"
        }`}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {/* Folder toggle or file icon */}
        {isFolder && hasChildren && (
          <button
            onClick={handleFolderClick}
            className="mr-2 focus:outline-none flex-shrink-0"
          >
            <svg
              className={`w-4 h-4 transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>
        )}

        {isFolder && !hasChildren && (
          <svg
            className="w-4 h-4 mr-2 text-white/60 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
          </svg>
        )}

        {!isFolder && (
          <svg
            className="w-4 h-4 mr-2 text-white/60 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
          </svg>
        )}

        {/* Link text */}
        {isFolder ? (
          <span
            className="text-sm flex-1 cursor-pointer"
            onClick={handleFolderClick}
          >
            {displayName}
          </span>
        ) : (
          <Link href={itemPath} className="text-sm flex-1">
            {displayName}
          </Link>
        )}
      </div>

      {/* Render children if expanded */}
      {isFolder && hasChildren && isExpanded && (
        <div>
          {item.children!.map((child) => (
            <SidebarItem
              key={child.path}
              item={child}
              level={level + 1}
              currentPath={currentPath}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DocsSidebar = ({ tree }: DocsSidebarProps) => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );

  // Initialize expanded folders based on current path
  useEffect(() => {
    const pathParts = pathname.split("/").filter(Boolean);
    const foldersToExpand = new Set<string>();

    // Find all folders in the path and expand them
    const findAndExpandPath = (
      items: DocFile[],
      currentPath: string[] = [],
    ) => {
      for (const item of items) {
        const itemPathParts = item.path.split("/").filter(Boolean);

        // Check if this item is in the current URL path
        const isInPath = pathParts.some((part, index) => {
          const normalizedPart = part.toLowerCase().replace(/-/g, " ");
          const normalizedItemPart = itemPathParts[itemPathParts.length - 1]
            ?.toLowerCase()
            .replace(/-/g, " ")
            .replace(/\.md$/i, "");
          return normalizedPart === normalizedItemPart;
        });

        if (item.type === "dir" && isInPath) {
          foldersToExpand.add(item.path);
          if (item.children) {
            findAndExpandPath(item.children, [...currentPath, item.path]);
          }
        } else if (item.type === "dir" && item.children) {
          findAndExpandPath(item.children, [...currentPath, item.path]);
        }

        // If this is a file and matches current path, expand all parent folders
        if (item.type === "file") {
          const itemSlug = pathToSlug(item.path);
          if (pathname === `/docs/${itemSlug}`) {
            // Add all folders in the current path
            currentPath.forEach((folderPath) =>
              foldersToExpand.add(folderPath),
            );
          }
        }
      }
    };

    findAndExpandPath(tree);
    setExpandedFolders(foldersToExpand);
  }, [pathname, tree]);

  const handleToggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 bg-red-500 text-white p-3 rounded-lg shadow-lg hover:bg-red-600 transition-colors"
        aria-label="Toggle documentation menu"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:fixed top-16 left-0 h-[calc(100vh-4rem)]
          w-80 bg-[#0a0a0a] border-r border-white/10
          overflow-y-auto z-30 transition-transform duration-300
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Documentation</h2>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-white/60 hover:text-white"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          <nav>
            {tree.map((item) => (
              <SidebarItem
                key={item.path}
                item={item}
                level={0}
                currentPath={pathname}
                expandedFolders={expandedFolders}
                onToggleFolder={handleToggleFolder}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default DocsSidebar;
