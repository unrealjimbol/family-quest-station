"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppState } from "@/lib/store";
import type { KidId } from "@/lib/types";

const INHALE_MS = 5000;
const EXHALE_MS = 6000;
const PAUSE_MS = 1500;
const TOTAL_BREATHS = 3;

const INHALE_PROMPTS = [
  "Breathe in… like smelling a flower 🌸",
  "Breathe in… slow and gentle 🌿",
  "One more… fill up like a balloon 🎈",
];

const EXHALE_PROMPTS = [
  "Breathe out… blow a dandelion 🌬️",
  "Breathe out… soft like a cloud ☁️",
  "Let it all go… nice and easy 💫",
];

type Phase = "intro" | "inhale" | "exhale" | "pause" | "done";

type Props = {
  kidId: KidId;
  kidName: string;
  kidEmoji: string;
  onClose: () => void;
};

export default function SleepCeremony({ kidId, kidName, kidEmoji, onClose }: Props) {
  const state = useAppState();
  const kid = state[kidId];
  const todayDone = kid.today.completedQuestIds.length;

  const [phase, setPhase] = useState<Phase>("intro");
  const [breathIndex, setBreathIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);

  const startBreathing = useCallback(() => {
    setPhase("inhale");
    setBreathIndex(0);
  }, []);

  useEffect(() => {
    if (phase === "intro" || phase === "done") return;

    let timer: ReturnType<typeof setTimeout>;

    if (phase === "inhale") {
      timer = setTimeout(() => setPhase("exhale"), INHALE_MS);
    } else if (phase === "exhale") {
      timer = setTimeout(() => {
        if (breathIndex < TOTAL_BREATHS - 1) {
          setPhase("pause");
        } else {
          // Fade out before done
          setOpacity(0);
          timer = setTimeout(() => setPhase("done"), 1200);
        }
      }, EXHALE_MS);
    } else if (phase === "pause") {
      timer = setTimeout(() => {
        setBreathIndex((i) => i + 1);
        setPhase("inhale");
      }, PAUSE_MS);
    }

    return () => clearTimeout(timer);
  }, [phase, breathIndex]);

  const prompt =
    phase === "inhale"
      ? INHALE_PROMPTS[breathIndex] ?? INHALE_PROMPTS[0]
      : phase === "exhale"
        ? EXHALE_PROMPTS[breathIndex] ?? EXHALE_PROMPTS[0]
        : phase === "pause"
          ? "…"
          : "";

  // Moon scale based on phase
  const moonScale =
    phase === "inhale" ? 1.35 : phase === "exhale" ? 0.9 : 1.0;
  const moonDuration =
    phase === "inhale"
      ? `${INHALE_MS}ms`
      : phase === "exhale"
        ? `${EXHALE_MS}ms`
        : "800ms";

  if (phase === "done") {
    return (
      <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden bg-[#1a1040]">
        {/* Stars */}
        <Stars />

        <div className="animate-pop text-center px-6">
          <div className="text-7xl md:text-8xl mb-4">{kidEmoji}</div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Good night, {kidName}
          </h2>
          <p className="mt-3 text-lg text-white/70 md:text-xl">
            You finished <span className="font-bold text-amber-300">{todayDone}</span> quests today
          </p>
          <p className="mt-1 text-base text-white/50 md:text-lg">
            Tomorrow is a brand new adventure ✨
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-10 rounded-full bg-white/15 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm ring-1 ring-white/20 transition active:scale-[0.97] md:text-xl"
          >
            Sleep tight 🌙
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden bg-[#1a1040] transition-opacity duration-1000"
      style={{ opacity }}
    >
      {/* Stars background */}
      <Stars />

      {/* Intro screen */}
      {phase === "intro" ? (
        <div className="animate-pop text-center px-6">
          <div className="text-7xl md:text-8xl mb-2 animate-gentle-bob">🌙</div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Time to wind down
          </h2>
          <p className="mt-3 max-w-sm text-lg text-white/70 md:text-xl">
            All done for today! Let&apos;s take {TOTAL_BREATHS} slow breaths together.
          </p>
          <button
            type="button"
            onClick={startBreathing}
            className="mt-8 rounded-full bg-indigo-500/60 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/20 backdrop-blur-sm transition active:scale-[0.97] md:text-xl"
          >
            I&apos;m ready 💜
          </button>
        </div>
      ) : null}

      {/* Breathing phase */}
      {phase !== "intro" ? (
        <div className="flex flex-col items-center gap-8">
          {/* Breath counter */}
          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_BREATHS }).map((_, i) => (
              <div
                key={i}
                className="h-2.5 w-2.5 rounded-full transition-all duration-500 md:h-3 md:w-3"
                style={{
                  backgroundColor:
                    i <= breathIndex ? "rgba(199,171,255,0.9)" : "rgba(255,255,255,0.2)",
                  transform: i === breathIndex ? "scale(1.4)" : "scale(1)",
                }}
              />
            ))}
          </div>

          {/* Moon orb */}
          <div
            className="relative flex items-center justify-center"
            style={{
              width: "180px",
              height: "180px",
            }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(199,171,255,0.3) 0%, transparent 70%)",
                transform: `scale(${moonScale * 1.5})`,
                transition: `transform ${moonDuration} cubic-bezier(0.4, 0, 0.2, 1)`,
              }}
            />
            {/* Moon face */}
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: "140px",
                height: "140px",
                background:
                  "radial-gradient(circle at 35% 35%, #ffe9a0 0%, #ffd56b 50%, #e8b84b 100%)",
                boxShadow: "0 0 40px rgba(255,213,107,0.4), inset 0 -4px 12px rgba(0,0,0,0.1)",
                transform: `scale(${moonScale})`,
                transition: `transform ${moonDuration} cubic-bezier(0.4, 0, 0.2, 1)`,
              }}
            >
              <span className="text-5xl md:text-6xl select-none">
                {phase === "inhale" ? "😌" : phase === "exhale" ? "😊" : "🌝"}
              </span>
            </div>
          </div>

          {/* Prompt text */}
          <p
            className="max-w-xs text-center text-xl font-medium text-white/90 md:text-2xl"
            style={{
              animation: "fadeInSoft 0.6s ease-out",
            }}
            key={`${phase}-${breathIndex}`}
          >
            {prompt}
          </p>

          {/* Phase label */}
          <div className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/50 backdrop-blur-sm">
            {phase === "inhale"
              ? "Breathing in…"
              : phase === "exhale"
                ? "Breathing out…"
                : "Rest…"}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Stars() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: `${1 + (i % 3)}px`,
            height: `${1 + (i % 3)}px`,
            left: `${(i * 37 + 13) % 100}%`,
            top: `${(i * 23 + 7) % 100}%`,
            opacity: 0.2 + (i % 5) * 0.12,
            animation: `twinkle ${2 + (i % 3)}s ease-in-out ${(i % 7) * 0.4}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}
