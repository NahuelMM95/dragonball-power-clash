
import { Progress } from "@/components/ui/progress";
import { Enemy } from "@/types/game";

type EnemyDisplayProps = {
  enemy: Enemy;
};

const EnemyDisplay = ({ enemy }: EnemyDisplayProps) => {
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
    <div className="flex flex-col items-center p-2">
      <div className="bg-gray-100 p-4 rounded-full mb-2 w-16 h-16 flex items-center justify-center">
        <span className="text-2xl">
          {getEnemyEmoji(enemy.name)}
        </span>
      </div>
      <div className="w-full">
        <div className="flex justify-between text-sm mb-1">
          <span>{enemy.name}</span>
          <span>{enemy.hp}/{enemy.maxHp} HP</span>
        </div>
        <Progress value={(enemy.hp / enemy.maxHp) * 100} className="h-2 bg-red-200" />
      </div>
    </div>
  );
};

export default EnemyDisplay;
