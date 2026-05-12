import type { KidId, Quest } from "./types";
import { elioQuests, emiliaQuests } from "@/data/quests";

const KEY = "fqs.v1.customQuests";

type CustomQuestsData = {
  elio: Quest[];
  emilia: Quest[];
};

function load(): CustomQuestsData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CustomQuestsData;
  } catch {
    return null;
  }
}

function save(data: CustomQuestsData) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // storage unavailable
  }
}

/** Get quests for a kid — custom if set, otherwise defaults */
export function getQuests(kidId: KidId): Quest[] {
  const custom = load();
  if (custom && custom[kidId] && custom[kidId].length > 0) {
    return custom[kidId];
  }
  return kidId === "elio" ? elioQuests : emiliaQuests;
}

/** Save custom quests for a kid */
export function setQuests(kidId: KidId, quests: Quest[]) {
  const current = load() ?? { elio: [], emilia: [] };
  current[kidId] = quests;
  save(current);
}

/** Reset to defaults */
export function resetQuests(kidId: KidId) {
  const current = load() ?? { elio: [], emilia: [] };
  current[kidId] = [];
  save(current);
}

/** Check if using custom quests */
export function isCustomized(kidId: KidId): boolean {
  const custom = load();
  return Boolean(custom && custom[kidId] && custom[kidId].length > 0);
}
