
import { BattleState, Skill } from '@/types/game';
import { enemyAttack, toggleKaiokenForm } from './battle';

// Helper function for calculating critical hits
const calculateCriticalDamage = (baseDamage: number): { damage: number; critType: string | null } => {
  const critRoll = Math.random() * 100;
  
  if (critRoll < 0.25) {
    // 0.25% chance for super critical (4x damage)
    return { damage: baseDamage * 4, critType: 'SUPER CRITICAL HIT!' };
  } else if (critRoll < 2.75) {
    // 2.5% chance for critical (2x damage)
    return { damage: baseDamage * 2, critType: 'CRITICAL HIT!' };
  }
  
  return { damage: baseDamage, critType: null };
};

// Helper function for using skills in battle
export const useSkillInBattle = (
  skill: Skill,
  battleState: BattleState,
  setBattleState: React.Dispatch<React.SetStateAction<BattleState>>,
  endBattle: (victory: boolean) => void
) => {
  if (!battleState.inProgress || !battleState.playerTurn || !battleState.enemy || !skill.purchased) return;
  
  // Calculate ki cost: base cost + percentage of max ki
  const baseKiCost = skill.kiCost || 0;
  const percentKiCost = skill.kiCostPercent ? Math.floor((skill.kiCostPercent / 100) * battleState.playerStats.maxKi) : 0;
  const totalKiCost = baseKiCost + percentKiCost;
  
  // Handle Kaioken form toggling
  if (skill.name === "Kaioken x2" && skill.type === "form") {
    if (battleState.playerStats.activeForm === "Kaioken x2") {
      toggleKaiokenForm(battleState, setBattleState, endBattle);
      return;
    } else {
      if (battleState.playerStats.ki < totalKiCost) {
        setBattleState(prev => ({
          ...prev,
          log: [...prev.log, `Not enough Ki to use ${skill.name}! (Need ${totalKiCost}, have ${battleState.playerStats.ki})`]
        }));
        return;
      }
      
      const newPlayerStats = {
        ...battleState.playerStats,
        ki: battleState.playerStats.ki - totalKiCost
      };
      
      setBattleState(prev => ({
        ...prev,
        playerStats: newPlayerStats
      }));
      
      toggleKaiokenForm(
        { ...battleState, playerStats: newPlayerStats },
        setBattleState,
        endBattle
      );
      
      return;
    }
  }
  
  if (battleState.playerStats.ki < totalKiCost) {
    setBattleState(prev => ({
      ...prev,
      log: [...prev.log, `Not enough Ki to use ${skill.name}! (Need ${totalKiCost}, have ${battleState.playerStats.ki})`]
    }));
    return;
  }
  
  let baseDamage = Math.floor(battleState.playerStats.damage * skill.damageMultiplier);
  
  // Calculate critical hit
  const { damage, critType } = calculateCriticalDamage(baseDamage);
  
  let newPlayerStats = {
    ...battleState.playerStats,
    ki: battleState.playerStats.ki - totalKiCost
  };
  
  // Apply Kaioken drain if active
  if (newPlayerStats.activeForm === "Kaioken x2") {
    const kaiokenSkill = skill.type === "form" ? skill : 
      battleState.playerStats.activeForm === "Kaioken x2" ? 
        { specialEffect: { value: 0.02, type: "hp_drain_percent" }} : null;
    
    if (kaiokenSkill && kaiokenSkill.specialEffect) {
      const hpDrain = Math.ceil(newPlayerStats.maxHp * (kaiokenSkill.specialEffect.value || 0));
      newPlayerStats.hp = Math.max(1, newPlayerStats.hp - hpDrain);
      
      setBattleState(prev => ({
        ...prev,
        log: [...prev.log, `Kaioken drains ${hpDrain.toLocaleString('en')} HP!`]
      }));
    }
  }
  
  const newEnemyHp = Math.max(0, battleState.enemy.hp - damage);
  const newEnemy = {
    ...battleState.enemy,
    hp: newEnemyHp
  };
  
  // Create battle log messages
  let attackMessage = `You use ${skill.name} for ${damage.toLocaleString('en')} damage!`;
  if (critType) {
    attackMessage = `${critType} You use ${skill.name} for ${damage.toLocaleString('en')} damage!`;
  }
  
  if (newEnemyHp <= 0) {
    setBattleState(prev => ({
      ...prev,
      enemy: newEnemy,
      playerStats: newPlayerStats,
      log: [...prev.log, attackMessage, `${prev.enemy?.name} was defeated!`],
      inProgress: false
    }));
    
    setTimeout(() => endBattle(true), 1500);
    return;
  }
  
  setBattleState(prev => ({
    ...prev,
    enemy: newEnemy,
    playerStats: newPlayerStats,
    log: [...prev.log, attackMessage],
    playerTurn: false
  }));
  
  setTimeout(() => {
    enemyAttack(battleState, setBattleState, endBattle);
  }, 1000);
};
