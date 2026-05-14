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
  options: [VibeOption, VibeOption]; // always exactly 2
};

/**
 * "This or That" daily warm-up. Only 2 choices so kids with
 * decision paralysis don't freeze. Quick, silly, fun.
 * Each pair is designed to be equally appealing — no wrong answer.
 */
export const vibePrompts: VibePrompt[] = [
  {
    id: "fly-or-invisible",
    question: "Would you rather…",
    options: [
      { emoji: "🦅", label: "Fly like an eagle", vibe: "zappy" },
      { emoji: "👻", label: "Be invisible", vibe: "chill" },
    ],
  },
  {
    id: "rocket-or-snail",
    question: "How are you getting there today?",
    options: [
      { emoji: "🚀", label: "ROCKET — full speed!", vibe: "zappy" },
      { emoji: "🐌", label: "Giant snail — slow ride", vibe: "sleepy" },
    ],
  },
  {
    id: "pizza-or-icecream",
    question: "Your brain fuel for today:",
    options: [
      { emoji: "🍕", label: "Pizza power!", vibe: "zappy" },
      { emoji: "🍦", label: "Ice cream energy", vibe: "chill" },
    ],
  },
  {
    id: "lion-or-turtle",
    question: "Pick your sidekick!",
    options: [
      { emoji: "🦁", label: "Lion — ROAR!", vibe: "zappy" },
      { emoji: "🐢", label: "Turtle — slow & wise", vibe: "chill" },
    ],
  },
  {
    id: "fire-or-water",
    question: "Your element today:",
    options: [
      { emoji: "🔥", label: "FIRE — let's go!", vibe: "wild" },
      { emoji: "🌊", label: "Water — flow with it", vibe: "chill" },
    ],
  },
  {
    id: "sword-or-shield",
    question: "Choose your quest gear!",
    options: [
      { emoji: "⚔️", label: "Lightning sword", vibe: "zappy" },
      { emoji: "🛡️", label: "Magic shield", vibe: "chill" },
    ],
  },
  {
    id: "sun-or-moon",
    question: "Which one are you today?",
    options: [
      { emoji: "☀️", label: "The Sun — full beam!", vibe: "zappy" },
      { emoji: "🌙", label: "The Moon — quiet power", vibe: "sleepy" },
    ],
  },
  {
    id: "dino-or-cat",
    question: "Secret identity check!",
    options: [
      { emoji: "🦖", label: "T-Rex — STOMP STOMP", vibe: "wild" },
      { emoji: "🐱", label: "Cat — I do what I want", vibe: "cloudy" },
    ],
  },
  {
    id: "crown-or-cape",
    question: "Today you're wearing:",
    options: [
      { emoji: "👑", label: "A golden crown", vibe: "zappy" },
      { emoji: "🦸", label: "A superhero cape", vibe: "wild" },
    ],
  },
  {
    id: "dragon-or-panda",
    question: "You're riding a…",
    options: [
      { emoji: "🐉", label: "DRAGON — breathe fire!", vibe: "wild" },
      { emoji: "🐼", label: "Giant panda — so fluffy", vibe: "chill" },
    ],
  },
  {
    id: "volcano-or-cloud",
    question: "What's your energy like?",
    options: [
      { emoji: "🌋", label: "VOLCANO — about to blow!", vibe: "wild" },
      { emoji: "☁️", label: "Soft cloud — floating", vibe: "sleepy" },
    ],
  },
  {
    id: "ninja-or-wizard",
    question: "Pick your class!",
    options: [
      { emoji: "🥷", label: "Ninja — fast & sneaky", vibe: "zappy" },
      { emoji: "🧙", label: "Wizard — magic spells", vibe: "chill" },
    ],
  },
  {
    id: "trumpet-or-drums",
    question: "If you were a sound:",
    options: [
      { emoji: "🎺", label: "TRUMPET — BA BA BAAA!", vibe: "zappy" },
      { emoji: "🥁", label: "DRUMS — boom boom boom", vibe: "wild" },
    ],
  },
  {
    id: "race-or-nap",
    question: "Right now I want to…",
    options: [
      { emoji: "🏃", label: "Run a race!", vibe: "zappy" },
      { emoji: "🛋️", label: "Nap on the couch", vibe: "sleepy" },
    ],
  },
  {
    id: "space-or-ocean",
    question: "Where are we adventuring?",
    options: [
      { emoji: "🚀", label: "Outer space!", vibe: "zappy" },
      { emoji: "🐙", label: "Deep ocean!", vibe: "chill" },
    ],
  },
  {
    id: "cake-or-popcorn",
    question: "Quest snack!",
    options: [
      { emoji: "🎂", label: "Birthday cake", vibe: "zappy" },
      { emoji: "🍿", label: "Movie popcorn", vibe: "chill" },
    ],
  },
  {
    id: "big-or-tiny",
    question: "Today I am…",
    options: [
      { emoji: "🦕", label: "GIANT — bigger than a house!", vibe: "wild" },
      { emoji: "🐜", label: "Tiny ant — sneak everywhere", vibe: "chill" },
    ],
  },
  {
    id: "robot-or-alien",
    question: "You're actually a…",
    options: [
      { emoji: "🤖", label: "Robot — beep boop!", vibe: "zappy" },
      { emoji: "👽", label: "Alien — take me to your leader", vibe: "chill" },
    ],
  },
  {
    id: "hammer-or-wand",
    question: "Pick your tool!",
    options: [
      { emoji: "🔨", label: "Thor's hammer — SMASH!", vibe: "wild" },
      { emoji: "🪄", label: "Magic wand — poof!", vibe: "chill" },
    ],
  },
  {
    id: "cheetah-or-sloth",
    question: "Your speed today:",
    options: [
      { emoji: "🐆", label: "Cheetah — FASTEST EVER", vibe: "zappy" },
      { emoji: "🦥", label: "Sloth — zero rush", vibe: "sleepy" },
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
      "Yo, panda buddy!",
      "Welcome back, panda!",
      "Hello again, bamboo hero.",
    ],
    responses: {
      zappy: [
        "WHOOSH — panda power activated! 🐼💨",
        "I knew it. Panda high-five! 🐾",
        "Yes! Let's roll through these quests!",
      ],
      chill: [
        "Steady panda energy. We got this.",
        "Nice and chill. That's a great pace.",
        "Cool panda. Let's munch through the day. 🎋",
      ],
      sleepy: [
        "Same. Slow paws today, panda friend.",
        "Sleepy panda is a wise panda. We'll go gentle. 🐾",
        "Yawn. Bamboo snack first, quests second.",
      ],
      cloudy: [
        "Real. Even pandas have grumpy days.",
        "Fair. Let's start with just ONE small thing.",
        "Cloudy panda feelings. We'll go slow today.",
      ],
      wild: [
        "WHOAAA — save some tumbles for the quests! 🌪️",
        "Look at you GO. Channel that into something good!",
        "Wild panda detected! Don't roll into the furniture! 😆",
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
