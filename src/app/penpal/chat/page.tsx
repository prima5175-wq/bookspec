"use client";

import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getTargetById,
  getZoneForTarget,
  FrequencyConnection,
  Letter,
  getConnections,
  getLettersForConnection,
  sendLetter,
  markLetterRead,
} from "@/lib/penpal";
import {
  SatelliteTier,
  GiftType,
  TIERS,
  GIFTS,
  getCoins,
  spendCoins,
  earnFromLetter,
  addLaunch,
  generateAIReport,
  getPlanetDecoration,
} from "@/lib/satellite";
import { getBooks } from "@/lib/storage";
import { Book } from "@/lib/types";

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const connId = searchParams.get("id");

  const [conn, setConn] = useState<FrequencyConnection | null>(null);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [message, setMessage] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [showBookPicker, setShowBookPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const [rocketLaunch, setRocketLaunch] = useState(false);
  const [rocketTier, setRocketTier] = useState<SatelliteTier>("basic");
  const [incomingAnim, setIncomingAnim] = useState(false);
  // Satellite selection
  const [showTierPicker, setShowTierPicker] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SatelliteTier>("basic");
  const [selectedGift, setSelectedGift] = useState<GiftType | null>(null);
  const [coins, setCoinsState] = useState(0);
  const [satCount, setSatCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(() => {
    if (!connId) return;
    const ltrs = getLettersForConnection(connId);
    setLetters(ltrs);
    ltrs.filter((l) => l.type === "received" && !l.read).forEach((l) => markLetterRead(l.id));
    setCoinsState(getCoins());
    setSatCount(getPlanetDecoration(connId).totalSatellites);
  }, [connId]);

  useEffect(() => {
    if (!connId) return;
    const c = getConnections().find((x) => x.id === connId);
    if (!c) { router.push("/penpal"); return; }
    setConn(c);
    setBooks(getBooks());
    refresh();

    const handler = () => {
      setIncomingAnim(true);
      setTimeout(() => { setIncomingAnim(false); refresh(); }, 2500);
    };
    window.addEventListener("penpal-reply", handler);
    return () => window.removeEventListener("penpal-reply", handler);
  }, [connId, router, refresh]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [letters, incomingAnim]);

  const fetchAIReport = async (connectionId: string, bookTitle: string, reviewText: string) => {
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookTitle, author: "", review: reviewText, rating: 0 }),
      });

      if (!res.ok) {
        // Fallback to static report
        const fallback = generateAIReport(bookTitle, reviewText);
        addAIReportLetter(connectionId, fallback);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) fullText += parsed.text;
              } catch { /* skip */ }
            }
          }
        }
      }

      addAIReportLetter(connectionId, `📋 AI 첨삭 리포트 (Claude)\n━━━━━━━━━━━━━━━━━━━\n${fullText}`);
    } catch {
      const fallback = generateAIReport(bookTitle, reviewText);
      addAIReportLetter(connectionId, fallback);
    }
  };

  const addAIReportLetter = (connectionId: string, content: string) => {
    setTimeout(() => {
      const letters = JSON.parse(localStorage.getItem("bookspec_penpal_letters") || "[]");
      letters.push({
        id: `lt_${(Date.now() + 2).toString(36)}`,
        connectionId,
        type: "received",
        content,
        createdAt: new Date().toISOString(),
        read: false,
      });
      localStorage.setItem("bookspec_penpal_letters", JSON.stringify(letters));
      window.dispatchEvent(new CustomEvent("penpal-reply"));
    }, 3500);
  };

  if (!conn) return null;

  const target = getTargetById(conn.targetId);
  const zone = getZoneForTarget(conn.targetId);
  const bookObj = books.find((b) => b.id === selectedBook);
  const tierInfo = TIERS.find((t) => t.id === selectedTier)!;

  const handleSend = () => {
    if (!message.trim()) return;
    if (tierInfo.cost > 0 && !spendCoins(tierInfo.cost)) return;

    earnFromLetter();
    setSending(true);
    setRocketTier(selectedTier);
    setRocketLaunch(true);

    setTimeout(() => {
      const letter = sendLetter(conn.id, message, bookObj?.title);

      addLaunch({
        id: `sat_${Date.now().toString(36)}`,
        letterId: letter.id,
        connectionId: conn.id,
        tier: selectedTier,
        gift: (selectedTier !== "basic" && selectedGift) ? selectedGift : undefined,
        launchedAt: new Date().toISOString(),
      });

      // AI report for special tier - call real Claude API
      if (selectedTier === "special") {
        fetchAIReport(conn.id, bookObj?.title || "", message);
      }

      setMessage("");
      setSelectedBook("");
      setShowBookPicker(false);
      setSelectedTier("basic");
      setSelectedGift(null);
      setShowTierPicker(false);
      setSending(false);
      refresh();
      setTimeout(() => setRocketLaunch(false), 500);
    }, 2000);
  };

  const decoration = getPlanetDecoration(connId!);

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="glass-card p-3 mb-2 flex items-center gap-3">
        <button onClick={() => router.push("/penpal")} className="text-gray-400 hover:text-white text-sm">←</button>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
          style={{ background: target.signalColor + "20" }}
        >
          {target.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{target.name}</div>
          <div className="text-[10px] text-gray-600 font-mono">{conn.frequency}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500">🛰️{satCount}</span>
          <div className="flex items-center gap-1 bg-yellow-600/15 px-2 py-0.5 rounded-full">
            <span className="text-[10px]">🪙</span>
            <span className="text-xs font-bold text-yellow-400">{coins}</span>
          </div>
        </div>
      </div>

      {/* Satellite status bar */}
      {decoration.level > 0 && (
        <div className="text-center mb-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500">
            🛰️ 위성 {decoration.totalSatellites}개 · {decoration.title}
            {decoration.gifts.star > 0 && ` · ⭐${decoration.gifts.star}`}
            {decoration.gifts.moon > 0 && ` · 🌙${decoration.gifts.moon}`}
            {decoration.gifts.crystal > 0 && ` · 💎${decoration.gifts.crystal}`}
            {decoration.gifts.aurora > 0 && ` · 🌈${decoration.gifts.aurora}`}
          </span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-3 px-1">
        {letters.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <div className="text-4xl mb-3">📡</div>
            <p className="text-sm">{target.name}에게 첫 편지를 보내보세요!</p>
          </div>
        )}

        {letters.map((letter) => (
          <div key={letter.id} className={`flex ${letter.type === "sent" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 ${
              letter.type === "sent"
                ? "bg-purple-600/30 border border-purple-500/30 rounded-br-md"
                : "glass-card rounded-bl-md"
            }`}>
              {letter.type === "received" && (
                <div className="text-xs mb-1" style={{ color: target.signalColor }}>
                  {target.icon} {target.name}
                </div>
              )}
              {letter.bookTitle && (
                <div className="text-xs text-cyan-400/70 mb-1">📖 {letter.bookTitle}</div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{letter.content}</p>
              <div className="text-[10px] text-gray-600 mt-1.5 text-right">
                {new Date(letter.createdAt).toLocaleString("ko-KR", {
                  month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {incomingAnim && (
          <div className="flex justify-start">
            <div className="satellite-landing">
              <div className="text-2xl">🛰️</div>
              <div className="text-xs text-gray-400 mt-1">신호 수신 중...</div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Rocket launch overlay - different per tier */}
      {rocketLaunch && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-center pb-32">
          <div className={`rocket-launch ${rocketTier === "special" ? "rocket-special" : rocketTier === "loaded" ? "rocket-loaded" : ""}`}>
            <div className="text-4xl">
              {rocketTier === "special" ? "🌌" : rocketTier === "loaded" ? "🛰️" : "🚀"}
            </div>
            <div className="rocket-trail" />
            {rocketTier !== "basic" && (
              <div className="rocket-sparkles">
                {[0,1,2,3,4].map((i) => (
                  <div key={i} className="rocket-spark" style={{
                    left: `${-10 + i * 5}px`,
                    animationDelay: `${i * 0.1}s`,
                  }} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tier Picker */}
      {showTierPicker && (
        <div className="glass-card p-3 mb-2 space-y-3">
          <div className="text-xs text-gray-500">위성 등급 선택</div>

          {/* Tier buttons */}
          <div className="grid grid-cols-3 gap-2">
            {TIERS.map((tier) => {
              const canAfford = coins >= tier.cost;
              const isSelected = selectedTier === tier.id;
              return (
                <button
                  key={tier.id}
                  onClick={() => { setSelectedTier(tier.id); if (tier.id === "basic") setSelectedGift(null); }}
                  disabled={!canAfford && tier.cost > 0}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "scale-[1.03]"
                      : !canAfford && tier.cost > 0
                        ? "opacity-30"
                        : "hover:bg-white/5"
                  }`}
                  style={isSelected ? {
                    borderColor: tier.color + "60",
                    background: tier.color + "15",
                  } : { borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <div className="text-lg">{tier.icon}</div>
                  <div className="text-[10px] font-medium mt-1">{tier.name}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: tier.cost > 0 ? tier.color : "#94a3b8" }}>
                    {tier.cost > 0 ? `🪙${tier.cost}` : "무료"}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Gift selection for loaded/special */}
          {selectedTier !== "basic" && (
            <div>
              <div className="text-[10px] text-gray-500 mb-2">선물 선택</div>
              <div className="grid grid-cols-4 gap-1.5">
                {GIFTS.map((gift) => (
                  <button
                    key={gift.id}
                    onClick={() => setSelectedGift(gift.id)}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      selectedGift === gift.id
                        ? "border-purple-500/50 bg-purple-600/20"
                        : "border-white/5 hover:bg-white/5"
                    }`}
                  >
                    <div className="text-lg">{gift.icon}</div>
                    <div className="text-[9px] text-gray-400 mt-0.5">{gift.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Special tier AI report note */}
          {selectedTier === "special" && (
            <div className="text-[10px] text-yellow-400/60 bg-yellow-600/10 rounded-lg p-2">
              📋 AI가 독서록을 첨삭해서 리포트를 보내드려요!
            </div>
          )}

          {/* Tier features summary */}
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-gray-600">
              {tierInfo.features.join(" · ")}
            </span>
            <button
              onClick={() => setShowTierPicker(false)}
              className="text-gray-500 hover:text-white"
            >
              접기
            </button>
          </div>
        </div>
      )}

      {/* Book picker */}
      {showBookPicker && (
        <div className="glass-card p-3 mb-2 max-h-28 overflow-y-auto">
          <div className="text-xs text-gray-500 mb-2">어떤 책에 대한 편지?</div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => { setSelectedBook(""); setShowBookPicker(false); }}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                !selectedBook ? "border-purple-500 bg-purple-600/20 text-white" : "border-white/10 text-gray-400"
              }`}
            >
              선택 안 함
            </button>
            {books.map((b) => (
              <button
                key={b.id}
                onClick={() => { setSelectedBook(b.id); setShowBookPicker(false); }}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  selectedBook === b.id ? "border-purple-500 bg-purple-600/20 text-white" : "border-white/10 text-gray-400"
                }`}
              >
                {b.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="glass-card p-3">
        {/* Selected meta */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {selectedBook && bookObj && (
            <span className="text-[10px] text-cyan-400/70 flex items-center gap-1 bg-cyan-600/10 px-2 py-0.5 rounded-full">
              📖 {bookObj.title}
              <button onClick={() => setSelectedBook("")} className="text-gray-600 hover:text-gray-400">✕</button>
            </span>
          )}
          <button
            onClick={() => setShowTierPicker(!showTierPicker)}
            className="text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-full transition-all"
            style={{
              background: tierInfo.color + "15",
              color: tierInfo.color,
              border: `1px solid ${tierInfo.color}30`,
            }}
          >
            {tierInfo.icon} {tierInfo.name}
            {tierInfo.cost > 0 && <span className="opacity-60">🪙{tierInfo.cost}</span>}
            {selectedGift && <span>{GIFTS.find((g) => g.id === selectedGift)?.icon}</span>}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowBookPicker(!showBookPicker)}
            className="shrink-0 w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-sm hover:bg-white/10 transition-colors"
          >
            📖
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="편지를 써보세요..."
            className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm text-white placeholder-gray-600 transition-colors"
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || sending || (tierInfo.cost > 0 && coins < tierInfo.cost)}
            className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm disabled:opacity-30 transition-all"
            style={{
              background: `linear-gradient(135deg, ${tierInfo.color}80, ${tierInfo.color}40)`,
            }}
          >
            {tierInfo.icon}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={<div className="flex items-center justify-center min-h-[50vh] text-gray-500">📡 주파수 연결 중...</div>}
    >
      <ChatContent />
    </Suspense>
  );
}
