import type { KidId, VibeKey } from "@/lib/types";

export type VibeOption = {
  emoji: string;
  label: string;
  vibe: VibeKey;
};

export type VibePrompt = {
  id: string;
  question: string;
  hint?: string;
  options: VibeOption[];
};

export const vibePrompts: VibePrompt[] = [
  {
    id: "feeling",
    question: "How are you feeling today?",
    hint: "There's no wrong answer. Pick the one that fits.",
    options: [
      { emoji: "🚀", label: "Awesome — bring it on!", vibe: "zappy" },
      { emoji: "😊", label: "Pretty good, I guess", vibe: "chill" },
      { emoji: "😴", label: "A bit sleepy", vibe: "sleepy" },
      { emoji: "🌧️", label: "Kinda grumpy honestly", vibe: "cloudy" },
      { emoji: "🤪", label: "WILD — I want to do something CRAZY", vibe: "wild" },
    ],
  },
  {
    id: "weather",
    question: "What's today's weather inside you?",
    hint: "Just pick the closest one.",
    options: [
      { emoji: "☀️", label: "Sunny — full beam!", vibe: "zappy" },
      { emoji: "🌤️", label: "Mostly sunny with clouds", vibe: "chill" },
      { emoji: "☁️", label: "Cloudy and slow", vibe: "sleepy" },
      { emoji: "🌧️", label: "Rainy and a bit gray", vibe: "cloudy" },
      { emoji: "⛈️", label: "STORMY — watch out!", vibe: "wild" },
    ],
  },
  {
    id: "animal",
    question: "Pick your animal energy:",
    hint: "Which one is you, right now?",
    options: [
      { emoji: "🦁", label: "Lion — ROAR!", vibe: "zappy" },
      { emoji: "🐢", label: "Turtle — slow & chill", vibe: "chill" },
      { emoji: "🦥", label: "Sloth — barely awake", vibe: "sleepy" },
      { emoji: "🦔", label: "Hedgehog — leave me alone", vibe: "cloudy" },
      { emoji: "🐒", label: "Monkey — bouncing off walls!!", vibe: "wild" },
    ],
  },
  {
    id: "snack",
    question: "If today were a snack…",
    hint: "What's the flavor?",
    options: [
      { emoji: "🍦", label: "Ice cream — sweet & happy", vibe: "zappy" },
      { emoji: "🍞", label: "Toast — comfy and fine", vibe: "chill" },
      { emoji: "🥛", label: "Warm milk — sleepy", vibe: "sleepy" },
      { emoji: "🥦", label: "Broccoli — UGH", vibe: "cloudy" },
      { emoji: "🌶️", label: "Spicy chip — TOO MUCH!", vibe: "wild" },
    ],
  },
  {
    id: "secret",
    question: "Today I am secretly a…",
    hint: "Pick your secret identity.",
    options: [
      { emoji: "🚀", label: "Astronaut — out of orbit!", vibe: "zappy" },
      { emoji: "🧙", label: "Tiny wizard — quiet magic", vibe: "chill" },
      { emoji: "🥔", label: "Potato — just lying around", vibe: "sleepy" },
      { emoji: "🐱", label: "Cat — judging everyone", vibe: "cloudy" },
      { emoji: "🦖", label: "Tiny dinosaur — RAWR EVERYWHERE!", vibe: "wild" },
    ],
  },
];

export type KidVoice = {
  greetings: string[];
  responses: Record<VibeKey, string[]>;
};

export const kidVoices: Record<KidId, KidVoice> = {
  elio: {
    greetings: [
      "Hey Elio!",
      "What's up, fox friend?",
      "Welcome back, fox!",
      "Hello again, little fox.",
    ],
    responses: {
      zappy: [
        "WHOOSH — fox-mode activated! 🦊💨",
        "I knew it. High paw! 🐾",
        "Yes! Let's run wild through these quests!",
      ],
      chill: [
        "Steady fox energy. We got this.",
        "Nice and chill. That's a great pace.",
        "Cool fox. Let's pad through the day. 🐾",
      ],
      sleepy: [
        "Same. Slow paws today, fox friend.",
        "Sleepy fox is a wise fox. We'll go gentle. 🐾",
        "Yawn. Tea first, quests second.",
      ],
      cloudy: [
        "Real. Even foxes have grumpy days.",
        "Fair. Let's start with just ONE small thing.",
        "Cloudy fox feelings. We'll go slow today.",
      ],
      wild: [
        "WHOAAA — save some zoomies for the quests! 🌪️",
        "Look at you GO. Channel that into something good!",
        "Wild fox detected! Don't break the furniture, ok? 😆",
      ],
    },
  },
  emilia: {
    greetings: [
      "Hi Emilia!",
      "Sparkle check!",
      "Hey magic friend!",
      "Welcome back, sparkle!",
    ],
    responses: {
      zappy: [
        "SPARKLES EVERYWHERE! ✨🦄✨",
        "Glow time! Let's make today shimmer.",
        "Look at that magic energy go!",
      ],
      chill: [
        "Steady magic. We'll glow gently today.",
        "Soft sparkle vibes. I love it.",
        "Calm rainbow energy. Perfect.",
      ],
      sleepy: [
        "Soft cloud day. We'll move like a slow rainbow. ☁️🌈",
        "Sleepy unicorn? Snuggle quests it is.",
        "Yawn. Magic still works in pajamas.",
      ],
      cloudy: [
        "Even unicorns get cloudy. That's okay.",
        "Tiny sparkle first. Just one thing.",
        "Grumpy magic is still magic. We'll go gentle.",
      ],
      wild: [
        "GLITTER STORM INCOMING! ⚡🌈",
        "Whoa, whoa — hold those sparkles for the quests!",
        "WILD unicorn detected. Hide the snacks! 🦄",
      ],
    },
  },
};

export function pickPromptForToday(salt: string): VibePrompt {
  const d = new Date();
  let hash = 0;
  const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${salt}`;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return vibePrompts[hash % vibePrompts.length];
}

export function pickResponse(kidId: KidId, vibe: VibeKey, seed: number): string {
  const list = kidVoices[kidId].responses[vibe];
  return list[Math.abs(seed) % list.length];
}

export function pickGreeting(kidId: KidId, seed: number): string {
  const list = kidVoices[kidId].greetings;
  return list[Math.abs(seed) % list.length];
}

export const transitionPhrases: Record<VibeKey | "default", string[]> = {
  zappy: ["LET'S GOOO!", "ZOOM ZOOM!", "Hold on tight!"],
  chill: ["Off we go…", "Easy does it.", "Coast mode on."],
  sleepy: ["Slow and steady…", "Tiny steps today.", "Soft start, friend."],
  cloudy: ["One small thing first.", "Gentle mode.", "We'll go slow today."],
  wild: ["BUCKLE UP!", "Hold onto your socks!", "WILD MODE ENGAGED!"],
  default: ["Onward!", "Here we go!", "Quest time!"],
};

export function pickTransitionPhrase(vibeKey: VibeKey | undefined, seed: number): string {
  const list = transitionPhrases[vibeKey ?? "default"];
  return list[Math.abs(seed) % list.length];
}
