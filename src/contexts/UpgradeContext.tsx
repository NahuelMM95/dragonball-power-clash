
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
}

export const UpgradeProvider: React.FC<UpgradeProviderProps> = ({ 
  children, 
  powerLevel, 
  setPowerLevel, 
  setInventory,
  clicks,
  originalIncreaseClicks
}) => {
  const [upgrades, setUpgrades] = useLocalStorage<Upgrade[]>('dbUpgrades', initialUpgrades);
  const [equippedUpgrade, setEquippedUpgrade] = useLocalStorage<string | null>('dbEquippedUpgrade', null);

  // Apply power bonus when clicks are a multiple of 100
  useEffect(() => {
    if (clicks % 100 === 0 && clicks > 0) {
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
    }
  }, [clicks, equippedUpgrade, upgrades, setPowerLevel]);

  const purchaseUpgrade = (id: string) => {
    const upgrade = upgrades.find(u => u.id === id);
    if (!upgrade || upgrade.purchased || powerLevel < upgrade.cost) return;

    if (upgrade.id === 'weights') {
      const weights = {
        id: `weights-${Date.now()}`,
        name: "Training Weights",
        description: "Increases power gain by 15% when equipped",
        type: 'weight',
        slot: 'weight',
        effect: {
          type: 'power_gain_percent',
          value: 0.15
        }
      };
      
      setPowerLevel(powerLevel - upgrade.cost);
      setInventory(prev => [...prev, weights]);
      
      toast(`You've purchased ${upgrade.name}!`, {
        description: "Check your inventory to equip it.",
        duration: 3000,
      });
      return;
    }

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
