import { Enemy, Item } from '../types/game';
import { toast } from "sonner";

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
  
  // Check for Yamcha's Sword drop
  if (enemy.name === 'Yamcha') {
    // 25% chance to drop Yamcha's Sword (increased from 10%)
    if (Math.random() < 0.25) {
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
  
  // Add new item drops for other enemies
  if (enemy.name === 'Wolf') {
    // 20% chance to drop Wolf Fang
    if (Math.random() < 0.2) {
      const wolfFang: Item = {
        id: `wolf-fang-${Date.now()}`,
        name: "Wolf Fang",
        description: "A sharp fang from a defeated wolf. Can be used for crafting.",
        type: 'consumable',
        quantity: 1,
        effect: {
          type: 'temp_damage_boost',
          value: 0.15,
          duration: 15
        },
        usableInBattle: true
      };
      
      setInventory(prevInventory => {
        const existingItemIndex = prevInventory.findIndex(
          item => item.name === wolfFang.name && item.type === wolfFang.type
        );
        
        if (existingItemIndex >= 0) {
          const updatedInventory = [...prevInventory];
          updatedInventory[existingItemIndex] = {
            ...updatedInventory[existingItemIndex],
            quantity: updatedInventory[existingItemIndex].quantity + 1
          };
          return updatedInventory;
        } else {
          return [...prevInventory, wolfFang];
        }
      });
      
      setTimeout(() => {
        toast.success(`You found a Wolf Fang!`, {
          description: "Use it in battle to increase damage by 15% for 15 seconds."
        });
      }, 1000);
    }
  }
  
  if (enemy.name === 'Bear') {
    // 35% chance to drop Bear Pelt
    if (Math.random() < 0.35) {
      const bearPelt: Item = {
        id: `bear-pelt-${Date.now()}`,
        name: "Bear Pelt",
        description: "A thick pelt from a defeated bear. Provides protection.",
        type: 'consumable',
        quantity: 1,
        effect: {
          type: 'temp_defense_boost',
          value: 0.2,
          duration: 10
        },
        usableInBattle: true
      };
      
      setInventory(prevInventory => {
        const existingItemIndex = prevInventory.findIndex(
          item => item.name === bearPelt.name && item.type === bearPelt.type
        );
        
        if (existingItemIndex >= 0) {
          const updatedInventory = [...prevInventory];
          updatedInventory[existingItemIndex] = {
            ...updatedInventory[existingItemIndex],
            quantity: updatedInventory[existingItemIndex].quantity + 1
          };
          return updatedInventory;
        } else {
          return [...prevInventory, bearPelt];
        }
      });
      
      setTimeout(() => {
        toast.success(`You found a Bear Pelt!`, {
          description: "Use it in battle to reduce incoming damage by 20% for 10 seconds."
        });
      }, 1000);
    }
  }
  
  if (enemy.name === 'Bandit') {
    // 40% chance to drop Stolen Pouch
    if (Math.random() < 0.4) {
      const stolenPouch: Item = {
        id: `stolen-pouch-${Date.now()}`,
        name: "Stolen Pouch",
        description: "A small pouch of zeni stolen from travelers.",
        type: 'consumable',
        quantity: 1,
        effect: {
          type: 'zeni_bonus',
          value: 50
        }
      };
      
      setInventory(prevInventory => {
        const existingItemIndex = prevInventory.findIndex(
          item => item.name === stolenPouch.name && item.type === stolenPouch.type
        );
        
        if (existingItemIndex >= 0) {
          const updatedInventory = [...prevInventory];
          updatedInventory[existingItemIndex] = {
            ...updatedInventory[existingItemIndex],
            quantity: updatedInventory[existingItemIndex].quantity + 1
          };
          return updatedInventory;
        } else {
          return [...prevInventory, stolenPouch];
        }
      });
      
      // Also give the zeni bonus immediately
      setZeni(prev => prev + 50);
      
      setTimeout(() => {
        toast.success(`You found a Stolen Pouch!`, {
          description: "You gained an additional 50 Zeni."
        });
      }, 1000);
    }
  }
  
  if (enemy.name === 'Snake') {
    // 30% chance to drop Snake Venom
    if (Math.random() < 0.3) {
      const snakeVenom: Item = {
        id: `snake-venom-${Date.now()}`,
        name: "Snake Venom",
        description: "Can be applied to weapons for extra damage.",
        type: 'consumable',
        quantity: 1,
        effect: {
          type: 'temp_damage_boost',
          value: 0.2,
          duration: 12
        },
        usableInBattle: true
      };
      
      setInventory(prevInventory => {
        const existingItemIndex = prevInventory.findIndex(
          item => item.name === snakeVenom.name && item.type === snakeVenom.type
        );
        
        if (existingItemIndex >= 0) {
          const updatedInventory = [...prevInventory];
          updatedInventory[existingItemIndex] = {
            ...updatedInventory[existingItemIndex],
            quantity: updatedInventory[existingItemIndex].quantity + 1
          };
          return updatedInventory;
        } else {
          return [...prevInventory, snakeVenom];
        }
      });
      
      setTimeout(() => {
        toast.success(`You found Snake Venom!`, {
          description: "Use it in battle to increase damage by 20% for 12 seconds."
        });
      }, 1000);
    }
  }
  
  if (enemy.name === 'Desert Bandit') {
    // 40% chance to drop Desert Scarf
    if (Math.random() < 0.4) {
      const desertScarf: Item = {
        id: `desert-scarf-${Date.now()}`,
        name: "Desert Scarf",
        description: "A protective scarf that reduces heat and damage.",
        type: 'consumable',
        quantity: 1,
        effect: {
          type: 'temp_defense_boost',
          value: 0.15,
          duration: 15
        },
        usableInBattle: true
      };
      
      setInventory(prevInventory => {
        const existingItemIndex = prevInventory.findIndex(
          item => item.name === desertScarf.name && item.type === desertScarf.type
        );
        
        if (existingItemIndex >= 0) {
          const updatedInventory = [...prevInventory];
          updatedInventory[existingItemIndex] = {
            ...updatedInventory[existingItemIndex],
            quantity: updatedInventory[existingItemIndex].quantity + 1
          };
          return updatedInventory;
        } else {
          return [...prevInventory, desertScarf];
        }
      });
      
      setTimeout(() => {
        toast.success(`You found a Desert Scarf!`, {
          description: "Use it in battle to reduce incoming damage by 15% for 15 seconds."
        });
      }, 1000);
    }
  }
  
  if (enemy.name === 'Scorpion') {
    // 35% chance to drop Scorpion Sting
    if (Math.random() < 0.35) {
      const scorpionSting: Item = {
        id: `scorpion-sting-${Date.now()}`,
        name: "Scorpion Sting",
        description: "Can be used to poison enemies for extra damage over time.",
        type: 'consumable',
        quantity: 1,
        effect: {
          type: 'damage_over_time',
          value: 5,
          duration: 10
        },
        usableInBattle: true
      };
      
      setInventory(prevInventory => {
        const existingItemIndex = prevInventory.findIndex(
          item => item.name === scorpionSting.name && item.type === scorpionSting.type
        );
        
        if (existingItemIndex >= 0) {
          const updatedInventory = [...prevInventory];
          updatedInventory[existingItemIndex] = {
            ...updatedInventory[existingItemIndex],
            quantity: updatedInventory[existingItemIndex].quantity + 1
          };
          return updatedInventory;
        } else {
          return [...prevInventory, scorpionSting];
        }
      });
      
      setTimeout(() => {
        toast.success(`You found a Scorpion Sting!`, {
          description: "Use it in battle to deal 5 damage per second for 10 seconds."
        });
      }, 1000);
    }
  }
  
  if (enemy.name === 'Crystal Monster') {
    // 25% chance to drop Crystal Shard
    if (Math.random() < 0.25) {
      const crystalShard: Item = {
        id: `crystal-shard-${Date.now()}`,
        name: "Crystal Shard",
        description: "A powerful crystal fragment that temporarily boosts your power level.",
        type: 'consumable',
        quantity: 1,
        effect: {
          type: 'temp_power_boost',
          value: 15,
          duration: 20
        },
        usableInBattle: true
      };
      
      setInventory(prevInventory => {
        const existingItemIndex = prevInventory.findIndex(
          item => item.name === crystalShard.name && item.type === crystalShard.type
        );
        
        if (existingItemIndex >= 0) {
          const updatedInventory = [...prevInventory];
          updatedInventory[existingItemIndex] = {
            ...updatedInventory[existingItemIndex],
            quantity: updatedInventory[existingItemIndex].quantity + 1
          };
          return updatedInventory;
        } else {
          return [...prevInventory, crystalShard];
        }
      });
      
      setTimeout(() => {
        toast.success(`You found a Crystal Shard!`, {
          description: "Use it in battle to temporarily increase your power level by 15 for 20 seconds."
        });
      }, 1000);
    }
  }
  
  if (enemy.name === 'Malfunctioning Robot') {
    // 15% chance to drop Robot Parts
    if (Math.random() < 0.15) {
      const robotParts: Item = {
        id: `robot-parts-${Date.now()}`,
        name: "Robot Parts",
        description: "Advanced technology that can be used to craft powerful items.",
        type: 'weapon',
        slot: 'weapon',
        quantity: 1,
        effect: {
          type: 'damage_multiplier',
          value: 1.4
        }
      };
      
      setInventory(prevInventory => {
        const existingItemIndex = prevInventory.findIndex(
          item => item.name === robotParts.name && item.type === robotParts.type
        );
        
        if (existingItemIndex >= 0) {
          const updatedInventory = [...prevInventory];
          updatedInventory[existingItemIndex] = {
            ...updatedInventory[existingItemIndex],
            quantity: updatedInventory[existingItemIndex].quantity + 1
          };
          return updatedInventory;
        } else {
          return [...prevInventory, robotParts];
        }
      });
      
      setTimeout(() => {
        toast.success(`You found Robot Parts!`, {
          description: "Can be equipped as a weapon, increasing damage by 40%."
        });
      }, 1000);
    }
  }
  
  if (enemy.name === 'Saibaman') {
    // 15% chance to drop Saibaman Seed
    if (Math.random() < 0.15) {
      const saibaSeed: Item = {
        id: `saiba-seed-${Date.now()}`,
        name: "Saibaman Seed",
        description: "A rare seed that can be planted to grow your own Saibaman ally.",
        type: 'consumable',
        quantity: 1,
        effect: {
          type: 'summon_ally',
          value: 1000
        },
        usableInBattle: true
      };
      
      setInventory(prevInventory => {
        const existingItemIndex = prevInventory.findIndex(
          item => item.name === saibaSeed.name && item.type === saibaSeed.type
        );
        
        if (existingItemIndex >= 0) {
          const updatedInventory = [...prevInventory];
          updatedInventory[existingItemIndex] = {
            ...updatedInventory[existingItemIndex],
            quantity: updatedInventory[existingItemIndex].quantity + 1
          };
          return updatedInventory;
        } else {
          return [...prevInventory, saibaSeed];
        }
      });
      
      setTimeout(() => {
        toast.success(`You found a Saibaman Seed!`, {
          description: "Use it in battle to summon a Saibaman ally."
        });
      }, 1000);
    }
  }
};
