"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Challenge,
  getChallenges,
  completeStage,
  deleteChallenge,
  getStageStatus,
  getXP,
  getLevel,
  STAGE_TEMPLATES,
} from "@/lib/challenge";
import { PlanetType } from "@/lib/types";
import Planet from "@/components/Planet";

type View = "list" | "detail" | "stage";

export default function ChallengePage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selected, setSelected] = useState<Challenge | null>(null);
  const [view, setView] = useState<View>("list");
  const [response, setResponse] = useState("");
  const [xp, setXp] = useState(0);
  const [showXPGain, setShowXPGain] = useState<number | null>(null);
  const [completedAnim, setCompletedAnim] = useState(false);

  const refresh = useCallback(() => {
    setChallenges(getChallenges());
    setXp(getXP());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const active = challenges.filter((c) => !c.completed);
  const done = challenges.filter((c) => c.completed);
  const levelInfo = getLevel(xp);
  const xpProgress =
    levelInfo.nextXP > levelInfo.currentXP
      ? ((levelInfo.currentXP - (levelInfo.nextXP === levelInfo.currentXP ? 0 : 0)) /
          levelInfo.nextXP) *
        100
      : 100;

  const handleComplete = (ch: Challenge, stageIdx: number) => {
    if (!response.trim()) return;
    const gained = ch.stages[stageIdx].xp;
    const updated = completeStage(ch.id, stageIdx, response);
    if (updated) {
      setShowXPGain(gained);
      setCompletedAnim(true);
      setTimeout(() => {
        setShowXPGain(null);
        setCompletedAnim(false);
        setResponse("");
        refresh();
        if (updated.completed) {
          setView("list");
          setSelected(null);
        } else {
          setSelected(updated);
          setView("detail");
        }
      }, 2000);
    }
  };

  const handleDelete = (id: string) => {
    deleteChallenge(id);
    refresh();
    setSelected(null);
    setView("list");
  };

  // ── STAGE VIEW ──
  if (view === "stage" && selected) {
    const status = getStageStatus(selected);
    const stage = selected.stages[status.stageIndex];

    return (
      <div className="space-y-6">
        <button
          onClick={() => setView("detail")}
          className="text-sm text-gray-400 hover:text-white"
        >
          ← 뒤로
        </button>

        <div className="text-center">
          <div
            className={`text-5xl mb-3 ${completedAnim ? "animate-bounce-once" : ""}`}
          >
            {stage.icon}
          </div>
          <h1 className="text-2xl font-bold">{stage.title}</h1>
          <p className="text-gray-400 text-sm mt-1">{stage.description}</p>
          <div className="text-xs text-purple-400 mt-2">+{stage.xp} XP</div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <Planet
              type={selected.planet as PlanetType}
              size={36}
              animate={false}
            />
            <div>
              <div className="font-medium text-sm">{selected.bookTitle}</div>
              <div className="text-xs text-gray-500">{selected.bookAuthor}</div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-300">{stage.prompt}</p>
          </div>

          {!status.isReady ? (
            <div className="text-center py-6">
              <div className="text-3xl mb-2">⏳</div>
              <p className="text-gray-400 text-sm">
                {status.daysUntilReady}일 후에 도전할 수 있어요!
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Day {stage.day}에 열려요
              </p>
            </div>
          ) : (
            <>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="여기에 작성해주세요..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-white placeholder-gray-600 transition-colors resize-none mb-4"
              />
              <button
                onClick={() => handleComplete(selected, status.stageIndex)}
                disabled={!response.trim() || completedAnim}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:from-purple-500 hover:to-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {completedAnim ? "완료! 🎉" : "기록 저장하기"}
              </button>
            </>
          )}
        </div>

        {/* XP gain popup */}
        {showXPGain && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            <div className="xp-gain-popup glass-card px-8 py-4 text-center">
              <div className="text-3xl mb-1">⚡</div>
              <div className="text-2xl font-bold text-yellow-400">
                +{showXPGain} XP
              </div>
              <div className="text-sm text-gray-400 mt-1">능력치 상승!</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── DETAIL VIEW ──
  if (view === "detail" && selected) {
    const status = getStageStatus(selected);

    return (
      <div className="space-y-6">
        <button
          onClick={() => {
            setView("list");
            setSelected(null);
          }}
          className="text-sm text-gray-400 hover:text-white"
        >
          ← 챌린지 목록
        </button>

        {/* Book header */}
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="relative">
            <Planet
              type={selected.planet as PlanetType}
              size={70}
              animate={true}
            />
            {!selected.completed && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold border-2 border-[#0b0d1a]">
                {selected.currentStage + 1}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">{selected.bookTitle}</h2>
            <p className="text-sm text-gray-400">{selected.bookAuthor}</p>
            {selected.completed ? (
              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-green-600/20 text-green-400 border border-green-600/30">
                챌린지 완료!
              </span>
            ) : (
              <span className="inline-block mt-1 text-xs text-gray-500">
                {status.isReady
                  ? "지금 도전 가능!"
                  : `다음 단계까지 ${status.daysUntilReady}일`}
              </span>
            )}
          </div>
        </div>

        {/* Stage timeline */}
        <div className="glass-card p-5">
          <h3 className="text-sm text-gray-400 mb-4">챌린지 타임라인</h3>
          <div className="space-y-0">
            {selected.stages.map((stage, i) => {
              const isDone = stage.completedAt !== null;
              const isCurrent = i === selected.currentStage && !selected.completed;
              const isLocked = i > selected.currentStage;

              return (
                <div key={i} className="flex gap-3">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 shrink-0 ${
                        isDone
                          ? "border-green-500 bg-green-600/20"
                          : isCurrent
                            ? "border-purple-500 bg-purple-600/20 animate-pulse"
                            : "border-white/10 bg-white/5"
                      }`}
                    >
                      {isDone ? "✓" : stage.icon}
                    </div>
                    {i < 3 && (
                      <div
                        className={`w-0.5 h-8 ${
                          isDone ? "bg-green-500/30" : "bg-white/5"
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-6 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span
                          className={`font-medium text-sm ${isLocked ? "text-gray-600" : ""}`}
                        >
                          {stage.title}
                        </span>
                        <span className="text-xs text-gray-600 ml-2">
                          Day {stage.day}
                        </span>
                      </div>
                      <span className="text-xs text-purple-400/60">
                        +{stage.xp} XP
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-0.5 ${isLocked ? "text-gray-700" : "text-gray-500"}`}
                    >
                      {stage.description}
                    </p>

                    {/* Show saved response */}
                    {isDone && stage.response && (
                      <div className="mt-2 text-xs bg-white/5 rounded-lg p-3 text-gray-400">
                        {stage.response}
                      </div>
                    )}

                    {/* Action button for current stage */}
                    {isCurrent && (
                      <button
                        onClick={() => {
                          setResponse("");
                          setView("stage");
                        }}
                        className={`mt-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                          getStageStatus(selected).isReady
                            ? "bg-purple-600/30 text-purple-300 border border-purple-500/40 hover:bg-purple-600/50"
                            : "bg-white/5 text-gray-500 border border-white/10"
                        }`}
                      >
                        {getStageStatus(selected).isReady
                          ? "도전하기 →"
                          : `${getStageStatus(selected).daysUntilReady}일 후 열림`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={() => handleDelete(selected.id)}
          className="w-full py-2 text-sm text-red-400/60 hover:text-red-400 transition-colors"
        >
          챌린지 포기하기
        </button>
      </div>
    );
  }

  // ── LIST VIEW ──
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">🌱 장기기억 챌린지</h1>

      {/* XP bar */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">⚡</span>
            <span className="font-medium">Lv.{levelInfo.level}</span>
            <span className="text-gray-400">{levelInfo.title}</span>
          </div>
          <span className="text-xs text-gray-500">
            {xp} / {levelInfo.nextXP} XP
          </span>
        </div>
        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-500"
            style={{ width: `${Math.min(xpProgress, 100)}%` }}
          />
        </div>
      </div>

      {/* Stage legend */}
      <div className="glass-card p-4">
        <h3 className="text-xs text-gray-500 mb-3">에빙하우스 망각곡선 4단계</h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          {STAGE_TEMPLATES.map((s) => (
            <div key={s.day} className="space-y-1">
              <div className="text-xl">{s.icon}</div>
              <div className="text-xs font-medium">Day {s.day}</div>
              <div className="text-[10px] text-gray-500 leading-tight">
                {s.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active challenges */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 mb-3 px-1">
          진행 중 ({active.length})
        </h2>
        {active.length === 0 ? (
          <div className="glass-card p-8 text-center text-gray-500">
            <div className="text-4xl mb-3">🌱</div>
            <p className="text-sm">진행 중인 챌린지가 없어요</p>
            <p className="text-xs text-gray-600 mt-1">
              책을 등록할 때 챌린지를 시작할 수 있어요!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {active.map((ch) => {
              const status = getStageStatus(ch);
              const stage = ch.stages[status.stageIndex];
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    setSelected(ch);
                    setView("detail");
                  }}
                  className="glass-card p-4 w-full text-left hover:scale-[1.01] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Planet
                        type={ch.planet as PlanetType}
                        size={48}
                        animate={false}
                      />
                      {/* Timer ring */}
                      <svg
                        className="absolute -inset-1"
                        viewBox="0 0 50 50"
                      >
                        <circle
                          cx="25"
                          cy="25"
                          r="23"
                          fill="none"
                          stroke="rgba(255,255,255,0.05)"
                          strokeWidth="2"
                        />
                        <circle
                          cx="25"
                          cy="25"
                          r="23"
                          fill="none"
                          stroke={status.isReady ? "#a78bfa" : "#374151"}
                          strokeWidth="2"
                          strokeDasharray={`${((status.stageIndex + (status.isReady ? 1 : 0)) / 4) * 144.5} 144.5`}
                          strokeLinecap="round"
                          transform="rotate(-90 25 25)"
                          className="transition-all duration-500"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {ch.bookTitle}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm">{stage.icon}</span>
                        <span className="text-xs text-gray-400">
                          {stage.title}
                        </span>
                        {status.isReady ? (
                          <span className="text-xs text-purple-400 font-medium animate-pulse">
                            도전 가능!
                          </span>
                        ) : (
                          <span className="text-xs text-gray-600">
                            {status.daysUntilReady}일 후
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      {status.stageIndex + 1}/4
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed challenges */}
      {done.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 mb-3 px-1">
            완료 ({done.length})
          </h2>
          <div className="space-y-3">
            {done.map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  setSelected(ch);
                  setView("detail");
                }}
                className="glass-card p-4 w-full text-left opacity-70 hover:opacity-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Planet
                    type={ch.planet as PlanetType}
                    size={40}
                    animate={false}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {ch.bookTitle}
                    </div>
                    <div className="text-xs text-green-400 mt-0.5">
                      🪐 챌린지 완료!
                    </div>
                  </div>
                  <span className="text-xs text-yellow-400">
                    +{ch.stages.reduce((s, st) => s + st.xp, 0)} XP
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
