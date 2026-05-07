"use client";

import { useEffect, useState } from "react";
import Confetti from "@/components/Confetti";
import { updateState, useAppState } from "@/lib/store";
import type { KidId } from "@/lib/types";

type Phase = "intro" | "watching" | "your-turn" | "between" | "done";

const PADS = [
  { id: 0, color: "#e07a5f", glow: "#fde4cf", name: "red" },
  { id: 1, color: "#5077e6", glow: "#cfd8fb", name: "blue" },
  { id: 2, color: "#f0c83c", glow: "#fdf2c2", name: "yellow" },
  { id: 3, color: "#7fb46a", glow: "#dff5d6", name: "green" },
];

function randomPad(): number {
  return Math.floor(Math.random() * 4);
}

type Props = {
  kidId: KidId;
  onClose: () => void;
  accentColor?: string;
};

export default function EchoBeat({
  kidId,
  onClose,
  accentColor = "#6c5ce7",
}: Props) {
  const state = useAppState();
  const bestStreak = state[kidId].gameStats?.echoBeat?.bestStreak ?? 0;

  const [phase, setPhase] = useState<Phase>("intro");
  const [sequence, setSequence] = useState<number[]>([]);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [inputIndex, setInputIndex] = useState(0);
  const [round, setRound] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);
  const [streakReached, setStreakReached] = useState(0);

  // Watch sequence playback
  useEffect(() => {
    if (phase !== "watching") return;
    let cancelled = false;
    let i = 0;
    const playStep = () => {
      if (cancelled) return;
      if (i >= sequence.length) {
        setActivePad(null);
        setPhase("your-turn");
        setInputIndex(0);
        return;
      }
      setActivePad(sequence[i]);
      setTimeout(() => {
        if (cancelled) return;
        setActivePad(null);
        setTimeout(() => {
          if (cancelled) return;
          i++;
          playStep();
        }, 180);
      }, sequence.length > 8 ? 320 : 480);
    };
    const startTimer = setTimeout(playStep, 600);
    return () => {
      cancelled = true;
      clearTimeout(startTimer);
    };
  }, [phase, sequence]);

  function startGame() {
    const first = randomPad();
    setSequence([first]);
    setInputIndex(0);
    setRound(1);
    setStreakReached(0);
    setIsNewBest(false);
    setShowConfetti(false);
    setPhase("watching");
  }

  function tapPad(id: number) {
    if (phase !== "your-turn") return;
    setActivePad(id);
    setTimeout(() => setActivePad(null), 220);

    if (id === sequence[inputIndex]) {
      const next = inputIndex + 1;
      if (next >= sequence.length) {
        // Round complete
        const completedStreak = sequence.length;
        setStreakReached(completedStreak);
        setPhase("between");
        setTimeout(() => {
          setSequence((s) => [...s, randomPad()]);
          setRound((r) => r + 1);
          setPhase("watching");
        }, 700);
      } else {
        setInputIndex(next);
      }
    } else {
      // Wrong tap
      setStreakReached(sequence.length - 1);
      setTimeout(() => finishGame(sequence.length - 1), 500);
    }
  }

  function finishGame(streak: number) {
    if (streak > bestStreak) {
      setIsNewBest(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
      updateState((prev) => ({
        ...prev,
        [kidId]: {
          ...prev[kidId],
          gameStats: {
            ...prev[kidId].gameStats,
            echoBeat: { bestStreak: streak },
          },
        },
      }));
    }
    setPhase("done");
  }

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto"
      style={{
        background:
          "linear-gradient(180deg, #2a2440 0%, #3d3263 60%, #4d3e7a 100%)",
        color: "#f5eef7",
      }}
    >
      <Confetti active={showConfetti} count={48} seed={9} />

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
        {phase === "watching" || phase === "your-turn" || phase === "between" ? (
          <div className="flex items-center gap-2 md:gap-3">
            <div className="rounded-full bg-white/15 px-4 py-2 text-base font-bold text-white backdrop-blur shadow-sm ring-1 ring-white/20 md:text-lg">
              Round {round}
            </div>
            <div
              className="rounded-full px-4 py-2 text-base font-bold text-white shadow-sm md:text-lg"
              style={{ backgroundColor: accentColor }}
            >
              ★ Best {bestStreak}
            </div>
          </div>
        ) : null}
      </div>

      {phase === "intro" ? (
        <div className="flex min-h-full flex-col items-center justify-center px-6 py-24 text-center">
          <div className="text-7xl md:text-8xl animate-bob" aria-hidden="true">
            🎯
          </div>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">Echo Beat</h2>
          <p className="mt-3 max-w-md text-lg text-white/70 md:text-xl">
            Watch the pattern. Tap it back. How far can you echo?
          </p>
          {bestStreak > 0 ? (
            <p
              className="mt-4 rounded-full px-5 py-2 text-base font-bold md:text-lg"
              style={{
                backgroundColor: `${accentColor}40`,
                color: "#fff",
              }}
            >
              ★ Best streak: {bestStreak}
            </p>
          ) : null}
          <button
            type="button"
            onClick={startGame}
            className="mt-8 rounded-full px-10 py-4 text-xl font-bold text-white shadow-lg transition active:scale-[0.98] md:text-2xl"
            style={{ backgroundColor: accentColor }}
          >
            Start
          </button>
        </div>
      ) : null}

      {phase === "watching" || phase === "your-turn" || phase === "between" ? (
        <div className="flex min-h-full flex-col items-center justify-center px-6 py-24">
          <div className="mb-6 text-center">
            <p className="text-base font-bold uppercase tracking-[0.2em] text-white/60 md:text-lg">
              {phase === "watching" ? "Watch…" : phase === "your-turn" ? "Your turn" : "Nice!"}
            </p>
            {phase === "your-turn" ? (
              <p className="mt-1 text-sm text-white/50">
                {inputIndex} of {sequence.length}
              </p>
            ) : null}
          </div>
          <div className="grid w-full max-w-md grid-cols-2 gap-4 md:gap-6">
            {PADS.map((p) => {
              const isActive = activePad === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => tapPad(p.id)}
                  disabled={phase !== "your-turn"}
                  aria-label={`Pad ${p.name}`}
                  className={`aspect-square rounded-3xl shadow-lg transition-all duration-150 active:scale-[0.97] ${
                    isActive ? "scale-105" : ""
                  } ${phase !== "your-turn" ? "cursor-default" : ""}`}
                  style={{
                    backgroundColor: isActive ? p.glow : p.color,
                    boxShadow: isActive
                      ? `0 0 60px 10px ${p.color}, inset 0 0 40px ${p.color}`
                      : `inset 0 -8px 0 rgba(0,0,0,0.15), 0 6px 18px rgba(0,0,0,0.3)`,
                    transform: isActive ? "translateY(-4px) scale(1.04)" : undefined,
                  }}
                />
              );
            })}
          </div>
        </div>
      ) : null}

      {phase === "done" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="text-8xl animate-pop" aria-hidden="true">
            {isNewBest ? "🏆" : "🎯"}
          </div>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            {streakReached > 0 ? `You echoed ${streakReached}!` : "Great try!"}
          </h2>
          {isNewBest ? (
            <p
              className="mt-2 text-xl font-bold uppercase tracking-wide md:text-2xl"
              style={{ color: "#ffd84d" }}
            >
              ★ New best!
            </p>
          ) : streakReached > 0 ? (
            <p className="mt-2 text-base text-white/70 md:text-lg">
              Best so far: {bestStreak}
            </p>
          ) : null}

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
      ) : null}
    </div>
  );
}
