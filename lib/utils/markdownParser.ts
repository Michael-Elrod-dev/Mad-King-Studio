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
 * Get remaining content after the first section, excluding internal sections
 */
export function getRemainingContent(content: string): string {
  if (!content) return "";

  const sections = content.split(/(?=^#{1,3}\s)/m);
  const firstHeaderIndex = sections.findIndex((section) =>
    section.trim().startsWith("#")
  );

  if (firstHeaderIndex !== -1) {
    const firstSection = sections[firstHeaderIndex] || "";
    
    const lines = firstSection.split('\n');
    let lineCount = 0;
    let charCount = 0;
    let truncatedAtLine = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (!line.trim().startsWith('#') && line.trim().length > 0) {
        lineCount++;
        charCount += line.length;
        
        if (lineCount >= 3 || charCount >= 250) {
          truncatedAtLine = i;
          break;
        }
      }
    }
    
    const remainingFirstSection = lines.slice(truncatedAtLine + 1).join('\n').trim();
    
    const subsequentSections = sections.slice(firstHeaderIndex + 1).filter((section) => {
      const trimmedSection = section.trim();
      return !trimmedSection.startsWith("### Active Tasks") && 
             !trimmedSection.startsWith("## Active Tasks") &&
             !trimmedSection.includes("```dataview");
    });
    
    const allRemainingContent = [remainingFirstSection, ...subsequentSections]
      .filter(section => section.trim().length > 0)
      .join("\n\n");
    
    return allRemainingContent;
  }

  return "";
}
