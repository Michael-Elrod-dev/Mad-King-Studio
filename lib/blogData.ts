// lib/blogData.ts
import { games } from "./gameData";

export const blogGames = games;

export interface BlogSection {
  id: string;
  title: string;
  description: string;
}
