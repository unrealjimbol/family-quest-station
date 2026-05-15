"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BreathBuddy from "@/components/BreathBuddy";
import ColorSort from "@/components/ColorSort";
import EchoBeat from "@/components/EchoBeat";
import MemoryMatch from "@/components/MemoryMatch";
import {
  getCooldownRemaining,
  getPlayTimeRemaining,
  startGameSession,
  triggerCooldown,
  COOLDOWN_MINUTES,
  PLAY_LIMIT_MINUTES,
} from "@/lib/gameTimer";
import { getBalance, spendPoints } from "@/lib/points";
import type { KidId } from "@/lib/types";

const UNLOCK_COST = 10;

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
  const [timeUp, setTimeUp] = useState(false);
  const [cooldownMs, setCooldownMs] = useState(0);
  const [showUnlock, setShowUnlock] = useState(false);
  const [notEnough, setNotEnough] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check cooldown on open
  useEffect(() => {
    if (open) {
      const remaining = getCooldownRemaining(kidId);
      setCooldownMs(remaining);
      if (remaining > 0) {
        // Update cooldown display every second
        const iv = setInterval(() => {
          const r = getCooldownRemaining(kidId);
          setCooldownMs(r);
          if (r <= 0) clearInterval(iv);
        }, 1000);
        return () => clearInterval(iv);
      }
    } else {
      // Reset local state when closed
      setPicked(null);
      setTimeUp(false);
      setCooldownMs(0);
      setShowUnlock(false);
      setNotEnough(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [open, kidId]);

  // Start play-time countdown when game is picked
  const startTimer = useCallback(() => {
    startGameSession(kidId);
    // Check remaining time every second
    timerRef.current = setInterval(() => {
      const remaining = getPlayTimeRemaining(kidId);
      if (remaining <= 0) {
        triggerCooldown(kidId);
        setTimeUp(true);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }, 1000);
  }, [kidId]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function handlePick(gameId: GameId) {
    // Start timer on first game pick (not Breath Buddy — that's calming, not play)
    if (gameId !== "breath") {
      const ok = startGameSession(kidId);
      if (!ok) {
        setCooldownMs(getCooldownRemaining(kidId));
        return;
      }
      if (!timerRef.current) {
        startTimer();
      }
    }
    setPicked(gameId);
  }

  function close() {
    setPicked(null);
    setTimeUp(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    onClose();
  }

  function handleBackToPicker() {
    setPicked(null);
  }

  function handleUnlockGame() {
    const balance = getBalance(kidId);
    if (balance < UNLOCK_COST) {
      setNotEnough(true);
      setTimeout(() => setNotEnough(false), 2500);
      return;
    }
    spendPoints(kidId, "Unlock new game 🎮", UNLOCK_COST);
    setShowUnlock(true);
  }

  if (!open) return null;

  // "Go find dad" screen after spending points
  if (showUnlock) {
    return <UnlockScreen onClose={close} />;
  }

  // Time's up screen — cute and encouraging
  if (timeUp) {
    return <TimeUpScreen onClose={close} />;
  }

  // Cooldown screen — show remaining time
  if (cooldownMs > 0) {
    return <CooldownScreen remainingMs={cooldownMs} onClose={close} />;
  }

  if (picked === "memory") {
    return <MemoryMatch kidId={kidId} onClose={handleBackToPicker} accentColor={accentColor} />;
  }
  if (picked === "echo") {
    return <EchoBeat kidId={kidId} onClose={handleBackToPicker} accentColor="#6c5ce7" />;
  }
  if (picked === "color") {
    return <ColorSort kidId={kidId} onClose={handleBackToPicker} accentColor="#7fb46a" />;
  }
  if (picked === "breath") {
    return <BreathBuddy onClose={handleBackToPicker} accentColor="#b48ead" />;
  }

  // Remaining time badge
  const playRemaining = getPlayTimeRemaining(kidId);
  const hasActiveSession = playRemaining < PLAY_LIMIT_MINUTES * 60 * 1000;
  const minsLeft = Math.ceil(playRemaining / 60000);

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
          <div className="flex items-center gap-3">
            {hasActiveSession ? (
              <span className="rounded-full bg-[#fde4cf] px-3 py-1 text-xs font-bold text-[#e07a5f]">
                ⏰ {minsLeft} min left
              </span>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-soft text-xl font-bold text-ink-soft hover:bg-white"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
          {GAMES.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => handlePick(g.id)}
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

          {/* Unlock new game option */}
          <button
            type="button"
            onClick={handleUnlockGame}
            className="group relative flex items-center gap-4 rounded-3xl bg-gradient-to-br from-amber-50 to-yellow-100 p-4 text-left shadow-sm ring-1 ring-amber-200/60 transition active:scale-[0.98] md:p-5"
          >
            <span className="text-5xl md:text-6xl" aria-hidden="true">🔓</span>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-bold md:text-xl">New Game!</div>
              <div className="text-sm text-ink-soft md:text-base">
                Spend ⭐ {UNLOCK_COST} pts to unlock
              </div>
            </div>
            <span className="rounded-full bg-amber-400/20 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-300/40">
              ⭐ {UNLOCK_COST}
            </span>
            {notEnough ? (
              <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/90 backdrop-blur-sm animate-pop">
                <p className="text-base font-bold text-red-400">
                  Not enough stars! Need ⭐ {UNLOCK_COST} 😅
                </p>
              </div>
            ) : null}
          </button>
        </div>
        <p className="mt-5 text-center text-xs text-ink-soft md:text-sm">
          {PLAY_LIMIT_MINUTES} minutes of game time. Pick any. Just for fun!
        </p>
      </div>
    </div>
  );
}

/** Cute "time's up" overlay */
function TimeUpScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-b from-[#fdf6ec] to-[#fbe1ea] p-6">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="text-8xl animate-bob" aria-hidden="true">😴</div>
        <h2 className="mt-6 text-3xl font-bold md:text-4xl">
          Game time is over!
        </h2>
        <p className="mt-3 text-lg text-ink-soft md:text-xl">
          You played great! The games need a little nap now.
        </p>
        <p className="mt-2 text-base text-ink-soft">
          Come back in {COOLDOWN_MINUTES} minutes for more fun! 🌟
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#81b29a] px-8 py-4 text-lg font-bold text-white shadow-sm transition active:scale-[0.97]"
          >
            Okay, bye games! 👋
          </button>
          <p className="text-xs text-ink-soft">
            Time for quests or other adventures!
          </p>
        </div>
      </div>
    </div>
  );
}

/** Unlock screen — go find dad! */
function UnlockScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-b from-amber-50 to-[#fdf6ec] p-6">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="text-8xl animate-bob" aria-hidden="true">🎉</div>
        <h2 className="mt-6 text-3xl font-bold md:text-4xl">
          New game unlocked!
        </h2>
        <p className="mt-4 text-lg text-ink-soft md:text-xl">
          ⭐ {UNLOCK_COST} stars spent — nice save!
        </p>
        <div className="mt-6 rounded-3xl bg-white/80 px-8 py-6 ring-1 ring-black/5 shadow-sm">
          <div className="text-5xl mb-3" aria-hidden="true">👨</div>
          <p className="text-xl font-bold md:text-2xl">
            找爸爸去做一个新的！
          </p>
          <p className="mt-2 text-base text-ink-soft md:text-lg">
            Go find Dad to set up a new game for you!
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 rounded-full bg-amber-400 px-8 py-4 text-lg font-bold text-white shadow-sm transition active:scale-[0.97]"
        >
          Okay! Going now! 🏃
        </button>
      </div>
    </div>
  );
}

/** Cooldown screen — kid can't play yet */
function CooldownScreen({
  remainingMs,
  onClose,
}: {
  remainingMs: number;
  onClose: () => void;
}) {
  const mins = Math.floor(remainingMs / 60000);
  const secs = Math.floor((remainingMs % 60000) / 1000);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-b from-[#fdf6ec] to-[#e6e0f0] p-6">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="text-8xl animate-bob" aria-hidden="true">💤</div>
        <h2 className="mt-6 text-3xl font-bold md:text-4xl">
          Games are resting!
        </h2>
        <p className="mt-3 text-lg text-ink-soft md:text-xl">
          They&apos;ll wake up soon. Not too long!
        </p>
        <div className="mt-6 rounded-2xl bg-white/80 px-8 py-4 ring-1 ring-black/5">
          <div className="text-4xl font-bold tabular-nums text-[#6c5ce7]">
            {mins}:{String(secs).padStart(2, "0")}
          </div>
          <div className="mt-1 text-xs font-medium text-ink-soft">until games wake up</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 rounded-full bg-white px-8 py-3 text-base font-bold text-ink shadow-sm ring-1 ring-black/10 transition active:scale-[0.97]"
        >
          Got it! Back to quests 🚀
        </button>
      </div>
    </div>
  );
}
