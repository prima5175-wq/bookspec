"use client";

import { useEffect, useState } from "react";
import { Book, PLANETS, PlanetType } from "@/lib/types";
import { getBooks, deleteBook } from "@/lib/storage";
import Planet from "@/components/Planet";
import StarRating from "@/components/StarRating";
import AIReview from "@/components/AIReview";
import Link from "next/link";

export default function Library() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState<"all" | PlanetType>("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    setBooks(
      getBooks().sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
  }, []);

  const filtered =
    filter === "all" ? books : books.filter((b) => b.planet === filter);

  const handleDelete = (id: string) => {
    deleteBook(id);
    setBooks(getBooks());
    setSelectedBook(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">📚 내 서재</h1>

      {/* Planet filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setFilter("all")}
          className={`shrink-0 px-4 py-2 rounded-full text-sm border transition-all ${
            filter === "all"
              ? "bg-purple-600/50 border-purple-500 text-white"
              : "border-white/10 text-gray-400 hover:border-purple-500/50"
          }`}
        >
          전체 ({books.length})
        </button>
        {(Object.keys(PLANETS) as PlanetType[]).map((key) => {
          const count = books.filter((b) => b.planet === key).length;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm border transition-all ${
                filter === key
                  ? "bg-purple-600/50 border-purple-500 text-white"
                  : "border-white/10 text-gray-400 hover:border-purple-500/50"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: PLANETS[key].color }}
              />
              {PLANETS[key].name} ({count})
            </button>
          );
        })}
      </div>

      {/* Book Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-4">🌑</div>
          <p>아직 등록한 책이 없어요.</p>
          <Link
            href="/add"
            className="inline-block mt-4 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium"
          >
            첫 번째 책 등록하기 ✨
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((book) => (
            <button
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className="glass-card p-4 text-left transition-all hover:scale-[1.02]"
            >
              <div className="flex items-start gap-3">
                <Planet type={book.planet} size={50} animate={false} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{book.title}</h3>
                  <p className="text-sm text-gray-400">{book.author}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating
                      rating={book.rating}
                      readonly
                      size="text-xs"
                    />
                    <span className="text-xs text-gray-500">
                      {book.genre}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(book.dateRead).toLocaleDateString("ko-KR")} ·{" "}
                    {book.pages}p
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Book Detail Modal */}
      {selectedBook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="glass-card p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4">
              <Planet type={selectedBook.planet} size={70} />
              <div>
                <h2 className="text-xl font-bold">{selectedBook.title}</h2>
                <p className="text-gray-400">{selectedBook.author}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: PLANETS[selectedBook.planet].color + "30",
                      color: PLANETS[selectedBook.planet].color,
                    }}
                  >
                    {PLANETS[selectedBook.planet].name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {selectedBook.genre}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-y border-white/10">
              <StarRating
                rating={selectedBook.rating}
                readonly
                size="text-2xl"
              />
              <div className="text-right text-sm text-gray-400">
                <div>{selectedBook.pages} 페이지</div>
                <div>
                  {new Date(selectedBook.dateRead).toLocaleDateString("ko-KR")}
                </div>
              </div>
            </div>

            {selectedBook.review && (
              <div>
                <h3 className="text-sm text-gray-400 mb-2">📝 감상문</h3>
                <p className="text-sm leading-relaxed whitespace-pre-wrap bg-white/5 rounded-xl p-4">
                  {selectedBook.review}
                </p>
              </div>
            )}

            {/* AI Review for books with reviews */}
            {selectedBook.review && selectedBook.review.trim().length >= 5 && (
              <AIReview
                bookTitle={selectedBook.title}
                author={selectedBook.author}
                review={selectedBook.review}
                rating={selectedBook.rating}
              />
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedBook(null)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-colors"
              >
                닫기
              </button>
              <button
                onClick={() => handleDelete(selectedBook.id)}
                className="px-6 py-3 rounded-xl bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
