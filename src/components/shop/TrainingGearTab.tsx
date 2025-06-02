
import { useGame } from "@/contexts/GameContext";
import { useUpgrades } from "@/contexts/UpgradeContext";
import { useItems } from "@/contexts/ItemContext";
import { useSettings } from "@/hooks/useSettings";
import { abbreviateNumber } from "@/utils/numberAbbreviation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Weight } from "lucide-react";

const TrainingGearTab = () => {
  const { zeni } = useGame();
  const { upgrades, purchaseUpgrade } = useUpgrades();
  const { equippedItems, equipItem } = useItems();
  const { settings } = useSettings();
  
  // Filter upgrades to only show weighted items in the shop
  const weightedGear = upgrades.filter(upgrade => upgrade.itemType === 'weight');
  
  // Check if weighted clothes are equipped
  const isWeightedClothesEquipped = equippedItems.some(item => item.slot === 'weight');

  const handlePurchaseAndEquip = (upgradeId: string) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade || upgrade.purchased) return;

    if (zeni < upgrade.cost) return;

    // Purchase the upgrade (this will add the item to inventory)
    purchaseUpgrade(upgradeId);
    
    // Automatically equip the weighted item
    equipItem(`weight-${upgradeId}`, 'weight');
  };

  const handleEquip = (upgradeId: string) => {
    equipItem(`weight-${upgradeId}`, 'weight');
  };

  return (
    <>
      <h3 className="text-sm font-semibold text-dbBlue mb-3">Training Gear Shop</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl mx-auto">
        {weightedGear.map((upgrade) => (
          <Card key={upgrade.id} className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center flex-1">
                  <Weight className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <CardTitle className="text-sm dark:text-gray-200">{upgrade.name}</CardTitle>
                </div>
                <div className="flex flex-col gap-1">
                  {upgrade.purchased && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      Purchased
                    </Badge>
                  )}
                  {upgrade.purchased && isWeightedClothesEquipped && (
                    <Badge variant="default" className="text-xs px-1 py-0 bg-green-600">
                      Equipped
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription className="dark:text-gray-400 text-xs leading-relaxed">{upgrade.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-xs dark:text-gray-300"><span className="font-semibold text-dbBlue">+5%</span> Power Level gain chance</p>
              {!upgrade.purchased && (
                <p className="text-xs dark:text-gray-300">Cost: {" "}
                  <span className="font-semibold text-yellow-600">{abbreviateNumber(upgrade.cost, settings.numberAbbreviation)} Zeni</span>
                </p>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              {!upgrade.purchased ? (
                <Button 
                  variant="default" 
                  className="w-full bg-dbBlue hover:bg-dbBlue/80 text-xs h-8"
                  disabled={zeni < upgrade.cost}
                  onClick={() => handlePurchaseAndEquip(upgrade.id)}
                >
                  Purchase & Equip
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  className="w-full bg-green-600 hover:bg-green-700 text-xs h-8"
                  onClick={() => handleEquip(upgrade.id)}
                  disabled={isWeightedClothesEquipped}
                >
                  {isWeightedClothesEquipped ? 'Equipped' : 'Equip'}
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
