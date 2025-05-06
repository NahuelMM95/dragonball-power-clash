
import { useState } from 'react';
import { useBattle } from '@/contexts/BattleContext';
import { useItems } from '@/contexts/ItemContext';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BattleState, Enemy, Skill } from '@/types/game';
import EnemyDisplay from './dialog/EnemyDisplay';
import BattleLog from './dialog/BattleLog';
import PlayerStats from './dialog/PlayerStats';
import BattleActions from './dialog/BattleActions';
import SkillsList from './dialog/SkillsList';
import ItemsList from './dialog/ItemsList';
import BattleResult from './dialog/BattleResult';
import EnemyTurn from './dialog/EnemyTurn';

type BattleDialogContentProps = {
  battleState: BattleState;
  fightResult: { enemy: Enemy | null; won: boolean | null } | null;
  handleCloseDialog: () => void;
};

const BattleDialogContent = ({ battleState, fightResult, handleCloseDialog }: BattleDialogContentProps) => {
  const { useSkill, fleeFromBattle, skills, useItemInBattle } = useBattle();
  const { inventory, setInventory } = useItems();
  const [showSkills, setShowSkills] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [showForms, setShowForms] = useState(false);

  const handleAttackClick = () => {
    setShowSkills(true);
    setShowItems(false);
    setShowForms(false);
  };

  const handleItemsClick = () => {
    setShowItems(true);
    setShowSkills(false);
    setShowForms(false);
  };

  const handleFormsClick = () => {
    setShowForms(true);
    setShowItems(false);
    setShowSkills(false);
  };

  const handleSkillClick = (skill: Skill) => {
    useSkill(skill);
    setShowSkills(false);
  };

  const handleFormClick = (form: Skill) => {
    useSkill(form);
    setShowForms(false);
  };

  const handleItemClick = (itemId: string) => {
    useItemInBattle(itemId, inventory, setInventory);
    setShowItems(false);
  };

  const handleFleeClick = () => {
    fleeFromBattle();
  };

  const usableItems = inventory.filter(item => item.usableInBattle);
  const availableSkills = skills.filter(skill => skill.purchased && skill.type !== 'form');
  const formSkills = skills.filter(skill => skill.purchased && skill.type === 'form');

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {!battleState.inProgress ? (fightResult?.won === true ? 'Victory!' : fightResult?.won === false ? 'Defeat!' : 'Battle') : 'Battle'}
        </DialogTitle>
        <DialogDescription>
          {battleState.inProgress ? 
            `Fighting against ${battleState.enemy?.name}!` : 
            fightResult?.enemy ? `You encountered a ${fightResult.enemy.name}!` : ''}
        </DialogDescription>
      </DialogHeader>
      
      {/* Battle Interface */}
      {battleState.inProgress && battleState.enemy ? (
        <div className="flex flex-col space-y-4">
          <EnemyDisplay enemy={battleState.enemy} />
          <BattleLog log={battleState.log} />
          <PlayerStats stats={battleState.playerStats} />
          
          {battleState.playerTurn ? (
            showSkills ? (
              <SkillsList 
                skills={availableSkills} 
                onBack={() => setShowSkills(false)} 
                onSelectSkill={handleSkillClick}
                currentKi={battleState.playerStats.ki}
              />
            ) : showItems ? (
              <ItemsList 
                items={usableItems} 
                onBack={() => setShowItems(false)} 
                onSelectItem={handleItemClick} 
              />
            ) : showForms ? (
              <SkillsList 
                skills={formSkills} 
                onBack={() => setShowForms(false)} 
                onSelectSkill={handleFormClick}
                currentKi={battleState.playerStats.ki}
              />
            ) : (
              <BattleActions 
                onAttack={handleAttackClick}
                onItems={handleItemsClick}
                onForms={handleFormsClick}
                onFlee={handleFleeClick}
                playerTurn={battleState.playerTurn}
                enemyName={battleState.enemy.name}
                usableItems={usableItems}
                hasFormSkills={formSkills.length > 0}
              />
            )
          ) : (
            <EnemyTurn enemyName={battleState.enemy.name} />
          )}
        </div>
      ) : (
        <BattleResult 
          enemy={fightResult?.enemy || null}
          won={fightResult?.won || null}
          onContinue={handleCloseDialog}
        />
      )}
    </DialogContent>
  );
};

export default BattleDialogContent;
