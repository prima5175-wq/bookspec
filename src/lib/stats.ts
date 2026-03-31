import { Book } from "./types";

export interface HiddenStat {
  key: StatKey;
  icon: string;
  name: string;
  description: string;
  maxLevel: number;
}

export type StatKey =
  | "brainCell"
  | "obsession"
  | "sleepResist"
  | "bookJustify"
  | "foresight"
  | "showoff"
  | "tearDuct"
  | "escapism"
  | "stacking"
  | "protagonist";

export const STAT_DEFS: HiddenStat[] = [
  {
    key: "brainCell",
    icon: "🧠",
    name: "뇌세포 생존율",
    description: "책 읽을수록 올라가는 지력",
    maxLevel: 99,
  },
  {
    key: "obsession",
    icon: "😤",
    name: "집착력",
    description: "같은 저자/장르 연속 독파력",
    maxLevel: 99,
  },
  {
    key: "sleepResist",
    icon: "🥱",
    name: "졸음 저항력",
    description: "두꺼운 책도 끝까지 읽는 힘",
    maxLevel: 99,
  },
  {
    key: "bookJustify",
    icon: "💸",
    name: "책값 합리화",
    description: "\"이건 투자야\"의 경지",
    maxLevel: 99,
  },
  {
    key: "foresight",
    icon: "👀",
    name: "눈치력",
    description: "복선을 미리 알아채는 직감",
    maxLevel: 99,
  },
  {
    key: "showoff",
    icon: "🤓",
    name: "아는척력",
    description: "대화에 책 내용 끼워넣기",
    maxLevel: 99,
  },
  {
    key: "tearDuct",
    icon: "😭",
    name: "눈물샘 용량",
    description: "감동 장면 버티기 실패 횟수",
    maxLevel: 99,
  },
  {
    key: "escapism",
    icon: "🌙",
    name: "현실도피력",
    description: "책 속으로 순간이동하는 능력",
    maxLevel: 99,
  },
  {
    key: "stacking",
    icon: "📚",
    name: "적층력",
    description: "사놓고 안 읽는 책 쌓기",
    maxLevel: 99,
  },
  {
    key: "protagonist",
    icon: "🦸",
    name: "주인공 빙의력",
    description: "나도 이렇게 살 수 있다는 착각",
    maxLevel: 99,
  },
];

export type StatScores = Record<StatKey, number>;

export function calculateStats(books: Book[]): StatScores {
  const scores: StatScores = {
    brainCell: 0,
    obsession: 0,
    sleepResist: 0,
    bookJustify: 0,
    foresight: 0,
    showoff: 0,
    tearDuct: 0,
    escapism: 0,
    stacking: 0,
    protagonist: 0,
  };

  if (books.length === 0) return scores;

  const sorted = [...books].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // 🧠 뇌세포 생존율 - +2 per book, bonus for high-page books
  scores.brainCell = Math.min(
    99,
    books.length * 2 + books.filter((b) => b.pages >= 200).length
  );

  // 😤 집착력 - consecutive same author or same genre
  let streak = 0;
  for (let i = 1; i < sorted.length; i++) {
    if (
      sorted[i].author === sorted[i - 1].author ||
      sorted[i].genre === sorted[i - 1].genre
    ) {
      streak++;
    }
  }
  scores.obsession = Math.min(99, streak * 3 + Math.floor(books.length / 3));

  // 🥱 졸음 저항력 - books 300p+
  const thickBooks = books.filter((b) => b.pages >= 300).length;
  scores.sleepResist = Math.min(99, thickBooks * 8 + books.filter((b) => b.pages >= 200).length * 3);

  // 💸 책값 합리화 - unlocks at 5, grows with count
  if (books.length >= 5) {
    scores.bookJustify = Math.min(99, 10 + (books.length - 5) * 4 + (books.length >= 10 ? 15 : 0) + (books.length >= 20 ? 20 : 0));
  }

  // 👀 눈치력 - mystery/adventure/fantasy books + high rating
  const insightBooks = books.filter(
    (b) => ["모험", "판타지"].includes(b.genre) && b.rating >= 4
  ).length;
  scores.foresight = Math.min(99, insightBooks * 6 + Math.floor(books.length / 2));

  // 🤓 아는척력 - grows per 3 books, bonus for diverse genres
  const uniqueGenres = new Set(books.map((b) => b.genre)).size;
  scores.showoff = Math.min(
    99,
    Math.floor(books.length / 2) * 3 + uniqueGenres * 5
  );

  // 😭 눈물샘 용량 - high-rated emotional books (동화, 4-5 stars)
  const emotionalBooks = books.filter(
    (b) => b.rating >= 4 && ["동화", "판타지"].includes(b.genre)
  ).length;
  scores.tearDuct = Math.min(
    99,
    emotionalBooks * 7 + books.filter((b) => b.rating === 5).length * 3
  );

  // 🌙 현실도피력 - fantasy + adventure + high pages
  const escapeBooks = books.filter((b) =>
    ["판타지", "모험", "동화"].includes(b.genre)
  ).length;
  scores.escapism = Math.min(
    99,
    escapeBooks * 6 + books.filter((b) => b.pages >= 200).length * 2
  );

  // 📚 적층력 - total books + recent registration bursts
  const recentMonth = books.filter((b) => {
    const d = new Date(b.createdAt);
    const now = new Date();
    return now.getTime() - d.getTime() < 30 * 24 * 60 * 60 * 1000;
  }).length;
  scores.stacking = Math.min(99, books.length * 3 + recentMonth * 4);

  // 🦸 주인공 빙의력 - adventure/fantasy 5-star books
  const heroBooks = books.filter(
    (b) => b.rating === 5 && ["모험", "판타지", "동화"].includes(b.genre)
  ).length;
  scores.protagonist = Math.min(
    99,
    heroBooks * 10 + books.filter((b) => b.rating >= 4).length * 3
  );

  return scores;
}

// Badge system
export interface Badge {
  id: string;
  icon: string;
  name: string;
  description: string;
  condition: (stats: StatScores, books: Book[]) => boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const BADGES: Badge[] = [
  {
    id: "first_book",
    icon: "🌱",
    name: "첫 발자국",
    description: "첫 번째 책을 등록했다!",
    condition: (_, books) => books.length >= 1,
    rarity: "common",
  },
  {
    id: "bookworm",
    icon: "🐛",
    name: "책벌레",
    description: "5권 이상 읽은 진정한 독서가",
    condition: (_, books) => books.length >= 5,
    rarity: "common",
  },
  {
    id: "brain_boost",
    icon: "🧠",
    name: "뇌풀가동",
    description: "뇌세포 생존율 50 돌파!",
    condition: (s) => s.brainCell >= 50,
    rarity: "rare",
  },
  {
    id: "thick_slayer",
    icon: "💪",
    name: "두꺼운건 못참지",
    description: "300p 이상 책 3권 클리어",
    condition: (_, books) => books.filter((b) => b.pages >= 300).length >= 3,
    rarity: "rare",
  },
  {
    id: "genre_master",
    icon: "🎭",
    name: "장르 마스터",
    description: "5개 이상 장르 섭렵",
    condition: (_, books) => new Set(books.map((b) => b.genre)).size >= 5,
    rarity: "epic",
  },
  {
    id: "obsessed",
    icon: "🔥",
    name: "몰입 장인",
    description: "집착력 40 이상",
    condition: (s) => s.obsession >= 40,
    rarity: "rare",
  },
  {
    id: "wallet_warrior",
    icon: "💳",
    name: "지갑전사",
    description: "책값 합리화 완벽 달성 (10권+)",
    condition: (_, books) => books.length >= 10,
    rarity: "epic",
  },
  {
    id: "crybaby",
    icon: "😭",
    name: "감동체질",
    description: "눈물샘 용량 60 돌파",
    condition: (s) => s.tearDuct >= 60,
    rarity: "rare",
  },
  {
    id: "escapist",
    icon: "🚪",
    name: "현실은 안녕",
    description: "현실도피력 50 이상",
    condition: (s) => s.escapism >= 50,
    rarity: "epic",
  },
  {
    id: "perfect_score",
    icon: "⭐",
    name: "만점 수집가",
    description: "별점 5점 책 5권 이상",
    condition: (_, books) => books.filter((b) => b.rating === 5).length >= 5,
    rarity: "epic",
  },
  {
    id: "hero_complex",
    icon: "🦸",
    name: "나도 주인공",
    description: "주인공 빙의력 MAX급",
    condition: (s) => s.protagonist >= 70,
    rarity: "legendary",
  },
  {
    id: "all_rounder",
    icon: "🌟",
    name: "만능 독서가",
    description: "모든 능력치 20 이상",
    condition: (s) =>
      Object.values(s).every((v) => v >= 20),
    rarity: "legendary",
  },
];

export const RARITY_COLORS: Record<Badge["rarity"], { bg: string; border: string; text: string }> = {
  common: { bg: "rgba(148,163,184,0.15)", border: "rgba(148,163,184,0.4)", text: "#94a3b8" },
  rare: { bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.4)", text: "#60a5fa" },
  epic: { bg: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.4)", text: "#c084fc" },
  legendary: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", text: "#fbbf24" },
};

// Stat change detection for popup
const PREV_STATS_KEY = "bookspec_prev_stats";

export function getPrevStats(): StatScores | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(PREV_STATS_KEY);
  return data ? JSON.parse(data) : null;
}

export function savePrevStats(stats: StatScores): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREV_STATS_KEY, JSON.stringify(stats));
}

export function getStatChanges(
  prev: StatScores | null,
  current: StatScores
): { key: StatKey; diff: number }[] {
  if (!prev) return [];
  const changes: { key: StatKey; diff: number }[] = [];
  for (const key of Object.keys(current) as StatKey[]) {
    const diff = current[key] - (prev[key] || 0);
    if (diff > 0) {
      changes.push({ key, diff });
    }
  }
  return changes;
}
