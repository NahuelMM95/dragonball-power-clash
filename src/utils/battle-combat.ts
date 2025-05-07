import { BattleState, Enemy, CombatStats } from '../types/game';
import { toast } from "sonner";

// Helper function to make enemy attack
export const enemyAttack = (
  battleState: BattleState,
  setBattleState: React.Dispatch<React.SetStateAction<BattleState>>,
  endBattle: (victory: boolean) => void
) => {
  if (!battleState.enemy) return;
  
  const damage = battleState.enemy.damage;
  
  const newPlayerStats = {
    ...battleState.playerStats,
    hp: Math.max(0, battleState.playerStats.hp - damage)
  };
  
  // Apply Kaioken HP drain if active
  if (newPlayerStats.activeForm === "Kaioken x2") {
    const hpDrain = Math.ceil(newPlayerStats.maxHp * 0.02); // 2% HP drain
    newPlayerStats.hp = Math.max(1, newPlayerStats.hp - hpDrain); // Ensure player doesn't die from drain
    
    // Add drain to combat log after enemy attack
    setBattleState(prev => ({
      ...prev,
      log: [...prev.log, `${prev.enemy?.name} attacks for ${damage.toLocaleString('en')} damage!`, `Kaioken drains ${hpDrain.toLocaleString('en')} HP!`]
    }));
  } else {
    // Regular enemy attack without Kaioken drain
    setBattleState(prev => ({
      ...prev,
      log: [...prev.log, `${prev.enemy?.name} attacks for ${damage.toLocaleString('en')} damage!`]
    }));
  }
  
  if (newPlayerStats.hp <= 0) {
    setBattleState(prev => ({
      ...prev,
      playerStats: newPlayerStats,
      log: [...prev.log, 'You were defeated!'],
      inProgress: false
    }));
    
    setTimeout(() => endBattle(false), 1500);
    return;
  }
  
  setBattleState(prev => ({
    ...prev,
    playerStats: newPlayerStats,
    playerTurn: true
  }));
};

// Function to toggle Kaioken form on/off
export const toggleKaiokenForm = (
  battleState: BattleState,
  setBattleState: React.Dispatch<React.SetStateAction<BattleState>>,
  endBattleCallback: (victory: boolean) => void
) => {
  if (!battleState.playerStats.activeForm) {
    // Activate Kaioken
    const multiplier = 2; // Kaioken x2
    
    // Get base stats
    const baseStats = battleState.playerStats;
    
    // Calculate new stats
    const newPlayerStats: CombatStats = {
      ...baseStats,
      hp: Math.floor(baseStats.hp * multiplier),
      maxHp: Math.floor(baseStats.maxHp * multiplier),
      damage: Math.floor(baseStats.damage * multiplier),
      ki: Math.floor(baseStats.ki * multiplier),
      maxKi: Math.floor(baseStats.maxKi * multiplier),
      activeForm: "Kaioken x2",
      formMultiplier: multiplier,
      basePowerLevel: baseStats.powerLevel || baseStats.basePowerLevel || 0,
      powerLevel: Math.floor((baseStats.powerLevel || baseStats.basePowerLevel || 0) * multiplier)
    };
    
    // Apply initial HP drain
    const hpDrain = Math.ceil(newPlayerStats.maxHp * 0.02); // 2% HP drain
    newPlayerStats.hp = Math.max(1, newPlayerStats.hp - hpDrain); // Ensure player doesn't die from drain
    
    setBattleState(prev => ({
      ...prev,
      log: [...prev.log, `You activate Kaioken x2! Your power rises dramatically!`, 
                          `Kaioken drains ${hpDrain.toLocaleString('en')} HP!`],
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
    // Deactivate Kaioken
    const baseStats = {
      ...battleState.playerStats,
      activeForm: undefined,
      formMultiplier: undefined
    };
    
    // Calculate HP percentage to maintain
    const currentHpPercentage = baseStats.hp / baseStats.maxHp;
    
    // Revert to base stats but keep relative HP percentage
    const newPlayerStats: CombatStats = {
      ...baseStats,
      hp: Math.floor((baseStats.basePowerLevel || 0) * 10 * currentHpPercentage), // Base HP * current percentage
      maxHp: Math.floor((baseStats.basePowerLevel || 0) * 10),
      damage: Math.floor((baseStats.basePowerLevel || 0) * 0.8),
      ki: Math.floor((baseStats.basePowerLevel || 0) * 5),
      maxKi: Math.floor((baseStats.basePowerLevel || 0) * 5),
      powerLevel: baseStats.basePowerLevel || 0
    };
    
    setBattleState(prev => ({
      ...prev,
      log: [...prev.log, `You deactivate Kaioken. Your power returns to normal.`],
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

// Handle power loss when defeated (20% chance of losing 5-25%, 5% chance of losing all)
export const handlePlayerPowerLoss = (
  powerLevel: number,
  setPowerLevel: React.Dispatch<React.SetStateAction<number>>
) => {
  const randomChance = Math.random();
  
  // 5% chance of losing all power
  if (randomChance < 0.05) {
    setPowerLevel(0);
    toast.error("You've lost ALL your power levels!", {
      description: "Your body couldn't handle the defeat",
      duration: 5000
    });
    return;
  }
  
  // 20% chance of losing between 5-25% of power
  if (randomChance < 0.25) { // 0.05 + 0.20 = 0.25
    const percentage = 5 + Math.random() * 20; // Between 5 and 25
    const powerLoss = Math.ceil((percentage / 100) * powerLevel);
    setPowerLevel(prev => Math.max(0, prev - powerLoss));
    
    toast.error(`Lost ${powerLoss.toLocaleString('en')} Power Levels!`, {
      description: `You lost ${percentage.toFixed(1)}% of your power from the defeat.`,
      duration: 3000
    });
  }
};

// Handle enemy power drops after defeating them (20% chance)
export const handleEnemyPowerDrop = (
  enemy: Enemy,
  powerLevel: number,
  setPowerLevel: React.Dispatch<React.SetStateAction<number>>
) => {
  // 20% chance to gain a fraction of the enemy's power
  if (Math.random() < 0.2) {
    // Calculate power gain between 5% and 25% of enemy power
    const percentage = 5 + Math.random() * 20; // Between 5 and 25
    const powerGain = Math.ceil((percentage / 100) * enemy.power);
    
    setPowerLevel(prev => prev + powerGain);
    
    toast.success(`Absorbed ${powerGain.toLocaleString('en')} Power Levels!`, {
      description: `You absorbed ${percentage.toFixed(1)}% of ${enemy.name}'s power.`,
      duration: 3000
    });
  }
};
