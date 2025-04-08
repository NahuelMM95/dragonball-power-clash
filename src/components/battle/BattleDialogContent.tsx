
import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Sword, Shield, Pill } from "lucide-react";
import { BattleState, Enemy, Item, Skill } from '@/types/game';

type BattleDialogContentProps = {
  battleState: BattleState;
  fightResult: { enemy: Enemy | null; won: boolean | null } | null;
  handleCloseDialog: () => void;
};

const BattleDialogContent = ({ battleState, fightResult, handleCloseDialog }: BattleDialogContentProps) => {
  const { useSkill, fleeFromBattle, inventory, useItemInBattle, skills } = useGame();
  const [showSkills, setShowSkills] = useState(false);
  const [showItems, setShowItems] = useState(false);

  const handleAttackClick = () => {
    setShowSkills(true);
    setShowItems(false);
  };

  const handleItemsClick = () => {
    setShowItems(true);
    setShowSkills(false);
  };

  const handleSkillClick = (skill: Skill) => {
    useSkill(skill);
    setShowSkills(false);
  };

  const handleItemClick = (itemId: string) => {
    useItemInBattle(itemId);
    setShowItems(false);
  };

  const handleFleeClick = () => {
    fleeFromBattle();
  };

  const usableItems = inventory.filter(item => item.usableInBattle);
  const availableSkills = skills.filter(skill => skill.purchased);
  
  const getEnemyEmoji = (name: string) => {
    switch (name) {
      case 'Wolf': return '🐺';
      case 'Bandit': return '👤';
      case 'Bear': return '🐻';
      case 'Yamcha': return '👨';
      case 'T-Rex': return '🦖';
      default: return '❓';
    }
  };

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
          {/* Enemy Info */}
          <div className="flex flex-col items-center p-2">
            <div className="bg-gray-100 p-4 rounded-full mb-2 w-16 h-16 flex items-center justify-center">
              <span className="text-2xl">
                {getEnemyEmoji(battleState.enemy.name)}
              </span>
            </div>
            <div className="w-full">
              <div className="flex justify-between text-sm mb-1">
                <span>{battleState.enemy.name}</span>
                <span>{battleState.enemy.hp}/{battleState.enemy.maxHp} HP</span>
              </div>
              <Progress value={(battleState.enemy.hp / battleState.enemy.maxHp) * 100} className="h-2 bg-red-200" />
            </div>
          </div>
          
          {/* Battle Log */}
          <div className="bg-gray-100 p-2 rounded-md h-28 overflow-y-auto text-sm">
            {battleState.log.map((entry, i) => (
              <p key={i} className={i === battleState.log.length - 1 ? "font-bold" : ""}>{entry}</p>
            ))}
          </div>
          
          {/* Player Info */}
          <div className="w-full">
            <div className="flex justify-between text-sm mb-1">
              <span>You</span>
              <span>{battleState.playerStats.hp}/{battleState.playerStats.maxHp} HP</span>
            </div>
            <Progress value={(battleState.playerStats.hp / battleState.playerStats.maxHp) * 100} className="h-2 bg-green-200" />
            
            <div className="flex justify-between text-sm mt-2 mb-1">
              <span>Ki</span>
              <span>{battleState.playerStats.ki}/{battleState.playerStats.maxKi} Ki</span>
            </div>
            <Progress value={(battleState.playerStats.ki / battleState.playerStats.maxKi) * 100} className="h-2 bg-blue-200" />
          </div>
          
          {/* Battle Actions */}
          {battleState.playerTurn ? (
            <div className="flex flex-col space-y-2">
              {!showSkills && !showItems ? (
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="default" 
                    onClick={handleAttackClick}
                    className="bg-dbRed hover:bg-dbRed/80"
                  >
                    <Sword className="mr-1 h-4 w-4" /> Attack
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={handleItemsClick}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={usableItems.length === 0}
                  >
                    <Pill className="mr-1 h-4 w-4" /> Items
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={handleFleeClick} 
                    className="bg-dbBlue hover:bg-dbBlue/80"
                  >
                    Shield <Shield className="ml-1 h-4 w-4" /> Flee
                  </Button>
                </div>
              ) : showSkills ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">Skills</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowSkills(false)}
                    >
                      Back
                    </Button>
                  </div>
                  
                  {availableSkills.map((skill) => (
                    <Button 
                      key={skill.name}
                      variant="default"
                      className="w-full justify-between bg-dbRed hover:bg-dbRed/80"
                      onClick={() => handleSkillClick(skill)}
                      disabled={skill.kiCost > battleState.playerStats.ki}
                    >
                      <span>{skill.name}</span>
                      {skill.kiCost > 0 && <span className="text-xs bg-blue-500 px-2 py-0.5 rounded-full">{skill.kiCost} Ki</span>}
                    </Button>
                  ))}
                </div>
              ) : showItems ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">Items</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowItems(false)}
                    >
                      Back
                    </Button>
                  </div>
                  
                  {usableItems.map((item) => (
                    <Button 
                      key={item.id}
                      variant="default"
                      className="w-full justify-between bg-green-600 hover:bg-green-700"
                      onClick={() => handleItemClick(item.id)}
                    >
                      <div className="flex items-center">
                        <Pill className="mr-2 h-4 w-4" />
                        <span>{item.name}</span>
                      </div>
                      <span className="text-xs bg-green-500 px-2 py-0.5 rounded-full">Use</span>
                    </Button>
                  ))}
                </div>
              ) : null}
              
              <div className="text-center text-sm text-gray-600">
                {battleState.playerTurn ? "Your turn" : `${battleState.enemy.name}'s turn`}
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="text-center text-sm text-gray-600 animate-pulse">
                {`${battleState.enemy.name}'s turn...`}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center p-4">
          <div className="bg-gray-100 p-4 rounded-full mb-4 w-24 h-24 flex items-center justify-center">
            <span className="text-3xl">
              {fightResult?.enemy ? getEnemyEmoji(fightResult.enemy.name) : '❓'}
            </span>
          </div>
          <div className="text-center mb-4">
            <p className="font-bold text-lg">{fightResult?.enemy?.name}</p>
            <p>Power Level: {fightResult?.enemy?.power}</p>
          </div>
          {fightResult?.won !== null && (
            <div className={`text-center p-2 rounded-md ${fightResult?.won ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} w-full`}>
              {fightResult?.won 
                ? `Victory! You defeated the ${fightResult?.enemy?.name}!` 
                : `Defeat! The ${fightResult?.enemy?.name} was too strong!`
              }
            </div>
          )}
        </div>
      )}
      
      {/* Continue Button (only shown when battle is not in progress) */}
      {!battleState.inProgress && (
        <div className="flex justify-center">
          <Button 
            variant="default" 
            onClick={handleCloseDialog}
          >
            Continue
          </Button>
        </div>
      )}
    </DialogContent>
  );
};

export default BattleDialogContent;
