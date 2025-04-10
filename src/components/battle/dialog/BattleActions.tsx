
import { Button } from "@/components/ui/button";
import { Sword, Shield, Pill } from "lucide-react";
import { Item, Skill } from "@/types/game";

type BattleActionsProps = {
  onAttack: () => void;
  onItems: () => void;
  onFlee: () => void;
  playerTurn: boolean;
  enemyName: string;
  usableItems: Item[];
};

const BattleActions = ({ 
  onAttack, 
  onItems, 
  onFlee, 
  playerTurn, 
  enemyName,
  usableItems
}: BattleActionsProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="grid grid-cols-3 gap-2">
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
