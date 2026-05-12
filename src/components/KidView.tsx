"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QuestBoard from "@/components/QuestBoard";
import QuestTransition from "@/components/QuestTransition";
import SleepCeremony from "@/components/SleepCeremony";
import VibeCheck from "@/components/VibeCheck";
import { getQuests } from "@/lib/customQuests";
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
