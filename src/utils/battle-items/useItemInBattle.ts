
import { toast } from "sonner";
import { Item, BattleState } from "@/types/game";
import { handleSenzuBean } from "./itemEffects/handleSenzuBean";
import { handleDamageBoost } from "./itemEffects/handleDamageBoost";
import { handleDefenseBoost } from "./itemEffects/handleDefenseBoost";
import { handleSummonAlly } from "./itemEffects/handleSummonAlly";

// Function to use items in battle
export const useItemInBattle = (
  itemId: string,
  inventory: Item[],
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>,
  battleState: BattleState,
  setBattleState: React.Dispatch<React.SetStateAction<BattleState>>,
  endBattle: (victory: boolean) => void
) => {
  const item = inventory.find(i => i.id === itemId);
  
  if (!item) {
    toast.error("Item not found!");
    return;
  }
  
  if (!item.usableInBattle) {
    toast.error("This item cannot be used in battle!");
    return;
  }
  
  // Handle item effects based on item type
  if (item.effect) {
    // Special case for Senzu Bean healing
    if (item.name === "Senzu Bean" && item.effect.type === 'heal') {
      handleSenzuBean(item, inventory, setInventory, itemId, battleState, setBattleState, endBattle);
      return;
    }
    
    // Handle temporary damage boost items
    if (item.effect.type === 'temp_damage_boost') {
      handleDamageBoost(item, inventory, setInventory, itemId, battleState, setBattleState, endBattle);
      return;
    } 
    
    // Handle temporary defense boost items
    else if (item.effect.type === 'temp_defense_boost') {
      handleDefenseBoost(item, inventory, setInventory, itemId, battleState, setBattleState, endBattle);
      return;
    } 
    
    // Handle summon ally items
    else if (item.effect.type === 'summon_ally') {
      handleSummonAlly(item, inventory, setInventory, itemId, battleState, setBattleState, endBattle);
      return;
    }
  }
};
