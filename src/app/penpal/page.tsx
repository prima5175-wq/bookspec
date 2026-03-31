"use client";

import { useEffect, useState } from "react";
import {
  PENPAL_TARGETS,
  PenpalTarget,
  ZONES,
  Zone,
  FrequencyConnection,
  getConnections,
  createConnection,
  deleteConnection,
  getFrequencyStatus,
  getLettersForConnection,
  getTargetById,
  getZoneForTarget,
} from "@/lib/penpal";
import Link from "next/link";

type Phase = "list" | "connecting" | "connected";

export default function PenpalPage() {
  const [connections, setConnections] = useState<FrequencyConnection[]>([]);
  const [phase, setPhase] = useState<Phase>("list");
  const [selectedTarget, setSelectedTarget] = useState<PenpalTarget | null>(null);
  const [newConn, setNewConn] = useState<FrequencyConnection | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const refresh = () => {
    const conns = getConnections();
    setConnections(conns);
    const counts: Record<string, number> = {};
    conns.forEach((c) => {
      counts[c.id] = getLettersForConnection(c.id).filter(
        (l) => l.type === "received" && !l.read
      ).length;
    });
    setUnreadCounts(counts);
  };

  useEffect(() => { refresh(); }, []);

  const freqStatus = getFrequencyStatus();
  const connectedIds = new Set(connections.map((c) => c.targetId));

  const handleConnect = (target: PenpalTarget) => {
    if (freqStatus.remainingSlots <= 0 || connectedIds.has(target.id)) return;
    setSelectedTarget(target);
    setPhase("connecting");
    setTimeout(() => {
      const conn = createConnection(target.id);
      if (conn) {
        setNewConn(conn);
        setPhase("connected");
        setTimeout(() => { setPhase("list"); refresh(); }, 3000);
      }
    }, 3500);
  };

  const handleDisconnect = (connId: string) => {
    deleteConnection(connId);
    refresh();
  };

  // ── CONNECTING ──
  if (phase === "connecting" && selectedTarget) {
    const zone = getZoneForTarget(selectedTarget.id);
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] gap-6 text-center">
        <div className="signal-connecting">
          <div className="signal-dish">📡</div>
          <div className="signal-wave signal-wave-1" style={{ borderColor: zone.color + "60" }} />
          <div className="signal-wave signal-wave-2" style={{ borderColor: zone.color + "40" }} />
          <div className="signal-wave signal-wave-3" style={{ borderColor: zone.color + "20" }} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold" style={{ color: zone.color }}>
            {zone.name} 주파수 스캐닝 중...
          </h2>
          <p className="text-sm text-gray-400">
            {selectedTarget.icon} {selectedTarget.name}에 연결 시도 중
          </p>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1.5 h-6 rounded-full"
              style={{
                background: selectedTarget.signalColor,
                animation: `signalBar 1.5s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── CONNECTED ──
  if (phase === "connected" && selectedTarget && newConn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] gap-6 text-center">
        <div className="signal-success">
          <div className="text-6xl mb-2">{selectedTarget.icon}</div>
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${selectedTarget.signalColor}30 0%, transparent 70%)`,
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-green-400">📡 주파수 연결 성공!</h2>
          <p className="text-sm text-gray-400">{selectedTarget.name}과(와) 통신 채널 오픈!</p>
          <div className="glass-card px-4 py-2 inline-block mt-2">
            <span className="text-xs text-gray-500">주파수: </span>
            <span className="text-sm font-mono text-cyan-400">{newConn.frequency}</span>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN LIST ──
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">📡 주파수 연결 대상</h1>

      {/* Frequency Status Bar */}
      <div className="glass-card p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm">📡</span>
            <span className="text-sm shrink-0">잔여 슬롯:</span>
            <span
              className={`text-lg font-bold shrink-0 ${
                freqStatus.remainingSlots <= 1
                  ? "text-red-400"
                  : freqStatus.remainingSlots <= 2
                    ? "text-yellow-400"
                    : "text-green-400"
              }`}
            >
              {freqStatus.remainingSlots}개
            </span>
          </div>
          <div className="text-xs text-gray-500 truncate">
            {freqStatus.elonMessage}
          </div>
        </div>
        {freqStatus.remainingSlots <= 1 && (
          <div className="mt-2 text-xs text-red-400/80 bg-red-600/10 rounded-lg p-2">
            ⚠️ 주파수 거의 소진! 일론의 위성이 너무 많습니다...
          </div>
        )}
      </div>

      {/* Active Connections */}
      {connections.length > 0 && (
        <div className="glass-card p-4">
          <h2 className="text-xs text-gray-500 mb-3">연결된 주파수</h2>
          <div className="space-y-2">
            {connections.map((conn) => {
              const target = getTargetById(conn.targetId);
              const unread = unreadCounts[conn.id] || 0;
              const count = getLettersForConnection(conn.id).length;
              return (
                <div key={conn.id} className="flex items-center gap-3 p-2 rounded-xl bg-white/5">
                  <div className="relative">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                      style={{ background: target.signalColor + "20" }}
                    >
                      {target.icon}
                    </div>
                    <div
                      className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#050510]"
                      style={{ background: target.signalColor, animation: "pulse 2s infinite" }}
                    />
                    {unread > 0 && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold flex items-center justify-center border border-[#050510]">
                        {unread}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{target.name}</div>
                    <div className="text-[10px] text-gray-600 font-mono">{conn.frequency} · {count}편지</div>
                  </div>
                  <Link
                    href={`/penpal/chat?id=${conn.id}`}
                    className="px-2.5 py-1 rounded-lg text-xs transition-all"
                    style={{
                      background: target.signalColor + "20",
                      color: target.signalColor,
                      border: `1px solid ${target.signalColor}30`,
                    }}
                  >
                    채팅
                  </Link>
                  <button
                    onClick={() => handleDisconnect(conn.id)}
                    className="text-[10px] text-gray-700 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4 Zones */}
      {ZONES.map((zone) => (
        <ZoneSection
          key={zone.id}
          zone={zone}
          connectedIds={connectedIds}
          noSlots={freqStatus.remainingSlots <= 0}
          onConnect={handleConnect}
        />
      ))}
    </div>
  );
}

// ── Zone Section Component ──
function ZoneSection({
  zone,
  connectedIds,
  noSlots,
  onConnect,
}: {
  zone: Zone;
  connectedIds: Set<string>;
  noSlots: boolean;
  onConnect: (target: PenpalTarget) => void;
}) {
  const targets = zone.targets.map((id) => getTargetById(id));

  return (
    <div>
      {/* Zone header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span
          className="text-sm w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: zone.color + "20" }}
        >
          {zone.icon}
        </span>
        <div>
          <span className="text-sm font-bold" style={{ color: zone.color }}>
            {zone.name}
          </span>
          <span className="text-xs text-gray-600 ml-2">{zone.description}</span>
        </div>
      </div>

      {/* Target cards */}
      <div className="space-y-2">
        {targets.map((target) => {
          const isConnected = connectedIds.has(target.id);
          const disabled = isConnected || noSlots;

          return (
            <button
              key={target.id}
              disabled={disabled}
              onClick={() => onConnect(target)}
              className={`glass-card w-full text-left transition-all overflow-hidden ${
                isConnected
                  ? "opacity-40 !border-green-500/20"
                  : disabled
                    ? "opacity-25"
                    : "hover:scale-[1.01] active:scale-[0.99]"
              }`}
              style={
                !disabled
                  ? { borderColor: zone.color + "15" }
                  : undefined
              }
            >
              <div className="p-3.5 flex items-center gap-3">
                {/* Icon with glow */}
                <div className="relative shrink-0">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-xl"
                    style={{
                      background: isConnected
                        ? "rgba(34,197,94,0.1)"
                        : target.signalColor + "12",
                      boxShadow: isConnected
                        ? undefined
                        : `0 0 12px ${target.signalColor}15`,
                    }}
                  >
                    {target.icon}
                  </div>
                  {isConnected && (
                    <div className="absolute -bottom-0.5 -right-0.5 text-[10px]">✅</div>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{target.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5 truncate">
                    &quot;{target.subtitle}&quot;
                  </div>
                </div>

                {/* Action */}
                {isConnected ? (
                  <span className="text-[10px] text-green-500/60 shrink-0">연결됨</span>
                ) : !noSlots ? (
                  <span
                    className="text-[10px] px-2 py-1 rounded-full shrink-0 font-medium"
                    style={{
                      background: target.signalColor + "15",
                      color: target.signalColor,
                    }}
                  >
                    연결 📡
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-700 shrink-0">슬롯 없음</span>
                )}
              </div>

              {/* Bottom accent line */}
              {!disabled && (
                <div
                  className="h-[2px] w-full opacity-30"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${target.signalColor}, transparent)`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
