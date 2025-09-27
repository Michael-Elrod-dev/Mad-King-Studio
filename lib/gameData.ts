// lib/gameData.ts
export interface MediaSection {
  id: 'title' | 'environments' | 'player' | 'npcs' | 'enemies' | 'bosses' | 'weapons' | 'abilities';
  title?: string;
  description?: string;
  assets: string[];
  layout: 'inline-left' | 'inline-right' | 'full-width';
}

export interface GameData {
  id: string;
  title: string;
  description: string;
  genre: string;
  platform: string;
  status: 'In Development' | 'Early Access' | 'Released';
  steamUrl?: string;
  media?: MediaSection[];
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
    steamUrl: "#",
    media: [
      {
        id: "title",
        assets: [
          // "https://mad-king-studio.s3.amazonaws.com/image.png",
        ],
        layout: 'inline-right'
      },
      {
        id: "environments",
        title: "The Nine Realms",
        description: "Journey through the mystical realms of Norse mythology, from the icy wastes of Jotunheim to the golden halls of Asgard. Each realm offers unique challenges, environments, and secrets to discover.",
        assets: [
          // "https://mad-king-studio.s3.amazonaws.com/image.png",
        ],
        layout: 'full-width'
      },
      {
        id: "player",
        title: "The Fallen Viking",
        description: "Customize and upgrade your Viking warrior as you progress through your journey to Valhalla. Unlock new abilities, and fighting styles that reflect your playstyle.",
        assets: [
          // "https://mad-king-studio.s3.amazonaws.com/image.png",
        ],
        layout: 'inline-left'
      },
      {
        id: "enemies",
        title: "Mythical Foes",
        description: "Face off against creatures from Norse legend - draugr warriors, dire wolves, witches, and more. Each realm has a unique set of enemies to challenge you.",
        assets: [
          // "https://mad-king-studio.s3.amazonaws.com/image.png",
        ],
        layout: 'inline-right'
      },
      {
        id: "weapons",
        title: "Weapon Types",
        description: "Wield weapons inspired by Norse mythology. From dual axes to a spear and shield or a bow, try out and upgrade different gear to find what works best for you.",
        assets: [
          // "https://mad-king-studio.s3.amazonaws.com/image.png",
        ],
        layout: 'inline-left'
      },
      {
        id: "bosses",
        title: "Legendary Bosses",
        description: "Epic boss battles await in each realm. Face powerful guardians, ancient gods, and mythical beasts in challenging encounters that will test your skills and determination.",
        assets: [
          // "https://mad-king-studio.s3.amazonaws.com/image.png",
        ],
        layout: 'inline-right'
      },
      {
        id: "abilities",
        title: "Divine Powers",
        description: "Unlock and master powerful abilities granted by the gods. Combine different skills to create devastating combos and find your own path to victory.",
        assets: [
          // "https://mad-king-studio.s3.amazonaws.com/image.png",
        ],
        layout: 'inline-left'
      }
    ],
  },
];
