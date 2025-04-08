
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
  };
  
  // Apply equipment bonuses
  equippedItems.forEach(item => {
    if (item.effect) {
      if (item.effect.type === 'damage_multiplier') {
        stats.damage = Math.floor(stats.damage * item.effect.value);
      }
    }
  });
  
  return stats;
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
        effect: {
          type: 'damage_multiplier',
          value: 1.25
        }
      };
      
      setInventory(prev => [...prev, sword]);
      
      setTimeout(() => {
        toast.success(`You found Yamcha's Sword!`, {
          description: "Check your inventory to equip it."
        });
      }, 1000);
    }
  }
  
  if (enemy.name === 'T-Rex') {
    // Always drop Dino Meat
    const dinoMeat: Item = {
      id: `dino-meat-${Date.now()}`,
      name: "Dino Meat",
      description: "Temporarily increases your power gain by 25% for 20 seconds",
      type: 'consumable',
      effect: {
        type: 'power_gain_percent',
        value: 0.25,
        duration: 20
      }
    };
    
    setInventory(prev => [...prev, dinoMeat]);
    
    setTimeout(() => {
      toast.success(`You found Dino Meat!`, {
        description: "Check your inventory to use it."
      });
    }, 1000);
  }
};
