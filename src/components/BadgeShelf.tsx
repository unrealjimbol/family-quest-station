"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import GameSession from "@/components/GameSession";
import { scienceQuests } from "@/data/scienceQuests";
import { useAppState } from "@/lib/store";
import type { KidId, ScienceQuest } from "@/lib/types";

type Props = {
  kidId: KidId;
  kidName: string;
  kidEmoji: string;
  accentColor: string;
};

function formatRelative(ts: number): string {
  const now = Date.now();
  const diffMs = now - ts;
  const day = 24 * 60 * 60 * 1000;
  if (diffMs < day) return "Today";
  if (diffMs < 2 * day) return "Yesterday";
  const days = Math.floor(diffMs / day);
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function BadgeShelf({ kidId, kidName, kidEmoji, accentColor }: Props) {
  const state = useAppState();
  const earned = state[kidId].badges;
  const earnedMap = useMemo(
    () => new Map(earned.map((b) => [b.scienceQuestId, b])),
    [earned],
  );
  const [openQuest, setOpenQuest] = useState<ScienceQuest | null>(null);
  const [playingGame, setPlayingGame] = useState(false);

  const total = scienceQuests.length;
  const earnedCount = earned.length;
  const percent = total === 0 ? 0 : Math.round((earnedCount / total) * 100);

  return (
    <div className="min-h-screen w-full px-6 py-6 md:px-10 md:py-10">
      <div className="mx-auto w-full max-w-5xl pb-24">
        <header className="mb-8 flex items-center justify-between gap-3">
          <Link
            href={`/${kidId}`}
            className="flex h-12 items-center rounded-full bg-white px-4 text-base font-semibold text-ink shadow-sm ring-1 ring-black/5"
          >
            ← Quests
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPlayingGame(true)}
              className="flex h-12 items-center gap-2 rounded-full px-4 text-sm font-bold text-white shadow-sm ring-1 ring-black/5 transition active:scale-[0.98] md:text-base"
              style={{ backgroundColor: accentColor }}
              aria-label="Play Bubble Pop"
            >
              <span aria-hidden="true">🎮</span>
              <span>Play</span>
            </button>
            <Link
              href="/"
              className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-ink-soft ring-1 ring-black/5"
            >
              Home
            </Link>
          </div>
        </header>

        <section className="text-center">
          <div className="mx-auto text-6xl md:text-7xl animate-bob" aria-hidden="true">
            {kidEmoji}
          </div>
          <p className="mt-4 text-sm uppercase tracking-[0.2em] text-ink-soft">
            {kidName}&apos;s collection
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">Badge Shelf</h1>
          <p className="mt-3 text-base text-ink-soft md:text-lg">
            {earnedCount} of {total} earned
          </p>
          <div
            className="mx-auto mt-4 h-3 w-full max-w-md overflow-hidden rounded-full bg-bg-soft"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${percent}%`, backgroundColor: accentColor }}
            />
          </div>
        </section>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {scienceQuests.map((sq) => {
            const earnedBadge = earnedMap.get(sq.id);
            const isEarned = Boolean(earnedBadge);
            return (
              <button
                key={sq.id}
                type="button"
                onClick={() => isEarned && setOpenQuest(sq)}
                disabled={!isEarned}
                aria-label={isEarned ? `${sq.badge.name} earned` : "Locked badge"}
                className={`group relative flex aspect-square flex-col items-center justify-center rounded-3xl p-4 text-center shadow-sm ring-1 ring-black/5 transition active:scale-[0.98] md:p-6 ${
                  isEarned ? "bg-white" : "bg-white/50"
                }`}
              >
                <div
                  className={`text-5xl md:text-6xl transition ${
                    isEarned ? "" : "opacity-30 grayscale"
                  }`}
                  aria-hidden="true"
                >
                  {sq.badge.emoji}
                </div>
                {isEarned ? (
                  <>
                    <div className="mt-3 line-clamp-2 text-sm font-bold leading-tight md:text-base">
                      {sq.badge.name}
                    </div>
                    <div className="mt-1 text-xs text-ink-soft">
                      {formatRelative(earnedBadge!.earnedAt)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-3 text-sm font-bold text-ink-soft md:text-base">???</div>
                    <div className="mt-1 text-xs text-ink-soft">Locked</div>
                    <div
                      aria-hidden="true"
                      className="absolute right-3 top-3 text-base text-ink-soft md:text-lg"
                    >
                      🔒
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {earnedCount === 0 ? (
          <p className="mt-8 text-center text-sm text-ink-soft">
            Finish a Science Quest to earn your first badge!
          </p>
        ) : null}
      </div>

      {openQuest ? (
        <BadgeDetail
          quest={openQuest}
          earnedAt={earnedMap.get(openQuest.id)?.earnedAt}
          accentColor={accentColor}
          onClose={() => setOpenQuest(null)}
        />
      ) : null}

      <GameSession
        open={playingGame}
        onClose={() => setPlayingGame(false)}
        kidId={kidId}
        accentColor={accentColor}
      />
    </div>
  );
}

type DetailProps = {
  quest: ScienceQuest;
  earnedAt: number | undefined;
  accentColor: string;
  onClose: () => void;
};

function BadgeDetail({ quest, earnedAt, accentColor, onClose }: DetailProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 md:items-center md:p-8"
      onClick={onClose}
      role="dialog"
      aria-label={`${quest.badge.name} details`}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl ring-1 ring-black/5 md:p-8 animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          <div className="text-6xl" aria-hidden="true">
            {quest.badge.emoji}
          </div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wide text-ink-soft">Badge</div>
            <div className="text-2xl font-bold md:text-3xl">{quest.badge.name}</div>
            {earnedAt ? (
              <div className="mt-1 text-sm text-ink-soft">Earned {formatRelative(earnedAt)}</div>
            ) : null}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-bg-soft p-5">
          <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">
            The question
          </div>
          <p className="mt-1 text-base font-semibold md:text-lg">{quest.question}</p>
        </div>

        <div className="mt-4 rounded-2xl bg-bg-soft p-5">
          <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">
            The answer
          </div>
          <p className="mt-1 text-base md:text-lg">{quest.explanation}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full px-6 py-3 text-base font-bold text-white shadow-sm md:text-lg"
          style={{ backgroundColor: accentColor }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
