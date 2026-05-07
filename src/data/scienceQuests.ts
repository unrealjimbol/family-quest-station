import type { ScienceQuest } from "@/lib/types";

export const scienceQuests: ScienceQuest[] = [
  {
    id: "sq_orange",
    title: "Floating Orange",
    question: "An orange with its peel floats in water. What happens if you peel it first?",
    choices: [
      { id: "a", label: "It floats higher" },
      { id: "b", label: "It sinks" },
      { id: "c", label: "It spins around" },
    ],
    correctChoiceId: "b",
    explanation:
      "The peel is full of tiny air pockets, like a life jacket. Without the peel, the orange is heavier than water and sinks.",
    miniMission: "Drop a peeled and unpeeled orange in a bowl of water. Watch what happens!",
    badge: { name: "Citrus Captain", emoji: "🍊" },
  },
  {
    id: "sq_milk",
    title: "Rainbow Milk",
    question: "What makes the colors swirl when you touch milk with a soapy cotton swab?",
    choices: [
      { id: "a", label: "The soap pushes the fat in milk" },
      { id: "b", label: "The milk is angry" },
      { id: "c", label: "The colors are magnets" },
    ],
    correctChoiceId: "a",
    explanation:
      "Soap loves to grab onto fat. Milk has tiny bits of fat floating in it, so the soap rushes to grab them and the colors come along for the ride.",
    miniMission: "Pour milk in a plate, add drops of food coloring, and touch with a soapy q-tip.",
    badge: { name: "Color Whirler", emoji: "🌈" },
  },
  {
    id: "sq_air",
    title: "Invisible Air",
    question: "If you push an upside-down cup with a paper towel inside straight into water, what happens to the towel?",
    choices: [
      { id: "a", label: "It gets soaked" },
      { id: "b", label: "It stays dry" },
      { id: "c", label: "It floats away" },
    ],
    correctChoiceId: "b",
    explanation:
      "Air is really there, even if you can't see it! The cup is full of air, and the air keeps the water out.",
    miniMission: "Stuff a paper towel into a cup, push it straight down into a bowl of water, then pull it up.",
    badge: { name: "Air Detective", emoji: "💨" },
  },
  {
    id: "sq_shadow",
    title: "Shadow Clock",
    question: "Why does your shadow move during the day?",
    choices: [
      { id: "a", label: "Because the Sun moves across the sky" },
      { id: "b", label: "Because shadows get bored" },
      { id: "c", label: "Because of the wind" },
    ],
    correctChoiceId: "a",
    explanation:
      "As the Sun moves across the sky, the angle of light changes, and your shadow moves with it.",
    miniMission: "Stand in the same spot outside and trace your shadow now, and again in one hour.",
    badge: { name: "Shadow Tracker", emoji: "🌞" },
  },
  {
    id: "sq_seed",
    title: "Bean Sprout",
    question: "What does a seed need most to wake up and grow?",
    choices: [
      { id: "a", label: "Music" },
      { id: "b", label: "Water and warmth" },
      { id: "c", label: "Sugar" },
    ],
    correctChoiceId: "b",
    explanation:
      "Seeds wake up when they get water and a little warmth. That's their signal to start growing.",
    miniMission: "Put a bean on a wet paper towel inside a baggie. Tape it to a sunny window for a few days.",
    badge: { name: "Plant Whisperer", emoji: "🌱" },
  },
  {
    id: "sq_heart",
    title: "Heartbeat Hunter",
    question: "Where can you feel your heart beating most easily?",
    choices: [
      { id: "a", label: "Only on your chest" },
      { id: "b", label: "On your wrist and neck" },
      { id: "c", label: "On your knees" },
    ],
    correctChoiceId: "b",
    explanation:
      "Your heart pumps blood through every part of you. You can feel it best where blood vessels are close to the skin — like your wrist and neck.",
    miniMission: "Find your pulse on your wrist. Count the beats for 10 seconds.",
    badge: { name: "Body Explorer", emoji: "❤️" },
  },
  {
    id: "sq_telephone",
    title: "Cup Telephone",
    question: "How does sound travel through a string telephone?",
    choices: [
      { id: "a", label: "The string shakes really fast" },
      { id: "b", label: "The cup is magic" },
      { id: "c", label: "Through tiny radios" },
    ],
    correctChoiceId: "a",
    explanation:
      "When you talk, the cup wiggles. That wiggle moves through the tight string to the other cup, and into your friend's ear!",
    miniMission: "Connect two cups with a tight string and try to whisper through it.",
    badge: { name: "Sound Sender", emoji: "📞" },
  },
  {
    id: "sq_color",
    title: "Color Mix Magic",
    question: "What color do you get when you mix blue and yellow?",
    choices: [
      { id: "a", label: "Pink" },
      { id: "b", label: "Brown" },
      { id: "c", label: "Green" },
    ],
    correctChoiceId: "c",
    explanation:
      "Blue and yellow combine to make green — the color of grass, leaves, and frogs!",
    miniMission: "Drop blue and yellow food coloring into a clear cup of water and stir.",
    badge: { name: "Color Mixer", emoji: "🎨" },
  },
  {
    id: "sq_moon",
    title: "Moon Watcher",
    question: "Why does the Moon look different shapes on different nights?",
    choices: [
      { id: "a", label: "The Moon changes size" },
      { id: "b", label: "We see different parts lit by the Sun" },
      { id: "c", label: "Clouds reshape it" },
    ],
    correctChoiceId: "b",
    explanation:
      "The Moon is always a sphere. As it travels around Earth, the Sun lights up different parts that we can see — that's why it looks like it changes shape.",
    miniMission: "Draw the Moon's shape tonight, then again tomorrow night. Compare!",
    badge: { name: "Moon Mapper", emoji: "🌙" },
  },
  {
    id: "sq_ice",
    title: "Ice Race",
    question: "What happens if you sprinkle salt on an ice cube?",
    choices: [
      { id: "a", label: "It freezes harder" },
      { id: "b", label: "It melts faster" },
      { id: "c", label: "It changes color" },
    ],
    correctChoiceId: "b",
    explanation:
      "Salt lowers the temperature water needs to stay frozen. So ice with salt melts faster than ice without.",
    miniMission: "Put two ice cubes on a plate. Sprinkle salt on one. Watch which one melts first.",
    badge: { name: "Frost Scientist", emoji: "🧊" },
  },
];

export function pickScienceQuestForDay(dateStr: string, salt: string): ScienceQuest {
  let hash = 0;
  const key = `${dateStr}_${salt}`;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return scienceQuests[hash % scienceQuests.length];
}
