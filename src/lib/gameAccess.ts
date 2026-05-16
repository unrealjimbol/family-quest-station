/**
 * Game access control — anti-addiction system.
 *
 * All four conditions must be met for a kid to play:
 *  1. Delayed reward — yesterday they completed >= YESTERDAY_QUEST_THRESHOLD quests
 *  2. Time window   — current time is within the allowed play window
 *  3. Daily limit   — haven't used their 1 daily game session yet
 *  4. No cooldown   — not currently in the 1-hour post-session cooldown
 *
 * The game entry point has been removed from the quest board.
 * Games are only accessible through Science Quest (requires 5 quests + trivia).
 */

import type { KidId, KidState } from "./types";
import { isWeekday } from "./customQuests";
import { getCooldownRemaining } from "./gameTimer";

// --- Configurable thresholds ---

const YESTERDAY_QUEST_THRESHOLD = 5;

// Time windows (24-hour format)
const WEEKDAY_WINDOW = { start: 16, end: 18 }; // 4 PM – 6 PM
const WEEKEND_WINDOW = { start: 10, end: 12 }; // 10 AM – 12 PM

const MAX_DAILY_SESSIONS = 1;

const SESSION_KEY = "fqs.v1.dailyGameSessions";

// --- Types ---

export type DeniedReason =
  | "no-yesterday-quests"
  | "outside-time-window"
  | "daily-limit-reached"
  | "cooldown";

export type GameAccessCheck = {
  allowed: boolean;
  denied?: DeniedReason;
  /** Human-readable message explaining why */
  message?: string;
  /** Extra data for UI display */
  meta?: {
    windowStart?: number;
    windowEnd?: number;
    yesterdayCount?: number;
    threshold?: number;
  };
};

// --- Yesterday's quest count ---

function yesterdayStr(): string {
  const d = new Date();
  // Respect the 6 AM rollover: if before 6 AM, "today" is actually yesterday,
  // so "yesterday" is the day before that.
  if (d.getHours() < 6) {
    d.setDate(d.getDate() - 2);
  } else {
    d.setDate(d.getDate() - 1);
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getYesterdayQuestCount(kidState: KidState): number {
  const yStr = yesterdayStr();

  // Check today's date first — if today IS yesterday (before 6 AM rollover edge case)
  if (kidState.today.date === yStr) {
    return kidState.today.completedQuestIds.length;
  }

  // Otherwise look in history
  const snap = kidState.history.find((h) => h.date === yStr);
  return snap ? snap.completedQuestIds.length : 0;
}

// --- Time window ---

function getCurrentWindow(): { start: number; end: number } {
  return isWeekday() ? WEEKDAY_WINDOW : WEEKEND_WINDOW;
}

export function isInGameWindow(): boolean {
  const hour = new Date().getHours();
  const w = getCurrentWindow();
  return hour >= w.start && hour < w.end;
}

// --- Daily session count ---

type DailySessionData = Record<string, Record<string, number>>; // { kidId: { dateStr: count } }

function todayDateStr(): string {
  const d = new Date();
  if (d.getHours() < 6) d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function loadSessions(): DailySessionData {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as DailySessionData) : {};
  } catch {
    return {};
  }
}

function saveSessions(data: DailySessionData) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {}
}

export function getSessionsToday(kidId: KidId): number {
  const all = loadSessions();
  return all[kidId]?.[todayDateStr()] ?? 0;
}

export function recordSession(kidId: KidId) {
  const all = loadSessions();
  const dateStr = todayDateStr();
  if (!all[kidId]) all[kidId] = {};
  all[kidId][dateStr] = (all[kidId][dateStr] ?? 0) + 1;

  // Clean up old dates (keep only last 3 days)
  for (const kid of Object.keys(all)) {
    const dates = Object.keys(all[kid]);
    if (dates.length > 3) {
      dates.sort();
      for (const old of dates.slice(0, -3)) {
        delete all[kid][old];
      }
    }
  }

  saveSessions(all);
}

// --- Main check ---

export function checkGameAccess(kidId: KidId, kidState: KidState): GameAccessCheck {
  // 1. Delayed reward — yesterday's quests
  const yesterdayCount = getYesterdayQuestCount(kidState);
  if (yesterdayCount < YESTERDAY_QUEST_THRESHOLD) {
    return {
      allowed: false,
      denied: "no-yesterday-quests",
      message:
        yesterdayCount === 0
          ? "Complete quests today — games unlock tomorrow!"
          : `Yesterday you did ${yesterdayCount} quests. Need ${YESTERDAY_QUEST_THRESHOLD} to unlock games today!`,
      meta: {
        yesterdayCount,
        threshold: YESTERDAY_QUEST_THRESHOLD,
      },
    };
  }

  // 2. Time window
  const w = getCurrentWindow();
  if (!isInGameWindow()) {
    const hour = new Date().getHours();
    const beforeWindow = hour < w.start;
    return {
      allowed: false,
      denied: "outside-time-window",
      message: beforeWindow
        ? `Games open at ${formatHour(w.start)}. Come back later!`
        : `Game time ended at ${formatHour(w.end)}. See you tomorrow!`,
      meta: { windowStart: w.start, windowEnd: w.end },
    };
  }

  // 3. Daily session limit
  const sessionsToday = getSessionsToday(kidId);
  if (sessionsToday >= MAX_DAILY_SESSIONS) {
    return {
      allowed: false,
      denied: "daily-limit-reached",
      message: "You already played today! One game break per day.",
    };
  }

  // 4. Cooldown (existing timer system)
  const cooldown = getCooldownRemaining(kidId);
  if (cooldown > 0) {
    return {
      allowed: false,
      denied: "cooldown",
      message: "Games are resting. Try again later!",
    };
  }

  return { allowed: true };
}

function formatHour(h: number): string {
  if (h === 0 || h === 12) return `${h === 0 ? 12 : 12}:00 ${h < 12 ? "AM" : "PM"}`;
  return `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? "PM" : "AM"}`;
}

// --- Exported constants for display ---

export const GAME_WINDOW = {
  weekday: WEEKDAY_WINDOW,
  weekend: WEEKEND_WINDOW,
};

export const QUEST_THRESHOLD = YESTERDAY_QUEST_THRESHOLD;
export const DAILY_SESSION_LIMIT = MAX_DAILY_SESSIONS;
