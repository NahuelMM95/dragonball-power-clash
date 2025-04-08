
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { forestEnemies, desertEnemies } from '@/data/enemies';
import { playerSkills } from '@/data/skills';
import { initialUpgrades } from '@/data/upgrades';
import { calculatePlayerStats, handleEnemyDrops } from '@/utils/battle';
import { 
  GameContextType, 
  BattleState, 
  Enemy, 
  Item, 
  Skill, 
  Upgrade,
  ActiveBuff
} from '@/types/game';

// Define the context
const GameContext = createContext<GameContextType | undefined>(undefined);

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

// Define initial state values
const initialState = {
  clicks: 0,
  powerLevel: 1,
  zeni: 0,
  upgrades: initialUpgrades,
  equippedUpgrade: null as string | null,
  inventory: [] as Item[],
  equippedItems: [] as Item[],
  activeBuffs: [] as ActiveBuff[]
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use our custom hook for localStorage
  const [clicks, setClicks] = useLocalStorage('dbClicks', initialState.clicks);
  const [powerLevel, setPowerLevel] = useLocalStorage('dbPowerLevel', initialState.powerLevel);
  const [zeni, setZeni] = useLocalStorage('dbZeni', initialState.zeni);
  const [upgrades, setUpgrades] = useLocalStorage('dbUpgrades', initialState.upgrades);
  const [equippedUpgrade, setEquippedUpgrade] = useLocalStorage('dbEquippedUpgrade', initialState.equippedUpgrade);
  const [inventory, setInventory] = useLocalStorage('dbInventory', initialState.inventory);
  const [equippedItems, setEquippedItems] = useLocalStorage('dbEquippedItems', initialState.equippedItems);
  const [activeBuffs, setActiveBuffs] = useLocalStorage('dbActiveBuffs', initialState.activeBuffs);

  // State not stored in localStorage
  const [fightResult, setFightResult] = useState<{ enemy: Enemy | null; won: boolean | null } | null>(null);
  const [battleState, setBattleState] = useState<BattleState>(initialBattleState);
  const [skills, setSkills] = useLocalStorage('dbSkills', playerSkills);

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

  // Purchase a skill
  const purchaseSkill = (skillName: string) => {
    const skill = skills.find(s => s.name === skillName);
    if (!skill || skill.purchased || !skill.cost || zeni < skill.cost) return;

    setZeni(zeni - skill.cost);
    setSkills(skills.map(s => (s.name === skillName ? { ...s, purchased: true } : s)));
    
    toast(`You've learned ${skill.name}!`, {
      description: "You can now use this skill in battle.",
      duration: 3000,
    });
  };

  // Purchase an item
  const purchaseItem = (itemType: string) => {
    if (itemType === 'senzu') {
      if (zeni < 100) {
        toast.error("Not enough Zeni!", {
          description: "You need 100 Zeni to buy a Senzu Bean.",
          duration: 3000,
        });
        return;
      }
      
      // Create Senzu Bean item
      const senzuBean: Item = {
        id: `senzu-${Date.now()}`,
        name: "Senzu Bean",
        description: "Completely restore HP during battle",
        type: 'consumable',
        effect: {
          type: 'heal',
          value: 1 // Full heal
        },
        usableInBattle: true
      };
      
      setZeni(zeni - 100);
      setInventory(prev => [...prev, senzuBean]);
      
      toast.success("Purchased Senzu Bean!", {
        description: "Check your inventory to use it during battle.",
        duration: 3000,
      });
    }
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

  // Use an item in battle
  const useItemInBattle = (itemId: string) => {
    if (!battleState.inProgress || !battleState.playerTurn) return;
    
    const item = inventory.find(i => i.id === itemId);
    if (!item || !item.usableInBattle) return;
    
    // Handle different item effects in battle
    if (item.effect?.type === 'heal') {
      // Healing item
      const newPlayerStats = {
        ...battleState.playerStats,
        hp: battleState.playerStats.maxHp // Full heal
      };
      
      // Update battle state with healing
      setBattleState(prev => ({
        ...prev,
        playerStats: newPlayerStats,
        log: [...prev.log, `You used ${item.name} and fully recovered your HP!`],
        playerTurn: false
      }));
      
      // Use up the item
      setInventory(prev => prev.filter(i => i.id !== itemId));
      
      // Enemy's turn after using item
      setTimeout(() => {
        enemyAttack();
      }, 1000);
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
    if (!battleState.inProgress || !battleState.playerTurn || !battleState.enemy || !skill.purchased) return;
    
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
      
      // Check for item drops and award zeni
      handleEnemyDrops(battleState.enemy, setInventory, setZeni);
      
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

  // Reset progress (for settings menu)
  const resetProgress = () => {
    setClicks(initialState.clicks);
    setPowerLevel(initialState.powerLevel);
    setZeni(initialState.zeni);
    setUpgrades(initialState.upgrades);
    setEquippedUpgrade(initialState.equippedUpgrade);
    setInventory(initialState.inventory);
    setEquippedItems(initialState.equippedItems);
    setActiveBuffs(initialState.activeBuffs);
    setSkills(playerSkills);
    setBattleState(initialBattleState);
    setFightResult(null);
  };

  return (
    <GameContext.Provider 
      value={{ 
        clicks, 
        powerLevel,
        zeni,
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
        purchaseSkill,
        startBattle,
        useSkill,
        fleeFromBattle,
        endBattle,
        inventory,
        equippedItems,
        equipItem,
        useItem,
        useItemInBattle,
        purchaseItem,
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
