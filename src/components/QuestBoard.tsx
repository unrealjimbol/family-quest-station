"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import Confetti from "@/components/Confetti";
import { groupMeta } from "@/data/quests";
import type { KidId, Quest, QuestGroup } from "@/lib/types";
import { todayStr } from "@/lib/storage";
import { updateState, useAppState } from "@/lib/store";
import {
  blockOrderChronological,
  blockStartLabel,
  getBlockState,
  type BlockState,
} from "@/lib/timeBlocks";
import { playTick, playUntick, playChime, playFanfare } from "@/lib/sounds";
import { calcStreak } from "@/lib/streak";
import { useNowTick } from "@/lib/useClock";

const UNLOCK_THRESHOLD = 5;

const BLOCK_CHEERS: Record<QuestGroup, { emoji: string; message: string }> = {
  morning: { emoji: "🚀", message: "Morning hero! Ready to go!" },
  afterschool: { emoji: "🎮", message: "Crushed it! Free time earned!" },
  dinner: { emoji: "🏆", message: "Table champion!" },
  night: { emoji: "🌙", message: "Night owl complete!" },
};

type Props = {
  kidId: KidId;
  kidName: string;
  kidEmoji: string;
  quests: Quest[];
  accent: { tile: string; ring: string; chip: string };
  progressColor?: string;
  onRedoVibe?: () => void;
};

export default function QuestBoard({
  kidId,
  kidName,
  kidEmoji,
  quests,
  accent,
  progressColor = "#e07a5f",
  onRedoVibe,
}: Props) {
  // Re-render every 30s + on focus so the active block stays in sync.
  const tick = useNowTick();
  // On the server, tick is 0 — we treat that as "all blocks active" (no
  // gating yet) so SSR doesn't claim a wrong active block. Once hydrated,
  // tick becomes a real value and gating kicks in.
  const isHydrated = tick > 0;
  // tick is intentionally unused as a value — it's here to force a re-render
  // when the minute changes so getActiveBlock() picks up the new time.
  void tick;
  const now = new Date();

  const state = useAppState();
  const todayState = state[kidId].today;
  const completed = todayState.completedQuestIds;
  const scienceUnlocked = todayState.scienceUnlocked;
  const vibe = todayState.vibe;
  const badgeCount = state[kidId].badges.length;
  const streak = useMemo(
    () => calcStreak(state[kidId].history, todayState),
    [state[kidId].history, todayState],
  );

  const [justCompleted, setJustCompleted] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [manualToggles, setManualToggles] = useState<Partial<Record<QuestGroup, boolean>>>({});
  const [celebratingBlock, setCelebratingBlock] = useState<QuestGroup | null>(null);
  const celebratedBlocks = useRef<Set<QuestGroup>>(new Set());
  const wasUnlocked = useRef(scienceUnlocked);

  const completedSet = useMemo(() => new Set(completed), [completed]);
  const total = quests.length;
  const doneCount = completed.length;
  const percent = total === 0 ? 0 : Math.min(100, Math.round((doneCount / total) * 100));

  const grouped = useMemo(() => {
    const map: Record<QuestGroup, Quest[]> = {
      night: [],
      morning: [],
      afterschool: [],
      dinner: [],
    };
    for (const q of quests) map[q.group].push(q);
    return map;
  }, [quests]);

  function blockState(group: QuestGroup): BlockState {
    if (!isHydrated) return "active"; // pre-hydration: show everything
    return getBlockState(group, now);
  }

  function isExpanded(group: QuestGroup): boolean {
    const state = blockState(group);
    if (state === "future") return false; // locked = never expanded
    if (manualToggles[group] !== undefined) return manualToggles[group]!;
    return state === "active"; // default: only active is expanded
  }

  function toggleExpanded(group: QuestGroup) {
    const state = blockState(group);
    if (state === "future") return; // can't open locked
    setManualToggles((prev) => ({
      ...prev,
      [group]: !isExpanded(group),
    }));
  }

  function toggleQuest(questId: string) {
    const isDone = completed.includes(questId);
    updateState((prev) => {
      const cur = prev[kidId].today;
      const next = isDone
        ? cur.completedQuestIds.filter((id) => id !== questId)
        : [...cur.completedQuestIds, questId];
      const unlocked = next.length >= UNLOCK_THRESHOLD;
      return {
        ...prev,
        [kidId]: {
          ...prev[kidId],
          today: {
            ...cur,
            date: todayStr(),
            completedQuestIds: next,
            scienceUnlocked: unlocked || cur.scienceUnlocked,
          },
        },
      };
    });
    if (!isDone) {
      playTick();
      setJustCompleted(questId);
      setTimeout(() => setJustCompleted((cur) => (cur === questId ? null : cur)), 600);
      const willUnlock = !wasUnlocked.current && completed.length + 1 >= UNLOCK_THRESHOLD;
      if (willUnlock) {
        wasUnlocked.current = true;
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3500);
        playFanfare();
      }
      // Check if this quest's block is now fully complete
      const quest = quests.find((q) => q.id === questId);
      if (quest) {
        const blockQuests = grouped[quest.group];
        const newCompleted = [...completed, questId];
        const blockDone = blockQuests.every((q) => newCompleted.includes(q.id));
        if (blockDone && !celebratedBlocks.current.has(quest.group) && quest.group !== "night") {
          celebratedBlocks.current.add(quest.group);
          setCelebratingBlock(quest.group);
          setTimeout(() => setCelebratingBlock(null), 2800);
          playChime();
        }
      }
    } else {
      playUntick();
    }
  }

  function handleResetToday() {
    updateState((prev) => ({
      ...prev,
      [kidId]: {
        ...prev[kidId],
        today: {
          date: todayStr(),
          completedQuestIds: [],
          scienceUnlocked: false,
        },
      },
    }));
    setManualToggles({});
  }

  return (
    <div>
      <Confetti active={showConfetti} seed={kidId === "elio" ? 1 : 7} />
      <header className="mb-5 flex items-center justify-between gap-2 md:mb-10 md:gap-4">
        <div className="flex min-w-0 items-center gap-2 md:gap-4">
          <Link
            href="/"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-lg font-semibold text-ink shadow-sm ring-1 ring-black/5 transition hover:bg-bg-soft md:h-12 md:w-auto md:px-4 md:text-base"
            aria-label="Back to home"
          >
            <span aria-hidden="true">←</span>
            <span className="ml-2 hidden md:inline">Home</span>
          </Link>
          <div className="flex min-w-0 items-center gap-2 md:gap-3">
            <div className="text-3xl md:text-5xl" aria-hidden="true">
              {kidEmoji}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold leading-tight md:text-3xl">
                Hi, {kidName}!
              </h1>
              <p className="hidden text-sm text-ink-soft md:block md:text-base">
                Today&apos;s quests
              </p>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {streak >= 2 ? (
            <div
              className="flex h-11 items-center gap-1 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 px-3 text-sm font-bold text-orange-600 shadow-sm ring-1 ring-orange-200/60 md:h-12 md:gap-1.5 md:px-4 md:text-base"
              aria-label={`${streak} day streak`}
            >
              <span aria-hidden="true">🔥</span>
              <span>{streak}</span>
            </div>
          ) : null}
          <Link
            href={`/badges/${kidId}`}
            className="flex h-11 items-center gap-1.5 rounded-full bg-white px-3 text-sm font-semibold text-ink shadow-sm ring-1 ring-black/5 transition hover:bg-bg-soft md:h-12 md:gap-2 md:px-4 md:text-base"
            aria-label={`${badgeCount} badges`}
          >
            <span aria-hidden="true">🏆</span>
            <span>{badgeCount}</span>
            <span className="hidden md:inline">badges</span>
          </Link>
        </div>
      </header>

      {vibe ? (
        <section
          className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-black/5 backdrop-blur md:px-5"
          aria-label="Today's vibe"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl md:text-3xl" aria-hidden="true">
              {vibe.emoji}
            </span>
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wide text-ink-soft">Today&apos;s vibe</div>
              <div className="truncate text-sm font-semibold md:text-base">{vibe.label}</div>
            </div>
          </div>
          {onRedoVibe ? (
            <button
              type="button"
              onClick={onRedoVibe}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft ring-1 ring-black/5 hover:bg-bg-soft md:text-sm"
            >
              Change
            </button>
          ) : null}
        </section>
      ) : null}

      <section
        className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7"
        aria-label="Progress"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-base font-semibold md:text-lg">
              {doneCount} of {total} done
            </div>
            <div className="mt-1 text-sm text-ink-soft">
              {scienceUnlocked
                ? "Science Quest unlocked! ✨"
                : `Finish ${Math.max(0, UNLOCK_THRESHOLD - doneCount)} more to unlock a Science Quest`}
            </div>
          </div>
          {scienceUnlocked ? (
            <Link
              href={`/science/${kidId}`}
              className="animate-float rounded-full px-5 py-3 text-sm font-bold text-white shadow-sm transition md:text-base"
              style={{ backgroundColor: progressColor }}
            >
              🔬 Open Science Quest
            </Link>
          ) : null}
        </div>
        <div
          className="mt-4 h-4 w-full overflow-hidden rounded-full bg-bg-soft"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percent}%`, backgroundColor: progressColor }}
          />
        </div>
      </section>

      <div className="space-y-4 md:space-y-5">
        {blockOrderChronological.map((groupKey) => {
          const meta = groupMeta[groupKey];
          const groupQuests = grouped[groupKey];
          if (!groupQuests || groupQuests.length === 0) return null;
          const state = blockState(groupKey);
          const expanded = isExpanded(groupKey);
          const groupDone = groupQuests.filter((q) => completedSet.has(q.id)).length;
          const groupTotal = groupQuests.length;
          const allDone = groupDone === groupTotal;

          if (state === "future") {
            return (
              <FutureBlock
                key={groupKey}
                groupKey={groupKey}
                title={meta.title}
                emoji={groupEmoji(groupKey)}
              />
            );
          }

          return (
            <BlockSection
              key={groupKey}
              groupKey={groupKey}
              title={meta.title}
              subtitle={meta.subtitle}
              emoji={groupEmoji(groupKey)}
              meta={meta}
              state={state}
              expanded={expanded}
              onToggle={() => toggleExpanded(groupKey)}
              groupDone={groupDone}
              groupTotal={groupTotal}
              allDone={allDone}
            >
              <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {groupQuests.map((q) => {
                  const done = completedSet.has(q.id);
                  const popping = justCompleted === q.id;
                  return (
                    <li key={q.id}>
                      <button
                        type="button"
                        onClick={() => toggleQuest(q.id)}
                        aria-pressed={done}
                        className={`flex w-full items-center gap-4 rounded-2xl bg-card p-4 text-left shadow-sm ring-1 ring-black/5 transition-all duration-300 active:scale-[0.99] md:p-5 ${
                          done ? "opacity-70" : ""
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl transition-all duration-300 ${
                            done ? accent.tile : "bg-bg-soft"
                          }`}
                        >
                          <span
                            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                              done ? "opacity-0" : "opacity-100"
                            }`}
                          >
                            {q.emoji}
                          </span>
                          {done ? (
                            <svg
                              viewBox="0 0 24 24"
                              className="absolute h-7 w-7"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12.5l4.5 4.5L19 7" className="tick-path" />
                            </svg>
                          ) : null}
                        </span>
                        <span
                          className={`flex-1 text-lg font-semibold md:text-xl transition-all duration-300 ${
                            done ? "line-through text-ink-soft" : ""
                          } ${popping ? "animate-pop" : ""}`}
                        >
                          {q.label}
                        </span>
                        <span
                          className={`hidden h-7 w-7 shrink-0 rounded-full ring-2 transition-all duration-300 md:block ${
                            done ? `${accent.chip} ring-transparent` : "bg-white ring-black/15"
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
              {celebratingBlock === groupKey ? (
                <BlockCheer group={groupKey} />
              ) : null}
            </BlockSection>
          );
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={handleResetToday}
          className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink-soft shadow-sm ring-1 ring-black/5 hover:bg-bg-soft"
        >
          Reset today
        </button>
      </div>
    </div>
  );
}

function groupEmoji(group: QuestGroup): string {
  switch (group) {
    case "morning":
      return "🌅";
    case "afterschool":
      return "🌳";
    case "dinner":
      return "🍽️";
    case "night":
      return "🌙";
  }
}

type BlockMeta = {
  title: string;
  subtitle: string;
  color: string;
  ring: string;
  chip: string;
};

type BlockSectionProps = {
  groupKey: QuestGroup;
  title: string;
  subtitle: string;
  emoji: string;
  meta: BlockMeta;
  state: BlockState;
  expanded: boolean;
  onToggle: () => void;
  groupDone: number;
  groupTotal: number;
  allDone: boolean;
  children: React.ReactNode;
};

function BlockSection({
  title,
  subtitle,
  emoji,
  meta,
  state,
  expanded,
  onToggle,
  groupDone,
  groupTotal,
  allDone,
  children,
}: BlockSectionProps) {
  const isActive = state === "active";

  if (!isActive && !expanded) {
    // Past, collapsed: small strip
    return (
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-left ring-1 ring-black/5 transition hover:bg-white md:px-5"
      >
        <span className="text-2xl md:text-3xl" aria-hidden="true">
          {emoji}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm font-semibold md:text-base">
            <span>{title}</span>
            {allDone ? (
              <span className="text-[#7fb46a]" aria-hidden="true">
                ✓
              </span>
            ) : null}
          </div>
          <div className="text-xs text-ink-soft md:text-sm">
            {groupDone} of {groupTotal} done
            {!allDone ? " · tap to catch up" : ""}
          </div>
        </div>
        <span className="text-ink-soft" aria-hidden="true">
          ▼
        </span>
      </button>
    );
  }

  // Active OR (past expanded)
  return (
    <section
      className={`rounded-3xl p-5 ring-1 md:p-7 ${meta.color} ${meta.ring}`}
      aria-labelledby={`group-${title}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl md:text-4xl" aria-hidden="true">
            {emoji}
          </span>
          <div>
            <div className="flex items-center gap-2">
              {isActive ? (
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${meta.chip}`}>
                  Now
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-soft">
                  Catching up
                </span>
              )}
              <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
            </div>
            <p className="mt-1 text-sm text-ink-soft md:text-base">{subtitle}</p>
          </div>
        </div>
        {!isActive && expanded ? (
          <button
            type="button"
            onClick={onToggle}
            className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-ink-soft hover:bg-white md:text-sm"
          >
            Hide ▲
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function FutureBlock({
  groupKey,
  title,
  emoji,
}: {
  groupKey: QuestGroup;
  title: string;
  emoji: string;
}) {
  return (
    <div
      className="flex w-full items-center gap-3 rounded-2xl bg-white/40 px-4 py-3 text-left ring-1 ring-black/5 md:px-5"
      aria-label={`${title} locked`}
    >
      <span className="text-2xl opacity-50 md:text-3xl" aria-hidden="true">
        {emoji}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink-soft md:text-base">
          <span aria-hidden="true">🔒</span>
          <span>{title}</span>
        </div>
        <div className="text-xs text-ink-soft md:text-sm">
          Comes back at {blockStartLabel(groupKey)}
        </div>
      </div>
    </div>
  );
}

function BlockCheer({ group }: { group: QuestGroup }) {
  const cheer = BLOCK_CHEERS[group];
  return (
    <div className="mt-4 animate-pop overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 px-5 py-4 ring-1 ring-amber-200/60 md:px-6">
      <div className="flex items-center justify-center gap-3">
        <span className="text-2xl md:text-3xl" aria-hidden="true">
          {cheer.emoji}
        </span>
        <span className="text-base font-bold text-amber-900 md:text-lg">
          {cheer.message}
        </span>
        <span className="text-2xl md:text-3xl" aria-hidden="true">
          {cheer.emoji}
        </span>
      </div>
      {/* Mini sparkles */}
      <div className="mt-2 flex justify-center gap-1">
        {["✨", "⭐", "✨", "⭐", "✨"].map((s, i) => (
          <span
            key={i}
            className="text-sm opacity-70"
            style={{
              animation: `pop 400ms ease-out ${i * 80}ms both`,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
