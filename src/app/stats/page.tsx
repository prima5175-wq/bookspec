"use client";

import { useEffect, useState } from "react";
import { Book, PLANETS, PlanetType, Genre, GENRES } from "@/lib/types";
import { getBooks } from "@/lib/storage";
import Planet from "@/components/Planet";

export default function Stats() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    setBooks(getBooks());
  }, []);

  if (books.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <div className="text-5xl mb-4">🔭</div>
        <h1 className="text-2xl font-bold mb-2">아직 데이터가 없어요</h1>
        <p>책을 등록하면 멋진 통계를 볼 수 있어요!</p>
      </div>
    );
  }

  const totalBooks = books.length;
  const totalPages = books.reduce((sum, b) => sum + b.pages, 0);
  const avgRating = books.reduce((sum, b) => sum + b.rating, 0) / totalBooks;

  // Monthly stats
  const monthlyMap: Record<string, number> = {};
  books.forEach((b) => {
    const month = b.dateRead.slice(0, 7); // YYYY-MM
    monthlyMap[month] = (monthlyMap[month] || 0) + 1;
  });
  const months = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6);
  const maxMonthly = Math.max(...months.map(([, c]) => c), 1);

  // Genre stats
  const genreMap: Record<string, number> = {};
  books.forEach((b) => {
    genreMap[b.genre] = (genreMap[b.genre] || 0) + 1;
  });
  const genreEntries = Object.entries(genreMap).sort(([, a], [, b]) => b - a);
  const maxGenre = Math.max(...genreEntries.map(([, c]) => c), 1);

  // Planet stats
  const planetMap: Record<string, number> = {};
  books.forEach((b) => {
    planetMap[b.planet] = (planetMap[b.planet] || 0) + 1;
  });

  // Rating distribution
  const ratingMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  books.forEach((b) => {
    ratingMap[b.rating] = (ratingMap[b.rating] || 0) + 1;
  });
  const maxRating = Math.max(...Object.values(ratingMap), 1);

  // Best rated books
  const topBooks = [...books].sort((a, b) => b.rating - a.rating).slice(0, 3);

  const genreColors: Record<Genre, string> = {
    동화: "#a78bfa",
    과학: "#22d3ee",
    역사: "#f59e0b",
    모험: "#ef4444",
    판타지: "#c084fc",
    학습: "#34d399",
    기타: "#94a3b8",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">📊 독서 통계</h1>

      {/* Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{totalBooks}</div>
          <div className="text-xs text-gray-400">총 읽은 책</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-cyan-400">{totalPages.toLocaleString()}</div>
          <div className="text-xs text-gray-400">총 페이지</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            ★ {avgRating.toFixed(1)}
          </div>
          <div className="text-xs text-gray-400">평균 별점</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {Object.keys(planetMap).length}
          </div>
          <div className="text-xs text-gray-400">탐험한 행성</div>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold mb-4">📅 월별 독서량</h2>
        <div className="flex items-end gap-2 h-40">
          {months.map(([month, count]) => (
            <div key={month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400">{count}권</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-purple-600 to-blue-500 transition-all"
                style={{
                  height: `${(count / maxMonthly) * 100}%`,
                  minHeight: 8,
                }}
              />
              <span className="text-xs text-gray-500">
                {month.slice(5)}월
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Genre Distribution */}
      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold mb-4">📖 장르별 분포</h2>
        <div className="space-y-3">
          {genreEntries.map(([genre, count]) => (
            <div key={genre} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{genre}</span>
                <span className="text-gray-400">{count}권</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(count / maxGenre) * 100}%`,
                    background: genreColors[genre as Genre] || "#94a3b8",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Planet Usage */}
      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold mb-4">🪐 행성별 책 수</h2>
        <div className="grid grid-cols-4 gap-4">
          {(Object.keys(PLANETS) as PlanetType[]).map((key) => {
            const count = planetMap[key] || 0;
            return (
              <div key={key} className="flex flex-col items-center gap-2">
                <div className={count === 0 ? "opacity-20 grayscale" : ""}>
                  <Planet type={key} size={40} animate={false} />
                </div>
                <div className="text-center">
                  <div className="text-xs">{PLANETS[key].name}</div>
                  <div
                    className="text-sm font-bold"
                    style={{ color: count > 0 ? PLANETS[key].color : "#555" }}
                  >
                    {count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold mb-4">⭐ 별점 분포</h2>
        <div className="flex items-end gap-3 h-32">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <span className="text-xs text-gray-400">
                {ratingMap[star]}
              </span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-yellow-600 to-yellow-400 transition-all"
                style={{
                  height: `${(ratingMap[star] / maxRating) * 100}%`,
                  minHeight: 4,
                }}
              />
              <span className="text-yellow-400 text-sm">
                {"★".repeat(star)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Books */}
      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold mb-4">🏆 최고의 책 TOP 3</h2>
        <div className="space-y-3">
          {topBooks.map((book, i) => (
            <div
              key={book.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
            >
              <span className="text-2xl">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
              </span>
              <Planet type={book.planet} size={35} animate={false} />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{book.title}</div>
                <div className="text-xs text-gray-400">{book.author}</div>
              </div>
              <div className="text-yellow-400 text-sm">
                ★ {book.rating}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
