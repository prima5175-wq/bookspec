export interface Book {
  id: string;
  title: string;
  author: string;
  rating: number; // 1-5
  review: string;
  planet: PlanetType;
  genre: Genre;
  pages: number;
  dateRead: string; // ISO date string
  createdAt: string;
}

export type PlanetType =
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune";

export type Genre =
  | "동화"
  | "과학"
  | "역사"
  | "모험"
  | "판타지"
  | "학습"
  | "기타";

export const PLANETS: Record<
  PlanetType,
  { name: string; color: string; gradient: string; glow: string; emoji: string }
> = {
  mercury: {
    name: "수성",
    color: "#b0b0b0",
    gradient: "linear-gradient(135deg, #c0c0c0, #808080)",
    glow: "rgba(176, 176, 176, 0.4)",
    emoji: "🪨",
  },
  venus: {
    name: "금성",
    color: "#f5c542",
    gradient: "linear-gradient(135deg, #f5c542, #d4a017)",
    glow: "rgba(245, 197, 66, 0.4)",
    emoji: "🌟",
  },
  earth: {
    name: "지구",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6, #22c55e)",
    glow: "rgba(59, 130, 246, 0.4)",
    emoji: "🌍",
  },
  mars: {
    name: "화성",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444, #b91c1c)",
    glow: "rgba(239, 68, 68, 0.4)",
    emoji: "🔴",
  },
  jupiter: {
    name: "목성",
    color: "#f97316",
    gradient: "linear-gradient(135deg, #f97316, #c2410c, #f59e0b)",
    glow: "rgba(249, 115, 22, 0.4)",
    emoji: "🟠",
  },
  saturn: {
    name: "토성",
    color: "#eab308",
    gradient: "linear-gradient(135deg, #eab308, #ca8a04)",
    glow: "rgba(234, 179, 8, 0.4)",
    emoji: "💫",
  },
  uranus: {
    name: "천왕성",
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4, #0e7490)",
    glow: "rgba(6, 182, 212, 0.4)",
    emoji: "🔵",
  },
  neptune: {
    name: "해왕성",
    color: "#6366f1",
    gradient: "linear-gradient(135deg, #6366f1, #4338ca)",
    glow: "rgba(99, 102, 241, 0.4)",
    emoji: "🟣",
  },
};

export const GENRES: Genre[] = [
  "동화",
  "과학",
  "역사",
  "모험",
  "판타지",
  "학습",
  "기타",
];
