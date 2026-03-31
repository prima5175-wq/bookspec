"use client";

import { useState } from "react";

const logos = [
  {
    id: "neon",
    name: "네온 사이버",
    description: "사이버펑크 네온 글로우",
    bgClass: "bg-black",
    render: () => (
      <div className="flex items-center justify-center gap-3">
        <span className="text-5xl" style={{ filter: "drop-shadow(0 0 12px #ff00ff) drop-shadow(0 0 25px #ff00ff)" }}>🪐</span>
        <div>
          <div
            className="text-5xl font-black tracking-wider"
            style={{
              color: "transparent",
              WebkitTextStroke: "2px #00ffff",
              textShadow: "0 0 10px #00ffff, 0 0 30px #00ffff, 0 0 60px #0088ff",
              filter: "drop-shadow(0 0 8px #00ffff)",
            }}
          >
            BookSpec
          </div>
          <div
            className="text-sm tracking-[0.5em] text-center mt-1"
            style={{
              color: "#ff00ff",
              textShadow: "0 0 8px #ff00ff, 0 0 20px #ff00ff",
            }}
          >
            SPACE READER
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "gold",
    name: "골드 럭셔리",
    description: "황금빛 프리미엄 고급스러움",
    bgClass: "bg-[#0a0515]",
    render: () => (
      <div className="flex items-center justify-center gap-3">
        <span
          className="text-6xl"
          style={{ filter: "drop-shadow(0 0 15px rgba(255,200,50,0.5))" }}
        >
          🪐
        </span>
        <div>
          <div
            className="text-5xl font-black"
            style={{
              background: "linear-gradient(180deg, #fff8e1 0%, #ffd54f 25%, #ffab00 50%, #ff8f00 75%, #e65100 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 2px 4px rgba(255,170,0,0.4))",
            }}
          >
            BookSpec
          </div>
          <div
            className="text-xs tracking-[0.6em] text-center mt-1 font-semibold"
            style={{
              background: "linear-gradient(90deg, #ffd54f, #ffab00, #ffd54f)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ★ UNIVERSE LIBRARY ★
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "hologram",
    name: "홀로그램",
    description: "무지개빛 홀로그래픽 시프트",
    bgClass: "bg-[#08081a]",
    render: () => (
      <div className="flex items-center justify-center gap-3">
        <span className="text-6xl holo-icon">🪐</span>
        <div>
          <div className="text-5xl font-black holo-text">
            BookSpec
          </div>
          <div className="text-sm tracking-[0.3em] text-center mt-1 holo-text-sub">
            ◇ COSMIC READER ◇
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "retro",
    name: "레트로 SF",
    description: "70년대 SF 영화 포스터 느낌",
    bgClass: "bg-[#1a0a2e]",
    render: () => (
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl">✦</span>
          <span className="text-2xl">✦</span>
          <span className="text-2xl">✦</span>
        </div>
        <div
          className="text-5xl font-black tracking-widest"
          style={{
            color: "#ff6b35",
            textShadow: "3px 3px 0 #7b2d8b, 6px 6px 0 rgba(0,0,0,0.3)",
            fontStyle: "italic",
          }}
        >
          BookSpec
        </div>
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
          <span
            className="text-xs tracking-[0.4em] font-bold"
            style={{ color: "#fbbf24" }}
          >
            A SPACE ODYSSEY
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
        </div>
        <div className="text-4xl mt-2">🪐</div>
      </div>
    ),
  },
  {
    id: "nasa",
    name: "NASA 미션",
    description: "NASA 공식 미션 패치 스타일",
    bgClass: "bg-[#0b1026]",
    render: () => (
      <div className="flex flex-col items-center">
        {/* Mission patch circle */}
        <div
          className="relative w-48 h-48 rounded-full flex flex-col items-center justify-center"
          style={{
            border: "3px solid #c0c0c0",
            background: "radial-gradient(circle, #0d1b3e 0%, #060e24 100%)",
            boxShadow: "0 0 20px rgba(100,150,255,0.15), inset 0 0 30px rgba(0,0,0,0.5)",
          }}
        >
          {/* Outer ring text */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: "6px solid #1e3a5f" }}
          />
          <span className="text-4xl mb-1">🪐</span>
          <div
            className="text-2xl font-black tracking-wider"
            style={{ color: "#e0e0e0" }}
          >
            BOOKSPEC
          </div>
          <div
            className="text-[9px] tracking-[0.3em] mt-1 font-bold"
            style={{ color: "#60a5fa" }}
          >
            READING MISSION
          </div>
          {/* Small stars */}
          <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs" style={{ color: "#fbbf24" }}>★</span>
          <span className="absolute bottom-6 left-8 text-[10px]" style={{ color: "#60a5fa" }}>✦</span>
          <span className="absolute bottom-6 right-8 text-[10px]" style={{ color: "#60a5fa" }}>✦</span>
        </div>
        <div className="text-[10px] text-gray-500 mt-3 tracking-widest">
          EST. 2026 · DEEP SPACE LITERACY
        </div>
      </div>
    ),
  },
  {
    id: "gradient",
    name: "그라데이션 드림",
    description: "몽환적인 오로라 그라데이션",
    bgClass: "bg-[#0a0820]",
    render: () => (
      <div className="flex items-center justify-center gap-4">
        <span
          className="text-6xl animate-float"
          style={{ filter: "drop-shadow(0 0 20px rgba(168,85,247,0.5))" }}
        >
          🪐
        </span>
        <div>
          <div
            className="text-5xl font-black"
            style={{
              background: "linear-gradient(135deg, #a855f7 0%, #ec4899 25%, #f43f5e 40%, #fbbf24 55%, #22d3ee 70%, #818cf8 85%, #a855f7 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradientShift 4s ease infinite",
              filter: "drop-shadow(0 0 10px rgba(168,85,247,0.3))",
            }}
          >
            BookSpec
          </div>
          <div
            className="text-sm tracking-[0.3em] text-center mt-1 font-medium"
            style={{
              background: "linear-gradient(90deg, #22d3ee, #a855f7, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ✧ DREAM COSMOS ✧
          </div>
        </div>
      </div>
    ),
  },
];

export default function LogoPreview() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-4xl">🎨</span> BookSpec 로고 갤러리
        </h1>
        <p className="text-gray-400">클릭해서 크게 보기</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {logos.map((logo) => (
          <button
            key={logo.id}
            onClick={() => setSelected(selected === logo.id ? null : logo.id)}
            className={`rounded-2xl overflow-hidden border-2 transition-all hover:scale-[1.02] ${
              selected === logo.id
                ? "border-purple-500 shadow-lg shadow-purple-900/30"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            {/* Logo display */}
            <div className={`${logo.bgClass} p-8 flex items-center justify-center min-h-[140px]`}>
              {logo.render()}
            </div>
            {/* Label */}
            <div className="glass-card !rounded-t-none !border-t-0 p-3">
              <div className="text-base font-bold">{logo.name}</div>
              <div className="text-xs text-gray-400">{logo.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Enlarged view */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80"
          onClick={() => setSelected(null)}
        >
          <div
            className={`${logos.find((l) => l.id === selected)?.bgClass} rounded-3xl p-12 max-w-lg w-full flex items-center justify-center border border-white/10`}
            onClick={(e) => e.stopPropagation()}
            style={{ transform: "scale(1.2)" }}
          >
            {logos.find((l) => l.id === selected)?.render()}
          </div>
        </div>
      )}
    </div>
  );
}
