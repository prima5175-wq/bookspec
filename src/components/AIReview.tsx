"use client";

import { useState, useCallback } from "react";

interface AIReviewProps {
  bookTitle: string;
  author: string;
  review: string;
  rating: number;
  onComplete?: (result: string) => void;
}

export default function AIReview({
  bookTitle,
  author,
  review,
  rating,
  onComplete,
}: AIReviewProps) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);

  const handleReview = useCallback(async () => {
    if (!review.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult("");
    setStarted(true);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookTitle, author, review, rating }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "AI 첨삭 요청 실패");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullText += parsed.text;
                  setResult(fullText);
                }
              } catch {
                // skip parse errors
              }
            }
          }
        }
      }

      onComplete?.(fullText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했어요");
    } finally {
      setLoading(false);
    }
  }, [bookTitle, author, review, rating, loading, onComplete]);

  if (!started) {
    return (
      <button
        onClick={handleReview}
        disabled={!review.trim() || review.trim().length < 5}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium text-sm hover:from-cyan-500 hover:to-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        <span>🤖</span>
        <span>AI 첨삭 받기</span>
      </button>
    );
  }

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">🤖</span>
        <h3 className="text-sm font-bold text-cyan-400">AI 첨삭 리포트</h3>
        {loading && (
          <div className="flex gap-1 ml-auto">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                style={{
                  animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-600/10 rounded-lg p-3">
          {error}
        </div>
      )}

      {result && (
        <div className="text-sm leading-relaxed whitespace-pre-wrap bg-white/5 rounded-xl p-4 text-gray-300">
          {result}
          {loading && <span className="inline-block w-1.5 h-4 bg-cyan-400 ml-0.5 animate-pulse" />}
        </div>
      )}

      {!loading && result && (
        <div className="flex gap-2">
          <button
            onClick={handleReview}
            className="flex-1 py-2 rounded-lg border border-white/10 text-xs text-gray-400 hover:bg-white/5 transition-colors"
          >
            다시 첨삭받기
          </button>
        </div>
      )}
    </div>
  );
}
