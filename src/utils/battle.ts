import { CombatStats, Enemy, Item } from '../types/game';
import { toast } from "sonner";

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

// Helper function to make enemy attack
export const enemyAttack = (
  battleState: any,
  setBattleState: any,
  endBattle: (victory: boolean) => void
) => {
  if (!battleState.enemy) return;
  
  const damage = battleState.enemy.damage;
  
  const newPlayerStats = {
    ...battleState.playerStats,
    hp: Math.max(0, battleState.playerStats.hp - damage)
  };
  
  if (newPlayerStats.hp <= 0) {
    setBattleState(prev => ({
      ...prev,
      playerStats: newPlayerStats,
      log: [...prev.log, `${prev.enemy?.name} attacks for ${damage} damage!`, 'You were defeated!'],
      inProgress: false
    }));
    
    setTimeout(() => endBattle(false), 1500);
    return;
  }
  
  setBattleState(prev => ({
    ...prev,
    playerStats: newPlayerStats,
    log: [...prev.log, `${prev.enemy?.name} attacks for ${damage} damage!`],
    playerTurn: true
  }));
};

// Handle enemy drops after defeating them
export const handleEnemyDrops = (
  enemy: Enemy, 
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>,
  setZeni: React.Dispatch<React.SetStateAction<number>>
) => {
  // Add zeni reward if available
  if (enemy.zeniReward) {
    setZeni(prev => prev + enemy.zeniReward);
    
    toast.success(`+ ${enemy.zeniReward} Zeni`, {
      description: "Added to your wallet",
      duration: 3000
    });
  }
  
  if (enemy.name === 'Yamcha') {
    // 10% chance to drop Yamcha's Sword
    if (Math.random() < 0.1) {
      const sword: Item = {
        id: `sword-${Date.now()}`,
        name: "Yamcha's Sword",
        description: "Increases your damage output by 25%",
        type: 'weapon',
        slot: 'weapon',
        quantity: 1,
        effect: {
          type: 'damage_multiplier',
          value: 1.25
        }
      };
      
      // Use the addItemToInventory-style logic here directly
      setInventory(prevInventory => {
        const existingItemIndex = prevInventory.findIndex(
          item => item.name === sword.name && item.type === sword.type
        );
        
        if (existingItemIndex >= 0) {
          const updatedInventory = [...prevInventory];
          updatedInventory[existingItemIndex] = {
            ...updatedInventory[existingItemIndex],
            quantity: updatedInventory[existingItemIndex].quantity + 1
          };
          return updatedInventory;
        } else {
          return [...prevInventory, sword];
        }
      });
      
      setTimeout(() => {
        toast.success(`You found Yamcha's Sword!`, {
          description: "Check your inventory to equip it."
        });
      }, 1000);
    }
  }
  
  // Handle Dino Meat drops
  if (enemy.name === 'T-Rex' || enemy.name === 'Pterodactyl') {
    // Define drop chance based on enemy
    const dropChance = enemy.name === 'T-Rex' ? 1 : 0.65; // 100% for T-Rex, 65% for Pterodactyl
    
    if (Math.random() < dropChance) {
      const dinoMeat: Item = {
        id: `dino-meat-${Date.now()}`,
        name: "Dino Meat",
        description: "Temporarily increases your power gain by 25% for 20 seconds",
        type: 'consumable',
        quantity: 1,
        effect: {
          type: 'power_gain_percent',
          value: 0.25,
          duration: 20
        }
      };
      
      // Use the addItemToInventory-style logic here directly
      setInventory(prevInventory => {
        const existingItemIndex = prevInventory.findIndex(
          item => item.name === dinoMeat.name && item.type === dinoMeat.type
        );
        
        if (existingItemIndex >= 0) {
          const updatedInventory = [...prevInventory];
          updatedInventory[existingItemIndex] = {
            ...updatedInventory[existingItemIndex],
            quantity: updatedInventory[existingItemIndex].quantity + 1
          };
          return updatedInventory;
        } else {
          return [...prevInventory, dinoMeat];
        }
      });
      
      setTimeout(() => {
        toast.success(`You found Dino Meat!`, {
          description: "Check your inventory to use it."
        });
      }, 1000);
    }
  }
};
