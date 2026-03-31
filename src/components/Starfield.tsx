"use client";

import { useEffect, useState } from "react";

interface Star {
  left: string;
  top: string;
  size: number;
  duration: string;
  opacity: number;
  delay: string;
  color: string;
}

export default function Starfield() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const colors = [
      "#ffffff", "#ffffff", "#ffffff", "#ffffff",
      "#cce0ff", "#aaccff", "#b8c9ff",
      "#ffeedd", "#ffd9aa",
      "#ffccee", "#aaffee",
      "#ffe8f0", "#e8e8ff",
    ];
    const generated: Star[] = Array.from({ length: 400 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3.5 + 0.3,
      duration: `${Math.random() * 4 + 1.5}s`,
      opacity: Math.random() * 0.4 + 0.6,
      delay: `${Math.random() * 6}s`,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setStars(generated);
  }, []);

  return (
    <div className="starfield">
      {/* Milky Way diagonal band */}
      <div className="milky-way" />

      {/* Stars */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            background: star.color,
            boxShadow: star.size > 1.2 ? `0 0 ${star.size * 3}px ${star.color}` : undefined,
            ["--duration" as string]: star.duration,
            ["--max-opacity" as string]: star.opacity,
            animationDelay: star.delay,
          }}
        />
      ))}

      {/* Starlink satellites */}
      <div className="starlink-sat" style={{ top: "15%", animationDelay: "0s" }} />
      <div className="starlink-sat" style={{ top: "35%", animationDelay: "4s" }} />
      <div className="starlink-sat" style={{ top: "55%", animationDelay: "8s" }} />
      <div className="starlink-sat" style={{ top: "72%", animationDelay: "12s" }} />
      <div className="starlink-sat" style={{ top: "25%", animationDelay: "16s" }} />
      <div className="starlink-sat" style={{ top: "85%", animationDelay: "2s" }} />

      {/* Galaxy clusters */}
      <div className="galaxy-cluster" style={{ left: "82%", top: "8%", width: 35, height: 15, background: "radial-gradient(ellipse, rgba(220,200,255,0.6) 0%, transparent 70%)", transform: "rotate(25deg)", animationDelay: "0s" }} />
      <div className="galaxy-cluster" style={{ left: "5%", top: "78%", width: 28, height: 12, background: "radial-gradient(ellipse, rgba(180,210,255,0.55) 0%, transparent 70%)", transform: "rotate(-15deg)", animationDelay: "3s" }} />
      <div className="galaxy-cluster" style={{ left: "48%", top: "50%", width: 25, height: 11, background: "radial-gradient(ellipse, rgba(255,220,180,0.4) 0%, transparent 70%)", transform: "rotate(15deg)", animationDelay: "5s" }} />

      {/* Shooting stars */}
      <div className="shooting-star" style={{ top: "8%", right: "15%", animationDelay: "1s" }} />
      <div className="shooting-star" style={{ top: "25%", right: "40%", animationDelay: "5s" }} />
      <div className="shooting-star" style={{ top: "60%", right: "5%", animationDelay: "9s" }} />
      <div className="shooting-star" style={{ top: "45%", right: "70%", animationDelay: "13s" }} />
      <div className="shooting-star" style={{ top: "75%", right: "25%", animationDelay: "17s" }} />
    </div>
  );
}
