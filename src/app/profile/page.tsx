"use client";

import { useEffect, useState } from "react";
import { Book, PLANETS } from "@/lib/types";
import { getBooks } from "@/lib/storage";
import {
  calculateStats,
  StatScores,
  BADGES,
  RARITY_COLORS,
  Badge,
} from "@/lib/stats";
import { getQuizResult, PLANET_RESULTS, ORBIT_GROUPS } from "@/lib/quiz";
import RadarChart from "@/components/RadarChart";
import Planet from "@/components/Planet";

export default function ProfilePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<StatScores | null>(null);
  const [quizResult, setQuizResult] = useState<string | null>(null);

  useEffect(() => {
    const b = getBooks();
    setBooks(b);
    setStats(calculateStats(b));
    setQuizResult(getQuizResult());
  }, []);

  if (!stats) return null;

  const earnedBadges = BADGES.filter((b) => b.condition(stats, books));
  const lockedBadges = BADGES.filter((b) => !b.condition(stats, books));

  const totalPower = Math.round(
    Object.values(stats).reduce((a, b) => a + b, 0) / 10
  );

  const powerTitle =
    totalPower >= 80
      ? "우주급 독서 마스터"
      : totalPower >= 60
        ? "은하계 독서 전사"
        : totalPower >= 40
          ? "행성급 독서인"
          : totalPower >= 20
            ? "위성급 독서 입문자"
            : "우주먼지 수준";

  const powerColor =
    totalPower >= 80
      ? "#fbbf24"
      : totalPower >= 60
        ? "#c084fc"
        : totalPower >= 40
          ? "#60a5fa"
          : totalPower >= 20
            ? "#34d399"
            : "#94a3b8";

  return (
    <div className="space-y-5 pb-6">
      {/* ── Profile Header ── */}
      <div className="glass-card p-8 text-center">
        <div className="flex justify-center mb-5">
          {quizResult ? (
            <Planet
              type={quizResult as keyof typeof PLANETS}
              size={180}
              animate={true}
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-7xl">
              🧑‍🚀
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold mb-2">나의 독서 프로필</h1>
        {quizResult && (
          <div className="mb-3">
            <p className="text-lg text-gray-300">
              {PLANETS[quizResult as keyof typeof PLANETS].name} -{" "}
              {PLANET_RESULTS[quizResult as keyof typeof PLANET_RESULTS].title}
            </p>
            <p className="text-sm mt-1" style={{ color: ORBIT_GROUPS[PLANET_RESULTS[quizResult as keyof typeof PLANET_RESULTS].orbitGroup].color }}>
              {ORBIT_GROUPS[PLANET_RESULTS[quizResult as keyof typeof PLANET_RESULTS].orbitGroup].icon}{" "}
              {ORBIT_GROUPS[PLANET_RESULTS[quizResult as keyof typeof PLANET_RESULTS].orbitGroup].title}
            </p>
          </div>
        )}

        {/* Power + Stats summary */}
        <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
          <div
            className="px-5 py-2 rounded-full text-base font-bold"
            style={{
              background: powerColor + "20",
              color: powerColor,
              border: `1.5px solid ${powerColor}40`,
            }}
          >
            ⚡ 전투력 {totalPower} · {powerTitle}
          </div>
        </div>
        <div className="text-base text-gray-400 mt-3">
          📚 {books.length}권 읽음 · 🏅 뱃지 {earnedBadges.length}/{BADGES.length}
        </div>
      </div>

      {/* ── MAIN: Radar Chart (hero section) ── */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          <span className="text-4xl">🎯</span> 우주 능력치 스캔
        </h2>
        <RadarChart stats={stats} />
      </div>

      {/* ── Badges ── */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-5">
          <span className="text-4xl">🏅</span> 획득한 뱃지 ({earnedBadges.length})
        </h2>
        {earnedBadges.length === 0 ? (
          <p className="text-base text-gray-500 text-center py-6">
            책을 더 읽으면 뱃지를 획득할 수 있어요!
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {earnedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} earned />
            ))}
          </div>
        )}
      </div>

      {/* Locked badges */}
      {lockedBadges.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">
            <span className="text-3xl">🔒</span> 미획득 뱃지 ({lockedBadges.length})
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {lockedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} earned={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BadgeCard({ badge, earned }: { badge: Badge; earned: boolean }) {
  const colors = RARITY_COLORS[badge.rarity];
  const rarityLabel =
    badge.rarity === "common"
      ? "일반"
      : badge.rarity === "rare"
        ? "레어"
        : badge.rarity === "epic"
          ? "에픽"
          : "전설";

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        earned ? "hover:scale-[1.03]" : "opacity-40 grayscale"
      }`}
      style={{
        background: earned ? colors.bg : "rgba(255,255,255,0.02)",
        borderColor: earned ? colors.border : "rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-4xl">{earned ? badge.icon : "❓"}</span>
        <div className="min-w-0">
          <div className="text-base font-bold truncate">
            {earned ? badge.name : "???"}
          </div>
          <div className="text-sm text-gray-400 mt-0.5">
            {earned ? badge.description : "조건을 달성하면 획득!"}
          </div>
          <div
            className="text-sm mt-1 font-bold"
            style={{ color: colors.text }}
          >
            {rarityLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
