
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
  fightEnemy: () => void;
  fightResult: { enemy: Enemy | null; won: boolean | null } | null;
  clearFightResult: () => void;
  battleState: BattleState;
  skills: Skill[];
  startBattle: (enemy: Enemy) => void;
  useSkill: (skill: Skill) => void;
  fleeFromBattle: () => void;
  endBattle: (victory: boolean) => void;
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
const calculatePlayerStats = (powerLevel: number): CombatStats => {
  return {
    hp: powerLevel * 10,
    maxHp: powerLevel * 10,
    damage: Math.max(1, Math.floor(powerLevel * 0.8)),
    ki: powerLevel * 5,
    maxKi: powerLevel * 5,
  };
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage if available
  const loadLocalStorage = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [clicks, setClicks] = useState<number>(() => loadLocalStorage('dbClicks', 0));
  const [powerLevel, setPowerLevel] = useState<number>(() => loadLocalStorage('dbPowerLevel', 0));
  const [upgrades, setUpgrades] = useState<Upgrade[]>(() => loadLocalStorage('dbUpgrades', initialUpgrades));
  const [equippedUpgrade, setEquippedUpgrade] = useState<string | null>(() => loadLocalStorage('dbEquippedUpgrade', null));
  const [fightResult, setFightResult] = useState<{ enemy: Enemy | null; won: boolean | null } | null>(null);
  const [battleState, setBattleState] = useState<BattleState>(initialBattleState);
  const [skills, setSkills] = useState<Skill[]>(playerSkills);

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem('dbClicks', JSON.stringify(clicks));
    localStorage.setItem('dbPowerLevel', JSON.stringify(powerLevel));
    localStorage.setItem('dbUpgrades', JSON.stringify(upgrades));
    localStorage.setItem('dbEquippedUpgrade', JSON.stringify(equippedUpgrade));
  }, [clicks, powerLevel, upgrades, equippedUpgrade]);

  // Calculate power gain based on the equipped upgrade
  const calculatePowerGain = (): number => {
    if (!equippedUpgrade) return 1;
    
    const upgrade = upgrades.find(u => u.id === equippedUpgrade);
    return upgrade ? 1 + upgrade.powerBonus : 1;
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

  // Fight random enemy in the forest
  const fightEnemy = () => {
    // Determine random enemy (with rarity weighting)
    const rand = Math.random();
    let selectedEnemy: Enemy;
    
    if (rand < 0.5) { // 50% chance for wolf
      selectedEnemy = { ...forestEnemies[0] }; // Wolf (clone to avoid reference issues)
    } else if (rand < 0.8) { // 30% chance for bandit
      selectedEnemy = { ...forestEnemies[1] }; // Bandit
    } else { // 20% chance for bear
      selectedEnemy = { ...forestEnemies[2] }; // Bear
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
    const playerStats = calculatePlayerStats(powerLevel);
    
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
          toast(`You gained ${powerGain} Power Level from defeating ${battleState.enemy?.name}!`, {
            description: `Your Power Level is now ${powerLevel + powerGain}!`,
            duration: 3000
          });
        }, 500);
      }
      
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
        fightEnemy,
        fightResult,
        clearFightResult,
        battleState,
        skills,
        startBattle,
        useSkill,
        fleeFromBattle,
        endBattle
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
