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
    <div className="min-h-screen w-full px-5 py-6 md:px-10 md:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-6 flex items-center justify-between md:mb-8">
          <Link
            href="/"
            className="flex h-11 items-center rounded-full bg-white px-3.5 text-sm font-semibold text-ink shadow-sm ring-1 ring-black/5 md:h-12 md:px-4 md:text-base"
          >
            ← Home
          </Link>
          {!picked ? (
            <button
              type="button"
              onClick={onContinue}
              className="rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-ink-soft ring-1 ring-black/5 hover:bg-white md:px-4 md:py-2 md:text-sm"
            >
              Skip for today →
            </button>
          ) : null}
        </header>

        {!picked ? (
          <>
            <div className="text-center">
              <div
                className="mx-auto text-6xl animate-bob md:text-8xl"
                aria-hidden="true"
              >
                {kidEmoji}
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-ink-soft md:mt-4 md:text-sm">
                Daily warm-up
              </p>
              <h1 className="mt-1 text-2xl font-bold leading-tight md:mt-2 md:text-4xl">
                {greeting}
              </h1>
              <h2 className="mt-2 text-xl font-semibold leading-snug md:mt-3 md:text-3xl">
                {prompt.question}
              </h2>
              {prompt.hint ? (
                <p className="mt-1 text-xs text-ink-soft md:mt-2 md:text-base">
                  {prompt.hint}
                </p>
              ) : null}
            </div>

            <ul className="mt-6 grid grid-cols-1 gap-2.5 md:mt-8 md:gap-4">
              {prompt.options.map((opt) => (
                <li key={opt.label}>
                  <button
                    type="button"
                    onClick={() => pick(opt)}
                    className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left text-base font-semibold shadow-sm ring-1 ring-black/5 transition active:scale-[0.97] hover:ring-2 md:gap-4 md:px-5 md:py-5 md:text-xl"
                    style={{ ["--tw-ring-color" as string]: `${accentColor}40` }}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bg-soft text-2xl md:h-14 md:w-14 md:text-4xl" aria-hidden="true">
                      {opt.emoji}
                    </span>
                    <span className="flex-1">{opt.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {picked && response ? (
          <div className="flex flex-col items-center text-center">
            <div
              className="text-7xl animate-pop md:text-8xl"
              aria-hidden="true"
            >
              {kidEmoji}
            </div>
            <div
              className="mt-4 inline-flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 ring-1 ring-black/5 md:px-5 md:py-2.5"
              aria-label="You picked"
            >
              <span className="text-2xl md:text-3xl" aria-hidden="true">
                {picked.emoji}
              </span>
              <span className="text-sm font-semibold md:text-base">
                {picked.label}
              </span>
            </div>

            <p className="mt-6 max-w-xl text-2xl font-bold leading-snug md:text-3xl">
              {response}
            </p>

            <button
              type="button"
              onClick={onContinue}
              className="mt-8 w-full rounded-full px-8 py-4 text-lg font-bold text-white shadow-sm transition active:scale-[0.99] md:w-auto md:px-12 md:text-xl"
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
