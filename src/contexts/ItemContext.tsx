
import React, { createContext, useContext, useEffect } from 'react';
import { toast } from "sonner";
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { 
  Item, 
  ActiveBuff,
  ItemContextType
} from '@/types/game';

const ItemContext = createContext<ItemContextType | undefined>(undefined);

interface ItemProviderProps {
  children: React.ReactNode;
  zeni: number;
  setZeni: React.Dispatch<React.SetStateAction<number>>;
}

export const ItemProvider: React.FC<ItemProviderProps> = ({ children, zeni, setZeni }) => {
  const [inventory, setInventory] = useLocalStorage<Item[]>('dbInventory', []);
  const [equippedItems, setEquippedItems] = useLocalStorage<Item[]>('dbEquippedItems', []);
  const [activeBuffs, setActiveBuffs] = useLocalStorage<ActiveBuff[]>('dbActiveBuffs', []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const expiredBuffs = activeBuffs.filter(buff => buff.endTime <= now);
      
      if (expiredBuffs.length > 0) {
        setActiveBuffs(prevBuffs => prevBuffs.filter(buff => buff.endTime > now));
        
        expiredBuffs.forEach(buff => {
          const item = inventory.find(i => i.id === buff.id);
          if (item) {
            toast(`${item.name} effect has worn off`, {
              description: "Your temporary buff has expired.",
              duration: 3000
            });
          }
        });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeBuffs, inventory]);

  const addItemToInventory = (newItem: Item) => {
    setInventory(prevInventory => {
      const existingItemIndex = prevInventory.findIndex(
        item => item.name === newItem.name && item.type === newItem.type
      );
      
      if (existingItemIndex >= 0) {
        const updatedInventory = [...prevInventory];
        updatedInventory[existingItemIndex] = {
          ...updatedInventory[existingItemIndex],
          quantity: updatedInventory[existingItemIndex].quantity + (newItem.quantity || 1)
        };
        return updatedInventory;
      } else {
        return [...prevInventory, { ...newItem, quantity: newItem.quantity || 1 }];
      }
    });
  };

  const equipItem = (itemId: string | null, slotType: string) => {
    if (itemId === null) {
      setEquippedItems(prevItems => prevItems.filter(item => item.slot !== slotType));
      return;
    }
    
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;
    
    setEquippedItems(prevItems => {
      const newItems = prevItems.filter(i => i.slot !== slotType);
      return [...newItems, { ...item, quantity: 1 }];
    });
    
    toast(`You've equipped ${item.name}!`, {
      description: item.description,
      duration: 3000,
    });
  };

  const useItem = (itemId: string) => {
    const itemIndex = inventory.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;
    
    const item = inventory[itemIndex];
    if (item.type !== 'consumable') return;
    
    if (item.effect && item.effect.duration) {
      const hasActiveBuff = activeBuffs.some(buff => {
        const buffItem = inventory.find(i => i.id === buff.id);
        return buffItem?.effect?.type === item.effect?.type;
      });
      
      if (hasActiveBuff) {
        toast.error("Cannot use this item", {
          description: "You already have an active buff of this type.",
          duration: 3000,
        });
        return;
      }
      
      const endTime = Date.now() + (item.effect.duration * 1000);
      setActiveBuffs(prev => [...prev, { id: item.id, endTime }]);
      
      setInventory(prev => {
        if (item.quantity > 1) {
          return prev.map(i => 
            i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
          );
        } else {
          return prev.filter(i => i.id !== itemId);
        }
      });
      
      toast(`You used ${item.name}!`, {
        description: `Effect active for ${item.effect.duration} seconds.`,
        duration: 3000,
      });
    }
  };

  const purchaseItem = (itemType: string) => {
    if (itemType === 'senzu') {
      // Updated Senzu Bean price to 50,000 zeni
      const senzuPrice = 50000;
      
      if (zeni < senzuPrice) {
        toast.error("Not enough Zeni!", {
          description: `You need ${senzuPrice.toLocaleString('en')} Zeni to buy a Senzu Bean.`,
          duration: 3000,
        });
        return;
      }
      
      const senzuBean: Item = {
        id: `senzu-${Date.now()}`,
        name: "Senzu Bean",
        description: "Completely restore HP and Ki during battle",
        type: 'consumable',
        quantity: 1,
        effect: {
          type: 'heal',
          value: 1
        },
        usableInBattle: true
      };
      
      setZeni(zeni - senzuPrice);
      
      addItemToInventory(senzuBean);
      
      toast.success("Purchased Senzu Bean!", {
        description: "Added to your inventory.",
        duration: 3000,
      });
    }
  };
  
  return (
    <ItemContext.Provider value={{
      inventory,
      setInventory,
      equippedItems,
      setEquippedItems,
      activeBuffs,
      setActiveBuffs,
      equipItem,
      useItem,
      purchaseItem
    }}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItems = (): ItemContextType => {
  const context = useContext(ItemContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemProvider');
  }
  return context;
};
