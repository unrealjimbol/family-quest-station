"use client";

import { useState } from "react";
import BreathBuddy from "@/components/BreathBuddy";
import ColorSort from "@/components/ColorSort";
import EchoBeat from "@/components/EchoBeat";
import MemoryMatch from "@/components/MemoryMatch";
import type { KidId } from "@/lib/types";

type GameId = "memory" | "echo" | "color" | "breath";

const GAMES: Array<{
  id: GameId;
  emoji: string;
  name: string;
  desc: string;
  bg: string;
}> = [
  {
    id: "memory",
    emoji: "🃏",
    name: "Memory Match",
    desc: "Flip cards, find pairs · 3 levels",
    bg: "bg-[#fde4cf]",
  },
  {
    id: "echo",
    emoji: "🎯",
    name: "Echo Beat",
    desc: "Watch & repeat · how far can you go?",
    bg: "bg-[#e6e0f0]",
  },
  {
    id: "color",
    emoji: "🧪",
    name: "Color Sort",
    desc: "Sort tubes by color · 5 levels",
    bg: "bg-[#e1ecd4]",
  },
  {
    id: "breath",
    emoji: "🌬",
    name: "Breath Buddy",
    desc: "Five slow breaths together",
    bg: "bg-[#e7e0d3]",
  },
];

type Props = {
  open: boolean;
  onClose: () => void;
  kidId: KidId;
  accentColor?: string;
};

export default function GameSession({
  open,
  onClose,
  kidId,
  accentColor = "#e07a5f",
}: Props) {
  const [picked, setPicked] = useState<GameId | null>(null);

  if (!open) return null;

  function close() {
    setPicked(null);
    onClose();
  }

  if (picked === "memory") {
    return <MemoryMatch kidId={kidId} onClose={close} accentColor={accentColor} />;
  }
  if (picked === "echo") {
    return <EchoBeat kidId={kidId} onClose={close} accentColor="#6c5ce7" />;
  }
  if (picked === "color") {
    return <ColorSort kidId={kidId} onClose={close} accentColor="#7fb46a" />;
  }
  if (picked === "breath") {
    return <BreathBuddy onClose={close} accentColor="#b48ead" />;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-black/35 p-4 md:items-center md:p-8"
      onClick={onClose}
      role="dialog"
      aria-label="Pick a game"
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">A little break</p>
            <h2 className="mt-1 text-2xl font-bold md:text-3xl">Pick a game</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-soft text-xl font-bold text-ink-soft hover:bg-white"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
          {GAMES.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setPicked(g.id)}
              className={`flex items-center gap-4 rounded-3xl ${g.bg} p-4 text-left shadow-sm ring-1 ring-black/5 transition active:scale-[0.98] md:p-5`}
            >
              <span className="text-5xl md:text-6xl" aria-hidden="true">
                {g.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-lg font-bold md:text-xl">{g.name}</div>
                <div className="text-sm text-ink-soft md:text-base">{g.desc}</div>
              </div>
            </button>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-ink-soft md:text-sm">
          Pick any. Skip any. Just for fun.
        </p>
      </div>
    </div>
  );
}
