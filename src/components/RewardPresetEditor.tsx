"use client";

import { useState } from "react";
import {
  getRewards,
  resetRewards,
  saveRewards,
  type RewardPreset,
} from "@/lib/points";

const EMOJI_OPTIONS = [
  "🍦", "🍰", "🍬", "📱", "🧸", "🌙", "🎮", "🍫",
  "🍿", "🎪", "🎨", "🎵", "🛹", "🎠", "🧩", "🎈",
  "🍩", "🥤", "🎁", "🎢", "🏊", "🎬", "🍕", "🥞",
];

export default function RewardPresetEditor() {
  const [expanded, setExpanded] = useState(false);
  const [rewards, setLocalRewards] = useState<RewardPreset[]>(() => getRewards());
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newEmoji, setNewEmoji] = useState("🎁");
  const [newCost, setNewCost] = useState(5);

  function save(updated: RewardPreset[]) {
    setLocalRewards(updated);
    saveRewards(updated);
  }

  function removeReward(id: string) {
    save(rewards.filter((r) => r.id !== id));
  }

  function addReward() {
    if (!newLabel.trim()) return;
    const reward: RewardPreset = {
      id: `reward_${Date.now()}`,
      label: newLabel.trim(),
      emoji: newEmoji,
      cost: newCost,
    };
    save([...rewards, reward]);
    setNewLabel("");
    setNewEmoji("🎁");
    setNewCost(5);
    setAdding(false);
  }

  function handleReset() {
    resetRewards();
    setLocalRewards(getRewards());
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="flex w-full items-center gap-3 rounded-2xl bg-white px-5 py-4 text-left shadow-sm ring-1 ring-black/5 transition hover:bg-bg-soft"
      >
        <span className="text-2xl" aria-hidden="true">🎁</span>
        <div className="flex-1">
          <span className="text-base font-semibold">Reward shop</span>
          <span className="ml-2 text-sm text-ink-soft">
            ({rewards.length} rewards)
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
          <span className="text-2xl" aria-hidden="true">🎁</span>
          <h3 className="text-lg font-bold">Reward shop</h3>
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
        Kids can spend earned points on these rewards.
      </p>

      <ul className="space-y-1.5">
        {rewards.map((r) => (
          <li
            key={r.id}
            className="flex items-center gap-3 rounded-xl bg-bg-soft px-3 py-2.5 ring-1 ring-black/5"
          >
            <span className="text-lg" aria-hidden="true">{r.emoji}</span>
            <span className="flex-1 text-sm font-medium">{r.label}</span>
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-[#e07a5f] ring-1 ring-red-200/50">
              -{r.cost} pts
            </span>
            <button
              type="button"
              onClick={() => removeReward(r.id)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-ink-soft hover:bg-red-50 hover:text-red-500"
              aria-label={`Remove ${r.label}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {adding ? (
        <div className="mt-3 flex flex-col gap-2 rounded-xl bg-rose-50/50 p-3 ring-1 ring-rose-200/40">
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
              onKeyDown={(e) => e.key === "Enter" && addReward()}
              placeholder="Reward name..."
              className="flex-1 rounded-lg bg-white px-3 py-1.5 text-sm outline-none ring-1 ring-black/10 placeholder:text-ink-soft focus:ring-[#e07a5f]"
              autoFocus
            />
            <select
              value={newCost}
              onChange={(e) => setNewCost(Number(e.target.value))}
              className="rounded-lg bg-white px-2 py-1.5 text-sm font-bold ring-1 ring-black/10"
            >
              {[3, 5, 6, 8, 10, 12, 15, 20, 25, 30].map((n) => (
                <option key={n} value={n}>-{n}</option>
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
              onClick={addReward}
              disabled={!newLabel.trim()}
              className="rounded-full bg-[#e07a5f] px-4 py-1 text-xs font-bold text-white disabled:opacity-40"
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
          <span>+</span> Add reward
        </button>
      )}
    </div>
  );
}
