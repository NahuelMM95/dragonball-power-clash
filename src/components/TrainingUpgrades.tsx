
import { useGame } from '@/contexts/GameContext';
import { useUpgrades } from '@/contexts/UpgradeContext';
import { useBattle } from '@/contexts/BattleContext';
import { useItems } from '@/contexts/ItemContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Zap, Pill, Weight } from "lucide-react";

const TrainingUpgrades = () => {
  const { powerLevel, zeni } = useGame();
  const { upgrades, equippedUpgrade, purchaseUpgrade, equipUpgrade } = useUpgrades();
  const { skills, purchaseSkill } = useBattle();
  const { purchaseItem } = useItems();

  // Filter upgrades to only show weighted items in the shop
  const weightedGear = upgrades.filter(upgrade => upgrade.itemType === 'weight');

  return (
    <div className="bg-white/90 p-4 rounded-lg shadow-md backdrop-blur-sm border-2 border-dbBlue">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-dbBlue">Shop</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-600">
          <span className="text-yellow-500 font-bold">₽</span> {zeni.toLocaleString('en')} Zeni
        </Badge>
      </div>
      
      <Tabs defaultValue="training-gear">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="training-gear">Training Gear</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="training-gear" className="mt-1">
          <h3 className="text-lg font-semibold text-dbBlue mb-3">Training Gear Shop</h3>
          <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
            {weightedGear.map((upgrade) => (
              <Card key={upgrade.id} className="border-2 border-gray-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Weight className="mr-2 h-5 w-5 text-gray-600" />
                      <CardTitle className="text-lg">{upgrade.name}</CardTitle>
                    </div>
                    {upgrade.purchased && (
                      <Badge variant="outline" className="ml-2">
                        Purchased
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{upgrade.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm"><span className="font-semibold text-dbBlue">+5%</span> Power Level gain chance</p>
                  {!upgrade.purchased && (
                    <p className="text-sm">Cost: {" "}
                      <span className="font-semibold text-yellow-600">{upgrade.cost.toLocaleString('en')} Zeni</span>
                    </p>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  {!upgrade.purchased ? (
                    <Button 
                      variant="default" 
                      className="w-full bg-dbBlue hover:bg-dbBlue/80"
                      disabled={zeni < upgrade.cost}
                      onClick={() => purchaseUpgrade(upgrade.id)}
                    >
                      Purchase
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      className="w-full bg-dragonOrange hover:bg-dragonOrange/80"
                      onClick={() => equipUpgrade(upgrade.id)}
                    >
                      Equip
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="skills" className="mt-1">
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
        </TabsContent>
        
        <TabsContent value="items" className="mt-1">
          <h3 className="text-lg font-semibold text-green-700 mb-3">Battle Items</h3>
          <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-2 border-green-200">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Pill className="mr-2 h-5 w-5 text-green-500" />
                  <CardTitle className="text-lg">Senzu Bean</CardTitle>
                </div>
                <CardDescription>A magical bean that restores your health completely during battle.</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">Effect: <span className="font-semibold text-green-600">Full HP Recovery</span></p>
                <p className="text-sm mt-1">Cost: <span className="font-semibold text-yellow-600">50,000 Zeni</span></p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  variant="default" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={zeni < 50000}
                  onClick={() => purchaseItem('senzu')}
                >
                  Purchase
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingUpgrades;
