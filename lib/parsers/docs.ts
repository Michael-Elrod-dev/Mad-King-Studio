// lib/utils/docsParser.ts
import { DOCS_CONFIG } from "../data/docs";
import type { DocFile } from "../data/docs";

/**
 * Convert file path to URL slug
 * Example: "docs/00-Development Logs/Log Overview.md" → "00-development-logs/log-overview"
 */
export function pathToSlug(path: string): string {
  // Remove docs prefix and .md extension
  let slug = path
    .replace(`${DOCS_CONFIG.DOCS_PATH}/`, "")
    .replace(/\.md$/i, "");

  // Convert to lowercase and replace spaces with hyphens
  slug = slug.toLowerCase().replace(/\s+/g, "-");

  return slug;
}

/**
 * Convert URL slug back to approximate file path
 * We need to store/fetch the actual case-sensitive path from the tree
 */
export function slugToPath(slug: string | string[]): string {
  const slugStr = Array.isArray(slug) ? slug.join("/") : slug;

  // Split into parts and try to restore proper casing
  const parts = slugStr.split("/").map((part) => {
    // Check if it starts with a number prefix (like 00-, 01-, etc)
    const numberMatch = part.match(/^(\d+-)/);
    const prefix = numberMatch ? numberMatch[1] : "";
    const rest = numberMatch ? part.slice(numberMatch[1].length) : part;

    // Capitalize each word after hyphen
    const titleCased = rest
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return prefix + titleCased;
  });

  return `${DOCS_CONFIG.DOCS_PATH}/${parts.join("/")}.md`;
}

/**
 * Find the actual file path in the tree by matching slug
 */
export function findFilePathInTree(
  tree: DocFile[],
  slug: string,
): string | null {
  const slugParts = slug.toLowerCase().split("/");

  function searchTree(items: DocFile[], depth: number): string | null {
    for (const item of items) {
      const itemSlug = pathToSlug(item.path);
      const itemSlugParts = itemSlug.split("/");

      // Check if this item matches the current slug
      if (itemSlug === slug) {
        return item.path;
      }

      // Check if we should search this folder's children
      if (
        item.type === "dir" &&
        item.children &&
        itemSlugParts.length <= slugParts.length &&
        itemSlugParts.every((part, i) => part === slugParts[i])
      ) {
        const result = searchTree(item.children, depth + 1);
        if (result) return result;
      }
    }
    return null;
  }

  return searchTree(tree, 0);
}

/**
 * Extract title from markdown content (first # heading or filename)
 */
export function extractTitle(content: string, fallbackName: string): string {
  // First, try to get the title from the first # heading in the content
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    return titleMatch[1].trim();
  }

  // If no heading found, use the fallback name but preserve its original casing
  // Only remove .md extension and any numbering prefix
  return fallbackName.replace(/\.md$/i, "").replace(/^\d+-/, "").trim();
}

/**
 * Convert Obsidian wiki links to Next.js route paths
 * Handles: [[Page]], [[folder/Page]], [[Page|Alias]]
 */
export function convertWikiLinksToRoutes(
  content: string,
  currentPath: string,
): string {
  const wikiLinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

  return content.replace(wikiLinkRegex, (match, linkPath, alias) => {
    const displayText = alias || linkPath.split("/").pop();

    // Clean the link path and convert to slug format
    const cleanedPath = linkPath
      .trim()
      .toLowerCase()
      .replace(/\.md$/i, "") // Remove .md if present
      .replace(/\s+/g, "-"); // Replace spaces with hyphens

    // Create the route path
    const routePath = `/docs/${cleanedPath}`;

    // Return as markdown link that ReactMarkdown will convert to <a>
    return `[${displayText}](${routePath})`;
  });
}

/**
 * Clean folder/file name for display
 * Removes numbering prefixes like "01-" and cleans up formatting
 */
export function cleanDisplayName(name: string): string {
  return name
    .replace(/^\d+-/, "") // Remove number prefix
    .replace(/-/g, " ") // Replace hyphens with spaces
    .replace(/\.md$/i, "") // Remove .md extension
    .trim();
}

/**
 * Build breadcrumb trail from path
 */
export function buildBreadcrumbs(
  path: string,
): Array<{ name: string; path: string }> {
  const parts = path
    .replace(`${DOCS_CONFIG.DOCS_PATH}/`, "")
    .replace(/\.md$/i, "")
    .split("/");

  const breadcrumbs = [{ name: "Docs", path: "/docs" }];

  let currentPath = "";
  parts.forEach((part, index) => {
    currentPath +=
      (index === 0 ? "" : "/") + part.toLowerCase().replace(/\s+/g, "-");
    breadcrumbs.push({
      name: cleanDisplayName(part),
      path: `/docs/${currentPath}`,
    });
  });

  return breadcrumbs;
}
