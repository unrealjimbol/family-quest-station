"use client";

import { useSyncExternalStore } from "react";
import { loadState, saveState } from "./storage";
import type { AppState } from "./types";

let cache: AppState | null = null;
const listeners = new Set<() => void>();

function getCache(): AppState {
  if (cache) return cache;
  cache = loadState();
  return cache;
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): AppState {
  return getCache();
}

const serverSnapshot: AppState = {
  version: 1,
  elio: {
    badges: [],
    today: { date: "", completedQuestIds: [], scienceUnlocked: false },
    history: [],
    gameStats: {},
  },
  emilia: {
    badges: [],
    today: { date: "", completedQuestIds: [], scienceUnlocked: false },
    history: [],
    gameStats: {},
  },
  cynthia: { today: { date: "", steps: [] } },
  parent: { today: { date: "", answers: {} } },
};

function getServerSnapshot(): AppState {
  return serverSnapshot;
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function updateState(updater: (prev: AppState) => AppState): void {
  const next = updater(getCache());
  cache = next;
  saveState(next);
  listeners.forEach((l) => l());
}
