
import { toast } from "sonner";
import { BattleState, Enemy, Item, Skill } from '@/types/game';
import { handleEnemyDrops, enemyAttack } from './battle';

// Helper function for using skills in battle
export const useSkillInBattle = (
  skill: Skill,
  battleState: BattleState,
  setBattleState: React.Dispatch<React.SetStateAction<BattleState>>,
  endBattle: (victory: boolean) => void
) => {
  if (!battleState.inProgress || !battleState.playerTurn || !battleState.enemy || !skill.purchased) return;
  
  if (battleState.playerStats.ki < skill.kiCost) {
    setBattleState(prev => ({
      ...prev,
      log: [...prev.log, `Not enough Ki to use ${skill.name}!`]
    }));
    return;
  }
  
  const damage = Math.floor(battleState.playerStats.damage * skill.damageMultiplier);
  
  const newEnemyHp = Math.max(0, battleState.enemy.hp - damage);
  const newEnemy = {
    ...battleState.enemy,
    hp: newEnemyHp
  };
  
  const newPlayerStats = {
    ...battleState.playerStats,
    ki: battleState.playerStats.ki - skill.kiCost
  };
  
  if (newEnemyHp <= 0) {
    setBattleState(prev => ({
      ...prev,
      enemy: newEnemy,
      playerStats: newPlayerStats,
      log: [...prev.log, `You use ${skill.name} for ${damage} damage!`, `${prev.enemy?.name} was defeated!`],
      inProgress: false
    }));
    
    setTimeout(() => endBattle(true), 1500);
    return;
  }
  
  setBattleState(prev => ({
    ...prev,
    enemy: newEnemy,
    playerStats: newPlayerStats,
    log: [...prev.log, `You use ${skill.name} for ${damage} damage!`],
    playerTurn: false
  }));
  
  setTimeout(() => {
    enemyAttack(battleState, setBattleState, endBattle);
  }, 1000);
};

// Helper function for fleeing from battle
export const fleeFromBattle = (
  battleState: BattleState,
  setBattleState: React.Dispatch<React.SetStateAction<BattleState>>,
  resetBattleState: () => void,
  clearFightResult: () => void
) => {
  if (!battleState.inProgress) return;
  
  const fleeSuccessful = Math.random() > 0.5;
  
  if (fleeSuccessful) {
    setBattleState(prev => ({
      ...prev,
      log: [...prev.log, 'You successfully fled from battle!'],
      inProgress: false
    }));
    
    setTimeout(() => {
      resetBattleState();
      clearFightResult();
    }, 1500);
    
    toast('You fled from battle!', {
      description: 'You escaped safely.',
      duration: 3000
    });
  } else {
    setBattleState(prev => ({
      ...prev,
      log: [...prev.log, 'Failed to escape! Enemy attacks!'],
      playerTurn: false
    }));
    
    setTimeout(() => {
      enemyAttack(battleState, setBattleState, (victory) => {
        // Using an inline function here to avoid circular dependencies
        if (!victory && battleState.enemy) {
          setBattleState(prev => ({
            ...prev,
            inProgress: false,
            log: [...prev.log, 'You were defeated!']
          }));
        }
      });
    }, 1000);
  }
};

// Helper function for using items in battle
export const useItemInBattle = (
  itemId: string,
  inventory: Item[],
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>,
  battleState: BattleState,
  setBattleState: React.Dispatch<React.SetStateAction<BattleState>>,
  endBattle: (victory: boolean) => void
) => {
  if (!battleState.inProgress) return;
  
  const itemIndex = inventory.findIndex(i => i.id === itemId);
  if (itemIndex === -1) return;
  
  const item = inventory[itemIndex];
  
  if (item.type === 'consumable' && item.effect) {
    if (item.effect.type === 'heal') {
      // Calculate healing amount based on the item's effect value (percentage of max HP)
      const healAmount = Math.floor(battleState.playerStats.maxHp * item.effect.value);
      const newHp = Math.min(
        battleState.playerStats.maxHp, 
        battleState.playerStats.hp + healAmount
      );
      
      // Create a new playerStats object to ensure it's properly updated
      const newPlayerStats = {
        ...battleState.playerStats,
        hp: newHp
      };
      
      // Update battle state with healing
      setBattleState(prevState => ({
        ...prevState,
        playerStats: newPlayerStats,
        log: [...prevState.log, `You used ${item.name} and restored ${healAmount} HP!`],
        playerTurn: false
      }));
      
      // Update inventory to remove used item or decrease quantity
      setInventory(prev => {
        if (item.quantity > 1) {
          return prev.map(i => 
            i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
          );
        } else {
          return prev.filter(i => i.id !== itemId);
        }
      });
      
      // After using item, the enemy gets to attack
      setTimeout(() => {
        // Pass the updated battle state with new player stats to enemyAttack
        const updatedBattleState = {
          ...battleState,
          playerStats: newPlayerStats
        };
        enemyAttack(updatedBattleState, setBattleState, endBattle);
      }, 1000);
    }
  }
};

// Helper function for processing the end of battle
export const processBattleEnd = (
  victory: boolean,
  enemy: Enemy | null,
  powerLevel: number,
  setPowerLevel: React.Dispatch<React.SetStateAction<number>>,
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>,
  setZeni: React.Dispatch<React.SetStateAction<number>>,
  setFightResult: React.Dispatch<React.SetStateAction<{ enemy: Enemy | null; won: boolean | null } | null>>,
  resetBattleState: () => void
) => {
  setFightResult(prev => prev ? { ...prev, won: victory } : null);
  
  if (victory && enemy) {
    const powerGain = Math.floor(enemy.power / 5);
    
    if (powerGain > 0) {
      setPowerLevel(prev => prev + powerGain);
      
      setTimeout(() => {
        toast.success(`You gained ${powerGain} Power Level from defeating ${enemy.name}!`, {
          description: `Your Power Level is now ${powerLevel + powerGain}!`,
        });
      }, 500);
    }
    
    // Call handleEnemyDrops to process any potential item drops
    handleEnemyDrops(enemy, setInventory, setZeni);
  }
  
  setTimeout(() => {
    resetBattleState();
  }, 1500);
};
