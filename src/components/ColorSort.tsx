"use client";

import { useState } from "react";
import Confetti from "@/components/Confetti";
import { updateState, useAppState } from "@/lib/store";
import type { KidId } from "@/lib/types";

const TUBE_CAPACITY = 4;

const PALETTE = [
  "#e07a5f",
  "#5077e6",
  "#f0c83c",
  "#7fb46a",
  "#b48ead",
  "#f4a261",
  "#6c5ce7",
  "#2a9d8f",
];

type LevelConfig = { colors: number; empty: number };
const LEVELS: LevelConfig[] = [
  { colors: 2, empty: 1 }, // 1 — gentle intro
  { colors: 3, empty: 2 }, // 2
  { colors: 4, empty: 2 }, // 3
  { colors: 5, empty: 2 }, // 4
  { colors: 6, empty: 2 }, // 5 — biggest
];
const TOTAL_LEVELS = LEVELS.length;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateLevel(level: number): number[][] {
  const cfg = LEVELS[level - 1];
  for (let attempt = 0; attempt < 30; attempt++) {
    const items: number[] = [];
    for (let c = 0; c < cfg.colors; c++) {
      for (let i = 0; i < TUBE_CAPACITY; i++) items.push(c);
    }
    const shuffled = shuffle(items);
    const tubes: number[][] = [];
    for (let i = 0; i < cfg.colors; i++) {
      tubes.push(shuffled.slice(i * TUBE_CAPACITY, (i + 1) * TUBE_CAPACITY));
    }
    for (let i = 0; i < cfg.empty; i++) tubes.push([]);
    // Reject trivial starts where any tube is already mono-color
    const trivial = tubes.some(
      (t) => t.length === TUBE_CAPACITY && t.every((c) => c === t[0]),
    );
    if (!trivial) return tubes;
  }
  // Fallback
  const items: number[] = [];
  for (let c = 0; c < cfg.colors; c++) {
    for (let i = 0; i < TUBE_CAPACITY; i++) items.push(c);
  }
  const shuffled = shuffle(items);
  const tubes: number[][] = [];
  for (let i = 0; i < cfg.colors; i++) {
    tubes.push(shuffled.slice(i * TUBE_CAPACITY, (i + 1) * TUBE_CAPACITY));
  }
  for (let i = 0; i < cfg.empty; i++) tubes.push([]);
  return tubes;
}

function isWon(tubes: number[][]): boolean {
  return tubes.every(
    (t) =>
      t.length === 0 ||
      (t.length === TUBE_CAPACITY && t.every((c) => c === t[0])),
  );
}

function canPour(from: number[], to: number[]): boolean {
  if (from.length === 0) return false;
  if (to.length >= TUBE_CAPACITY) return false;
  if (to.length === 0) return true;
  return from[from.length - 1] === to[to.length - 1];
}

function pourTubes(
  from: number[],
  to: number[],
): { from: number[]; to: number[] } {
  if (!canPour(from, to)) return { from, to };
  const top = from[from.length - 1];
  let count = 0;
  for (let i = from.length - 1; i >= 0 && from[i] === top; i--) count++;
  const space = TUBE_CAPACITY - to.length;
  const transfer = Math.min(count, space);
  return {
    from: from.slice(0, from.length - transfer),
    to: [...to, ...new Array(transfer).fill(top)],
  };
}

type Phase = "intro" | "playing" | "won";

type Props = {
  kidId: KidId;
  onClose: () => void;
  accentColor?: string;
};

export default function ColorSort({
  kidId,
  onClose,
  accentColor = "#7fb46a",
}: Props) {
  const state = useAppState();
  const stats = state[kidId].gameStats?.colorSort ?? { completedLevels: [] };

  const [phase, setPhase] = useState<Phase>("intro");
  const [level, setLevel] = useState(1);
  const [tubes, setTubes] = useState<number[][]>([]);
  const [initialTubes, setInitialTubes] = useState<number[][]>([]);
  const [history, setHistory] = useState<number[][][]>([]);
  const [moves, setMoves] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [poured, setPoured] = useState<number[]>([]);
  const [shaking, setShaking] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);

  function startLevel(lv: number) {
    const fresh = generateLevel(lv);
    setLevel(lv);
    setTubes(fresh);
    setInitialTubes(fresh);
    setHistory([]);
    setMoves(0);
    setSelected(null);
    setPoured([]);
    setShaking([]);
    setShowConfetti(false);
    setIsNewBest(false);
    setPhase("playing");
  }

  function tapTube(idx: number) {
    if (phase !== "playing") return;
    if (selected === null) {
      if (tubes[idx].length === 0) return;
      setSelected(idx);
      return;
    }
    if (selected === idx) {
      setSelected(null);
      return;
    }
    if (!canPour(tubes[selected], tubes[idx])) {
      setShaking([selected, idx]);
      setTimeout(() => setShaking([]), 350);
      setSelected(null);
      return;
    }
    const result = pourTubes(tubes[selected], tubes[idx]);
    const newTubes = [...tubes];
    const fromIdx = selected;
    newTubes[fromIdx] = result.from;
    newTubes[idx] = result.to;
    setHistory((h) => [...h, tubes]);
    setTubes(newTubes);
    const nextMoves = moves + 1;
    setMoves(nextMoves);
    setSelected(null);
    setPoured([fromIdx, idx]);
    setTimeout(() => setPoured([]), 400);

    if (isWon(newTubes)) {
      setTimeout(() => finishLevel(nextMoves), 500);
    }
  }

  function finishLevel(finalMoves: number) {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);

    const curBest = stats.bestMoves?.[level];
    const isBetter = !curBest || finalMoves < curBest;
    const wasCompleted = stats.completedLevels.includes(level);

    if (isBetter || !wasCompleted) {
      if (isBetter && wasCompleted) setIsNewBest(true);
      updateState((prev) => {
        const cs = prev[kidId].gameStats?.colorSort ?? { completedLevels: [] };
        const newCompleted = cs.completedLevels.includes(level)
          ? cs.completedLevels
          : [...cs.completedLevels, level].sort((a, b) => a - b);
        const newBest = isBetter ? finalMoves : cs.bestMoves?.[level] ?? finalMoves;
        return {
          ...prev,
          [kidId]: {
            ...prev[kidId],
            gameStats: {
              ...prev[kidId].gameStats,
              colorSort: {
                completedLevels: newCompleted,
                bestMoves: { ...cs.bestMoves, [level]: newBest },
              },
            },
          },
        };
      });
    }
    setPhase("won");
  }

  function undo() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setTubes(prev);
    setHistory((h) => h.slice(0, -1));
    setMoves((m) => Math.max(0, m - 1));
    setSelected(null);
  }

  function restart() {
    setTubes(initialTubes);
    setHistory([]);
    setMoves(0);
    setSelected(null);
    setPoured([]);
  }

  function nextLevel() {
    if (level < TOTAL_LEVELS) {
      startLevel(level + 1);
    } else {
      setPhase("intro");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto"
      style={{
        background:
          "linear-gradient(180deg, #fdf6ec 0%, #e8efe1 100%)",
      }}
    >
      <Confetti active={showConfetti} count={48} seed={5} />

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
          <div className="flex items-center gap-2 md:gap-3">
            <div className="rounded-full bg-white/80 px-4 py-2 text-base font-bold shadow-sm ring-1 ring-black/5 md:text-lg">
              Level {level}
            </div>
            <div
              className="rounded-full px-4 py-2 text-base font-bold text-white shadow-sm md:text-lg"
              style={{ backgroundColor: accentColor }}
            >
              {moves} moves
            </div>
          </div>
        ) : null}
      </div>

      {phase === "intro" ? (
        <div className="flex min-h-full flex-col items-center justify-center px-6 py-24 text-center">
          <div className="text-7xl md:text-8xl animate-bob" aria-hidden="true">
            🧪
          </div>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">Color Sort</h2>
          <p className="mt-3 max-w-md text-lg text-ink-soft md:text-xl">
            Pour colors so each tube holds just one. Same-color or empty target only.
          </p>

          <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5 md:gap-4">
            {LEVELS.map((_, i) => {
              const lv = i + 1;
              const done = stats.completedLevels.includes(lv);
              const best = stats.bestMoves?.[lv];
              return (
                <button
                  key={lv}
                  type="button"
                  onClick={() => startLevel(lv)}
                  className={`flex flex-col items-center gap-2 rounded-3xl bg-white p-4 text-center shadow-sm ring-1 ring-black/10 transition active:scale-[0.98] md:p-5 ${
                    done ? "ring-2" : ""
                  }`}
                  style={done ? { boxShadow: `0 0 0 2px ${accentColor}` } : undefined}
                >
                  <span className="text-xl font-bold md:text-2xl">Level {lv}</span>
                  <span className="text-xs text-ink-soft md:text-sm">
                    {LEVELS[i].colors} colors
                  </span>
                  {done ? (
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      ★ Best {best ?? "—"}
                    </span>
                  ) : (
                    <span className="text-xs text-ink-soft">Not yet</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {phase === "playing" ? (
        <div className="flex min-h-full flex-col items-center justify-start px-4 pt-24 pb-32 md:px-8">
          {/* Tubes */}
          <div className="flex max-w-3xl flex-wrap justify-center gap-3 md:gap-5">
            {tubes.map((t, i) => (
              <Tube
                key={i}
                colors={t}
                selected={selected === i}
                shake={shaking.includes(i)}
                pulse={poured.includes(i)}
                onClick={() => tapTube(i)}
              />
            ))}
          </div>

          {/* Bottom controls */}
          <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center gap-3 bg-gradient-to-t from-[#fdf6ec] to-transparent px-6 py-5 md:gap-4">
            <button
              type="button"
              onClick={undo}
              disabled={history.length === 0}
              className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-ink shadow-sm ring-1 ring-black/10 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 md:text-base"
            >
              ↶ Undo
            </button>
            <button
              type="button"
              onClick={restart}
              className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-ink shadow-sm ring-1 ring-black/10 transition active:scale-[0.98] md:text-base"
            >
              ↻ Restart
            </button>
          </div>
        </div>
      ) : null}

      {phase === "won" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="text-8xl animate-pop" aria-hidden="true">
            🎉
          </div>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Level {level} solved!
          </h2>
          {isNewBest ? (
            <p
              className="mt-2 text-xl font-bold uppercase tracking-wide md:text-2xl"
              style={{ color: accentColor }}
            >
              ★ New best!
            </p>
          ) : null}
          <p className="mt-3 text-xl text-ink-soft md:text-2xl">
            <span className="font-bold text-ink">{moves}</span> moves
          </p>
          <div className="mt-8 flex flex-col gap-3 md:flex-row md:gap-4">
            <button
              type="button"
              onClick={() => startLevel(level)}
              className="rounded-full bg-white px-8 py-4 text-lg font-bold text-ink shadow-sm ring-1 ring-black/10 hover:bg-bg-soft md:text-xl"
            >
              Play again
            </button>
            {level < TOTAL_LEVELS ? (
              <button
                type="button"
                onClick={nextLevel}
                className="rounded-full px-8 py-4 text-lg font-bold text-white shadow-sm md:text-xl"
                style={{ backgroundColor: accentColor }}
              >
                Next level →
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-8 py-4 text-lg font-bold text-white shadow-sm md:text-xl"
                style={{ backgroundColor: accentColor }}
              >
                Done
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

type TubeProps = {
  colors: number[];
  selected: boolean;
  shake: boolean;
  pulse: boolean;
  onClick: () => void;
};

function Tube({ colors, selected, shake, pulse, onClick }: TubeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-56 w-16 rounded-b-3xl rounded-t-md border-[3px] border-ink/20 bg-white/40 shadow-sm transition-all duration-200 md:h-64 md:w-20 ${
        selected ? "-translate-y-4" : ""
      } ${shake ? "card-shake" : ""} ${pulse ? "ring-4 ring-yellow-300/70" : ""}`}
      aria-label={`Tube with ${colors.length} layers`}
    >
      <div className="absolute inset-x-0 bottom-0 flex h-full flex-col-reverse overflow-hidden rounded-b-3xl rounded-t-sm">
        {colors.map((c, i) => (
          <div
            key={i}
            className="transition-all duration-300"
            style={{
              height: `${100 / TUBE_CAPACITY}%`,
              backgroundColor: PALETTE[c],
              backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.05) 100%)`,
            }}
          />
        ))}
      </div>
    </button>
  );
}
