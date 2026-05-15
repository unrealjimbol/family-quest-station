"use client";

import { useCallback, useEffect, useState } from "react";
import Confetti from "@/components/Confetti";
import { updateState, useAppState } from "@/lib/store";
import type { KidId } from "@/lib/types";

type Phase = "intro" | "playing" | "feedback" | "done";

// ─── Pattern bank ────────────────────────────────────────────────────
// tier 1 = easiest, tier 5 = hardest
type PatternDef = {
  tier: number;
  sequence: string[];
  answer: string;
  wrong: string[];
};

const PATTERN_BANK: PatternDef[] = [
  // tier 1 — simple repeat (rounds 1-2)
  { tier: 1, sequence: ["🔴", "🔵", "🔴", "🔵"], answer: "🔴", wrong: ["🔵", "🟢", "🟡"] },
  { tier: 1, sequence: ["⭐", "🌙", "⭐", "🌙"], answer: "⭐", wrong: ["🌙", "🌞", "💫"] },
  { tier: 1, sequence: ["🍎", "🍊", "🍎", "🍊"], answer: "🍎", wrong: ["🍊", "🍋", "🍇"] },

  // tier 2 — number +2 (rounds 2-3)
  { tier: 2, sequence: ["2", "4", "6", "8"], answer: "10", wrong: ["9", "11", "12"] },
  { tier: 2, sequence: ["1", "3", "5", "7"], answer: "9", wrong: ["8", "10", "6"] },
  { tier: 2, sequence: ["10", "20", "30", "40"], answer: "50", wrong: ["45", "55", "60"] },

  // tier 3 — ABC repeat (rounds 3-4)
  { tier: 3, sequence: ["🌟", "🌙", "⭐", "🌟", "🌙", "⭐"], answer: "🌟", wrong: ["🌙", "⭐", "💫"] },
  { tier: 3, sequence: ["🔴", "🟢", "🔵", "🔴", "🟢", "🔵"], answer: "🔴", wrong: ["🟢", "🔵", "🟡"] },

  // tier 4 — growing numbers / triangular (rounds 4-5)
  { tier: 4, sequence: ["1", "2", "4", "7"], answer: "11", wrong: ["8", "10", "9"] },
  { tier: 4, sequence: ["1", "3", "6", "10"], answer: "15", wrong: ["12", "14", "13"] },

  // tier 5 — shape size pattern (rounds 5-6)
  { tier: 5, sequence: ["●", "●●", "●●●"], answer: "●●●●", wrong: ["●●", "●●●●●", "●●●"] },
  { tier: 5, sequence: ["▲", "▲▲", "▲▲▲", "▲▲▲▲"], answer: "▲▲▲▲▲", wrong: ["▲▲▲", "▲▲▲▲", "▲▲"] },

  // tier 6 — skip counting (rounds 6-7)
  { tier: 6, sequence: ["5", "10", "15", "20"], answer: "25", wrong: ["22", "30", "21"] },
  { tier: 6, sequence: ["3", "6", "9", "12"], answer: "15", wrong: ["13", "14", "18"] },

  // tier 7 — mirror pattern (rounds 7-8)
  { tier: 7, sequence: ["🍎", "🍊", "🍋", "🍊"], answer: "🍎", wrong: ["🍋", "🍊", "🍇"] },
  { tier: 7, sequence: ["🐶", "🐱", "🐰", "🐱"], answer: "🐶", wrong: ["🐰", "🐱", "🐸"] },

  // tier 8 — multiply x2 (rounds 8-9)
  { tier: 8, sequence: ["1", "2", "4", "8"], answer: "16", wrong: ["10", "12", "14"] },
  { tier: 8, sequence: ["3", "6", "12", "24"], answer: "48", wrong: ["30", "36", "42"] },

  // tier 9 — fibonacci-like (rounds 9-10)
  { tier: 9, sequence: ["1", "1", "2", "3", "5"], answer: "8", wrong: ["6", "7", "9"] },
  { tier: 9, sequence: ["2", "2", "4", "6", "10"], answer: "16", wrong: ["12", "14", "15"] },

  // tier 10 — complex repeat with numbers (round 10)
  { tier: 10, sequence: ["1A", "2B", "3C"], answer: "4D", wrong: ["4C", "3D", "5E"] },
  { tier: 10, sequence: ["A1", "B2", "C3", "D4"], answer: "E5", wrong: ["D5", "E4", "F6"] },
];

const TOTAL_ROUNDS = 10;

/** Pick 10 patterns from the bank, one per tier, shuffled within tier */
function pickPatterns(): PatternDef[] {
  const byTier = new Map<number, PatternDef[]>();
  for (const p of PATTERN_BANK) {
    const arr = byTier.get(p.tier) ?? [];
    arr.push(p);
    byTier.set(p.tier, arr);
  }

  const picked: PatternDef[] = [];
  for (let t = 1; t <= 10; t++) {
    const bucket = byTier.get(t);
    if (bucket && bucket.length > 0) {
      picked.push(bucket[Math.floor(Math.random() * bucket.length)]);
    }
  }
  return picked;
}

/** Shuffle an array (Fisher-Yates) */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Props = {
  kidId: KidId;
  onClose: () => void;
  accentColor?: string;
};

export default function PatternQuest({
  kidId,
  onClose,
  accentColor = "#6c5ce7",
}: Props) {
  const state = useAppState();
  const bestScore = state[kidId].gameStats?.patternQuest?.bestScore ?? 0;

  const [phase, setPhase] = useState<Phase>("intro");
  const [patterns, setPatterns] = useState<PatternDef[]>([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);

  const setupRound = useCallback(
    (pats: PatternDef[], r: number) => {
      const p = pats[r];
      setCorrectAnswer(p.answer);
      setChoices(shuffle([p.answer, ...p.wrong]));
    },
    [],
  );

  function startGame() {
    const pats = pickPatterns();
    setPatterns(pats);
    setRound(0);
    setScore(0);
    setIsNewBest(false);
    setShowConfetti(false);
    setFeedbackCorrect(null);
    setupRound(pats, 0);
    setPhase("playing");
  }

  function handleChoice(choice: string) {
    if (phase !== "playing") return;
    const isCorrect = choice === correctAnswer;
    setFeedbackCorrect(isCorrect);
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);
    setPhase("feedback");

    setTimeout(() => {
      const nextRound = round + 1;
      if (nextRound >= TOTAL_ROUNDS) {
        finishGame(newScore);
      } else {
        setRound(nextRound);
        setupRound(patterns, nextRound);
        setFeedbackCorrect(null);
        setPhase("playing");
      }
    }, 1200);
  }

  function finishGame(finalScore: number) {
    if (finalScore > bestScore) {
      setIsNewBest(true);
      updateState((prev) => ({
        ...prev,
        [kidId]: {
          ...prev[kidId],
          gameStats: {
            ...prev[kidId].gameStats,
            patternQuest: { bestScore: finalScore },
          },
        },
      }));
    }
    if (finalScore > 7) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
    }
    setPhase("done");
  }

  function doneEmoji(s: number): string {
    if (s === 10) return "🧠";
    if (s > 7) return "🔮";
    if (s > 4) return "💡";
    return "🎯";
  }

  // ─── Render ──────────────────────────────────────────────────────────

  const currentPattern = patterns[round] ?? null;

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto"
      style={{
        background:
          "linear-gradient(180deg, #2a2440 0%, #3d3263 60%, #4d3e7a 100%)",
        color: "#f5eef7",
      }}
    >
      <Confetti active={showConfetti} count={48} seed={11} />

      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-5 py-4 md:px-8 md:py-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close game"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-2xl font-bold text-white backdrop-blur shadow-sm ring-1 ring-white/20 hover:bg-white/25"
        >
          ✕
        </button>
        {(phase === "playing" || phase === "feedback") && (
          <div className="flex items-center gap-2 md:gap-3">
            <div className="rounded-full bg-white/15 px-4 py-2 text-base font-bold text-white backdrop-blur shadow-sm ring-1 ring-white/20 md:text-lg">
              {round + 1} / {TOTAL_ROUNDS}
            </div>
            <div
              className="rounded-full px-4 py-2 text-base font-bold text-white shadow-sm md:text-lg"
              style={{ backgroundColor: accentColor }}
            >
              ★ {score}
            </div>
          </div>
        )}
      </div>

      {/* ── INTRO ────────────────────────────────────────────────────── */}
      {phase === "intro" && (
        <div className="flex min-h-full flex-col items-center justify-center px-6 py-24 text-center">
          <div className="text-7xl md:text-8xl animate-bob" aria-hidden="true">
            🔮
          </div>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">Pattern Quest</h2>
          <p className="mt-3 max-w-md text-lg text-white/70 md:text-xl">
            Find the pattern. Pick what comes next!
          </p>
          {bestScore > 0 && (
            <p
              className="mt-4 rounded-full px-5 py-2 text-base font-bold md:text-lg"
              style={{
                backgroundColor: `${accentColor}40`,
                color: "#fff",
              }}
            >
              ★ Best score: {bestScore} / {TOTAL_ROUNDS}
            </p>
          )}
          <button
            type="button"
            onClick={startGame}
            className="mt-8 rounded-full px-10 py-4 text-xl font-bold text-white shadow-lg transition active:scale-[0.98] md:text-2xl"
            style={{ backgroundColor: accentColor }}
          >
            Start
          </button>
        </div>
      )}

      {/* ── PLAYING / FEEDBACK ───────────────────────────────────────── */}
      {(phase === "playing" || phase === "feedback") && currentPattern && (
        <div className="flex min-h-full flex-col items-center justify-center px-4 py-24 md:px-6">
          {/* Progress dots */}
          <div className="mb-6 flex items-center gap-1.5 md:gap-2">
            {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
              <div
                key={i}
                className="h-2.5 w-2.5 rounded-full md:h-3 md:w-3"
                style={{
                  backgroundColor:
                    i < round
                      ? accentColor
                      : i === round
                        ? "#fff"
                        : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>

          {/* Sequence row */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {currentPattern.sequence.map((item, i) => (
              <div
                key={i}
                className="flex h-14 min-w-[3.5rem] items-center justify-center rounded-2xl bg-white/10 px-3 text-2xl font-bold backdrop-blur ring-1 ring-white/10 md:h-20 md:min-w-[5rem] md:text-4xl"
              >
                {item}
              </div>
            ))}
            {/* Question mark */}
            <div
              className="flex h-14 min-w-[3.5rem] items-center justify-center rounded-2xl border-2 px-3 text-2xl font-bold md:h-20 md:min-w-[5rem] md:text-4xl"
              style={{
                backgroundColor:
                  phase === "feedback"
                    ? feedbackCorrect
                      ? "rgba(46,204,113,0.25)"
                      : "rgba(231,76,60,0.25)"
                    : `${accentColor}30`,
                borderColor:
                  phase === "feedback"
                    ? feedbackCorrect
                      ? "#2ecc71"
                      : "#e74c3c"
                    : accentColor,
              }}
            >
              {phase === "feedback" ? correctAnswer : "?"}
            </div>
          </div>

          {/* Feedback text */}
          {phase === "feedback" && (
            <div className="mt-4 text-center animate-pop">
              {feedbackCorrect ? (
                <p className="text-xl font-bold text-[#2ecc71] md:text-2xl">
                  Correct! 🎉
                </p>
              ) : (
                <p className="text-xl font-bold text-[#e74c3c] md:text-2xl">
                  Not quite! The answer is {correctAnswer}
                </p>
              )}
            </div>
          )}

          {/* Choices — 2x2 grid */}
          <div className="mt-8 grid w-full max-w-md grid-cols-2 gap-3 md:gap-4">
            {choices.map((c, i) => {
              const isAnswer = c === correctAnswer;
              const showResult = phase === "feedback";
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleChoice(c)}
                  disabled={phase !== "playing"}
                  className={`flex h-16 items-center justify-center rounded-2xl text-2xl font-bold shadow-lg transition-all duration-150 active:scale-[0.97] md:h-20 md:text-3xl ${
                    phase !== "playing" ? "cursor-default" : ""
                  }`}
                  style={{
                    backgroundColor: showResult
                      ? isAnswer
                        ? "rgba(46,204,113,0.3)"
                        : "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,0.12)",
                    boxShadow: showResult && isAnswer
                      ? "0 0 20px rgba(46,204,113,0.4)"
                      : "inset 0 -4px 0 rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.2)",
                    border: showResult && isAnswer
                      ? "2px solid #2ecc71"
                      : "2px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── DONE ─────────────────────────────────────────────────────── */}
      {phase === "done" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="text-8xl animate-pop" aria-hidden="true">
            {doneEmoji(score)}
          </div>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            {score} / {TOTAL_ROUNDS}
          </h2>
          {isNewBest && (
            <p
              className="mt-2 text-xl font-bold uppercase tracking-wide md:text-2xl"
              style={{ color: "#ffd84d" }}
            >
              ★ New best!
            </p>
          )}
          {!isNewBest && bestScore > 0 && (
            <p className="mt-2 text-base text-white/70 md:text-lg">
              Best so far: {bestScore} / {TOTAL_ROUNDS}
            </p>
          )}
          <p className="mt-3 text-lg text-white/60 md:text-xl">
            {score === 10
              ? "Perfect! You are a pattern master!"
              : score > 7
                ? "Amazing pattern finder!"
                : score > 4
                  ? "Good job! Keep practicing!"
                  : "Nice try! Patterns are tricky!"}
          </p>

          <div className="mt-8 flex flex-col gap-3 md:flex-row md:gap-4">
            <button
              type="button"
              onClick={startGame}
              className="rounded-full bg-white/15 px-8 py-4 text-lg font-bold text-white shadow-sm ring-1 ring-white/20 backdrop-blur hover:bg-white/25 md:text-xl"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-8 py-4 text-lg font-bold text-white shadow-sm md:text-xl"
              style={{ backgroundColor: accentColor }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
