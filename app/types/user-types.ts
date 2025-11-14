export interface Player {
    username: string;
    anxiety: number;
    level: number;
    experience: number;
    gold: number;
    gear?: Gear;
    mob?: Mob;
    bosses?: Boss[];
    attacks?: Attack[];
    checkins?: Checkin[];
}

export interface Gear {
    head: Equipment | undefined;
    body: Equipment | undefined;
    cape: Equipment | undefined;
    legs: Equipment | undefined;
    boots: Equipment | undefined;
    weapon: Equipment | undefined;

}

export type GearSlot = 'head' | 'body' | 'cape' | 'legs' | 'boots' | 'weapon'

export interface Equipment {
    title: string;
    slot: GearSlot;
    desc: string;
    expBoost: number;
    goldBoost: number;
    dmgBoost: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'very_hard' | 'panic'

export interface Mob {
    title: string;
    desc: string;
    difficulty: Difficulty;
    reward: Reward;
    health: number;
}

export interface Reward {
    gold: number;
    exp: number;
    item?: Equipment;
}

export interface Boss {
    title: string;
    desc: string;
    difficulty: Difficulty;
    mobs: Mob[]
    dateStart: Date;
    dateEnd: Date;
    anxiety: number;//1-100
}

export interface Attack {
    title: string;
    desc: string;
    time: number;
    damage: number;
    level: number;
    exp: number;
    baseExpGain: number;
    steps: string[];
}

export interface Checkin {
  anxiety: number // 1-100
  description: string
  date: string
}