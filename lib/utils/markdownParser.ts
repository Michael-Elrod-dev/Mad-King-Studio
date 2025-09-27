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
 * Get the complete first section without truncation
 */
export function getCompleteFirstSection(content: string): string {
  if (!content) return "";

  const sections = content.split(/(?=^#{1,3}\s)/m);
  const firstHeaderIndex = sections.findIndex((section) =>
    section.trim().startsWith("#")
  );

  if (firstHeaderIndex !== -1) {
    return sections[firstHeaderIndex] || "";
  }

  return content;
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
    // Only get subsequent sections, not the remaining part of the first section
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
