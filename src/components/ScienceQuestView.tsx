"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import GameSession from "@/components/GameSession";
import Confetti from "@/components/Confetti";
import { pickScienceQuestForDay } from "@/data/scienceQuests";
import { checkGameAccess, type GameAccessCheck } from "@/lib/gameAccess";
import { todayStr } from "@/lib/storage";
import { updateState, useAppState } from "@/lib/store";
import type { KidId } from "@/lib/types";

type Props = {
  kidId: KidId;
  kidName: string;
};

export default function ScienceQuestView({ kidId, kidName }: Props) {
  const state = useAppState();
  const today = state[kidId].today;
  const unlocked = today.scienceUnlocked;

  const quest = useMemo(() => pickScienceQuestForDay(todayStr(), kidId), [kidId]);
  const claimed = today.scienceClaimedQuestId === quest.id;
  const claimedChoice = today.scienceClaimedChoiceId;

  const [chosen, setChosen] = useState<string | null>(claimedChoice ?? null);
  const [revealed, setRevealed] = useState<boolean>(Boolean(claimedChoice));
  const [missionDone, setMissionDone] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playingGame, setPlayingGame] = useState(false);

  // Per-kid accent so the game matches their theme color
  const kidAccent = kidId === "elio" ? "#e07a5f" : "#d68fa5";

  const isCorrect = chosen ? chosen === quest.correctChoiceId : false;

  function pickChoice(id: string) {
    if (revealed) return;
    setChosen(id);
    setRevealed(true);
  }

  function claimBadge() {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);
    updateState((prev) => {
      const already = prev[kidId].badges.find((b) => b.scienceQuestId === quest.id);
      const nextBadges = already
        ? prev[kidId].badges
        : [...prev[kidId].badges, { scienceQuestId: quest.id, earnedAt: Date.now() }];
      return {
        ...prev,
        [kidId]: {
          ...prev[kidId],
          badges: nextBadges,
          today: {
            ...prev[kidId].today,
            scienceClaimedQuestId: quest.id,
            scienceClaimedChoiceId: chosen ?? undefined,
          },
        },
      };
    });
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen w-full px-6 py-10 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="/"
            className="inline-flex h-12 items-center rounded-full bg-white px-4 text-base font-semibold text-ink shadow-sm ring-1 ring-black/5"
          >
            ← Home
          </Link>
          <div className="mt-10 rounded-3xl bg-white p-10 shadow-sm ring-1 ring-black/5">
            <div className="text-6xl">🔒</div>
            <h1 className="mt-4 text-2xl font-bold md:text-3xl">Almost there!</h1>
            <p className="mt-3 text-ink-soft">
              Finish 5 quests today to unlock {kidName}&apos;s Science Quest.
            </p>
            <Link
              href={`/${kidId}`}
              className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 font-bold text-white shadow-sm"
            >
              Back to quests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-6 py-6 md:px-10 md:py-10">
      <Confetti active={showConfetti} seed={kidId === "elio" ? 3 : 9} count={48} />
      <div className="mx-auto w-full max-w-3xl pb-24">
        <header className="mb-6 flex items-center justify-between">
          <Link
            href={`/${kidId}`}
            className="flex h-12 items-center rounded-full bg-white px-4 text-base font-semibold text-ink shadow-sm ring-1 ring-black/5"
          >
            ← Quests
          </Link>
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Science Quest
          </span>
        </header>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-10">
          <div className="text-5xl md:text-6xl" aria-hidden="true">
            {quest.badge.emoji}
          </div>
          <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">{quest.title}</h1>
          <p className="mt-4 text-lg text-ink-soft md:text-xl">{quest.question}</p>

          <ul className="mt-6 grid grid-cols-1 gap-3">
            {quest.choices.map((c, idx) => {
              const isChosen = chosen === c.id;
              const isAnswer = c.id === quest.correctChoiceId;
              const showCorrect = revealed && isAnswer;
              const showWrong = revealed && isChosen && !isAnswer;
              const choiceLetter = String.fromCharCode(65 + idx); // A, B, C…
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => pickChoice(c.id)}
                    disabled={revealed}
                    aria-pressed={isChosen}
                    className={`w-full rounded-2xl px-5 py-4 text-left text-lg font-semibold ring-1 transition md:text-xl ${
                      showCorrect
                        ? "bg-[#dff5e1] ring-[#7fb46a]"
                        : showWrong
                          ? "bg-[#fde6e1] ring-[#e07a5f]"
                          : isChosen
                            ? "bg-bg-soft ring-black/15"
                            : "bg-card ring-black/10 hover:bg-bg-soft"
                    }`}
                  >
                    <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-bg-soft text-base font-bold">
                      {choiceLetter}
                    </span>
                    {c.label}
                    {showCorrect ? <span className="ml-2">✓</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>

          {revealed ? (
            <div className="mt-6 rounded-2xl bg-bg-soft p-5 md:p-6">
              <div className="text-sm font-bold uppercase tracking-wide text-ink-soft">
                {isCorrect ? "Nice thinking!" : "Good guess — here's the scoop"}
              </div>
              <p className="mt-2 text-base md:text-lg">{quest.explanation}</p>
            </div>
          ) : null}
        </section>

        {revealed ? (
          <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-10">
            <h2 className="text-xl font-bold md:text-2xl">Mini Mission</h2>
            <p className="mt-2 text-base text-ink-soft md:text-lg">{quest.miniMission}</p>
            <button
              type="button"
              onClick={() => setMissionDone((v) => !v)}
              aria-pressed={missionDone}
              className={`mt-5 inline-flex items-center gap-3 rounded-full px-5 py-3 text-base font-bold ring-1 transition md:text-lg ${
                missionDone
                  ? "bg-[#dff5e1] text-[#3a6b40] ring-[#7fb46a]"
                  : "bg-white text-ink ring-black/15 hover:bg-bg-soft"
              }`}
            >
              <span aria-hidden="true">{missionDone ? "✓" : "○"}</span>
              {missionDone ? "I tried it!" : "Mark as tried"}
            </button>
          </section>
        ) : null}

        {revealed ? (
          <section className="mt-6 rounded-3xl bg-gradient-to-br from-[#fff3df] to-[#fde4cf] p-6 shadow-sm ring-1 ring-[#e07a5f]/20 md:p-10">
            <div className="flex items-center gap-5">
              <div className={`text-6xl ${claimed ? "animate-pop" : ""}`} aria-hidden="true">
                {quest.badge.emoji}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold uppercase tracking-wide text-ink-soft">
                  {claimed ? "Badge earned" : "Unlock your badge"}
                </div>
                <div className="mt-1 text-2xl font-bold md:text-3xl">{quest.badge.name}</div>
              </div>
              {claimed ? null : (
                <button
                  type="button"
                  onClick={claimBadge}
                  className="rounded-full bg-accent px-5 py-3 font-bold text-white shadow-sm transition hover:bg-accent-soft"
                >
                  Claim badge
                </button>
              )}
            </div>

            {claimed ? (
              <ClaimedActions
                kidId={kidId}
                kidAccent={kidAccent}
                onPlayGame={() => setPlayingGame(true)}
              />
            ) : null}
          </section>
        ) : null}
      </div>

      <GameSession
        open={playingGame}
        onClose={() => setPlayingGame(false)}
        kidId={kidId}
        accentColor={kidAccent}
      />
    </div>
  );
}

/** Shows game button or access-denied message after badge claim */
function ClaimedActions({
  kidId,
  kidAccent,
  onPlayGame,
}: {
  kidId: KidId;
  kidAccent: string;
  onPlayGame: () => void;
}) {
  const state = useAppState();
  const access: GameAccessCheck = useMemo(
    () => checkGameAccess(kidId, state[kidId]),
    [kidId, state],
  );

  return (
    <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
      {access.allowed ? (
        <button
          type="button"
          onClick={onPlayGame}
          className="flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-base font-bold text-ink shadow-sm ring-1 ring-black/10 transition hover:bg-bg-soft md:text-lg"
        >
          <span aria-hidden="true">🎮</span>
          Play a game
        </button>
      ) : (
        <div className="flex items-center gap-2 rounded-full bg-white/70 px-5 py-3 text-sm text-ink-soft ring-1 ring-black/5 md:text-base">
          <span aria-hidden="true">
            {access.denied === "no-yesterday-quests"
              ? "📋"
              : access.denied === "outside-time-window"
                ? "🕐"
                : access.denied === "daily-limit-reached"
                  ? "✅"
                  : "💤"}
          </span>
          <span>{access.message}</span>
        </div>
      )}
      <Link
        href="/"
        className="rounded-full px-6 py-3 text-center text-base font-bold text-white shadow-sm md:text-lg"
        style={{ backgroundColor: kidAccent }}
      >
        Done
      </Link>
    </div>
  );
}
