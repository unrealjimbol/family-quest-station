"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  pickGreeting,
  pickPromptForToday,
  pickResponse,
  type VibeOption,
} from "@/data/vibePrompts";
import { playTick, playChime } from "@/lib/sounds";
import { todayStr } from "@/lib/storage";
import { updateState } from "@/lib/store";
import type { KidId } from "@/lib/types";

const TAP_TARGET = 10;

type Phase = "question" | "powerup" | "done";

type Props = {
  kidId: KidId;
  kidEmoji: string;
  onContinue: () => void;
  accentColor: string;
};

export default function VibeCheck({
  kidId,
  kidEmoji,
  onContinue,
  accentColor,
}: Props) {
  const prompt = useMemo(() => pickPromptForToday(kidId), [kidId]);
  const greeting = useMemo(() => {
    const seed = new Date().getDate() + (kidId === "elio" ? 0 : 3);
    return pickGreeting(kidId, seed);
  }, [kidId]);

  const [picked, setPicked] = useState<VibeOption | null>(null);
  const [phase, setPhase] = useState<Phase>("question");
  const [taps, setTaps] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const particleId = useRef(0);

  const response = useMemo(() => {
    if (!picked) return null;
    const seed = new Date().getMinutes() + new Date().getSeconds();
    return pickResponse(kidId, picked.vibe, seed);
  }, [picked, kidId]);

  function pick(option: VibeOption) {
    if (picked) return;
    setPicked(option);
    updateState((prev) => ({
      ...prev,
      [kidId]: {
        ...prev[kidId],
        today: {
          ...prev[kidId].today,
          date: todayStr(),
          vibe: {
            key: option.vibe,
            emoji: option.emoji,
            label: option.label,
            promptId: prompt.id,
            pickedAt: Date.now(),
          },
        },
      },
    }));
    setPhase("powerup");
  }

  const sparkles = ["✨", "⭐", "💥", "🔥", "⚡", "💫", "🌟", "🎯"];

  const handleTap = useCallback(() => {
    if (phase !== "powerup") return;
    const next = taps + 1;
    setTaps(next);
    playTick();

    const newParticles = Array.from({ length: 2 + Math.floor(Math.random() * 2) }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 80;
      return {
        id: ++particleId.current,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        emoji: sparkles[Math.floor(Math.random() * sparkles.length)],
      };
    });
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 600);

    if (next >= TAP_TARGET) {
      playChime();
      setTimeout(() => setPhase("done"), 400);
    }
  }, [phase, taps, sparkles]);

  const progress = Math.min(taps / TAP_TARGET, 1);
  const circumference = 2 * Math.PI * 58;
  const strokeDashoffset = circumference * (1 - progress);
  const scale = 1 + (taps / TAP_TARGET) * 0.5;

  const encourageText = taps === 0
    ? "TAP TAP TAP! 👆"
    : taps < TAP_TARGET * 0.5
      ? "Keep going!! 🔥"
      : taps < TAP_TARGET
        ? "Almost there!! ⚡"
        : "POWERED UP! 💥";

  return (
    <div className="min-h-screen w-full px-5 py-6 md:px-10 md:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-6 flex items-center justify-between md:mb-8">
          <Link
            href="/"
            className="flex h-11 items-center rounded-full bg-white px-3.5 text-sm font-semibold text-ink shadow-sm ring-1 ring-black/5 md:h-12 md:px-4 md:text-base"
          >
            ← Home
          </Link>
          {phase === "question" ? (
            <button
              type="button"
              onClick={onContinue}
              className="rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-ink-soft ring-1 ring-black/5 hover:bg-white md:px-4 md:py-2 md:text-sm"
            >
              Skip →
            </button>
          ) : null}
        </header>

        {/* Phase 1: This or That question */}
        {phase === "question" ? (
          <div className="flex flex-col items-center">
            <div className="text-center">
              <div
                className="mx-auto text-6xl animate-bob md:text-8xl"
                aria-hidden="true"
              >
                {kidEmoji}
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-ink-soft md:mt-4 md:text-sm">
                This or that?
              </p>
              <h1 className="mt-1 text-2xl font-bold leading-tight md:mt-2 md:text-4xl">
                {greeting}
              </h1>
              <h2 className="mt-2 text-xl font-semibold leading-snug md:mt-3 md:text-3xl">
                {prompt.question}
              </h2>
            </div>

            {/* Two big side-by-side cards */}
            <div className="mt-8 grid w-full grid-cols-2 gap-4 md:mt-10 md:gap-6">
              {prompt.options.map((opt, i) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => pick(opt)}
                  className="group flex flex-col items-center gap-3 rounded-3xl bg-white px-4 py-8 text-center shadow-sm ring-1 ring-black/5 transition active:scale-[0.95] hover:shadow-md md:gap-4 md:px-6 md:py-12"
                >
                  <span className="text-5xl transition-transform group-hover:scale-110 md:text-7xl" aria-hidden="true">
                    {opt.emoji}
                  </span>
                  <span className="text-base font-bold leading-tight md:text-xl">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-ink-soft md:text-sm">
              {prompt.hint ?? "Pick one — no wrong answers!"}
            </p>
          </div>
        ) : null}

        {/* Phase 2: Power-up tap game */}
        {phase === "powerup" && picked ? (
          <div className="flex flex-col items-center pt-8 text-center md:pt-16">
            <p className="text-sm uppercase tracking-[0.2em] text-ink-soft md:text-base">
              Power up your choice!
            </p>
            <p className="mt-1 text-lg font-bold md:text-2xl">
              {picked.label}
            </p>

            <div className="relative mt-8 flex items-center justify-center" style={{ width: 180, height: 180 }}>
              <svg className="absolute inset-0" width="180" height="180" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="6" />
                <circle
                  cx="70" cy="70" r="58" fill="none"
                  stroke={accentColor} strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 70 70)" className="transition-all duration-150"
                />
              </svg>

              <button
                type="button"
                onClick={handleTap}
                className="relative z-10 flex items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-100 active:scale-90"
                style={{
                  width: 120, height: 120,
                  transform: `scale(${scale})`,
                  boxShadow: `0 0 ${taps * 3}px ${accentColor}40, inset 0 0 0 2px ${accentColor}30`,
                }}
                aria-label="Tap to power up"
              >
                <span className="text-5xl md:text-6xl" aria-hidden="true">{picked.emoji}</span>
              </button>

              {particles.map((p) => (
                <span
                  key={p.id}
                  className="pointer-events-none absolute text-xl md:text-2xl"
                  style={{
                    left: "50%", top: "50%",
                    animation: "particle-fly 600ms ease-out forwards",
                    ["--px" as string]: `${p.x}px`,
                    ["--py" as string]: `${p.y}px`,
                  }}
                  aria-hidden="true"
                >
                  {p.emoji}
                </span>
              ))}
            </div>

            <p className="mt-6 text-xl font-bold md:text-2xl">{encourageText}</p>

            <div className="mt-3 flex items-center gap-1">
              {Array.from({ length: TAP_TARGET }, (_, i) => (
                <span
                  key={i}
                  className="block h-2.5 w-2.5 rounded-full transition-all duration-150 md:h-3 md:w-3"
                  style={{
                    backgroundColor: i < taps ? accentColor : "rgba(0,0,0,0.1)",
                    transform: i < taps ? "scale(1.2)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* Phase 3: Done */}
        {phase === "done" && picked && response ? (
          <div className="flex flex-col items-center pt-4 text-center md:pt-8">
            <div className="text-7xl animate-burst md:text-8xl" aria-hidden="true">
              {picked.emoji}
            </div>
            <div className="mt-4 inline-flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 ring-1 ring-black/5 md:px-5 md:py-2.5">
              <span className="text-2xl md:text-3xl" aria-hidden="true">{kidEmoji}</span>
              <span className="text-sm font-semibold md:text-base">{picked.label}</span>
            </div>

            <p
              className="mt-6 max-w-xl text-2xl font-bold leading-snug md:text-3xl"
              style={{ animation: "fadeInSoft 500ms ease-out" }}
            >
              {response}
            </p>

            <button
              type="button"
              onClick={onContinue}
              className="mt-8 w-full rounded-full px-8 py-4 text-lg font-bold text-white shadow-sm transition active:scale-[0.98] md:w-auto md:px-12 md:text-xl"
              style={{ backgroundColor: accentColor, animation: "fadeInSoft 600ms ease-out 200ms both" }}
            >
              Let&apos;s go! →
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
