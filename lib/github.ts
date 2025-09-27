// lib/github.ts
import { 
  extractDateFromContent, 
  removeMetadataFromContent, 
  extractDayNumberFromContent 
} from '@/lib/utils';

export interface BlogPost {
  name: string;
  path: string;
  download_url: string;
  sha: string;
  size: number;
  html_url: string;
  last_modified?: string;
}

export interface ProcessedBlog {
  id: string;
  title: string;
  date: string;
  dayNumber: number;
  excerpt: string;
  content: string;
  githubUrl: string;
  downloadUrl: string;
  type: 'devlog' | 'patch-note';
  gameId: string;
}

const GITHUB_API_BASE = "https://api.github.com";
const REPO_OWNER = "Michael-Elrod-dev";
const REPO_NAME = "Path-to-Valhalla";
const DEV_LOGS_PATH = "docs/00-Development%20Logs/Logs";
const PATCH_NOTES_PATH = "docs/00-Development%20Logs/Patch%20Notes";

export async function fetchBlogs(): Promise<BlogPost[]> {
  try {
    // Fetch from both directories
    const [devLogsResponse, patchNotesResponse] = await Promise.all([
      fetch(
        `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DEV_LOGS_PATH}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
          next: { revalidate: 86400 },
        }
      ),
      fetch(
        `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PATCH_NOTES_PATH}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
          next: { revalidate: 86400 },
        }
      )
    ]);

    const blogs: BlogPost[] = [];
    
    // Process dev logs
    if (devLogsResponse.ok) {
      const devLogFiles: BlogPost[] = await devLogsResponse.json();
      blogs.push(...devLogFiles.filter((file) => file.name.endsWith(".md")));
    } else {
      console.warn(`Dev logs API error: ${devLogsResponse.status}`);
    }

    // Process patch notes
    if (patchNotesResponse.ok) {
      const patchNoteFiles: BlogPost[] = await patchNotesResponse.json();
      blogs.push(...patchNoteFiles.filter((file) => file.name.endsWith(".md")));
    } else {
      console.warn(`Patch notes API error: ${patchNotesResponse.status}`);
    }

    return blogs;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function fetchBlogContent(downloadUrl: string): Promise<string> {
  try {
    const response = await fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error("Error fetching blog content:", error);
    return "";
  }
}

function determineTypeFromPath(path: string): 'devlog' | 'patch-note' {
  if (path.includes('Patch%20Notes') || path.includes('Patch Notes')) {
    return 'patch-note';
  }
  return 'devlog';
}

function determineGameId(path: string, content: string): string {
  // For now, we'll default to 'path-to-valhalla' since that's our only game
  return 'path-to-valhalla';
}

export async function processBlogs(
  blogs: BlogPost[]
): Promise<ProcessedBlog[]> {
  const processed: ProcessedBlog[] = [];

  for (const blog of blogs) {
    try {
      const fullContent = await fetchBlogContent(blog.download_url);
      const date = extractDateFromContent(fullContent);
      const content = removeMetadataFromContent(fullContent);
      const dayNumber = extractDayNumberFromContent(fullContent, blog.name);
      const type = determineTypeFromPath(blog.path);
      const gameId = determineGameId(blog.path, fullContent);

      const title = blog.name.replace(/\.md$/, "");
      const excerpt = type === 'patch-note' 
        ? 'Game update with bug fixes and new features'
        : 'Development progress and updates';

      processed.push({
        id: blog.sha,
        title,
        date,
        dayNumber,
        excerpt,
        content,
        githubUrl: blog.html_url,
        downloadUrl: blog.download_url,
        type,
        gameId,
      });
    } catch (error) {
      console.error(`Error processing ${blog.name}:`, error);
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
