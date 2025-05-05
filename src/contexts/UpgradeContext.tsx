
import React, { createContext, useContext, useEffect } from 'react';
import { toast } from "sonner";
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { initialUpgrades } from '@/data/upgrades';
import { 
  Upgrade, 
  UpgradeContextType
} from '@/types/game';

const UpgradeContext = createContext<UpgradeContextType | undefined>(undefined);

interface UpgradeProviderProps {
  children: React.ReactNode;
  powerLevel: number;
  setPowerLevel: React.Dispatch<React.SetStateAction<number>>;
  setInventory: React.Dispatch<React.SetStateAction<any[]>>;
  clicks: number;
  originalIncreaseClicks: () => void;
  zeni: number;
  setZeni: React.Dispatch<React.SetStateAction<number>>;
}

export const UpgradeProvider: React.FC<UpgradeProviderProps> = ({ 
  children, 
  powerLevel, 
  setPowerLevel, 
  setInventory,
  clicks,
  originalIncreaseClicks,
  zeni,
  setZeni
}) => {
  const [upgrades, setUpgrades] = useLocalStorage<Upgrade[]>('dbUpgrades', initialUpgrades);
  const [equippedUpgrade, setEquippedUpgrade] = useLocalStorage<string | null>('dbEquippedUpgrade', null);

  // Apply power bonus when clicks are a multiple of 100, but with only a 20% chance
  useEffect(() => {
    if (clicks % 100 === 0 && clicks > 0) {
      // Base chance of 20%
      let baseChance = 0.2;
      
      // Check if weighted clothes are equipped
      const equippedItems = JSON.parse(localStorage.getItem('dbEquippedItems') || '[]');
      const hasWeightedClothes = equippedItems.some(
        (item: any) => item.effect?.type === 'power_gain_chance_increase'
      );
      
      // Increase chance if weighted clothes are equipped
      if (hasWeightedClothes) {
        baseChance += 0.15; // Add 15% chance
      }
      
      // Roll the dice
      const randomChance = Math.random();
      if (randomChance <= baseChance) {
        // Calculate bonus based on equipped upgrade
        let bonus = 1; // Base increase
        
        if (equippedUpgrade) {
          const upgrade = upgrades.find(u => u.id === equippedUpgrade);
          if (upgrade) {
            // Only apply the bonus, not 1 + bonus, as the base 1 is already included
            bonus = upgrade.powerBonus;
          }
        }
        
        setPowerLevel(prev => prev + bonus);
        toast.success(`You gained ${bonus.toLocaleString('en')} Power Level!`, {
          description: hasWeightedClothes 
            ? "Your weighted clothes increased your chance (35% chance)"
            : "You got lucky with your training (20% chance)",
        });
      }
    }
  }, [clicks, equippedUpgrade, upgrades, setPowerLevel]);

  const purchaseUpgrade = (id: string) => {
    const upgrade = upgrades.find(u => u.id === id);
    if (!upgrade || upgrade.purchased) return;

    if (upgrade.id === 'weights') {
      if (zeni < upgrade.cost) return;

      const weights = {
        id: `weights-${Date.now()}`,
        name: "Training Weights",
        description: "Increases chance of power gain by 15% per 100 clicks",
        type: 'weight',
        slot: 'weight',
        quantity: 1,
        effect: {
          type: 'power_gain_chance_increase',
          value: 0.15
        }
      };
      
      setZeni(zeni - upgrade.cost);
      setInventory(prev => [...prev, weights]);
      setUpgrades(upgrades.map(u => (u.id === id ? { ...u, purchased: true } : u)));
      
      toast(`You've purchased ${upgrade.name}!`, {
        description: "Check your inventory to equip it.",
        duration: 3000,
      });
      return;
    }

    // Handle power level cost for other upgrades
    if (powerLevel < upgrade.cost) return;
    setPowerLevel(powerLevel - upgrade.cost);
    setUpgrades(upgrades.map(u => (u.id === id ? { ...u, purchased: true } : u)));
    
    toast(`You've purchased ${upgrade.name}!`, {
      description: "Equip it to boost your power gains.",
      duration: 3000,
    });
  };

  const equipUpgrade = (id: string) => {
    const upgrade = upgrades.find(u => u.id === id);
    if (!upgrade || !upgrade.purchased) return;

    setEquippedUpgrade(id);
    
    toast(`You've equipped ${upgrade.name}!`, {
      description: `Power gain +${upgrade.powerBonus}`,
      duration: 3000,
    });
  };

  // Function to reset upgrades to their initial state
  const resetUpgrades = () => {
    setUpgrades(initialUpgrades);
    setEquippedUpgrade(null);
  };
  
  return (
    <UpgradeContext.Provider value={{
      upgrades,
      equippedUpgrade,
      purchaseUpgrade,
      equipUpgrade,
      resetUpgrades
    }}>
      {children}
    </UpgradeContext.Provider>
  );
};

export const useUpgrades = (): UpgradeContextType => {
  const context = useContext(UpgradeContext);
  if (context === undefined) {
    throw new Error('useUpgrades must be used within an UpgradeProvider');
  }
  return context;
};
