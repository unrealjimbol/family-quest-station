"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  pickGreeting,
  pickPromptForToday,
  pickResponse,
  type VibeOption,
} from "@/data/vibePrompts";
import { todayStr } from "@/lib/storage";
import { updateState } from "@/lib/store";
import type { KidId } from "@/lib/types";

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
  }

  return (
    <div className="min-h-screen w-full px-6 py-8 md:px-10 md:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex h-12 items-center rounded-full bg-white px-4 text-base font-semibold text-ink shadow-sm ring-1 ring-black/5"
          >
            ← Home
          </Link>
          <button
            type="button"
            onClick={onContinue}
            className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-ink-soft ring-1 ring-black/5 hover:bg-white"
          >
            Skip for today →
          </button>
        </header>

        <div className="text-center">
          <div className="mx-auto text-7xl animate-bob md:text-8xl" aria-hidden="true">
            {kidEmoji}
          </div>
          <p className="mt-4 text-sm uppercase tracking-[0.2em] text-ink-soft">
            Vibe check
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">{greeting}</h1>
          <h2 className="mt-3 text-2xl font-semibold leading-snug md:text-3xl">
            {prompt.question}
          </h2>
          {prompt.hint ? (
            <p className="mt-2 text-sm text-ink-soft md:text-base">{prompt.hint}</p>
          ) : null}
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-3 md:gap-4">
          {prompt.options.map((opt) => {
            const isPicked = picked?.label === opt.label;
            const dimmed = picked && !isPicked;
            return (
              <li key={opt.label}>
                <button
                  type="button"
                  onClick={() => pick(opt)}
                  disabled={Boolean(picked)}
                  aria-pressed={isPicked}
                  className={`flex w-full items-center gap-4 rounded-2xl bg-white px-5 py-4 text-left text-lg font-semibold shadow-sm ring-1 ring-black/5 transition-all duration-300 active:scale-[0.99] md:py-5 md:text-xl ${
                    isPicked ? "animate-pop ring-2" : ""
                  } ${dimmed ? "opacity-40" : ""}`}
                  style={isPicked ? { borderColor: accentColor, boxShadow: `0 0 0 3px ${accentColor}30` } : undefined}
                >
                  <span className="text-3xl md:text-4xl" aria-hidden="true">
                    {opt.emoji}
                  </span>
                  <span className="flex-1">{opt.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {picked && response ? (
          <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
            <div className="flex items-start gap-4">
              <div className="text-4xl animate-burst" aria-hidden="true">
                {kidEmoji}
              </div>
              <p className="flex-1 text-xl font-semibold leading-relaxed md:text-2xl">
                {response}
              </p>
            </div>
            <button
              type="button"
              onClick={onContinue}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-lg font-bold text-white shadow-sm transition active:scale-[0.99] md:w-auto md:px-10"
              style={{ backgroundColor: accentColor }}
            >
              Let&apos;s go! →
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
