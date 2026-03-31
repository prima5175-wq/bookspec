import { PlanetType } from "./types";

// ─── Planet personality system ───
export type OrbitGroup = "inner" | "outer";

export const INNER_PLANETS: PlanetType[] = ["mercury", "venus", "earth", "mars"];
export const OUTER_PLANETS: PlanetType[] = ["jupiter", "saturn", "uranus", "neptune"];

export interface OrbitGroupInfo {
  id: OrbitGroup;
  title: string;
  subtitle: string;
  trait: string;
  icon: string;
  planets: PlanetType[];
  color: string;
}

export const ORBIT_GROUPS: Record<OrbitGroup, OrbitGroupInfo> = {
  inner: {
    id: "inner",
    title: "내행성",
    subtitle: "태양 가까이, 빠르고 뜨거운",
    trait: "내향적 에너지",
    icon: "☀️",
    planets: ["mercury", "venus", "earth", "mars"],
    color: "#f97316",
  },
  outer: {
    id: "outer",
    title: "외행성",
    subtitle: "크고 여유롭고, 중력 강한",
    trait: "외향적 에너지",
    icon: "🌌",
    planets: ["jupiter", "saturn", "uranus", "neptune"],
    color: "#6366f1",
  },
};

// ─── Questions ───
export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    label: string;
    text: string;
    planets: PlanetType[];
  }[];
}

// Questions for inner planet group
export const INNER_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "서점에서 책을 고를 때 나는?",
    options: [
      { label: "A", text: "처음 보는 새로운 주제에 손이 간다", planets: ["mercury"] },
      { label: "B", text: "예쁜 표지, 감성적 제목에 끌린다", planets: ["venus"] },
      { label: "C", text: "나에게 실질적 도움될 책을 고른다", planets: ["earth"] },
      { label: "D", text: "도전적이고 자극적인 책을 찾는다", planets: ["mars"] },
    ],
  },
  {
    id: 2,
    question: "책 읽을 때 나는?",
    options: [
      { label: "A", text: "빠르게 핵심만 파악하며 속독한다", planets: ["mercury"] },
      { label: "B", text: "좋은 문장에 밑줄 긋고 오래 음미한다", planets: ["venus"] },
      { label: "C", text: "내 상황에 대입하며 읽는다", planets: ["earth"] },
      { label: "D", text: "읽으면서 바로 실행 계획을 세운다", planets: ["mars"] },
    ],
  },
  {
    id: 3,
    question: "책을 다 읽고 나면?",
    options: [
      { label: "A", text: "바로 다음 책을 찾아 읽기 시작한다", planets: ["mercury"] },
      { label: "B", text: "감동의 여운에 한참 잠긴다", planets: ["venus"] },
      { label: "C", text: "독서록을 일기처럼 길게 쓴다", planets: ["earth"] },
      { label: "D", text: "배운 걸 즉시 행동으로 옮긴다", planets: ["mars"] },
    ],
  },
  {
    id: 4,
    question: "친구에게 책을 추천할 때?",
    options: [
      { label: "A", text: "\"이거 10분이면 읽어!\" 가볍게 추천", planets: ["mercury"] },
      { label: "B", text: "\"이 문장이 너무 아름다워...\" 감성 폭발", planets: ["venus"] },
      { label: "C", text: "\"이거 네 상황에 딱이야\" 맞춤 추천", planets: ["earth"] },
      { label: "D", text: "\"이거 읽고 나도 시작했어!\" 행동 유도", planets: ["mars"] },
    ],
  },
  {
    id: 5,
    question: "읽고 싶은 책이 10권 쌓이면?",
    options: [
      { label: "A", text: "동시에 3권씩 읽으며 빠르게 소화", planets: ["mercury"] },
      { label: "B", text: "가장 예쁜 책부터 천천히 읽는다", planets: ["venus"] },
      { label: "C", text: "우선순위 정해서 체계적으로 읽는다", planets: ["earth"] },
      { label: "D", text: "가장 도전적인 것부터 바로 시작!", planets: ["mars"] },
    ],
  },
];

// Questions for outer planet group
export const OUTER_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "서점에서 책을 고를 때 나는?",
    options: [
      { label: "A", text: "\"이거 재밌겠다!\" 여러 권 한번에 산다", planets: ["jupiter"] },
      { label: "B", text: "꼼꼼히 목차와 서평을 확인하고 고른다", planets: ["saturn"] },
      { label: "C", text: "남들이 안 읽는 독특한 책을 고른다", planets: ["uranus"] },
      { label: "D", text: "표지를 보며 상상의 나래를 펼친다", planets: ["neptune"] },
    ],
  },
  {
    id: 2,
    question: "책 읽을 때 나는?",
    options: [
      { label: "A", text: "친구한테 실시간으로 감상 공유한다", planets: ["jupiter"] },
      { label: "B", text: "절대 책을 접거나 낙서하지 않는다", planets: ["saturn"] },
      { label: "C", text: "나만의 독특한 해석을 만들어 본다", planets: ["uranus"] },
      { label: "D", text: "읽다가 멍하니 딴 생각에 빠진다", planets: ["neptune"] },
    ],
  },
  {
    id: 3,
    question: "책을 다 읽고 나면?",
    options: [
      { label: "A", text: "친구들에게 이 책을 사줘야겠다!", planets: ["jupiter"] },
      { label: "B", text: "깔끔하게 정리 노트를 만든다", planets: ["saturn"] },
      { label: "C", text: "\"나라면 이렇게 썼을 텐데\" 상상", planets: ["uranus"] },
      { label: "D", text: "꿈에서 그 세계가 계속 펼쳐진다", planets: ["neptune"] },
    ],
  },
  {
    id: 4,
    question: "친구에게 책을 추천할 때?",
    options: [
      { label: "A", text: "직접 사서 선물한다 (내 돈으로)", planets: ["jupiter"] },
      { label: "B", text: "\"단, 깨끗하게 읽어\" 조건부 추천", planets: ["saturn"] },
      { label: "C", text: "아무도 모르는 숨겨진 명작을 알려준다", planets: ["uranus"] },
      { label: "D", text: "\"이 책 읽으면 꿈이 바뀔 거야\"", planets: ["neptune"] },
    ],
  },
  {
    id: 5,
    question: "읽고 싶은 책이 10권 쌓이면?",
    options: [
      { label: "A", text: "독서 모임 만들어서 같이 읽자!", planets: ["jupiter"] },
      { label: "B", text: "읽는 순서와 규칙을 정해서 진행", planets: ["saturn"] },
      { label: "C", text: "가장 이상한 책부터 읽기 시작", planets: ["uranus"] },
      { label: "D", text: "책더미 앞에서 공상에 빠진다", planets: ["neptune"] },
    ],
  },
];

// ─── Personality results ───
export interface PlanetResult {
  planet: PlanetType;
  orbitGroup: OrbitGroup;
  title: string;
  tagline: string;
  astronomyFact: string;
  personality: string;
  readingStyle: string;
  traits: string[];
  weakness: string;
  recommendedGenres: string[];
  compatibility: PlanetType;
  incompatibility: PlanetType;
}

export const PLANET_RESULTS: Record<PlanetType, PlanetResult> = {
  mercury: {
    planet: "mercury",
    orbitGroup: "inner",
    title: "눈치 빠른 속독왕",
    tagline: "태양에 가장 가까이, 가장 빠르게 공전하는 별",
    astronomyFact: "공전 주기 88일, 태양계에서 가장 빠른 행성",
    personality: "눈치 빠르고 항상 바쁜 당신! 수성이 태양 주위를 88일 만에 돌듯, 책도 빠르게 흡수하고 다음으로 넘어가요. 읽을 책이 항상 산더미지만 그게 행복!",
    readingStyle: "속독의 달인. 핵심을 빠르게 파악하고 여러 책을 동시에 읽는 멀티태스커.",
    traits: ["빠른 독서 속도", "호기심 폭발", "읽을 책 항상 많음", "핵심 파악력"],
    weakness: "한 권을 깊이 읽기보단 다음 책이 궁금해서 넘어감",
    recommendedGenres: ["과학", "모험", "학습"],
    compatibility: "saturn",
    incompatibility: "neptune",
  },
  venus: {
    planet: "venus",
    orbitGroup: "inner",
    title: "감성 밑줄 장인",
    tagline: "밤하늘에서 가장 밝고 아름다운 별",
    astronomyFact: "새벽별/저녁별로 불리는 태양계에서 가장 밝은 행성",
    personality: "분위기 메이커 금성처럼, 책에서 아름다운 문장을 찾아내는 천재! 밑줄 없는 책은 없고, 감동 없는 독서는 없어요. 좋은 문장 하나에 하루가 행복해지는 타입.",
    readingStyle: "문장 수집가. 예쁜 표현에 밑줄 긋고 오래 음미하는 감성 독서가.",
    traits: ["문장 수집가", "감성 폭발", "분위기 메이커", "여운 즐기기"],
    weakness: "감동적인 부분에서 멈춰서 진도가 안 나감",
    recommendedGenres: ["동화", "판타지", "모험"],
    compatibility: "neptune",
    incompatibility: "mars",
  },
  earth: {
    planet: "earth",
    orbitGroup: "inner",
    title: "내가 세계의 중심",
    tagline: "스스로 중심인 줄 아는 생명의 별",
    astronomyFact: "태양계에서 유일하게 생명이 있는 행성 (본인이 특별하다고 확신)",
    personality: "독서록이 곧 일기장인 당신! 지구가 우주의 중심인 줄 알듯, 모든 책을 자기 이야기로 바꿔 읽어요. 하지만 그 생명력 넘치는 해석이 매력!",
    readingStyle: "자기 투영형. 모든 캐릭터에 자기를 대입하고, 독서록이 자서전이 되는 스타일.",
    traits: ["자기 투영력", "독서록=일기장", "생명력 넘침", "실용적 독서"],
    weakness: "자기 이야기만 하다가 원래 내용을 잊어버림",
    recommendedGenres: ["학습", "역사", "과학"],
    compatibility: "jupiter",
    incompatibility: "uranus",
  },
  mars: {
    planet: "mars",
    orbitGroup: "inner",
    title: "읽고 바로 실행하는 전사",
    tagline: "붉은 산화철의 전투적 개척자",
    astronomyFact: "화성 표면의 산화철이 붉은빛을 만듦 - 전쟁의 신 이름",
    personality: "화성의 붉은 열정처럼 도전적인 당신! 책을 읽으면 가만히 있지 못하고 바로 행동으로 옮겨요. '이론은 됐고, 실전이다!'가 인생 모토.",
    readingStyle: "실행형 독서가. 읽으면서 동시에 실행 계획을 세우는 액션파.",
    traits: ["즉각 실행력", "도전 정신", "열정적 독서", "개척자 기질"],
    weakness: "끝까지 안 읽고 중간에 실행하러 나감",
    recommendedGenres: ["모험", "학습", "역사"],
    compatibility: "mercury",
    incompatibility: "venus",
  },
  jupiter: {
    planet: "jupiter",
    orbitGroup: "outer",
    title: "중력의 희생형 리더",
    tagline: "거대한 중력으로 지구 대신 소행성을 맞아주는 수호자",
    astronomyFact: "목성의 중력이 지구로 향하는 소행성을 대신 끌어당김 - 태양계의 방패",
    personality: "목성이 지구 대신 소행성을 맞듯, 친구한테 책 사주고 독서 모임 만들고... 주변을 책으로 행복하게 만드는 희생형 리더! 내 책값보다 선물 책값이 더 많은 타입.",
    readingStyle: "공유형 독서가. 혼자 읽는 건 의미 없고, 함께 나눠야 진짜 독서라고 믿음.",
    traits: ["책 선물 장인", "독서 모임 리더", "함께 읽기", "큰 그릇"],
    weakness: "남한테 추천하느라 정작 자기 책은 안 읽음",
    recommendedGenres: ["과학", "역사", "학습"],
    compatibility: "earth",
    incompatibility: "saturn",
  },
  saturn: {
    planet: "saturn",
    orbitGroup: "outer",
    title: "선 긋는 원칙주의자",
    tagline: "아름다운 고리로 자신을 보호하는 원칙의 별",
    astronomyFact: "토성의 고리는 얼음과 먼지로 이루어진 경계선 - 넘지 마세요!",
    personality: "토성의 고리처럼 확실한 경계를 가진 당신! 책에 절대 낙서 안 하고, 빌려준 책 안 돌려주면 절교. 한 권을 깊이 있게 정독하며 겹겹이 지혜를 쌓아가는 현자.",
    readingStyle: "정독의 달인. 메모 정리하고, 책은 반드시 깨끗하게. 절대 접지 않음.",
    traits: ["책 보호 본능", "원칙주의", "깊은 정독", "메모 정리왕"],
    weakness: "책 한 페이지 접은 사람과 대화 불가",
    recommendedGenres: ["역사", "과학", "학습"],
    compatibility: "mercury",
    incompatibility: "jupiter",
  },
  uranus: {
    planet: "uranus",
    orbitGroup: "outer",
    title: "옆으로 구르는 아웃사이더",
    tagline: "혼자 옆으로 누워서 공전하는 독보적 존재",
    astronomyFact: "자전축이 98도 기울어져 옆으로 누워서 공전하는 유일한 행성",
    personality: "천왕성이 옆으로 누워 도는 것처럼, 나만의 방식이 확실한 당신! 베스트셀러는 관심 없고, 아무도 안 읽는 숨은 명작을 찾아내는 힙스터 독서가.",
    readingStyle: "독립형 독서가. 남들이 안 읽는 책, 독특한 장르를 찾아 나만의 세계를 구축.",
    traits: ["나만의 방식", "숨은 명작 발굴", "독창적 해석", "힙스터 독서"],
    weakness: "추천받은 책은 일부러 안 읽음",
    recommendedGenres: ["판타지", "과학", "기타"],
    compatibility: "venus",
    incompatibility: "earth",
  },
  neptune: {
    planet: "neptune",
    orbitGroup: "outer",
    title: "깊은 바다의 몽상가",
    tagline: "태양에서 가장 멀고 신비로운 별",
    astronomyFact: "태양에서 가장 먼 행성, 공전 주기 165년 - 시간 개념이 다름",
    personality: "해왕성처럼 깊고 신비로운 내면을 가진 당신! 책 읽다가 딴 생각하는 게 일상이지만, 그 '딴 생각'이 세상에서 가장 풍부한 상상의 세계. 꿈과 현실의 경계가 모호한 독서가.",
    readingStyle: "몽상형 독서가. 한 문단 읽고 30분 공상. 하지만 그 공상이 창의력의 원천.",
    traits: ["풍부한 상상력", "딴 생각 전문가", "깊은 내면", "꿈꾸는 독서"],
    weakness: "5페이지 읽는데 1시간 (공상 포함)",
    recommendedGenres: ["판타지", "동화", "모험"],
    compatibility: "venus",
    incompatibility: "mercury",
  },
};

// ─── Calculation ───
export function calculateResult(
  orbitGroup: OrbitGroup,
  answers: number[]
): PlanetType {
  const questions = orbitGroup === "inner" ? INNER_QUESTIONS : OUTER_QUESTIONS;
  const groupPlanets = ORBIT_GROUPS[orbitGroup].planets;

  const scores: Record<string, number> = {};
  groupPlanets.forEach((p) => (scores[p] = 0));

  answers.forEach((optionIndex, questionIndex) => {
    const question = questions[questionIndex];
    if (question && question.options[optionIndex]) {
      question.options[optionIndex].planets.forEach((p) => {
        scores[p] = (scores[p] || 0) + 1;
      });
    }
  });

  let maxScore = 0;
  let result: PlanetType = groupPlanets[0];

  groupPlanets.forEach((planet) => {
    if ((scores[planet] || 0) > maxScore) {
      maxScore = scores[planet] || 0;
      result = planet;
    }
  });

  return result;
}

// ─── Storage ───
const QUIZ_RESULT_KEY = "bookspec_quiz_result";

export function saveQuizResult(planet: PlanetType): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUIZ_RESULT_KEY, planet);
}

export function getQuizResult(): PlanetType | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(QUIZ_RESULT_KEY) as PlanetType | null;
}
