
import { BattleState, Enemy, Item } from '@/types/game';
import { toast } from "sonner";
import { handleEnemyDrops, enemyAttack } from './battle';

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
