
import { Item, BattleState } from "@/types/game";
import { removeItemFromInventory } from "../removeItemFromInventory";
import { enemyAttackAfterItem } from "../enemyAttackAfterItem";

export const handleDefenseBoost = (
  item: Item,
  inventory: Item[],
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>,
  itemId: string,
  battleState: BattleState,
  setBattleState: React.Dispatch<React.SetStateAction<BattleState>>,
  endBattle: (victory: boolean) => void
) => {
  if (!item.effect || item.effect.type !== 'temp_defense_boost') return;
  
  // Apply temporary defense boost effect
  const newPlayerStats = {
    ...battleState.playerStats,
    tempEffects: {
      ...battleState.playerStats.tempEffects || {}, // Use empty object if tempEffects is undefined
      defenseBoosted: {
        endTime: Date.now() + (item.effect.duration || 0) * 1000,
        reduction: item.effect.value
      }
    }
  };
  
  setBattleState(prev => ({
    ...prev,
    playerStats: newPlayerStats,
    log: [...prev.log, `You used ${item.name}!`, `You take ${item.effect?.value ? item.effect.value * 100 : 0}% less damage for ${item.effect?.duration || 0} seconds!`],
    playerTurn: false
  }));
  
  // Remove item from inventory
  removeItemFromInventory(inventory, setInventory, itemId);
  
  // Trigger enemy's turn with damage reduction after a delay
  setTimeout(() => {
    // Calculate reduced damage
    const baseDamage = battleState.enemy?.damage || 0;
    const damageReduction = item.effect?.value || 0; // e.g., 0.2 for 20% reduction
    const reducedDamage = Math.floor(baseDamage * (1 - damageReduction));
    
    enemyAttackAfterItem(reducedDamage, battleState, newPlayerStats, setBattleState, endBattle, true);
  }, 1000);
};
