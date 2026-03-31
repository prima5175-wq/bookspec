"use client";

import { PlanetType } from "@/lib/types";

interface PlanetProps {
  type: PlanetType;
  size?: number;
  animate?: boolean;
}

// Realistic relative sizes (Jupiter biggest = 1.0)
const RELATIVE_SIZES: Record<PlanetType, number> = {
  mercury: 0.35,
  venus: 0.55,
  earth: 0.58,
  mars: 0.45,
  jupiter: 1.0,
  saturn: 0.85,
  uranus: 0.65,
  neptune: 0.62,
};

export default function Planet({ type, size = 60, animate = true }: PlanetProps) {
  const realSize = Math.round(size * RELATIVE_SIZES[type]);

  return (
    <div
      className={`planet-wrapper ${animate ? "animate-float" : ""}`}
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className={`planet-${type}`} style={{ ["--s" as string]: `${realSize}px` }}>
        <div className="planet-body">
          <div className="planet-surface" />
          <div className="planet-atmosphere" />
          <div className="planet-shadow" />
          {(type === "saturn" || type === "uranus") && (
            <div className="planet-rings">
              <div className="ring ring-1" />
              <div className="ring ring-2" />
              <div className="ring ring-3" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
