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
 * Remove metadata sections from markdown content
 */
export function removeMetadataFromContent(content: string): string {
  return content.replace(/###\s*Date\s*[\s\S]*$/i, '').trim();
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
