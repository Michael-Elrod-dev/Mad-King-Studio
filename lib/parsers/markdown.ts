// lib/utils/markdownParser.ts
import { MARKDOWN_CONFIG } from "../data/constants";

export function getFirstSection(content: string): string {
  if (!content) return "";

  const sections = content.split(/(?=^#{1,3}\s)/m);
  const firstHeaderIndex = sections.findIndex((section) =>
    section.trim().startsWith("#"),
  );

  if (firstHeaderIndex !== -1) {
    const firstSection = sections[firstHeaderIndex] || "";

    const lines = firstSection.split("\n");
    let result = "";
    let lineCount = 0;
    let charCount = 0;

    for (const line of lines) {
      result += line + "\n";

      if (!line.trim().startsWith("#") && line.trim().length > 0) {
        lineCount++;
        charCount += line.length;

        if (
          lineCount >= MARKDOWN_CONFIG.MAX_FIRST_SECTION_LINES ||
          charCount >= MARKDOWN_CONFIG.MAX_FIRST_SECTION_CHARS
        ) {
          break;
        }
      }
    }

    return result.trim();
  }

  return content.length > MARKDOWN_CONFIG.MAX_FIRST_SECTION_CHARS
    ? content.substring(0, MARKDOWN_CONFIG.MAX_FIRST_SECTION_CHARS) + "..."
    : content;
}

export function getCompleteFirstSection(content: string): string {
  if (!content) return "";

  const sections = content.split(/(?=^#{1,3}\s)/m);
  const firstHeaderIndex = sections.findIndex((section) =>
    section.trim().startsWith("#"),
  );

  if (firstHeaderIndex !== -1) {
    return sections[firstHeaderIndex] || "";
  }

  return content;
}

export function getRemainingContent(content: string): string {
  if (!content) return "";

  const sections = content.split(/(?=^#{1,3}\s)/m);
  const firstHeaderIndex = sections.findIndex((section) =>
    section.trim().startsWith("#"),
  );

  if (firstHeaderIndex !== -1 && sections.length > firstHeaderIndex + 1) {
    return sections.slice(firstHeaderIndex + 1).join("");
  }

  return "";
}
