
import { Item } from "@/types/game";

// Helper function to remove an item from inventory
export const removeItemFromInventory = (
  inventory: Item[],
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>,
  itemId: string
) => {
  setInventory(prev => {
    const updatedInventory = [...prev];
    const itemIndex = updatedInventory.findIndex(i => i.id === itemId);
    
    if (itemIndex === -1) return prev;
    
    if (updatedInventory[itemIndex].quantity > 1) {
      updatedInventory[itemIndex] = {
        ...updatedInventory[itemIndex],
        quantity: updatedInventory[itemIndex].quantity - 1
      };
    } else {
      updatedInventory.splice(itemIndex, 1);
    }
    
    return updatedInventory;
  });
};
