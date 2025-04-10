
import React, { createContext, useContext } from 'react';
import { BattleContextType, Enemy, Item } from '@/types/game';
import { useBattleState } from '@/hooks/useBattleState';
import { useBattleZones } from '@/hooks/useBattleZones';
import { useSkillManagement } from '@/hooks/useSkillManagement';
import { useSkillInBattle, fleeFromBattle, useItemInBattle, processBattleEnd } from '@/utils/battleActions';
import { enemyAttack } from '@/utils/battle';

const BattleContext = createContext<BattleContextType | undefined>(undefined);

interface BattleProviderProps {
  children: React.ReactNode;
  powerLevel: number;
  setPowerLevel: React.Dispatch<React.SetStateAction<number>>;
  equippedItems: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
  setZeni: React.Dispatch<React.SetStateAction<number>>;
}

export const BattleProvider: React.FC<BattleProviderProps> = ({ 
  children, 
  powerLevel, 
  setPowerLevel, 
  equippedItems,
  setInventory,
  setZeni
}) => {
  // Use our custom hooks
  const { skills, purchaseSkill } = useSkillManagement();
  const { forest, desert, getFightEnemy } = useBattleZones();
  const { 
    battleState, 
    setBattleState, 
    fightResult, 
    setFightResult, 
    clearFightResult, 
    startBattle: initBattle, 
    resetBattleState
  } = useBattleState(powerLevel, equippedItems);

  // Function to start a fight with an enemy from a specific zone
  const fightEnemy = (zone: string) => {
    const selectedEnemy = getFightEnemy(zone);
    setFightResult({ enemy: selectedEnemy, won: null });
    
    const newBattleState = initBattle(selectedEnemy);
    
    // If enemy attacks first, trigger their attack
    if (!newBattleState.playerTurn) {
      setTimeout(() => {
        enemyAttack(newBattleState, setBattleState, endBattle);
      }, 1000);
    }
  };

  // Function to handle using a skill during battle
  const useSkill = (skill: any) => {
    useSkillInBattle(skill, battleState, setBattleState, endBattle);
  };

  // Function to handle fleeing from battle
  const handleFleeFromBattle = () => {
    fleeFromBattle(battleState, setBattleState, resetBattleState, clearFightResult);
  };

  // Function to handle ending the battle
  const endBattle = (victory: boolean) => {
    processBattleEnd(
      victory, 
      battleState.enemy, 
      powerLevel, 
      setPowerLevel, 
      setInventory, 
      setZeni, 
      setFightResult, 
      resetBattleState
    );
  };

  // Function to use item in battle
  const handleUseItemInBattle = (itemId: string, inventory: Item[], setInventoryCallback: React.Dispatch<React.SetStateAction<Item[]>>) => {
    useItemInBattle(itemId, inventory, setInventoryCallback, battleState, setBattleState, endBattle);
  };

  return (
    <BattleContext.Provider value={{
      fightEnemy,
      fightResult,
      clearFightResult,
      battleState,
      skills,
      purchaseSkill,
      startBattle: initBattle,
      useSkill,
      fleeFromBattle: handleFleeFromBattle,
      endBattle,
      useItemInBattle: handleUseItemInBattle,
      forest,
      desert
    }}>
      {children}
    </BattleContext.Provider>
  );
};

export const useBattle = (): BattleContextType => {
  const context = useContext(BattleContext);
  if (context === undefined) {
    throw new Error('useBattle must be used within a BattleProvider');
  }
  return context;
};
