/**
 * Extract the first section from markdown content
 */
export function getFirstSection(content: string): string {
  if (!content) return "";

  const sections = content.split(/(?=^#{1,3}\s)/m);
  const firstHeaderIndex = sections.findIndex((section) =>
    section.trim().startsWith("#")
  );

  if (firstHeaderIndex !== -1) {
    return sections[firstHeaderIndex] || "";
  }

  return content.length > 500 ? content.substring(0, 500) + "..." : content;
}

/**
 * Get remaining content after the first section
 */
export function getRemainingContent(content: string): string {
  if (!content) return "";

  const sections = content.split(/(?=^#{1,3}\s)/m);
  const firstHeaderIndex = sections.findIndex((section) =>
    section.trim().startsWith("#")
  );

  if (firstHeaderIndex !== -1 && sections.length > firstHeaderIndex + 1) {
    return sections.slice(firstHeaderIndex + 1).join("");
  }

  return "";
}
