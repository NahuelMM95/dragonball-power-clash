
import { useGame } from "@/contexts/GameContext";
import { useItems } from "@/contexts/ItemContext";
import { useSettings } from "@/hooks/useSettings";
import { abbreviateNumber } from "@/utils/numberAbbreviation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "lucide-react";

const ItemsTab = () => {
  const { zeni } = useGame();
  const { purchaseItem } = useItems();
  const { settings } = useSettings();

  return (
    <>
      <h3 className="text-sm font-semibold text-green-700 mb-3">Battle Items</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl mx-auto">
        <Card className="border-2 border-green-200">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Pill className="mr-2 h-4 w-4 text-green-500" />
              <CardTitle className="text-sm">Senzu Bean</CardTitle>
            </div>
            <CardDescription className="text-xs leading-relaxed">A magical bean that restores your health completely during battle.</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-xs">Effect: <span className="font-semibold text-green-600">Full HP Recovery</span></p>
            <p className="text-xs mt-1">Cost: <span className="font-semibold text-yellow-600">{abbreviateNumber(50000, settings.numberAbbreviation)} Zeni</span></p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              variant="default" 
              className="w-full bg-green-600 hover:bg-green-700 text-xs h-8"
              disabled={zeni < 50000}
              onClick={() => purchaseItem('senzu')}
            >
              Purchase
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default ItemsTab;
