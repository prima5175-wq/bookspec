"use client";

import { useState, useEffect } from "react";
import { StatScores, STAT_DEFS } from "@/lib/stats";

interface RadarChartProps {
  stats: StatScores;
}

const STAT_COLORS = [
  "#a855f7", "#ec4899", "#f43f5e", "#f97316", "#fbbf24",
  "#22d3ee", "#3b82f6", "#818cf8", "#34d399", "#c084fc",
];

export default function RadarChart({ stats }: RadarChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const hoveredStat = hoveredIdx !== null ? STAT_DEFS[hoveredIdx] : null;
  const hoveredValue = hoveredStat ? stats[hoveredStat.key] : 0;

  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const constellationR = size * 0.34;
  const count = STAT_DEFS.length;
  const angleStep = (Math.PI * 2) / count;

  const points = STAT_DEFS.map((s, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const level = Math.min(stats[s.key] / 99, 1);
    const r = constellationR * (0.3 + level * 0.7);
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      fullX: cx + constellationR * Math.cos(angle),
      fullY: cy + constellationR * Math.sin(angle),
      level,
      stat: s,
      value: stats[s.key],
      color: STAT_COLORS[i],
      angle,
    };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      {/* SCAN HEADER */}
      <div className="flex items-center gap-2 text-sm text-cyan-400/80 font-mono tracking-widest">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
        SPACE SCAN
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
      </div>

      {/* HOLOGRAM - LARGE */}
      <div className="relative w-full" style={{ maxWidth: size + 40 }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full">
          <defs>
            <filter id="scanGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="scanBg2">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.04" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Background */}
          <circle cx={cx} cy={cy} r={constellationR + 30} fill="url(#scanBg2)" />

          {/* Scan rings */}
          {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={constellationR * level}
              fill="none"
              stroke="rgba(34,211,238,0.1)"
              strokeWidth="0.8"
              strokeDasharray="4 8"
            />
          ))}

          {/* Rotating scan line */}
          <line
            x1={cx} y1={cy}
            x2={cx + constellationR + 10} y2={cy}
            stroke="rgba(34,211,238,0.2)"
            strokeWidth="0.7"
            style={{ transformOrigin: `${cx}px ${cy}px`, animation: "spin 8s linear infinite" }}
          />

          {/* Constellation lines */}
          {points.map((p, i) => {
            const next = points[(i + 1) % count];
            return (
              <line
                key={`line-${i}`}
                x1={p.x} y1={p.y} x2={next.x} y2={next.y}
                stroke="rgba(168,85,247,0.3)"
                strokeWidth="1.5"
                filter="url(#softGlow)"
                style={{ opacity: animated ? 1 : 0, transition: `opacity 0.5s ${i * 0.1}s` }}
              />
            );
          })}

          {/* Axis lines */}
          {points.map((p, i) => (
            <line
              key={`axis-${i}`}
              x1={cx} y1={cy} x2={p.fullX} y2={p.fullY}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="0.5"
            />
          ))}

          {/* Aura fill */}
          <polygon
            points={points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="rgba(168,85,247,0.1)"
            style={{ opacity: animated ? 1 : 0, transition: "opacity 1s 0.5s" }}
          />

          {/* Star points */}
          {points.map((p, i) => {
            const isHovered = hoveredIdx === i;
            const dotR = isHovered ? 10 : 5 + p.level * 3;
            return (
              <g
                key={p.stat.key}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: "pointer" }}
              >
                <circle cx={p.x} cy={p.y} r="24" fill="transparent" />
                {/* Outer glow */}
                <circle
                  cx={p.x} cy={p.y}
                  r={dotR + 10}
                  fill={p.color}
                  opacity={isHovered ? 0.25 : 0.1}
                  className="transition-all duration-300"
                />
                {/* Main point */}
                <circle
                  cx={p.x} cy={p.y}
                  r={dotR}
                  fill={p.color}
                  opacity={isHovered ? 1 : 0.85}
                  filter="url(#softGlow)"
                  className="transition-all duration-300"
                  style={{
                    transform: animated ? "scale(1)" : "scale(0)",
                    transformOrigin: `${p.x}px ${p.y}px`,
                    transition: `transform 0.5s ${i * 0.08}s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s`,
                  }}
                />
                {/* Core */}
                <circle
                  cx={p.x} cy={p.y}
                  r={dotR * 0.35}
                  fill="white"
                  opacity={isHovered ? 0.95 : 0.6}
                  className="transition-all duration-300"
                />
                {/* Icon label outside */}
                <text
                  x={p.fullX + (p.fullX > cx ? 14 : -14)}
                  y={p.fullY + (p.fullY > cy ? 14 : -6)}
                  textAnchor={p.fullX > cx ? "start" : "end"}
                  style={{ fontSize: isHovered ? 22 : 18 }}
                  className="transition-all duration-200"
                >
                  {p.stat.icon}
                </text>
              </g>
            );
          })}

          {/* Center */}
          <circle cx={cx} cy={cy} r="4" fill="rgba(34,211,238,0.6)" filter="url(#softGlow)" />
          <circle cx={cx} cy={cy} r="1.5" fill="white" opacity="0.8" />

          {hoveredStat ? (
            <g>
              <text x={cx} y={cy - 14} textAnchor="middle" className="fill-white font-bold" style={{ fontSize: 34, filter: "url(#softGlow)" }}>
                {hoveredValue}
              </text>
              <text x={cx} y={cy + 10} textAnchor="middle" className="fill-gray-300" style={{ fontSize: 13 }}>
                {hoveredStat.name}
              </text>
            </g>
          ) : (
            <text x={cx} y={cy + 4} textAnchor="middle" className="fill-gray-600 font-mono" style={{ fontSize: 10 }}>
              SCANNING...
            </text>
          )}
        </svg>
      </div>

      {/* Tooltip */}
      <div className="h-16 flex items-center justify-center w-full">
        {hoveredStat ? (
          <div className="glass-card px-5 py-3 flex items-center gap-3 animate-fadeIn"
            style={{ borderColor: STAT_COLORS[hoveredIdx!] + "50" }}>
            <span className="text-4xl">{hoveredStat.icon}</span>
            <div>
              <div className="text-base font-bold text-white">{hoveredStat.name}</div>
              <div className="text-sm text-gray-400">{hoveredStat.description}</div>
            </div>
            <div className="text-2xl font-bold ml-3" style={{ color: STAT_COLORS[hoveredIdx!] }}>
              {hoveredValue}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-600 font-mono tracking-wider">
            [ 별자리를 터치하세요 ]
          </div>
        )}
      </div>

      {/* Stat bars */}
      <div className="w-full space-y-2.5">
        {STAT_DEFS.map((def, i) => {
          const value = stats[def.key];
          const color = STAT_COLORS[i];
          const isHovered = hoveredIdx === i;
          const pct = (value / 99) * 100;

          return (
            <button
              key={def.key}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${
                isHovered ? "bg-white/5 scale-[1.01]" : ""
              }`}
            >
              <span className="text-3xl w-10 text-center shrink-0">{def.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-300">{def.name}</span>
                  <span className="text-base font-bold" style={{ color }}>{value}</span>
                </div>
                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: animated ? `${pct}%` : "0%",
                      background: `linear-gradient(90deg, ${color}90, ${color})`,
                      boxShadow: isHovered ? `0 0 12px ${color}60, 0 0 24px ${color}30` : "none",
                      transitionDelay: `${i * 0.06}s`,
                    }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
