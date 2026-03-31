const READING_LOG_KEY = "bookspec_reading_log";
const READING_GOAL_KEY = "bookspec_reading_goal";

export interface ReadingEntry {
  date: string; // YYYY-MM-DD
  pages: number;
  bookId?: string;
  bookTitle?: string;
}

export interface ReadingLog {
  entries: ReadingEntry[];
  totalPages: number;
}

export function getReadingLog(): ReadingLog {
  if (typeof window === "undefined") return { entries: [], totalPages: 0 };
  const data = localStorage.getItem(READING_LOG_KEY);
  if (!data) return { entries: [], totalPages: 0 };
  const entries: ReadingEntry[] = JSON.parse(data);
  return {
    entries,
    totalPages: entries.reduce((s, e) => s + e.pages, 0),
  };
}

function saveEntries(entries: ReadingEntry[]): void {
  localStorage.setItem(READING_LOG_KEY, JSON.stringify(entries));
}

export function addReadingEntry(pages: number, bookId?: string, bookTitle?: string): ReadingEntry {
  const today = new Date().toISOString().split("T")[0];
  const entries = getReadingLog().entries;

  // Merge with existing today entry for same book
  const existing = entries.find(
    (e) => e.date === today && e.bookId === bookId
  );
  if (existing) {
    existing.pages += pages;
  } else {
    entries.push({ date: today, pages, bookId, bookTitle });
  }

  saveEntries(entries);
  return existing || entries[entries.length - 1];
}

export function getTodayPages(): number {
  const today = new Date().toISOString().split("T")[0];
  return getReadingLog()
    .entries.filter((e) => e.date === today)
    .reduce((s, e) => s + e.pages, 0);
}

export function getWeekPages(): { date: string; pages: number }[] {
  const log = getReadingLog();
  const result: { date: string; pages: number }[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayPages = log.entries
      .filter((e) => e.date === dateStr)
      .reduce((s, e) => s + e.pages, 0);
    result.push({ date: dateStr, pages: dayPages });
  }

  return result;
}

export function getStreak(): number {
  const log = getReadingLog();
  const dates = new Set(log.entries.map((e) => e.date));
  let streak = 0;
  const now = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    if (dates.has(dateStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// Daily goal
export function getDailyGoal(): number {
  if (typeof window === "undefined") return 20;
  return Number(localStorage.getItem(READING_GOAL_KEY) || "20");
}

export function setDailyGoal(pages: number): void {
  localStorage.setItem(READING_GOAL_KEY, String(Math.max(1, pages)));
}

// Planet level from total pages (every 100 pages = 1 level)
export function getPlanetLevel(totalPages: number): {
  level: number;
  currentPages: number;
  nextLevelPages: number;
  progress: number;
  title: string;
  sizeMultiplier: number;
} {
  const level = Math.floor(totalPages / 100);
  const currentPages = totalPages % 100;
  const nextLevelPages = 100;
  const progress = currentPages / nextLevelPages;

  const titles = [
    "소행성", "위성", "왜소 행성", "암석 행성", "지구형 행성",
    "슈퍼 지구", "가스 행성", "거대 가스 행성", "갈색 왜성", "적색 왜성",
    "주계열성", "청색 거성", "초거성", "극대거성", "중성자별",
  ];

  const title = titles[Math.min(level, titles.length - 1)];
  // Size grows: 1.0 at level 0, up to 2.0 at level 10+
  const sizeMultiplier = 1.0 + Math.min(level, 10) * 0.1;

  return { level, currentPages, nextLevelPages, progress, title, sizeMultiplier };
}
