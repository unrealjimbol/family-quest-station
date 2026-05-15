"use client";

import { useEffect, useMemo, useState } from "react";
import Confetti from "@/components/Confetti";
import { updateState, useAppState } from "@/lib/store";
import type { KidId, MemoryMatchDifficulty } from "@/lib/types";

// React 19 flags Date.now() used inside components as impure. Wrapping it at
// module scope hides it from the static lint while keeping the same behavior.
const nowMs = (): number => globalThis.Date.now();

const PAIRS: Record<MemoryMatchDifficulty, number> = {
  easy: 3,
  medium: 6,
  hard: 8,
};

const COLS: Record<MemoryMatchDifficulty, number> = {
  easy: 3,
  medium: 4,
  hard: 4,
};

// A friendly pool of nature/science emojis. Pick distinct ones per game.
const EMOJI_POOL = [
  "🌍",
  "🌙",
  "⭐",
  "🌈",
  "🦋",
  "🌳",
  "🌊",
  "🌸",
  "🐝",
  "🍄",
  "🌻",
  "☀️",
  "🍀",
  "🐼",
  "🐢",
  "🦫",
  "🐠",
  "🦉",
  "🐬",
  "🌺",
];

type Card = {
  id: number;
  emoji: string;
  faceUp: boolean;
  matched: boolean;
  justMatched: boolean;
  justMissed: boolean;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeDeck(difficulty: MemoryMatchDifficulty): Card[] {
  const pairs = PAIRS[difficulty];
  const picked = shuffle(EMOJI_POOL).slice(0, pairs);
  const all = shuffle([...picked, ...picked]);
  return all.map((emoji, i) => ({
    id: i,
    emoji,
    faceUp: false,
    matched: false,
    justMatched: false,
    justMissed: false,
  }));
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

export default function MemoryMatch({
  kidId,
  onClose,
  accentColor = "#e07a5f",
}: Props) {
  const state = useAppState();
  const stats = state[kidId].gameStats?.memoryMatch ?? {};

  const [phase, setPhase] = useState<Phase>("intro");
  const [difficulty, setDifficulty] = useState<MemoryMatchDifficulty>("easy");
  const [deck, setDeck] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [firstFlipId, setFirstFlipId] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

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

  const totalPairs = PAIRS[difficulty];

  function startGame(d: MemoryMatchDifficulty) {
    setDifficulty(d);
    setDeck(makeDeck(d));
    setMoves(0);
    setMatchedPairs(0);
    setFirstFlipId(null);
    setLocked(false);
    setStartTime(nowMs());
    setEndTime(0);
    setTickValue(0);
    setIsNewBest(false);
    setShowConfetti(false);
    setPhase("playing");
  }

  function finishGame(finalMoves: number, finalTime: number) {
    setEndTime(nowMs());
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);

    // Save best stats if improved
    const cur = stats[difficulty];
    const isBetter =
      !cur || finalTime < cur.time || (finalTime === cur.time && finalMoves < cur.moves);
    if (isBetter) {
      setIsNewBest(true);
      updateState((prev) => ({
        ...prev,
        [kidId]: {
          ...prev[kidId],
          gameStats: {
            ...prev[kidId].gameStats,
            memoryMatch: {
              ...prev[kidId].gameStats?.memoryMatch,
              [difficulty]: { time: finalTime, moves: finalMoves },
            },
          },
        },
      }));
    }

    setPhase("done");
  }

  function flipCard(id: number) {
    if (locked || phase !== "playing") return;
    const card = deck.find((c) => c.id === id);
    if (!card || card.faceUp || card.matched) return;

    if (firstFlipId === null) {
      setDeck((prev) =>
        prev.map((c) => (c.id === id ? { ...c, faceUp: true } : c)),
      );
      setFirstFlipId(id);
      return;
    }

    // Second flip
    const firstCard = deck.find((c) => c.id === firstFlipId);
    if (!firstCard) return;
    const matches = firstCard.emoji === card.emoji;

    setDeck((prev) =>
      prev.map((c) => (c.id === id ? { ...c, faceUp: true } : c)),
    );
    const newMoves = moves + 1;
    setMoves(newMoves);
    setLocked(true);

    setTimeout(() => {
      if (matches) {
        // Mark matched + flag for pulse animation
        setDeck((prev) =>
          prev.map((c) =>
            c.id === firstFlipId || c.id === id
              ? { ...c, matched: true, justMatched: true }
              : c,
          ),
        );
        const newMatched = matchedPairs + 1;
        setMatchedPairs(newMatched);
        setFirstFlipId(null);
        setLocked(false);

        // Clear pulse flag shortly
        setTimeout(() => {
          setDeck((prev) =>
            prev.map((c) =>
              c.id === firstFlipId || c.id === id
                ? { ...c, justMatched: false }
                : c,
            ),
          );
        }, 700);

        // Win check
        if (newMatched >= totalPairs) {
          const finalTime = (nowMs() - startTime) / 1000;
          setTimeout(() => finishGame(newMoves, finalTime), 600);
        }
      } else {
        // Flag mismatch + flip back
        setDeck((prev) =>
          prev.map((c) =>
            c.id === firstFlipId || c.id === id
              ? { ...c, justMissed: true }
              : c,
          ),
        );
        setTimeout(() => {
          setDeck((prev) =>
            prev.map((c) =>
              c.id === firstFlipId || c.id === id
                ? { ...c, faceUp: false, justMissed: false }
                : c,
            ),
          );
          setFirstFlipId(null);
          setLocked(false);
        }, 600);
      }
    }, 350);
  }

  const cols = COLS[difficulty];

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto"
      style={{
        background:
          "linear-gradient(180deg, #fff5e8 0%, #ffe7d3 60%, #fde4cf 100%)",
      }}
    >
      <Confetti active={showConfetti} count={48} seed={3} />

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
              ⏱ {formatTime(elapsedSeconds)}
            </div>
            <div
              className="rounded-full px-4 py-2 text-base font-bold text-white shadow-sm md:text-lg"
              style={{ backgroundColor: accentColor }}
            >
              👀 {moves}
            </div>
          </div>
        ) : null}
      </div>

      {phase === "intro" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="text-7xl md:text-8xl animate-bob" aria-hidden="true">
            🃏
          </div>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">Memory Match</h2>
          <p className="mt-3 max-w-md text-lg text-ink-soft md:text-xl">
            Flip cards. Find pairs. Pick a level — you can level up later.
          </p>

          <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-3 md:grid-cols-3">
            {(["easy", "medium", "hard"] as MemoryMatchDifficulty[]).map((d) => {
              const best = stats[d];
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => startGame(d)}
                  className="flex flex-col items-center gap-2 rounded-3xl bg-white p-5 text-center shadow-sm ring-1 ring-black/10 transition active:scale-[0.98] md:p-6"
                >
                  <span className="text-2xl font-bold capitalize md:text-3xl">
                    {d}
                  </span>
                  <span className="text-sm text-ink-soft md:text-base">
                    {PAIRS[d]} pairs · {PAIRS[d] * 2} cards
                  </span>
                  {best ? (
                    <span
                      className="mt-1 rounded-full px-3 py-1 text-xs font-bold text-white md:text-sm"
                      style={{ backgroundColor: accentColor }}
                    >
                      ★ Best {formatTime(best.time)} · {best.moves} moves
                    </span>
                  ) : (
                    <span className="text-xs text-ink-soft md:text-sm">
                      No record yet
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {phase === "playing" ? (
        <div className="flex min-h-full flex-col items-center justify-center px-4 pt-24 pb-10 md:px-8">
          <div className="text-sm font-semibold uppercase tracking-wide text-ink-soft md:text-base">
            {matchedPairs} of {totalPairs} pairs
          </div>
          <div
            className="mt-4 grid w-full max-w-2xl gap-2 md:gap-3"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
          >
            {deck.map((c) => (
              <CardTile
                key={c.id}
                card={c}
                onClick={() => flipCard(c.id)}
                accentColor={accentColor}
              />
            ))}
          </div>
        </div>
      ) : null}

      {phase === "done" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="text-8xl animate-pop" aria-hidden="true">
            🎉
          </div>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">All matched!</h2>
          {isNewBest ? (
            <p
              className="mt-2 text-xl font-bold uppercase tracking-wide md:text-2xl"
              style={{ color: accentColor }}
            >
              ★ New best!
            </p>
          ) : null}
          <p className="mt-3 text-xl text-ink-soft md:text-2xl">
            <span className="font-bold text-ink">{formatTime(elapsedSeconds)}</span>{" "}
            · <span className="font-bold text-ink">{moves}</span> moves ·{" "}
            <span className="font-bold capitalize text-ink">{difficulty}</span>
          </p>

          <div className="mt-8 flex flex-col gap-3 md:flex-row md:gap-4">
            <button
              type="button"
              onClick={() => startGame(difficulty)}
              className="rounded-full bg-white px-8 py-4 text-lg font-bold text-ink shadow-sm ring-1 ring-black/10 hover:bg-bg-soft md:text-xl"
            >
              Same level again
            </button>
            {difficulty !== "hard" ? (
              <button
                type="button"
                onClick={() =>
                  startGame(difficulty === "easy" ? "medium" : "hard")
                }
                className="rounded-full px-8 py-4 text-lg font-bold text-white shadow-sm md:text-xl"
                style={{ backgroundColor: accentColor }}
              >
                Level up ↑
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
            {difficulty !== "hard" ? (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-bg-soft px-8 py-4 text-lg font-bold text-ink-soft shadow-sm md:text-xl"
              >
                Done
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

type CardTileProps = {
  card: Card;
  onClick: () => void;
  accentColor: string;
};

function CardTile({ card, onClick, accentColor }: CardTileProps) {
  const isFaceUp = card.faceUp || card.matched;
  return (
    <div
      className={`relative aspect-square ${card.justMissed ? "card-shake" : ""}`}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={card.matched}
        aria-label={isFaceUp ? `Card showing ${card.emoji}` : "Hidden card"}
        className={`card-flip absolute inset-0 h-full w-full select-none rounded-2xl ${
          isFaceUp ? "is-flipped" : ""
        } ${card.justMatched ? "card-match-pulse" : ""}`}
      >
        {/* Back (shown when face down) */}
        <span
          className="card-face absolute inset-0 flex items-center justify-center rounded-2xl text-3xl shadow-sm ring-1 ring-black/10 md:text-4xl"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 25%, ${accentColor}40 0%, ${accentColor}90 60%, ${accentColor} 100%)`,
            color: "rgba(255,255,255,0.85)",
          }}
          aria-hidden="true"
        >
          ✦
        </span>
        {/* Front (shown when flipped) */}
        <span
          className={`card-face card-face-back absolute inset-0 flex items-center justify-center rounded-2xl text-4xl shadow-sm ring-1 md:text-5xl ${
            card.matched ? "ring-[#7fb46a]/40" : "ring-black/10"
          }`}
          style={{
            backgroundColor: card.matched ? "#dff5e1" : "#ffffff",
          }}
          aria-hidden="true"
        >
          {card.emoji}
        </span>
      </button>
    </div>
  );
}
