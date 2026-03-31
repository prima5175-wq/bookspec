export interface JournalEntry {
  id: string;
  bookId?: string;
  bookTitle: string;
  author: string;
  pagesRead: number;
  quote: string;
  thoughts: string;
  emotion: string;
  aiChat: { role: "user" | "ai"; text: string }[];
  createdAt: string;
  sentToPenpal: boolean;
}

const JOURNAL_KEY = "bookspec_journal";

export function getJournals(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(JOURNAL_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveJournal(entry: JournalEntry): void {
  const journals = getJournals();
  journals.push(entry);
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(journals));
}

export function getJournalById(id: string): JournalEntry | undefined {
  return getJournals().find((j) => j.id === id);
}

export const EMOTIONS = [
  { emoji: "🌍", label: "평화로운", color: "#3b82f6" },
  { emoji: "🔴", label: "열정적인", color: "#ef4444" },
  { emoji: "🪐", label: "신비로운", color: "#a78bfa" },
  { emoji: "☀️", label: "밝고 행복한", color: "#fbbf24" },
  { emoji: "🌙", label: "차분한", color: "#818cf8" },
  { emoji: "💫", label: "감동받은", color: "#f472b6" },
  { emoji: "🌑", label: "슬픈", color: "#6b7280" },
  { emoji: "☄️", label: "놀라운", color: "#fb923c" },
  { emoji: "🌈", label: "꿈꾸는", color: "#34d399" },
];
