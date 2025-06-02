
import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useUpgrades } from '@/contexts/UpgradeContext';
import { useItems } from '@/contexts/ItemContext';
import { useSettings } from '@/hooks/useSettings';
import { abbreviateNumber } from '@/utils/numberAbbreviation';
import { Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const DragonBall = () => {
  const { increaseClicks, clicks } = useGame();
  const { upgrades, equippedUpgrade, equipUpgrade } = useUpgrades();
  const { equippedItems } = useItems();
  const { settings } = useSettings();
  const [isClicking, setIsClicking] = useState(false);
  const [isTrainingDialogOpen, setIsTrainingDialogOpen] = useState(false);

  const trainingExercises = upgrades.filter(upgrade => !upgrade.itemType);

  const powerGain = (() => {
    if (!equippedUpgrade) return 1;
    const upgrade = upgrades.find(u => u.id === equippedUpgrade);
    return upgrade ? upgrade.powerBonus : 1;
  })();

  const baseChance = 20;
  const hasWeightedClothes = equippedItems.some(
    item => item.effect?.type === 'power_gain_chance_increase'
  );
  const totalChance = hasWeightedClothes ? baseChance + 5 : baseChance;

  const handleClick = () => {
    increaseClicks();
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 100);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div 
        className={`cursor-pointer ${isClicking ? 'animate-shake' : 'animate-float'}`} 
        onClick={handleClick}
      >
        <div className="relative">
          <div className="dumbbell-item w-32 h-32 rounded-full bg-dbBlue animate-pulse-glow flex items-center justify-center shadow-lg">
            <Dumbbell className="text-white w-20 h-20 pointer-events-none" />
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-sm font-bold">
          Clicks: {abbreviateNumber(clicks, settings.numberAbbreviation)}
        </p>
        <p className="text-xs text-gray-600 max-w-xs text-center">
          Every 100 clicks = {totalChance}% chance of +{abbreviateNumber(powerGain, settings.numberAbbreviation)} Power Level
        </p>
      </div>
      
      <Dialog open={isTrainingDialogOpen} onOpenChange={setIsTrainingDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-orange-100 border-orange-300 hover:bg-orange-200 text-orange-800 text-xs"
          >
            Select Training
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-dbBlue text-sm font-bold mb-2">Select Training Method</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 mt-4">
            {trainingExercises.map((exercise) => (
              <Card 
                key={exercise.id} 
                className={`border-2 cursor-pointer hover:bg-orange-50 text-xs ${equippedUpgrade === exercise.id ? 'border-dragonOrange bg-amber-50' : 'border-gray-200'}`}
                onClick={() => {
                  equipUpgrade(exercise.id);
                  setIsTrainingDialogOpen(false);
                }}
              >
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{exercise.name}</CardTitle>
                    {equippedUpgrade === exercise.id && (
                      <div className="text-xs font-bold text-dragonOrange">Selected</div>
                    )}
                  </div>
                  <CardDescription className="mt-1 text-xs">{exercise.description}</CardDescription>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-xs">
                    <span className="font-bold text-dbBlue">+{exercise.powerBonus}</span> Power Level gain
                  </p>
                  {!exercise.purchased ? (
                    <p className="text-xs text-dbRed mt-1">
                      Requires: {exercise.powerRequirement || exercise.cost} Power Level
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DragonBall;
