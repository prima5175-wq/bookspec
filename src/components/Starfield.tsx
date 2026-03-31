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

interface GalaxyCluster {
  left: string;
  top: string;
  width: number;
  height: number;
  background: string;
  delay: string;
  rotation: string;
}

export default function Starfield() {
  const [stars, setStars] = useState<Star[]>([]);
  const [galaxies, setGalaxies] = useState<GalaxyCluster[]>([]);

  useEffect(() => {
    const colors = [
      "#ffffff",   // pure white
      "#ffffff",   // pure white
      "#cce0ff",   // blue-white
      "#aaccff",   // blue-white brighter
      "#b8c9ff",   // cool blue
      "#99b3ff",   // cool blue deeper
      "#ffeedd",   // warm yellow
      "#ffd9aa",   // warm yellow deeper
      "#ffbbaa",   // reddish
      "#ff9988",   // reddish deeper
      "#e8e8ff",   // pale blue-white
    ];
    const generated: Star[] = Array.from({ length: 200 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2.8 + 0.4,
      duration: `${Math.random() * 5 + 2}s`,
      opacity: Math.random() * 0.7 + 0.3,
      delay: `${Math.random() * 6}s`,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setStars(generated);

    const galaxyData: GalaxyCluster[] = [
      {
        left: "82%",
        top: "8%",
        width: 28,
        height: 12,
        background: "radial-gradient(ellipse, rgba(180,170,220,0.5) 0%, rgba(140,130,190,0.2) 40%, transparent 70%)",
        delay: "0s",
        rotation: "rotate(25deg)",
      },
      {
        left: "5%",
        top: "78%",
        width: 22,
        height: 10,
        background: "radial-gradient(ellipse, rgba(160,180,230,0.45) 0%, rgba(120,140,200,0.15) 40%, transparent 70%)",
        delay: "3s",
        rotation: "rotate(-15deg)",
      },
      {
        left: "60%",
        top: "88%",
        width: 18,
        height: 8,
        background: "radial-gradient(ellipse, rgba(200,170,210,0.4) 0%, rgba(160,130,180,0.15) 40%, transparent 70%)",
        delay: "5.5s",
        rotation: "rotate(40deg)",
      },
      {
        left: "30%",
        top: "15%",
        width: 15,
        height: 7,
        background: "radial-gradient(ellipse, rgba(170,190,240,0.35) 0%, rgba(130,150,210,0.12) 40%, transparent 70%)",
        delay: "7s",
        rotation: "rotate(-30deg)",
      },
    ];
    setGalaxies(galaxyData);
  }, []);

  return (
    <div className="starfield">
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
            boxShadow: star.size > 2 ? `0 0 ${star.size * 2}px ${star.color}` : undefined,
            ["--duration" as string]: star.duration,
            ["--max-opacity" as string]: star.opacity,
            animationDelay: star.delay,
          }}
        />
      ))}
      {galaxies.map((g, i) => (
        <div
          key={`galaxy-${i}`}
          className="galaxy-cluster"
          style={{
            left: g.left,
            top: g.top,
            width: g.width,
            height: g.height,
            background: g.background,
            transform: g.rotation,
            animationDelay: g.delay,
          }}
        />
      ))}
      <div className="shooting-star" style={{ top: "8%", right: "15%", animationDelay: "1s" }} />
      <div className="shooting-star" style={{ top: "25%", right: "40%", animationDelay: "4.5s" }} />
      <div className="shooting-star" style={{ top: "60%", right: "5%", animationDelay: "8s" }} />
      <div className="shooting-star" style={{ top: "45%", right: "70%", animationDelay: "12s" }} />
      <div className="shooting-star" style={{ top: "75%", right: "25%", animationDelay: "16s" }} />
    </div>
  );
}
