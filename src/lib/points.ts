import type { KidId } from "./types";
import { todayStr } from "./storage";

const KEY = "fqs.v1.points";
const PRESETS_KEY = "fqs.v1.pointPresets";
const REWARDS_KEY = "fqs.v1.rewardPresets";

export type PointEntry = {
  id: string;
  label: string;
  points: number;
  time: number;
};

export type DailyPoints = {
  date: string;
  entries: PointEntry[];
};

export type PointPreset = {
  id: string;
  label: string;
  emoji: string;
  points: number;
};

type PointsData = Record<string, DailyPoints>; // key = `${kidId}_${date}`

const DEFAULT_PRESETS: PointPreset[] = [
  { id: "seatbelt", label: "Buckled seatbelt", emoji: "🚗", points: 1 },
  { id: "share", label: "Shared with sibling", emoji: "🤝", points: 1 },
  { id: "thankyou", label: "Said thank you", emoji: "🙏", points: 1 },
  { id: "cleanup", label: "Cleaned up on own", emoji: "🧹", points: 1 },
  { id: "kind", label: "Was kind to someone", emoji: "💛", points: 1 },
  { id: "homework", label: "Did homework first", emoji: "📝", points: 2 },
  { id: "helper", label: "Helped with chores", emoji: "🌟", points: 2 },
  { id: "patience", label: "Stayed patient", emoji: "🧘", points: 2 },
];

function loadAll(): PointsData {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PointsData) : {};
  } catch {
    return {};
  }
}

function saveAll(data: PointsData) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

function dayKey(kidId: KidId): string {
  return `${kidId}_${todayStr()}`;
}

export function getToday(kidId: KidId): DailyPoints {
  const all = loadAll();
  const k = dayKey(kidId);
  return all[k] ?? { date: todayStr(), entries: [] };
}

export function addPoint(kidId: KidId, label: string, points: number): DailyPoints {
  const all = loadAll();
  const k = dayKey(kidId);
  const current = all[k] ?? { date: todayStr(), entries: [] };
  const entry: PointEntry = {
    id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    label,
    points,
    time: Date.now(),
  };
  const updated = { ...current, entries: [...current.entries, entry] };
  all[k] = updated;
  saveAll(all);
  return updated;
}

export function removePoint(kidId: KidId, entryId: string): DailyPoints {
  const all = loadAll();
  const k = dayKey(kidId);
  const current = all[k] ?? { date: todayStr(), entries: [] };
  const updated = {
    ...current,
    entries: current.entries.filter((e) => e.id !== entryId),
  };
  all[k] = updated;
  saveAll(all);
  return updated;
}

export function getTodayTotal(kidId: KidId): number {
  const day = getToday(kidId);
  return day.entries.reduce((sum, e) => sum + e.points, 0);
}

/** Get last 7 days of point totals for a kid */
export function getWeekTotals(kidId: KidId): { date: string; total: number }[] {
  const all = loadAll();
  const today = todayStr();
  const result: { date: string; total: number }[] = [];
  const d = new Date(today + "T12:00:00");

  for (let i = 6; i >= 0; i--) {
    const dd = new Date(d);
    dd.setDate(dd.getDate() - i);
    const y = dd.getFullYear();
    const m = String(dd.getMonth() + 1).padStart(2, "0");
    const day = String(dd.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${day}`;
    const k = `${kidId}_${dateStr}`;
    const dayData = all[k];
    const total = dayData ? dayData.entries.reduce((s, e) => s + e.points, 0) : 0;
    result.push({ date: dateStr, total });
  }
  return result;
}

// Preset management
export function getPresets(): PointPreset[] {
  if (typeof window === "undefined") return DEFAULT_PRESETS;
  try {
    const raw = window.localStorage.getItem(PRESETS_KEY);
    if (!raw) return DEFAULT_PRESETS;
    const parsed = JSON.parse(raw) as PointPreset[];
    return parsed.length > 0 ? parsed : DEFAULT_PRESETS;
  } catch {
    return DEFAULT_PRESETS;
  }
}

export function savePresets(presets: PointPreset[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
  } catch {}
}

export function resetPresets() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PRESETS_KEY);
  } catch {}
}

// ── Reward (spend) presets ──────────────────────────────────

export type RewardPreset = {
  id: string;
  label: string;
  emoji: string;
  cost: number; // positive number — will be subtracted
};

const DEFAULT_REWARDS: RewardPreset[] = [
  { id: "icecream", label: "Ice cream", emoji: "🍦", cost: 10 },
  { id: "dessert", label: "Dessert", emoji: "🍰", cost: 8 },
  { id: "park", label: "Extra park time", emoji: "🛝", cost: 6 },
  { id: "story", label: "Pick bedtime story", emoji: "📖", cost: 5 },
  { id: "toy", label: "Small toy", emoji: "🧸", cost: 15 },
  { id: "outing", label: "Family outing pick", emoji: "🎡", cost: 20 },
];

export function getRewards(): RewardPreset[] {
  if (typeof window === "undefined") return DEFAULT_REWARDS;
  try {
    const raw = window.localStorage.getItem(REWARDS_KEY);
    if (!raw) return DEFAULT_REWARDS;
    const parsed = JSON.parse(raw) as RewardPreset[];
    return parsed.length > 0 ? parsed : DEFAULT_REWARDS;
  } catch {
    return DEFAULT_REWARDS;
  }
}

export function saveRewards(rewards: RewardPreset[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(REWARDS_KEY, JSON.stringify(rewards));
  } catch {}
}

export function resetRewards() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(REWARDS_KEY);
  } catch {}
}

/** Spend points on a reward — records a negative entry */
export function spendPoints(kidId: KidId, label: string, cost: number): DailyPoints {
  const all = loadAll();
  const k = dayKey(kidId);
  const current = all[k] ?? { date: todayStr(), entries: [] };
  const entry: PointEntry = {
    id: `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    label,
    points: -cost, // negative = spent
    time: Date.now(),
  };
  const updated = { ...current, entries: [...current.entries, entry] };
  all[k] = updated;
  saveAll(all);
  return updated;
}
