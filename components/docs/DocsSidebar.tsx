// components/docs/DocsSidebar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cleanDisplayName, pathToSlug } from "@/lib/parsers/docs";
import type { DocFile } from "@/lib/data/docs";

interface DocsSidebarProps {
  tree: DocFile[];
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

interface SidebarItemProps {
  item: DocFile;
  level: number;
  currentPath: string;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
  onFileClick: () => void;
}

const SidebarItem = ({
  item,
  level,
  currentPath,
  expandedFolders,
  onToggleFolder,
  onFileClick,
}: SidebarItemProps) => {
  const isFolder = item.type === "dir";
  const hasChildren = isFolder && item.children && item.children.length > 0;

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
        style={{
          paddingLeft:
            isFolder && hasChildren
              ? `${level * 16 + 12}px`
              : `${level * 16 + 12 + 24}px`,
        }}
      >
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

        {isFolder ? (
          <span
            className={`text-sm flex-1 cursor-pointer font-semibold truncate min-w-0 ${
              isActive ? "text-white" : "text-white/90"
            }`}
            onClick={handleFolderClick}
            title={displayName}
          >
            {displayName}
          </span>
        ) : (
          <Link
            href={itemPath}
            onClick={onFileClick}
            className={`text-sm flex-1 font-normal truncate min-w-0 block ${
              isActive ? "text-white" : "text-white/80"
            }`}
            title={displayName}
          >
            {displayName}
          </Link>
        )}
      </div>

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
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DocsSidebar = ({ tree, isOpen, onToggle }: DocsSidebarProps) => {
  const pathname = usePathname();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );
  const [showOpenButton, setShowOpenButton] = useState(false);

  // Handle the fade-in delay for the open button
  useEffect(() => {
    if (!isOpen) {
      // Delay showing the button to allow sidebar close animation to complete
      const timer = setTimeout(() => {
        setShowOpenButton(true);
      }, 150); // Half of the sidebar transition time (300ms)
      return () => clearTimeout(timer);
    } else {
      setShowOpenButton(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const pathParts = pathname.split("/").filter(Boolean);

    setExpandedFolders((prev) => {
      const newSet = new Set(prev);

      const findAndExpandPath = (
        items: DocFile[],
        currentPath: string[] = [],
      ) => {
        for (const item of items) {
          const itemPathParts = item.path.split("/").filter(Boolean);

          const isInPath = pathParts.some((part, index) => {
            const normalizedPart = part.toLowerCase().replace(/-/g, " ");
            const normalizedItemPart = itemPathParts[itemPathParts.length - 1]
              ?.toLowerCase()
              .replace(/-/g, " ")
              .replace(/\.md$/i, "");
            return normalizedPart === normalizedItemPart;
          });

          if (item.type === "dir" && isInPath) {
            newSet.add(item.path);
            if (item.children) {
              findAndExpandPath(item.children, [...currentPath, item.path]);
            }
          } else if (item.type === "dir" && item.children) {
            findAndExpandPath(item.children, [...currentPath, item.path]);
          }

          if (item.type === "file") {
            const itemSlug = pathToSlug(item.path);
            if (pathname === `/docs/${itemSlug}`) {
              currentPath.forEach((folderPath) => newSet.add(folderPath));
            }
          }
        }
      };

      findAndExpandPath(tree);
      return newSet;
    });
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

  const handleOverlayClick = () => {
    onToggle(false);
  };

  const toggleSidebar = () => {
    onToggle(!isOpen);
  };

  const handleFileClick = () => {
    if (window.innerWidth < 1024) {
      onToggle(false);
    }
  };

  return (
    <>
      {/* Toggle Button - shows when sidebar is closed with fade-in animation */}
      {!isOpen && showOpenButton && (
        <button
          onClick={toggleSidebar}
          className="fixed top-20 left-4 z-50 bg-red-500 text-white p-2 rounded-lg shadow-lg hover:bg-red-600 transition-all animate-in fade-in duration-200"
          aria-label="Open documentation sidebar"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </button>
      )}

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)]
          w-80 bg-[#0a0a0a] border-r border-white/10
          overflow-y-auto transition-transform duration-300 z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white truncate">
              Documentation
            </h2>
            <button
              onClick={toggleSidebar}
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors flex-shrink-0"
              aria-label="Close documentation sidebar"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
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
                onFileClick={handleFileClick}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default DocsSidebar;
