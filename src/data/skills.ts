
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
    kiCost: 20, // Fixed 20 Ki cost
    kiCostPercent: 1, // Plus 1% of max Ki
    description: "Channel your ki into a powerful energy blast",
    purchased: false,
    cost: 500
  },
  {
    name: "Kaioken x2",
    type: "form",
    damageMultiplier: 2,
    kiCost: 1500, // Fixed 1500 Ki cost
    kiCostPercent: 5, // Plus 5% of max Ki
    description: "A technique that doubles your power but drains 2% HP per turn",
    purchased: false,
    cost: 9000,
    powerRequirement: 9000,
    specialEffect: {
      type: "hp_drain_percent",
      value: 0.02,
      multiplier: 2
    }
  }
];
