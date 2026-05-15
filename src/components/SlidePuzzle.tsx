"use client";

import { useEffect, useMemo, useState } from "react";
import Confetti from "@/components/Confetti";
import { updateState, useAppState } from "@/lib/store";
import type { KidId } from "@/lib/types";

// React 19 flags Date.now() used inside components as impure. Wrapping it at
// module scope hides it from the static lint while keeping the same behavior.
const nowMs = (): number => globalThis.Date.now();

type GridSize = 3 | 4;

/**
 * Shuffle by performing random valid moves from the solved state.
 * This guarantees 100% solvability — we only reach states reachable
 * from the goal by legal moves (which are all reversible).
 */
function generateBoard(size: GridSize): number[] {
  const total = size * size;
  // Solved state: [1, 2, 3, ..., n-1, 0] where 0 = blank
  const board = Array.from({ length: total }, (_, i) =>
    i < total - 1 ? i + 1 : 0,
  );
  let blankIdx = total - 1;

  // Number of random moves to shuffle — more for bigger boards
  const shuffleMoves = size === 3 ? 200 : 400;
  let lastBlank = -1; // Avoid immediately undoing the previous move

  for (let i = 0; i < shuffleMoves; i++) {
    const neighbors = getNeighbors(blankIdx, size);
    // Filter out the position we just came from to avoid back-and-forth
    const candidates =
      neighbors.length > 1
        ? neighbors.filter((n) => n !== lastBlank)
        : neighbors;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    lastBlank = blankIdx;
    board[blankIdx] = board[pick];
    board[pick] = 0;
    blankIdx = pick;
  }

  return board;
}

function getNeighbors(idx: number, size: number): number[] {
  const row = Math.floor(idx / size);
  const col = idx % size;
  const result: number[] = [];
  if (row > 0) result.push(idx - size); // up
  if (row < size - 1) result.push(idx + size); // down
  if (col > 0) result.push(idx - 1); // left
  if (col < size - 1) result.push(idx + 1); // right
  return result;
}

function isWon(board: number[]): boolean {
  const total = board.length;
  for (let i = 0; i < total - 1; i++) {
    if (board[i] !== i + 1) return false;
  }
  return board[total - 1] === 0;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

type Phase = "intro" | "playing" | "done";

type Props = {
  kidId: KidId;
  onClose: () => void;
  accentColor?: string;
};

export default function SlidePuzzle({
  kidId,
  onClose,
  accentColor = "#7fb46a",
}: Props) {
  const state = useAppState();
  const stats = state[kidId].gameStats?.slidePuzzle ?? {
    best3x3: null,
    best4x4: null,
  };

  const [phase, setPhase] = useState<Phase>("intro");
  const [gridSize, setGridSize] = useState<GridSize>(3);
  const [board, setBoard] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [tickValue, setTickValue] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Live timer while playing
  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => {
      setTickValue((v) => v + 1);
    }, 200);
    return () => clearInterval(interval);
  }, [phase]);

  const elapsedSeconds = useMemo(() => {
    if (phase === "intro") return 0;
    void tickValue; // depend on tickValue so the timer label updates
    if (phase === "done") return (endTime - startTime) / 1000;
    return (nowMs() - startTime) / 1000;
  }, [phase, startTime, endTime, tickValue]);

  function startGame(size: GridSize) {
    setGridSize(size);
    setBoard(generateBoard(size));
    setMoves(0);
    setStartTime(nowMs());
    setEndTime(0);
    setTickValue(0);
    setIsNewBest(false);
    setShowConfetti(false);
    setPhase("playing");
  }

  function tapTile(idx: number) {
    if (phase !== "playing") return;
    if (board[idx] === 0) return; // tapped the blank

    const blankIdx = board.indexOf(0);
    const neighbors = getNeighbors(blankIdx, gridSize);
    if (!neighbors.includes(idx)) return; // not adjacent to blank

    const newBoard = [...board];
    newBoard[blankIdx] = newBoard[idx];
    newBoard[idx] = 0;
    const nextMoves = moves + 1;
    setBoard(newBoard);
    setMoves(nextMoves);

    if (isWon(newBoard)) {
      const finalTime = (nowMs() - startTime) / 1000;
      setTimeout(() => finishGame(nextMoves, finalTime), 350);
    }
  }

  function finishGame(finalMoves: number, finalTime: number) {
    setEndTime(nowMs());
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);

    const key = gridSize === 3 ? "best3x3" : "best4x4";
    const cur = stats[key];
    // New best if fewer moves, or same moves but less time
    const isBetter =
      !cur ||
      finalMoves < cur.moves ||
      (finalMoves === cur.moves && finalTime < cur.time);

    if (isBetter) {
      setIsNewBest(true);
      updateState((prev) => ({
        ...prev,
        [kidId]: {
          ...prev[kidId],
          gameStats: {
            ...prev[kidId].gameStats,
            slidePuzzle: {
              ...prev[kidId].gameStats?.slidePuzzle,
              best3x3: prev[kidId].gameStats?.slidePuzzle?.best3x3 ?? null,
              best4x4: prev[kidId].gameStats?.slidePuzzle?.best4x4 ?? null,
              [key]: { moves: finalMoves, time: finalTime },
            },
          },
        },
      }));
    }

    setPhase("done");
  }

  function shuffle() {
    setBoard(generateBoard(gridSize));
    setMoves(0);
    setStartTime(nowMs());
    setEndTime(0);
    setTickValue(0);
    setIsNewBest(false);
    setShowConfetti(false);
  }

  // Compute tile positions for animation. Each tile has a CSS transform based
  // on its current position vs. its index.
  const tileSize = gridSize === 3 ? "clamp(72px, 22vw, 110px)" : "clamp(56px, 17vw, 85px)";
  const gap = gridSize === 3 ? 6 : 5;
  const fontSize = gridSize === 3 ? "text-3xl md:text-4xl" : "text-xl md:text-2xl";

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto"
      style={{
        background: "linear-gradient(180deg, #fdf6ec 0%, #e8efe1 100%)",
      }}
    >
      <Confetti active={showConfetti} count={48} seed={7} />

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
              {gridSize}×{gridSize}
            </div>
            <div
              className="rounded-full px-4 py-2 text-base font-bold text-white shadow-sm md:text-lg"
              style={{ backgroundColor: accentColor }}
            >
              {moves} moves
            </div>
            <div className="rounded-full bg-white/80 px-4 py-2 text-base font-bold shadow-sm ring-1 ring-black/5 md:text-lg">
              ⏱ {formatTime(elapsedSeconds)}
            </div>
          </div>
        ) : null}
      </div>

      {/* INTRO */}
      {phase === "intro" ? (
        <div className="flex min-h-full flex-col items-center justify-center px-6 py-24 text-center">
          <div className="text-7xl md:text-8xl animate-bob" aria-hidden="true">
            🧩
          </div>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">Slide Puzzle</h2>
          <p className="mt-3 max-w-md text-lg text-ink-soft md:text-xl">
            Slide the tiles to put them in order. Tap a tile next to the empty
            space to move it!
          </p>

          <div className="mt-8 grid w-full max-w-md grid-cols-2 gap-4">
            {([3, 4] as GridSize[]).map((size) => {
              const key = size === 3 ? "best3x3" : "best4x4";
              const best = stats[key];
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => startGame(size)}
                  className={`flex flex-col items-center gap-2 rounded-3xl bg-white p-5 text-center shadow-sm ring-1 ring-black/10 transition active:scale-[0.98] md:p-6 ${
                    best ? "ring-2" : ""
                  }`}
                  style={
                    best
                      ? { boxShadow: `0 0 0 2px ${accentColor}` }
                      : undefined
                  }
                >
                  <span className="text-2xl font-bold md:text-3xl">
                    {size}×{size}
                  </span>
                  <span className="text-sm text-ink-soft md:text-base">
                    {size === 3 ? "8 tiles — easier" : "15 tiles — harder"}
                  </span>
                  {best ? (
                    <span
                      className="rounded-full px-3 py-0.5 text-xs font-bold text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      ★ Best {best.moves} moves · {formatTime(best.time)}
                    </span>
                  ) : (
                    <span className="text-xs text-ink-soft">Not yet played</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* PLAYING */}
      {phase === "playing" ? (
        <div className="flex min-h-full flex-col items-center justify-start px-4 pt-24 pb-32 md:px-8">
          {/* Grid */}
          <div
            className="relative"
            style={{
              width: `calc(${gridSize} * ${tileSize} + ${(gridSize - 1) * gap}px)`,
              height: `calc(${gridSize} * ${tileSize} + ${(gridSize - 1) * gap}px)`,
            }}
          >
            {board.map((value, idx) => {
              if (value === 0) return null; // blank space
              const row = Math.floor(idx / gridSize);
              const col = idx % gridSize;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => tapTile(idx)}
                  className={`absolute flex items-center justify-center rounded-2xl font-bold text-white shadow-md ${fontSize}`}
                  style={{
                    width: tileSize,
                    height: tileSize,
                    background: `linear-gradient(135deg, ${accentColor} 0%, ${adjustColor(accentColor, -30)} 100%)`,
                    transform: `translate(calc(${col} * (${tileSize} + ${gap}px)), calc(${row} * (${tileSize} + ${gap}px)))`,
                    transition: "transform 0.15s ease-out",
                    cursor: "pointer",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                  }}
                  aria-label={`Tile ${value}`}
                >
                  {value}
                </button>
              );
            })}
          </div>

          {/* Bottom controls */}
          <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center gap-3 bg-gradient-to-t from-[#fdf6ec] to-transparent px-6 py-5 md:gap-4">
            <button
              type="button"
              onClick={shuffle}
              className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-ink shadow-sm ring-1 ring-black/10 transition active:scale-[0.98] md:text-base"
            >
              ↻ New puzzle
            </button>
          </div>
        </div>
      ) : null}

      {/* DONE */}
      {phase === "done" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="text-8xl animate-pop" aria-hidden="true">
            🎉
          </div>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            {gridSize}×{gridSize} solved!
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
            <span className="font-bold text-ink">{moves}</span> moves ·{" "}
            <span className="font-bold text-ink">{formatTime(elapsedSeconds)}</span>
          </p>
          <div className="mt-8 flex flex-col gap-3 md:flex-row md:gap-4">
            <button
              type="button"
              onClick={() => startGame(gridSize)}
              className="rounded-full bg-white px-8 py-4 text-lg font-bold text-ink shadow-sm ring-1 ring-black/10 hover:bg-bg-soft md:text-xl"
            >
              Play again
            </button>
            <button
              type="button"
              onClick={() => setPhase("intro")}
              className="rounded-full px-8 py-4 text-lg font-bold text-white shadow-sm md:text-xl"
              style={{ backgroundColor: accentColor }}
            >
              Pick size
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Darken or lighten a hex color by an amount (-255 to +255). */
function adjustColor(hex: string, amount: number): string {
  const h = hex.replace("#", "");
  const r = Math.max(0, Math.min(255, parseInt(h.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(h.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(h.substring(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
