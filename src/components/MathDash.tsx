"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Confetti from "@/components/Confetti";
import { updateState, useAppState } from "@/lib/store";
import type { KidId, MathDashDifficulty } from "@/lib/types";

type Phase = "intro" | "playing" | "done";
type Op = "+" | "-" | "x";

const TOTAL_QUESTIONS = 10;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion(difficulty: MathDashDifficulty): {
  a: number;
  b: number;
  op: Op;
  answer: number;
} {
  if (difficulty === "easy") {
    const a = randomInt(1, 10);
    const b = randomInt(1, 10);
    return { a, b, op: "+", answer: a + b };
  }

  if (difficulty === "medium") {
    const ops: Op[] = ["+", "-"];
    const op = ops[randomInt(0, 1)];
    if (op === "+") {
      const a = randomInt(1, 20);
      const b = randomInt(1, 20);
      return { a, b, op, answer: a + b };
    }
    // Subtraction: ensure result >= 0
    const a = randomInt(1, 20);
    const b = randomInt(0, a);
    return { a, b, op, answer: a - b };
  }

  // Hard: add, subtract, multiply
  const ops: Op[] = ["+", "-", "x"];
  const op = ops[randomInt(0, 2)];
  if (op === "+") {
    const a = randomInt(1, 20);
    const b = randomInt(1, 20);
    return { a, b, op, answer: a + b };
  }
  if (op === "-") {
    const a = randomInt(1, 20);
    const b = randomInt(0, a);
    return { a, b, op, answer: a - b };
  }
  // Multiplication
  const a = randomInt(1, 9);
  const b = randomInt(1, 9);
  return { a, b, op: "x", answer: a * b };
}

function generateChoices(correct: number): number[] {
  const choices = new Set<number>();
  choices.add(correct);

  let attempts = 0;
  while (choices.size < 4 && attempts < 100) {
    attempts++;
    const offset = randomInt(1, 5) * (Math.random() < 0.5 ? -1 : 1);
    const wrong = correct + offset;
    if (wrong >= 0 && wrong !== correct) {
      choices.add(wrong);
    }
  }

  // Fallback: fill remaining slots with sequential values
  let fill = 1;
  while (choices.size < 4) {
    const candidate = correct + fill;
    if (!choices.has(candidate) && candidate >= 0) choices.add(candidate);
    fill++;
  }

  // Shuffle
  const arr = Array.from(choices);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type Props = {
  kidId: KidId;
  onClose: () => void;
  accentColor?: string;
};

export default function MathDash({
  kidId,
  onClose,
  accentColor = "#e07a5f",
}: Props) {
  const state = useAppState();
  const bestScores = state[kidId].gameStats?.mathDash?.bestScore ?? {};
  const bestTimes = state[kidId].gameStats?.mathDash?.bestTime ?? {};

  const [phase, setPhase] = useState<Phase>("intro");
  const [difficulty, setDifficulty] = useState<MathDashDifficulty>("easy");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);
  const [isNewBestTime, setIsNewBestTime] = useState(false);

  // Stopwatch timer
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsed, setElapsed] = useState<number>(0);
  const [finalTime, setFinalTime] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Current question state
  const [question, setQuestion] = useState<ReturnType<typeof generateQuestion> | null>(null);
  const [choices, setChoices] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  const loadQuestion = useCallback((diff: MathDashDifficulty) => {
    const q = generateQuestion(diff);
    setQuestion(q);
    setChoices(generateChoices(q.answer));
    setFeedback(null);
    setSelectedAnswer(null);
    setLocked(false);
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startGame(diff: MathDashDifficulty) {
    setDifficulty(diff);
    setQuestionIndex(0);
    setCorrectCount(0);
    setIsNewBest(false);
    setIsNewBestTime(false);
    setShowConfetti(false);
    // Start stopwatch
    const now = Date.now();
    setStartTime(now);
    setElapsed(0);
    setFinalTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - now);
    }, 100);
    setPhase("playing");
    loadQuestion(diff);
  }

  function handleAnswer(answer: number) {
    if (locked || !question) return;
    setLocked(true);
    setSelectedAnswer(answer);

    const isCorrect = answer === question.answer;
    const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;

    if (isCorrect) {
      setFeedback("correct");
      setCorrectCount(newCorrectCount);
    } else {
      setFeedback("wrong");
    }

    const nextIndex = questionIndex + 1;

    setTimeout(() => {
      if (nextIndex >= TOTAL_QUESTIONS) {
        finishGame(newCorrectCount);
      } else {
        setQuestionIndex(nextIndex);
        loadQuestion(difficulty);
      }
    }, isCorrect ? 600 : 1000);
  }

  function finishGame(score: number) {
    // Stop stopwatch
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const endTime = Date.now() - startTime;
    setFinalTime(endTime);
    setElapsed(endTime);

    const prevBest = bestScores[difficulty] ?? 0;
    const prevBestTime = bestTimes[difficulty];
    const isNewScore = score > prevBest;
    const isNewTime = score === TOTAL_QUESTIONS && (!prevBestTime || endTime < prevBestTime);

    if (isNewScore || isNewTime) {
      if (isNewScore) setIsNewBest(true);
      if (isNewTime) setIsNewBestTime(true);
      updateState((prev) => ({
        ...prev,
        [kidId]: {
          ...prev[kidId],
          gameStats: {
            ...prev[kidId].gameStats,
            mathDash: {
              bestScore: {
                ...prev[kidId].gameStats?.mathDash?.bestScore,
                ...(isNewScore ? { [difficulty]: score } : {}),
              },
              bestTime: {
                ...prev[kidId].gameStats?.mathDash?.bestTime,
                ...(isNewTime ? { [difficulty]: endTime } : {}),
              },
            },
          },
        },
      }));
    }
    if (score > 7) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
    }
    setPhase("done");
  }

  const finalScore = correctCount;
  const bestForDiff = bestScores[difficulty] ?? 0;

  const doneEmoji = useMemo(() => {
    if (finalScore === 10) return "\u{1F3C6}"; // trophy
    if (finalScore > 7) return "⚡"; // lightning
    if (finalScore > 4) return "\u{1F4AA}"; // flexed biceps
    return "\u{1F3AF}"; // bullseye
  }, [finalScore]);

  function formatTime(ms: number): string {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    if (mins > 0) return `${mins}:${String(secs).padStart(2, "0")}.${tenths}`;
    return `${secs}.${tenths}s`;
  }

  const difficultyLabels: Record<MathDashDifficulty, { label: string; desc: string; emoji: string }> = {
    easy: { label: "Easy", desc: "Addition, 1–10", emoji: "\u{1F31F}" },
    medium: { label: "Medium", desc: "Add & subtract, 1–20", emoji: "\u{1F525}" },
    hard: { label: "Hard", desc: "Add, subtract & multiply", emoji: "\u{1F680}" },
  };

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto"
      style={{
        background:
          "linear-gradient(180deg, #3d2416 0%, #5c3a28 60%, #7a4e38 100%)",
        color: "#fef3ec",
      }}
    >
      <Confetti active={showConfetti} count={48} seed={7} />

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
        {phase === "playing" && question ? (
          <div className="flex items-center gap-2 md:gap-3">
            <div className="rounded-full bg-white/15 px-3 py-2 text-sm font-bold tabular-nums text-white/90 backdrop-blur shadow-sm ring-1 ring-white/20 md:px-4 md:text-base">
              {formatTime(elapsed)}
            </div>
            <div className="rounded-full bg-white/15 px-3 py-2 text-sm font-bold text-white backdrop-blur shadow-sm ring-1 ring-white/20 md:px-4 md:text-base">
              {questionIndex + 1}/{TOTAL_QUESTIONS}
            </div>
            <div
              className="rounded-full px-3 py-2 text-sm font-bold text-white shadow-sm md:px-4 md:text-base"
              style={{ backgroundColor: accentColor }}
            >
              ✓ {correctCount}
            </div>
          </div>
        ) : null}
      </div>

      {/* Intro screen */}
      {phase === "intro" ? (
        <div className="flex min-h-full flex-col items-center justify-center px-6 py-24 text-center">
          <div className="text-7xl md:text-8xl animate-bob" aria-hidden="true">
            ⚡
          </div>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">Math Dash</h2>
          <p className="mt-3 max-w-md text-lg text-white/70 md:text-xl">
            Solve 10 problems as fast as you can. Pick your level!
          </p>

          {/* Best scores display */}
          {Object.keys(bestScores).length > 0 ? (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {(["easy", "medium", "hard"] as const).map((d) =>
                bestScores[d] != null ? (
                  <span
                    key={d}
                    className="rounded-full px-4 py-1.5 text-sm font-bold"
                    style={{
                      backgroundColor: `${accentColor}40`,
                      color: "#fff",
                    }}
                  >
                    {difficultyLabels[d].emoji} {difficultyLabels[d].label}: {bestScores[d]}/10
                    {bestTimes[d] ? ` · ${formatTime(bestTimes[d]!)}` : ""}
                  </span>
                ) : null,
              )}
            </div>
          ) : null}

          {/* Difficulty buttons */}
          <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
            {(["easy", "medium", "hard"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => startGame(d)}
                className="rounded-full px-8 py-4 text-lg font-bold text-white shadow-lg transition active:scale-[0.98] md:text-xl"
                style={{ backgroundColor: accentColor }}
              >
                {difficultyLabels[d].emoji} {difficultyLabels[d].label}
                <span className="ml-2 text-sm font-normal text-white/70">
                  {difficultyLabels[d].desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Playing screen */}
      {phase === "playing" && question ? (
        <div className="flex min-h-full flex-col items-center justify-center px-6 py-24">
          {/* Progress bar */}
          <div className="mb-8 w-full max-w-md">
            <div className="h-3 w-full rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(questionIndex / TOTAL_QUESTIONS) * 100}%`,
                  backgroundColor: accentColor,
                }}
              />
            </div>
          </div>

          {/* Equation */}
          <div
            className={`mb-10 text-center transition-transform duration-150 ${
              feedback === "wrong" ? "animate-shake" : ""
            }`}
          >
            <p className="text-6xl font-bold tabular-nums md:text-7xl">
              {question.a} {question.op} {question.b}
            </p>
            <p className="mt-2 text-3xl font-bold text-white/60 md:text-4xl">= ?</p>
          </div>

          {/* Answer grid 2x2 */}
          <div className="grid w-full max-w-sm grid-cols-2 gap-3 md:gap-4">
            {choices.map((choice, i) => {
              let bg = "bg-white/15 ring-1 ring-white/20";
              let extraClass = "";

              if (feedback && selectedAnswer === choice) {
                if (feedback === "correct") {
                  bg = "bg-green-500/80 ring-1 ring-green-300";
                } else {
                  bg = "bg-red-500/80 ring-1 ring-red-300";
                  extraClass = "animate-shake";
                }
              }

              // Show correct answer on wrong
              if (feedback === "wrong" && choice === question.answer) {
                bg = "bg-green-500/50 ring-1 ring-green-300";
              }

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAnswer(choice)}
                  disabled={locked}
                  className={`relative aspect-[2/1.2] rounded-2xl text-3xl font-bold text-white shadow-lg transition-all duration-150 active:scale-[0.97] md:text-4xl ${bg} ${extraClass} ${
                    locked ? "cursor-default" : "hover:bg-white/25"
                  }`}
                >
                  {choice}
                  {feedback === "correct" && selectedAnswer === choice ? (
                    <span className="absolute -right-1 -top-1 text-2xl">✓</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Done screen */}
      {phase === "done" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="text-8xl animate-pop" aria-hidden="true">
            {doneEmoji}
          </div>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            {finalScore}/{TOTAL_QUESTIONS} ⚡
          </h2>
          <p className="mt-2 text-2xl font-bold tabular-nums text-white/80 md:text-3xl">
            {formatTime(finalTime)}
          </p>
          {isNewBest ? (
            <p
              className="mt-2 text-xl font-bold uppercase tracking-wide md:text-2xl"
              style={{ color: "#ffd84d" }}
            >
              ★ New best score!
            </p>
          ) : bestForDiff > 0 ? (
            <p className="mt-1 text-base text-white/70 md:text-lg">
              Best score: {bestForDiff}/10
            </p>
          ) : null}
          {isNewBestTime ? (
            <p
              className="mt-1 text-lg font-bold uppercase tracking-wide md:text-xl"
              style={{ color: "#ffd84d" }}
            >
              ⏱ New fastest time!
            </p>
          ) : bestTimes[difficulty] ? (
            <p className="mt-1 text-sm text-white/60 md:text-base">
              Fastest 10/10: {formatTime(bestTimes[difficulty]!)}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 md:flex-row md:gap-4">
            <button
              type="button"
              onClick={() => startGame(difficulty)}
              className="rounded-full bg-white/15 px-8 py-4 text-lg font-bold text-white shadow-sm ring-1 ring-white/20 backdrop-blur hover:bg-white/25 md:text-xl"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => setPhase("intro")}
              className="rounded-full bg-white/10 px-8 py-4 text-lg font-bold text-white shadow-sm ring-1 ring-white/15 backdrop-blur hover:bg-white/20 md:text-xl"
            >
              Change level
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
      ) : null}

      {/* Shake animation (inline keyframes) */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
