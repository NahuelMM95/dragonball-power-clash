
import { useGame } from "@/contexts/GameContext";
import { useBattle } from "@/contexts/BattleContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

const SkillsTab = () => {
  const { powerLevel, zeni } = useGame();
  const { skills, purchaseSkill } = useBattle();

  return (
    <>
      <h3 className="text-lg font-semibold text-purple-700 mb-3">Combat Skills</h3>
      <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
        {skills.map((skill) => (
          <Card key={skill.name} className={`border-2 ${skill.purchased ? 'border-purple-300 bg-purple-50' : 'border-gray-200'}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {skill.name === 'Ki Blast' && <Zap className="mr-2 h-5 w-5 text-yellow-500" />}
                  <CardTitle className="text-lg">{skill.name}</CardTitle>
                </div>
                {skill.purchased && (
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                    Learned
                  </Badge>
                )}
              </div>
              <CardDescription>{skill.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex justify-between text-sm">
                <span>Damage: <span className="font-semibold text-dbRed">x{skill.damageMultiplier}</span></span>
                <span>Ki Cost: <span className="font-semibold text-blue-600">{skill.kiCost}</span></span>
              </div>
              {!skill.purchased && (
                <div className="mt-2">
                  {skill.powerRequirement ? (
                    <p className="text-sm">Requires: <span className="font-semibold text-dbRed">{skill.powerRequirement.toLocaleString('en')} Power Level</span></p>
                  ) : (
                    <p className="text-sm">Cost: <span className="font-semibold text-yellow-600">{(skill.cost || 0).toLocaleString('en')} Zeni</span></p>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              {!skill.purchased ? (
                <Button 
                  variant="default" 
                  className="w-full bg-purple-600 hover:bg-purple-700"
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
                  className="w-full"
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
