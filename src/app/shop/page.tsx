"use client";

import { useEffect, useState } from "react";
import { getCoins, spendCoins } from "@/lib/satellite";

// ─── Shop Item Types ───

interface ShopItem {
  id: string;
  icon: string;
  name: string;
  price: number;
  category: string;
}

const SHOP_CATEGORIES = [
  {
    id: "colors",
    title: "🎨 행성 색상",
    items: [
      { id: "color_neon_purple", icon: "🟣", name: "네온 퍼플", price: 50, category: "colors" },
      { id: "color_rose_gold", icon: "🌸", name: "로즈골드", price: 80, category: "colors" },
      { id: "color_ocean_blue", icon: "🔵", name: "오션블루", price: 50, category: "colors" },
      { id: "color_sunset_orange", icon: "🟠", name: "선셋오렌지", price: 80, category: "colors" },
      { id: "color_mint_green", icon: "🟢", name: "민트그린", price: 50, category: "colors" },
    ],
  },
  {
    id: "rings",
    title: "💫 행성 고리",
    items: [
      { id: "ring_basic", icon: "⭕", name: "기본 고리", price: 100, category: "rings" },
      { id: "ring_double", icon: "🔘", name: "이중 고리", price: 200, category: "rings" },
      { id: "ring_rainbow", icon: "🌈", name: "무지개 고리", price: 300, category: "rings" },
      { id: "ring_crystal", icon: "💎", name: "크리스탈 고리", price: 500, category: "rings" },
    ],
  },
  {
    id: "satellites",
    title: "🛰️ 위성 스킨",
    items: [
      { id: "sat_basic", icon: "🛰️", name: "기본 위성", price: 0, category: "satellites" },
      { id: "sat_star", icon: "⭐", name: "별 위성", price: 80, category: "satellites" },
      { id: "sat_heart", icon: "💖", name: "하트 위성", price: 80, category: "satellites" },
      { id: "sat_ufo", icon: "🛸", name: "UFO", price: 150, category: "satellites" },
      { id: "sat_rocket", icon: "🚀", name: "로켓", price: 150, category: "satellites" },
    ],
  },
  {
    id: "effects",
    title: "🌟 특수 효과",
    items: [
      { id: "fx_sparkle", icon: "✨", name: "반짝임", price: 200, category: "effects" },
      { id: "fx_aurora", icon: "🌈", name: "오로라", price: 300, category: "effects" },
      { id: "fx_comet", icon: "☄️", name: "혜성 꼬리", price: 400, category: "effects" },
      { id: "fx_blackhole", icon: "🌑", name: "블랙홀 후광", price: 800, category: "effects" },
    ],
  },
];

const PURCHASES_KEY = "bookspec_shop_purchases";

function getPurchases(): string[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(PURCHASES_KEY);
  return data ? JSON.parse(data) : [];
}

function savePurchases(purchases: string[]): void {
  localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
}

export default function ShopPage() {
  const [coins, setCoins] = useState(0);
  const [purchases, setPurchases] = useState<string[]>([]);
  const [buyAnimation, setBuyAnimation] = useState<string | null>(null);

  useEffect(() => {
    setCoins(getCoins());
    setPurchases(getPurchases());
  }, []);

  function handleBuy(item: ShopItem) {
    if (purchases.includes(item.id)) return;

    if (item.price === 0) {
      // Free item
      const updated = [...purchases, item.id];
      savePurchases(updated);
      setPurchases(updated);
      setBuyAnimation(item.id);
      setTimeout(() => setBuyAnimation(null), 600);
      return;
    }

    if (!spendCoins(item.price)) {
      alert("코인이 부족해요! 책을 더 읽어서 코인을 모아보세요 📚");
      return;
    }

    const updated = [...purchases, item.id];
    savePurchases(updated);
    setPurchases(updated);
    setCoins(getCoins());
    setBuyAnimation(item.id);
    setTimeout(() => setBuyAnimation(null), 600);
  }

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="glass-card p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">🪐 행성 꾸미기 상점</h1>
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold"
          style={{
            background: "rgba(251, 191, 36, 0.15)",
            color: "#fbbf24",
            border: "1px solid rgba(251, 191, 36, 0.3)",
          }}
        >
          🪙 {coins} 코인
        </div>
      </div>

      {/* XP Earning Guide */}
      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold mb-3 text-center">💡 코인 얻는 방법</h2>
        <div className="space-y-2">
          {[
            { action: "📚 책 읽기", xp: "+100 XP" },
            { action: "📝 독서록 작성", xp: "+200 XP" },
            { action: "💌 부모 답장 받기", xp: "+300 XP" },
          ].map((item) => (
            <div
              key={item.action}
              className="flex items-center justify-between px-4 py-2 rounded-lg"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <span className="text-sm">{item.action}</span>
              <span
                className="text-sm font-bold"
                style={{ color: "#a78bfa" }}
              >
                {item.xp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Shop Categories */}
      {SHOP_CATEGORIES.map((category) => (
        <div key={category.id} className="glass-card p-5">
          <h2 className="text-lg font-semibold mb-4">{category.title}</h2>
          <div className="grid grid-cols-2 gap-3">
            {category.items.map((item) => {
              const owned = purchases.includes(item.id);
              const isAnimating = buyAnimation === item.id;

              return (
                <div
                  key={item.id}
                  className={`relative p-4 rounded-xl border transition-all ${
                    isAnimating ? "scale-105" : ""
                  }`}
                  style={{
                    background: owned
                      ? "rgba(34, 197, 94, 0.08)"
                      : "rgba(255, 255, 255, 0.03)",
                    borderColor: owned
                      ? "rgba(34, 197, 94, 0.3)"
                      : "rgba(255, 255, 255, 0.08)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {owned && (
                    <div className="absolute top-2 right-2 text-sm">✅</div>
                  )}
                  <div className="text-center">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="text-sm font-medium mb-1">{item.name}</div>
                    <div
                      className="text-xs font-bold mb-3"
                      style={{ color: "#fbbf24" }}
                    >
                      {item.price === 0 ? "무료" : `🪙 ${item.price}`}
                    </div>
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={owned}
                      className="w-full py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: owned
                          ? "rgba(34, 197, 94, 0.2)"
                          : coins >= item.price
                            ? "linear-gradient(135deg, #7c3aed, #a78bfa)"
                            : "rgba(255, 255, 255, 0.05)",
                        color: owned
                          ? "#22c55e"
                          : coins >= item.price
                            ? "#fff"
                            : "#64748b",
                        cursor: owned ? "default" : "pointer",
                      }}
                    >
                      {owned ? "보유 중" : item.price === 0 ? "획득하기" : "구매하기"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
