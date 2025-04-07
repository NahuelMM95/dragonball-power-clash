
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Define our enemy types
type Enemy = {
  name: string;
  power: number;
  image: string;
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
};

// Create the context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Define our enemies
const forestEnemies = [
  { name: 'Wolf', power: 5, image: '/wolf.png' },
  { name: 'Bandit', power: 10, image: '/bandit.png' },
  { name: 'Bear', power: 20, image: '/bear.png' },
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
      selectedEnemy = forestEnemies[0]; // Wolf
    } else if (rand < 0.8) { // 30% chance for bandit
      selectedEnemy = forestEnemies[1]; // Bandit
    } else { // 20% chance for bear
      selectedEnemy = forestEnemies[2]; // Bear
    }
    
    // Determine if won
    const won = powerLevel >= selectedEnemy.power;
    
    // Set result
    setFightResult({ enemy: selectedEnemy, won });
    
    // Show toast
    if (won) {
      toast(`Victory against ${selectedEnemy.name}!`, {
        description: `Your power level of ${powerLevel} was greater than the enemy's ${selectedEnemy.power}.`,
        duration: 3000,
      });
    } else {
      toast(`Defeated by ${selectedEnemy.name}!`, {
        description: `Your power level of ${powerLevel} was less than the enemy's ${selectedEnemy.power}. Train harder!`,
        duration: 3000,
      });
    }
  };

  // Clear fight result
  const clearFightResult = () => {
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
        fightEnemy,
        fightResult,
        clearFightResult
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
