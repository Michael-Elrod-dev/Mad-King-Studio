// lib/utils/content.ts

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
  
  return content.replace(obsidianLinkRegex, (match, pathOrAlias, displayText) => {
    return displayText;
  });
}

/**
 * Extract date from markdown content in ### Date section
 */
export function extractDateFromContent(content: string): string {
  const dateMatch = content.match(/###\s*Date\s*\n\s*-\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})/i);
  
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
    .replace(/###\s*Date\s*[\s\S]*?(?=\n###|\n##|$)/gi, '')
    .replace(/###\s*Assets\s*[\s\S]*?(?=\n###|\n##|$)/gi, '')
    .trim();
  
  return replaceObsidianLinks(withoutMetadata);
}

/**
 * Extract day number from content or filename for sorting
 */
export function extractDayNumberFromContent(content: string, filename: string): number {
  const contentMatch = content.match(/Day\s+(\d+)/i);
  if (contentMatch) return parseInt(contentMatch[1], 10);
  
  const filenameMatch = filename.match(/Day\s+(\d+)/i);
  if (filenameMatch) return parseInt(filenameMatch[1], 10);
  
  let hash = 0;
  for (let i = 0; i < filename.length; i++) {
    const char = filename.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % 1000;
}

/**
 * Extract assets from the ### Assets section of markdown content
 */
export function extractAssetsFromContent(content: string): string[] {
  const assetsMatch = content.match(/###\s*Assets\s*\n([\s\S]*?)(?=\n###|\n##|$)/i);
  
  if (!assetsMatch) return [];
  
  const assetsSection = assetsMatch[1];
  const urlRegex = /https?:\/\/[^\s\)]+\.(jpg|jpeg|png|gif|webp|mp4|webm|mov)/gi;
  const urls = assetsSection.match(urlRegex) || [];
  
  return urls.map(url => url.trim());
}

/**
 * Determine media type from URL with GIF support
 */
export function getMediaType(url: string): 'image' | 'video' | 'gif' {
  const videoExtensions = ['mp4', 'webm', 'mov', 'avi'];
  const extension = url.split('.').pop()?.toLowerCase();
  
  if (extension === 'gif') return 'gif';
  if (videoExtensions.includes(extension || '')) return 'video';
  return 'image';
}
