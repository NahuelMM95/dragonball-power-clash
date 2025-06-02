
import { Enemy } from '@/types/game';
import { useSettings } from '@/hooks/useSettings';
import { abbreviateNumber } from '@/utils/numberAbbreviation';
import { Progress } from "@/components/ui/progress";
import { Image } from "lucide-react";
import { useState } from 'react';
import { PLACEHOLDER_IMAGE } from '@/data/assets';

type EnemyDisplayProps = {
  enemy: Enemy;
};

const EnemyDisplay = ({ enemy }: EnemyDisplayProps) => {
  const { settings } = useSettings();
  const healthPercentage = (enemy.hp / enemy.maxHp) * 100;
  const [imageError, setImageError] = useState(false);
  
  // Calculate remaining enemies in a group
  const getRemainingEnemies = () => {
    if (enemy.isGroup && enemy.individualHp && enemy.enemyCount) {
      // Calculate how many full enemies are still alive
      const fullEnemies = Math.ceil(enemy.hp / enemy.individualHp);
      return fullEnemies;
    }
    return 1;
  };
  
  const remainingEnemies = getRemainingEnemies();
  
  return (
    <div className="flex flex-col items-center p-4">
      <div className="bg-gray-100 p-2 rounded-lg mb-4 w-28 h-28 flex items-center justify-center overflow-hidden">
        {!imageError ? (
          <img 
            src={enemy.image} 
            alt={enemy.name} 
            className="object-contain max-w-full max-h-full"
            onError={(e) => {
              console.log(`Failed to load enemy image: ${enemy.image}`);
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loop
              target.src = PLACEHOLDER_IMAGE;
              if (target.src === PLACEHOLDER_IMAGE) {
                setImageError(true);
              }
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <Image size={32} />
            <span className="text-xs mt-1">{enemy.name}</span>
          </div>
        )}
      </div>
      <div className="text-center w-full mb-4">
        <p className="font-bold">{enemy.name}</p>
        {enemy.isGroup && (
          <p className="text-xs text-amber-600 font-semibold">
            {remainingEnemies} of {enemy.enemyCount} remaining
          </p>
        )}
        <p className="text-xs text-gray-600">Power Level: {abbreviateNumber(enemy.power, settings.numberAbbreviation)}</p>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>HP:</span>
          <span>{abbreviateNumber(enemy.hp, settings.numberAbbreviation)}/{abbreviateNumber(enemy.maxHp, settings.numberAbbreviation)}</span>
        </div>
        <Progress value={healthPercentage} color="red" className="h-2 mt-1" />
      </div>
    </div>
  );
};

export default EnemyDisplay;
