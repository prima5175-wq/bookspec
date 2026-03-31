"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Book, PlanetType, PLANETS, Genre, GENRES } from "@/lib/types";
import { saveBook, generateId, getBooks } from "@/lib/storage";
import {
  calculateStats,
  savePrevStats,
  getStatChanges,
  StatKey,
} from "@/lib/stats";
import { startChallenge } from "@/lib/challenge";
import { earnFromBook } from "@/lib/satellite";
import Planet from "@/components/Planet";
import StarRating from "@/components/StarRating";
import StatPopup from "@/components/StatPopup";
import AIReview from "@/components/AIReview";
import Link from "next/link";

export default function AddBook() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [planet, setPlanet] = useState<PlanetType>("earth");
  const [genre, setGenre] = useState<Genre>("동화");
  const [pages, setPages] = useState("");
  const [dateRead, setDateRead] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [saved, setSaved] = useState(false);
  const [statChanges, setStatChanges] = useState<
    { key: StatKey; diff: number }[]
  >([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showChallengeOffer, setShowChallengeOffer] = useState(false);
  const savedBookRef = useRef<Book | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || rating === 0) return;

    // Snapshot stats before saving
    const prevStats = calculateStats(getBooks());

    const newBook: Book = {
      id: generateId(),
      title,
      author,
      rating,
      review,
      planet,
      genre,
      pages: Number(pages) || 0,
      dateRead,
      createdAt: new Date().toISOString(),
    };
    saveBook(newBook);
    savedBookRef.current = newBook;

    // Calculate stat changes
    const newStats = calculateStats(getBooks());
    const changes = getStatChanges(prevStats, newStats);
    savePrevStats(newStats);

    earnFromBook(); // +10 coins
    setSaved(true);

    if (changes.length > 0) {
      setStatChanges(changes);
      setShowPopup(true);
    } else {
      setShowChallengeOffer(true);
    }
  };

  const handlePopupDone = useCallback(() => {
    setShowPopup(false);
    setShowChallengeOffer(true);
  }, []);

  const handleStartChallenge = () => {
    if (savedBookRef.current) {
      startChallenge(savedBookRef.current);
      router.push("/challenge");
    }
  };

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        {showPopup && (
          <StatPopup changes={statChanges} onDone={handlePopupDone} />
        )}
        <div className="animate-float">
          <Planet type={planet} size={100} />
        </div>
        <h2 className="text-2xl font-bold mt-4">
          새로운 행성이 추가되었어요! 🎉
        </h2>
        <p className="text-gray-400">
          {PLANETS[planet].name}에 &quot;{title}&quot; 도착!
        </p>

        {/* Challenge offer */}
        {showChallengeOffer && !showPopup && (
          <div className="w-full max-w-sm space-y-3 mt-4 animate-fadeIn">
            <div className="glass-card p-4 text-center">
              <div className="text-2xl mb-2">🌱</div>
              <p className="text-sm font-medium">장기기억 챌린지 시작할까요?</p>
              <p className="text-xs text-gray-500 mt-1">
                90일간 4단계로 이 책을 오래 기억해요!
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/library"
                className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 text-center text-sm hover:bg-white/5 transition-colors"
              >
                다음에
              </Link>
              <button
                onClick={handleStartChallenge}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium hover:from-purple-500 hover:to-blue-500 transition-all"
              >
                🌱 시작하기!
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">
        📝 새 책 등록하기
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title & Author */}
        <div className="glass-card p-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              책 제목 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="어떤 책을 읽었나요?"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-white placeholder-gray-600 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              저자 *
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="누가 쓴 책인가요?"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-white placeholder-gray-600 transition-colors"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                페이지 수
              </label>
              <input
                type="number"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-white placeholder-gray-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                읽은 날짜
              </label>
              <input
                type="date"
                value={dateRead}
                onChange={(e) => setDateRead(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Genre */}
        <div className="glass-card p-5">
          <label className="block text-sm text-gray-400 mb-3">장르</label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGenre(g)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                  genre === g
                    ? "bg-purple-600/50 border-purple-500 text-white"
                    : "border-white/10 text-gray-400 hover:border-purple-500/50"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="glass-card p-5">
          <label className="block text-sm text-gray-400 mb-3">
            별점 * (얼마나 재미있었나요?)
          </label>
          <div className="flex justify-center">
            <StarRating rating={rating} onChange={setRating} size="text-4xl" />
          </div>
        </div>

        {/* Planet Selection */}
        <div className="glass-card p-5">
          <label className="block text-sm text-gray-400 mb-3">
            🪐 행성 선택 (이 책을 어느 행성에 보관할까요?)
          </label>
          <div className="grid grid-cols-4 gap-3">
            {(Object.keys(PLANETS) as PlanetType[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setPlanet(key)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                  planet === key
                    ? "border-purple-500 bg-purple-600/20"
                    : "border-transparent hover:bg-white/5"
                }`}
              >
                <Planet type={key} size={36} animate={planet === key} />
                <span className="text-xs">{PLANETS[key].name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Review */}
        <div className="glass-card p-5">
          <label className="block text-sm text-gray-400 mb-1">
            감상문 (이 책은 어땠나요?)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="책을 읽고 느낀 점을 적어보세요..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-white placeholder-gray-600 transition-colors resize-none"
          />
        </div>

        {/* AI Review */}
        {review.trim().length >= 5 && (
          <AIReview
            bookTitle={title}
            author={author}
            review={review}
            rating={rating}
          />
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!title || !author || rating === 0}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg hover:from-purple-500 hover:to-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-900/30"
        >
          🚀 우주로 보내기!
        </button>
      </form>
    </div>
  );
}
