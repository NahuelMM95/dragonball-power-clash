
import { useLocalStorage } from './useLocalStorage';
import { toast } from "sonner";
import { playerSkills } from '@/data/skills';
import { Skill } from '@/types/game';

export const useSkillManagement = () => {
  const [skills, setSkills] = useLocalStorage('dbSkills', playerSkills);
  
  const purchaseSkill = (skillName: string) => {
    const skill = skills.find(s => s.name === skillName);
    if (!skill || skill.purchased) return;

    setSkills(skills.map(s => (s.name === skillName ? { ...s, purchased: true } : s)));
    
    toast(`You've learned ${skill.name}!`, {
      description: "You can now use this skill in battle.",
      duration: 3000,
    });
    
    return skill.cost || 0;
  };
  
  return {
    skills,
    setSkills,
    purchaseSkill
  };
};
