"use client";

import { useState } from "react";
import { elioQuests, emiliaQuests, groupMeta } from "@/data/quests";
import { getQuests, setQuests, resetQuests, isCustomized } from "@/lib/customQuests";
import type { KidId, Quest, QuestGroup } from "@/lib/types";

const GROUPS: QuestGroup[] = ["morning", "afterschool", "dinner", "night"];

const EMOJI_OPTIONS = [
  "🪥", "🌙", "📖", "🧸", "👕", "🥣", "🎒", "🧼", "🍎", "🌳",
  "🍽️", "🥕", "🧽", "👗", "🥞", "💁", "🍓", "📚", "🥗", "🥦",
  "💬", "🎨", "💧", "🧹", "📝", "🎵", "🏃", "🐕", "🌸", "⭐",
];

type Props = {
  kidId: KidId;
  kidName: string;
  kidEmoji: string;
};

export default function QuestEditor({ kidId, kidName, kidEmoji }: Props) {
  const defaults = kidId === "elio" ? elioQuests : emiliaQuests;
  const [expanded, setExpanded] = useState(false);
  const [quests, setLocalQuests] = useState<Quest[]>(() => getQuests(kidId));
  const [addingGroup, setAddingGroup] = useState<QuestGroup | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newEmoji, setNewEmoji] = useState("⭐");
  const customized = isCustomized(kidId);

  function save(updated: Quest[]) {
    setLocalQuests(updated);
    setQuests(kidId, updated);
  }

  function removeQuest(id: string) {
    save(quests.filter((q) => q.id !== id));
  }

  function addQuest(group: QuestGroup) {
    if (!newLabel.trim()) return;
    const id = `${kidId[0]}_custom_${Date.now()}`;
    const quest: Quest = {
      id,
      label: newLabel.trim(),
      group,
      emoji: newEmoji,
    };
    save([...quests, quest]);
    setNewLabel("");
    setNewEmoji("⭐");
    setAddingGroup(null);
  }

  function handleReset() {
    resetQuests(kidId);
    setLocalQuests(defaults);
  }

  const byGroup = (g: QuestGroup) => quests.filter((q) => q.group === g);

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="flex w-full items-center gap-3 rounded-2xl bg-white px-5 py-4 text-left shadow-sm ring-1 ring-black/5 transition hover:bg-bg-soft"
      >
        <span className="text-2xl" aria-hidden="true">{kidEmoji}</span>
        <div className="flex-1">
          <span className="text-base font-semibold">{kidName}&apos;s quests</span>
          <span className="ml-2 text-sm text-ink-soft">
            ({quests.length} tasks{customized ? " · customized" : ""})
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
          <span className="text-2xl" aria-hidden="true">{kidEmoji}</span>
          <h3 className="text-lg font-bold">{kidName}&apos;s quests</h3>
          {customized ? (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-600 ring-1 ring-amber-200/60">
              Customized
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {customized ? (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft ring-1 ring-black/10 hover:bg-bg-soft"
            >
              Reset to defaults
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft ring-1 ring-black/10 hover:bg-bg-soft"
          >
            ▲ Close
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {GROUPS.map((group) => {
          const meta = groupMeta[group];
          const groupQuests = byGroup(group);
          return (
            <div key={group}>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-sm font-bold uppercase tracking-wide text-ink-soft">
                  {meta.title}
                </h4>
                <span className="text-xs text-ink-soft">({groupQuests.length})</span>
              </div>
              <ul className="space-y-1.5">
                {groupQuests.map((q) => (
                  <li
                    key={q.id}
                    className="flex items-center gap-3 rounded-xl bg-bg-soft px-3 py-2.5 ring-1 ring-black/5"
                  >
                    <span className="text-lg" aria-hidden="true">{q.emoji}</span>
                    <span className="flex-1 text-sm font-medium">{q.label}</span>
                    <button
                      type="button"
                      onClick={() => removeQuest(q.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-ink-soft hover:bg-red-50 hover:text-red-500"
                      aria-label={`Remove ${q.label}`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>

              {addingGroup === group ? (
                <div className="mt-2 flex flex-col gap-2 rounded-xl bg-amber-50/50 p-3 ring-1 ring-amber-200/40">
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
                      onKeyDown={(e) => e.key === "Enter" && addQuest(group)}
                      placeholder="New task name…"
                      className="flex-1 rounded-lg bg-white px-3 py-1.5 text-sm outline-none ring-1 ring-black/10 placeholder:text-ink-soft focus:ring-[#81b29a]"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => { setAddingGroup(null); setNewLabel(""); }}
                      className="rounded-full px-3 py-1 text-xs font-semibold text-ink-soft"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => addQuest(group)}
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
                  onClick={() => setAddingGroup(group)}
                  className="mt-1.5 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-ink-soft transition hover:bg-bg-soft"
                >
                  <span>+</span> Add task
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
