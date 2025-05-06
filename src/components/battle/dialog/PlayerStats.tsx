
import { Progress } from "@/components/ui/progress";
import { CombatStats } from "@/types/game";
import { Zap } from "lucide-react";

type PlayerStatsProps = {
  stats: CombatStats;
};

const PlayerStats = ({ stats }: PlayerStatsProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span>You</span>
        <span>{stats.hp.toLocaleString('en')}/{stats.maxHp.toLocaleString('en')} HP</span>
      </div>
      <Progress value={(stats.hp / stats.maxHp) * 100} className="h-2 bg-green-200" />
      
      <div className="flex justify-between text-sm mt-2 mb-1">
        <span>Ki</span>
        <span>{stats.ki.toLocaleString('en')}/{stats.maxKi.toLocaleString('en')} Ki</span>
      </div>
      <Progress value={(stats.ki / stats.maxKi) * 100} className="h-2 bg-blue-200" />
      
      {/* Power Level Display */}
      {stats.powerLevel !== undefined && (
        <div className="flex items-center justify-between mt-2 text-sm">
          <div className="flex items-center">
            <Zap className="h-4 w-4 text-yellow-500 mr-1" />
            <span>Power Level</span>
          </div>
          <span className="font-semibold text-yellow-600">{stats.powerLevel.toLocaleString('en')}</span>
        </div>
      )}
      
      {/* Show active form if any */}
      {stats.activeForm && (
        <div className="mt-1 text-xs text-center bg-red-100 rounded-full py-1 px-2 text-red-700">
          {stats.activeForm} Active ({stats.formMultiplier}x)
        </div>
      )}
    </div>
  );
};

export default PlayerStats;
