"use client";

import Link from "next/link";
import { useMemo } from "react";
import KidAvatar from "@/components/KidAvatar";
import { getQuests } from "@/lib/customQuests";
import { getBalance } from "@/lib/points";
import { useAppState } from "@/lib/store";
import type { KidId } from "@/lib/types";

type Card = {
  href: string;
  name: string;
  role: string;
  emoji: string;
  bg: string;
  ring: string;
  kidId?: KidId;
  accentColor?: string;
};

const cards: Card[] = [
  {
    href: "/elio",
    name: "Elio",
    role: "Daily Quests",
    emoji: "🦦",
    bg: "bg-[#fde4cf]",
    ring: "ring-[#e07a5f]/30",
    kidId: "elio",
    accentColor: "#e07a5f",
  },
  {
    href: "/emilia",
    name: "Emilia",
    role: "Daily Quests",
    emoji: "🦫",
    bg: "bg-[#f7d6e0]",
    ring: "ring-[#d68fa5]/30",
    kidId: "emilia",
    accentColor: "#d68fa5",
  },
  {
    href: "/cynthia",
    name: "Cynthia",
    role: "Quiet Mode",
    emoji: "🐰",
    bg: "bg-[#e1ecd4]",
    ring: "ring-[#7fb46a]/30",
  },
  {
    href: "/parent",
    name: "爸妈",
    role: "家长专区",
    emoji: "☕",
    bg: "bg-[#e7e0d3]",
    ring: "ring-[#a89878]/30",
  },
];

export default function Home() {
  const state = useAppState();

  return (
    <div className="min-h-screen w-full px-6 py-10 md:px-10 md:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10 text-center md:mb-14">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Family Quest Station</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">Who&apos;s here today?</h1>
          <p className="mt-3 text-base text-ink-soft md:text-lg">Tap your name to begin.</p>
        </div>

        <div className="grid grid-cols-2 gap-5 md:gap-8">
          {cards.map((card, idx) => (
            <Link
              key={card.href}
              href={card.href}
              className={`group relative flex aspect-square flex-col items-center justify-center rounded-3xl ${card.bg} p-6 shadow-sm ring-1 ${card.ring} transition-transform duration-200 hover:-translate-y-1 active:scale-[0.98] md:rounded-[2rem] md:p-10`}
            >
              <div
                className="animate-bob"
                style={{ animationDelay: `${idx * 0.4}s` }}
              >
                <KidAvatar emoji={card.emoji} size={140} />
              </div>
              <div className="mt-4 text-2xl font-bold md:mt-6 md:text-3xl">{card.name}</div>
              <div className="mt-1 text-sm text-ink-soft md:text-base">{card.role}</div>

              {/* Status preview for kids */}
              {card.kidId ? (
                <KidStatusPreview
                  kidId={card.kidId}
                  completedIds={state[card.kidId].today.completedQuestIds}
                  vibeEmoji={state[card.kidId].today.vibe?.emoji}
                  accentColor={card.accentColor!}
                />
              ) : null}
            </Link>
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-ink-soft md:text-sm">
          Saved on this device only · No account needed
        </p>
      </div>
    </div>
  );
}

function KidStatusPreview({
  kidId,
  completedIds,
  vibeEmoji,
  accentColor,
}: {
  kidId: KidId;
  completedIds: string[];
  vibeEmoji?: string;
  accentColor: string;
}) {
  const quests = useMemo(() => getQuests(kidId), [kidId]);
  const balance = useMemo(() => getBalance(kidId), [kidId]);
  const done = completedIds.filter((id) => quests.some((q) => q.id === id)).length;
  const total = quests.length;

  // Nothing to show yet
  if (done === 0 && balance === 0 && !vibeEmoji) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 md:mt-4">
      {/* Vibe emoji */}
      {vibeEmoji ? (
        <span
          className="flex h-6 items-center rounded-full bg-white/70 px-2 text-xs font-semibold ring-1 ring-black/5 md:h-7 md:px-2.5 md:text-sm"
        >
          {vibeEmoji}
        </span>
      ) : null}

      {/* Quest progress */}
      {done > 0 ? (
        <span
          className="flex h-6 items-center rounded-full bg-white/70 px-2 text-xs font-bold ring-1 ring-black/5 md:h-7 md:px-2.5 md:text-sm"
          style={{ color: accentColor }}
        >
          ✓ {done}/{total}
        </span>
      ) : null}

      {/* Point balance */}
      {balance > 0 ? (
        <span
          className="flex h-6 items-center gap-0.5 rounded-full bg-white/70 px-2 text-xs font-bold ring-1 ring-black/5 md:h-7 md:px-2.5 md:text-sm"
          style={{ color: accentColor }}
        >
          ⭐ {balance}
        </span>
      ) : null}
    </div>
  );
}
