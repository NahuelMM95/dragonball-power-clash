
import { useState } from 'react';
import { BattleState, Enemy } from '@/types/game';
import { calculatePlayerStats } from '@/utils/battle';

// Initial state for the battle
const initialBattleState: BattleState = {
  inProgress: false,
  playerStats: {
    hp: 0,
    maxHp: 0,
    damage: 0,
    ki: 0,
    maxKi: 0,
    damageMultiplier: 1,
    basePowerLevel: 0,
    powerLevel: 0
  },
  enemy: null,
  log: [],
  playerTurn: false
};

export const useBattleState = (powerLevel: number, equippedItems: any[]) => {
  const [battleState, setBattleState] = useState<BattleState>(initialBattleState);
  const [fightResult, setFightResult] = useState<{ enemy: Enemy | null; won: boolean | null } | null>(null);

  const clearFightResult = () => {
    setFightResult(null);
  };

  const startBattle = (enemy: Enemy): BattleState => {
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
    return newBattleState;
  };

  const resetBattleState = () => {
    setBattleState(initialBattleState);
  };

  return {
    battleState,
    setBattleState,
    fightResult,
    setFightResult,
    clearFightResult,
    startBattle,
    resetBattleState,
    initialBattleState
  };
};
