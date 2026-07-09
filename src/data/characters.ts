export const CHARACTERS = [
  { id: 1,  emoji: "🤿", name: "Little Diver",     role: "Explorer",   color: "#00d4ff" },
  { id: 2,  emoji: "🐙", name: "Captain Octo",     role: "Navigator",  color: "#c084fc" },
  { id: 3,  emoji: "🦈", name: "Tiny Shark",       role: "Speedster",  color: "#94a3b8" },
  { id: 4,  emoji: "🐢", name: "Happy Turtle",     role: "Sage",       color: "#4ade80" },
  { id: 5,  emoji: "🐋", name: "Bubble Whale",     role: "Guardian",   color: "#60a5fa" },
  { id: 6,  emoji: "🐧", name: "Penguin",          role: "Adventurer", color: "#67e8f9" },
  { id: 7,  emoji: "🦊", name: "Sea Fox",          role: "Trickster",  color: "#fb923c" },
  { id: 8,  emoji: "🌺", name: "Coral Princess",   role: "Royalty",    color: "#f472b6" },
  { id: 9,  emoji: "🐡", name: "Pirate Fish",      role: "Rogue",      color: "#fbbf24" },
  { id: 10, emoji: "🐬", name: "Friendly Dolphin", role: "Healer",     color: "#38bdf8" },
  { id: 11, emoji: "⭐", name: "Starfish",         role: "Mystic",     color: "#facc15" },
  { id: 12, emoji: "🦑", name: "Squid Knight",     role: "Warrior",    color: "#a78bfa" },
] as const;

export type Character = typeof CHARACTERS[number];
