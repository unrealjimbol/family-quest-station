"use client";

import { useState } from "react";
import QuestBoard from "@/components/QuestBoard";
import QuestTransition from "@/components/QuestTransition";
import VibeCheck from "@/components/VibeCheck";
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

  // If kid already vibed today, go straight to board.
  // Otherwise start at vibe-check.
  const [phase, setPhase] = useState<Phase>(hasVibe ? "board" : "vibe");

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
        quests={quests}
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
    </>
  );
}
