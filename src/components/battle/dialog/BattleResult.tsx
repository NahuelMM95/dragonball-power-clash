
import { Button } from "@/components/ui/button";
import { Enemy } from "@/types/game";
import { ImageOff } from "lucide-react";

type BattleResultProps = {
  enemy: Enemy | null;
  won: boolean | null;
  onContinue: () => void;
};

const BattleResult = ({ enemy, won, onContinue }: BattleResultProps) => {
  return (
    <div className="flex flex-col items-center p-4">
      <div className="bg-gray-100 p-4 rounded-full mb-4 w-24 h-24 flex items-center justify-center overflow-hidden">
        {enemy ? (
          <img 
            src={enemy.image} 
            alt={enemy.name} 
            className="object-contain max-w-full max-h-full"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              console.log(`Failed to load image: ${enemy.image}`);
              target.src = "/placeholder.svg";
            }}
          />
        ) : (
          <span className="text-3xl">❓</span>
        )}
      </div>
      <div className="text-center mb-4">
        <p className="font-bold text-lg">{enemy?.name}</p>
        <p>Power Level: {enemy?.power}</p>
      </div>
      {won !== null && (
        <div className={`text-center p-2 rounded-md ${won ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} w-full`}>
          {won 
            ? `Victory! You defeated the ${enemy?.name}!` 
            : `Defeat! The ${enemy?.name} was too strong!`
          }
        </div>
      )}
      <div className="flex justify-center mt-4">
        <Button 
          variant="default" 
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default BattleResult;
