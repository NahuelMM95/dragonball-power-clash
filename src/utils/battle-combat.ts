
import { BattleState, Enemy } from '../types/game';
import { toast } from "sonner";

// Helper function to make enemy attack
export const enemyAttack = (
  battleState: any,
  setBattleState: any,
  endBattle: (victory: boolean) => void
) => {
  if (!battleState.enemy) return;
  
  const damage = battleState.enemy.damage;
  
  const newPlayerStats = {
    ...battleState.playerStats,
    hp: Math.max(0, battleState.playerStats.hp - damage)
  };
  
  if (newPlayerStats.hp <= 0) {
    setBattleState(prev => ({
      ...prev,
      playerStats: newPlayerStats,
      log: [...prev.log, `${prev.enemy?.name} attacks for ${damage} damage!`, 'You were defeated!'],
      inProgress: false
    }));
    
    setTimeout(() => endBattle(false), 1500);
    return;
  }
  
  setBattleState(prev => ({
    ...prev,
    playerStats: newPlayerStats,
    log: [...prev.log, `${prev.enemy?.name} attacks for ${damage} damage!`],
    playerTurn: true
  }));
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
    
    toast.error(`Lost ${powerLoss} Power Levels!`, {
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
    
    toast.success(`Absorbed ${powerGain} Power Levels!`, {
      description: `You absorbed ${percentage.toFixed(1)}% of ${enemy.name}'s power.`,
      duration: 3000
    });
  }
};
