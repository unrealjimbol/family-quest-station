"use client";

import Link from "next/link";
import { useState } from "react";
import BreathBuddy from "@/components/BreathBuddy";
import { todayStr } from "@/lib/storage";
import { updateState, useAppState } from "@/lib/store";
import type { QuietCheckIn } from "@/lib/types";

const moods: { id: NonNullable<QuietCheckIn["mood"]>; label: string; emoji: string; color: string }[] = [
  { id: "calm", label: "Calm", emoji: "🍃", color: "bg-emerald-50 ring-emerald-300 text-emerald-800" },
  { id: "okay", label: "Okay", emoji: "🌤️", color: "bg-amber-50 ring-amber-300 text-amber-800" },
  { id: "tired", label: "Tired", emoji: "🌙", color: "bg-indigo-50 ring-indigo-300 text-indigo-800" },
  { id: "spark", label: "Spark", emoji: "✨", color: "bg-rose-50 ring-rose-300 text-rose-800" },
];

const stepOptions = [
  { id: "water", label: "Sip some water", emoji: "💧" },
  { id: "stretch", label: "Stretch for a minute", emoji: "🤸" },
  { id: "outside", label: "Step outside", emoji: "🌳" },
  { id: "breath", label: "Five slow breaths", emoji: "🫧" },
  { id: "kind", label: "Text someone kind", emoji: "💌" },
  { id: "tidy", label: "Tidy one small thing", emoji: "🧺" },
  { id: "music", label: "Listen to a song", emoji: "🎧" },
  { id: "doodle", label: "Doodle something", emoji: "🎨" },
];

const thoughts = [
  "Small steps still count as steps.",
  "Rest is a kind of progress.",
  "You can start over at any minute.",
  "Curiosity is a quiet superpower.",
  "Soft days deserve soft expectations.",
  "Quiet care for yourself adds up.",
  "Not everything needs to be productive.",
  "You're doing better than you think.",
  "Today only asks for today.",
  "It's okay to just… be.",
  "Gentleness is strength.",
  "Some flowers bloom in shade.",
  "Your pace is the right pace.",
  "Being kind to yourself is not selfish.",
  "Tomorrow is a blank page.",
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
  const [showBreathing, setShowBreathing] = useState(false);

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

  const doneCount = today.steps.length;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f3f0ea] to-[#e8e4de] px-5 py-6 md:px-10 md:py-10">
      <div className="mx-auto w-full max-w-3xl pb-24">
        <header className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex h-11 items-center rounded-full bg-white px-4 text-sm font-semibold text-ink shadow-sm ring-1 ring-black/5 md:h-12 md:text-base"
          >
            ← Home
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowBreathing(true)}
              className="flex h-11 items-center gap-1.5 rounded-full bg-[#e6e0f0] px-4 text-sm font-semibold text-[#6c5ce7] shadow-sm ring-1 ring-[#b48ead]/30 md:h-12 md:text-base"
            >
              🫧 Breathe
            </button>
          </div>
        </header>

        <section className="text-center">
          <div className="text-4xl md:text-5xl" aria-hidden="true">🐰</div>
          <h1 className="mt-2 text-2xl font-bold leading-tight md:text-3xl">Hi, Cynthia</h1>
          <p className="mt-2 text-sm text-ink-soft md:text-base">
            Your quiet space. Tap any. Skip any. Just being here counts.
          </p>
        </section>

        {/* Mood */}
        <section className="mt-7 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
          <h2 className="text-base font-semibold md:text-lg">Right now I feel…</h2>
          <div className="mt-3 grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
            {moods.map((m) => {
              const selected = today.mood === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => pickMood(selected ? undefined : m.id)}
                  aria-pressed={selected}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl px-3 py-4 ring-1 transition active:scale-[0.97] ${
                    selected ? m.color : "bg-bg-soft ring-black/5 hover:bg-[#efe7d8]"
                  }`}
                >
                  <span className="text-2xl md:text-3xl" aria-hidden="true">{m.emoji}</span>
                  <span className="text-sm font-semibold md:text-base">{m.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Steps */}
        <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold md:text-lg">Gentle steps</h2>
            {doneCount > 0 ? (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 ring-1 ring-emerald-200/60">
                {doneCount} done
              </span>
            ) : (
              <span className="text-xs text-ink-soft">No pressure</span>
            )}
          </div>
          <ul className="mt-3 grid grid-cols-1 gap-2.5 md:grid-cols-2">
            {stepOptions.map((s) => {
              const selected = today.steps.includes(s.id);
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => toggleStep(s.id)}
                    aria-pressed={selected}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left ring-1 transition active:scale-[0.99] ${
                      selected
                        ? "bg-[#e8efe1] ring-[#7fb46a]"
                        : "bg-bg-soft ring-black/5 hover:bg-[#efe7d8]"
                    }`}
                  >
                    <span aria-hidden="true" className="text-xl md:text-2xl">{s.emoji}</span>
                    <span className="flex-1 text-sm font-semibold md:text-base">{s.label}</span>
                    {selected ? (
                      <span className="text-sm text-[#7fb46a]">✓</span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Journal */}
        <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
          <h2 className="text-base font-semibold md:text-lg">One sentence about today</h2>
          <p className="mt-1 text-xs text-ink-soft md:text-sm">
            Anything. Only saved on this device.
          </p>
          <textarea
            value={today.oneSentence ?? ""}
            onChange={(e) => setSentence(e.target.value)}
            onBlur={flashSaved}
            placeholder="Today felt like…"
            rows={3}
            className="mt-3 w-full resize-none rounded-2xl bg-bg-soft p-4 text-sm outline-none ring-1 ring-black/5 placeholder:text-ink-soft focus:ring-[#b48ead] md:text-base"
          />
          <div className="mt-2 flex items-center justify-end">
            <span className="text-xs text-ink-soft">
              {savedNotice ? "✓ Saved" : "Auto-saves on tap away"}
            </span>
          </div>
        </section>

        {/* Thought */}
        <section className="mt-4 rounded-3xl bg-gradient-to-br from-[#e6e0f0] to-[#efe7d8] p-5 ring-1 ring-[#b48ead]/20 md:p-7">
          <p className="text-xs uppercase tracking-[0.15em] text-ink-soft">Thought for today</p>
          <p className="mt-2 text-lg font-semibold leading-snug md:text-xl">
            &ldquo;{thoughtForToday()}&rdquo;
          </p>
        </section>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleResetToday}
            className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-ink-soft shadow-sm ring-1 ring-black/5 hover:bg-bg-soft md:text-sm"
          >
            Reset today
          </button>
        </div>
      </div>

      {showBreathing ? (
        <BreathBuddy onClose={() => setShowBreathing(false)} />
      ) : null}
    </div>
  );
}
