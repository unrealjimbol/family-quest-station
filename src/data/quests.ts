import type { Quest, QuestGroup } from "@/lib/types";

export const groupOrder: QuestGroup[] = [
  "night",
  "morning",
  "afterschool",
  "dinner",
];

export const groupMeta: Record<
  QuestGroup,
  { title: string; subtitle: string; color: string; ring: string; chip: string }
> = {
  night: {
    title: "Night Quest",
    subtitle: "Wind down for a cozy bedtime",
    color: "bg-night/10",
    ring: "ring-night/30",
    chip: "bg-night text-white",
  },
  morning: {
    title: "Morning",
    subtitle: "A bright start to the day",
    color: "bg-morning/10",
    ring: "ring-morning/30",
    chip: "bg-morning text-white",
  },
  afterschool: {
    title: "After School",
    subtitle: "Snack, play, recharge",
    color: "bg-afterschool/10",
    ring: "ring-afterschool/30",
    chip: "bg-afterschool text-white",
  },
  dinner: {
    title: "Dinner",
    subtitle: "Family time at the table",
    color: "bg-dinner/10",
    ring: "ring-dinner/30",
    chip: "bg-dinner text-white",
  },
};

export const elioQuests: Quest[] = [
  { id: "e_n1", label: "Brush teeth", group: "night", emoji: "🪥" },
  { id: "e_n2", label: "Put on pajamas", group: "night", emoji: "🌙" },
  { id: "e_n3", label: "Pick book for story time", group: "night", emoji: "📖" },
  { id: "e_n4", label: "Tidy up toys", group: "night", emoji: "🧸" },
  { id: "e_m1", label: "Get dressed", group: "morning", emoji: "👕" },
  { id: "e_m2", label: "Eat breakfast", group: "morning", emoji: "🥣" },
  { id: "e_m3", label: "Pack school bag", group: "morning", emoji: "🎒" },
  { id: "e_a1", label: "Wash hands", group: "afterschool", emoji: "🧼" },
  { id: "e_a2", label: "Snack time", group: "afterschool", emoji: "🍎" },
  { id: "e_a3", label: "Outside play", group: "afterschool", emoji: "🌳" },
  { id: "e_a4", label: "Finish homework", group: "afterschool", emoji: "📝", weekdaysOnly: true },
  { id: "e_d1", label: "Set the table", group: "dinner", emoji: "🍽️" },
  { id: "e_d2", label: "Try one new bite", group: "dinner", emoji: "🥕" },
  { id: "e_d3", label: "Clear my plate", group: "dinner", emoji: "🧽" },
];

export const emiliaQuests: Quest[] = [
  { id: "i_n1", label: "Brush teeth", group: "night", emoji: "🪥" },
  { id: "i_n2", label: "Put on pajamas", group: "night", emoji: "🌙" },
  { id: "i_n3", label: "Tuck in stuffies", group: "night", emoji: "🧸" },
  { id: "i_n4", label: "Quiet drawing time", group: "night", emoji: "🎨" },
  { id: "i_m1", label: "Get dressed", group: "morning", emoji: "👗" },
  { id: "i_m2", label: "Eat breakfast", group: "morning", emoji: "🥞" },
  { id: "i_m3", label: "Brush hair", group: "morning", emoji: "💁" },
  { id: "i_a1", label: "Wash hands", group: "afterschool", emoji: "🧼" },
  { id: "i_a2", label: "Snack time", group: "afterschool", emoji: "🍓" },
  { id: "i_a3", label: "Read a little", group: "afterschool", emoji: "📚" },
  { id: "i_a4", label: "Finish homework", group: "afterschool", emoji: "📝", weekdaysOnly: true },
  { id: "i_a5", label: "Check Elio finished homework", group: "afterschool", emoji: "🔍", weekdaysOnly: true },
  { id: "i_d1", label: "Help with dinner", group: "dinner", emoji: "🥗" },
  { id: "i_d2", label: "Try one new bite", group: "dinner", emoji: "🥦" },
  { id: "i_d3", label: "Say one good thing about today", group: "dinner", emoji: "💬" },
];
