// lib/blogData.ts
export interface BlogSection {
  id: string;
  title: string;
  description: string;
}

export const blogSections: BlogSection[] = [
  {
    id: "dev-logs",
    title: "Dev Logs",
    description:
      "Follow along with the development journey. Regular updates on progress, challenges, and insights from building our game live on stream.",
  },
  {
    id: "patch-notes",
    title: "Patch Notes",
    description:
      "Official game updates, bug fixes, and new features. Stay up to date with the latest changes to the game.",
  },
];
