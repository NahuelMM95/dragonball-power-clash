import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { BattleProvider, useBattle } from './BattleContext';
import { ItemProvider, useItems } from './ItemContext'; 
import { UpgradeProvider, useUpgrades } from './UpgradeContext';
import { GameContextType } from '@/types/game';

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialState = {
  clicks: 0,
  powerLevel: 1,
  zeni: 0
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clicks, setClicks] = useLocalStorage('dbClicks', initialState.clicks);
  const [powerLevel, setPowerLevel] = useLocalStorage('dbPowerLevel', initialState.powerLevel);
  const [zeni, setZeni] = useLocalStorage('dbZeni', initialState.zeni);
  const [inventory, setInventory] = useLocalStorage('dbInventory', []);
  const [equippedItems, setEquippedItems] = useLocalStorage('dbEquippedItems', []);

  const increaseClicks = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    
    // We'll move the power level increase logic to UpgradeContext.tsx
    // to handle both the base increase and any bonuses from upgrades
  };

  const resetProgress = () => {
    setClicks(initialState.clicks);
    setPowerLevel(initialState.powerLevel);
    setZeni(initialState.zeni);
  };
  
  return (
    <GameContext.Provider value={{ 
      clicks, 
      powerLevel,
      zeni,
      increaseClicks,
      resetProgress,
      setPowerLevel,
      setZeni
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const GameContextWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { powerLevel, setPowerLevel, zeni, setZeni, clicks, increaseClicks: originalIncreaseClicks } = useGame();
  const [inventory, setInventory] = useLocalStorage('dbInventory', []);
  const [equippedItems, setEquippedItems] = useLocalStorage('dbEquippedItems', []);
  
  const gameContextEnhanced = {
    clicks,
    powerLevel,
    zeni,
    increaseClicks: () => {
      originalIncreaseClicks();
      
      // Calculate power gain based on equipped upgrade from UpgradeContext
      // We'll handle this from the UpgradeProvider since it has access to the
      // equipped upgrade and upgrade details
    },
    resetProgress: () => {
      // Keep the original implementation
      const context = useGame();
      context.resetProgress();
    },
    setPowerLevel,
    setZeni
  };
  
  return (
    <ItemProvider zeni={zeni} setZeni={setZeni}>
      <UpgradeProvider 
        powerLevel={powerLevel}
        setPowerLevel={setPowerLevel}
        setInventory={setInventory}
        clicks={clicks}
        originalIncreaseClicks={originalIncreaseClicks}
      >
        <BattleProvider
          powerLevel={powerLevel}
          setPowerLevel={setPowerLevel}
          equippedItems={equippedItems}
          setInventory={setInventory}
          setZeni={setZeni}
        >
          {children}
        </BattleProvider>
      </UpgradeProvider>
    </ItemProvider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
