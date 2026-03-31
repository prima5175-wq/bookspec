"use client";

import { PlanetType } from "@/lib/types";
import { PlanetDecoration } from "@/lib/satellite";
import Planet from "./Planet";

interface DecoratedPlanetProps {
  type: PlanetType;
  size?: number;
  decoration: PlanetDecoration;
  animate?: boolean;
}

export default function DecoratedPlanet({
  type,
  size = 60,
  decoration,
  animate = true,
}: DecoratedPlanetProps) {
  const { level, gifts, totalSatellites } = decoration;
  const outerSize = size * 2.2;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: outerSize, height: outerSize }}
    >
      {/* Level 3+: Glow effect */}
      {level >= 3 && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,220,100,0.15) 0%, transparent 60%)",
            animation: "pulse 3s ease-in-out infinite",
          }}
        />
      )}

      {/* Level 4: Full particle ring */}
      {level >= 4 && (
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-1 h-1 rounded-full bg-yellow-400/60"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${i * 30}deg) translateX(${outerSize * 0.42}px)`,
                animation: `twinkle ${2 + Math.random()}s ease-in-out ${Math.random() * 2}s infinite alternate`,
              }}
            />
          ))}
        </div>
      )}

      {/* Level 2+: Ring */}
      {level >= 2 && (
        <div
          className="absolute rounded-full border border-white/10"
          style={{
            width: outerSize * 0.85,
            height: outerSize * 0.85,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {/* Level 1+: Orbiting satellites */}
      {level >= 1 && (
        <div
          className="absolute"
          style={{
            width: outerSize * 0.8,
            height: outerSize * 0.8,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "spin 15s linear infinite",
          }}
        >
          {Array.from({ length: Math.min(totalSatellites, 5) }).map((_, i) => (
            <div
              key={`sat-${i}`}
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${(360 / Math.min(totalSatellites, 5)) * i}deg) translateX(${outerSize * 0.38}px) rotate(-${(360 / Math.min(totalSatellites, 5)) * i}deg)`,
                fontSize: size * 0.15,
              }}
            >
              🛰️
            </div>
          ))}
        </div>
      )}

      {/* Gift decorations around planet */}
      {/* Stars on surface */}
      {gifts.star > 0 && (
        <>
          {Array.from({ length: Math.min(gifts.star, 4) }).map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute"
              style={{
                top: `${30 + Math.sin(i * 1.8) * 15}%`,
                left: `${35 + Math.cos(i * 2.1) * 15}%`,
                fontSize: size * 0.12,
                animation: `twinkle ${1.5 + i * 0.3}s ease-in-out infinite alternate`,
              }}
            >
              ⭐
            </div>
          ))}
        </>
      )}

      {/* Moon orbiting */}
      {gifts.moon > 0 && (
        <div
          className="absolute"
          style={{
            width: outerSize * 0.65,
            height: outerSize * 0.65,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "spin 8s linear infinite reverse",
          }}
        >
          <div
            className="absolute"
            style={{
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: size * 0.2,
            }}
          >
            🌙
          </div>
        </div>
      )}

      {/* Crystal shimmer */}
      {gifts.crystal > 0 && (
        <div
          className="absolute rounded-full"
          style={{
            width: size * 0.9,
            height: size * 0.9,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "conic-gradient(from 0deg, transparent, rgba(200,180,255,0.15), transparent, rgba(200,180,255,0.1), transparent)",
            animation: "spin 6s linear infinite",
          }}
        />
      )}

      {/* Aurora */}
      {gifts.aurora > 0 && (
        <div
          className="absolute rounded-full overflow-hidden"
          style={{
            width: size * 1.15,
            height: size * 1.15,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="absolute w-full"
            style={{
              top: "5%",
              height: "25%",
              background: "linear-gradient(90deg, transparent, rgba(0,255,150,0.2), rgba(100,200,255,0.15), rgba(200,100,255,0.2), transparent)",
              filter: "blur(3px)",
              animation: "auroraWave 4s ease-in-out infinite",
            }}
          />
        </div>
      )}

      {/* The planet itself */}
      <Planet type={type} size={size} animate={animate} />
    </div>
  );
}
