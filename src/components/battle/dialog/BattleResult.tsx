
import { Button } from "@/components/ui/button";
import { Enemy } from "@/types/game";
import { Image } from "lucide-react";
import { useState } from "react";
import { PLACEHOLDER_IMAGE } from '@/data/assets';

type BattleResultProps = {
  enemy: Enemy | null;
  won: boolean | null;
  onContinue: () => void;
};

const BattleResult = ({ enemy, won, onContinue }: BattleResultProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="bg-gray-100 p-4 rounded-full mb-4 w-24 h-24 flex items-center justify-center overflow-hidden">
        {enemy && !imageError ? (
          <img 
            src={enemy.image} 
            alt={enemy.name} 
            className="object-contain max-w-full max-h-full"
            onError={(e) => {
              console.log(`Failed to load enemy image in result: ${enemy.image}`);
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loop
              target.src = PLACEHOLDER_IMAGE;
              if (target.src === PLACEHOLDER_IMAGE) {
                setImageError(true);
              }
            }}
          />
        ) : enemy && imageError ? (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <Image size={24} />
          </div>
        ) : (
          <span className="text-3xl">❓</span>
        )}
      </div>
      <div className="text-center mb-4">
        <p className="font-bold text-lg">{enemy?.name}</p>
        <p>Power Level: {enemy?.power?.toLocaleString('en') || 0}</p>
        {enemy?.isGroup && (
          <p className="text-xs text-amber-600">
            Group of {enemy.enemyCount} enemies
          </p>
        )}
      </div>
      {won !== null && (
        <div className={`text-center p-2 rounded-md ${won ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} w-full`}>
          {won 
            ? `Victory! You defeated ${enemy?.isGroup ? 'the group of ' + enemy?.enemyCount + ' ' + enemy?.name : 'the ' + enemy?.name}!` 
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
