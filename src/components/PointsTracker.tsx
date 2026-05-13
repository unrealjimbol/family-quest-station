"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addPoint,
  getPresets,
  getToday,
  getTodayTotal,
  removePoint,
  type DailyPoints,
  type PointPreset,
} from "@/lib/points";
import { playCoin } from "@/lib/sounds";
import type { KidId } from "@/lib/types";

type Props = {
  kidId: KidId;
  kidName: string;
  kidEmoji: string;
  accentColor?: string;
  onClose: () => void;
};

export default function PointsTracker({
  kidId,
  kidName,
  kidEmoji,
  accentColor = "#e07a5f",
  onClose,
}: Props) {
  const [day, setDay] = useState<DailyPoints>(() => getToday(kidId));
  const [total, setTotal] = useState(() => getTodayTotal(kidId));
  const [presets] = useState<PointPreset[]>(() => getPresets());
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Refresh from storage (in case parent page changes things)
  const refresh = useCallback(() => {
    const d = getToday(kidId);
    setDay(d);
    setTotal(d.entries.reduce((s, e) => s + e.points, 0));
  }, [kidId]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleAdd(preset: PointPreset) {
    const updated = addPoint(kidId, `${preset.emoji} ${preset.label}`, preset.points);
    setDay(updated);
    setTotal(updated.entries.reduce((s, e) => s + e.points, 0));
    playCoin();
    setJustAdded(preset.id);
    setTimeout(() => setJustAdded((c) => (c === preset.id ? null : c)), 500);
  }

  function handleRemove(entryId: string) {
    const updated = removePoint(kidId, entryId);
    setDay(updated);
    setTotal(updated.entries.reduce((s, e) => s + e.points, 0));
  }

  const sortedEntries = [...day.entries].sort((a, b) => b.time - a.time);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close points tracker"
      />

      {/* Panel */}
      <div className="animate-slide-up relative w-full max-w-md rounded-t-3xl bg-[#fdf6ec] p-5 shadow-2xl ring-1 ring-black/10 md:rounded-3xl md:p-7">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl" aria-hidden="true">
              {kidEmoji}
            </span>
            <div>
              <h2 className="text-lg font-bold">{kidName}&apos;s Points</h2>
              <p className="text-xs text-ink-soft">Tap to record good moments</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink-soft ring-1 ring-black/10 hover:bg-bg-soft"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Score display */}
        <div
          className="mb-5 flex items-center justify-center gap-3 rounded-2xl p-4"
          style={{ backgroundColor: `${accentColor}12` }}
        >
          <span className="text-3xl" aria-hidden="true">
            ⭐
          </span>
          <div className="text-center">
            <div
              className="text-4xl font-bold tabular-nums"
              style={{ color: accentColor }}
            >
              {total}
            </div>
            <div className="text-xs font-medium text-ink-soft">points today</div>
          </div>
        </div>

        {/* Preset grid */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleAdd(p)}
              className={`flex items-center gap-2.5 rounded-xl bg-white px-3 py-3 text-left shadow-sm ring-1 ring-black/5 transition active:scale-[0.97] ${
                justAdded === p.id ? "animate-coin-pop" : ""
              }`}
            >
              <span className="text-xl" aria-hidden="true">
                {p.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{p.label}</div>
                <div
                  className="text-xs font-bold"
                  style={{ color: accentColor }}
                >
                  +{p.points}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* History toggle */}
        {sortedEntries.length > 0 ? (
          <div>
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="flex w-full items-center justify-between rounded-xl bg-white/70 px-4 py-2.5 text-sm font-semibold text-ink-soft ring-1 ring-black/5"
            >
              <span>
                Today&apos;s log ({sortedEntries.length} {sortedEntries.length === 1 ? "entry" : "entries"})
              </span>
              <span aria-hidden="true">{showHistory ? "▲" : "▼"}</span>
            </button>

            {showHistory ? (
              <ul className="mt-2 max-h-48 space-y-1.5 overflow-y-auto">
                {sortedEntries.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-black/5"
                  >
                    <span className="flex-1 truncate">{entry.label}</span>
                    <span
                      className="shrink-0 text-xs font-bold"
                      style={{ color: accentColor }}
                    >
                      +{entry.points}
                    </span>
                    <span className="shrink-0 text-xs text-ink-soft">
                      {new Date(entry.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(entry.id)}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-red-50 hover:text-red-500"
                      aria-label={`Remove ${entry.label}`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <p className="text-center text-sm text-ink-soft">
            No points yet today. Tap a button above!
          </p>
        )}
      </div>
    </div>
  );
}
