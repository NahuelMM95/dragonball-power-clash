
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Define our enemy types with enhanced stats
type Enemy = {
  name: string;
  power: number;
  image: string;
  hp: number;
  maxHp: number;
  damage: number;
  ki: number;
  maxKi: number;
};

// Define our item types
type ItemType = 'weapon' | 'weight' | 'consumable';

type Item = {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  slot?: string;
  effect?: {
    type: string;
    value: number;
    duration?: number;
  };
};

// Define our battle types
type BattleState = {
  inProgress: boolean;
  playerStats: CombatStats;
  enemy: Enemy | null;
  log: string[];
  playerTurn: boolean;
};

type CombatStats = {
  hp: number;
  maxHp: number;
  damage: number;
  ki: number;
  maxKi: number;
};

type SkillType = 'basic' | 'special' | 'ultimate';

type Skill = {
  name: string;
  type: SkillType;
  damageMultiplier: number;
  kiCost: number;
  description: string;
};

// Define our upgrade types
type Upgrade = {
  id: string;
  name: string;
  description: string;
  powerBonus: number;
  cost: number;
  purchased: boolean;
};

// Define the context type
type GameContextType = {
  clicks: number;
  powerLevel: number;
  increaseClicks: () => void;
  upgrades: Upgrade[];
  equippedUpgrade: string | null;
  purchaseUpgrade: (id: string) => void;
  equipUpgrade: (id: string) => void;
  forest: Enemy[];
  desert: Enemy[];
  fightEnemy: (zone: string) => void;
  fightResult: { enemy: Enemy | null; won: boolean | null } | null;
  clearFightResult: () => void;
  battleState: BattleState;
  skills: Skill[];
  startBattle: (enemy: Enemy) => void;
  useSkill: (skill: Skill) => void;
  fleeFromBattle: () => void;
  endBattle: (victory: boolean) => void;
  inventory: Item[];
  equippedItems: Item[];
  equipItem: (itemId: string | null, slotType: string) => void;
  useItem: (itemId: string) => void;
  resetProgress: () => void;
};

// Create the context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Define our skills
const playerSkills: Skill[] = [
  {
    name: "Basic Combo",
    type: "basic",
    damageMultiplier: 1,
    kiCost: 0,
    description: "A simple combination of punches and kicks"
  }
];

// Define the initial battle state
const initialBattleState: BattleState = {
  inProgress: false,
  playerStats: {
    hp: 0,
    maxHp: 0,
    damage: 0,
    ki: 0,
    maxKi: 0
  },
  enemy: null,
  log: [],
  playerTurn: false
};

// Define our enemies
const forestEnemies = [
  { 
    name: 'Wolf', 
    power: 5, 
    image: '/wolf.png',
    hp: 50,
    maxHp: 50,
    damage: 5,
    ki: 10,
    maxKi: 10
  },
  { 
    name: 'Bandit', 
    power: 10, 
    image: '/bandit.png',
    hp: 80,
    maxHp: 80,
    damage: 8,
    ki: 20,
    maxKi: 20
  },
  { 
    name: 'Bear', 
    power: 20, 
    image: '/bear.png',
    hp: 150,
    maxHp: 150,
    damage: 15,
    ki: 20,
    maxKi: 20
  },
];

// Define desert enemies
const desertEnemies = [
  { 
    name: 'Yamcha', 
    power: 50, 
    image: '/yamcha.png',
    hp: 300,
    maxHp: 300,
    damage: 25,
    ki: 50,
    maxKi: 50
  },
  { 
    name: 'T-Rex', 
    power: 250, 
    image: '/t-rex.png',
    hp: 1000,
    maxHp: 1000,
    damage: 75,
    ki: 100,
    maxKi: 100
  },
];

// Define our upgrades
const initialUpgrades = [
  { 
    id: 'pushups', 
    name: 'Push Ups', 
    description: 'Basic training that increases your power gain.', 
    powerBonus: 1, 
    cost: 10, 
    purchased: false 
  },
  { 
    id: 'pullups', 
    name: 'Pull Ups', 
    description: 'Advanced training that significantly boosts your power gain.', 
    powerBonus: 2, 
    cost: 25, 
    purchased: false 
  },
  { 
    id: 'onehand', 
    name: 'One-Handed Push Ups', 
    description: 'Master level training for substantial power gain boosts.', 
    powerBonus: 3, 
    cost: 50, 
    purchased: false 
  },
];

// Helper function to calculate player stats based on power level
const calculatePlayerStats = (powerLevel: number, equippedItems: Item[]): CombatStats => {
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

// Define initial state values
const initialState = {
  clicks: 0,
  powerLevel: 1,
  upgrades: initialUpgrades,
  equippedUpgrade: null as string | null,
  inventory: [] as Item[],
  equippedItems: [] as Item[],
  activeBuffs: [] as {id: string, endTime: number}[]
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage if available
  const loadLocalStorage = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [clicks, setClicks] = useState<number>(() => loadLocalStorage('dbClicks', initialState.clicks));
  const [powerLevel, setPowerLevel] = useState<number>(() => loadLocalStorage('dbPowerLevel', initialState.powerLevel));
  const [upgrades, setUpgrades] = useState<Upgrade[]>(() => loadLocalStorage('dbUpgrades', initialState.upgrades));
  const [equippedUpgrade, setEquippedUpgrade] = useState<string | null>(() => loadLocalStorage('dbEquippedUpgrade', initialState.equippedUpgrade));
  const [fightResult, setFightResult] = useState<{ enemy: Enemy | null; won: boolean | null } | null>(null);
  const [battleState, setBattleState] = useState<BattleState>(initialBattleState);
  const [skills, setSkills] = useState<Skill[]>(playerSkills);
  const [inventory, setInventory] = useState<Item[]>(() => loadLocalStorage('dbInventory', initialState.inventory));
  const [equippedItems, setEquippedItems] = useState<Item[]>(() => loadLocalStorage('dbEquippedItems', initialState.equippedItems));
  const [activeBuffs, setActiveBuffs] = useState<{id: string, endTime: number}[]>(() => loadLocalStorage('dbActiveBuffs', initialState.activeBuffs));

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem('dbClicks', JSON.stringify(clicks));
    localStorage.setItem('dbPowerLevel', JSON.stringify(powerLevel));
    localStorage.setItem('dbUpgrades', JSON.stringify(upgrades));
    localStorage.setItem('dbEquippedUpgrade', JSON.stringify(equippedUpgrade));
    localStorage.setItem('dbInventory', JSON.stringify(inventory));
    localStorage.setItem('dbEquippedItems', JSON.stringify(equippedItems));
    localStorage.setItem('dbActiveBuffs', JSON.stringify(activeBuffs));
  }, [clicks, powerLevel, upgrades, equippedUpgrade, inventory, equippedItems, activeBuffs]);

  // Check active buffs
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const expiredBuffs = activeBuffs.filter(buff => buff.endTime <= now);
      
      if (expiredBuffs.length > 0) {
        // Remove expired buffs
        setActiveBuffs(prevBuffs => prevBuffs.filter(buff => buff.endTime > now));
        
        // Notify user
        expiredBuffs.forEach(buff => {
          const item = inventory.find(i => i.id === buff.id);
          if (item) {
            toast(`${item.name} effect has worn off`, {
              description: "Your temporary buff has expired.",
              duration: 3000
            });
          }
        });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeBuffs, inventory]);

  // Calculate power gain based on the equipped upgrade and active buffs
  const calculatePowerGain = (): number => {
    let baseGain = 1;
    
    // Apply upgrade bonus
    if (equippedUpgrade) {
      const upgrade = upgrades.find(u => u.id === equippedUpgrade);
      if (upgrade) baseGain += upgrade.powerBonus;
    }
    
    // Apply active buffs
    if (activeBuffs.length > 0) {
      const now = Date.now();
      const activeBuffsItems = activeBuffs
        .filter(buff => buff.endTime > now)
        .map(buff => inventory.find(i => i.id === buff.id))
        .filter(Boolean) as Item[];
      
      for (const item of activeBuffsItems) {
        if (item.effect && item.effect.type === 'power_gain_percent') {
          baseGain = baseGain * (1 + item.effect.value);
        }
      }
    }
    
    return baseGain;
  };

  // Increment clicks and update power level
  const increaseClicks = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    
    // Every 100 clicks, increase power level by the power gain
    if (newClicks % 100 === 0) {
      const powerGain = calculatePowerGain();
      const newPowerLevel = powerLevel + powerGain;
      setPowerLevel(newPowerLevel);
      
      toast(`Power level increased! (+${powerGain})`, {
        description: `Your power level is now ${newPowerLevel}!`,
        duration: 3000,
      });
    }
  };

  // Purchase an upgrade
  const purchaseUpgrade = (id: string) => {
    const upgrade = upgrades.find(u => u.id === id);
    if (!upgrade || upgrade.purchased || powerLevel < upgrade.cost) return;

    setPowerLevel(powerLevel - upgrade.cost);
    setUpgrades(upgrades.map(u => (u.id === id ? { ...u, purchased: true } : u)));
    
    toast(`You've purchased ${upgrade.name}!`, {
      description: "Equip it to boost your power gains.",
      duration: 3000,
    });
  };

  // Equip an upgrade
  const equipUpgrade = (id: string) => {
    const upgrade = upgrades.find(u => u.id === id);
    if (!upgrade || !upgrade.purchased) return;

    setEquippedUpgrade(id);
    
    toast(`You've equipped ${upgrade.name}!`, {
      description: `Power gain +${upgrade.powerBonus}`,
      duration: 3000,
    });
  };

  // Equip an item
  const equipItem = (itemId: string | null, slotType: string) => {
    if (itemId === null) {
      // Unequip the current item in this slot
      setEquippedItems(prevItems => prevItems.filter(item => item.slot !== slotType));
      return;
    }
    
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;
    
    // Remove any item already in this slot
    setEquippedItems(prevItems => {
      const newItems = prevItems.filter(i => i.slot !== slotType);
      return [...newItems, item];
    });
    
    toast(`You've equipped ${item.name}!`, {
      description: item.description,
      duration: 3000,
    });
  };

  // Use a consumable item
  const useItem = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item || item.type !== 'consumable') return;
    
    // For consumable items that provide buffs
    if (item.effect && item.effect.duration) {
      // Check if there's already an active buff of this type
      const hasActiveBuff = activeBuffs.some(buff => {
        const buffItem = inventory.find(i => i.id === buff.id);
        return buffItem?.effect?.type === item.effect?.type;
      });
      
      if (hasActiveBuff) {
        toast.error("Cannot use this item", {
          description: "You already have an active buff of this type.",
          duration: 3000,
        });
        return;
      }
      
      // Apply the buff
      const endTime = Date.now() + (item.effect.duration * 1000);
      setActiveBuffs(prev => [...prev, { id: item.id, endTime }]);
      
      // Use up the item
      setInventory(prev => prev.filter(i => i.id !== itemId));
      
      toast(`You used ${item.name}!`, {
        description: `Effect active for ${item.effect.duration} seconds.`,
        duration: 3000,
      });
    }
  };

  // Fight random enemy in the specified zone
  const fightEnemy = (zone: string) => {
    // Determine which enemy pool to use
    const enemyPool = zone === 'desert' ? desertEnemies : forestEnemies;
    let selectedEnemy: Enemy;
    
    if (zone === 'forest') {
      // Forest enemy selection logic
      const rand = Math.random();
      if (rand < 0.5) { // 50% chance for wolf
        selectedEnemy = { ...forestEnemies[0] }; // Wolf (clone to avoid reference issues)
      } else if (rand < 0.8) { // 30% chance for bandit
        selectedEnemy = { ...forestEnemies[1] }; // Bandit
      } else { // 20% chance for bear
        selectedEnemy = { ...forestEnemies[2] }; // Bear
      }
    } else {
      // Desert enemy selection logic
      const rand = Math.random();
      if (rand < 0.1) { // 10% chance for Yamcha
        selectedEnemy = { ...desertEnemies[0] }; // Yamcha
      } else { // 90% chance for T-Rex
        selectedEnemy = { ...desertEnemies[1] }; // T-Rex
      }
    }
    
    // Set result and start battle
    setFightResult({ enemy: selectedEnemy, won: null });
    startBattle(selectedEnemy);
  };

  // Clear fight result
  const clearFightResult = () => {
    setFightResult(null);
  };

  // Start a battle with an enemy
  const startBattle = (enemy: Enemy) => {
    // Calculate player stats based on power level
    const playerStats = calculatePlayerStats(powerLevel, equippedItems);
    
    // Determine who goes first based on power level
    const playerFirst = powerLevel >= enemy.power;
    
    // Set battle state
    setBattleState({
      inProgress: true,
      playerStats,
      enemy: { ...enemy }, // Clone to avoid reference issues
      log: [`Battle started against ${enemy.name}!`, 
            `${playerFirst ? 'You attack first!' : `${enemy.name} attacks first!`}`],
      playerTurn: playerFirst
    });

    // If enemy goes first, execute their turn
    if (!playerFirst) {
      setTimeout(() => {
        enemyAttack();
      }, 1000);
    }
  };

  // Enemy attack function
  const enemyAttack = () => {
    if (!battleState.enemy) return;
    
    // Calculate damage
    const damage = battleState.enemy.damage;
    
    // Update player HP
    const newPlayerStats = {
      ...battleState.playerStats,
      hp: Math.max(0, battleState.playerStats.hp - damage)
    };
    
    // Check if player is defeated
    if (newPlayerStats.hp <= 0) {
      // Player is defeated
      setBattleState(prev => ({
        ...prev,
        playerStats: newPlayerStats,
        log: [...prev.log, `${prev.enemy?.name} attacks for ${damage} damage!`, 'You were defeated!'],
        inProgress: false
      }));
      
      // End battle with defeat
      setTimeout(() => endBattle(false), 1500);
      return;
    }
    
    // Update battle state
    setBattleState(prev => ({
      ...prev,
      playerStats: newPlayerStats,
      log: [...prev.log, `${prev.enemy?.name} attacks for ${damage} damage!`],
      playerTurn: true
    }));
  };

  // Use a skill during battle
  const useSkill = (skill: Skill) => {
    if (!battleState.inProgress || !battleState.playerTurn || !battleState.enemy) return;
    
    // Check if we have enough ki
    if (battleState.playerStats.ki < skill.kiCost) {
      setBattleState(prev => ({
        ...prev,
        log: [...prev.log, `Not enough Ki to use ${skill.name}!`]
      }));
      return;
    }
    
    // Calculate damage
    const damage = Math.floor(battleState.playerStats.damage * skill.damageMultiplier);
    
    // Update enemy HP and player Ki
    const newEnemyHp = Math.max(0, battleState.enemy.hp - damage);
    const newEnemy = {
      ...battleState.enemy,
      hp: newEnemyHp
    };
    
    const newPlayerStats = {
      ...battleState.playerStats,
      ki: battleState.playerStats.ki - skill.kiCost
    };
    
    // Check if enemy is defeated
    if (newEnemyHp <= 0) {
      // Enemy is defeated
      setBattleState(prev => ({
        ...prev,
        enemy: newEnemy,
        playerStats: newPlayerStats,
        log: [...prev.log, `You use ${skill.name} for ${damage} damage!`, `${prev.enemy?.name} was defeated!`],
        inProgress: false
      }));
      
      // Calculate power gain (1/5 of enemy power without decimals)
      const powerGain = Math.floor(battleState.enemy.power / 5);
      
      // Update power level
      if (powerGain > 0) {
        setPowerLevel(prev => prev + powerGain);
        
        setTimeout(() => {
          toast.success(`You gained ${powerGain} Power Level from defeating ${battleState.enemy?.name}!`, {
            description: `Your Power Level is now ${powerLevel + powerGain}!`,
          });
        }, 500);
      }
      
      // Check for item drops
      handleEnemyDrops(battleState.enemy);
      
      // End battle with victory
      setTimeout(() => endBattle(true), 1500);
      return;
    }
    
    // Update battle state
    setBattleState(prev => ({
      ...prev,
      enemy: newEnemy,
      playerStats: newPlayerStats,
      log: [...prev.log, `You use ${skill.name} for ${damage} damage!`],
      playerTurn: false
    }));
    
    // Enemy's turn
    setTimeout(() => {
      enemyAttack();
    }, 1000);
  };

  // Handle enemy drops after defeating them
  const handleEnemyDrops = (enemy: Enemy) => {
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

  // Flee from battle
  const fleeFromBattle = () => {
    if (!battleState.inProgress) return;
    
    // 50% chance to successfully flee
    const fleeSuccessful = Math.random() > 0.5;
    
    if (fleeSuccessful) {
      setBattleState(prev => ({
        ...prev,
        log: [...prev.log, 'You successfully fled from battle!'],
        inProgress: false
      }));
      
      // End battle (neither victory nor defeat)
      setTimeout(() => {
        setBattleState(initialBattleState);
        setFightResult(null);
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
      
      // Enemy gets a free attack
      setTimeout(() => {
        enemyAttack();
      }, 1000);
    }
  };

  // End battle
  const endBattle = (victory: boolean) => {
    // Update fight result
    setFightResult(prev => prev ? { ...prev, won: victory } : null);
  };

  // Reset progress (for settings menu)
  const resetProgress = () => {
    setClicks(initialState.clicks);
    setPowerLevel(initialState.powerLevel);
    setUpgrades(initialState.upgrades);
    setEquippedUpgrade(initialState.equippedUpgrade);
    setInventory(initialState.inventory);
    setEquippedItems(initialState.equippedItems);
    setActiveBuffs(initialState.activeBuffs);
    setBattleState(initialBattleState);
    setFightResult(null);
  };

  return (
    <GameContext.Provider 
      value={{ 
        clicks, 
        powerLevel, 
        increaseClicks, 
        upgrades, 
        equippedUpgrade, 
        purchaseUpgrade, 
        equipUpgrade,
        forest: forestEnemies,
        desert: desertEnemies,
        fightEnemy,
        fightResult,
        clearFightResult,
        battleState,
        skills,
        startBattle,
        useSkill,
        fleeFromBattle,
        endBattle,
        inventory,
        equippedItems,
        equipItem,
        useItem,
        resetProgress
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
