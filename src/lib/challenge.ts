import { Book } from "./types";

export interface Challenge {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  planet: string;
  startedAt: string; // ISO
  stages: ChallengeStage[];
  currentStage: number; // 0-3
  completed: boolean;
}

export interface ChallengeStage {
  day: number;
  icon: string;
  title: string;
  description: string;
  prompt: string;
  response: string;
  completedAt: string | null;
  xp: number;
}

export const STAGE_TEMPLATES: Omit<ChallengeStage, "response" | "completedAt">[] = [
  {
    day: 1,
    icon: "🌱",
    title: "씨앗 심기",
    description: "인상깊은 문장을 기록해요",
    prompt: "이 책에서 가장 기억에 남는 문장이나 장면은?",
    xp: 10,
  },
  {
    day: 7,
    icon: "🌿",
    title: "새싹 키우기",
    description: "아직 기억하고 있나요?",
    prompt: "일주일 전에 읽은 이 책, 어떤 내용이었는지 떠올려볼까요?",
    xp: 25,
  },
  {
    day: 30,
    icon: "🌳",
    title: "나무 가꾸기",
    description: "핵심 내용을 떠올려봐요",
    prompt: "이 책의 핵심 메시지를 한 문장으로 정리해볼까요?",
    xp: 50,
  },
  {
    day: 90,
    icon: "🪐",
    title: "행성 업그레이드!",
    description: "내 삶에 어떻게 적용했나요?",
    prompt: "이 책을 읽고 나서 달라진 점이 있나요? 어떻게 적용했나요?",
    xp: 100,
  },
];

const CHALLENGES_KEY = "bookspec_challenges";
const XP_KEY = "bookspec_xp";

export function getChallenges(): Challenge[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CHALLENGES_KEY);
  return data ? JSON.parse(data) : [];
}

function saveChallenges(challenges: Challenge[]): void {
  localStorage.setItem(CHALLENGES_KEY, JSON.stringify(challenges));
}

export function startChallenge(book: Book): Challenge {
  const challenge: Challenge = {
    id: `ch_${Date.now().toString(36)}`,
    bookId: book.id,
    bookTitle: book.title,
    bookAuthor: book.author,
    planet: book.planet,
    startedAt: new Date().toISOString(),
    currentStage: 0,
    completed: false,
    stages: STAGE_TEMPLATES.map((t) => ({
      ...t,
      response: "",
      completedAt: null,
    })),
  };

  const challenges = getChallenges();
  challenges.push(challenge);
  saveChallenges(challenges);
  return challenge;
}

export function completeStage(
  challengeId: string,
  stageIndex: number,
  response: string
): Challenge | null {
  const challenges = getChallenges();
  const ch = challenges.find((c) => c.id === challengeId);
  if (!ch || stageIndex !== ch.currentStage) return null;

  ch.stages[stageIndex].response = response;
  ch.stages[stageIndex].completedAt = new Date().toISOString();

  // Add XP
  addXP(ch.stages[stageIndex].xp);

  if (stageIndex < 3) {
    ch.currentStage = stageIndex + 1;
  } else {
    ch.completed = true;
  }

  saveChallenges(challenges);
  return ch;
}

export function deleteChallenge(challengeId: string): void {
  const challenges = getChallenges().filter((c) => c.id !== challengeId);
  saveChallenges(challenges);
}

export function getChallengeForBook(bookId: string): Challenge | undefined {
  return getChallenges().find((c) => c.bookId === bookId && !c.completed);
}

// XP system
export function getXP(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(XP_KEY) || "0");
}

export function addXP(amount: number): void {
  const current = getXP();
  localStorage.setItem(XP_KEY, String(current + amount));
}

export function getLevel(xp: number): { level: number; title: string; nextXP: number; currentXP: number } {
  const levels = [
    { xp: 0, title: "우주먼지" },
    { xp: 30, title: "유성" },
    { xp: 80, title: "소행성" },
    { xp: 150, title: "위성" },
    { xp: 250, title: "행성" },
    { xp: 400, title: "항성" },
    { xp: 600, title: "성운" },
    { xp: 900, title: "은하" },
    { xp: 1300, title: "우주 마스터" },
  ];

  let level = 0;
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].xp) {
      level = i;
      break;
    }
  }

  const nextLevel = levels[level + 1];
  return {
    level: level + 1,
    title: levels[level].title,
    nextXP: nextLevel ? nextLevel.xp : levels[level].xp,
    currentXP: xp,
  };
}

// Stage availability: check if enough days have passed
export function getStageStatus(challenge: Challenge): {
  stageIndex: number;
  isReady: boolean;
  daysUntilReady: number;
  daysSinceStart: number;
} {
  const now = new Date();
  const start = new Date(challenge.startedAt);
  const daysSinceStart = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  const idx = challenge.currentStage;
  const requiredDay = challenge.stages[idx].day;
  const daysUntilReady = Math.max(0, requiredDay - daysSinceStart);

  return {
    stageIndex: idx,
    isReady: daysSinceStart >= requiredDay,
    daysUntilReady,
    daysSinceStart,
  };
}
