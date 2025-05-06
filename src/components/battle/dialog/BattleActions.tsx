
import { Button } from "@/components/ui/button";
import { Sword, Shield, Pill, Zap } from "lucide-react";
import { Item, Skill } from "@/types/game";

type BattleActionsProps = {
  onAttack: () => void;
  onItems: () => void;
  onForms: () => void;
  onFlee: () => void;
  playerTurn: boolean;
  enemyName: string;
  usableItems: Item[];
  hasFormSkills: boolean;
};

const BattleActions = ({ 
  onAttack, 
  onItems, 
  onForms,
  onFlee, 
  playerTurn, 
  enemyName,
  usableItems,
  hasFormSkills
}: BattleActionsProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="grid grid-cols-2 gap-2 mb-2">
        <Button 
          variant="default" 
          onClick={onAttack}
          className="bg-dbRed hover:bg-dbRed/80"
        >
          <Sword className="mr-1 h-4 w-4" /> Attack
        </Button>
        <Button 
          variant="default" 
          onClick={onItems}
          className="bg-green-600 hover:bg-green-700"
          disabled={usableItems.length === 0}
        >
          <Pill className="mr-1 h-4 w-4" /> Items
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="default" 
          onClick={onForms}
          className="bg-yellow-600 hover:bg-yellow-700"
          disabled={!hasFormSkills}
        >
          <Zap className="mr-1 h-4 w-4" /> Forms
        </Button>
        <Button 
          variant="default" 
          onClick={onFlee} 
          className="bg-dbBlue hover:bg-dbBlue/80"
        >
          Shield <Shield className="ml-1 h-4 w-4" /> Flee
        </Button>
      </div>
      
      <div className="text-center text-sm text-gray-600">
        {playerTurn ? "Your turn" : `${enemyName}'s turn`}
      </div>
    </div>
  );
};

export default BattleActions;
