
import { Item, BattleState } from "@/types/game";
import { removeItemFromInventory } from "../removeItemFromInventory";
import { enemyAttackAfterItem } from "../enemyAttackAfterItem";

export const handleSummonAlly = (
  item: Item,
  inventory: Item[],
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>,
  itemId: string,
  battleState: BattleState,
  setBattleState: React.Dispatch<React.SetStateAction<BattleState>>,
  endBattle: (victory: boolean) => void
) => {
  if (!item.effect || item.effect.type !== 'summon_ally' || !battleState.enemy) return;
  
  const allyDamage = item.effect.value;
  
  // Deal damage to enemy
  const newEnemyHp = Math.max(0, battleState.enemy.hp - allyDamage);
  const newEnemy = {
    ...battleState.enemy,
    hp: newEnemyHp
  };
  
  // Remove item from inventory
  removeItemFromInventory(inventory, setInventory, itemId);
  
  // Check if enemy is defeated by the ally
  if (newEnemyHp <= 0) {
    setBattleState(prev => ({
      ...prev,
      enemy: newEnemy,
      log: [...prev.log, `You used ${item.name}!`, `A Saibaman appears and attacks for ${allyDamage.toLocaleString('en')} damage!`, `${battleState.enemy?.name} was defeated!`],
      inProgress: false
    }));
    
    setTimeout(() => endBattle(true), 1500);
    return;
  }
  
  // Enemy still alive, continue battle
  setBattleState(prev => ({
    ...prev,
    enemy: newEnemy,
    log: [...prev.log, `You used ${item.name}!`, `A Saibaman appears and attacks for ${allyDamage.toLocaleString('en')} damage!`],
    playerTurn: false
  }));
  
  // Trigger enemy's turn after a delay
  setTimeout(() => {
    const damage = battleState.enemy?.damage || 0;
    enemyAttackAfterItem(damage, battleState, battleState.playerStats, setBattleState, endBattle);
  }, 1000);
};
