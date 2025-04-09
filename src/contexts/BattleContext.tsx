
import React, { createContext, useContext, useState } from 'react';
import { toast } from "sonner";
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { forestEnemies, desertEnemies } from '@/data/enemies';
import { playerSkills } from '@/data/skills';
import { calculatePlayerStats, handleEnemyDrops, enemyAttack } from '@/utils/battle';
import { 
  BattleState, 
  Enemy,
  Item,
  Skill,
  BattleContextType
} from '@/types/game';

const BattleContext = createContext<BattleContextType | undefined>(undefined);

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

interface BattleProviderProps {
  children: React.ReactNode;
  powerLevel: number;
  setPowerLevel: React.Dispatch<React.SetStateAction<number>>;
  equippedItems: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
  setZeni: React.Dispatch<React.SetStateAction<number>>;
}

export const BattleProvider: React.FC<BattleProviderProps> = ({ 
  children, 
  powerLevel, 
  setPowerLevel, 
  equippedItems,
  setInventory,
  setZeni
}) => {
  const [skills, setSkills] = useLocalStorage('dbSkills', playerSkills);
  const [fightResult, setFightResult] = useState<{ enemy: Enemy | null; won: boolean | null } | null>(null);
  const [battleState, setBattleState] = useState<BattleState>(initialBattleState);

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
    
    const newBattleState = {
      inProgress: true,
      playerStats,
      enemy: { ...enemy },
      log: [`Battle started against ${enemy.name}!`, 
            `${playerFirst ? 'You attack first!' : `${enemy.name} attacks first!`}`],
      playerTurn: playerFirst
    };
    
    setBattleState(newBattleState);

    if (!playerFirst) {
      setTimeout(() => {
        enemyAttack(newBattleState, setBattleState, endBattle);
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

  const purchaseSkill = (skillName: string) => {
    const skill = skills.find(s => s.name === skillName);
    if (!skill || skill.purchased || !skill.cost) return;

    setSkills(skills.map(s => (s.name === skillName ? { ...s, purchased: true } : s)));
    
    toast(`You've learned ${skill.name}!`, {
      description: "You can now use this skill in battle.",
      duration: 3000,
    });
    
    return skill.cost;
  };

  const useItemInBattle = (itemId: string, inventory: Item[], setItemInventory: React.Dispatch<React.SetStateAction<Item[]>>) => {
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
      
      setItemInventory(prev => prev.filter(i => i.id !== itemId));
      
      setTimeout(() => {
        enemyAttack(battleState, setBattleState, endBattle);
      }, 1000);
    }
  };
  
  return (
    <BattleContext.Provider value={{
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
      useItemInBattle,
      forest: forestEnemies,
      desert: desertEnemies
    }}>
      {children}
    </BattleContext.Provider>
  );
};

export const useBattle = (): BattleContextType => {
  const context = useContext(BattleContext);
  if (context === undefined) {
    throw new Error('useBattle must be used within a BattleProvider');
  }
  return context;
};
