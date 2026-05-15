"use client";

import Link from "next/link";
import { useState } from "react";
import DataBackup from "@/components/DataBackup";
import PinGate from "@/components/PinGate";
import PointPresetEditor from "@/components/PointPresetEditor";
import RewardPresetEditor from "@/components/RewardPresetEditor";
import QuestEditor from "@/components/QuestEditor";
import KidWeekView from "@/components/WeekView";
import { getBalance } from "@/lib/points";
import { getPin, lockSession, setPin } from "@/lib/pin";
import { todayStr } from "@/lib/storage";
import { updateState, useAppState } from "@/lib/store";

const questions: { id: number; prompt: string; placeholder: string }[] = [
  {
    id: 1,
    prompt: "One small thing that went okay today.",
    placeholder: "Maybe a giggle, a hug, a meal eaten…",
  },
  {
    id: 2,
    prompt: "One moment that felt heavy — and how you handled it.",
    placeholder: "Even if you just took a breath, that counts.",
  },
  {
    id: 3,
    prompt: "Something the kids did that surprised you.",
    placeholder: "A new word, a kindness, a question…",
  },
  {
    id: 4,
    prompt: "A small kindness for tomorrow-you.",
    placeholder: "Lay out clothes, prep coffee, set the bowls…",
  },
  {
    id: 5,
    prompt: "One word for how you feel right now.",
    placeholder: "Tired, proud, soft, ready…",
  },
];

export default function ParentPage() {
  const state = useAppState();
  const answers = state.parent.today.answers;
  const [savedNotice, setSavedNotice] = useState(false);

  function update(id: number, value: string) {
    updateState((prev) => ({
      ...prev,
      parent: {
        today: {
          date: todayStr(),
          answers: { ...prev.parent.today.answers, [id]: value },
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
      parent: { today: { date: todayStr(), answers: {} } },
    }));
  }

  const filled = Object.values(answers).filter((v) => v && v.trim().length > 0).length;

  return (
    <PinGate>
    <div className="min-h-screen w-full bg-[#f1ede4] px-6 py-6 md:px-10 md:py-10">
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
          <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">This week</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
            Family rhythm
          </h1>
          <p className="mt-3 text-base text-ink-soft md:text-lg">
            A soft snapshot of how the week is going.
          </p>
        </section>

        <div className="mt-8 space-y-5">
          <KidWeekView
            kidId="elio"
            kidName="Elio"
            kidEmoji="🐼"
            accentColor="#e07a5f"
          />
          <KidWeekView
            kidId="emilia"
            kidName="Emilia"
            kidEmoji="🦄"
            accentColor="#d68fa5"
          />
        </div>

        {/* Task Editor */}
        <section className="mt-10">
          <div className="text-center mb-5">
            <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Customize</p>
            <h2 className="mt-2 text-2xl font-bold leading-tight md:text-3xl">
              Edit quests
            </h2>
            <p className="mt-2 text-sm text-ink-soft md:text-base">
              Add, remove, or rearrange daily quests for each kid.
            </p>
          </div>
          <div className="space-y-4">
            <QuestEditor kidId="elio" kidName="Elio" kidEmoji="🐼" />
            <QuestEditor kidId="emilia" kidName="Emilia" kidEmoji="🦄" />
          </div>
        </section>

        {/* Points section */}
        <section className="mt-10">
          <div className="text-center mb-5">
            <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Reward</p>
            <h2 className="mt-2 text-2xl font-bold leading-tight md:text-3xl">
              Daily points
            </h2>
            <p className="mt-2 text-sm text-ink-soft md:text-base">
              Today&apos;s totals, earning presets &amp; reward shop.
            </p>
          </div>

          <div className="mb-4 flex justify-center gap-6">
            <div className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-sm ring-1 ring-black/5">
              <span className="text-2xl" aria-hidden="true">🐼</span>
              <div>
                <div className="text-xs text-ink-soft">Elio</div>
                <div className="text-xl font-bold text-[#e07a5f]">
                  {getBalance("elio")} <span className="text-sm font-medium text-ink-soft">pts</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-sm ring-1 ring-black/5">
              <span className="text-2xl" aria-hidden="true">🦄</span>
              <div>
                <div className="text-xs text-ink-soft">Emilia</div>
                <div className="text-xl font-bold text-[#d68fa5]">
                  {getBalance("emilia")} <span className="text-sm font-medium text-ink-soft">pts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <PointPresetEditor />
            <RewardPresetEditor />
          </div>
        </section>

        <section className="mt-12 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Parent Reset</p>
          <h2 className="mt-2 text-2xl font-bold leading-tight md:text-3xl">
            Five quiet questions
          </h2>
          <p className="mt-3 text-base text-ink-soft md:text-lg">
            Take a slow breath. Answer any. Skip any. This is only for you.
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            {filled} of {questions.length} answered
          </p>
        </section>

        <ol className="mt-8 space-y-5">
          {questions.map((q, idx) => (
            <li
              key={q.id}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8"
            >
              <div className="flex items-start gap-4">
                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dde6d8] text-base font-bold text-[#3a6b40]">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold md:text-xl">{q.prompt}</h2>
                  <textarea
                    value={answers[q.id] ?? ""}
                    onChange={(e) => update(q.id, e.target.value)}
                    onBlur={flashSaved}
                    placeholder={q.placeholder}
                    rows={3}
                    className="mt-3 w-full resize-none rounded-2xl bg-bg-soft p-4 text-base outline-none ring-1 ring-black/5 placeholder:text-ink-soft focus:ring-[#81b29a] md:text-lg"
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex items-center justify-between">
          <span className="text-sm text-ink-soft">
            {savedNotice ? "Saved." : "Saves automatically as you write."}
          </span>
          <button
            type="button"
            onClick={flashSaved}
            className="rounded-full bg-[#81b29a] px-6 py-3 font-bold text-white shadow-sm transition hover:bg-[#6f9d87]"
          >
            Save & close
          </button>
        </div>

        {/* PIN settings */}
        <PinSettings />

        {/* Data backup/restore */}
        <section className="mt-8">
          <DataBackup />
        </section>

        <p className="mt-10 text-center text-sm text-ink-soft">
          Thanks for showing up today.
        </p>
      </div>
    </div>
    </PinGate>
  );
}

function PinSettings() {
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [pinSaved, setPinSaved] = useState(false);

  function handleSavePin() {
    if (newPin.length === 4 && /^\d{4}$/.test(newPin)) {
      setPin(newPin);
      setNewPin("");
      setShowPinChange(false);
      setPinSaved(true);
      setTimeout(() => setPinSaved(false), 2000);
    }
  }

  function handleLock() {
    lockSession();
    window.location.reload();
  }

  return (
    <section className="mt-12">
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">🔒</span>
            <h3 className="text-base font-bold">PIN lock</h3>
            {pinSaved ? (
              <span className="text-xs font-medium text-[#81b29a] animate-pop">Saved!</span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPinChange(!showPinChange)}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft ring-1 ring-black/10 hover:bg-bg-soft"
            >
              {showPinChange ? "Cancel" : "Change PIN"}
            </button>
            <button
              type="button"
              onClick={handleLock}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft ring-1 ring-black/10 hover:bg-bg-soft"
            >
              Lock now
            </button>
          </div>
        </div>

        {showPinChange ? (
          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm text-ink-soft">New 4-digit PIN:</label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="1234"
              className="w-24 rounded-lg bg-bg-soft px-3 py-2 text-center text-lg font-bold tracking-widest outline-none ring-1 ring-black/10 focus:ring-[#81b29a]"
            />
            <button
              type="button"
              onClick={handleSavePin}
              disabled={newPin.length !== 4}
              className="rounded-full bg-[#81b29a] px-4 py-1.5 text-xs font-bold text-white disabled:opacity-40"
            >
              Save
            </button>
          </div>
        ) : (
          <p className="mt-2 text-xs text-ink-soft">
            Current PIN: {getPin()} &middot; Keeps the parent page safe from curious taps.
          </p>
        )}
      </div>
    </section>
  );
}
