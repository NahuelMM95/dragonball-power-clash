
import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { BattleProvider, useBattle } from './BattleContext';
import { ItemProvider, useItems } from './ItemContext'; 
import { UpgradeProvider, useUpgrades } from './UpgradeContext';
import { GameContextType } from '@/types/game';
import { toast } from 'sonner';

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialState = {
  clicks: 0,
  powerLevel: 5, // Changed starting power level from 1 to 5
  zeni: 0
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clicks, setClicks] = useLocalStorage('dbClicks', initialState.clicks);
  const [powerLevel, setPowerLevel] = useLocalStorage('dbPowerLevel', initialState.powerLevel);
  const [zeni, setZeni] = useLocalStorage('dbZeni', initialState.zeni);
  const [inventory, setInventory] = useLocalStorage('dbInventory', []);
  const [equippedItems, setEquippedItems] = useLocalStorage('dbEquippedItems', []);
  const [gameOver, setGameOver] = useLocalStorage('dbGameOver', false);

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
    setGameOver(false); // Reset game over state
  };

  // Check for game over condition when powerLevel is updated
  const handleSetPowerLevel = (newPowerLevelOrFunction: number | ((prev: number) => number)) => {
    setPowerLevel((prevPower) => {
      // Handle both direct value and function updates
      const newPowerLevel = typeof newPowerLevelOrFunction === 'function' 
        ? newPowerLevelOrFunction(prevPower) 
        : newPowerLevelOrFunction;
      
      // Check for game over
      if (newPowerLevel <= 0 && !gameOver) {
        setGameOver(true);
        toast.error("GAME OVER! Your power level dropped to zero!", {
          description: "Reset your game to start again",
          duration: 10000
        });
        return 0; // Don't go below zero
      }
      
      return newPowerLevel;
    });
  };
  
  return (
    <GameContext.Provider value={{ 
      clicks, 
      powerLevel,
      zeni,
      increaseClicks,
      resetProgress,
      setPowerLevel: handleSetPowerLevel,
      setZeni,
      gameOver
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const GameContextWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { powerLevel, setPowerLevel, zeni, setZeni, clicks, increaseClicks: originalIncreaseClicks, gameOver } = useGame();
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
    setZeni,
    gameOver
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
