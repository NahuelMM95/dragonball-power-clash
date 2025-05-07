
import { BattleState, Skill } from '@/types/game';
import { enemyAttack, toggleKaiokenForm } from './battle';

// Helper function for using skills in battle
export const useSkillInBattle = (
  skill: Skill,
  battleState: BattleState,
  setBattleState: React.Dispatch<React.SetStateAction<BattleState>>,
  endBattle: (victory: boolean) => void
) => {
  if (!battleState.inProgress || !battleState.playerTurn || !battleState.enemy || !skill.purchased) return;
  
  // Handle Kaioken form toggling
  if (skill.name === "Kaioken x2" && skill.type === "form") {
    // Check if the player already has Kaioken active
    if (battleState.playerStats.activeForm === "Kaioken x2") {
      // Toggle Kaioken off
      toggleKaiokenForm(battleState, setBattleState, endBattle);
      return;
    } else {
      // Toggle Kaioken on
      if (battleState.playerStats.ki < skill.kiCost) {
        setBattleState(prev => ({
          ...prev,
          log: [...prev.log, `Not enough Ki to use ${skill.name}!`]
        }));
        return;
      }
      
      // Deduct ki cost
      const newPlayerStats = {
        ...battleState.playerStats,
        ki: battleState.playerStats.ki - skill.kiCost
      };
      
      setBattleState(prev => ({
        ...prev,
        playerStats: newPlayerStats
      }));
      
      // Toggle Kaioken on with the updated ki
      toggleKaiokenForm(
        { ...battleState, playerStats: newPlayerStats },
        setBattleState,
        endBattle
      );
      
      return;
    }
  }
  
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
  
  // Apply Kaioken drain if active
  if (newPlayerStats.activeForm === "Kaioken x2") {
    const kaiokenSkill = skill.type === "form" ? skill : 
      battleState.playerStats.activeForm === "Kaioken x2" ? 
        { specialEffect: { value: 0.02, type: "hp_drain_percent" }} : null;
    
    if (kaiokenSkill && kaiokenSkill.specialEffect) {
      const hpDrain = Math.ceil(newPlayerStats.maxHp * (kaiokenSkill.specialEffect.value || 0));
      newPlayerStats.hp = Math.max(1, newPlayerStats.hp - hpDrain); // Ensure player doesn't die from drain
      
      // Add HP drain to battle log
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
