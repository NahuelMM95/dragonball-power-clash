
import { useGame } from '@/contexts/GameContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TrainingUpgrades = () => {
  const { upgrades, equippedUpgrade, powerLevel, purchaseUpgrade, equipUpgrade } = useGame();

  return (
    <div className="bg-white/90 p-4 rounded-lg shadow-md backdrop-blur-sm border-2 border-dbBlue">
      <h2 className="text-xl font-bold text-dbBlue mb-4">Training Room</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {upgrades.map((upgrade) => (
          <Card key={upgrade.id} className={`border-2 ${equippedUpgrade === upgrade.id ? 'border-dragonOrange bg-amber-50' : 'border-gray-200'}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{upgrade.name}</CardTitle>
                {upgrade.purchased && (
                  <Badge variant={equippedUpgrade === upgrade.id ? "default" : "outline"} className="ml-2">
                    {equippedUpgrade === upgrade.id ? "Equipped" : "Purchased"}
                  </Badge>
                )}
              </div>
              <CardDescription>{upgrade.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm"><span className="font-semibold text-dbBlue">+{upgrade.powerBonus}</span> Power Level gain</p>
              {!upgrade.purchased && (
                <p className="text-sm">Cost: <span className="font-semibold text-dbRed">{upgrade.cost}</span> Power Levels</p>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              {!upgrade.purchased ? (
                <Button 
                  variant="default" 
                  className="w-full bg-dbBlue hover:bg-dbBlue/80"
                  disabled={powerLevel < upgrade.cost}
                  onClick={() => purchaseUpgrade(upgrade.id)}
                >
                  Purchase
                </Button>
              ) : equippedUpgrade !== upgrade.id ? (
                <Button 
                  variant="default" 
                  className="w-full bg-dragonOrange hover:bg-dragonOrange/80"
                  onClick={() => equipUpgrade(upgrade.id)}
                >
                  Equip
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled
                >
                  Currently Equipped
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrainingUpgrades;
