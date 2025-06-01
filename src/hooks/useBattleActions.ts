import { useSkillInBattle } from '@/utils/battleSkillActions';
import { fleeFromBattle } from '@/utils/battleFleeActions';
import { useItemInBattle, processBattleEnd } from '@/utils/battleItemActions';
import { enemyAttack } from '@/utils/battle';
import { BattleState, Enemy, Skill, Item } from '@/types/game';

export const useBattleActions = (
  powerLevel: number,
  setPowerLevel: React.Dispatch<React.SetStateAction<number>>,
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>,
  setZeni: React.Dispatch<React.SetStateAction<number>>,
  battleState: BattleState,
  setBattleState: React.Dispatch<React.SetStateAction<BattleState>>,
  resetBattleState: () => void,
  setFightResult: React.Dispatch<React.SetStateAction<{ enemy: Enemy | null; won: boolean | null } | null>>,
  clearFightResult: () => void,
  advanceEnemySequence: () => Enemy | null,
  clearEnemySequence: () => void
) => {
  // Function to handle using a skill during battle
  const useSkill = (skill: Skill) => {
    useSkillInBattle(skill, battleState, setBattleState, endBattle);
  };

  // Function to handle fleeing from battle
  const handleFleeFromBattle = () => {
    fleeFromBattle(battleState, setBattleState, resetBattleState, clearFightResult);
    
    // Clear enemy sequence when fleeing
    clearEnemySequence();
  };

  // Function to handle ending the battle
  const endBattle = (victory: boolean) => {
    if (victory) {
      const nextEnemy = advanceEnemySequence();
      
      if (nextEnemy) {
        // Continue with next enemy in sequence - DON'T CLOSE THE BATTLE DIALOG
        setTimeout(() => {
          // Start battle with the next enemy but keep player's current stats
          const continuedBattleState = {
            ...battleState,
            enemy: nextEnemy,
            log: [...battleState.log, `Next enemy: ${nextEnemy.name}`, "The battle continues!"],
            playerTurn: powerLevel >= nextEnemy.power,
            inProgress: true // Ensure battle stays active
          };
          
          setBattleState(continuedBattleState);
          
          // DON'T set fight result to null - keep the battle dialog open
          // Just update the enemy
          setFightResult(prev => ({ 
            enemy: nextEnemy,
            won: null // Reset win state for new enemy
          }));
          
          // If enemy attacks first in the new battle
          if (!continuedBattleState.playerTurn) {
            setTimeout(() => {
              enemyAttack(continuedBattleState, setBattleState, endBattle);
            }, 1000);
          }
        }, 1500);
        
        // Return early to prevent normal battle end processing
        return;
      } else {
        // Process the battle end normally (last enemy in sequence or regular battle)
        processBattleEnd(
          victory, 
          battleState.enemy, 
          powerLevel, 
          setPowerLevel, 
          setInventory, 
          setZeni, 
          setFightResult, 
          resetBattleState
        );
        
        // Clear enemy sequence when all enemies are defeated
        clearEnemySequence();
      }
    } else {
      // Process defeat
      processBattleEnd(
        victory, 
        battleState.enemy, 
        powerLevel, 
        setPowerLevel, 
        setInventory, 
        setZeni, 
        setFightResult, 
        resetBattleState
      );
      
      // Clear enemy sequence on defeat
      clearEnemySequence();
    }
  };

  // Function to use item in battle
  const handleUseItemInBattle = (itemId: string, inventory: Item[], setInventoryCallback: React.Dispatch<React.SetStateAction<Item[]>>) => {
    useItemInBattle(itemId, inventory, setInventoryCallback, battleState, setBattleState, endBattle);
  };

  return {
    useSkill,
    fleeFromBattle: handleFleeFromBattle,
    endBattle,
    useItemInBattle: handleUseItemInBattle
  };
};
