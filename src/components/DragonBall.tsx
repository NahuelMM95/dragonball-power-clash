
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

  // Filter training exercises (non-weighted items)
  const trainingExercises = upgrades.filter(upgrade => !upgrade.itemType);

  // Calculate current power gain and chance
  const powerGain = (() => {
    if (!equippedUpgrade) return 1;
    const upgrade = upgrades.find(u => u.id === equippedUpgrade);
    return upgrade ? upgrade.powerBonus : 1;
  })();

  // Calculate chance based on equipped items
  const baseChance = 20; // Base 20% chance
  const hasWeightedClothes = equippedItems.some(
    item => item.effect?.type === 'power_gain_chance_increase'
  );
  const totalChance = hasWeightedClothes ? baseChance + 5 : baseChance; // +5% from weighted clothes

  const handleClick = () => {
    increaseClicks();
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 100);
  };

  console.log('DragonBall - settings.numberAbbreviation:', settings.numberAbbreviation);
  console.log('DragonBall - clicks:', clicks);
  console.log('DragonBall - formatted clicks:', abbreviateNumber(clicks, settings.numberAbbreviation));

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`cursor-pointer mb-4 ${isClicking ? 'animate-shake' : 'animate-float'}`} 
        onClick={handleClick}
      >
        <div className="relative">
          <div className="dumbbell-item w-40 h-40 rounded-full bg-dbBlue animate-pulse-glow flex items-center justify-center">
            <Dumbbell className="text-white w-24 h-24 pointer-events-none" />
          </div>
        </div>
      </div>
      <p className="text-lg font-semibold">Clicks: {abbreviateNumber(clicks, settings.numberAbbreviation)}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Every 100 clicks = {totalChance}% chance of +{abbreviateNumber(powerGain, settings.numberAbbreviation)} Power Level
      </p>
      
      <Dialog open={isTrainingDialogOpen} onOpenChange={setIsTrainingDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-orange-100 border-orange-300 hover:bg-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-600 dark:hover:bg-orange-900/40 dark:text-orange-300"
          >
            Select Training
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-dbBlue dark:text-dbBlue text-xl font-bold mb-2">Select Training Method</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-6 mt-4">
            {trainingExercises.map((exercise) => (
              <Card 
                key={exercise.id} 
                className={`border-2 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 ${equippedUpgrade === exercise.id ? 'border-dragonOrange bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                onClick={() => {
                  equipUpgrade(exercise.id);
                  setIsTrainingDialogOpen(false);
                }}
              >
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg dark:text-gray-200">{exercise.name}</CardTitle>
                    {equippedUpgrade === exercise.id && (
                      <div className="text-sm font-bold text-dragonOrange">Selected</div>
                    )}
                  </div>
                  <CardDescription className="mt-1 dark:text-gray-400">{exercise.description}</CardDescription>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-sm dark:text-gray-300"><span className="font-semibold text-dbBlue">+{exercise.powerBonus}</span> Power Level gain</p>
                  {!exercise.purchased ? (
                    <p className="text-sm text-dbRed mt-2">
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
