
import { Button } from "@/components/ui/button";
import { Skill } from "@/types/game";
import { useSettings } from "@/hooks/useSettings";
import { abbreviateNumber } from "@/utils/numberAbbreviation";

type SkillsListProps = {
  skills: Skill[];
  onBack: () => void;
  onSelectSkill: (skill: Skill) => void;
  currentKi: number;
  maxKi: number;
};

const SkillsList = ({ skills, onBack, onSelectSkill, currentKi, maxKi }: SkillsListProps) => {
  const { settings } = useSettings();

  const calculateKiCost = (skill: Skill) => {
    const baseKiCost = skill.kiCost || 0;
    const percentKiCost = skill.kiCostPercent ? Math.floor((skill.kiCostPercent / 100) * maxKi) : 0;
    return baseKiCost + percentKiCost;
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">Skills</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onBack}
        >
          Back
        </Button>
      </div>
      
      {skills.map((skill) => {
        const totalKiCost = calculateKiCost(skill);
        return (
          <Button 
            key={skill.name}
            variant="default"
            className="w-full justify-between bg-dbRed hover:bg-dbRed/80"
            onClick={() => onSelectSkill(skill)}
            disabled={totalKiCost > currentKi}
          >
            <span>{skill.name}</span>
            {totalKiCost > 0 && (
              <span className="text-xs bg-blue-500 px-2 py-0.5 rounded-full">
                {abbreviateNumber(totalKiCost, settings.numberAbbreviation)} Ki
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default SkillsList;
