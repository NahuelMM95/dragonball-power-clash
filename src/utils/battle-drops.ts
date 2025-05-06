
import { Enemy, Item } from '../types/game';
import { toast } from "sonner";

// Handle enemy drops after defeating them
export const handleEnemyDrops = (
  enemy: Enemy, 
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>,
  setZeni: React.Dispatch<React.SetStateAction<number>>
) => {
  // Add zeni reward if available
  if (enemy.zeniReward) {
    setZeni(prev => prev + enemy.zeniReward);
    
    toast.success(`+ ${enemy.zeniReward.toLocaleString('en')} Zeni`, {
      description: "Added to your wallet",
      duration: 3000
    });
  }
  
  // All other drops have been removed
};
