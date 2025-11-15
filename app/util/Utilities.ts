import type { Difficulty, Mob } from "~/types/user-types";

export function getNextLevelExp(level: number) {
  const baseExperience: number = 100;
  if (level < 2) return baseExperience;
  return Math.floor((level * baseExperience) ** 1.03);
}

const mobAmounts = { easy: 1, medium: 3, hard: 5, very_hard: 8, panic: 12 };
const mobNames: string[] = [
  "anxiety-troll",
  "stress-goblin",
  "sweaty-teddy",
  "loud-bug",
];
const rewardAmt = {
  easy: 10,
  medium: 20,
  hard: 50,
  very_hard: 100,
  panic: 200,
};

export function createMobs(difficulty: Difficulty): Mob[] {
  const mobs: Mob[] = [];
  const mobAmt = mobAmounts[difficulty];

  for (let i = 0; i < mobAmt; i++) {
    const randomName: string =
      mobNames[Math.floor(Math.random() * (mobNames.length - 1 + 1)) - 1] ??
      "basic-troll";
    const goldAmt = getRandomRewardAmt(difficulty);
    const expAmt = getRandomRewardAmt(difficulty) / 2;
    const hp = rewardAmt[difficulty];
    const newMob: Mob = {
      id: i,
      title: randomName,
      reward: { gold: goldAmt, exp: expAmt },
      health: hp,
      maxHealth: hp,
    };
    mobs.push(newMob);
  }

  return mobs;
}

function getRandomRewardAmt(difficulty: Difficulty) {
  const max = rewardAmt[difficulty];
  const min = rewardAmt[difficulty] / 2;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
