
import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const BattleZone = () => {
  const { powerLevel, forest, fightEnemy, fightResult, clearFightResult } = useGame();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleFight = () => {
    fightEnemy();
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    clearFightResult();
    setDialogOpen(false);
  };

  return (
    <div className="bg-white/90 p-4 rounded-lg shadow-md backdrop-blur-sm border-2 border-forestGreen">
      <h2 className="text-xl font-bold text-forestGreen mb-4">Battle Zone</h2>
      
      <Card className="border-2 border-forestGreen mb-4">
        <CardHeader className="pb-2 bg-forestGreen/20">
          <CardTitle className="text-lg">Forest</CardTitle>
          <CardDescription>Battle wild creatures in the forest to test your power.</CardDescription>
        </CardHeader>
        <CardContent className="pb-2 pt-4">
          <div className="text-sm">
            <p className="mb-1">Possible Enemies:</p>
            <ul className="list-disc pl-5">
              <li>Wolf (Power Level: 5)</li>
              <li>Bandit (Power Level: 10)</li>
              <li>Bear (Power Level: 20)</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="pt-4 border-t">
          <Button 
            variant="default" 
            className="w-full bg-forestGreen hover:bg-forestGreen/80"
            onClick={handleFight}
          >
            Find an Enemy
          </Button>
        </CardFooter>
      </Card>
      
      <p className="text-sm text-center text-gray-600">Your current power level: {powerLevel}</p>

      {/* Battle Result Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {fightResult?.won ? 'Victory!' : 'Defeat!'} 
            </DialogTitle>
            <DialogDescription>
              You encountered a {fightResult?.enemy?.name}!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center p-4">
            <div className="bg-gray-100 p-4 rounded-full mb-4 w-24 h-24 flex items-center justify-center">
              {/* Would display enemy image if available */}
              <span className="text-3xl">{fightResult?.enemy?.name === 'Wolf' ? '🐺' : fightResult?.enemy?.name === 'Bandit' ? '👤' : '🐻'}</span>
            </div>
            <div className="text-center mb-4">
              <p className="font-bold text-lg">{fightResult?.enemy?.name}</p>
              <p>Power Level: {fightResult?.enemy?.power}</p>
            </div>
            <div className={`text-center p-2 rounded-md ${fightResult?.won ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} w-full`}>
              {fightResult?.won 
                ? `Your power level (${powerLevel}) was greater than the enemy's!` 
                : `Your power level (${powerLevel}) was not enough to defeat this enemy!`
              }
            </div>
          </div>
          <div className="flex justify-center">
            <Button 
              variant="default" 
              onClick={handleCloseDialog}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BattleZone;
