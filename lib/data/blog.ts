// lib/blogData.ts
import { games } from "./game";

export const blogGames = games;

export interface BlogSection {
  id: string;
  title: string;
  description: string;
}
