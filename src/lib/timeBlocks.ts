import type { QuestGroup } from "./types";

/**
 * Each block becomes "active" at its start time and stays active until the
 * NEXT block starts. Night spans across midnight back to morning's start.
 *
 * Schedule (matches family routine):
 *   morning      6:00 am   →  before/at school
 *   afterschool  2:00 pm   →  pickup / play / snack
 *   dinner       5:00 pm   →  meal time
 *   night        6:30 pm   →  bedtime prep, lasts through the night
 */
export type BlockSchedule = { hour: number; minute: number };

export const blockSchedule: Record<QuestGroup, BlockSchedule> = {
  morning: { hour: 6, minute: 0 },
  afterschool: { hour: 14, minute: 0 },
  dinner: { hour: 17, minute: 0 },
  night: { hour: 18, minute: 30 },
};

export const dayStart = blockSchedule.morning;

const MIN_PER_DAY = 24 * 60;

/** Minutes since the start of our "kid day" (6am), wrapping past midnight. */
export function minutesSinceDayStart(now: Date): number {
  const m = now.getHours() * 60 + now.getMinutes();
  const start = dayStart.hour * 60 + dayStart.minute;
  return (m - start + MIN_PER_DAY) % MIN_PER_DAY;
}

/** Block start time, expressed as minutes since day start. */
export const blockStartInMinutes: Record<QuestGroup, number> = {
  morning: 0,
  afterschool:
    (blockSchedule.afterschool.hour - blockSchedule.morning.hour) * 60 +
    (blockSchedule.afterschool.minute - blockSchedule.morning.minute),
  dinner:
    (blockSchedule.dinner.hour - blockSchedule.morning.hour) * 60 +
    (blockSchedule.dinner.minute - blockSchedule.morning.minute),
  night:
    (blockSchedule.night.hour - blockSchedule.morning.hour) * 60 +
    (blockSchedule.night.minute - blockSchedule.morning.minute),
};

export type BlockState = "active" | "past" | "future";

/** Pick the block whose start time is the latest one before "now". */
export function getActiveBlock(now: Date): QuestGroup {
  const elapsed = minutesSinceDayStart(now);
  if (elapsed >= blockStartInMinutes.night) return "night";
  if (elapsed >= blockStartInMinutes.dinner) return "dinner";
  if (elapsed >= blockStartInMinutes.afterschool) return "afterschool";
  return "morning";
}

export function getBlockState(block: QuestGroup, now: Date): BlockState {
  const active = getActiveBlock(now);
  if (block === active) return "active";
  if (blockStartInMinutes[block] < blockStartInMinutes[active]) return "past";
  return "future";
}

/** Friendly label like "6am", "2pm", "6:30pm". */
export function blockStartLabel(block: QuestGroup): string {
  const { hour, minute } = blockSchedule[block];
  const ampm = hour >= 12 ? "pm" : "am";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return minute === 0 ? `${h12}${ampm}` : `${h12}:${String(minute).padStart(2, "0")}${ampm}`;
}

/** Order blocks chronologically: morning → afterschool → dinner → night. */
export const blockOrderChronological: QuestGroup[] = [
  "morning",
  "afterschool",
  "dinner",
  "night",
];
