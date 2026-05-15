"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PointsTracker from "@/components/PointsTracker";
import QuestBoard from "@/components/QuestBoard";
import QuestTransition from "@/components/QuestTransition";
import SleepCeremony from "@/components/SleepCeremony";
import VibeCheck from "@/components/VibeCheck";
import { getQuests } from "@/lib/customQuests";
import { getBalance } from "@/lib/points";
import { todayStr } from "@/lib/storage";
import { updateState, useAppState } from "@/lib/store";
import type { KidId, Quest } from "@/lib/types";

type Props = {
  kidId: KidId;
  kidName: string;
  kidEmoji: string;
  quests: Quest[];
  accent: { tile: string; ring: string; chip: string };
  progressColor: string;
};

type Phase = "vibe" | "transitioning" | "board";

export default function KidView({
  kidId,
  kidName,
  kidEmoji,
  quests,
  accent,
  progressColor,
}: Props) {
  const state = useAppState();
  const todayVibe = state[kidId].today.vibe;
  const hasVibe = Boolean(todayVibe);
  const completed = state[kidId].today.completedQuestIds;

  // Use custom quests if parent has configured them, else fall back to defaults
  const activeQuests = useMemo(() => getQuests(kidId), [kidId]);

  // If kid already vibed today, go straight to board.
  // Otherwise start at vibe-check.
  const [phase, setPhase] = useState<Phase>(hasVibe ? "board" : "vibe");
  const [showSleepCeremony, setShowSleepCeremony] = useState(false);
  const [sleepCeremonyDismissed, setSleepCeremonyDismissed] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const [pointsVersion, setPointsVersion] = useState(0);

  // Detect when all night quests are done
  const nightQuests = useMemo(() => activeQuests.filter((q) => q.group === "night"), [activeQuests]);
  const allNightDone = nightQuests.length > 0 && nightQuests.every((q) => completed.includes(q.id));
  const prevAllNightDone = useRef(allNightDone);

  // Auto-trigger sleep ceremony when all night quests complete
  // (only once per session, not if user dismissed it)
  useEffect(() => {
    if (allNightDone && !prevAllNightDone.current && !sleepCeremonyDismissed && phase === "board") {
      setShowSleepCeremony(true);
    }
    prevAllNightDone.current = allNightDone;
  }, [allNightDone, sleepCeremonyDismissed, phase]);

  function handleVibeContinue() {
    setPhase("transitioning");
  }

  function handleTransitionDone() {
    setPhase("board");
  }

  function redoVibe() {
    updateState((prev) => ({
      ...prev,
      [kidId]: {
        ...prev[kidId],
        today: {
          ...prev[kidId].today,
          date: todayStr(),
          vibe: undefined,
        },
      },
    }));
    setPhase("vibe");
  }

  if (phase === "vibe") {
    return (
      <VibeCheck
        kidId={kidId}
        kidEmoji={kidEmoji}
        onContinue={handleVibeContinue}
        accentColor={progressColor}
      />
    );
  }

  return (
    <>
      <QuestBoard
        kidId={kidId}
        kidName={kidName}
        kidEmoji={kidEmoji}
        quests={activeQuests}
        accent={accent}
        progressColor={progressColor}
        onRedoVibe={redoVibe}
      />

      {/* Floating points button — pointsVersion forces re-read after tracker closes */}
      {phase === "board" ? (
        <PointsFab kidId={kidId} progressColor={progressColor} version={pointsVersion} onOpen={() => setShowPoints(true)} />
      ) : null}

      {/* Points tracker overlay */}
      {showPoints ? (
        <PointsTracker
          kidId={kidId}
          kidName={kidName}
          kidEmoji={kidEmoji}
          accentColor={progressColor}
          onClose={() => {
            setShowPoints(false);
            setPointsVersion((v) => v + 1);
          }}
        />
      ) : null}

      {phase === "transitioning" ? (
        <QuestTransition
          kidEmoji={kidEmoji}
          vibeEmoji={todayVibe?.emoji}
          vibeKey={todayVibe?.key}
          accentColor={progressColor}
          onDone={handleTransitionDone}
        />
      ) : null}
      {showSleepCeremony ? (
        <SleepCeremony
          kidId={kidId}
          kidName={kidName}
          kidEmoji={kidEmoji}
          onClose={() => {
            setShowSleepCeremony(false);
            setSleepCeremonyDismissed(true);
          }}
        />
      ) : null}
    </>
  );
}

/** Floating action button showing cumulative point balance */
function PointsFab({
  kidId,
  progressColor,
  version,
  onOpen,
}: {
  kidId: KidId;
  progressColor: string;
  version: number;
  onOpen: () => void;
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const total = useMemo(() => getBalance(kidId), [kidId, version]);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-40 flex h-14 items-center gap-2 rounded-full bg-white px-5 shadow-lg ring-1 ring-black/10 transition active:scale-95 md:bottom-8 md:right-8 md:h-16 md:px-6"
      style={{ boxShadow: `0 4px 20px ${progressColor}30` }}
      aria-label="Open points tracker"
    >
      <span className="text-xl md:text-2xl" aria-hidden="true">⭐</span>
      <span className="text-base font-bold md:text-lg" style={{ color: progressColor }}>
        {total}
      </span>
      <span className="text-xs font-medium text-ink-soft md:text-sm">pts</span>
    </button>
  );
}
