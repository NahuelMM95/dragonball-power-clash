
import { Skill } from '../types/game';

export const playerSkills: Skill[] = [
  {
    name: "Basic Combo",
    type: "basic",
    damageMultiplier: 1,
    kiCost: 0,
    description: "A simple combination of punches and kicks",
    purchased: true,
    cost: 0
  },
  {
    name: "Ki Blast",
    type: "special",
    damageMultiplier: 1.5,
    kiCost: 20,
    description: "Channel your ki into a powerful energy blast",
    purchased: false,
    cost: 500
  }
];
