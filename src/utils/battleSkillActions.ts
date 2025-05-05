
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
  
  let damage = Math.floor(battleState.playerStats.damage * skill.damageMultiplier);
  
  // Apply special effects like Kaioken's HP drain
  let newPlayerStats = {
    ...battleState.playerStats,
    ki: battleState.playerStats.ki - skill.kiCost
  };
  
  // Handle Kaioken HP drain
  if (skill.name === "Kaioken x2" && skill.specialEffect) {
    const hpDrain = Math.ceil(battleState.playerStats.maxHp * skill.specialEffect.value);
    newPlayerStats.hp = Math.max(1, newPlayerStats.hp - hpDrain); // Ensure player doesn't die from drain
    
    // Add HP drain to battle log
    setBattleState(prev => ({
      ...prev,
      log: [...prev.log, `Kaioken drains ${hpDrain.toLocaleString('en')} HP!`]
    }));
  }
  
  const newEnemyHp = Math.max(0, battleState.enemy.hp - damage);
  const newEnemy = {
    ...battleState.enemy,
    hp: newEnemyHp
  };
  
  if (newEnemyHp <= 0) {
    setBattleState(prev => ({
      ...prev,
      enemy: newEnemy,
      playerStats: newPlayerStats,
      log: [...prev.log, `You use ${skill.name} for ${damage.toLocaleString('en')} damage!`, `${prev.enemy?.name} was defeated!`],
      inProgress: false
    }));
    
    setTimeout(() => endBattle(true), 1500);
    return;
  }
  
  setBattleState(prev => ({
    ...prev,
    enemy: newEnemy,
    playerStats: newPlayerStats,
    log: [...prev.log, `You use ${skill.name} for ${damage.toLocaleString('en')} damage!`],
    playerTurn: false
  }));
  
  setTimeout(() => {
    enemyAttack(battleState, setBattleState, endBattle);
  }, 1000);
};
