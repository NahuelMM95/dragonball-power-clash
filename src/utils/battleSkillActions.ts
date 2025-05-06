
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
  
  // Apply special effects like Kaioken's HP drain and stat multipliers
  let newPlayerStats = {
    ...battleState.playerStats,
    ki: battleState.playerStats.ki - skill.kiCost
  };
  
  // Handle form transformations like Kaioken
  if (skill.type === "form" && skill.specialEffect?.multiplier) {
    const multiplier = skill.specialEffect.multiplier;
    
    // Apply the multiplier to all stats
    newPlayerStats = {
      ...newPlayerStats,
      hp: Math.floor(newPlayerStats.hp * multiplier),
      maxHp: Math.floor(newPlayerStats.maxHp * multiplier),
      damage: Math.floor(newPlayerStats.damage * multiplier),
      ki: Math.floor(newPlayerStats.ki * multiplier),
      maxKi: Math.floor(newPlayerStats.maxKi * multiplier),
      activeForm: skill.name,
      formMultiplier: multiplier,
      basePowerLevel: battleState.playerStats.basePowerLevel || 0,
      powerLevel: Math.floor((battleState.playerStats.basePowerLevel || 0) * multiplier)
    };
    
    // Recalculate damage with the new multiplier
    damage = Math.floor(newPlayerStats.damage * skill.damageMultiplier);
    
    // Add transformation to battle log
    setBattleState(prev => ({
      ...prev,
      log: [...prev.log, `You transform using ${skill.name}! Your power level is now ${newPlayerStats.powerLevel.toLocaleString('en')}!`]
    }));
  }
  
  // Handle HP drain for Kaioken
  if (skill.name === "Kaioken x2" && skill.specialEffect) {
    const hpDrain = Math.ceil(newPlayerStats.maxHp * skill.specialEffect.value);
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
