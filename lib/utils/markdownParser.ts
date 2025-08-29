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
 * Get remaining content after the first section, excluding internal sections
 */
export function getRemainingContent(content: string): string {
  if (!content) return "";

  const sections = content.split(/(?=^#{1,3}\s)/m);
  const firstHeaderIndex = sections.findIndex((section) =>
    section.trim().startsWith("#")
  );

  if (firstHeaderIndex !== -1 && sections.length > firstHeaderIndex + 1) {
    // Filter out internal/dataview sections
    const filteredSections = sections.slice(firstHeaderIndex + 1).filter((section) => {
      const trimmedSection = section.trim();
      return !trimmedSection.startsWith("### Active Tasks") && 
             !trimmedSection.startsWith("## Active Tasks") &&
             !trimmedSection.includes("```dataview");
    });
    
    return filteredSections.join("");
  }

  return "";
}
