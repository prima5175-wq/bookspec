"use client";

import { useEffect, useState } from "react";

const SUBSCRIBED_KEY = "bookspec_subscribed";

export default function SubscribePage() {
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setSubscribed(localStorage.getItem(SUBSCRIBED_KEY) === "true");
  }, []);

  function handleToggle() {
    const next = !subscribed;
    localStorage.setItem(SUBSCRIBED_KEY, String(next));
    setSubscribed(next);
  }

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="glass-card p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">🚀 BookSpec 프리미엄</h1>
        <p className="text-sm text-gray-400">
          더 풍부한 독서 경험을 위한 프리미엄 구독
        </p>
        {subscribed && (
          <div
            className="inline-flex items-center gap-1 mt-3 px-4 py-1.5 rounded-full text-sm font-bold"
            style={{
              background: "rgba(251, 191, 36, 0.15)",
              color: "#fbbf24",
              border: "1px solid rgba(251, 191, 36, 0.3)",
            }}
          >
            구독 중 ✨
          </div>
        )}
      </div>

      {/* Pricing Card */}
      <div
        className="glass-card p-6"
        style={{
          border: "1px solid rgba(167, 139, 250, 0.3)",
          background:
            "linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(59, 130, 246, 0.1))",
        }}
      >
        <div className="text-center mb-5">
          <div className="text-sm text-gray-400 mb-1">월 구독료</div>
          <div className="text-4xl font-bold" style={{ color: "#a78bfa" }}>
            4,900
            <span className="text-lg text-gray-400 ml-1">원</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {[
            "위성 발사(답장) 무제한",
            "AI 독서록 첨삭 월 5회",
            "자녀 독서 리포트 월 1회",
            "프리미엄 행성 꾸미기 아이템",
            "광고 제거",
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-3">
              <span className="text-green-400 text-sm">✅</span>
              <span className="text-sm">{benefit}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleToggle}
          className="w-full py-3 rounded-xl font-bold text-base transition-all active:scale-[0.97]"
          style={{
            background: subscribed
              ? "rgba(239, 68, 68, 0.2)"
              : "linear-gradient(135deg, #7c3aed, #3b82f6)",
            color: subscribed ? "#f87171" : "#fff",
            border: subscribed ? "1px solid rgba(239, 68, 68, 0.3)" : "none",
          }}
        >
          {subscribed ? "구독 해지하기" : "프리미엄 구독하기"}
        </button>
      </div>

      {/* Comparison Table */}
      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold mb-4 text-center">
          📋 요금제 비교
        </h2>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          {/* Header Row */}
          <div className="text-gray-500 text-xs py-2" />
          <div
            className="py-2 rounded-lg text-xs font-bold"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            무료
          </div>
          <div
            className="py-2 rounded-lg text-xs font-bold"
            style={{
              background: "rgba(167, 139, 250, 0.15)",
              color: "#a78bfa",
            }}
          >
            프리미엄
          </div>

          {/* Rows */}
          {[
            { label: "위성 발사", free: "5개/월", premium: "무제한" },
            { label: "AI 첨삭", free: "0회", premium: "5회/월" },
            { label: "꾸미기 아이템", free: "기본만", premium: "전체" },
          ].map((row) => (
            <>
              <div
                key={row.label}
                className="text-xs text-gray-400 py-2 text-left pl-1"
              >
                {row.label}
              </div>
              <div
                key={row.label + "_free"}
                className="text-xs py-2 text-gray-500"
              >
                {row.free}
              </div>
              <div
                key={row.label + "_premium"}
                className="text-xs py-2 font-medium"
                style={{ color: "#a78bfa" }}
              >
                {row.premium}
              </div>
            </>
          ))}
        </div>
      </div>

      {/* Parent-Only Section */}
      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold mb-4">👨‍👩‍👧 부모님 전용</h2>

        {/* Reading Report */}
        <div
          className="p-4 rounded-xl mb-4"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <h3 className="text-sm font-semibold mb-3">📊 이번 달 독서 리포트</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-2xl font-bold" style={{ color: "#60a5fa" }}>
                3
              </div>
              <div className="text-xs text-gray-500">읽은 책</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: "#a78bfa" }}>
                450
              </div>
              <div className="text-xs text-gray-500">총 페이지</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: "#fbbf24" }}>
                4.2
              </div>
              <div className="text-xs text-gray-500">평균 별점</div>
            </div>
          </div>
        </div>

        {/* AI Correction Remaining */}
        <div
          className="p-4 rounded-xl"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">📝 AI 첨삭 잔여</h3>
            <span
              className="text-sm font-bold"
              style={{ color: subscribed ? "#22c55e" : "#64748b" }}
            >
              {subscribed ? "5/5회" : "0/0회"}
            </span>
          </div>
          <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: subscribed ? "100%" : "0%",
                background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
              }}
            />
          </div>
          {!subscribed && (
            <p className="text-xs text-gray-500 mt-2">
              프리미엄 구독 시 AI 첨삭을 이용할 수 있어요
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
