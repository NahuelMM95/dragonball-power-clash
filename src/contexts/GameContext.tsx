
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

  const increaseClicks = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    
    if (newClicks % 100 === 0) {
      setPowerLevel(prev => prev + 1);
    }
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
  const { powerLevel, setPowerLevel, zeni, setZeni } = useGame();
  const [inventory, setInventory] = useLocalStorage('dbInventory', []);
  const [equippedItems, setEquippedItems] = useLocalStorage('dbEquippedItems', []);
  
  return (
    <ItemProvider zeni={zeni} setZeni={setZeni}>
      <UpgradeProvider 
        powerLevel={powerLevel}
        setPowerLevel={setPowerLevel}
        setInventory={setInventory}
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
