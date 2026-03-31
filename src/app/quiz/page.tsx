"use client";

import { useState, useEffect } from "react";
import {
  OrbitGroup,
  ORBIT_GROUPS,
  INNER_QUESTIONS,
  OUTER_QUESTIONS,
  PLANET_RESULTS,
  calculateResult,
  saveQuizResult,
  getQuizResult,
} from "@/lib/quiz";
import { PLANETS, PlanetType } from "@/lib/types";
import Planet from "@/components/Planet";
import Link from "next/link";

type Phase = "intro" | "orbit" | "quiz" | "calculating" | "result";

export default function QuizPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [orbitGroup, setOrbitGroup] = useState<OrbitGroup | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [resultPlanet, setResultPlanet] = useState<PlanetType | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [existingResult, setExistingResult] = useState<PlanetType | null>(null);

  useEffect(() => {
    const saved = getQuizResult();
    if (saved) setExistingResult(saved);
  }, []);

  const questions = orbitGroup === "inner" ? INNER_QUESTIONS : OUTER_QUESTIONS;

  const handleStart = () => {
    setPhase("orbit");
    setOrbitGroup(null);
    setCurrentQ(0);
    setAnswers([]);
    setExistingResult(null);
  };

  const handleOrbitSelect = (group: OrbitGroup) => {
    setOrbitGroup(group);
    setTimeout(() => {
      setPhase("quiz");
    }, 600);
  };

  const handleSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setTimeout(() => {
      const newAnswers = [...answers, optionIndex];
      setAnswers(newAnswers);
      setSelectedOption(null);
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setPhase("calculating");
        const planet = calculateResult(orbitGroup!, newAnswers);
        saveQuizResult(planet);
        setTimeout(() => {
          setResultPlanet(planet);
          setPhase("result");
          setTimeout(() => setShowResult(true), 100);
        }, 3000);
      }
    }, 400);
  };

  const progress = ((currentQ + 1) / questions.length) * 100;

  // ── INTRO ──
  if (phase === "intro") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] gap-6 text-center">
        {/* Solar system decoration */}
        <div className="relative w-52 h-52 mb-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 shadow-[0_0_40px_rgba(255,200,0,0.4)]" />
          </div>
          {/* Inner orbit */}
          <div
            className="absolute inset-8 rounded-full border border-orange-400/20"
            style={{ animation: "spin 8s linear infinite" }}
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2">
              <Planet type="venus" size={16} animate={false} />
            </div>
          </div>
          {/* Dividing line */}
          <div className="absolute inset-4 rounded-full border border-dashed border-white/10" />
          {/* Outer orbit */}
          <div
            className="absolute -inset-2 rounded-full border border-indigo-400/15"
            style={{ animation: "spin 20s linear infinite reverse" }}
          >
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
              <Planet type="jupiter" size={24} animate={false} />
            </div>
          </div>
          <div
            className="absolute -inset-6 rounded-full border border-indigo-400/10"
            style={{ animation: "spin 30s linear infinite" }}
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2">
              <Planet type="neptune" size={18} animate={false} />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            행성 성격 유형
          </span>
        </h1>
        <p className="text-lg text-gray-400">나는 어떤 행성의 성격일까?</p>
        <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
          내행성 vs 외행성을 선택하고<br />
          5개의 질문에 답하면<br />
          나의 행성 성격 유형을 알려드려요!
        </p>

        {existingResult && (
          <div className="glass-card p-4 flex items-center gap-3 max-w-xs w-full">
            <Planet type={existingResult} size={40} animate={false} />
            <div className="text-left flex-1">
              <div className="text-xs text-gray-400">이전 결과</div>
              <div className="text-sm font-medium">
                {PLANETS[existingResult].name} - {PLANET_RESULTS[existingResult].title}
              </div>
              <div className="text-xs text-gray-500">
                {PLANET_RESULTS[existingResult].orbitGroup === "inner" ? "☀️ 내행성" : "🌌 외행성"}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleStart}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-indigo-600 text-white font-bold text-lg hover:from-orange-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-900/30 hover:scale-105"
        >
          {existingResult ? "다시 테스트하기" : "테스트 시작하기"} 🪐
        </button>
      </div>
    );
  }

  // ── ORBIT GROUP SELECTION ──
  if (phase === "orbit") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] gap-6">
        <div className="text-center mb-2">
          <h2 className="text-xl font-bold mb-2">나는 어느 쪽에 더 가까울까?</h2>
          <p className="text-sm text-gray-400">직감적으로 끌리는 쪽을 선택하세요</p>
        </div>

        <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
          {(["inner", "outer"] as OrbitGroup[]).map((group) => {
            const info = ORBIT_GROUPS[group];
            const isSelected = orbitGroup === group;
            return (
              <button
                key={group}
                onClick={() => handleOrbitSelect(group)}
                disabled={orbitGroup !== null}
                className={`glass-card p-5 text-left transition-all ${
                  isSelected
                    ? "scale-[1.03] border-purple-500/60"
                    : orbitGroup !== null
                      ? "opacity-30 scale-95"
                      : "hover:scale-[1.02] hover:border-purple-500/40"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shrink-0"
                    style={{
                      background: info.color + "20",
                      boxShadow: `0 0 20px ${info.color}20`,
                    }}
                  >
                    {info.icon}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{info.title}</div>
                    <div className="text-sm text-gray-400">{info.subtitle}</div>
                    <div
                      className="text-xs mt-1 font-medium"
                      style={{ color: info.color }}
                    >
                      {info.trait}
                    </div>
                  </div>
                </div>
                {/* Planet previews */}
                <div className="flex gap-3 mt-4 justify-center">
                  {info.planets.map((p) => (
                    <div key={p} className="flex flex-col items-center gap-1">
                      <Planet type={p} size={28} animate={false} />
                      <span className="text-[10px] text-gray-500">
                        {PLANETS[p].name}
                      </span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Inner/Outer description */}
        <div className="text-center max-w-sm">
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
            <div className="bg-white/5 rounded-lg p-2">
              ☀️ 내행성: 빠르고, 뜨겁고,<br/>가까이에서 빛나는 타입
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              🌌 외행성: 크고, 여유롭고,<br/>강한 중력으로 끌어당기는 타입
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── CALCULATING ──
  if (phase === "calculating") {
    const groupInfo = ORBIT_GROUPS[orbitGroup!];
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] gap-6 text-center">
        <div className="relative w-32 h-32">
          {/* Scanning orbits */}
          <div
            className="absolute inset-0 rounded-full border-2 border-purple-500/30"
            style={{ animation: "spin 2s linear infinite" }}
          />
          <div
            className="absolute inset-3 rounded-full border-2 border-cyan-500/30"
            style={{ animation: "spin 1.5s linear infinite reverse" }}
          />
          <div
            className="absolute inset-6 rounded-full border-2 border-pink-500/30"
            style={{ animation: "spin 1s linear infinite" }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-3xl">
            {groupInfo.icon}
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold" style={{ color: groupInfo.color }}>
            {groupInfo.title} 분석 중...
          </h2>
          <p className="text-sm text-gray-400">
            당신의 행성 성격을 찾고 있어요
          </p>
        </div>
        <div className="flex gap-2">
          {groupInfo.planets.map((p, i) => (
            <div
              key={p}
              className="opacity-50"
              style={{
                animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
              }}
            >
              <Planet type={p} size={24} animate={false} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── RESULT ──
  if (phase === "result" && resultPlanet) {
    const result = PLANET_RESULTS[resultPlanet];
    const planetInfo = PLANETS[resultPlanet];
    const groupInfo = ORBIT_GROUPS[result.orbitGroup];
    const compatPlanet = PLANETS[result.compatibility];
    const incompatPlanet = PLANETS[result.incompatibility];

    return (
      <div
        className={`flex flex-col items-center min-h-[75vh] gap-5 py-6 transition-all duration-1000 ${
          showResult ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Planet entrance */}
        <div
          className="relative"
          style={{
            animation: showResult
              ? "planetEntrance 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
              : "none",
          }}
        >
          <div
            className="absolute inset-0 rounded-full -m-6"
            style={{
              background: `radial-gradient(circle, ${planetInfo.color}30 0%, transparent 70%)`,
              animation: "pulse 3s ease-in-out infinite",
            }}
          />
          <Planet type={resultPlanet} size={150} animate={true} />
        </div>

        {/* Title */}
        <div className="text-center mt-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-medium"
              style={{
                background: groupInfo.color + "20",
                color: groupInfo.color,
                border: `1px solid ${groupInfo.color}40`,
              }}
            >
              {groupInfo.icon} {groupInfo.title}
            </span>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full"
              style={{
                background: planetInfo.color + "20",
                color: planetInfo.color,
                border: `1px solid ${planetInfo.color}40`,
              }}
            >
              {planetInfo.name}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-1">{result.title}</h1>
          <p className="text-sm text-gray-500 italic">{result.tagline}</p>
        </div>

        {/* Astronomy fact */}
        <div
          className="glass-card p-4 w-full max-w-sm text-center"
          style={{ animation: showResult ? "slideUp 0.6s 0.2s both" : "none" }}
        >
          <div className="text-xs text-gray-500 mb-1">🔭 천문학적 사실</div>
          <p className="text-sm text-gray-300">{result.astronomyFact}</p>
        </div>

        {/* Personality */}
        <div
          className="glass-card p-5 w-full max-w-sm"
          style={{ animation: showResult ? "slideUp 0.6s 0.3s both" : "none" }}
        >
          <h3 className="text-sm text-gray-400 mb-2">🪐 성격 분석</h3>
          <p className="text-sm leading-relaxed text-gray-300">
            {result.personality}
          </p>
        </div>

        {/* Reading style */}
        <div
          className="glass-card p-5 w-full max-w-sm"
          style={{ animation: showResult ? "slideUp 0.6s 0.4s both" : "none" }}
        >
          <h3 className="text-sm text-gray-400 mb-2">📖 독서 스타일</h3>
          <p className="text-sm text-gray-300 mb-3">{result.readingStyle}</p>
          <div className="flex flex-wrap gap-2">
            {result.traits.map((trait) => (
              <span
                key={trait}
                className="px-3 py-1.5 rounded-full text-xs border"
                style={{
                  borderColor: planetInfo.color + "40",
                  background: planetInfo.color + "15",
                  color: planetInfo.color,
                }}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Weakness (funny) */}
        <div
          className="glass-card p-4 w-full max-w-sm"
          style={{ animation: showResult ? "slideUp 0.6s 0.5s both" : "none" }}
        >
          <h3 className="text-sm text-gray-400 mb-1">😅 약점</h3>
          <p className="text-sm text-gray-500">{result.weakness}</p>
        </div>

        {/* Compatibility */}
        <div
          className="glass-card p-4 w-full max-w-sm"
          style={{ animation: showResult ? "slideUp 0.6s 0.6s both" : "none" }}
        >
          <h3 className="text-sm text-gray-400 mb-3">💫 궁합</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-green-600/10 rounded-xl p-2.5 border border-green-600/20">
              <Planet type={result.compatibility} size={28} animate={false} />
              <div>
                <div className="text-[10px] text-green-400">찰떡 궁합</div>
                <div className="text-xs font-medium">{compatPlanet.name}형</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-red-600/10 rounded-xl p-2.5 border border-red-600/20">
              <Planet type={result.incompatibility} size={28} animate={false} />
              <div>
                <div className="text-[10px] text-red-400">상극</div>
                <div className="text-xs font-medium">{incompatPlanet.name}형</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended genres */}
        <div
          className="glass-card p-4 w-full max-w-sm"
          style={{ animation: showResult ? "slideUp 0.6s 0.7s both" : "none" }}
        >
          <h3 className="text-sm text-gray-400 mb-3">📚 추천 책 장르</h3>
          <div className="flex gap-3">
            {result.recommendedGenres.map((genre) => (
              <div
                key={genre}
                className="flex-1 text-center p-3 rounded-xl bg-white/5"
              >
                <div className="text-lg mb-1">
                  {genre === "동화" ? "📖" : genre === "과학" ? "🔬" : genre === "역사" ? "🏛️" : genre === "모험" ? "⚔️" : genre === "판타지" ? "🧙" : genre === "학습" ? "📚" : "📗"}
                </div>
                <div className="text-xs">{genre}</div>
              </div>
            ))}
          </div>
        </div>

        {/* All planet scores */}
        <div
          className="glass-card p-5 w-full max-w-sm"
          style={{ animation: showResult ? "slideUp 0.6s 0.8s both" : "none" }}
        >
          <h3 className="text-sm text-gray-400 mb-3">
            {groupInfo.icon} {groupInfo.title} 친화도
          </h3>
          <PlanetScores
            orbitGroup={orbitGroup!}
            answers={answers}
            resultPlanet={resultPlanet}
          />
        </div>

        {/* Actions */}
        <div
          className="flex gap-3 w-full max-w-sm"
          style={{ animation: showResult ? "slideUp 0.6s 1s both" : "none" }}
        >
          <button
            onClick={handleStart}
            className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-colors"
          >
            다시하기
          </button>
          <Link
            href="/"
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center font-medium hover:from-purple-500 hover:to-blue-500 transition-all"
          >
            홈으로
          </Link>
        </div>
      </div>
    );
  }

  // ── QUIZ QUESTIONS ──
  const question = questions[currentQ];
  const groupInfo = ORBIT_GROUPS[orbitGroup!];

  return (
    <div className="flex flex-col min-h-[75vh]">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span className="flex items-center gap-1">
            <span style={{ color: groupInfo.color }}>{groupInfo.icon}</span>
            질문 {currentQ + 1} / {questions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${groupInfo.color}, ${groupInfo.color}aa)`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="flex gap-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i < currentQ
                  ? "scale-100"
                  : i === currentQ
                    ? "scale-125"
                    : "bg-white/10"
              }`}
              style={{
                background:
                  i < currentQ
                    ? groupInfo.color
                    : i === currentQ
                      ? groupInfo.color
                      : undefined,
              }}
            />
          ))}
        </div>

        <h2 className="text-xl font-bold text-center max-w-md leading-relaxed">
          {question.question}
        </h2>

        <div className="w-full max-w-md space-y-3">
          {question.options.map((option, i) => {
            const optionPlanet = option.planets[0];
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={selectedOption !== null}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                  selectedOption === i
                    ? "scale-[1.02]"
                    : selectedOption !== null
                      ? "border-white/5 opacity-40"
                      : "border-white/10 hover:border-white/20 hover:bg-white/5 active:scale-[0.98]"
                }`}
                style={
                  selectedOption === i
                    ? {
                        borderColor: PLANETS[optionPlanet].color + "80",
                        background: PLANETS[optionPlanet].color + "15",
                      }
                    : undefined
                }
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    <Planet type={optionPlanet} size={28} animate={false} />
                  </div>
                  <span className="text-sm leading-relaxed">{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Planet Scores ──
function PlanetScores({
  orbitGroup,
  answers,
  resultPlanet,
}: {
  orbitGroup: OrbitGroup;
  answers: number[];
  resultPlanet: PlanetType;
}) {
  const questions = orbitGroup === "inner" ? INNER_QUESTIONS : OUTER_QUESTIONS;
  const groupPlanets = ORBIT_GROUPS[orbitGroup].planets;

  const scores: Record<string, number> = {};
  groupPlanets.forEach((p) => (scores[p] = 0));

  answers.forEach((optionIndex, questionIndex) => {
    const question = questions[questionIndex];
    if (question && question.options[optionIndex]) {
      question.options[optionIndex].planets.forEach((p) => {
        scores[p] = (scores[p] || 0) + 1;
      });
    }
  });

  const maxScore = Math.max(...Object.values(scores), 1);

  return (
    <div className="space-y-2.5">
      {groupPlanets.map((p) => (
        <div key={p} className="flex items-center gap-2.5">
          <div className="w-20 shrink-0">
            <div className="flex items-center gap-1.5">
              <Planet type={p} size={18} animate={false} />
              <span className="text-xs text-gray-400">{PLANETS[p].name}</span>
            </div>
          </div>
          <div className="flex-1 h-3.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${((scores[p] || 0) / maxScore) * 100}%`,
                background:
                  p === resultPlanet
                    ? `linear-gradient(90deg, ${PLANETS[p].color}, ${PLANETS[p].color}cc)`
                    : PLANETS[p].color + "40",
                minWidth: (scores[p] || 0) > 0 ? 8 : 0,
              }}
            />
          </div>
          <span className="text-xs text-gray-500 w-4 text-right">
            {scores[p] || 0}
          </span>
        </div>
      ))}
    </div>
  );
}
