"use client";

import { PlanetType } from "@/lib/types";

interface PlanetProps {
  type: PlanetType;
  size?: number;
  animate?: boolean;
}

const RELATIVE_SIZES: Record<PlanetType, number> = {
  mercury: 0.38,
  venus: 0.58,
  earth: 0.6,
  mars: 0.48,
  jupiter: 1.0,
  saturn: 0.82,
  uranus: 0.65,
  neptune: 0.62,
};

export default function Planet({ type, size = 60, animate = true }: PlanetProps) {
  const realSize = Math.round(size * RELATIVE_SIZES[type]);

  return (
    <div
      className="planet-wrapper"
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className={`planet planet-${type} ${animate ? "planet-spin" : ""}`}
        style={{ width: realSize, height: realSize }}
      >
        {type === "saturn" && (
          <div className="saturn-ring" style={{ width: realSize * 1.7, height: realSize * 0.45 }} />
        )}
      </div>
    </div>
  );
}
