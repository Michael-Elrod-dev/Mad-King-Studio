// lib/github.ts
import { DOCS_CONFIG } from './docsData';
import type { DocFile } from './docsData';
import { 
  extractDateFromContent,
  removeMetadataFromContent,
  extractDayNumberFromContent,
  extractAssetsFromContent
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
  assets: string[];
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
  // For now, we'll default to 'path-to-valhalla' since that's the only game
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
      const assets = extractAssetsFromContent(fullContent);
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
        assets,
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

/**
 * Recursively fetch directory tree structure from GitHub
 */
export async function fetchDocsTree(path: string = DOCS_CONFIG.DOCS_PATH): Promise<DocFile[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${DOCS_CONFIG.REPO_OWNER}/${DOCS_CONFIG.REPO_NAME}/contents/${path}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const items: DocFile[] = await response.json();
    
    // Filter out excluded folders at root level
    const excludedFolders: string[] = [...DOCS_CONFIG.EXCLUDED_FOLDERS]; // Convert to string array
    const filteredItems = items.filter(item => {
      if (path === DOCS_CONFIG.DOCS_PATH && item.type === 'dir') {
        return !excludedFolders.includes(item.name);
      }
      return true;
    });

    // Recursively fetch children for directories
    const itemsWithChildren = await Promise.all(
      filteredItems.map(async (item) => {
        if (item.type === 'dir') {
          const children = await fetchDocsTree(item.path);
          return { ...item, children };
        }
        return item;
      })
    );

    return itemsWithChildren;
  } catch (error) {
    console.error("Error fetching docs tree:", error);
    return [];
  }
}

/**
 * Fetch a specific doc file by path
 */
export async function fetchDocByPath(path: string): Promise<{
  content: string;
  sha: string;
} | null> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${DOCS_CONFIG.REPO_OWNER}/${DOCS_CONFIG.REPO_NAME}/contents/${path}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    // GitHub returns base64 encoded content
    if (data.content) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return {
        content,
        sha: data.sha,
      };
    }

    // If it's a file object with download_url
    if (data.download_url) {
      const contentResponse = await fetch(data.download_url, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        next: { revalidate: 3600 },
      });
      
      if (!contentResponse.ok) {
        return null;
      }

      return {
        content: await contentResponse.text(),
        sha: data.sha,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching doc by path:", error);
    return null;
  }
}

/**
 * Build navigation structure from doc tree
 */
export function buildDocsNavigation(tree: DocFile[]): DocFile[] {
  // Sort: directories first, then files. Within each group, sort alphabetically
  return tree
    .sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'dir' ? -1 : 1;
    })
    .map(item => {
      if (item.children) {
        return {
          ...item,
          children: buildDocsNavigation(item.children),
        };
      }
      return item;
    });
}
