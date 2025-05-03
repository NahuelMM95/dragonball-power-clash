
import { Enemy } from '@/types/game';
import { Progress } from "@/components/ui/progress";
import { ImageOff } from "lucide-react";

type EnemyDisplayProps = {
  enemy: Enemy;
};

const EnemyDisplay = ({ enemy }: EnemyDisplayProps) => {
  const healthPercentage = (enemy.hp / enemy.maxHp) * 100;
  
  return (
    <div className="flex flex-col items-center p-4">
      <div className="bg-gray-100 p-2 rounded-lg mb-4 w-28 h-28 flex items-center justify-center overflow-hidden">
        <img 
          src={enemy.image} 
          alt={enemy.name} 
          className="object-contain max-w-full max-h-full"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            console.log(`Failed to load image: ${enemy.image}`);
            target.src = "/placeholder.svg";
          }}
        />
      </div>
      <div className="text-center w-full mb-4">
        <p className="font-bold">{enemy.name}</p>
        <p className="text-xs text-gray-600">Power Level: {enemy.power}</p>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>HP:</span>
          <span>{enemy.hp}/{enemy.maxHp}</span>
        </div>
        <Progress value={healthPercentage} className="h-2 mt-1" />
      </div>
    </div>
  );
};

export default EnemyDisplay;
