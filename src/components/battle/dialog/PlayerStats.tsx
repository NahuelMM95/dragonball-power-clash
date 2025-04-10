
import { Progress } from "@/components/ui/progress";
import { CombatStats } from "@/types/game";

type PlayerStatsProps = {
  stats: CombatStats;
};

const PlayerStats = ({ stats }: PlayerStatsProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span>You</span>
        <span>{stats.hp}/{stats.maxHp} HP</span>
      </div>
      <Progress value={(stats.hp / stats.maxHp) * 100} className="h-2 bg-green-200" />
      
      <div className="flex justify-between text-sm mt-2 mb-1">
        <span>Ki</span>
        <span>{stats.ki}/{stats.maxKi} Ki</span>
      </div>
      <Progress value={(stats.ki / stats.maxKi) * 100} className="h-2 bg-blue-200" />
    </div>
  );
};

export default PlayerStats;
