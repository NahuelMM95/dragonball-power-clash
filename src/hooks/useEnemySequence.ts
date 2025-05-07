
import { useState } from 'react';
import { Enemy } from '@/types/game';
import { toast } from "sonner";

export const useEnemySequence = () => {
  // State for storing enemies in a sequence
  const [enemySequence, setEnemySequence] = useState<Enemy[]>([]);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState<number>(0);

  // Function to handle enemy sequences
  const handleEnemySequence = (selectedEnemy: Enemy | Enemy[]) => {
    // Handle multiple enemy sequence
    if (Array.isArray(selectedEnemy)) {
      setEnemySequence(selectedEnemy);
      setCurrentSequenceIndex(0);
      
      toast.info(`Multiple enemies encountered!`, {
        description: `You will fight ${selectedEnemy.length} enemies in sequence.`
      });
      
      return selectedEnemy[0]; // Return the first enemy to start with
    } else {
      // Clear any existing sequence
      setEnemySequence([]);
      setCurrentSequenceIndex(0);
      return selectedEnemy;
    }
  };

  // Function to advance to the next enemy in the sequence
  const advanceEnemySequence = () => {
    if (enemySequence.length > 0 && currentSequenceIndex < enemySequence.length - 1) {
      const nextIndex = currentSequenceIndex + 1;
      setCurrentSequenceIndex(nextIndex);
      
      const nextEnemy = enemySequence[nextIndex];
      
      toast.info(`Next enemy: ${nextEnemy.name}`, {
        description: `Enemy ${nextIndex + 1} of ${enemySequence.length}`
      });
      
      return nextEnemy;
    }
    
    return null; // No more enemies in sequence
  };

  // Function to clear enemy sequence
  const clearEnemySequence = () => {
    setEnemySequence([]);
    setCurrentSequenceIndex(0);
  };

  return {
    enemySequence,
    currentSequenceIndex,
    handleEnemySequence,
    advanceEnemySequence,
    clearEnemySequence
  };
};
