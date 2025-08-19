// lib/github.ts
export interface DevLog {
  name: string;
  path: string;
  download_url: string;
  sha: string;
  size: number;
  html_url: string;
  last_modified?: string;
}

export interface ProcessedDevLog {
  id: string;
  title: string;
  date: string; // This will be in YYYY-MM-DD format for proper sorting
  dayNumber: number;
  excerpt: string;
  content: string;
  githubUrl: string;
  downloadUrl: string;
}

const GITHUB_API_BASE = "https://api.github.com";
const REPO_OWNER = "Michael-Elrod-dev";
const REPO_NAME = "Path-to-Valhalla";
const LOGS_PATH = "docs/00-Development%20Logs/Logs";

// Fetch all dev log files from GitHub
export async function fetchDevLogs(): Promise<DevLog[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${LOGS_PATH}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          // Add GitHub token for higher rate limits (optional)
          // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        },
        // Cache for 5 minutes in production
        next: { revalidate: 86400 },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const files: DevLog[] = await response.json();

    // Filter only .md files from the specific Logs directory
    return files.filter((file) => file.name.endsWith(".md"));
  } catch (error) {
    console.error("Error fetching dev logs:", error);
    return [];
  }
}

// Fetch and process individual dev log content
export async function fetchDevLogContent(downloadUrl: string): Promise<string> {
  try {
    const response = await fetch(downloadUrl, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error("Error fetching dev log content:", error);
    return "";
  }
}

// Extract date from the Date section in markdown content
function extractDateFromContent(content: string): string {
  console.log("=== DEBUG: Raw content ===");
  console.log(content.slice(-200)); // Show last 200 characters
  
  // Look for ### Date section followed by - Month DD, YYYY format
  const dateMatch = content.match(/###\s*Date\s*\n\s*-\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})/i);
  
  console.log("=== DEBUG: Date match ===");
  console.log("Match found:", !!dateMatch);
  if (dateMatch) {
    console.log("Full match:", dateMatch[0]);
    console.log("Captured date:", dateMatch[1]);
  }
  
  if (dateMatch) {
    // Parse the date string directly (e.g., "August 18, 2025")
    const dateString = dateMatch[1].trim();
    console.log("=== DEBUG: Parsing date ===");
    console.log("Date string:", dateString);
    
    const date = new Date(dateString);
    console.log("Parsed Date object:", date);
    console.log("Date toString:", date.toString());
    
    // Convert to YYYY-MM-DD format for consistent sorting
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    
    const result = `${year}-${month}-${day}`;
    console.log("Final result:", result);
    return result;
  }
  
  // Fallback to current date in YYYY-MM-DD format if no date found
  console.log("=== DEBUG: Using fallback date ===");
  const fallback = new Date().toISOString().split("T")[0];
  console.log("Fallback:", fallback);
  return fallback;
}

// Remove the Date section from content for display
function removeMetadataFromContent(content: string): string {
  // Remove the ### Date section and everything after it
  return content.replace(/###\s*Date\s*[\s\S]*$/i, '').trim();
}

// Extract a day number from content or filename (for sorting purposes)
function extractDayNumberFromContent(content: string, filename: string): number {
  // First try to find "Day X" in the content
  const contentMatch = content.match(/Day\s+(\d+)/i);
  if (contentMatch) {
    return parseInt(contentMatch[1], 10);
  }
  
  // Then try filename
  const filenameMatch = filename.match(/Day\s+(\d+)/i);
  if (filenameMatch) {
    return parseInt(filenameMatch[1], 10);
  }
  
  // Fallback: use a hash of the filename for consistent ordering
  let hash = 0;
  for (let i = 0; i < filename.length; i++) {
    const char = filename.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) % 1000; // Keep it reasonable
}

// Process raw dev logs into display format
export async function processDevLogs(
  devLogs: DevLog[]
): Promise<ProcessedDevLog[]> {
  const processed: ProcessedDevLog[] = [];

  for (const log of devLogs) {
    try {
      const fullContent = await fetchDevLogContent(log.download_url);
      const date = extractDateFromContent(fullContent); // Returns YYYY-MM-DD
      const content = removeMetadataFromContent(fullContent); // Remove Date section
      const dayNumber = extractDayNumberFromContent(fullContent, log.name);

      // Create title from filename (remove .md extension)
      const title = log.name.replace(/\.md$/, "");

      // Generate excerpt from content
      const excerpt = `Development progress and updates`;

      processed.push({
        id: log.sha,
        title,
        date, // YYYY-MM-DD format for proper sorting
        dayNumber,
        excerpt,
        content, // Content without the Date section
        githubUrl: log.html_url,
        downloadUrl: log.download_url,
      });
    } catch (error) {
      console.error(`Error processing ${log.name}:`, error);
    }
  }

  // Sort by date (most recent first), then by day number as fallback
  return processed.sort((a, b) => {
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison !== 0) {
      return dateComparison;
    }
    return b.dayNumber - a.dayNumber;
  });
}