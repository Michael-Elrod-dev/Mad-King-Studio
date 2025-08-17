// lib/gameData.ts
export interface GameData {
  id: string;
  title: string;
  description: string;
  genre: string;
  platform: string;
  status: string;
  openSource: boolean;
  steamUrl?: string;
  githubUrl?: string;
  twitchUrl?: string;
  progress: {
    feature: string;
    progress: number;
  }[];
}

export const games: GameData[] = [
  {
    id: "path-to-valhalla",
    title: "Path to Valhalla",
    description:
      "A 2D, top down, segmented rougelite game built around Norse Mythology. You play as a fallen Viking who must fight his way through the 9 Realms to prove himself to Odin and be granted everlasting life as one of Odin's warriors in Valhalla.",
    genre: "Action / Rougelite",
    platform: "PC (Steam)",
    status: "In Development",
    openSource: true,
    steamUrl: "#",
    githubUrl: "https://github.com/Michael-Elrod-dev/Path-to-Valhalla",
    twitchUrl: "https://www.twitch.tv/aimosthadme",
    progress: [
      { feature: "Core Game Mechanics", progress: 30 },
      { feature: "Level Design", progress: 10 },
      { feature: "Art Assets", progress: 0 },
      { feature: "Audio Integration", progress: 0 },
      { feature: "UI/UX Polish", progress: 0 },
    ],
  },
];
