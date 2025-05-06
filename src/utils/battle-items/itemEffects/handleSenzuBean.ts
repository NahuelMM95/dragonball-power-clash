
import { Item, BattleState } from "@/types/game";
import { removeItemFromInventory } from "../removeItemFromInventory";
import { enemyAttackAfterItem } from "../enemyAttackAfterItem";

export const handleSenzuBean = (
  item: Item,
  inventory: Item[],
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>,
  itemId: string,
  battleState: BattleState,
  setBattleState: React.Dispatch<React.SetStateAction<BattleState>>,
  endBattle: (victory: boolean) => void
) => {
  // Create new player stats with full HP and Ki
  const newPlayerStats = {
    ...battleState.playerStats,
    hp: battleState.playerStats.maxHp,  // Restore to max HP
    ki: battleState.playerStats.maxKi   // Restore to max Ki
  };
  
  setBattleState(prev => ({
    ...prev,
    playerStats: newPlayerStats,
    log: [...prev.log, `You used a Senzu Bean!`, `Your HP and Ki have been completely restored!`],
    playerTurn: false // End player's turn after using item
  }));
  
  // Remove Senzu Bean from inventory
  removeItemFromInventory(inventory, setInventory, itemId);
  
  // Trigger enemy's turn after a delay
  setTimeout(() => {
    // Enemy attacks with original damage (no reduction)
    const damage = battleState.enemy?.damage || 0;
    enemyAttackAfterItem(damage, battleState, newPlayerStats, setBattleState, endBattle);
  }, 1000);
};
