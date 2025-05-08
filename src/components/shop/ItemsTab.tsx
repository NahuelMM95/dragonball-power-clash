
import { useGame } from "@/contexts/GameContext";
import { useItems } from "@/contexts/ItemContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "lucide-react";

const ItemsTab = () => {
  const { zeni } = useGame();
  const { purchaseItem } = useItems();

  return (
    <>
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
    </>
  );
};

export default ItemsTab;
