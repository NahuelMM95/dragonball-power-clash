
import { useGame } from "@/contexts/GameContext";
import { useUpgrades } from "@/contexts/UpgradeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Weight } from "lucide-react";

const TrainingGearTab = () => {
  const { zeni } = useGame();
  const { upgrades, purchaseUpgrade, equipUpgrade } = useUpgrades();
  
  // Filter upgrades to only show weighted items in the shop
  const weightedGear = upgrades.filter(upgrade => upgrade.itemType === 'weight');

  return (
    <>
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
    </>
  );
};

export default TrainingGearTab;
