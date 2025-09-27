/**
 * Extract the first section from markdown content with limited text after headers
 */
export function getFirstSection(content: string): string {
  if (!content) return "";

  const sections = content.split(/(?=^#{1,3}\s)/m);
  const firstHeaderIndex = sections.findIndex((section) =>
    section.trim().startsWith("#")
  );

  if (firstHeaderIndex !== -1) {
    const firstSection = sections[firstHeaderIndex] || "";
    
    // Limit text after headers to approximately 3 lines (around 200-250 characters)
    const lines = firstSection.split('\n');
    let result = '';
    let lineCount = 0;
    let charCount = 0;
    
    for (const line of lines) {
      result += line + '\n';
      
      // Count non-header lines
      if (!line.trim().startsWith('#') && line.trim().length > 0) {
        lineCount++;
        charCount += line.length;
        
        // Stop after about 3 lines of content or 250 characters
        if (lineCount >= 3 || charCount >= 250) {
          break;
        }
      }
    }
    
    return result.trim();
  }

  return content.length > 250 ? content.substring(0, 250) + "..." : content;
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
