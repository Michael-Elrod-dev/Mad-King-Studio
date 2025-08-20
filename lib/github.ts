// lib/github.ts
import { 
  extractDateFromContent, 
  removeMetadataFromContent, 
  extractDayNumberFromContent 
} from '@/lib/utils';

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

export async function fetchDevLogs(): Promise<DevLog[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${LOGS_PATH}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        // Cache for 5 minutes
        next: { revalidate: 86400 },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const files: DevLog[] = await response.json();

    // Filter only .md files from the Logs directory
    return files.filter((file) => file.name.endsWith(".md"));
  } catch (error) {
    console.error("Error fetching dev logs:", error);
    return [];
  }
}

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

export async function processDevLogs(
  devLogs: DevLog[]
): Promise<ProcessedDevLog[]> {
  const processed: ProcessedDevLog[] = [];

  for (const log of devLogs) {
    try {
      const fullContent = await fetchDevLogContent(log.download_url);
      const date = extractDateFromContent(fullContent);
      const content = removeMetadataFromContent(fullContent);
      const dayNumber = extractDayNumberFromContent(fullContent, log.name);

      const title = log.name.replace(/\.md$/, "");
      const excerpt = `Development progress and updates`;

      processed.push({
        id: log.sha,
        title,
        date,
        dayNumber,
        excerpt,
        content,
        githubUrl: log.html_url,
        downloadUrl: log.download_url,
      });
    } catch (error) {
      console.error(`Error processing ${log.name}:`, error);
    }
  }

  return processed.sort((a, b) => {
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison !== 0) {
      return dateComparison;
    }
    return b.dayNumber - a.dayNumber;
  });
}
