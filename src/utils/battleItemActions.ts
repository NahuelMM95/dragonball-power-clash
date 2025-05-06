import { toast } from "sonner";
import { handleEnemyPowerDrop, handlePlayerPowerLoss } from "./battle";

// Function to use items in battle
export const useItemInBattle = (
  itemId: string,
  inventory: any[],
  setInventory: React.Dispatch<React.SetStateAction<any[]>>,
  battleState: any,
  setBattleState: React.Dispatch<React.SetStateAction<any>>,
  endBattle: (victory: boolean) => void
) => {
  const item = inventory.find(i => i.id === itemId);
  
  if (!item) {
    toast.error("Item not found!");
    return;
  }
  
  if (!item.usableInBattle) {
    toast.error("This item cannot be used in battle!");
    return;
  }
  
  // Handle item effects
  if (item.effect) {
    // Fix Senzu Bean healing (restore full HP and Ki)
    if (item.name === "Senzu Bean" && item.effect.type === 'heal') {
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
      setInventory(prev => {
        const updatedInventory = [...prev];
        const itemIndex = updatedInventory.findIndex(i => i.id === itemId);
        
        if (updatedInventory[itemIndex].quantity > 1) {
          updatedInventory[itemIndex] = {
            ...updatedInventory[itemIndex],
            quantity: updatedInventory[itemIndex].quantity - 1
          };
        } else {
          updatedInventory.splice(itemIndex, 1);
        }
        
        return updatedInventory;
      });
      
      // Trigger enemy's turn
      setTimeout(() => {
        // Make enemy attack
        const damage = battleState.enemy.damage;
        
        const playerStats = {
          ...newPlayerStats,
          hp: Math.max(0, newPlayerStats.hp - damage)
        };
        
        if (playerStats.hp <= 0) {
          setBattleState(prev => ({
            ...prev,
            playerStats,
            log: [...prev.log, `${prev.enemy?.name} attacks for ${damage.toLocaleString('en')} damage!`, "You were defeated!"],
            inProgress: false
          }));
          
          setTimeout(() => endBattle(false), 1500);
          return;
        }
        
        setBattleState(prev => ({
          ...prev,
          playerStats,
          log: [...prev.log, `${prev.enemy?.name} attacks for ${damage.toLocaleString('en')} damage!`],
          playerTurn: true
        }));
      }, 1000);
      
      return;
    }
  
    if (item.effect.type === 'temp_damage_boost') {
      // Handle temp damage boost
      const newPlayerStats = {
        ...battleState.playerStats,
        damage: Math.floor(battleState.playerStats.damage * (1 + item.effect.value)),
        // Add temporary effect flag
        tempEffects: {
          ...battleState.playerStats.tempEffects,
          damageBoosted: {
            endTime: Date.now() + (item.effect.duration * 1000),
            multiplier: item.effect.value
          }
        }
      };
      
      setBattleState(prev => ({
        ...prev,
        playerStats: newPlayerStats,
        log: [...prev.log, `You used ${item.name}!`, `Your damage is increased by ${item.effect.value * 100}% for ${item.effect.duration} seconds!`],
        playerTurn: false // End player's turn after using item
      }));
      
      // Remove item from inventory
      setInventory(prev => {
        const updatedInventory = [...prev];
        const itemIndex = updatedInventory.findIndex(i => i.id === itemId);
        
        if (updatedInventory[itemIndex].quantity > 1) {
          updatedInventory[itemIndex] = {
            ...updatedInventory[itemIndex],
            quantity: updatedInventory[itemIndex].quantity - 1
          };
        } else {
          updatedInventory.splice(itemIndex, 1);
        }
        
        return updatedInventory;
      });
      
      // Trigger enemy's turn
      setTimeout(() => {
        // Make enemy attack
        const damage = battleState.enemy.damage;
        
        const playerStats = {
          ...newPlayerStats,
          hp: Math.max(0, newPlayerStats.hp - damage)
        };
        
        if (playerStats.hp <= 0) {
          setBattleState(prev => ({
            ...prev,
            playerStats,
            log: [...prev.log, `${prev.enemy?.name} attacks for ${damage.toLocaleString('en')} damage!`, "You were defeated!"],
            inProgress: false
          }));
          
          setTimeout(() => endBattle(false), 1500);
          return;
        }
        
        setBattleState(prev => ({
          ...prev,
          playerStats,
          log: [...prev.log, `${prev.enemy?.name} attacks for ${damage.toLocaleString('en')} damage!`],
          playerTurn: true
        }));
      }, 1000);
    } else if (item.effect.type === 'temp_defense_boost') {
      // Handle temporary defense boost
      const newPlayerStats = {
        ...battleState.playerStats,
        tempEffects: {
          ...battleState.playerStats.tempEffects,
          defenseBoosted: {
            endTime: Date.now() + (item.effect.duration * 1000),
            reduction: item.effect.value
          }
        }
      };
      
      setBattleState(prev => ({
        ...prev,
        playerStats: newPlayerStats,
        log: [...prev.log, `You used ${item.name}!`, `You take ${item.effect.value * 100}% less damage for ${item.effect.duration} seconds!`],
        playerTurn: false
      }));
      
      // Remove item from inventory
      setInventory(prev => {
        const updatedInventory = [...prev];
        const itemIndex = updatedInventory.findIndex(i => i.id === itemId);
        
        if (updatedInventory[itemIndex].quantity > 1) {
          updatedInventory[itemIndex] = {
            ...updatedInventory[itemIndex],
            quantity: updatedInventory[itemIndex].quantity - 1
          };
        } else {
          updatedInventory.splice(itemIndex, 1);
        }
        
        return updatedInventory;
      });
      
      // Trigger enemy's turn with damage reduction
      setTimeout(() => {
        // Calculate reduced damage
        const baseDamage = battleState.enemy.damage;
        const damageReduction = item.effect.value; // e.g., 0.2 for 20% reduction
        const reducedDamage = Math.floor(baseDamage * (1 - damageReduction));
        
        const playerStats = {
          ...newPlayerStats,
          hp: Math.max(0, newPlayerStats.hp - reducedDamage)
        };
        
        if (playerStats.hp <= 0) {
          setBattleState(prev => ({
            ...prev,
            playerStats,
            log: [...prev.log, `${prev.enemy?.name} attacks for ${reducedDamage} damage (reduced)!`, "You were defeated!"],
            inProgress: false
          }));
          
          setTimeout(() => endBattle(false), 1500);
          return;
        }
        
        setBattleState(prev => ({
          ...prev,
          playerStats,
          log: [...prev.log, `${prev.enemy?.name} attacks for ${reducedDamage} damage (reduced)!`],
          playerTurn: true
        }));
      }, 1000);
    } else if (item.effect.type === 'summon_ally') {
      // Handle summoning an ally that attacks the enemy
      const allyDamage = item.effect.value;
      
      // Deal damage to enemy
      const newEnemyHp = Math.max(0, battleState.enemy.hp - allyDamage);
      const newEnemy = {
        ...battleState.enemy,
        hp: newEnemyHp
      };
      
      // Check if enemy is defeated
      if (newEnemyHp <= 0) {
        setBattleState(prev => ({
          ...prev,
          enemy: newEnemy,
          log: [...prev.log, `You used ${item.name}!`, `A Saibaman appears and attacks for ${allyDamage} damage!`, `${battleState.enemy.name} was defeated!`],
          inProgress: false
        }));
        
        // Remove item from inventory
        setInventory(prev => {
          const updatedInventory = [...prev];
          const itemIndex = updatedInventory.findIndex(i => i.id === itemId);
          
          if (updatedInventory[itemIndex].quantity > 1) {
            updatedInventory[itemIndex] = {
              ...updatedInventory[itemIndex],
              quantity: updatedInventory[itemIndex].quantity - 1
            };
          } else {
            updatedInventory.splice(itemIndex, 1);
          }
          
          return updatedInventory;
        });
        
        setTimeout(() => endBattle(true), 1500);
        return;
      }
      
      // Enemy still alive, continue battle
      setBattleState(prev => ({
        ...prev,
        enemy: newEnemy,
        log: [...prev.log, `You used ${item.name}!`, `A Saibaman appears and attacks for ${allyDamage} damage!`],
        playerTurn: false
      }));
      
      // Remove item from inventory
      setInventory(prev => {
        const updatedInventory = [...prev];
        const itemIndex = updatedInventory.findIndex(i => i.id === itemId);
        
        if (updatedInventory[itemIndex].quantity > 1) {
          updatedInventory[itemIndex] = {
            ...updatedInventory[itemIndex],
            quantity: updatedInventory[itemIndex].quantity - 1
          };
        } else {
          updatedInventory.splice(itemIndex, 1);
        }
        
        return updatedInventory;
      });
      
      // Enemy's turn
      setTimeout(() => {
        const damage = battleState.enemy.damage;
        
        const playerStats = {
          ...battleState.playerStats,
          hp: Math.max(0, battleState.playerStats.hp - damage)
        };
        
        if (playerStats.hp <= 0) {
          setBattleState(prev => ({
            ...prev,
            playerStats,
            log: [...prev.log, `${prev.enemy?.name} attacks for ${damage} damage!`, "You were defeated!"],
            inProgress: false
          }));
          
          setTimeout(() => endBattle(false), 1500);
          return;
        }
        
        setBattleState(prev => ({
          ...prev,
          playerStats,
          log: [...prev.log, `${prev.enemy?.name} attacks for ${damage} damage!`],
          playerTurn: true
        }));
      }, 1000);
    }
  }
};

// Function to handle the end of a battle
export const processBattleEnd = (
  victory: boolean,
  enemy: any,
  powerLevel: number,
  setPowerLevel: React.Dispatch<React.SetStateAction<number>>,
  setInventory: React.Dispatch<React.SetStateAction<any[]>>,
  setZeni: React.Dispatch<React.SetStateAction<number>>,
  setFightResult: any,
  resetBattleState: any
) => {
  // Update the fight result
  setFightResult(prev => ({ ...prev, won: victory }));
  resetBattleState();
  
  if (victory && enemy) {
    // Process zeni reward
    if (enemy.zeniReward) {
      setZeni(prev => prev + enemy.zeniReward);
      toast.success(`Earned ${enemy.zeniReward.toLocaleString('en')} Zeni!`, {
        description: `Reward from defeating ${enemy.name}`,
        duration: 3000
      });
    }
    
    // Handle power drop from enemy (20% chance)
    handleEnemyPowerDrop(enemy, powerLevel, setPowerLevel);
    
    // Update story progress if applicable
    if (enemy.isStoryBoss) {
      const currentProgress = parseInt(localStorage.getItem("dbzStoryProgress") || "0");
      localStorage.setItem("dbzStoryProgress", (currentProgress + 1).toString());
    }
  } else if (!victory && enemy) {
    // Handle player power loss on defeat
    handlePlayerPowerLoss(powerLevel, setPowerLevel);
  }
};
