// lib/utils/content.ts
const S3_BUCKET_URL = "https://mad-king-studio.s3.amazonaws.com/docs-images";

/**
 * Convert local/Obsidian image references to S3 URLs
 * Handles: ![[image.png]], ![](./path/image.png), ![](../path/image.png)
 */
export function convertLocalImagesToS3(
  content: string,
  currentDocPath: string,
): string {
  // Handle Obsidian-style image embeds: ![[image.png]]
  content = content.replace(
    /!\[\[([^\]]+\.(jpg|jpeg|png|gif|webp|mp4|webm|mov))\]\]/gi,
    (match, filename) => {
      const cleanFilename = filename.trim();
      return `![${cleanFilename}](${S3_BUCKET_URL}/${cleanFilename})`;
    },
  );

  // Handle markdown relative paths: ![alt](./images/image.png) or ![alt](../images/image.png)
  content = content.replace(
    /!\[([^\]]*)\]\(\.\.?\/([^\)]+\.(jpg|jpeg|png|gif|webp|mp4|webm|mov))\)/gi,
    (match, alt, path) => {
      // Extract just the filename from the path
      const filename = path.split("/").pop();
      return `![${alt}](${S3_BUCKET_URL}/${filename})`;
    },
  );

  // Handle markdown same-directory references: ![alt](image.png)
  content = content.replace(
    /!\[([^\]]*)\]\(([^\/\)]+\.(jpg|jpeg|png|gif|webp|mp4|webm|mov))\)/gi,
    (match, alt, filename) => {
      // Skip if it's already a full URL
      if (filename.startsWith("http")) {
        return match;
      }
      return `![${alt}](${S3_BUCKET_URL}/${filename})`;
    },
  );

  return content;
}

/**
 * Replace Obsidian wiki links with their display text
 * Handles both simple links [[filename]] and aliased links [[path/file|alias]]
 *
 * Examples:
 * - [[00-Home]] → 00-Home
 * - [[02-Game Art/Levels/01-Midgard|01-Midgard]] → 01-Midgard
 */
function replaceObsidianLinks(content: string): string {
  const obsidianLinkRegex = /\[\[(?:(.+?)\|)?(.+?)\]\]/g;

  return content.replace(
    obsidianLinkRegex,
    (match, pathOrAlias, displayText) => {
      return displayText;
    },
  );
}

/**
 * Extract date from markdown content in ### Date section
 */
export function extractDateFromContent(content: string): string {
  const dateMatch = content.match(
    /###\s*Date\s*\n\s*-\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})/i,
  );

  if (dateMatch) {
    const dateString = dateMatch[1].trim();
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return new Date().toISOString().split("T")[0];
}

/**
 * Remove metadata sections from markdown content and replace Obsidian links
 */
export function removeMetadataFromContent(content: string): string {
  const withoutMetadata = content
    .replace(/###\s*Date\s*[\s\S]*?(?=\n###|\n##|$)/gi, "")
    .replace(/###\s*Assets\s*[\s\S]*?(?=\n###|\n##|$)/gi, "")
    .trim();

  return replaceObsidianLinks(withoutMetadata);
}

/**
 * Extract day number from content or filename for sorting
 */
export function extractDayNumberFromContent(
  content: string,
  filename: string,
): number {
  const contentMatch = content.match(/Day\s+(\d+)/i);
  if (contentMatch) return parseInt(contentMatch[1], 10);

  const filenameMatch = filename.match(/Day\s+(\d+)/i);
  if (filenameMatch) return parseInt(filenameMatch[1], 10);

  let hash = 0;
  for (let i = 0; i < filename.length; i++) {
    const char = filename.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % 1000;
}

/**
 * Extract assets from the ### Assets section of markdown content
 */
export function extractAssetsFromContent(content: string): string[] {
  const assetsMatch = content.match(
    /###\s*Assets\s*\n([\s\S]*?)(?=\n###|\n##|$)/i,
  );

  if (!assetsMatch) {
    // Also look for any image URLs in the content
    const urlRegex =
      /https?:\/\/[^\s\)]+\.(jpg|jpeg|png|gif|webp|mp4|webm|mov)/gi;
    const urls = content.match(urlRegex) || [];
    return urls.map((url) => url.trim());
  }

  const assetsSection = assetsMatch[1];
  const urlRegex =
    /https?:\/\/[^\s\)]+\.(jpg|jpeg|png|gif|webp|mp4|webm|mov)/gi;
  const urls = assetsSection.match(urlRegex) || [];

  return urls.map((url) => url.trim());
}

/**
 * Determine media type from URL with GIF support
 */
export function getMediaType(url: string): "image" | "video" | "gif" {
  const videoExtensions = ["mp4", "webm", "mov", "avi"];
  const extension = url.split(".").pop()?.toLowerCase();

  if (extension === "gif") return "gif";
  if (videoExtensions.includes(extension || "")) return "video";
  return "image";
}

/**
 * Extract and remove assets section, returning both the assets and cleaned content
 */
export function extractAndRemoveAssetsSection(content: string): {
  assets: string[];
  cleanedContent: string;
} {
  const assetsRegex = /###\s*Assets\s*\n([\s\S]*?)(?=\n###|\n##|$)/i;
  const match = content.match(assetsRegex);

  if (!match) {
    return { assets: [], cleanedContent: content };
  }

  const assetsSection = match[1];
  const urlRegex =
    /https?:\/\/[^\s\)]+\.(jpg|jpeg|png|gif|webp|mp4|webm|mov)/gi;
  const assets = (assetsSection.match(urlRegex) || []).map((url) => url.trim());

  // Remove the entire Assets section from content
  const cleanedContent = content.replace(assetsRegex, "").trim();

  return { assets, cleanedContent };
}
