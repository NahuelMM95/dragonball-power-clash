
import { useState } from 'react';
import { BattleState, Enemy, CombatStats } from '@/types/game';
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

  const startBattle = (enemy: Enemy, continueWithStats?: CombatStats): BattleState => {
    // Use continued stats if provided, otherwise calculate new stats
    const playerStats = continueWithStats || calculatePlayerStats(powerLevel, equippedItems);
    const playerFirst = powerLevel >= enemy.power;
    
    let battleMessage = `Battle started against ${enemy.name}!`;
    
    // Add sequence info to battle log if present
    if (enemy.sequencePosition && enemy.sequenceTotal) {
      battleMessage += ` (${enemy.sequencePosition} of ${enemy.sequenceTotal})`;
    }
    
    const newBattleState = {
      inProgress: true,
      playerStats,
      enemy: { ...enemy },
      log: [battleMessage, 
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
