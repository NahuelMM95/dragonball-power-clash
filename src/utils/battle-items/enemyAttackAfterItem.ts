
import { BattleState } from "@/types/game";

// Helper function to trigger enemy attack after item use
export const enemyAttackAfterItem = (
  damage: number,
  battleState: BattleState,
  playerStats: any,
  setBattleState: React.Dispatch<React.SetStateAction<BattleState>>,
  endBattle: (victory: boolean) => void,
  isReduced: boolean = false
) => {
  const newPlayerStats = {
    ...playerStats,
    hp: Math.max(0, playerStats.hp - damage)
  };
  
  if (newPlayerStats.hp <= 0) {
    setBattleState(prev => ({
      ...prev,
      playerStats: newPlayerStats,
      log: [...prev.log, `${prev.enemy?.name} attacks for ${damage.toLocaleString('en')} damage${isReduced ? ' (reduced)' : ''}!`, "You were defeated!"],
      inProgress: false
    }));
    
    setTimeout(() => endBattle(false), 1500);
    return;
  }
  
  setBattleState(prev => ({
    ...prev,
    playerStats: newPlayerStats,
    log: [...prev.log, `${prev.enemy?.name} attacks for ${damage.toLocaleString('en')} damage${isReduced ? ' (reduced)' : ''}!`],
    playerTurn: true
  }));
};
