
import { useGame } from "@/contexts/GameContext";
import { useBattle } from "@/contexts/BattleContext";
import { useSettings } from "@/hooks/useSettings";
import { abbreviateNumber } from "@/utils/numberAbbreviation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

const SkillsTab = () => {
  const { powerLevel, zeni } = useGame();
  const { skills, purchaseSkill } = useBattle();
  const { settings } = useSettings();

  return (
    <>
      <h3 className="text-sm font-semibold text-purple-700 mb-3">Combat Skills</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl mx-auto">
        {skills.map((skill) => (
          <Card key={skill.name} className={`border-2 ${skill.purchased ? 'border-purple-300 bg-purple-50' : 'border-gray-200'}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center flex-1">
                  {skill.name === 'Ki Blast' && <Zap className="mr-2 h-4 w-4 text-yellow-500" />}
                  <CardTitle className="text-sm">{skill.name}</CardTitle>
                </div>
                {skill.purchased && (
                  <Badge variant="outline" className="text-xs px-1 py-0 bg-purple-100 text-purple-800 border-purple-300">
                    Learned
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs leading-relaxed">{skill.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex justify-between text-xs">
                <span>Damage: <span className="font-semibold text-dbRed">x{skill.damageMultiplier}</span></span>
                <span>Ki Cost: <span className="font-semibold text-blue-600">{abbreviateNumber(skill.kiCost, settings.numberAbbreviation)}</span></span>
              </div>
              {!skill.purchased && (
                <div className="mt-2">
                  {skill.powerRequirement ? (
                    <p className="text-xs">Requires: <span className="font-semibold text-dbRed">{abbreviateNumber(skill.powerRequirement, settings.numberAbbreviation)} Power Level</span></p>
                  ) : (
                    <p className="text-xs">Cost: <span className="font-semibold text-yellow-600">{abbreviateNumber(skill.cost || 0, settings.numberAbbreviation)} Zeni</span></p>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              {!skill.purchased ? (
                <Button 
                  variant="default" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-xs h-8"
                  disabled={
                    (skill.powerRequirement && powerLevel < skill.powerRequirement) ||
                    (!skill.powerRequirement && skill.cost && zeni < (skill.cost || 0))
                  }
                  onClick={() => purchaseSkill(skill.name)}
                >
                  Learn Skill
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full text-xs h-8"
                  disabled
                >
                  Already Learned
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};

export default SkillsTab;
