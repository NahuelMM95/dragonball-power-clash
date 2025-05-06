
import { CombatStats, Item } from '../types/game';

// Helper function to calculate player stats based on power level
export const calculatePlayerStats = (powerLevel: number, equippedItems: Item[]): CombatStats => {
  // Start with base stats
  let stats = {
    hp: powerLevel * 10,
    maxHp: powerLevel * 10,
    damage: Math.max(1, Math.floor(powerLevel * 0.8)),
    ki: powerLevel * 5,
    maxKi: powerLevel * 5,
    damageMultiplier: 1, // Default multiplier
    basePowerLevel: powerLevel,
    powerLevel: powerLevel
  };
  
  // Apply equipment bonuses
  equippedItems.forEach(item => {
    if (item.effect) {
      if (item.effect.type === 'damage_multiplier') {
        stats.damageMultiplier = item.effect.value; // Set the multiplier directly
        stats.damage = Math.floor(stats.damage * item.effect.value); // Apply to base damage
      }
    }
  });
  
  return stats;
};
