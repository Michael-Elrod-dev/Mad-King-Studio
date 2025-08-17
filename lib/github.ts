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
  date: string;
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

    // Filter only .md files and sort by day number
    return files
      .filter(
        (file) => file.name.endsWith(".md") && file.name.startsWith("Day")
      )
      .sort((a, b) => {
        const dayA = extractDayNumber(a.name);
        const dayB = extractDayNumber(b.name);
        return dayB - dayA; // Most recent first
      });
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

// Extract day number from filename
function extractDayNumber(filename: string): number {
  const match = filename.match(/Day (\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

// Extract date from filename
function extractDate(filename: string): string {
  const match = filename.match(/\((\d+-\d+-\d+)\)/);
  if (match) {
    const [month, day, year] = match[1].split("-");
    return `20${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return new Date().toISOString().split("T")[0];
}

// Process raw dev logs into display format
export async function processDevLogs(
  devLogs: DevLog[]
): Promise<ProcessedDevLog[]> {
  const processed: ProcessedDevLog[] = [];

  for (const log of devLogs) {
    try {
      const content = await fetchDevLogContent(log.download_url);
      const dayNumber = extractDayNumber(log.name);
      const date = extractDate(log.name);

      // For GitHub posts, we'll show full content, so excerpt can be shorter
      const excerpt = `Development progress and updates for Day ${dayNumber}`;

      processed.push({
        id: log.sha,
        title: log.name.replace(".md", ""), // <-- Changed this line!
        date,
        dayNumber,
        excerpt,
        content, // Full markdown content
        githubUrl: log.html_url,
        downloadUrl: log.download_url,
      });
    } catch (error) {
      console.error(`Error processing ${log.name}:`, error);
    }
  }

  return processed;
}
