// lib/utils/content.ts
import { API_LINKS, MEDIA_CONFIG } from "../constants";

export function convertLocalImagesToS3(
  content: string,
  currentDocPath: string,
): string {
  const imageExtensions = MEDIA_CONFIG.SUPPORTED_IMAGE_FORMATS.join("|");
  const videoExtensions = MEDIA_CONFIG.SUPPORTED_VIDEO_FORMATS.join("|");
  const allExtensions = `${imageExtensions}|${videoExtensions}`;

  // Handle Obsidian-style image embeds: ![[image.png]]
  const obsidianRegex = new RegExp(
    `!\\[\\[([^\\]]+\\.(${allExtensions}))\\]\\]`,
    "gi",
  );
  content = content.replace(obsidianRegex, (match, filename) => {
    const cleanFilename = filename.trim();
    return `![${cleanFilename}](${API_LINKS.S3_DOCS_IMAGES}/${cleanFilename})`;
  });

  // Handle markdown relative paths
  const relativeRegex = new RegExp(
    `!\\[([^\\]]*)\\]\\(\\.\\.\?/([^\\)]+\\.(${allExtensions}))\\)`,
    "gi",
  );
  content = content.replace(relativeRegex, (match, alt, path) => {
    const filename = path.split("/").pop();
    return `![${alt}](${API_LINKS.S3_DOCS_IMAGES}/${filename})`;
  });

  // Handle markdown same-directory references
  const sameDirectoryRegex = new RegExp(
    `!\\[([^\\]]*)\\]\\(([^\\/\\)]+\\.(${allExtensions}))\\)`,
    "gi",
  );
  content = content.replace(sameDirectoryRegex, (match, alt, filename) => {
    if (filename.startsWith("http")) {
      return match;
    }
    return `![${alt}](${API_LINKS.S3_DOCS_IMAGES}/${filename})`;
  });

  return content;
}

function replaceObsidianLinks(content: string): string {
  const obsidianLinkRegex = /\[\[(?:(.+?)\|)?(.+?)\]\]/g;

  return content.replace(
    obsidianLinkRegex,
    (match, pathOrAlias, displayText) => {
      return displayText;
    },
  );
}

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

export function removeMetadataFromContent(content: string): string {
  const withoutMetadata = content
    .replace(/###\s*Date\s*[\s\S]*?(?=\n###|\n##|$)/gi, "")
    .replace(/###\s*Assets\s*[\s\S]*?(?=\n###|\n##|$)/gi, "")
    .trim();

  return replaceObsidianLinks(withoutMetadata);
}

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

export function extractAssetsFromContent(content: string): string[] {
  const assetsMatch = content.match(
    /###\s*Assets\s*\n([\s\S]*?)(?=\n###|\n##|$)/i,
  );

  const imageExtensions = MEDIA_CONFIG.SUPPORTED_IMAGE_FORMATS.join("|");
  const videoExtensions = MEDIA_CONFIG.SUPPORTED_VIDEO_FORMATS.join("|");
  const allExtensions = `${imageExtensions}|${videoExtensions}`;
  const urlRegex = new RegExp(
    `https?:\\/\\/[^\\s\\)]+\\.(${allExtensions})`,
    "gi",
  );

  if (!assetsMatch) {
    const urls = content.match(urlRegex) || [];
    return urls.map((url) => url.trim());
  }

  const assetsSection = assetsMatch[1];
  const urls = assetsSection.match(urlRegex) || [];

  return urls.map((url) => url.trim());
}

export function getMediaType(url: string): "image" | "video" | "gif" {
  const extension = url.split(".").pop()?.toLowerCase();

  if (extension === "gif") return "gif";
  if (
    extension &&
    (MEDIA_CONFIG.SUPPORTED_VIDEO_FORMATS as readonly string[]).includes(
      extension,
    )
  ) {
    return "video";
  }
  return "image";
}

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
  const imageExtensions = MEDIA_CONFIG.SUPPORTED_IMAGE_FORMATS.join("|");
  const videoExtensions = MEDIA_CONFIG.SUPPORTED_VIDEO_FORMATS.join("|");
  const allExtensions = `${imageExtensions}|${videoExtensions}`;
  const urlRegex = new RegExp(
    `https?:\\/\\/[^\\s\\)]+\\.(${allExtensions})`,
    "gi",
  );
  const assets = (assetsSection.match(urlRegex) || []).map((url) => url.trim());

  const cleanedContent = content.replace(assetsRegex, "").trim();

  return { assets, cleanedContent };
}
