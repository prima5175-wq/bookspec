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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-5xl md:text-6xl font-bold mb-3 flex items-center justify-center gap-4">
          <div className="open-book">
            <div className="ob-left" />
            <div className="ob-right" />
            <div className="ob-light" />
          </div>
          <span className="logo-3d">BookSpec</span>
          <div className="logo-star-field">
            <div className="ls ls-1" />
            <div className="ls ls-2" />
            <div className="ls ls-3" />
            <div className="ls ls-4" />
            <div className="ls ls-5" />
          </div>
        </h1>
        <p className="text-gray-200 text-xl">
          우주를 탐험하며 독서 기록을 남겨보세요!
        </p>
      </div>

      {/* Quiz Result or CTA */}
      {quizResult ? (
        <Link href="/quiz" className="block">
          <div className="glass-card p-5 flex items-center gap-5 hover:scale-[1.02] transition-transform">
            <Planet type={quizResult} size={100} animate={true} />
            <div className="flex-1">
              <div className="text-sm text-gray-300 flex items-center gap-1">
                나의 행성 성격
                <span style={{ color: ORBIT_GROUPS[PLANET_RESULTS[quizResult].orbitGroup].color }}>
                  · {ORBIT_GROUPS[PLANET_RESULTS[quizResult].orbitGroup].title}
                </span>
              </div>
              <div className="text-lg font-bold mt-1">
                {PLANETS[quizResult].name} - {PLANET_RESULTS[quizResult].title}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {PLANET_RESULTS[quizResult].traits.slice(0, 3).join(" · ")}
              </div>
            </div>
            <span className="text-gray-400 text-sm">다시하기 →</span>
          </div>
        </Link>
      ) : (
        <Link href="/quiz" className="block">
          <div className="glass-card p-6 text-center hover:scale-[1.02] transition-transform bg-gradient-to-r from-purple-900/40 to-blue-900/40">
            <div className="text-5xl mb-2">🪐</div>
            <div className="font-bold text-lg">나의 독서 행성은?</div>
            <div className="text-sm text-gray-300 mt-2">
              태양계 독서유형 테스트 해보기 →
            </div>
          </div>
        </Link>
      )}

      {/* Today's Reading */}
      <Link href="/reading" className="block">
        <div className="glass-card p-5 hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">📖</div>
              <div>
                <div className="text-lg font-bold">오늘 {todayPages}p 읽음</div>
                <div className="text-sm text-gray-400">
                  {readStreak > 0 && `🔥 ${readStreak}일 연속`}
                  {planetLevel > 0 && ` · Lv.${planetLevel}`}
                </div>
              </div>
            </div>
            <span className="text-sm text-gray-400">기록하기 →</span>
          </div>
        </div>
      </Link>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-5 text-center">
          <div className="text-4xl font-bold text-purple-300">{totalBooks}</div>
          <div className="text-sm text-gray-300 mt-2">읽은 책</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-4xl font-bold text-cyan-300">{totalPages}</div>
          <div className="text-sm text-gray-300 mt-2">총 페이지</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-4xl font-bold text-yellow-300">
            ★ {avgRating}
          </div>
          <div className="text-sm text-gray-300 mt-2">평균 별점</div>
        </div>
      </div>

      {/* Planet Collection */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-5 flex items-center gap-3">
          <span className="text-3xl">🌌</span> 나의 행성 컬렉션
        </h2>
        <div className="grid grid-cols-4 gap-5">
          {(Object.keys(PLANETS) as PlanetType[]).map((key) => {
            const count = planetCounts[key] || 0;
            return (
              <div key={key} className="flex flex-col items-center gap-3">
                <Planet type={key} size={90} animate={true} />
                <div className="text-center">
                  <div className="text-sm font-bold">{PLANETS[key].name}</div>
                  <div className="text-sm text-gray-400">
                    {count > 0 ? `${count}권` : "0권"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Books */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <span className="text-3xl">🚀</span> 최근 읽은 책
          </h2>
          <Link
            href="/library"
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            전체보기 →
          </Link>
        </div>
        {recentBooks.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <div className="text-6xl mb-4">🛸</div>
            <p className="text-lg">아직 등록한 책이 없어요!</p>
            <Link
              href="/add"
              className="inline-block mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-base font-bold hover:from-purple-400 hover:to-blue-400 transition-all shadow-lg shadow-purple-900/30"
            >
              첫 번째 책 등록하기 ✨
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentBooks.map((book) => (
              <div
                key={book.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Planet type={book.planet} size={80} animate={false} />
                <div className="flex-1 min-w-0">
                  <div className="text-base font-bold truncate">{book.title}</div>
                  <div className="text-sm text-gray-400">{book.author}</div>
                </div>
                <StarRating rating={book.rating} readonly size="text-lg" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-3">
              <span className="text-3xl">🌱</span> 진행 중인 챌린지
            </h2>
            <Link
              href="/challenge"
              className="text-sm text-purple-300 hover:text-purple-200"
            >
              전체보기 →
            </Link>
          </div>
          <div className="space-y-3">
            {activeChallenges.slice(0, 2).map((ch) => {
              const status = getStageStatus(ch);
              const stage = ch.stages[status.stageIndex];
              return (
                <Link
                  key={ch.id}
                  href="/challenge"
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="text-3xl">{stage.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-medium truncate">{ch.bookTitle}</div>
                    <div className="text-sm text-gray-400">
                      {status.isReady ? (
                        <span className="text-purple-300 font-bold">도전 가능!</span>
                      ) : (
                        `${status.daysUntilReady}일 후 · ${stage.title}`
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
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
          <div className="glass-card p-5 hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-3">
                <span className="text-3xl">🦸</span> 히든 능력치
              </h2>
              <span className="text-sm text-gray-400">프로필 보기 →</span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {STAT_DEFS.slice(0, 5).map((def) => (
                <div key={def.key} className="text-center">
                  <div className="text-3xl">{def.icon}</div>
                  <div className="text-sm font-bold text-purple-300 mt-1">
                    {stats[def.key]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Link>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-4">
        <Link href="/shop" className="glass-card p-5 text-center hover:scale-[1.03] transition-transform">
          <div className="text-4xl mb-2">🛒</div>
          <div className="text-sm font-bold">행성 상점</div>
        </Link>
        <Link href="/challenge" className="glass-card p-5 text-center hover:scale-[1.03] transition-transform">
          <div className="text-4xl mb-2">🌱</div>
          <div className="text-sm font-bold">챌린지</div>
        </Link>
        <Link href="/subscribe" className="glass-card p-5 text-center hover:scale-[1.03] transition-transform bg-gradient-to-br from-yellow-900/30 to-orange-900/30">
          <div className="text-4xl mb-2">👑</div>
          <div className="text-sm font-bold text-yellow-300">프리미엄</div>
        </Link>
      </div>

      {/* Quick Add Button (mobile) */}
      <Link
        href="/add"
        className="fixed right-5 bottom-24 md:bottom-6 z-40 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-3xl shadow-xl shadow-purple-900/50 hover:scale-110 transition-transform border border-white/20"
      >
        +
      </Link>
    </div>
  );
}
