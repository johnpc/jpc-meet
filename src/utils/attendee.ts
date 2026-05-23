const ADJECTIVES = [
  "Playful",
  "Curious",
  "Sneaky",
  "Graceful",
  "Majestic",
  "Fierce",
  "Wise",
  "Gentle",
  "Daring",
  "Loyal",
];

const ANIMALS = [
  "Cat",
  "Dog",
  "Lion",
  "Tiger",
  "Bear",
  "Elephant",
  "Giraffe",
  "Panda",
  "Dolphin",
  "Penguin",
];

export function generateAttendeeName(
  randomFn: () => number = Math.random,
): string {
  const adjective = ADJECTIVES[Math.floor(randomFn() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(randomFn() * ANIMALS.length)];
  return `${adjective} ${animal}`;
}
