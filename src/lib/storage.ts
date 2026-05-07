"use client";

import type {
  AppState,
  DaySnapshot,
  KidId,
  KidState,
  ParentReset,
  QuietCheckIn,
} from "./types";

const KEY = "fqs.v1.state";
const HISTORY_CAP = 30; // keep last 30 days per kid

/**
 * "Today" rolls over at 6 am, not midnight. So if a kid is doing their Night
 * Quest at 11:30 pm and keeps going past midnight, their progress doesn't get
 * wiped at 12:01 am — they're still on the same "day" until 6 am.
 */
const DAY_ROLLOVER_HOUR = 6;

export function todayStr(): string {
  const d = new Date();
  const useDate = new Date(d);
  if (d.getHours() < DAY_ROLLOVER_HOUR) {
    useDate.setDate(useDate.getDate() - 1);
  }
  const y = useDate.getFullYear();
  const m = String(useDate.getMonth() + 1).padStart(2, "0");
  const day = String(useDate.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function emptyKid(): KidState {
  return {
    badges: [],
    today: {
      date: todayStr(),
      completedQuestIds: [],
      scienceUnlocked: false,
    },
    history: [],
    gameStats: {},
  };
}

function emptyQuiet(): QuietCheckIn {
  return { date: todayStr(), steps: [] };
}

function emptyParent(): ParentReset {
  return { date: todayStr(), answers: {} };
}

function defaultState(): AppState {
  return {
    version: 1,
    elio: emptyKid(),
    emilia: emptyKid(),
    cynthia: { today: emptyQuiet() },
    parent: { today: emptyParent() },
  };
}

/** Tolerates older saved states that may not have `history` or `gameStats`. */
function ensureKidShape(kid: Partial<KidState> | undefined): KidState {
  const empty = emptyKid();
  return {
    badges: kid?.badges ?? [],
    today: kid?.today ?? empty.today,
    history: kid?.history ?? [],
    gameStats: kid?.gameStats ?? {},
  };
}

function archiveTodayToHistory(kid: KidState): KidState {
  const cur = kid.today;
  // Don't archive empty days.
  const hasContent =
    cur.completedQuestIds.length > 0 || Boolean(cur.vibe) || Boolean(cur.scienceClaimedQuestId);
  if (!hasContent || !cur.date) return kid;

  const snapshot: DaySnapshot = {
    date: cur.date,
    completedQuestIds: cur.completedQuestIds,
    vibe: cur.vibe,
    scienceQuestEarned: cur.scienceClaimedQuestId,
  };

  const filtered = kid.history.filter((h) => h.date !== cur.date);
  const merged = [...filtered, snapshot]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-HISTORY_CAP);

  return { ...kid, history: merged };
}

function rolloverIfNeeded(state: AppState): AppState {
  const today = todayStr();
  let next = state;
  for (const id of ["elio", "emilia"] as KidId[]) {
    const kid = next[id];
    if (kid.today.date !== today) {
      const archived = archiveTodayToHistory(kid);
      next = {
        ...next,
        [id]: {
          ...archived,
          today: {
            date: today,
            completedQuestIds: [],
            scienceUnlocked: false,
          },
        },
      };
    }
  }
  if (next.cynthia.today.date !== today) {
    next = { ...next, cynthia: { today: emptyQuiet() } };
  }
  if (next.parent.today.date !== today) {
    next = { ...next, parent: { today: emptyParent() } };
  }
  return next;
}

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const fresh = defaultState();
      window.localStorage.setItem(KEY, JSON.stringify(fresh));
      return fresh;
    }
    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (!parsed || parsed.version !== 1) {
      const fresh = defaultState();
      window.localStorage.setItem(KEY, JSON.stringify(fresh));
      return fresh;
    }
    // Tolerate older saved states missing fields.
    const fixed: AppState = {
      version: 1,
      elio: ensureKidShape(parsed.elio),
      emilia: ensureKidShape(parsed.emilia),
      cynthia: parsed.cynthia ?? { today: emptyQuiet() },
      parent: parsed.parent ?? { today: emptyParent() },
    };
    const rolled = rolloverIfNeeded(fixed);
    window.localStorage.setItem(KEY, JSON.stringify(rolled));
    return rolled;
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage unavailable — fail quietly
  }
}

export function resetTodayForKid(state: AppState, kid: KidId): AppState {
  return {
    ...state,
    [kid]: {
      ...state[kid],
      today: {
        date: todayStr(),
        completedQuestIds: [],
        scienceUnlocked: false,
      },
    },
  };
}

export function resetTodayForCynthia(state: AppState): AppState {
  return { ...state, cynthia: { today: emptyQuiet() } };
}

export function resetTodayForParent(state: AppState): AppState {
  return { ...state, parent: { today: emptyParent() } };
}
