/**
 * Game timer utilities — 5-minute play limit with 1-hour cooldown.
 * Uses localStorage to persist cooldown across page refreshes.
 */

import type { KidId } from "./types";

const TIMER_KEY = "fqs.v1.gameTimer";
const PLAY_LIMIT_MS = 5 * 60 * 1000; // 5 minutes
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

type TimerData = {
  /** Timestamp when the current session started (or null if not playing) */
  sessionStart: number | null;
  /** Timestamp when cooldown started (after time ran out) */
  cooldownStart: number | null;
};

type AllTimers = Record<string, TimerData>;

function loadTimers(): AllTimers {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(TIMER_KEY);
    return raw ? (JSON.parse(raw) as AllTimers) : {};
  } catch {
    return {};
  }
}

function saveTimers(data: AllTimers) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TIMER_KEY, JSON.stringify(data));
  } catch {}
}

function getTimer(kidId: KidId): TimerData {
  const all = loadTimers();
  return all[kidId] ?? { sessionStart: null, cooldownStart: null };
}

function setTimer(kidId: KidId, data: TimerData) {
  const all = loadTimers();
  all[kidId] = data;
  saveTimers(all);
}

/** Check if kid is currently in cooldown. Returns remaining ms or 0. */
export function getCooldownRemaining(kidId: KidId): number {
  const t = getTimer(kidId);
  if (!t.cooldownStart) return 0;
  const elapsed = Date.now() - t.cooldownStart;
  const remaining = COOLDOWN_MS - elapsed;
  if (remaining <= 0) {
    // Cooldown expired — clear it
    setTimer(kidId, { sessionStart: null, cooldownStart: null });
    return 0;
  }
  return remaining;
}

/** Start a game session. Returns false if in cooldown. */
export function startGameSession(kidId: KidId): boolean {
  if (getCooldownRemaining(kidId) > 0) return false;
  const t = getTimer(kidId);
  if (!t.sessionStart) {
    setTimer(kidId, { sessionStart: Date.now(), cooldownStart: null });
  }
  return true;
}

/** Get remaining play time in ms. Returns 0 if time is up. */
export function getPlayTimeRemaining(kidId: KidId): number {
  const t = getTimer(kidId);
  if (!t.sessionStart) return PLAY_LIMIT_MS;
  const elapsed = Date.now() - t.sessionStart;
  const remaining = PLAY_LIMIT_MS - elapsed;
  if (remaining <= 0) return 0;
  return remaining;
}

/** End the session and trigger cooldown */
export function triggerCooldown(kidId: KidId) {
  setTimer(kidId, { sessionStart: null, cooldownStart: Date.now() });
}

/** Reset timer (for testing/parent use) */
export function resetGameTimer(kidId: KidId) {
  setTimer(kidId, { sessionStart: null, cooldownStart: null });
}

export const PLAY_LIMIT_MINUTES = 5;
export const COOLDOWN_MINUTES = 60;
