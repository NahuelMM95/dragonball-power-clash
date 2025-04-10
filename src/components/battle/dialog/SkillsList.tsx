
import { Button } from "@/components/ui/button";
import { Skill } from "@/types/game";

type SkillsListProps = {
  skills: Skill[];
  onBack: () => void;
  onSelectSkill: (skill: Skill) => void;
  currentKi: number;
};

const SkillsList = ({ skills, onBack, onSelectSkill, currentKi }: SkillsListProps) => {
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
      
      {skills.map((skill) => (
        <Button 
          key={skill.name}
          variant="default"
          className="w-full justify-between bg-dbRed hover:bg-dbRed/80"
          onClick={() => onSelectSkill(skill)}
          disabled={skill.kiCost > currentKi}
        >
          <span>{skill.name}</span>
          {skill.kiCost > 0 && <span className="text-xs bg-blue-500 px-2 py-0.5 rounded-full">{skill.kiCost} Ki</span>}
        </Button>
      ))}
    </div>
  );
};

export default SkillsList;
