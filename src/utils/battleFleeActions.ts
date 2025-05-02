
import { BattleState } from '@/types/game';
import { toast } from "sonner";
import { enemyAttack } from './battle';

// Helper function for fleeing from battle
export const fleeFromBattle = (
  battleState: BattleState,
  setBattleState: React.Dispatch<React.SetStateAction<BattleState>>,
  resetBattleState: () => void,
  clearFightResult: () => void
) => {
  if (!battleState.inProgress) return;
  
  const fleeSuccessful = Math.random() > 0.5;
  
  if (fleeSuccessful) {
    setBattleState(prev => ({
      ...prev,
      log: [...prev.log, 'You successfully fled from battle!'],
      inProgress: false
    }));
    
    setTimeout(() => {
      resetBattleState();
      clearFightResult();
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
      enemyAttack(battleState, setBattleState, (victory) => {
        // Using an inline function here to avoid circular dependencies
        if (!victory && battleState.enemy) {
          setBattleState(prev => ({
            ...prev,
            inProgress: false,
            log: [...prev.log, 'You were defeated!']
          }));
        }
      });
    }, 1000);
  }
};
