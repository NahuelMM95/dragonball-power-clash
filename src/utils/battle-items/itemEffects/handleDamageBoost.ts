
import { Item, BattleState } from "@/types/game";
import { removeItemFromInventory } from "../removeItemFromInventory";
import { enemyAttackAfterItem } from "../enemyAttackAfterItem";

export const handleDamageBoost = (
  item: Item,
  inventory: Item[],
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>,
  itemId: string,
  battleState: BattleState,
  setBattleState: React.Dispatch<React.SetStateAction<BattleState>>,
  endBattle: (victory: boolean) => void
) => {
  if (!item.effect || item.effect.type !== 'temp_damage_boost') return;
  
  // Apply temporary damage boost
  const newPlayerStats = {
    ...battleState.playerStats,
    damage: Math.floor(battleState.playerStats.damage * (1 + item.effect.value)),
    // Add temporary effect flag
    tempEffects: {
      ...battleState.playerStats.tempEffects || {}, // Use empty object if tempEffects is undefined
      damageBoosted: {
        endTime: Date.now() + (item.effect.duration || 0) * 1000,
        multiplier: item.effect.value
      }
    }
  };
  
  setBattleState(prev => ({
    ...prev,
    playerStats: newPlayerStats,
    log: [...prev.log, `You used ${item.name}!`, `Your damage is increased by ${item.effect?.value ? item.effect.value * 100 : 0}% for ${item.effect?.duration || 0} seconds!`],
    playerTurn: false // End player's turn after using item
  }));
  
  // Remove item from inventory
  removeItemFromInventory(inventory, setInventory, itemId);
  
  // Trigger enemy's turn after a delay
  setTimeout(() => {
    // Enemy attacks with original damage (no reduction)
    const damage = battleState.enemy?.damage || 0;
    enemyAttackAfterItem(damage, battleState, newPlayerStats, setBattleState, endBattle);
  }, 1000);
};
