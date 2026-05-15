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
      { emoji: "🦦", label: "Sea otter — float along", vibe: "chill" },
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
      "Yo, monster buddy!",
      "Welcome back, sea beast!",
      "Hello again, deep-sea legend.",
    ],
    responses: {
      zappy: [
        "ROAAAAR — monster power activated! 🌊👹",
        "I knew it. Monster high-five! Let's DEVOUR these quests!",
        "Yes! Time to chomp through the day!",
      ],
      chill: [
        "Steady monster energy. Lurking calmly today.",
        "Nice and chill. Even monsters rest sometimes.",
        "Cool beast mode. Just floating in the deep. 🌊",
      ],
      sleepy: [
        "Same. Slow tentacles today, monster friend.",
        "Sleepy sea monster is a wise monster. We'll go gentle. 🌙",
        "Yawn. Snack first, quests second.",
      ],
      cloudy: [
        "Real. Even sea monsters have grumpy days.",
        "Fair. Let's start with just ONE small thing.",
        "Cloudy monster feelings. We'll go slow today.",
      ],
      wild: [
        "WHOAAA — MONSTER MODE ACTIVATED! 🌊👹💥",
        "Look at you GO. Channel that into something epic!",
        "Wild sea monster detected! Don't chomp the furniture! 😆",
      ],
    },
  },
  emilia: {
    greetings: [
      "Hi Emilia!",
      "Hey capy friend!",
      "Welcome back, little capy!",
      "Hello, cozy capybara!",
    ],
    responses: {
      zappy: [
        "SPLASH — capybara power activated! 🦫💦",
        "I knew it. Capy high-five! Let's go!",
        "Look at that cozy energy zoom!",
      ],
      chill: [
        "Steady capy vibes. Float along today.",
        "Soft capy energy. I love it. 🌸",
        "Calm capybara mode. Perfect pace.",
      ],
      sleepy: [
        "Soft cloud day. Sleepy capy snooze mode. ☁️",
        "Sleepy capybara? Hot spring quests it is. 🦫♨️",
        "Yawn. Capybaras nap AND get things done.",
      ],
      cloudy: [
        "Even capybaras have grumpy days. That's okay.",
        "One tiny step first. Just one thing.",
        "Cloudy capy feelings. We'll go slow today.",
      ],
      wild: [
        "SPLASH STORM INCOMING! 💦🦫💦",
        "Whoa, whoa — save that splashing for the quests!",
        "WILD capybara detected. Hide the oranges! 🍊",
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
