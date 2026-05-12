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
  {
    id: "sq11",
    title: "Dinosaur Teeth",
    question: "How can scientists tell if a dinosaur ate plants or meat just by looking at its teeth?",
    choices: [
      { id: "sq11a", label: "Meat-eaters had sharp pointy teeth" },
      { id: "sq11b", label: "Plant-eaters had colorful teeth" },
      { id: "sq11c", label: "All dinosaurs had the same teeth" },
    ],
    correctChoiceId: "sq11a",
    explanation:
      "Meat-eating dinosaurs like T. rex had sharp, knife-like teeth for tearing meat. Plant-eaters like Triceratops had flat teeth for grinding up leaves and plants.",
    miniMission: "Look at your own teeth in a mirror. Find your flat ones for chewing and your pointy ones for biting!",
    badge: { name: "Dino Detective", emoji: "🦖" },
  },
  {
    id: "sq12",
    title: "Magnet Magic",
    question: "Which of these can a magnet stick to?",
    choices: [
      { id: "sq12a", label: "A wooden spoon" },
      { id: "sq12b", label: "A steel paper clip" },
      { id: "sq12c", label: "A rubber duck" },
    ],
    correctChoiceId: "sq12b",
    explanation:
      "Magnets are attracted to metals like iron and steel. Paper clips are made of steel, so they stick! Wood and rubber are not magnetic at all.",
    miniMission: "Grab a magnet and walk around the house. Test 10 different objects to see which ones stick!",
    badge: { name: "Magnet Master", emoji: "🧲" },
  },
  {
    id: "sq13",
    title: "Cloud Factory",
    question: "What are clouds made of?",
    choices: [
      { id: "sq13a", label: "Cotton and fluff" },
      { id: "sq13b", label: "Tiny drops of water or ice" },
      { id: "sq13c", label: "Smoke from volcanoes" },
    ],
    correctChoiceId: "sq13b",
    explanation:
      "Clouds are made of billions of teeny tiny water droplets or ice crystals floating in the air. They form when warm, wet air rises up and cools down.",
    miniMission: "Breathe out on a cold day or near a freezer. That little puff you see is your own mini cloud!",
    badge: { name: "Cloud Spotter", emoji: "☁️" },
  },
  {
    id: "sq14",
    title: "Octopus Brains",
    question: "How many hearts does an octopus have?",
    choices: [
      { id: "sq14a", label: "One, just like us" },
      { id: "sq14b", label: "Three" },
      { id: "sq14c", label: "Eight, one per arm" },
    ],
    correctChoiceId: "sq14b",
    explanation:
      "An octopus has three hearts! Two hearts pump blood to the gills to get oxygen, and one big heart pumps blood to the rest of the body. That is triple the heart power!",
    miniMission: "Draw an octopus and label all three hearts. Give each heart a funny name!",
    badge: { name: "Ocean Brain", emoji: "🐙" },
  },
  {
    id: "sq15",
    title: "Rainbow Secret",
    question: "What makes a rainbow appear in the sky?",
    choices: [
      { id: "sq15a", label: "Sunlight splits into colors inside raindrops" },
      { id: "sq15b", label: "Clouds get painted by the wind" },
      { id: "sq15c", label: "The sky is showing its true colors" },
    ],
    correctChoiceId: "sq15a",
    explanation:
      "White sunlight is actually made of all the colors mixed together. When sunlight passes through raindrops, the drops bend the light and split it into red, orange, yellow, green, blue, and violet!",
    miniMission: "On a sunny day, spray a garden hose with your back to the Sun. Can you make your own rainbow?",
    badge: { name: "Rainbow Maker", emoji: "🌈" },
  },
  {
    id: "sq16",
    title: "Buzzy Bees",
    question: "How do bees tell other bees where to find flowers?",
    choices: [
      { id: "sq16a", label: "They sing a special song" },
      { id: "sq16b", label: "They do a wiggly dance" },
      { id: "sq16c", label: "They draw a map on the hive" },
    ],
    correctChoiceId: "sq16b",
    explanation:
      "Bees do a waggle dance to show other bees where the best flowers are! The direction they wiggle tells which way to fly, and how long they dance tells how far away the flowers are.",
    miniMission: "Make up your own waggle dance to tell someone where your favorite snack is hiding!",
    badge: { name: "Bee Buddy", emoji: "🐝" },
  },
  {
    id: "sq17",
    title: "Volcano Pop",
    question: "What comes out of a volcano when it erupts?",
    choices: [
      { id: "sq17a", label: "Hot melted rock called lava" },
      { id: "sq17b", label: "Boiling water like a kettle" },
      { id: "sq17c", label: "Giant snowballs" },
    ],
    correctChoiceId: "sq17a",
    explanation:
      "Deep underground, rock gets so hot it melts into a gooey liquid called magma. When a volcano erupts, that melted rock shoots out and is called lava. It can be over 1,000 degrees!",
    miniMission: "Build a mini volcano with baking soda and vinegar in a cup. Watch it fizz and overflow!",
    badge: { name: "Lava Legend", emoji: "🌋" },
  },
  {
    id: "sq18",
    title: "Star Light",
    question: "Why do stars twinkle at night?",
    choices: [
      { id: "sq18a", label: "They are blinking on and off" },
      { id: "sq18b", label: "Earth's air bends their light around" },
      { id: "sq18c", label: "They are spinning really fast" },
    ],
    correctChoiceId: "sq18b",
    explanation:
      "Starlight has to travel through layers of moving air around Earth. The air bends the light back and forth, making the stars look like they are twinkling. In space with no air, stars do not twinkle!",
    miniMission: "Look up at the stars tonight. Do the ones near the horizon twinkle more than the ones straight above you?",
    badge: { name: "Star Gazer", emoji: "⭐" },
  },
  {
    id: "sq19",
    title: "Tongue Map",
    question: "Can your tongue taste sweet things only on the tip?",
    choices: [
      { id: "sq19a", label: "Yes, each part tastes different things" },
      { id: "sq19b", label: "No, you can taste sweet everywhere on your tongue" },
      { id: "sq19c", label: "Your tongue cannot taste sweet at all" },
    ],
    correctChoiceId: "sq19b",
    explanation:
      "Your whole tongue can taste sweet, sour, salty, and bitter all over! The old tongue map idea was a mistake. Every part of your tongue has taste buds for all flavors.",
    miniMission: "Dab a tiny bit of honey on different spots of your tongue. Can you taste it everywhere?",
    badge: { name: "Taste Tester", emoji: "👅" },
  },
  {
    id: "sq20",
    title: "Penguin Huddle",
    question: "How do penguins stay warm in the freezing Antarctic?",
    choices: [
      { id: "sq20a", label: "They build fires" },
      { id: "sq20b", label: "They huddle together in a big group" },
      { id: "sq20c", label: "They wear tiny sweaters" },
    ],
    correctChoiceId: "sq20b",
    explanation:
      "Emperor penguins huddle together in huge groups to share body heat. They take turns moving to the warm middle and the cold outside so everyone gets a chance to warm up!",
    miniMission: "Get your family to huddle together on a chilly day. Does it feel warmer in the middle of the group?",
    badge: { name: "Penguin Pal", emoji: "🐧" },
  },
  {
    id: "sq21",
    title: "Raisin Dancer",
    question: "What happens when you drop raisins into fizzy soda water?",
    choices: [
      { id: "sq21a", label: "They dissolve and disappear" },
      { id: "sq21b", label: "They dance up and down" },
      { id: "sq21c", label: "They turn the water purple" },
    ],
    correctChoiceId: "sq21b",
    explanation:
      "Tiny bubbles from the soda grab onto the wrinkly raisin and lift it up like little balloons. At the top, the bubbles pop and the raisin sinks back down, then it happens again and again!",
    miniMission: "Drop a few raisins into a glass of clear soda water. Watch them dance up and down!",
    badge: { name: "Fizz Wizard", emoji: "🫧" },
  },
  {
    id: "sq22",
    title: "Earthworm Helper",
    question: "Why are earthworms good for gardens?",
    choices: [
      { id: "sq22a", label: "They eat weeds" },
      { id: "sq22b", label: "They dig tunnels that help air and water reach plant roots" },
      { id: "sq22c", label: "They scare away birds" },
    ],
    correctChoiceId: "sq22b",
    explanation:
      "Earthworms are like tiny gardeners! As they dig through soil, they make tunnels that let air and water flow to plant roots. Their poop also makes the soil richer and healthier for plants.",
    miniMission: "After a rainstorm, look for earthworms on the sidewalk. Carefully move one to a garden where it can help!",
    badge: { name: "Worm Wrangler", emoji: "🪱" },
  },
  {
    id: "sq23",
    title: "Planet Spin",
    question: "Which planet in our solar system spins the fastest?",
    choices: [
      { id: "sq23a", label: "Earth" },
      { id: "sq23b", label: "Jupiter" },
      { id: "sq23c", label: "Mars" },
    ],
    correctChoiceId: "sq23b",
    explanation:
      "Jupiter is the biggest planet AND the fastest spinner! Even though it is enormous, one day on Jupiter is less than 10 hours. Earth takes 24 hours to spin once, so Jupiter spins more than twice as fast.",
    miniMission: "Spin a big ball and a small ball on the floor. Can a big one spin faster? Jupiter says yes!",
    badge: { name: "Planet Pro", emoji: "🪐" },
  },
  {
    id: "sq24",
    title: "Lightning Counter",
    question: "Which comes first during a storm: lightning or thunder?",
    choices: [
      { id: "sq24a", label: "Thunder comes first" },
      { id: "sq24b", label: "They happen at the same time" },
      { id: "sq24c", label: "Lightning comes first" },
    ],
    correctChoiceId: "sq24c",
    explanation:
      "Lightning and thunder happen at the same moment, but light travels way faster than sound. So you see the flash first and hear the boom a few seconds later!",
    miniMission: "Next time there is a storm, count the seconds between a flash and the boom. Every 5 seconds means the lightning is about 1 mile away!",
    badge: { name: "Storm Chaser", emoji: "⚡" },
  },
  {
    id: "sq25",
    title: "Butterfly Life",
    question: "What is a caterpillar doing inside its cocoon?",
    choices: [
      { id: "sq25a", label: "Sleeping and dreaming" },
      { id: "sq25b", label: "Completely rebuilding its body into a butterfly" },
      { id: "sq25c", label: "Growing extra legs" },
    ],
    correctChoiceId: "sq25b",
    explanation:
      "Inside the cocoon, the caterpillar breaks down almost completely into a soupy goo, then rebuilds itself into a butterfly with wings, new eyes, and a long tongue for sipping nectar. It is like nature's greatest magic trick!",
    miniMission: "Look for caterpillars or cocoons outside. Draw the four stages: egg, caterpillar, cocoon, butterfly!",
    badge: { name: "Metamorphosis Master", emoji: "🦋" },
  },
  {
    id: "sq26",
    title: "Bone Count",
    question: "Who has more bones: a baby or a grown-up?",
    choices: [
      { id: "sq26a", label: "A grown-up has more" },
      { id: "sq26b", label: "They have the same" },
      { id: "sq26c", label: "A baby has more" },
    ],
    correctChoiceId: "sq26c",
    explanation:
      "Babies are born with about 270 bones, but adults only have 206! As you grow up, some small bones fuse together and become one bigger bone. So you are actually losing bones as you get older!",
    miniMission: "Feel the top of your head gently. The soft spots babies have are where bones have not joined together yet!",
    badge: { name: "Bone Scholar", emoji: "🦴" },
  },
  {
    id: "sq27",
    title: "Ocean Glow",
    question: "Why does the ocean sometimes glow blue at night?",
    choices: [
      { id: "sq27a", label: "The moonlight turns the water blue" },
      { id: "sq27b", label: "Tiny living things in the water make their own light" },
      { id: "sq27c", label: "Underwater volcanoes light it up" },
    ],
    correctChoiceId: "sq27b",
    explanation:
      "Tiny creatures called dinoflagellates can make their own blue-green light, just like fireflies! When waves or fish disturb them, they light up. It is called bioluminescence.",
    miniMission: "Turn off the lights and crack a glow stick. The glow stick makes light from chemicals, just like ocean creatures do!",
    badge: { name: "Glow Guardian", emoji: "🌊" },
  },
  {
    id: "sq28",
    title: "Sticky Static",
    question: "Why does a balloon stick to the wall after you rub it on your hair?",
    choices: [
      { id: "sq28a", label: "The balloon gets sticky from hair oil" },
      { id: "sq28b", label: "Rubbing gives the balloon an electric charge" },
      { id: "sq28c", label: "The wall is magnetic" },
    ],
    correctChoiceId: "sq28b",
    explanation:
      "Rubbing the balloon on your hair steals tiny invisible things called electrons from your hair. This gives the balloon a negative charge, and it is attracted to the neutral wall, just like a magnet!",
    miniMission: "Rub a balloon on your hair and try sticking it to the wall, the fridge, or your shirt. What does it stick to?",
    badge: { name: "Static Superstar", emoji: "🎈" },
  },
  {
    id: "sq29",
    title: "Plant Drink",
    question: "How does water travel from the roots all the way to the top of a tall tree?",
    choices: [
      { id: "sq29a", label: "The tree has a tiny pump inside" },
      { id: "sq29b", label: "Water climbs up through thin tubes in the trunk" },
      { id: "sq29c", label: "The leaves reach down to grab it" },
    ],
    correctChoiceId: "sq29b",
    explanation:
      "Trees have super thin tubes inside their trunks. Water gets pulled up through these tubes because the leaves at the top lose water into the air, which tugs more water upward from the roots. It is like sipping through a really long straw!",
    miniMission: "Put a white flower or celery stalk in a glass of colored water. In a few hours, watch the color travel up!",
    badge: { name: "Root Ranger", emoji: "🌳" },
  },
  {
    id: "sq30",
    title: "Fossil Hunt",
    question: "What is a fossil?",
    choices: [
      { id: "sq30a", label: "A really old rock that looks cool" },
      { id: "sq30b", label: "The preserved remains of a plant or animal from long ago" },
      { id: "sq30c", label: "A type of crystal that grows underground" },
    ],
    correctChoiceId: "sq30b",
    explanation:
      "Fossils are the remains or imprints of plants and animals that lived millions of years ago. Over a very long time, their bones or shells turned to stone, giving us clues about ancient life on Earth!",
    miniMission: "Press a leaf or seashell into playdough to make an imprint. That is how many fossils start!",
    badge: { name: "Fossil Finder", emoji: "🪨" },
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
