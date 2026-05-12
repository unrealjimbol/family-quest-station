import type { DaySnapshot, DayState } from "./types";
import { todayStr } from "./storage";

/**
 * Calculate current streak: consecutive days with at least 1 quest completed,
 * counting backwards from today.
 */
export function calcStreak(
  history: DaySnapshot[],
  today: DayState,
): number {
  const currentDay = todayStr();
  const todayHasQuests = today.completedQuestIds.length > 0;

  // Build a set of dates that had completions
  const activeDates = new Set<string>();
  for (const snap of history) {
    if (snap.completedQuestIds.length > 0) {
      activeDates.add(snap.date);
    }
  }
  // Include today if it has quests
  if (todayHasQuests) {
    activeDates.add(currentDay);
  }

  if (!activeDates.has(currentDay)) return 0;

  let streak = 0;
  const d = new Date(currentDay + "T12:00:00");

  for (let i = 0; i < 60; i++) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${day}`;

    if (activeDates.has(dateStr)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
