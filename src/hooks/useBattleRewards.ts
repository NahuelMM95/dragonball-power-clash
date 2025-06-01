
import { useState } from 'react';
import { Enemy } from '@/types/game';

interface BattleRewards {
  totalZeni: number;
  totalPowerGain: number;
  defeatedEnemies: Enemy[];
}

export const useBattleRewards = () => {
  const [accumulatedRewards, setAccumulatedRewards] = useState<BattleRewards>({
    totalZeni: 0,
    totalPowerGain: 0,
    defeatedEnemies: []
  });

  const addReward = (enemy: Enemy, powerGain: number = 0) => {
    setAccumulatedRewards(prev => ({
      totalZeni: prev.totalZeni + (enemy.zeniReward || 0),
      totalPowerGain: prev.totalPowerGain + powerGain,
      defeatedEnemies: [...prev.defeatedEnemies, enemy]
    }));
  };

  const clearRewards = () => {
    setAccumulatedRewards({
      totalZeni: 0,
      totalPowerGain: 0,
      defeatedEnemies: []
    });
  };

  const applyRewards = (
    setZeni: React.Dispatch<React.SetStateAction<number>>,
    setPowerLevel: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (accumulatedRewards.totalZeni > 0) {
      setZeni(prev => prev + accumulatedRewards.totalZeni);
    }
    if (accumulatedRewards.totalPowerGain > 0) {
      setPowerLevel(prev => prev + accumulatedRewards.totalPowerGain);
    }
    clearRewards();
  };

  return {
    accumulatedRewards,
    addReward,
    clearRewards,
    applyRewards
  };
};
