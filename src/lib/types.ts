export type KidId = "elio" | "emilia";
export type ProfileId = KidId | "cynthia" | "parent";

export type QuestGroup = "night" | "morning" | "afterschool" | "dinner";

export type Quest = {
  id: string;
  label: string;
  group: QuestGroup;
  emoji: string;
  /** If true, this quest only appears on weekdays (Mon–Fri) */
  weekdaysOnly?: boolean;
};

export type ScienceQuest = {
  id: string;
  title: string;
  question: string;
  choices: { id: string; label: string }[];
  correctChoiceId: string;
  explanation: string;
  miniMission: string;
  badge: { name: string; emoji: string };
};

export type QuietCheckIn = {
  date: string;
  mood?: "calm" | "okay" | "tired" | "spark";
  steps: string[];
  oneSentence?: string;
};

export type ParentReset = {
  date: string;
  answers: Record<number, string>;
};

export type VibeKey = "zappy" | "chill" | "sleepy" | "cloudy" | "wild";

export type Vibe = {
  key: VibeKey;
  emoji: string;
  label: string;
  promptId: string;
  pickedAt: number;
};

export type DayState = {
  date: string;
  completedQuestIds: string[];
  scienceUnlocked: boolean;
  scienceClaimedQuestId?: string;
  scienceClaimedChoiceId?: string;
  vibe?: Vibe;
};

export type DaySnapshot = {
  date: string;
  completedQuestIds: string[];
  vibe?: Vibe;
  scienceQuestEarned?: string; // ScienceQuest id earned that day
};

export type MemoryMatchDifficulty = "easy" | "medium" | "hard";

export type MathDashDifficulty = "easy" | "medium" | "hard";

export type GameStats = {
  memoryMatch?: Partial<
    Record<MemoryMatchDifficulty, { time: number; moves: number }>
  >;
  colorSort?: {
    completedLevels: number[];
    bestMoves?: Record<number, number>;
  };
  echoBeat?: {
    bestStreak: number;
  };
  patternQuest?: {
    bestScore: number;
  };
  mathDash?: {
    bestScore: Partial<Record<MathDashDifficulty, number>>;
    bestTime: Partial<Record<MathDashDifficulty, number>>;
  };
  slidePuzzle?: {
    best3x3: { moves: number; time: number } | null;
    best4x4: { moves: number; time: number } | null;
  };
};

export type KidState = {
  badges: { scienceQuestId: string; earnedAt: number }[];
  today: DayState;
  history: DaySnapshot[]; // capped to last 30 days
  gameStats?: GameStats;
};

export type AppState = {
  version: 1;
  elio: KidState;
  emilia: KidState;
  cynthia: { today: QuietCheckIn };
  parent: { today: ParentReset };
};
