import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { forestEnemies, desertEnemies } from '@/data/enemies';
import { playerSkills } from '@/data/skills';
import { initialUpgrades } from '@/data/upgrades';
import { calculatePlayerStats, handleEnemyDrops, enemyAttack } from '@/utils/battle';
import { 
  GameContextType, 
  BattleState, 
  Enemy, 
  Item, 
  Skill, 
  Upgrade,
  ActiveBuff
} from '@/types/game';

const GameContext = createContext<GameContextType | undefined>(undefined);

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
  const [clicks, setClicks] = useLocalStorage('dbClicks', initialState.clicks);
  const [powerLevel, setPowerLevel] = useLocalStorage('dbPowerLevel', initialState.powerLevel);
  const [zeni, setZeni] = useLocalStorage('dbZeni', initialState.zeni);
  const [upgrades, setUpgrades] = useLocalStorage('dbUpgrades', initialState.upgrades);
  const [equippedUpgrade, setEquippedUpgrade] = useLocalStorage('dbEquippedUpgrade', initialState.equippedUpgrade);
  const [inventory, setInventory] = useLocalStorage('dbInventory', initialState.inventory);
  const [equippedItems, setEquippedItems] = useLocalStorage('dbEquippedItems', initialState.equippedItems);
  const [activeBuffs, setActiveBuffs] = useLocalStorage('dbActiveBuffs', initialState.activeBuffs);

  const [fightResult, setFightResult] = useState<{ enemy: Enemy | null; won: boolean | null } | null>(null);
  const [battleState, setBattleState] = useState<BattleState>(initialBattleState);
  const [skills, setSkills] = useLocalStorage('dbSkills', playerSkills);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const expiredBuffs = activeBuffs.filter(buff => buff.endTime <= now);
      
      if (expiredBuffs.length > 0) {
        setActiveBuffs(prevBuffs => prevBuffs.filter(buff => buff.endTime > now));
        
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

  const calculatePowerGain = (): number => {
    let baseGain = 1;
    
    if (equippedUpgrade) {
      const upgrade = upgrades.find(u => u.id === equippedUpgrade);
      if (upgrade) baseGain += upgrade.powerBonus;
    }
    
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

  const increaseClicks = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    
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

  const purchaseUpgrade = (id: string) => {
    const upgrade = upgrades.find(u => u.id === id);
    if (!upgrade || upgrade.purchased || powerLevel < upgrade.cost) return;

    if (upgrade.id === 'weights') {
      const weights: Item = {
        id: `weights-${Date.now()}`,
        name: "Training Weights",
        description: "Increases power gain by 15% when equipped",
        type: 'weight',
        slot: 'weight',
        effect: {
          type: 'power_gain_percent',
          value: 0.15
        }
      };
      
      setPowerLevel(powerLevel - upgrade.cost);
      setInventory(prev => [...prev, weights]);
      
      toast(`You've purchased ${upgrade.name}!`, {
        description: "Check your inventory to equip it.",
        duration: 3000,
      });
      return;
    }

    setPowerLevel(powerLevel - upgrade.cost);
    setUpgrades(upgrades.map(u => (u.id === id ? { ...u, purchased: true } : u)));
    
    toast(`You've purchased ${upgrade.name}!`, {
      description: "Equip it to boost your power gains.",
      duration: 3000,
    });
  };

  const equipUpgrade = (id: string) => {
    const upgrade = upgrades.find(u => u.id === id);
    if (!upgrade || !upgrade.purchased) return;

    setEquippedUpgrade(id);
    
    toast(`You've equipped ${upgrade.name}!`, {
      description: `Power gain +${upgrade.powerBonus}`,
      duration: 3000,
    });
  };

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

  const purchaseItem = (itemType: string) => {
    if (itemType === 'senzu') {
      if (zeni < 100) {
        toast.error("Not enough Zeni!", {
          description: "You need 100 Zeni to buy a Senzu Bean.",
          duration: 3000,
        });
        return;
      }
      
      const senzuBean: Item = {
        id: `senzu-${Date.now()}`,
        name: "Senzu Bean",
        description: "Completely restore HP during battle",
        type: 'consumable',
        effect: {
          type: 'heal',
          value: 1
        },
        usableInBattle: true
      };
      
      setZeni(zeni - 100);
      
      const existingSenzu = inventory.find(i => 
        i.name === "Senzu Bean" && 
        i.type === 'consumable' && 
        i.effect?.type === 'heal'
      );
      
      if (existingSenzu) {
        toast.success("Purchased Senzu Bean!", {
          description: "Added to your existing stack.",
          duration: 3000,
        });
      } else {
        setInventory(prev => [...prev, senzuBean]);
        toast.success("Purchased Senzu Bean!", {
          description: "Check your inventory to use it during battle.",
          duration: 3000,
        });
      }
    }
  };

  const equipItem = (itemId: string | null, slotType: string) => {
    if (itemId === null) {
      setEquippedItems(prevItems => prevItems.filter(item => item.slot !== slotType));
      return;
    }
    
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;
    
    setEquippedItems(prevItems => {
      const newItems = prevItems.filter(i => i.slot !== slotType);
      return [...newItems, item];
    });
    
    toast(`You've equipped ${item.name}!`, {
      description: item.description,
      duration: 3000,
    });
  };

  const useItem = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item || item.type !== 'consumable') return;
    
    if (item.effect && item.effect.duration) {
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
      
      const endTime = Date.now() + (item.effect.duration * 1000);
      setActiveBuffs(prev => [...prev, { id: item.id, endTime }]);
      
      setInventory(prev => prev.filter(i => i.id !== itemId));
      
      toast(`You used ${item.name}!`, {
        description: `Effect active for ${item.effect.duration} seconds.`,
        duration: 3000,
      });
    }
  };

  const useItemInBattle = (itemId: string) => {
    if (!battleState.inProgress || !battleState.playerTurn) return;
    
    const item = inventory.find(i => i.id === itemId);
    if (!item || !item.usableInBattle) return;
    
    if (item.effect?.type === 'heal') {
      const newPlayerStats = {
        ...battleState.playerStats,
        hp: battleState.playerStats.maxHp
      };
      
      setBattleState(prev => ({
        ...prev,
        playerStats: newPlayerStats,
        log: [...prev.log, `You used ${item.name} and fully recovered your HP!`],
        playerTurn: false
      }));
      
      setInventory(prev => prev.filter(i => i.id !== itemId));
      
      setTimeout(() => {
        enemyAttack(battleState, setBattleState, endBattle);
      }, 1000);
    }
  };

  const fightEnemy = (zone: string) => {
    let selectedEnemy: Enemy;
    
    if (zone === 'forest') {
      const rand = Math.random();
      if (rand < 0.5) {
        selectedEnemy = { ...forestEnemies[0] };
      } else if (rand < 0.8) {
        selectedEnemy = { ...forestEnemies[1] };
      } else {
        selectedEnemy = { ...forestEnemies[2] };
      }
    } else {
      const rand = Math.random();
      if (rand < 0.2) {
        selectedEnemy = { ...desertEnemies[0] };
      } else {
        selectedEnemy = { ...desertEnemies[1] };
      }
    }
    
    setFightResult({ enemy: selectedEnemy, won: null });
    startBattle(selectedEnemy);
  };

  const clearFightResult = () => {
    setFightResult(null);
  };

  const startBattle = (enemy: Enemy) => {
    const playerStats = calculatePlayerStats(powerLevel, equippedItems);
    const playerFirst = powerLevel >= enemy.power;
    
    setBattleState({
      inProgress: true,
      playerStats,
      enemy: { ...enemy },
      log: [`Battle started against ${enemy.name}!`, 
            `${playerFirst ? 'You attack first!' : `${enemy.name} attacks first!`}`],
      playerTurn: playerFirst
    });

    if (!playerFirst) {
      setTimeout(() => {
        enemyAttack(battleState, setBattleState, endBattle);
      }, 1000);
    }
  };

  const useSkill = (skill: Skill) => {
    if (!battleState.inProgress || !battleState.playerTurn || !battleState.enemy || !skill.purchased) return;
    
    if (battleState.playerStats.ki < skill.kiCost) {
      setBattleState(prev => ({
        ...prev,
        log: [...prev.log, `Not enough Ki to use ${skill.name}!`]
      }));
      return;
    }
    
    const damage = Math.floor(battleState.playerStats.damage * skill.damageMultiplier);
    
    const newEnemyHp = Math.max(0, battleState.enemy.hp - damage);
    const newEnemy = {
      ...battleState.enemy,
      hp: newEnemyHp
    };
    
    const newPlayerStats = {
      ...battleState.playerStats,
      ki: battleState.playerStats.ki - skill.kiCost
    };
    
    if (newEnemyHp <= 0) {
      setBattleState(prev => ({
        ...prev,
        enemy: newEnemy,
        playerStats: newPlayerStats,
        log: [...prev.log, `You use ${skill.name} for ${damage} damage!`, `${prev.enemy?.name} was defeated!`],
        inProgress: false
      }));
      
      setTimeout(() => endBattle(true), 1500);
      return;
    }
    
    setBattleState(prev => ({
      ...prev,
      enemy: newEnemy,
      playerStats: newPlayerStats,
      log: [...prev.log, `You use ${skill.name} for ${damage} damage!`],
      playerTurn: false
    }));
    
    setTimeout(() => {
      enemyAttack(battleState, setBattleState, endBattle);
    }, 1000);
  };

  const fleeFromBattle = () => {
    if (!battleState.inProgress) return;
    
    const fleeSuccessful = Math.random() > 0.5;
    
    if (fleeSuccessful) {
      setBattleState(prev => ({
        ...prev,
        log: [...prev.log, 'You successfully fled from battle!'],
        inProgress: false
      }));
      
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
      
      setTimeout(() => {
        enemyAttack(battleState, setBattleState, endBattle);
      }, 1000);
    }
  };

  const endBattle = (victory: boolean) => {
    setFightResult(prev => prev ? { ...prev, won: victory } : null);
    
    if (victory && battleState.enemy) {
      const powerGain = Math.floor(battleState.enemy.power / 5);
      
      if (powerGain > 0) {
        setPowerLevel(prev => prev + powerGain);
        
        setTimeout(() => {
          toast.success(`You gained ${powerGain} Power Level from defeating ${battleState.enemy?.name}!`, {
            description: `Your Power Level is now ${powerLevel + powerGain}!`,
          });
        }, 500);
      }
      
      handleEnemyDrops(battleState.enemy, setInventory, setZeni);
    }
    
    setTimeout(() => {
      setBattleState(initialBattleState);
    }, 1500);
  };

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
        resetProgress,
        activeBuffs
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
