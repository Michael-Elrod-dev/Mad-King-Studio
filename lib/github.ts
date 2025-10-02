// lib/github.ts
import {
  DOCS_CONFIG,
  GITHUB_CONFIG,
  POLLING_INTERVALS,
  GAME_IDS,
  BLOG_TYPES,
} from "./constants";
import type { DocFile } from "./docsData";
import {
  extractDateFromContent,
  removeMetadataFromContent,
  extractDayNumberFromContent,
  extractAssetsFromContent,
} from "@/lib/utils";

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
  type: "devlog" | "patch-note";
  gameId: string;
}

export async function fetchBlogs(): Promise<BlogPost[]> {
  try {
    const [devLogsResponse, patchNotesResponse] = await Promise.all([
      fetch(
        `${GITHUB_CONFIG.API_BASE}/repos/${GITHUB_CONFIG.REPO_OWNER}/${GITHUB_CONFIG.REPO_NAME}/contents/${GITHUB_CONFIG.DEV_LOGS_PATH}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
          next: { revalidate: POLLING_INTERVALS.BLOG_POSTS },
        },
      ),
      fetch(
        `${GITHUB_CONFIG.API_BASE}/repos/${GITHUB_CONFIG.REPO_OWNER}/${GITHUB_CONFIG.REPO_NAME}/contents/${GITHUB_CONFIG.PATCH_NOTES_PATH}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
          next: { revalidate: POLLING_INTERVALS.BLOG_POSTS },
        },
      ),
    ]);

    const blogs: BlogPost[] = [];

    if (devLogsResponse.ok) {
      const devLogFiles: BlogPost[] = await devLogsResponse.json();
      blogs.push(...devLogFiles.filter((file) => file.name.endsWith(".md")));
    } else {
      console.warn(`Dev logs API error: ${devLogsResponse.status}`);
    }

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
      next: { revalidate: POLLING_INTERVALS.BLOG_POSTS },
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

function determineTypeFromPath(path: string): "devlog" | "patch-note" {
  if (path.includes("Patch%20Notes") || path.includes("Patch Notes")) {
    return BLOG_TYPES.PATCH_NOTE;
  }
  return BLOG_TYPES.DEVLOG;
}

function determineGameId(path: string, content: string): string {
  return GAME_IDS.PATH_TO_VALHALLA;
}

export async function processBlogs(
  blogs: BlogPost[],
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
      const excerpt =
        type === BLOG_TYPES.PATCH_NOTE
          ? "Game update with bug fixes and new features"
          : "Development progress and updates";

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
    const dateComparison =
      new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison !== 0) {
      return dateComparison;
    }
    return b.dayNumber - a.dayNumber;
  });
}

export async function fetchDocsTree(
  path: string = DOCS_CONFIG.DOCS_PATH,
): Promise<DocFile[]> {
  try {
    const response = await fetch(
      `${GITHUB_CONFIG.API_BASE}/repos/${DOCS_CONFIG.REPO_OWNER}/${DOCS_CONFIG.REPO_NAME}/contents/${path}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        next: { revalidate: POLLING_INTERVALS.DOCS_TREE },
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const items: DocFile[] = await response.json();

    const excludedFolders: string[] = [...DOCS_CONFIG.EXCLUDED_FOLDERS];
    const filteredItems = items.filter((item) => {
      if (path === DOCS_CONFIG.DOCS_PATH && item.type === "dir") {
        return !excludedFolders.includes(item.name);
      }
      return true;
    });

    const itemsWithChildren = await Promise.all(
      filteredItems.map(async (item) => {
        if (item.type === "dir") {
          const children = await fetchDocsTree(item.path);
          return { ...item, children };
        }
        return item;
      }),
    );

    return itemsWithChildren;
  } catch (error) {
    console.error("Error fetching docs tree:", error);
    return [];
  }
}

export async function fetchDocByPath(path: string): Promise<{
  content: string;
  sha: string;
} | null> {
  try {
    const response = await fetch(
      `${GITHUB_CONFIG.API_BASE}/repos/${DOCS_CONFIG.REPO_OWNER}/${DOCS_CONFIG.REPO_NAME}/contents/${path}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        next: { revalidate: POLLING_INTERVALS.DOC_CONTENT },
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.content) {
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      return {
        content,
        sha: data.sha,
      };
    }

    if (data.download_url) {
      const contentResponse = await fetch(data.download_url, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        next: { revalidate: POLLING_INTERVALS.DOC_CONTENT },
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

export function buildDocsNavigation(tree: DocFile[]): DocFile[] {
  return tree
    .sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === "dir" ? -1 : 1;
    })
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: buildDocsNavigation(item.children),
        };
      }
      return item;
    });
}
