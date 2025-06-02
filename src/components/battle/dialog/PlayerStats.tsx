
import { Progress } from "@/components/ui/progress";
import { CombatStats } from "@/types/game";
import { Zap } from "lucide-react";

type PlayerStatsProps = {
  stats: CombatStats;
};

const PlayerStats = ({ stats }: PlayerStatsProps) => {
  return (
    <div className="w-full space-y-3 p-3 bg-gray-50 rounded-lg">
      <div className="text-center">
        <span className="text-xs font-bold">YOU</span>
      </div>
      
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span>HP</span>
          <span>{stats.hp.toLocaleString('en')}/{stats.maxHp.toLocaleString('en')}</span>
        </div>
        <Progress value={(stats.hp / stats.maxHp) * 100} color="red" className="h-3" />
      </div>
      
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span>Ki</span>
          <span>{stats.ki.toLocaleString('en')}/{stats.maxKi.toLocaleString('en')}</span>
        </div>
        <Progress value={(stats.ki / stats.maxKi) * 100} color="blue" className="h-3" />
      </div>
      
      {stats.powerLevel !== undefined && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center">
            <Zap className="h-3 w-3 text-yellow-500 mr-1" />
            <span>Power Level</span>
          </div>
          <span className="font-bold text-yellow-600">{stats.powerLevel.toLocaleString('en')}</span>
        </div>
      )}
      
      {stats.activeForm && (
        <div className="text-xs text-center bg-red-100 rounded-full py-1 px-2 text-red-700">
          {stats.activeForm} Active ({stats.formMultiplier}x)
        </div>
      )}
    </div>
  );
};

export default PlayerStats;
