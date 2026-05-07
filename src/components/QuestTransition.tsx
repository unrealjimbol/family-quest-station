"use client";

import { useEffect, useMemo } from "react";
import { pickTransitionPhrase } from "@/data/vibePrompts";
import type { VibeKey } from "@/lib/types";

type Props = {
  kidEmoji: string;
  vibeEmoji?: string;
  vibeKey?: VibeKey;
  accentColor: string;
  onDone: () => void;
};

const DURATION_MS = 1400;

export default function QuestTransition({
  kidEmoji,
  vibeEmoji,
  vibeKey,
  accentColor,
  onDone,
}: Props) {
  const phrase = useMemo(() => {
    const seed = new Date().getMinutes() * 60 + new Date().getSeconds();
    return pickTransitionPhrase(vibeKey, seed);
  }, [vibeKey]);

  useEffect(() => {
    const t = setTimeout(onDone, DURATION_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(120% 100% at 50% 50%, ${accentColor}40 0%, ${accentColor}18 40%, #fdf6ec 80%)`,
        animation: "transition-shell 1400ms ease-in-out forwards",
      }}
    >
      <div className="relative">
        <div
          className="text-9xl md:text-[10rem]"
          style={{ animation: "transition-leap 1100ms cubic-bezier(0.2, 0.8, 0.2, 1.1) forwards" }}
        >
          {kidEmoji}
        </div>
        {vibeEmoji ? (
          <div
            className="absolute -right-6 -top-2 text-5xl md:-right-8 md:text-6xl"
            style={{ animation: "transition-spark 1100ms ease-out forwards" }}
          >
            {vibeEmoji}
          </div>
        ) : null}
      </div>
      <div
        className="mt-6 text-3xl font-bold uppercase tracking-wide md:text-5xl"
        style={{
          color: accentColor,
          animation: "transition-text 900ms 250ms cubic-bezier(0.2, 0.8, 0.2, 1.2) both",
        }}
      >
        {phrase}
      </div>
      <style>{`
        @keyframes transition-shell {
          0%   { opacity: 0; }
          15%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes transition-leap {
          0%   { transform: translateY(40px) scale(0.6) rotate(-8deg); opacity: 0; }
          40%  { transform: translateY(-10px) scale(1.15) rotate(4deg); opacity: 1; }
          70%  { transform: translateY(0) scale(1) rotate(0deg); }
          100% { transform: translateY(-6px) scale(1.05) rotate(0deg); }
        }
        @keyframes transition-spark {
          0%   { transform: scale(0) rotate(-30deg); opacity: 0; }
          50%  { transform: scale(1.2) rotate(20deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes transition-text {
          0%   { transform: translateY(20px); opacity: 0; }
          60%  { transform: translateY(-2px); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
