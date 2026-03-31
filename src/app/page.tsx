"use client";

import { useEffect, useState } from "react";
import { Book, PLANETS, PlanetType } from "@/lib/types";
import { getBooks } from "@/lib/storage";
import { getQuizResult, PLANET_RESULTS, ORBIT_GROUPS } from "@/lib/quiz";
import { calculateStats, STAT_DEFS, StatScores } from "@/lib/stats";
import { getChallenges, getStageStatus, getXP, getLevel, Challenge } from "@/lib/challenge";
import { getTodayPages, getStreak, getReadingLog, getDailyGoal, getPlanetLevel } from "@/lib/reading";
import Planet from "@/components/Planet";
import StarRating from "@/components/StarRating";
import Link from "next/link";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [quizResult, setQuizResult] = useState<PlanetType | null>(null);
  const [stats, setStats] = useState<StatScores | null>(null);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [xp, setXp] = useState(0);
  const [todayPages, setTodayPages] = useState(0);
  const [readStreak, setReadStreak] = useState(0);
  const [planetLevel, setPlanetLevel] = useState(0);

  useEffect(() => {
    const b = getBooks();
    setBooks(b);
    setQuizResult(getQuizResult());
    setStats(calculateStats(b));
    setActiveChallenges(getChallenges().filter((c) => !c.completed));
    setTodayPages(getTodayPages());
    setReadStreak(getStreak());
    setPlanetLevel(getPlanetLevel(getReadingLog().totalPages).level);
    setXp(getXP());
  }, []);

  const totalBooks = books.length;
  const totalPages = books.reduce((sum, b) => sum + b.pages, 0);
  const avgRating =
    totalBooks > 0
      ? (books.reduce((sum, b) => sum + b.rating, 0) / totalBooks).toFixed(1)
      : "0";

  const planetCounts = books.reduce(
    (acc, b) => {
      acc[b.planet] = (acc[b.planet] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const recentBooks = [...books]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            BookSpec
          </span>{" "}
          🪐
        </h1>
        <p className="text-gray-400 text-lg">
          우주를 탐험하며 독서 기록을 남겨보세요!
        </p>
      </div>

      {/* Quiz Result or CTA */}
      {quizResult ? (
        <Link href="/quiz" className="block">
          <div className="glass-card p-4 flex items-center gap-4 hover:scale-[1.01] transition-transform">
            <Planet type={quizResult} size={50} animate={true} />
            <div className="flex-1">
              <div className="text-xs text-gray-400 flex items-center gap-1">
                나의 행성 성격
                <span style={{ color: ORBIT_GROUPS[PLANET_RESULTS[quizResult].orbitGroup].color }}>
                  · {ORBIT_GROUPS[PLANET_RESULTS[quizResult].orbitGroup].title}
                </span>
              </div>
              <div className="font-bold">
                {PLANETS[quizResult].name} - {PLANET_RESULTS[quizResult].title}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {PLANET_RESULTS[quizResult].traits.slice(0, 3).join(" · ")}
              </div>
            </div>
            <span className="text-gray-500 text-xs">다시하기 →</span>
          </div>
        </Link>
      ) : (
        <Link href="/quiz" className="block">
          <div className="glass-card p-4 text-center hover:scale-[1.01] transition-transform bg-gradient-to-r from-purple-900/30 to-blue-900/30">
            <div className="text-2xl mb-1">🪐</div>
            <div className="font-bold text-sm">나의 독서 행성은?</div>
            <div className="text-xs text-gray-400 mt-1">
              태양계 독서유형 테스트 해보기 →
            </div>
          </div>
        </Link>
      )}

      {/* Today's Reading */}
      <Link href="/reading" className="block">
        <div className="glass-card p-4 hover:scale-[1.01] transition-transform">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📖</div>
              <div>
                <div className="text-sm font-medium">오늘 {todayPages}p 읽음</div>
                <div className="text-xs text-gray-500">
                  {readStreak > 0 && `🔥 ${readStreak}일 연속`}
                  {planetLevel > 0 && ` · Lv.${planetLevel}`}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-500">기록하기 →</span>
          </div>
        </div>
      </Link>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-purple-400">{totalBooks}</div>
          <div className="text-xs text-gray-400 mt-1">읽은 책</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-cyan-400">{totalPages}</div>
          <div className="text-xs text-gray-400 mt-1">총 페이지</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400">
            ★ {avgRating}
          </div>
          <div className="text-xs text-gray-400 mt-1">평균 별점</div>
        </div>
      </div>

      {/* Planet Collection */}
      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          🌌 나의 행성 컬렉션
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {(Object.keys(PLANETS) as PlanetType[]).map((key) => {
            const count = planetCounts[key] || 0;
            return (
              <div key={key} className="flex flex-col items-center gap-2">
                <div className={count === 0 ? "opacity-30 grayscale" : ""}>
                  <Planet type={key} size={45} animate={count > 0} />
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium">{PLANETS[key].name}</div>
                  <div className="text-xs text-gray-500">
                    {count > 0 ? `${count}권` : "-"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Books */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            🚀 최근 읽은 책
          </h2>
          <Link
            href="/library"
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            전체보기 →
          </Link>
        </div>
        {recentBooks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-3">🛸</div>
            <p>아직 등록한 책이 없어요!</p>
            <Link
              href="/add"
              className="inline-block mt-3 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium hover:from-purple-500 hover:to-blue-500 transition-all"
            >
              첫 번째 책 등록하기 ✨
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBooks.map((book) => (
              <div
                key={book.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Planet type={book.planet} size={40} animate={false} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{book.title}</div>
                  <div className="text-xs text-gray-400">{book.author}</div>
                </div>
                <StarRating rating={book.rating} readonly size="text-sm" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              🌱 진행 중인 챌린지
            </h2>
            <Link
              href="/challenge"
              className="text-xs text-purple-400 hover:text-purple-300"
            >
              전체보기 →
            </Link>
          </div>
          <div className="space-y-2">
            {activeChallenges.slice(0, 2).map((ch) => {
              const status = getStageStatus(ch);
              const stage = ch.stages[status.stageIndex];
              return (
                <Link
                  key={ch.id}
                  href="/challenge"
                  className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="text-lg">{stage.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{ch.bookTitle}</div>
                    <div className="text-xs text-gray-500">
                      {status.isReady ? (
                        <span className="text-purple-400">도전 가능!</span>
                      ) : (
                        `${status.daysUntilReady}일 후 · ${stage.title}`
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    {status.stageIndex + 1}/4
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Hidden Stats Preview */}
      {stats && books.length > 0 && (
        <Link href="/profile" className="block">
          <div className="glass-card p-4 hover:scale-[1.01] transition-transform">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                🦸 히든 능력치
              </h2>
              <span className="text-xs text-gray-500">프로필 보기 →</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {STAT_DEFS.slice(0, 5).map((def) => (
                <div key={def.key} className="text-center">
                  <div className="text-lg">{def.icon}</div>
                  <div className="text-xs font-bold text-purple-400">
                    {stats[def.key]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Link>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-3">
        <Link href="/shop" className="glass-card p-3 text-center hover:scale-[1.02] transition-transform">
          <div className="text-xl mb-1">🛒</div>
          <div className="text-xs font-medium">행성 상점</div>
        </Link>
        <Link href="/challenge" className="glass-card p-3 text-center hover:scale-[1.02] transition-transform">
          <div className="text-xl mb-1">🌱</div>
          <div className="text-xs font-medium">챌린지</div>
        </Link>
        <Link href="/subscribe" className="glass-card p-3 text-center hover:scale-[1.02] transition-transform bg-gradient-to-br from-yellow-900/20 to-orange-900/20">
          <div className="text-xl mb-1">👑</div>
          <div className="text-xs font-medium text-yellow-400">프리미엄</div>
        </Link>
      </div>

      {/* Quick Add Button (mobile) */}
      <Link
        href="/add"
        className="fixed right-4 bottom-20 md:bottom-4 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-2xl shadow-lg shadow-purple-900/50 hover:scale-110 transition-transform"
      >
        +
      </Link>
    </div>
  );
}
