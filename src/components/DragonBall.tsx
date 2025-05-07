
import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useUpgrades } from '@/contexts/UpgradeContext';
import { Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const DragonBall = () => {
  const { increaseClicks, clicks } = useGame();
  const { upgrades, equippedUpgrade, equipUpgrade } = useUpgrades();
  const [isClicking, setIsClicking] = useState(false);
  const [isTrainingDialogOpen, setIsTrainingDialogOpen] = useState(false);

  // Filter training exercises (non-weighted items)
  const trainingExercises = upgrades.filter(upgrade => !upgrade.itemType);

  const handleClick = () => {
    increaseClicks();
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 100);
  };

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
      <p className="text-lg font-semibold">Clicks: {clicks.toLocaleString('en')}</p>
      <p className="text-sm text-gray-600 mb-4">Every 100 clicks = 20% chance of +1 Power Level</p>
      
      <Dialog open={isTrainingDialogOpen} onOpenChange={setIsTrainingDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-orange-100 border-orange-300 hover:bg-orange-200 text-orange-800"
          >
            Select Training
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-dbBlue text-xl font-bold">Select Training Method</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 mt-2">
            {trainingExercises.map((exercise) => (
              <Card 
                key={exercise.id} 
                className={`border-2 cursor-pointer hover:bg-orange-50 ${equippedUpgrade === exercise.id ? 'border-dragonOrange bg-amber-50' : 'border-gray-200'}`}
                onClick={() => {
                  equipUpgrade(exercise.id);
                  setIsTrainingDialogOpen(false);
                }}
              >
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                    {equippedUpgrade === exercise.id && (
                      <div className="text-sm font-bold text-dragonOrange">Selected</div>
                    )}
                  </div>
                  <CardDescription>{exercise.description}</CardDescription>
                </CardHeader>
                <CardContent className="py-0">
                  <p className="text-sm"><span className="font-semibold text-dbBlue">+{exercise.powerBonus}</span> Power Level gain</p>
                  {!exercise.purchased ? (
                    <p className="text-sm text-dbRed">
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
