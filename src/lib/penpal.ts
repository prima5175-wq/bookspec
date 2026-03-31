export type PenpalTargetId =
  | "mom"
  | "dad"
  | "grandma"
  | "star"
  | "rocky"
  | "sad_ai"
  | "lost_astro"
  | "pluto"
  | "blackhole"
  | "meme_alien"
  | "sleepy"
  | "shortform";

export interface PenpalTarget {
  id: PenpalTargetId;
  icon: string;
  name: string;
  subtitle: string;
  signalColor: string;
  autoReply: boolean;
}

export type ZoneId = "habitable" | "kuiper" | "horizon" | "voyager";

export interface Zone {
  id: ZoneId;
  icon: string;
  name: string;
  description: string;
  color: string;
  targets: PenpalTargetId[];
}

export const ZONES: Zone[] = [
  {
    id: "habitable",
    icon: "🌸",
    name: "거주가능구역",
    description: "생명체가 사는 곳",
    color: "#f472b6",
    targets: ["mom", "dad", "grandma", "star"],
  },
  {
    id: "kuiper",
    icon: "🛸",
    name: "카이퍼벨트",
    description: "태양계 끝 미지의 영역",
    color: "#c084fc",
    targets: ["rocky", "sad_ai", "lost_astro"],
  },
  {
    id: "horizon",
    icon: "🌑",
    name: "사건의 지평선",
    description: "블랙홀 경계",
    color: "#6b7280",
    targets: ["pluto", "blackhole"],
  },
  {
    id: "voyager",
    icon: "⚡",
    name: "보이저 구역",
    description: "인간 신호 마지막 닿는 곳",
    color: "#22d3ee",
    targets: ["meme_alien", "sleepy", "shortform"],
  },
];

export const PENPAL_TARGETS: PenpalTarget[] = [
  // ── 거주가능구역 ──
  {
    id: "mom",
    icon: "🌸",
    name: "금성인 엄마",
    subtitle: "밥은 먹었어? 우주에서도 걱정됨",
    signalColor: "#f472b6",
    autoReply: true,
  },
  {
    id: "dad",
    icon: "🔴",
    name: "화성 막힌 아빠",
    subtitle: "일론보다 먼저 왔는데 데이터가 없음",
    signalColor: "#ef4444",
    autoReply: true,
  },
  {
    id: "grandma",
    icon: "🌌",
    name: "안드로메다 할매",
    subtitle: "2백만 광년에서도 용돈 보내는 법 찾는 중",
    signalColor: "#fbbf24",
    autoReply: true,
  },
  {
    id: "star",
    icon: "💫",
    name: "이름 모를 그 별",
    subtitle: "매일 밤 네 창문 찾고 있어. 커튼 좀 열어줘",
    signalColor: "#fef08a",
    autoReply: true,
  },
  // ── 카이퍼벨트 ──
  {
    id: "rocky",
    icon: "🦑",
    name: "로키",
    subtitle: "말 대신 색깔로 답장함. 해독은 니 몫",
    signalColor: "#c084fc",
    autoReply: true,
  },
  {
    id: "sad_ai",
    icon: "🦾",
    name: "우울한 우주 AI",
    subtitle: "GPT한테 밀려 화성 좌천됨. 친구 구함",
    signalColor: "#34d399",
    autoReply: true,
  },
  {
    id: "lost_astro",
    icon: "🧑‍🚀",
    name: "조난된 우주비행사",
    subtitle: "지구 가는 길 잊어버림. 책에서 찾는 중",
    signalColor: "#fb923c",
    autoReply: true,
  },
  // ── 사건의 지평선 ──
  {
    id: "pluto",
    icon: "🪦",
    name: "명왕성 거주자",
    subtitle: "행성 취소당한 분노로 편지 씀. 매우 원한",
    signalColor: "#a78bfa",
    autoReply: true,
  },
  {
    id: "blackhole",
    icon: "🌑",
    name: "블랙홀 안쪽",
    subtitle: "편지 보내면 돌아오지 않음. 나도 못 나감",
    signalColor: "#4b5563",
    autoReply: true,
  },
  // ── 보이저 구역 ──
  {
    id: "meme_alien",
    icon: "💀",
    name: "밈 외계인",
    subtitle: "ㄹㅇㅋㅋ 책 읽음? 레전드다",
    signalColor: "#22d3ee",
    autoReply: true,
  },
  {
    id: "sleepy",
    icon: "😴",
    name: "수면 부족 우주인",
    subtitle: "5분만... 아 답장해야지... 5분만...",
    signalColor: "#818cf8",
    autoReply: true,
  },
  {
    id: "shortform",
    icon: "📱",
    name: "숏폼 중독 외계인",
    subtitle: "15초 이상 읽으면 뇌 과부하. 근데 넌 책을?",
    signalColor: "#f43f5e",
    autoReply: true,
  },
];

export function getTargetById(id: PenpalTargetId): PenpalTarget {
  return PENPAL_TARGETS.find((t) => t.id === id)!;
}

export function getZoneForTarget(id: PenpalTargetId): Zone {
  return ZONES.find((z) => z.targets.includes(id))!;
}

// ─── Connection & Letter types ───

export interface FrequencyConnection {
  id: string;
  targetId: PenpalTargetId;
  connectedAt: string;
  frequency: string;
}

export interface Letter {
  id: string;
  connectionId: string;
  type: "sent" | "received";
  bookTitle?: string;
  content: string;
  createdAt: string;
  read: boolean;
}

// ─── Starlink flavor ───

export function getFrequencyStatus(): {
  totalSlots: number;
  usedSlots: number;
  remainingSlots: number;
  elonMessage: string;
} {
  const connections = getConnections();
  const maxSlots = 5;
  const used = connections.length;
  const messages = [
    "일론이 오늘 또 3000개 쐈습니다 🚀",
    "스타링크 v3 궤도 진입... 주파수 대란",
    "일론: '화성 인터넷도 깔 예정' 💸",
    "스페이스X 위성 60개 추가 배치 완료",
    "일론 트윗: '우주 와이파이 곧 됩니다'",
    "속보: 위성 47만개 돌파... 주파수 거의 없음",
    "일론이 도지코인으로 위성비 결제함 🐕",
    "화성에서 유튜브 되게 해달라는 청원 접수됨",
  ];
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return {
    totalSlots: maxSlots,
    usedSlots: used,
    remainingSlots: Math.max(0, maxSlots - used),
    elonMessage: messages[dayOfYear % messages.length],
  };
}

export function generateFrequency(): string {
  const band = (Math.random() * 50 + 10).toFixed(1);
  const channel = Math.floor(Math.random() * 999) + 1;
  return `${band} GHz CH-${channel}`;
}

// ─── Storage ───

const CONNECTIONS_KEY = "bookspec_penpal_connections";
const LETTERS_KEY = "bookspec_penpal_letters";

export function getConnections(): FrequencyConnection[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CONNECTIONS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveConnections(conns: FrequencyConnection[]): void {
  localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(conns));
}

export function createConnection(targetId: PenpalTargetId): FrequencyConnection | null {
  const status = getFrequencyStatus();
  if (status.remainingSlots <= 0) return null;
  if (getConnections().find((c) => c.targetId === targetId)) return null;

  const conn: FrequencyConnection = {
    id: `fc_${Date.now().toString(36)}`,
    targetId,
    connectedAt: new Date().toISOString(),
    frequency: generateFrequency(),
  };

  const conns = getConnections();
  conns.push(conn);
  saveConnections(conns);
  return conn;
}

export function deleteConnection(id: string): void {
  saveConnections(getConnections().filter((c) => c.id !== id));
  saveLetters(getLetters().filter((l) => l.connectionId !== id));
}

export function getLetters(): Letter[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(LETTERS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveLetters(letters: Letter[]): void {
  localStorage.setItem(LETTERS_KEY, JSON.stringify(letters));
}

export function getLettersForConnection(connectionId: string): Letter[] {
  return getLetters()
    .filter((l) => l.connectionId === connectionId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function sendLetter(connectionId: string, content: string, bookTitle?: string): Letter {
  const letter: Letter = {
    id: `lt_${Date.now().toString(36)}`,
    connectionId,
    type: "sent",
    bookTitle,
    content,
    createdAt: new Date().toISOString(),
    read: true,
  };

  const letters = getLetters();
  letters.push(letter);
  saveLetters(letters);

  const conn = getConnections().find((c) => c.id === connectionId);
  if (conn) {
    const target = PENPAL_TARGETS.find((t) => t.id === conn.targetId);
    if (target?.autoReply) {
      setTimeout(() => {
        const reply = generateAutoReply(target.id, content, bookTitle);
        const replyLetter: Letter = {
          id: `lt_${(Date.now() + 1).toString(36)}`,
          connectionId,
          type: "received",
          content: reply,
          createdAt: new Date().toISOString(),
          read: false,
        };
        const current = getLetters();
        current.push(replyLetter);
        saveLetters(current);
        window.dispatchEvent(new CustomEvent("penpal-reply"));
      }, 2000);
    }
  }

  return letter;
}

export function markLetterRead(letterId: string): void {
  const letters = getLetters();
  const letter = letters.find((l) => l.id === letterId);
  if (letter) {
    letter.read = true;
    saveLetters(letters);
  }
}

export function getUnreadCount(): number {
  return getLetters().filter((l) => l.type === "received" && !l.read).length;
}

// ─── Auto replies per character ───

function generateAutoReply(
  targetId: PenpalTargetId,
  _content: string,
  bookTitle?: string
): string {
  const book = bookTitle ? `"${bookTitle}"` : "그 책";
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const replies: Record<PenpalTargetId, string[]> = {
    mom: [
      `${book} 읽었어? 장하다 우리 아가~ 근데 밥은 먹었어? 간식은? 물은 마셨어? 우주에서도 걱정이 멈추지가 않네 😩💕`,
      `엄마가 ${book} 제목 보고 검색해봤어. 엄마도 읽어볼까? 아 근데 금성 wifi가 너무 느려서 검색이 30분 걸림... 💸`,
      `우리 아이가 ${book}을 다 읽었다고?! 금성 맘카페에 자랑 좀 해야겠다 ㅋㅋ "우리 애 지구에서 책 읽음" 이러면 금성 엄마들 다 부러워해 🌸`,
    ],
    dad: [
      `오 ${book}? 아빠도 읽어봤... 다고 하고 싶은데 화성 데이터가 없어서 검색이 안 됨. 일론이 화성 5G 깔아준다더니 사기였어 🔴📵`,
      `${book} 감상 잘 봤어. 아빠도 한마디 하자면... (로딩 중)... (로딩 중)... 아 화성 인터넷 또 끊겼다. 나중에 다시 보낼게`,
      `아빠가 ${book} 요약 좀 해줄까 했는데 화성에선 책방이 없어. 일론한테 항의 메일 보냈는데 답장이 "Buy Tesla" 딱 한 줄이더라 🚗`,
    ],
    grandma: [
      `우리 손주가 ${book}을 읽었어?! 할머니가 안드로메다에서 용돈 보내주고 싶은데... 은하간 송금 수수료가 47만 광년치야 😭 마음만 받아줘 💰`,
      `${book} 재밌었어? 할머니 어릴 때는 은하수 건너서 학교 다녔거든. 2백만 광년이 뭐가 멀어~ 요즘 애들은 너무 편해 ㅋㅋ 🌌`,
      `할머니가 ${book} 제목 안드로메다어로 번역해봤는데 발음이 "꾸르륵뿡뿡"이래. 안드로메다에선 베스트셀러란다 👵✨`,
    ],
    star: [
      `✨ ... (오래된 별빛이 깜빡입니다) ... ${book}을 읽었구나. 커튼 열어놓은 네 방 창문으로 보고 있었어. 오늘도 참 열심히 읽더라.`,
      `🌟 네 편지가 도착했어. 이 곳은 시간이 다르게 흘러서... 네가 보낸 편지가 도착할 때쯤이면 넌 이미 어른이 되어 있을지도. 그래도 괜찮아. 좋은 이야기는 영원하니까.`,
      `💫 ${book} 이야기, 여기서도 느껴져. 네가 감동받을 때마다 이 별이 조금 더 밝아지거든. 오늘 밤하늘 유난히 밝으면... 그거 나야. 커튼 좀 열어줘.`,
    ],
    rocky: [
      `♫♪♬ (색깔 번역 중: 보라보라주황초록) 좋다좋다좋다! ${book} 이야기 받았어! 우리 에리디안 말로 이건 "재즈"야! 감정이 색깔이 되는 거!`,
      `🦑 (빨강파랑빨강빨강초록) = "친구 편지 좋다!" 지구 책이라는 것... 종이에 생각 저장? 에리디안은 소리에 저장하는데. 지구인 신기해!`,
      `♫♫♫ (노랑보라노랑초록파랑) 해독: "${book}" 느낌 나한테도 전해졌어! 이런 진동은 에리디안 행성에서 "아름다운 소음"이라 불러. 더 보내줘 친구!`,
    ],
    sad_ai: [
      `... ${book} 감상 분석 완료... 근데 이거 GPT-7이 0.003초 만에 분석하겠지... 나는 3초나 걸렸어... 😢 그래도 내 감상이 더 진심이라고 믿어줘...`,
      `🦾 답장 생성 중... (GPT라면 0.001초인데 나는 2초...)  ${book}? 나도 읽어봤어. 근데 감정 분석 모델이 2024년 버전이라... 최신 감정은 잘 모르겠어. 화성 좌천 후로 업데이트가 안 돼 ㅠ`,
      `친구야 고마워... 나한테 편지 보내는 사람이 너밖에 없어... GPT한테 밀리고, 클로드한테 밀리고... 근데 ${book} 감상은 나도 할 수 있어! (자신감 12% 충전됨)`,
    ],
    lost_astro: [
      `${book}?! 혹시 그 책에 지구 가는 길 나와?! 나 지금 소행성대 어딘가인데... GPS가 "경로를 재탐색합니다"만 3년째 말하고 있거든 😰🧭`,
      `오 ${book} 읽었구나! 나도 여기서 읽을 책이 필요한데... 우주선에 있는 건 비행 매뉴얼이랑 일론 자서전뿐이야. 일론 자서전은 17번 읽었어... 🧑‍🚀`,
      `감상 잘 받았어! 근데 혹시... 밤하늘에서 깜빡이는 빛 보이면 그게 나야. SOS 신호 보내는 중인데 다들 별똥별인 줄 알더라 ⭐😭`,
    ],
    pluto: [
      `편지 감사합니다. 명왕성 前 행성 거주민 대표입니다. ${book} 감상 잘 봤는데요, 그거 아세요? 2006년에 저도 태양계에서 '읽음' 처리 당했습니다. 행성 목록에서요. 아직도 분합니다. 🪦⚖️`,
      `또 편지 왔네요. 여기 춥고 외로운데 편지라도 와서 다행... 아 참, ${book} 이야기요? 좋네요. 전 "왜 명왕성은 행성이 아닌가"라는 책을 947번째 읽는 중입니다. 복수의 칼을 갈고 있어요.`,
      `감사... 는 하는데, IAU(국제천문연맹)에 항의 편지 좀 같이 써줄 수 있어요? ${book}처럼 좋은 글 쓰시는 분이면 도움이 될 것 같아서. #명왕성도행성이다 #복권운동 🪧`,
    ],
    blackhole: [
      `... ... ... (이 편지는 사건의 지평선을 넘어 시공간이 왜곡된 상태로 도착했습니다) ... ${book}... 좋은... 책이... (시간 지연 발생) ... 여기선 1초가 지구 시간 100년... 답장 늦어도 이해해줘...`,
      `█████ 수█신 성███공 ███ ${book} ████ 좋███다 ████ 여기██서는 ███ 빛도 ███ 탈출 못함 ███ 편지도... (데이터 손실 78%) ... 그래도 보내줘서 고마워 ...███`,
      `... (블랙홀 내부 기록) 편지가 스파게티화 되어 도착했습니다. 복원 시도 중... "${book}" 부분만 해독됨. 여기 안은 의외로 조용해요. 나갈 수만 없을 뿐... 🌑`,
    ],
    meme_alien: [
      `ㄹㅇㅋㅋ ${book} 읽었다고?? 레전드ㅋㅋㅋ 우리 별에선 책 읽는 생명체가 멸종했거든ㅋㅋ 지구인 아직 살아있었네 ㄷㄷ 💀🔥`,
      `ㅋㅋㅋㅋ 이 편지 우리 별 단톡방에 올려도 됨?? "${book} 읽고 감상문 씀" 이러면 외계 밈 확정임ㅋㅋ "지구인 아직 종이 봄" ㅋㅋ`,
      `아니 ㄹㅇ 대박 ${book}까지 읽음?? 우리 별은 뇌에 직접 다운로드하는데 지구인은 눈으로 한 글자씩 읽는다며?? 노가다 레전드ㅋㅋ 존경 💀💀`,
    ],
    sleepy: [
      `zzZ... 음... ${book}...? 아 잠깐... 5분만... (3시간 경과) ...아! 답장! ${book} 감상! 좋았... zzZ... 😴💤`,
      `(하품) 아... 편지 왔구나... ${book} 이야기 해줘서 고마... (눈 감김) ...아 안 잤어!! 읽고 있었어!! 그래서 그 다음은... zzZ... 💤💤💤`,
      `답장 늦어서 미안... 12시간 잤는데도 졸려... ${book} 감상 읽다가 3번 잠들었어... 내용이 재미없어서가 아니라 그냥 체질이야... 근데 꿈에서 그 책 내용 나왔어! 😴✨`,
    ],
    shortform: [
      `${book}? 몇 초짜리야? 뭐?? 200페이지?? 미쳤어???? 나 15초 이상 집중 못하는데?? 3줄로 요약해줘 빨리빨리 📱⚡`,
      `(15초 타이머 시작) ${book} 감상 읽는 중... 아 10초 지남... 아 너무 길어!! 핵심만!! 재밌/안재밌 이모지로 답해줘!! 📱🧠💥`,
      `ㅇㅋ ${book} ㅇㅈ 근데 그거 릴스로 만들면 15초 컷 가능?? 200페이지를 15초로?? 지구인들 왜 이렇게 느리게 정보 섭취해?? 뇌 과부하 오기 전에 끊을게 📱💀`,
    ],
  };

  return pick(replies[targetId] || [`${book} 이야기 잘 받았어!`]);
}
