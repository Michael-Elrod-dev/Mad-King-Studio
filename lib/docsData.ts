// lib/docsData.ts
import { DOCS_CONFIG } from "./constants";

export interface DocFile {
  name: string;
  path: string;
  type: "file" | "dir";
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

export { DOCS_CONFIG };
