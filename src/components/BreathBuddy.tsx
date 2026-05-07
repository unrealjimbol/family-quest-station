"use client";

import { useEffect, useState } from "react";

const TARGET_BREATHS = 5;
const PHASE_MS = 4000; // 4s in, 4s out → 8s per breath, 40s total

type Phase = "intro" | "playing" | "done";
type BreathPhase = "in" | "out";

type Props = {
  onClose: () => void;
  accentColor?: string;
};

export default function BreathBuddy({ onClose, accentColor = "#b48ead" }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [breathCount, setBreathCount] = useState(0);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>("in");

  // Breathing cycle while playing
  useEffect(() => {
    if (phase !== "playing") return;
    let count = 0;
    let isIn = true;

    const interval = setInterval(() => {
      if (isIn) {
        // Just finished an in-breath, switch to out
        setBreathPhase("out");
        isIn = false;
      } else {
        // Just finished an out-breath, that's one full breath
        count += 1;
        setBreathCount(count);
        if (count >= TARGET_BREATHS) {
          clearInterval(interval);
          setPhase("done");
          return;
        }
        setBreathPhase("in");
        isIn = true;
      }
    }, PHASE_MS);

    return () => clearInterval(interval);
  }, [phase]);

  function startGame() {
    setBreathPhase("in");
    setBreathCount(0);
    setPhase("playing");
  }

  return (
    <div
      className="fixed inset-0 z-[60] overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #efe7d8 0%, #e6e0f0 60%, #d8d0e8 100%)",
      }}
    >
      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-5 py-4 md:px-8 md:py-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close game"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-2xl font-bold text-ink-soft shadow-sm ring-1 ring-black/5 hover:bg-white"
        >
          ✕
        </button>
        {phase === "playing" ? (
          <div
            className="rounded-full bg-white/80 px-4 py-2 text-base font-bold shadow-sm ring-1 ring-black/5 md:text-lg"
            aria-live="polite"
          >
            🌬 {breathCount} of {TARGET_BREATHS}
          </div>
        ) : null}
      </div>

      {/* Intro */}
      {phase === "intro" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div
            className="flex h-40 w-40 items-center justify-center rounded-full text-7xl shadow-lg md:h-52 md:w-52 md:text-8xl"
            style={{
              backgroundImage: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${accentColor}80 60%, ${accentColor} 100%)`,
              animation: "float 3s ease-in-out infinite",
            }}
            aria-hidden="true"
          >
            😌
          </div>
          <h2 className="mt-6 text-4xl font-bold md:text-5xl">Breath Buddy</h2>
          <p className="mt-3 max-w-md text-lg text-ink-soft md:text-xl">
            Five slow breaths together. Watch buddy grow and shrink.
          </p>
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

      {/* Playing */}
      {phase === "playing" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="relative flex h-72 w-72 items-center justify-center md:h-96 md:w-96">
            {/* Soft glow ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)`,
                animation: `breath-${breathPhase} ${PHASE_MS}ms ease-in-out forwards`,
              }}
              aria-hidden="true"
            />
            {/* Buddy */}
            <div
              className="flex h-48 w-48 items-center justify-center rounded-full text-7xl shadow-xl md:h-64 md:w-64 md:text-8xl"
              style={{
                backgroundImage: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${accentColor}80 60%, ${accentColor} 100%)`,
                animation: `breath-${breathPhase} ${PHASE_MS}ms ease-in-out forwards`,
                transform: breathPhase === "in" ? "scale(1)" : "scale(0.55)",
              }}
              aria-hidden="true"
            >
              😌
            </div>
          </div>
          <p
            key={breathPhase}
            className="mt-10 text-3xl font-bold uppercase tracking-wide animate-burst md:text-4xl"
            style={{ color: accentColor }}
          >
            {breathPhase === "in" ? "Breathe in…" : "And out…"}
          </p>
          <p className="mt-3 text-base text-ink-soft md:text-lg">
            Match buddy. No rush.
          </p>
        </div>
      ) : null}

      {/* Done */}
      {phase === "done" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div
            className="flex h-40 w-40 items-center justify-center rounded-full text-7xl shadow-lg animate-pop md:h-52 md:w-52 md:text-8xl"
            style={{
              backgroundImage: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${accentColor}80 60%, ${accentColor} 100%)`,
            }}
            aria-hidden="true"
          >
            🌿
          </div>
          <h2 className="mt-6 text-4xl font-bold md:text-5xl">All five done.</h2>
          <p className="mt-3 max-w-md text-lg text-ink-soft md:text-xl">
            Feel a little softer? Buddy thinks so. 💜
          </p>
          <div className="mt-8 flex flex-col gap-3 md:flex-row md:gap-4">
            <button
              type="button"
              onClick={startGame}
              className="rounded-full bg-white px-8 py-4 text-lg font-bold text-ink shadow-sm ring-1 ring-black/10 hover:bg-bg-soft md:text-xl"
            >
              Again
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
