"use client";

import { useEffect, useState, useCallback } from "react";
import {
  addReadingEntry,
  getTodayPages,
  getWeekPages,
  getStreak,
  getReadingLog,
  getDailyGoal,
  setDailyGoal,
  getPlanetLevel,
} from "@/lib/reading";
import { getBooks } from "@/lib/storage";
import { Book, PlanetType } from "@/lib/types";
import Planet from "@/components/Planet";
import { getQuizResult } from "@/lib/quiz";

export default function ReadingPage() {
  const [todayPages, setTodayPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [streak, setStreak] = useState(0);
  const [weekData, setWeekData] = useState<{ date: string; pages: number }[]>([]);
  const [goal, setGoal] = useState(20);
  const [inputPages, setInputPages] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [showGoalEdit, setShowGoalEdit] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const [justAdded, setJustAdded] = useState(false);
  const [levelUpAnim, setLevelUpAnim] = useState(false);
  const [myPlanet, setMyPlanet] = useState<PlanetType>("earth");

  const refresh = useCallback(() => {
    const log = getReadingLog();
    setTodayPages(getTodayPages());
    setTotalPages(log.totalPages);
    setStreak(getStreak());
    setWeekData(getWeekPages());
    setGoal(getDailyGoal());
    setBooks(getBooks());
    setMyPlanet((getQuizResult() as PlanetType) || "earth");
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const planetInfo = getPlanetLevel(totalPages);
  const goalProgress = Math.min(todayPages / goal, 1);
  const goalAchieved = todayPages >= goal;
  const maxWeek = Math.max(...weekData.map((d) => d.pages), goal, 1);

  const handleAdd = () => {
    const pages = Number(inputPages);
    if (!pages || pages <= 0) return;

    const prevLevel = getPlanetLevel(totalPages).level;
    const bookObj = books.find((b) => b.id === selectedBookId);
    addReadingEntry(pages, selectedBookId || undefined, bookObj?.title);

    setInputPages("");
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);

    refresh();

    const newLevel = getPlanetLevel(getReadingLog().totalPages).level;
    if (newLevel > prevLevel) {
      setLevelUpAnim(true);
      setTimeout(() => setLevelUpAnim(false), 3000);
    }
  };

  const handleGoalSave = () => {
    const g = Number(goalInput);
    if (g > 0) {
      setDailyGoal(g);
      setGoal(g);
    }
    setShowGoalEdit(false);
  };

  const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-center">📖 읽기 추적</h1>

      {/* Planet visualization */}
      <div className="glass-card p-6 flex flex-col items-center gap-4">
        <div
          className="relative transition-all duration-1000 ease-out"
          style={{ transform: `scale(${planetInfo.sizeMultiplier})` }}
        >
          {/* Goal achieved glow */}
          {goalAchieved && (
            <div
              className="absolute -inset-6 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(250,204,21,0.25) 0%, transparent 70%)",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
          )}

          {/* Level up burst */}
          {levelUpAnim && (
            <div className="absolute -inset-10">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-yellow-400"
                  style={{
                    animation: `levelUpBurst 1s ${i * 0.1}s ease-out forwards`,
                    ["--angle" as string]: `${i * 45}deg`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Just added pulse */}
          {justAdded && (
            <div
              className="absolute -inset-4 rounded-full border-2 border-green-400/50"
              style={{ animation: "signalExpand 1s ease-out" }}
            />
          )}

          <Planet type={myPlanet} size={100} animate={true} />
        </div>

        {/* Level info */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                levelUpAnim ? "bg-yellow-500/30 text-yellow-300" : "bg-purple-600/20 text-purple-400"
              } transition-colors`}
            >
              Lv.{planetInfo.level}
            </span>
            <span className="text-sm font-medium">{planetInfo.title}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            총 {totalPages.toLocaleString()} 페이지 읽음
          </div>
        </div>

        {/* Level progress bar */}
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-[10px] text-gray-600 mb-1">
            <span>다음 레벨까지</span>
            <span>{planetInfo.currentPages}/100p</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 transition-all duration-1000"
              style={{ width: `${planetInfo.progress * 100}%` }}
            />
          </div>
        </div>

        {levelUpAnim && (
          <div className="text-center animate-bounce-once">
            <div className="text-2xl">🎉</div>
            <div className="text-sm font-bold text-yellow-400">레벨 업!</div>
            <div className="text-xs text-gray-400">행성이 커졌어요!</div>
          </div>
        )}
      </div>

      {/* Page input */}
      <div className="glass-card p-5 space-y-4">
        <h2 className="text-sm font-semibold">오늘 읽은 페이지 기록</h2>

        {/* Book selector */}
        {books.length > 0 && (
          <div>
            <label className="text-xs text-gray-500 mb-1 block">읽은 책</label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:border-purple-500 focus:outline-none transition-colors"
            >
              <option value="">선택 안 함</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="number"
            value={inputPages}
            onChange={(e) => setInputPages(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="페이지 수"
            min="1"
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-white placeholder-gray-600 transition-colors"
          />
          <button
            onClick={handleAdd}
            disabled={!inputPages || Number(inputPages) <= 0}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-500 hover:to-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            기록
          </button>
        </div>
      </div>

      {/* Today's stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-3 text-center">
          <div className="text-2xl font-bold text-cyan-400">{todayPages}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">오늘 읽은 p</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-2xl font-bold text-orange-400">🔥 {streak}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">연속 일수</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">Lv.{planetInfo.level}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">{planetInfo.title}</div>
        </div>
      </div>

      {/* Daily goal */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">🎯 오늘의 목표</h2>
          <button
            onClick={() => { setShowGoalEdit(!showGoalEdit); setGoalInput(String(goal)); }}
            className="text-[10px] text-gray-500 hover:text-white transition-colors"
          >
            {showGoalEdit ? "취소" : "목표 변경"}
          </button>
        </div>

        {showGoalEdit && (
          <div className="flex gap-2 mb-3">
            <input
              type="number"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              min="1"
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:border-purple-500 focus:outline-none"
              placeholder="목표 페이지"
            />
            <button
              onClick={handleGoalSave}
              className="px-4 py-2 rounded-lg bg-purple-600/30 text-purple-300 text-xs font-medium border border-purple-500/30"
            >
              저장
            </button>
          </div>
        )}

        {/* Goal progress ring */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle
                cx="18" cy="18" r="15"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="3"
              />
              <circle
                cx="18" cy="18" r="15"
                fill="none"
                stroke={goalAchieved ? "#22c55e" : "#7c3aed"}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${goalProgress * 94.2} 94.2`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xs font-bold ${goalAchieved ? "text-green-400" : "text-purple-400"}`}>
                {Math.round(goalProgress * 100)}%
              </span>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm">
              <span className={`font-bold ${goalAchieved ? "text-green-400" : ""}`}>
                {todayPages}
              </span>
              <span className="text-gray-500"> / {goal}p</span>
            </div>
            {goalAchieved ? (
              <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                ✅ 목표 달성! 대단해요!
              </div>
            ) : (
              <div className="text-xs text-gray-500 mt-1">
                {goal - todayPages}페이지 더 읽으면 달성!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="glass-card p-4">
        <h2 className="text-sm font-semibold mb-4">📊 이번 주 기록</h2>
        <div className="flex items-end gap-1.5 h-28">
          {weekData.map((day, i) => {
            const h = maxWeek > 0 ? (day.pages / maxWeek) * 100 : 0;
            const isToday = i === weekData.length - 1;
            const meetsGoal = day.pages >= goal;
            const dayDate = new Date(day.date);
            const dayLabel = dayLabels[dayDate.getDay()];

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-500">
                  {day.pages > 0 ? day.pages : ""}
                </span>
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    meetsGoal
                      ? "bg-gradient-to-t from-green-600 to-green-400"
                      : isToday
                        ? "bg-gradient-to-t from-purple-600 to-cyan-500"
                        : "bg-gradient-to-t from-purple-600/60 to-purple-400/60"
                  }`}
                  style={{ height: `${Math.max(h, 3)}%` }}
                />
                <span
                  className={`text-[10px] ${
                    isToday ? "text-white font-bold" : "text-gray-600"
                  }`}
                >
                  {dayLabel}
                </span>
              </div>
            );
          })}
        </div>
        {/* Goal line label */}
        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-600">
          <div className="w-3 h-0.5 bg-green-500/50" />
          <span>목표 {goal}p 이상 = 초록</span>
        </div>
      </div>

      {/* Growth milestones */}
      <div className="glass-card p-4">
        <h2 className="text-sm font-semibold mb-3">🚀 성장 마일스톤</h2>
        <div className="space-y-2">
          {[100, 500, 1000, 3000, 5000, 10000].map((milestone) => {
            const achieved = totalPages >= milestone;
            const progress = Math.min(totalPages / milestone, 1);
            return (
              <div key={milestone} className="flex items-center gap-3">
                <span className={`text-sm ${achieved ? "" : "grayscale opacity-40"}`}>
                  {milestone >= 10000
                    ? "🌟"
                    : milestone >= 5000
                      ? "🪐"
                      : milestone >= 3000
                        ? "⭐"
                        : milestone >= 1000
                          ? "🌍"
                          : milestone >= 500
                            ? "🌙"
                            : "🪨"}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className={achieved ? "text-yellow-400" : "text-gray-500"}>
                      {milestone.toLocaleString()}p
                    </span>
                    <span className="text-gray-600">
                      {achieved ? "달성!" : `${Math.round(progress * 100)}%`}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${progress * 100}%`,
                        background: achieved
                          ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                          : "linear-gradient(90deg, #7c3aed, #6366f1)",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
