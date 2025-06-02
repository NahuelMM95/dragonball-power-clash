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
  
  // Handle form transformations
  if (skill.type === "form") {
    if (skill.name === "Kaioken x2") {
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
    } else if (skill.name === "Super Saiyan") {
      if (battleState.playerStats.activeForm === "Super Saiyan") {
        // Deactivate Super Saiyan
        toggleSuperSaiyanForm(battleState, setBattleState, endBattle);
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
        
        toggleSuperSaiyanForm(
          { ...battleState, playerStats: newPlayerStats },
          setBattleState,
          endBattle
        );
        
        return;
      }
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
  
  // Apply form drains if active
  if (newPlayerStats.activeForm === "Kaioken x2") {
    const hpDrain = Math.ceil(newPlayerStats.maxHp * 0.02);
    newPlayerStats.hp = Math.max(1, newPlayerStats.hp - hpDrain);
    
    setBattleState(prev => ({
      ...prev,
      log: [...prev.log, `Kaioken drains ${hpDrain.toLocaleString('en')} HP!`]
    }));
  } else if (newPlayerStats.activeForm === "Super Saiyan") {
    const kiDrain = Math.ceil(newPlayerStats.maxKi * 0.075);
    newPlayerStats.ki = Math.max(0, newPlayerStats.ki - kiDrain);
    
    setBattleState(prev => ({
      ...prev,
      log: [...prev.log, `Super Saiyan drains ${kiDrain.toLocaleString('en')} Ki!`]
    }));
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

// Function to toggle Super Saiyan form on/off
const toggleSuperSaiyanForm = (
  battleState: BattleState,
  setBattleState: React.Dispatch<React.SetStateAction<BattleState>>,
  endBattleCallback: (victory: boolean) => void
) => {
  if (!battleState.playerStats.activeForm) {
    // Activate Super Saiyan
    const multiplier = 50; // Super Saiyan x50
    
    // Get base stats
    const baseStats = battleState.playerStats;
    
    // Calculate new stats
    const newPlayerStats = {
      ...baseStats,
      hp: Math.floor(baseStats.hp * multiplier),
      maxHp: Math.floor(baseStats.maxHp * multiplier),
      damage: Math.floor(baseStats.damage * multiplier),
      ki: Math.floor(baseStats.ki * multiplier),
      maxKi: Math.floor(baseStats.maxKi * multiplier),
      activeForm: "Super Saiyan",
      formMultiplier: multiplier,
      basePowerLevel: baseStats.powerLevel || baseStats.basePowerLevel || 0,
      powerLevel: Math.floor((baseStats.powerLevel || baseStats.basePowerLevel || 0) * multiplier)
    };
    
    // Apply initial Ki drain
    const kiDrain = Math.ceil(newPlayerStats.maxKi * 0.075); // 7.5% Ki drain
    newPlayerStats.ki = Math.max(0, newPlayerStats.ki - kiDrain);
    
    setBattleState(prev => ({
      ...prev,
      log: [...prev.log, `You transform into a Super Saiyan! Your power increases dramatically!`, 
                          `Super Saiyan drains ${kiDrain.toLocaleString('en')} Ki!`],
      playerStats: newPlayerStats,
      playerTurn: false // End turn after transforming
    }));
    
    // Trigger enemy's turn
    setTimeout(() => {
      if (endBattleCallback) {
        enemyAttack(
          { ...battleState, playerStats: newPlayerStats }, 
          setBattleState, 
          endBattleCallback
        );
      }
    }, 1000);
  } else {
    // Deactivate Super Saiyan
    const baseStats = {
      ...battleState.playerStats,
      activeForm: undefined,
      formMultiplier: undefined
    };
    
    // Calculate HP percentage to maintain
    const currentHpPercentage = baseStats.hp / baseStats.maxHp;
    
    // Revert to base stats but keep relative HP percentage
    const newPlayerStats = {
      ...baseStats,
      hp: Math.floor((baseStats.basePowerLevel || 0) * 10 * currentHpPercentage),
      maxHp: Math.floor((baseStats.basePowerLevel || 0) * 10),
      damage: Math.floor((baseStats.basePowerLevel || 0) * 0.8),
      ki: Math.floor((baseStats.basePowerLevel || 0) * 5),
      maxKi: Math.floor((baseStats.basePowerLevel || 0) * 5),
      powerLevel: baseStats.basePowerLevel || 0
    };
    
    setBattleState(prev => ({
      ...prev,
      log: [...prev.log, `You revert from Super Saiyan. Your power returns to normal.`],
      playerStats: newPlayerStats,
      playerTurn: false // End turn after reverting
    }));
    
    // Trigger enemy's turn
    setTimeout(() => {
      if (endBattleCallback) {
        enemyAttack(
          { ...battleState, playerStats: newPlayerStats }, 
          setBattleState, 
          endBattleCallback
        );
      }
    }, 1000);
  }
};
