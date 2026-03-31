// ─── Satellite Tier System ───

export type SatelliteTier = "basic" | "loaded" | "special";
export type GiftType = "star" | "moon" | "crystal" | "aurora";

export interface SatelliteGift {
  id: GiftType;
  icon: string;
  name: string;
  description: string;
}

export const GIFTS: SatelliteGift[] = [
  { id: "star", icon: "⭐", name: "별", description: "행성 표면에 반짝이는 별 추가" },
  { id: "moon", icon: "🌙", name: "달", description: "내 행성에 달이 생김" },
  { id: "crystal", icon: "💎", name: "크리스탈", description: "행성 표면 빛나게 꾸미기" },
  { id: "aurora", icon: "🌈", name: "오로라", description: "행성 대기에 오로라 효과" },
];

export interface SatelliteTierInfo {
  id: SatelliteTier;
  icon: string;
  name: string;
  description: string;
  cost: number;
  features: string[];
  color: string;
}

export const TIERS: SatelliteTierInfo[] = [
  {
    id: "basic",
    icon: "📡",
    name: "기본 위성",
    description: "편지만 전달",
    cost: 0,
    features: ["편지 전달", "작은 위성 1개 추가"],
    color: "#94a3b8",
  },
  {
    id: "loaded",
    icon: "🛰️",
    name: "탑재 위성",
    description: "편지 + 선물 동봉",
    cost: 30,
    features: ["편지 전달", "선물 1개 동봉", "행성 꾸미기 효과"],
    color: "#a78bfa",
  },
  {
    id: "special",
    icon: "🌌",
    name: "특수 위성",
    description: "편지 + 선물 + AI 리포트",
    cost: 80,
    features: ["편지 전달", "선물 1개 동봉", "AI 독서록 첨삭 리포트"],
    color: "#fbbf24",
  },
];

// ─── Satellite Record ───

export interface SatelliteLaunch {
  id: string;
  letterId: string;
  connectionId: string;
  tier: SatelliteTier;
  gift?: GiftType;
  aiReport?: string;
  launchedAt: string;
}

const LAUNCHES_KEY = "bookspec_satellite_launches";
const COINS_KEY = "bookspec_coins";

export function getLaunches(): SatelliteLaunch[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(LAUNCHES_KEY);
  return data ? JSON.parse(data) : [];
}

function saveLaunches(launches: SatelliteLaunch[]): void {
  localStorage.setItem(LAUNCHES_KEY, JSON.stringify(launches));
}

export function addLaunch(launch: SatelliteLaunch): void {
  const launches = getLaunches();
  launches.push(launch);
  saveLaunches(launches);
}

// ─── Coins ───

export function getCoins(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(COINS_KEY) || "100"); // start with 100
}

export function setCoins(amount: number): void {
  localStorage.setItem(COINS_KEY, String(Math.max(0, amount)));
}

export function spendCoins(amount: number): boolean {
  const current = getCoins();
  if (current < amount) return false;
  setCoins(current - amount);
  return true;
}

export function earnCoins(amount: number): void {
  setCoins(getCoins() + amount);
}

// Books earn coins: 10 per book registered, 5 per challenge stage, 3 per letter sent
export function earnFromBook(): void { earnCoins(10); }
export function earnFromChallenge(): void { earnCoins(5); }
export function earnFromLetter(): void { earnCoins(3); }

// ─── Planet Decoration Level ───

export interface PlanetDecoration {
  totalSatellites: number;
  level: number; // 0-4
  title: string;
  effects: string[];
  gifts: Record<GiftType, number>;
}

export function getPlanetDecoration(connectionId?: string): PlanetDecoration {
  const launches = getLaunches();
  const filtered = connectionId
    ? launches.filter((l) => l.connectionId === connectionId)
    : launches;

  const total = filtered.length;
  const gifts: Record<GiftType, number> = { star: 0, moon: 0, crystal: 0, aurora: 0 };
  filtered.forEach((l) => {
    if (l.gift) gifts[l.gift]++;
  });

  let level = 0;
  let title = "우주먼지";
  const effects: string[] = [];

  if (total >= 1) { level = 1; title = "위성 보유"; effects.push("위성 궤도"); }
  if (total >= 5) { level = 2; title = "고리 행성"; effects.push("행성 고리"); }
  if (total >= 10) { level = 3; title = "빛나는 행성"; effects.push("글로우 효과"); }
  if (total >= 30) { level = 4; title = "일론급 행성 🚀"; effects.push("풀 이펙트"); }

  return { totalSatellites: total, level, title, effects, gifts };
}

// ─── AI Report Generator ───

export function generateAIReport(bookTitle: string, content: string): string {
  const sentences = content.split(/[.!?。]/).filter((s) => s.trim().length > 5);
  const bestSentence = sentences.length > 0
    ? sentences[Math.floor(Math.random() * sentences.length)].trim()
    : content.slice(0, 50);

  const praises = [
    "표현력이 정말 뛰어나요!",
    "깊이 있는 생각이 돋보여요!",
    "감수성이 풍부한 독서가네요!",
    "핵심을 잘 파악했어요!",
    "자기만의 시각이 있어서 좋아요!",
  ];

  const tips = [
    "다음엔 등장인물의 감정 변화도 적어보면 어떨까요?",
    "비슷한 주제의 다른 책과 비교해보는 것도 좋겠어요!",
    "인상 깊은 장면을 그림으로 그려보는 것도 추천해요!",
    "주인공에게 편지를 써보는 것도 재미있을 거예요!",
    "이 책을 친구에게 추천한다면 어떻게 소개할지 생각해보세요!",
  ];

  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  return `📋 AI 독서록 첨삭 리포트
━━━━━━━━━━━━━━━━━━━
📖 도서: ${bookTitle || "미지정"}

✨ 특히 좋았던 부분:
"${bestSentence}"
→ ${pick(praises)}

📊 독서력 분석:
• 표현력: ${"★".repeat(Math.floor(Math.random() * 2) + 4)}${"☆".repeat(1)}
• 이해력: ${"★".repeat(Math.floor(Math.random() * 2) + 3)}${"☆".repeat(2)}
• 창의성: ${"★".repeat(Math.floor(Math.random() * 2) + 4)}${"☆".repeat(1)}

💡 다음 단계 팁:
${pick(tips)}

🚀 총평: 우주급 독서 감상이에요!
━━━━━━━━━━━━━━━━━━━`;
}
