"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getBooks } from "@/lib/storage";
import { Book, PlanetType } from "@/lib/types";
import { addReadingEntry } from "@/lib/reading";
import { saveJournal, EMOTIONS, JournalEntry } from "@/lib/journal";
import { sendLetter, getConnections } from "@/lib/penpal";
import { earnFromBook } from "@/lib/satellite";
import Planet from "@/components/Planet";
import { getQuizResult } from "@/lib/quiz";

type Step = "write" | "chat" | "send" | "done";

export default function WritePage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pagesRead, setPagesRead] = useState("");
  const [quote, setQuote] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [emotion, setEmotion] = useState("");
  const [step, setStep] = useState<Step>("write");

  // AI chat
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Send
  const [rocketLaunch, setRocketLaunch] = useState(false);
  const [myPlanet, setMyPlanet] = useState<PlanetType>("earth");

  useEffect(() => {
    setBooks(getBooks());
    setMyPlanet((getQuizResult() as PlanetType) || "earth");
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Auto-fill when selecting existing book
  const handleBookSelect = (id: string) => {
    setSelectedBookId(id);
    const book = books.find((b) => b.id === id);
    if (book) {
      setBookTitle(book.title);
      setAuthor(book.author);
    }
  };

  // AI chat
  const handleChatSend = useCallback(async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookTitle,
          author,
          pages: pagesRead,
          quote,
          thoughts,
          emotion,
          question: userMsg,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      setChatMessages((prev) => [...prev, { role: "ai", text: "" }]);

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
                if (parsed.text) {
                  aiText += parsed.text;
                  setChatMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: "ai", text: aiText };
                    return updated;
                  });
                }
              } catch {
                /* skip */
              }
            }
          }
        }
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "앗, 우주 신호가 불안정해요! 다시 시도해볼래요? 🛸",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, chatLoading, bookTitle, author, pagesRead, quote, thoughts, emotion]);

  // Save & send
  const handleSave = () => {
    if (!bookTitle.trim()) return;

    // Save reading entry
    if (Number(pagesRead) > 0) {
      addReadingEntry(
        Number(pagesRead),
        selectedBookId || undefined,
        bookTitle
      );
    }

    // Save journal
    const entry: JournalEntry = {
      id: `j_${Date.now().toString(36)}`,
      bookId: selectedBookId || undefined,
      bookTitle,
      author,
      pagesRead: Number(pagesRead) || 0,
      quote,
      thoughts,
      emotion,
      aiChat: chatMessages,
      createdAt: new Date().toISOString(),
      sentToPenpal: false,
    };
    saveJournal(entry);
    earnFromBook();

    setStep("send");
    setRocketLaunch(true);

    // Send to first penpal connection if exists
    const connections = getConnections();
    if (connections.length > 0) {
      const content = formatJournalForPenpal(entry);
      sendLetter(connections[0].id, content, bookTitle);
      entry.sentToPenpal = true;
    }

    setTimeout(() => {
      setRocketLaunch(false);
      setStep("done");
    }, 3000);
  };

  const formatJournalForPenpal = (entry: JournalEntry): string => {
    let text = `📖 독서록: ${entry.bookTitle}\n`;
    if (entry.author) text += `✍️ ${entry.author}\n`;
    if (entry.pagesRead) text += `📄 오늘 ${entry.pagesRead}p 읽었어요\n`;
    if (entry.emotion) text += `${entry.emotion}\n`;
    text += `\n`;
    if (entry.quote) text += `💬 기억하고 싶은 문장:\n"${entry.quote}"\n\n`;
    if (entry.thoughts) text += `💭 내 생각:\n${entry.thoughts}`;
    return text;
  };

  // ── SEND/DONE ──
  if (step === "send" || step === "done") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] gap-6 text-center">
        {rocketLaunch && (
          <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
            <div className="rocket-launch rocket-special">
              <div className="text-5xl">🚀</div>
              <div className="rocket-trail" />
              <div className="rocket-sparkles">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="rocket-spark"
                    style={{
                      left: `${-10 + i * 5}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="animate-fadeIn space-y-4">
            <div className="animate-float">
              <Planet type={myPlanet} size={100} animate={true} />
            </div>
            <h2 className="text-2xl font-bold">독서록 발사 완료! 🚀</h2>
            <p className="text-gray-400 text-sm">
              {getConnections().length > 0
                ? "펜팔에게도 전송되었어요!"
                : "우주 기록 보관소에 저장되었어요!"}
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setStep("write");
                  setQuote("");
                  setThoughts("");
                  setPagesRead("");
                  setEmotion("");
                  setChatMessages([]);
                }}
                className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-colors"
              >
                또 쓰기
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium transition-all"
              >
                홈으로
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── AI CHAT ──
  if (step === "chat") {
    return (
      <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setStep("write")}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← 독서록으로
          </button>
          <h2 className="text-sm font-bold text-cyan-400">
            🤖 AI와 생각 나누기
          </h2>
          <button
            onClick={() => setStep("write")}
            className="text-xs text-purple-400 hover:text-purple-300"
          >
            완료
          </button>
        </div>

        {/* Context card */}
        <div className="glass-card p-3 mb-3 text-xs text-gray-500 flex items-center gap-2">
          <span>📖</span>
          <span className="truncate">
            {bookTitle || "책 제목 미입력"} · {emotion || "감정 미선택"}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pb-3 px-1">
          {chatMessages.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              <div className="text-4xl mb-3">🌙</div>
              <p className="text-sm journal-font">
                책에서 궁금한 것, 느낀 것을
                <br />
                AI 친구와 이야기해보세요!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {[
                  "이 책에서 제일 좋았던 장면이 뭐야?",
                  "주인공은 왜 그렇게 했을까?",
                  "나도 이런 경험이 있어!",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setChatInput(suggestion);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-gray-400 hover:border-cyan-500/40 hover:text-cyan-400 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3 ${
                  msg.role === "user"
                    ? "bg-purple-600/30 border border-purple-500/30 rounded-br-md"
                    : "glass-card rounded-bl-md"
                }`}
              >
                {msg.role === "ai" && (
                  <div className="text-xs text-cyan-400 mb-1">🤖 우주 친구</div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap journal-font">
                  {msg.text}
                  {chatLoading &&
                    i === chatMessages.length - 1 &&
                    msg.role === "ai" && (
                      <span className="inline-block w-1.5 h-4 bg-cyan-400 ml-0.5 animate-pulse" />
                    )}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="glass-card p-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleChatSend()
              }
              placeholder="궁금한 거 물어보기..."
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-sm text-white placeholder-gray-600 transition-colors journal-font"
              disabled={chatLoading}
            />
            <button
              onClick={handleChatSend}
              disabled={!chatInput.trim() || chatLoading}
              className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center text-sm disabled:opacity-30 transition-all"
            >
              💬
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── WRITE ──
  const selectedEmotion = EMOTIONS.find((e) => e.emoji === emotion);

  return (
    <div className="space-y-4">
      {/* Header with moon */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold journal-font"><span className="text-4xl">📝</span> 독서록 쓰기</h1>
        <div className="text-5xl animate-float">🌙</div>
      </div>

      {/* Notebook area */}
      <div className="space-y-3">
        {/* Book selection */}
        <div className="journal-card p-3 space-y-2">
          <h2 className="text-base font-semibold text-purple-300 flex items-center gap-2">
            <span className="text-3xl">📖</span> 어떤 책을 읽었나요?
          </h2>
          {books.length > 0 && (
            <select
              value={selectedBookId}
              onChange={(e) => handleBookSelect(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-base text-white focus:border-purple-500 focus:outline-none transition-colors"
            >
              <option value="">직접 입력</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} - {b.author}
                </option>
              ))}
            </select>
          )}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              placeholder="책 제목 *"
              className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none text-base text-white placeholder-gray-500 transition-colors journal-font"
            />
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="저자"
              className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none text-base text-white placeholder-gray-500 transition-colors journal-font"
            />
          </div>
        </div>

        {/* Pages read */}
        <div className="journal-card p-3">
          <h2 className="text-base font-semibold text-cyan-300 flex items-center gap-2">
            <span className="text-3xl">📄</span> 오늘 몇 페이지 읽었어요?
          </h2>
          <input
            type="number"
            value={pagesRead}
            onChange={(e) => setPagesRead(e.target.value)}
            placeholder="0"
            min="0"
            className="mt-2 w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-cyan-500 focus:outline-none text-base text-white placeholder-gray-500 transition-colors journal-font"
          />
        </div>

        {/* Quote - underline feeling */}
        <div className="journal-card p-3">
          <h2 className="text-base font-semibold text-yellow-300 flex items-center gap-2">
            <span className="text-3xl">💬</span> 기억하고 싶은 문장
            <span className="text-xs text-gray-500 font-normal">
              밑줄 긋기
            </span>
          </h2>
          <div className="relative mt-2">
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="책에서 마음에 든 문장을 적어보세요..."
              rows={3}
              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-yellow-500 focus:outline-none text-base text-white placeholder-gray-500 transition-colors resize-y journal-font quote-underline"
            />
          </div>
        </div>

        {/* Thoughts */}
        <div className="journal-card p-3">
          <h2 className="text-base font-semibold text-green-300 flex items-center gap-2">
            <span className="text-3xl">💭</span> 나의 생각과 질문들
          </h2>
          <textarea
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            placeholder="책을 읽으면서 든 생각, 궁금한 점을 자유롭게 적어보세요..."
            rows={5}
            className="mt-2 w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-green-500 focus:outline-none text-base text-white placeholder-gray-500 transition-colors resize-y journal-font"
          />
        </div>

        {/* Emotion */}
        <div className="journal-card p-3">
          <h2 className="text-base font-semibold text-pink-300 flex items-center gap-2">
            <span className="text-3xl">🪐</span> 오늘의 감정
          </h2>
          <div className="grid grid-cols-5 gap-2 mt-3">
            {EMOTIONS.map((e) => (
              <button
                key={e.emoji}
                type="button"
                onClick={() => setEmotion(e.emoji)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                  emotion === e.emoji
                    ? "scale-[1.05]"
                    : "border-white/5 hover:bg-white/5"
                }`}
                style={
                  emotion === e.emoji
                    ? {
                        borderColor: e.color + "60",
                        background: e.color + "15",
                      }
                    : undefined
                }
              >
                <span className="text-4xl">{e.emoji}</span>
                <span className="text-[10px] text-gray-400 leading-tight">{e.label}</span>
              </button>
            ))}
          </div>
          {selectedEmotion && (
            <div
              className="mt-3 text-center text-base font-bold animate-fadeIn"
              style={{ color: selectedEmotion.color }}
            >
              <span className="text-3xl mr-1">{selectedEmotion.emoji}</span>
              {selectedEmotion.label}
            </div>
          )}
        </div>

        {/* AI Chat button */}
        {(thoughts.trim() || quote.trim()) && (
          <button
            onClick={() => setStep("chat")}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600/80 to-blue-600/80 border border-cyan-500/30 text-white font-medium text-sm hover:from-cyan-500/80 hover:to-blue-500/80 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-lg">🤖</span>
            <span>AI와 생각 나누기</span>
          </button>
        )}

        {/* AI chat summary if returned from chat */}
        {chatMessages.length > 0 && step === "write" && (
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-cyan-400">
                🤖 AI와 {chatMessages.length}개 대화 완료
              </span>
              <button
                onClick={() => setStep("chat")}
                className="text-[10px] text-gray-500 hover:text-white"
              >
                이어서 대화 →
              </button>
            </div>
            <p className="text-xs text-gray-500 truncate">
              마지막:{" "}
              {chatMessages[chatMessages.length - 1]?.text.slice(0, 60)}...
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSave}
          disabled={!bookTitle.trim()}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg hover:from-purple-500 hover:to-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2"
        >
          <span>🚀</span>
          <span>독서록 발사!</span>
        </button>
      </div>
    </div>
  );
}
