"use client";

import Link from "next/link";
import { useState } from "react";
import { todayStr } from "@/lib/storage";
import { updateState, useAppState } from "@/lib/store";
import type { QuietCheckIn } from "@/lib/types";

const moods: { id: NonNullable<QuietCheckIn["mood"]>; label: string; emoji: string }[] = [
  { id: "calm", label: "Calm", emoji: "🌿" },
  { id: "okay", label: "Okay", emoji: "🌤️" },
  { id: "tired", label: "Tired", emoji: "🌙" },
  { id: "spark", label: "Spark", emoji: "✨" },
];

const stepOptions = [
  { id: "water", label: "Sip some water", emoji: "💧" },
  { id: "stretch", label: "Stretch for a minute", emoji: "🤸" },
  { id: "outside", label: "Step outside", emoji: "🌳" },
  { id: "breath", label: "Five slow breaths", emoji: "🫧" },
  { id: "kind", label: "Text someone kind", emoji: "💌" },
  { id: "tidy", label: "Tidy one small thing", emoji: "🧺" },
];

const thoughts = [
  "Small steps still count as steps.",
  "Rest is a kind of progress.",
  "You can start over at any minute.",
  "Curiosity is a quiet superpower.",
  "Soft days deserve soft expectations.",
  "Quiet care for yourself adds up.",
];

function thoughtForToday(): string {
  const d = new Date();
  const idx =
    (d.getFullYear() * 372 + (d.getMonth() + 1) * 31 + d.getDate()) % thoughts.length;
  return thoughts[idx];
}

export default function CynthiaPage() {
  const state = useAppState();
  const today = state.cynthia.today;
  const [savedNotice, setSavedNotice] = useState(false);

  function pickMood(m: QuietCheckIn["mood"]) {
    updateState((prev) => ({
      ...prev,
      cynthia: {
        today: {
          date: todayStr(),
          mood: m,
          steps: prev.cynthia.today.steps,
          oneSentence: prev.cynthia.today.oneSentence,
        },
      },
    }));
  }

  function toggleStep(id: string) {
    updateState((prev) => {
      const has = prev.cynthia.today.steps.includes(id);
      const nextSteps = has
        ? prev.cynthia.today.steps.filter((s) => s !== id)
        : [...prev.cynthia.today.steps, id];
      return {
        ...prev,
        cynthia: {
          today: {
            ...prev.cynthia.today,
            date: todayStr(),
            steps: nextSteps,
          },
        },
      };
    });
  }

  function setSentence(value: string) {
    updateState((prev) => ({
      ...prev,
      cynthia: {
        today: {
          ...prev.cynthia.today,
          date: todayStr(),
          oneSentence: value,
        },
      },
    }));
  }

  function flashSaved() {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1500);
  }

  function handleResetToday() {
    updateState((prev) => ({
      ...prev,
      cynthia: { today: { date: todayStr(), steps: [] } },
    }));
  }

  return (
    <div className="min-h-screen w-full bg-[#f3f0ea] px-6 py-6 md:px-10 md:py-10">
      <div className="mx-auto w-full max-w-3xl pb-24">
        <header className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex h-12 items-center rounded-full bg-white px-4 text-base font-semibold text-ink shadow-sm ring-1 ring-black/5"
          >
            ← Home
          </Link>
          <button
            type="button"
            onClick={handleResetToday}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-soft shadow-sm ring-1 ring-black/5"
          >
            Reset today
          </button>
        </header>

        <section className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Quiet Mode</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">Hi, Cynthia</h1>
          <p className="mt-3 text-base text-ink-soft md:text-lg">
            Three soft check-ins. Tap any. Skip any. Just being here is enough.
          </p>
        </section>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
          <h2 className="text-lg font-semibold md:text-xl">How are you, in one word?</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {moods.map((m) => {
              const selected = today.mood === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => pickMood(selected ? undefined : m.id)}
                  aria-pressed={selected}
                  className={`flex flex-col items-center gap-2 rounded-2xl px-4 py-5 ring-1 transition ${
                    selected
                      ? "bg-[#e6e0f0] ring-[#b48ead] text-ink"
                      : "bg-bg-soft ring-black/5 hover:bg-[#efe7d8]"
                  }`}
                >
                  <span className="text-3xl" aria-hidden="true">
                    {m.emoji}
                  </span>
                  <span className="text-base font-semibold">{m.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
          <h2 className="text-lg font-semibold md:text-xl">A small step, if you&apos;d like</h2>
          <p className="mt-1 text-sm text-ink-soft">No pressure. Pick zero, one, or a few.</p>
          <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {stepOptions.map((s) => {
              const selected = today.steps.includes(s.id);
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => toggleStep(s.id)}
                    aria-pressed={selected}
                    className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left ring-1 transition ${
                      selected
                        ? "bg-[#e8efe1] ring-[#7fb46a]"
                        : "bg-bg-soft ring-black/5 hover:bg-[#efe7d8]"
                    }`}
                  >
                    <span aria-hidden="true" className="text-2xl">
                      {s.emoji}
                    </span>
                    <span className="flex-1 text-base font-semibold md:text-lg">{s.label}</span>
                    <span
                      className={`h-6 w-6 rounded-full ring-2 ${
                        selected ? "bg-[#7fb46a] ring-transparent" : "bg-white ring-black/15"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
          <h2 className="text-lg font-semibold md:text-xl">One sentence about today</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Anything at all. Saved only on this iPad.
          </p>
          <textarea
            value={today.oneSentence ?? ""}
            onChange={(e) => setSentence(e.target.value)}
            onBlur={flashSaved}
            placeholder="Today felt like…"
            rows={3}
            className="mt-4 w-full resize-none rounded-2xl bg-bg-soft p-4 text-base outline-none ring-1 ring-black/5 placeholder:text-ink-soft focus:ring-[#b48ead] md:text-lg"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-ink-soft">
              {savedNotice ? "Saved." : "Saves when you tap away."}
            </span>
            <button
              type="button"
              onClick={flashSaved}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-soft ring-1 ring-black/10"
            >
              Save
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-[#efe7d8] p-6 ring-1 ring-black/5 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">Thought for today</p>
          <p className="mt-2 text-xl font-semibold md:text-2xl">{thoughtForToday()}</p>
        </section>
      </div>
    </div>
  );
}
