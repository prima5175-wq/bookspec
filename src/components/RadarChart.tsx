"use client";

import { StatScores, STAT_DEFS, StatKey } from "@/lib/stats";

interface RadarChartProps {
  stats: StatScores;
  size?: number;
}

export default function RadarChart({ stats, size = 300 }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;
  const count = STAT_DEFS.length;
  const angleStep = (Math.PI * 2) / count;

  // Generate polygon points for a given level (0-1)
  const getPolygonPoints = (level: number) =>
    STAT_DEFS.map((_, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const r = radius * level;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(" ");

  // Data polygon
  const dataPoints = STAT_DEFS.map((s, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const level = Math.min(stats[s.key] / 99, 1);
    const r = radius * level;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");

  // Label positions
  const labels = STAT_DEFS.map((s, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const labelR = radius + size * 0.12;
    return {
      x: cx + labelR * Math.cos(angle),
      y: cy + labelR * Math.sin(angle),
      stat: s,
      value: stats[s.key],
    };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" className="max-w-sm mx-auto">
      <defs>
        <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid rings */}
      {[0.2, 0.4, 0.6, 0.8, 1.0].map((level) => (
        <polygon
          key={level}
          points={getPolygonPoints(level)}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {STAT_DEFS.map((_, i) => {
        const angle = angleStep * i - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + radius * Math.cos(angle)}
            y2={cy + radius * Math.sin(angle)}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={dataPoints}
        fill="url(#radarFill)"
        stroke="url(#radarStroke)"
        strokeWidth="2"
        filter="url(#glow)"
        className="transition-all duration-1000"
      >
        <animate
          attributeName="opacity"
          from="0"
          to="1"
          dur="0.8s"
          fill="freeze"
        />
      </polygon>

      {/* Data points */}
      {STAT_DEFS.map((s, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const level = Math.min(stats[s.key] / 99, 1);
        const r = radius * level;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        return (
          <circle
            key={s.key}
            cx={px}
            cy={py}
            r="3.5"
            fill="white"
            opacity="0.9"
            className="transition-all duration-1000"
          >
            <animate
              attributeName="opacity"
              from="0"
              to="0.9"
              dur="1s"
              fill="freeze"
            />
          </circle>
        );
      })}

      {/* Labels */}
      {labels.map((l) => (
        <g key={l.stat.key}>
          <text
            x={l.x}
            y={l.y - 6}
            textAnchor="middle"
            dominantBaseline="auto"
            className="fill-gray-300 transition-all"
            style={{ fontSize: size * 0.04 }}
          >
            {l.stat.icon}
          </text>
          <text
            x={l.x}
            y={l.y + 8}
            textAnchor="middle"
            dominantBaseline="auto"
            className="fill-gray-400"
            style={{ fontSize: size * 0.032 }}
          >
            {l.stat.name}
          </text>
          <text
            x={l.x}
            y={l.y + 20}
            textAnchor="middle"
            dominantBaseline="auto"
            className="fill-purple-400 font-bold"
            style={{ fontSize: size * 0.033 }}
          >
            {l.value}
          </text>
        </g>
      ))}
    </svg>
  );
}
