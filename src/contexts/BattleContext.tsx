
import React, { createContext, useContext } from 'react';
import { BattleContextType, Enemy, Item } from '@/types/game';
import { useBattleState } from '@/hooks/useBattleState';
import { useBattleZones } from '@/hooks/useBattleZones';
import { useSkillManagement } from '@/hooks/useSkillManagement';
import { useSkillInBattle } from '@/utils/battleSkillActions';
import { fleeFromBattle } from '@/utils/battleFleeActions';
import { useItemInBattle, processBattleEnd } from '@/utils/battleItemActions';
import { enemyAttack } from '@/utils/battle';
import { dbzEnemies } from '@/data/storyEnemies';
import { toast } from "sonner";

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
  const { skills, purchaseSkill, setSkills } = useSkillManagement();
  const { forest, desert, wasteland, crystalCave, getFightEnemy } = useBattleZones();
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
    let selectedEnemy: Enemy;
    
    if (zone === 'story') {
      // Get the current progress from localStorage
      const dbzProgress = parseInt(localStorage.getItem("dbzStoryProgress") || "0");
      selectedEnemy = { ...dbzEnemies[dbzProgress] };
    } else {
      selectedEnemy = getFightEnemy(zone, powerLevel);
    }
    
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
  
  // Function to purchase a skill
  const handlePurchaseSkill = (skillName: string) => {
    const skill = skills.find(s => s.name === skillName);
    
    if (!skill || skill.purchased) return;
    
    // Check if this is a power level requirement skill
    if (skill.powerRequirement) {
      if (powerLevel >= skill.powerRequirement) {
        purchaseSkill(skillName);
        toast.success(`You've mastered ${skillName}!`, {
          description: `Your power level of ${powerLevel.toLocaleString('en')} is sufficient to use this technique.`
        });
      } else {
        toast.error(`Not enough power to learn ${skillName}!`, {
          description: `You need ${skill.powerRequirement.toLocaleString('en')} Power Level (you have ${powerLevel.toLocaleString('en')}).`
        });
      }
      return;
    }
    
    // Regular zeni cost skill
    if (skill.cost && setZeni) {
      const cost = purchaseSkill(skillName);
      if (cost) {
        setZeni(prev => prev - cost);
      }
    }
  };
  
  // Function to reset skills to their initial state
  const resetSkills = () => {
    // Reset skills to their initial state from the playerSkills in data/skills
    import('@/data/skills').then(({ playerSkills }) => {
      setSkills(playerSkills);
    });
  };

  return (
    <BattleContext.Provider value={{
      fightEnemy,
      fightResult,
      clearFightResult,
      battleState,
      setBattleState,
      skills,
      purchaseSkill: handlePurchaseSkill,
      startBattle: initBattle,
      useSkill,
      fleeFromBattle: handleFleeFromBattle,
      endBattle,
      useItemInBattle: handleUseItemInBattle,
      forest,
      desert,
      crystalCave,
      wasteland,
      resetSkills
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
