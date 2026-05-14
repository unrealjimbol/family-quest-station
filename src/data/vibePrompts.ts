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

/**
 * Fun daily warm-up questions. Each one is silly/playful to get
 * ADHD kids engaged right away — no "how do you feel" therapy vibes.
 * The vibe key still maps to an energy level for response calibration.
 */
export const vibePrompts: VibePrompt[] = [
  {
    id: "superpower",
    question: "Pick your superpower for today!",
    hint: "Choose wisely, hero.",
    options: [
      { emoji: "⚡", label: "Super speed — ZOOM!", vibe: "zappy" },
      { emoji: "🛡️", label: "Invisible shield", vibe: "chill" },
      { emoji: "☁️", label: "Cloud riding — float away", vibe: "sleepy" },
      { emoji: "🌊", label: "Control the weather", vibe: "cloudy" },
      { emoji: "💥", label: "SUPER STRENGTH — SMASH!!", vibe: "wild" },
    ],
  },
  {
    id: "vehicle",
    question: "How are you getting to Quest Land?",
    hint: "Your ride is waiting!",
    options: [
      { emoji: "🚀", label: "ROCKET — 3, 2, 1, GO!", vibe: "zappy" },
      { emoji: "🚲", label: "Chill bike ride", vibe: "chill" },
      { emoji: "🐌", label: "Riding a giant snail", vibe: "sleepy" },
      { emoji: "🚂", label: "Slow train through the fog", vibe: "cloudy" },
      { emoji: "🎢", label: "ROLLER COASTER BABY!!", vibe: "wild" },
    ],
  },
  {
    id: "breakfast",
    question: "What did your brain eat for breakfast?",
    hint: "Feed the brain monster!",
    options: [
      { emoji: "🍕", label: "PIZZA — I'm unstoppable", vibe: "zappy" },
      { emoji: "🥞", label: "Pancakes — nice and easy", vibe: "chill" },
      { emoji: "🍵", label: "Hot cocoa — still waking up", vibe: "sleepy" },
      { emoji: "🥦", label: "Broccoli — somebody forced me", vibe: "cloudy" },
      { emoji: "🌶️", label: "A GHOST PEPPER 🔥🔥🔥", vibe: "wild" },
    ],
  },
  {
    id: "animal",
    question: "Pick your animal sidekick!",
    hint: "They're coming with you on today's quests.",
    options: [
      { emoji: "🦅", label: "Eagle — let's FLY", vibe: "zappy" },
      { emoji: "🐢", label: "Turtle — slow & steady wins", vibe: "chill" },
      { emoji: "🐨", label: "Koala — carry me plz", vibe: "sleepy" },
      { emoji: "🦔", label: "Hedgehog — don't touch me", vibe: "cloudy" },
      { emoji: "🐒", label: "MONKEY — chaos mode!!", vibe: "wild" },
    ],
  },
  {
    id: "planet",
    question: "Which planet are you from today?",
    hint: "Space travelers only.",
    options: [
      { emoji: "☀️", label: "The Sun — I'm on FIRE", vibe: "zappy" },
      { emoji: "🪐", label: "Saturn — floating in my rings", vibe: "chill" },
      { emoji: "🌑", label: "The Moon — dark side, sleepy side", vibe: "sleepy" },
      { emoji: "🌫️", label: "Neptune — cold and far away", vibe: "cloudy" },
      { emoji: "💫", label: "A comet — CAN'T STOP ME!", vibe: "wild" },
    ],
  },
  {
    id: "hat",
    question: "Pick your magic hat!",
    hint: "It gives you special powers today.",
    options: [
      { emoji: "👑", label: "Crown — I rule today!", vibe: "zappy" },
      { emoji: "🎩", label: "Top hat — classy vibes", vibe: "chill" },
      { emoji: "🧢", label: "Cap pulled low — leave me alone", vibe: "sleepy" },
      { emoji: "🪖", label: "Helmet — ready for battle", vibe: "cloudy" },
      { emoji: "🤡", label: "CLOWN WIG — pure chaos!!", vibe: "wild" },
    ],
  },
  {
    id: "sound",
    question: "If you were a sound, what would you be?",
    hint: "Make the noise in your head right now.",
    options: [
      { emoji: "🎺", label: "TRUMPET — BA BA BAAAA!", vibe: "zappy" },
      { emoji: "🎵", label: "Humming a tune", vibe: "chill" },
      { emoji: "😴", label: "Snoring ZZZZZZ", vibe: "sleepy" },
      { emoji: "🌧️", label: "Rain on a window", vibe: "cloudy" },
      { emoji: "💣", label: "BOOM BOOM POW!!!", vibe: "wild" },
    ],
  },
  {
    id: "weapon",
    question: "Choose your quest weapon!",
    hint: "Every hero needs one.",
    options: [
      { emoji: "⚔️", label: "Lightning sword — ZAP!", vibe: "zappy" },
      { emoji: "🏹", label: "Bow & arrow — cool and focused", vibe: "chill" },
      { emoji: "🧸", label: "A teddy bear — don't judge", vibe: "sleepy" },
      { emoji: "🛡️", label: "Giant shield — protect mode", vibe: "cloudy" },
      { emoji: "🪄", label: "WAND — random spells!! AHHH!", vibe: "wild" },
    ],
  },
  {
    id: "size",
    question: "How big are you today?",
    hint: "Size = your energy level.",
    options: [
      { emoji: "🦖", label: "DINOSAUR-sized — RAWR!", vibe: "zappy" },
      { emoji: "🐕", label: "Normal kid-sized", vibe: "chill" },
      { emoji: "🐛", label: "Tiny caterpillar", vibe: "sleepy" },
      { emoji: "👻", label: "Invisible — you can't see me", vibe: "cloudy" },
      { emoji: "🌋", label: "VOLCANO — about to EXPLODE!!", vibe: "wild" },
    ],
  },
  {
    id: "snack",
    question: "What snack would you fight a dragon for?",
    hint: "The dragon has your favorite...",
    options: [
      { emoji: "🍦", label: "ICE CREAM — fight me, dragon!", vibe: "zappy" },
      { emoji: "🍪", label: "A cookie — worth the risk", vibe: "chill" },
      { emoji: "🛋️", label: "The couch — let someone else fight", vibe: "sleepy" },
      { emoji: "😤", label: "Nothing — I'm already grumpy", vibe: "cloudy" },
      { emoji: "🍕", label: "THE WHOLE PIZZA — CHARGE!!!", vibe: "wild" },
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
