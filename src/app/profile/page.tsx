"use client";

import { useEffect, useState } from "react";
import { Book, PLANETS } from "@/lib/types";
import { getBooks } from "@/lib/storage";
import {
  calculateStats,
  STAT_DEFS,
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
  const [selectedStat, setSelectedStat] = useState<string | null>(null);

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

  // Power level title
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
    <div className="space-y-6 pb-4">
      {/* Profile Header */}
      <div className="glass-card p-6 text-center">
        <div className="flex justify-center mb-3">
          {quizResult ? (
            <Planet
              type={quizResult as keyof typeof PLANETS}
              size={80}
              animate={true}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-3xl">
              🧑‍🚀
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold mb-1">나의 독서 프로필</h1>
        {quizResult && (
          <div className="mb-2">
            <p className="text-sm text-gray-400">
              {PLANETS[quizResult as keyof typeof PLANETS].name} -{" "}
              {PLANET_RESULTS[quizResult as keyof typeof PLANET_RESULTS].title}
            </p>
            <p className="text-xs mt-1" style={{ color: ORBIT_GROUPS[PLANET_RESULTS[quizResult as keyof typeof PLANET_RESULTS].orbitGroup].color }}>
              {ORBIT_GROUPS[PLANET_RESULTS[quizResult as keyof typeof PLANET_RESULTS].orbitGroup].icon}{" "}
              {ORBIT_GROUPS[PLANET_RESULTS[quizResult as keyof typeof PLANET_RESULTS].orbitGroup].title}
            </p>
          </div>
        )}
        <div className="inline-flex items-center gap-2 mt-2">
          <div
            className="px-4 py-1.5 rounded-full text-sm font-bold"
            style={{
              background: powerColor + "20",
              color: powerColor,
              border: `1px solid ${powerColor}40`,
            }}
          >
            전투력 {totalPower} · {powerTitle}
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {books.length}권 읽음 · 뱃지 {earnedBadges.length}/{BADGES.length}
        </div>
      </div>

      {/* Radar Chart */}
      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold mb-2 text-center">
          🎯 능력치 레이더
        </h2>
        <RadarChart stats={stats} size={320} />
      </div>

      {/* Stat List */}
      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold mb-4">📊 능력치 상세</h2>
        <div className="space-y-3">
          {STAT_DEFS.map((def) => {
            const value = stats[def.key];
            const isSelected = selectedStat === def.key;
            return (
              <button
                key={def.key}
                onClick={() =>
                  setSelectedStat(isSelected ? null : def.key)
                }
                className="w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center">{def.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{def.name}</span>
                      <span
                        className="text-sm font-bold"
                        style={{
                          color:
                            value >= 70
                              ? "#fbbf24"
                              : value >= 40
                                ? "#c084fc"
                                : value >= 20
                                  ? "#60a5fa"
                                  : "#94a3b8",
                        }}
                      >
                        {value}
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${(value / 99) * 100}%`,
                          background:
                            value >= 70
                              ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                              : value >= 40
                                ? "linear-gradient(90deg, #7c3aed, #a78bfa)"
                                : value >= 20
                                  ? "linear-gradient(90deg, #3b82f6, #60a5fa)"
                                  : "linear-gradient(90deg, #64748b, #94a3b8)",
                        }}
                      />
                    </div>
                    {isSelected && (
                      <p className="text-xs text-gray-500 mt-1.5 animate-fadeIn">
                        {def.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Badges - Earned */}
      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold mb-4">
          🏅 획득한 뱃지 ({earnedBadges.length})
        </h2>
        {earnedBadges.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
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

      {/* Badges - Locked */}
      {lockedBadges.length > 0 && (
        <div className="glass-card p-5">
          <h2 className="text-lg font-semibold mb-4">
            🔒 미획득 뱃지 ({lockedBadges.length})
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
      className={`p-3 rounded-xl border transition-all ${
        earned ? "hover:scale-[1.03]" : "opacity-40 grayscale"
      }`}
      style={{
        background: earned ? colors.bg : "rgba(255,255,255,0.02)",
        borderColor: earned ? colors.border : "rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex items-start gap-2">
        <span className="text-2xl">{earned ? badge.icon : "❓"}</span>
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">
            {earned ? badge.name : "???"}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {earned ? badge.description : "조건을 달성하면 획득!"}
          </div>
          <div
            className="text-xs mt-1 font-medium"
            style={{ color: colors.text }}
          >
            {rarityLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
