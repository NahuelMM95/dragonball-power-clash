
import { Enemy } from '@/types/game';
import { toast } from "sonner";
import { handleEnemyPowerDrop, handlePlayerPowerLoss } from "../battle";

// Function to handle the end of a battle
export const processBattleEnd = (
  victory: boolean,
  enemy: Enemy | null,
  powerLevel: number,
  setPowerLevel: React.Dispatch<React.SetStateAction<number>>,
  setInventory: React.Dispatch<React.SetStateAction<any[]>>,
  setZeni: React.Dispatch<React.SetStateAction<number>>,
  setFightResult: any,
  resetBattleState: any
) => {
  // Update the fight result
  setFightResult(prev => ({ ...prev, won: victory }));
  resetBattleState();
  
  if (victory && enemy) {
    // Process zeni reward
    if (enemy.zeniReward) {
      setZeni(prev => prev + enemy.zeniReward);
      toast.success(`Earned ${enemy.zeniReward.toLocaleString('en')} Zeni!`, {
        description: `Reward from defeating ${enemy.name}`,
        duration: 3000
      });
    }
    
    // Handle power drop from enemy (20% chance)
    handleEnemyPowerDrop(enemy, powerLevel, setPowerLevel);
    
    // Update story progress if applicable
    if (enemy.isStoryBoss) {
      const currentProgress = parseInt(localStorage.getItem("dbzStoryProgress") || "0");
      localStorage.setItem("dbzStoryProgress", (currentProgress + 1).toString());
    }
  } else if (!victory && enemy) {
    // Handle player power loss on defeat
    handlePlayerPowerLoss(powerLevel, setPowerLevel);
  }
};
