
import { BattleState, Skill } from '@/types/game';
import { enemyAttack } from './battle';

// Helper function for using skills in battle
export const useSkillInBattle = (
  skill: Skill,
  battleState: BattleState,
  setBattleState: React.Dispatch<React.SetStateAction<BattleState>>,
  endBattle: (victory: boolean) => void
) => {
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
