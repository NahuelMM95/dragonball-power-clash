
import React, { createContext, useContext } from 'react';
import { BattleContextType, Item } from '@/types/game';
import { useSkillManagement } from '@/hooks/useSkillManagement';
import { useBattleInitiation } from '@/hooks/useBattleInitiation';
import { useEnemySequence } from '@/hooks/useEnemySequence';
import { useBattleActions } from '@/hooks/useBattleActions';
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
  
  // Enemy sequence management
  const {
    enemySequence,
    currentSequenceIndex,
    handleEnemySequence,
    advanceEnemySequence,
    clearEnemySequence
  } = useEnemySequence();
  
  // Battle state and initiation
  const {
    battleState,
    setBattleState,
    fightResult,
    setFightResult,
    clearFightResult,
    startBattle,
    resetBattleState,
    fightEnemy: initiateFight,
    forest,
    desert,
    wasteland,
    crystalCave
  } = useBattleInitiation(powerLevel, equippedItems);
  
  // Battle actions
  const {
    useSkill,
    fleeFromBattle,
    endBattle,
    useItemInBattle
  } = useBattleActions(
    powerLevel,
    setPowerLevel,
    setInventory,
    setZeni,
    battleState,
    setBattleState,
    resetBattleState,
    setFightResult,
    clearFightResult,
    advanceEnemySequence,
    clearEnemySequence
  );

  // Wrapper for initiating a fight with a zone
  const fightEnemy = (zone: string) => {
    const newBattleState = initiateFight(zone, handleEnemySequence);
    
    // Set the endBattle callback on the battle state
    if (!newBattleState.playerTurn) {
      setTimeout(() => {
        // This ensures the endBattle from useBattleActions is used
        const enemyAttack = (bs: any, setBs: any, endBattleCb: any) => {
          // Import dynamically to avoid circular dependencies
          import('@/utils/battle').then(({ enemyAttack }) => {
            enemyAttack(bs, setBs, endBattle);
          });
        };
        
        enemyAttack(newBattleState, setBattleState, endBattle);
      }, 1000);
    }
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
      startBattle,
      useSkill,
      fleeFromBattle,
      endBattle,
      useItemInBattle,
      forest,
      desert,
      crystalCave,
      wasteland,
      resetSkills,
      enemySequence,
      currentSequenceIndex
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
