// lib/docsData.ts
export interface DocFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  sha: string;
  size?: number;
  download_url?: string;
  children?: DocFile[];
}

export interface DocContent {
  title: string;
  content: string;
  path: string;
  lastModified?: string;
}

export interface DocsNavItem {
  name: string;
  path: string;
  children?: DocsNavItem[];
  isFolder: boolean;
}

// Configuration
export const DOCS_CONFIG = {
  REPO_OWNER: "Michael-Elrod-dev",
  REPO_NAME: "Path-to-Valhalla",
  DOCS_PATH: "docs",
  // Folders to exclude from docs navigation
  EXCLUDED_FOLDERS: [
    "00-Templates", // Internal templates
  ],
  // Default landing page
  DEFAULT_DOC: "00-project-management/dashboards/project-overview",
} as const;
