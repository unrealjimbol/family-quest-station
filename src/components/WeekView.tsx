"use client";

import { useMemo } from "react";
import { elioQuests, emiliaQuests } from "@/data/quests";
import { scienceQuests } from "@/data/scienceQuests";
import { todayStr } from "@/lib/storage";
import { useAppState } from "@/lib/store";
import { blockOrderChronological } from "@/lib/timeBlocks";
import type { DaySnapshot, KidId, Quest, QuestGroup } from "@/lib/types";

type DayCell = {
  date: string;
  isToday: boolean;
  doneIds: string[];
  vibe?: DaySnapshot["vibe"];
  scienceQuestEarned?: string;
};

function buildLast7Days(today: string, history: DaySnapshot[], todaySnap: DaySnapshot): DayCell[] {
  const cells: DayCell[] = [];
  const todayDate = new Date(today + "T12:00:00");
  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayDate);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${day}`;
    const isToday = dateStr === today;

    if (isToday) {
      cells.push({
        date: dateStr,
        isToday: true,
        doneIds: todaySnap.completedQuestIds,
        vibe: todaySnap.vibe,
        scienceQuestEarned: todaySnap.scienceQuestEarned,
      });
    } else {
      const snap = history.find((h) => h.date === dateStr);
      cells.push({
        date: dateStr,
        isToday: false,
        doneIds: snap?.completedQuestIds ?? [],
        vibe: snap?.vibe,
        scienceQuestEarned: snap?.scienceQuestEarned,
      });
    }
  }
  return cells;
}

function dayLabel(dateStr: string, isToday: boolean): string {
  if (isToday) return "Today";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

function quickDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const groupEmoji: Record<QuestGroup, string> = {
  morning: "🌅",
  afterschool: "🌳",
  dinner: "🍽️",
  night: "🌙",
};

const groupColor: Record<QuestGroup, string> = {
  morning: "var(--morning)",
  afterschool: "var(--afterschool)",
  dinner: "var(--dinner)",
  night: "var(--night)",
};

function questsByGroup(quests: Quest[]): Record<QuestGroup, Quest[]> {
  const map: Record<QuestGroup, Quest[]> = {
    morning: [],
    afterschool: [],
    dinner: [],
    night: [],
  };
  for (const q of quests) map[q.group].push(q);
  return map;
}

type Props = {
  kidId: KidId;
  kidName: string;
  kidEmoji: string;
  accentColor: string;
};

export default function KidWeekView({ kidId, kidName, kidEmoji, accentColor }: Props) {
  const state = useAppState();
  const kid = state[kidId];
  const today = todayStr();
  const quests = kidId === "elio" ? elioQuests : emiliaQuests;
  const byGroup = useMemo(() => questsByGroup(quests), [quests]);

  const todaySnap: DaySnapshot = {
    date: today,
    completedQuestIds: kid.today.completedQuestIds,
    vibe: kid.today.vibe,
    scienceQuestEarned: kid.today.scienceClaimedQuestId,
  };

  const cells = useMemo(
    () => buildLast7Days(today, kid.history, todaySnap),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [today, kid.history, kid.today],
  );

  return (
    <section
      className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7"
      aria-label={`${kidName}'s week`}
    >
      <header className="mb-5 flex items-center gap-3">
        <span className="text-3xl md:text-4xl" aria-hidden="true">
          {kidEmoji}
        </span>
        <div className="flex-1">
          <h2 className="text-lg font-bold md:text-xl">{kidName}&apos;s week</h2>
          <p className="text-sm text-ink-soft">
            Last 7 days. Filled dots = done. No scores, just patterns.
          </p>
        </div>
      </header>

      <div className="space-y-2">
        {cells.map((cell) => (
          <DayRow
            key={cell.date}
            cell={cell}
            byGroup={byGroup}
            accentColor={accentColor}
          />
        ))}
      </div>
    </section>
  );
}

type DayRowProps = {
  cell: DayCell;
  byGroup: Record<QuestGroup, Quest[]>;
  accentColor: string;
};

function DayRow({ cell, byGroup, accentColor }: DayRowProps) {
  const doneSet = useMemo(() => new Set(cell.doneIds), [cell.doneIds]);
  const earnedScience = cell.scienceQuestEarned
    ? scienceQuests.find((s) => s.id === cell.scienceQuestEarned)
    : undefined;

  return (
    <div
      className={`flex flex-wrap items-center gap-3 rounded-2xl px-3 py-3 md:flex-nowrap md:gap-4 md:px-4 ${
        cell.isToday ? "bg-bg-soft ring-1 ring-black/10" : ""
      }`}
      style={cell.isToday ? { boxShadow: `inset 0 0 0 1px ${accentColor}40` } : undefined}
    >
      <div className="w-20 shrink-0">
        <div className="text-sm font-bold md:text-base">
          {dayLabel(cell.date, cell.isToday)}
        </div>
        <div className="text-xs text-ink-soft">{quickDate(cell.date)}</div>
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-3 md:flex-nowrap md:gap-5">
        {blockOrderChronological.map((g) => {
          const quests = byGroup[g];
          if (quests.length === 0) return null;
          return (
            <div key={g} className="flex items-center gap-1.5">
              <span className="text-base md:text-lg" aria-hidden="true">
                {groupEmoji[g]}
              </span>
              <div className="flex items-center gap-1">
                {quests.map((q) => {
                  const done = doneSet.has(q.id);
                  return (
                    <span
                      key={q.id}
                      aria-label={done ? `${q.label} done` : `${q.label} not done`}
                      className="block h-3 w-3 rounded-full md:h-3.5 md:w-3.5"
                      style={{
                        backgroundColor: done ? groupColor[g] : "transparent",
                        boxShadow: done ? "none" : "inset 0 0 0 1.5px rgba(58,46,34,0.18)",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        {cell.vibe ? (
          <span title={cell.vibe.label} className="text-xl md:text-2xl" aria-hidden="true">
            {cell.vibe.emoji}
          </span>
        ) : null}
        {earnedScience ? (
          <span
            title={earnedScience.badge.name}
            className="text-xl md:text-2xl"
            aria-hidden="true"
          >
            {earnedScience.badge.emoji}
          </span>
        ) : null}
      </div>
    </div>
  );
}
