
import { useState } from 'react';
import { Enemy } from '@/types/game';
import { useBattleState } from './useBattleState';
import { useBattleZones } from './useBattleZones';
import { dbzEnemies } from '@/data/storyEnemies';
import { enemyAttack } from '@/utils/battle';

export const useBattleInitiation = (
  powerLevel: number,
  equippedItems: any[]
) => {
  const { forest, desert, wasteland, crystalCave, getFightEnemy } = useBattleZones();
  const { 
    battleState, 
    setBattleState, 
    fightResult, 
    setFightResult, 
    clearFightResult, 
    startBattle, 
    resetBattleState
  } = useBattleState(powerLevel, equippedItems);

  // Function to start a fight with an enemy from a specific zone
  const fightEnemy = (
    zone: string, 
    handleEnemySequence: (selectedEnemy: Enemy | Enemy[]) => Enemy
  ) => {
    let selectedEnemy: Enemy | Enemy[];
    
    if (zone === 'story') {
      // Get the current progress from localStorage
      const dbzProgress = parseInt(localStorage.getItem("dbzStoryProgress") || "0");
      selectedEnemy = { ...dbzEnemies[dbzProgress] };
    } else {
      selectedEnemy = getFightEnemy(zone, powerLevel);
    }
    
    // Handle enemy sequence and get the first enemy
    const firstEnemy = handleEnemySequence(selectedEnemy);
    
    setFightResult({ enemy: firstEnemy, won: null });
    
    const newBattleState = startBattle(firstEnemy);
    
    // If enemy attacks first, trigger their attack
    if (!newBattleState.playerTurn) {
      setTimeout(() => {
        enemyAttack(newBattleState, setBattleState, () => {});
      }, 1000);
    }
    
    return newBattleState;
  };

  return {
    battleState,
    setBattleState,
    fightResult,
    setFightResult,
    clearFightResult,
    startBattle,
    resetBattleState,
    fightEnemy,
    forest,
    desert,
    wasteland,
    crystalCave
  };
};
