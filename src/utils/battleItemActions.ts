
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
    } else if (item.effect.type === 'temp_damage_boost') {
      // Apply temporary damage boost
      const damageMultiplier = 1 + item.effect.value;
      const newPlayerStats = {
        ...battleState.playerStats,
        damage: Math.floor(battleState.playerStats.damage * damageMultiplier),
        damageMultiplier: battleState.playerStats.damageMultiplier * damageMultiplier
      };
      
      // Update battle state with temp boost
      setBattleState(prevState => ({
        ...prevState,
        playerStats: newPlayerStats,
        log: [...prevState.log, `You used ${item.name} and increased your damage by ${item.effect.value * 100}%!`],
        playerTurn: false
      }));
      
      // Update inventory
      setInventory(prev => {
        if (item.quantity > 1) {
          return prev.map(i => 
            i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
          );
        } else {
          return prev.filter(i => i.id !== itemId);
        }
      });
      
      // Enemy's turn after using item
      setTimeout(() => {
        const updatedBattleState = {
          ...battleState,
          playerStats: newPlayerStats
        };
        enemyAttack(updatedBattleState, setBattleState, endBattle);
      }, 1000);
    } else if (item.effect.type === 'temp_defense_boost') {
      // Apply temporary defense boost (this would require modifying enemyAttack to respect this)
      // For now we'll just reduce incoming damage in the next enemy attack
      const defenseBoost = item.effect.value; // e.g. 0.2 = 20% damage reduction
      
      // Update battle state with message
      setBattleState(prevState => ({
        ...prevState,
        log: [...prevState.log, `You used ${item.name} and got temporary protection!`],
        playerTurn: false
      }));
      
      // Update inventory
      setInventory(prev => {
        if (item.quantity > 1) {
          return prev.map(i => 
            i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
          );
        } else {
          return prev.filter(i => i.id !== itemId);
        }
      });
      
      // Enemy's turn but with reduced damage
      setTimeout(() => {
        if (battleState.enemy) {
          const reducedDamage = Math.floor(battleState.enemy.damage * (1 - defenseBoost));
          const newPlayerHp = Math.max(0, battleState.playerStats.hp - reducedDamage);
          
          if (newPlayerHp <= 0) {
            setBattleState(prev => ({
              ...prev,
              playerStats: {
                ...prev.playerStats,
                hp: 0
              },
              log: [...prev.log, `${prev.enemy?.name} attacks for ${reducedDamage} damage (reduced)!`, 'You were defeated!'],
              inProgress: false
            }));
            
            setTimeout(() => endBattle(false), 1500);
          } else {
            setBattleState(prev => ({
              ...prev,
              playerStats: {
                ...prev.playerStats,
                hp: newPlayerHp
              },
              log: [...prev.log, `${prev.enemy?.name} attacks for ${reducedDamage} damage (reduced)!`],
              playerTurn: true
            }));
          }
        }
      }, 1000);
    } else if (item.effect.type === 'summon_ally') {
      // Summon ally that deals damage to enemy
      const allyDamage = item.effect.value;
      
      if (battleState.enemy) {
        const newEnemyHp = Math.max(0, battleState.enemy.hp - allyDamage);
        
        // Update enemy HP
        const newEnemy = {
          ...battleState.enemy,
          hp: newEnemyHp
        };
        
        // Update battle state
        setBattleState(prevState => ({
          ...prevState,
          enemy: newEnemy,
          log: [...prevState.log, `You used ${item.name} and summoned a Saibaman ally!`, 
                               `The Saibaman attacks for ${allyDamage} damage!`],
          playerTurn: false
        }));
        
        // Update inventory
        setInventory(prev => {
          if (item.quantity > 1) {
            return prev.map(i => 
              i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
            );
          } else {
            return prev.filter(i => i.id !== itemId);
          }
        });
        
        // Check if enemy is defeated
        if (newEnemyHp <= 0) {
          setBattleState(prevState => ({
            ...prevState,
            log: [...prevState.log, `${prevState.enemy?.name} was defeated!`],
            inProgress: false
          }));
          
          setTimeout(() => endBattle(true), 1500);
        } else {
          // Enemy's turn after ally attack
          setTimeout(() => {
            const updatedBattleState = {
              ...battleState,
              enemy: newEnemy
            };
            enemyAttack(updatedBattleState, setBattleState, endBattle);
          }, 1000);
        }
      }
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
