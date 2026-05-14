"use client";

import { useState } from "react";
import {
  getPresets,
  resetPresets,
  savePresets,
  type PointPreset,
} from "@/lib/points";

const EMOJI_OPTIONS = [
  "🚗", "🤝", "🙏", "🧹", "💛", "📝", "🌟", "🧘",
  "🎯", "🏠", "🍎", "💪", "🧸", "🎵", "🐕", "📖",
  "🥦", "🧽", "👕", "💬", "🌸", "🎨", "💧", "🏃",
];

export default function PointPresetEditor() {
  const [expanded, setExpanded] = useState(false);
  const [presets, setLocalPresets] = useState<PointPreset[]>(() => getPresets());
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newEmoji, setNewEmoji] = useState("⭐");
  const [newPoints, setNewPoints] = useState(1);

  function save(updated: PointPreset[]) {
    setLocalPresets(updated);
    savePresets(updated);
  }

  function removePreset(id: string) {
    save(presets.filter((p) => p.id !== id));
  }

  function addPreset() {
    if (!newLabel.trim()) return;
    const preset: PointPreset = {
      id: `preset_${Date.now()}`,
      label: newLabel.trim(),
      emoji: newEmoji,
      points: newPoints,
    };
    save([...presets, preset]);
    setNewLabel("");
    setNewEmoji("⭐");
    setNewPoints(1);
    setAdding(false);
  }

  function handleReset() {
    resetPresets();
    setLocalPresets(getPresets());
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="flex w-full items-center gap-3 rounded-2xl bg-white px-5 py-4 text-left shadow-sm ring-1 ring-black/5 transition hover:bg-bg-soft"
      >
        <span className="text-2xl" aria-hidden="true">⭐</span>
        <div className="flex-1">
          <span className="text-base font-semibold">Point presets</span>
          <span className="ml-2 text-sm text-ink-soft">
            ({presets.length} actions)
          </span>
        </div>
        <span className="text-ink-soft">▼</span>
      </button>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">⭐</span>
          <h3 className="text-lg font-bold">Point presets</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft ring-1 ring-black/10 hover:bg-bg-soft"
          >
            Reset defaults
          </button>
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft ring-1 ring-black/10 hover:bg-bg-soft"
          >
            ▲ Close
          </button>
        </div>
      </div>

      <p className="mb-4 text-sm text-ink-soft">
        These buttons appear in the points tracker for quick recording.
      </p>

      <ul className="space-y-1.5">
        {presets.map((p) => (
          <li
            key={p.id}
            className="flex items-center gap-3 rounded-xl bg-bg-soft px-3 py-2.5 ring-1 ring-black/5"
          >
            <span className="text-lg" aria-hidden="true">{p.emoji}</span>
            <span className="flex-1 text-sm font-medium">{p.label}</span>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-600 ring-1 ring-amber-200/50">
              +{p.points}
            </span>
            <button
              type="button"
              onClick={() => removePreset(p.id)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-ink-soft hover:bg-red-50 hover:text-red-500"
              aria-label={`Remove ${p.label}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {adding ? (
        <div className="mt-3 flex flex-col gap-2 rounded-xl bg-amber-50/50 p-3 ring-1 ring-amber-200/40">
          <div className="flex items-center gap-2">
            <select
              value={newEmoji}
              onChange={(e) => setNewEmoji(e.target.value)}
              className="rounded-lg bg-white px-2 py-1.5 text-lg ring-1 ring-black/10"
            >
              {EMOJI_OPTIONS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPreset()}
              placeholder="Action name..."
              className="flex-1 rounded-lg bg-white px-3 py-1.5 text-sm outline-none ring-1 ring-black/10 placeholder:text-ink-soft focus:ring-[#81b29a]"
              autoFocus
            />
            <select
              value={newPoints}
              onChange={(e) => setNewPoints(Number(e.target.value))}
              className="rounded-lg bg-white px-2 py-1.5 text-sm font-bold ring-1 ring-black/10"
            >
              {[1, 2, 3, 5].map((n) => (
                <option key={n} value={n}>+{n}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => { setAdding(false); setNewLabel(""); }}
              className="rounded-full px-3 py-1 text-xs font-semibold text-ink-soft"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addPreset}
              disabled={!newLabel.trim()}
              className="rounded-full bg-[#81b29a] px-4 py-1 text-xs font-bold text-white disabled:opacity-40"
            >
              Add
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mt-2 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-ink-soft transition hover:bg-bg-soft"
        >
          <span>+</span> Add preset
        </button>
      )}
    </div>
  );
}
