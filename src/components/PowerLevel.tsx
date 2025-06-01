
import { useGame } from '@/contexts/GameContext';
import { useUpgrades } from '@/contexts/UpgradeContext';
import { useSettings } from '@/hooks/useSettings';
import { abbreviateNumber } from '@/utils/numberAbbreviation';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const PowerLevel = () => {
  const { powerLevel, gameOver, resetProgress } = useGame();
  const { equippedUpgrade, upgrades } = useUpgrades();
  const { settings } = useSettings();
  
  // Calculate power gain based on equipped upgrade
  const powerGain = (() => {
    if (!equippedUpgrade) return 1;
    const upgrade = upgrades.find(u => u.id === equippedUpgrade);
    return upgrade ? upgrade.powerBonus : 1;
  })();
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your progress?')) {
      resetProgress();
    }
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-md backdrop-blur-sm border-2 border-dragonOrange dark:border-dragonOrange/70">
      <h2 className="text-xl font-bold text-dbRed dark:text-dbRed mb-2">Power Status</h2>
      
      {gameOver ? (
        <div className="flex flex-col items-center py-2">
          <AlertCircle className="text-red-500 h-8 w-8 mb-2" />
          <p className="text-lg font-bold text-red-500 mb-2">GAME OVER</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">Your power level has dropped to zero!</p>
          <Button onClick={handleReset} variant="destructive" size="sm">
            Reset Game
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-2">
            <div className="h-4 w-4 bg-dbRed rounded-full mr-2"></div>
            <p className="text-lg font-semibold dark:text-gray-200">Power Level: {abbreviateNumber(powerLevel, settings.numberAbbreviation)}</p>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-dbBlue rounded-full mr-2"></div>
            <p className="text-lg font-semibold dark:text-gray-200">Power Gain: +{abbreviateNumber(powerGain, settings.numberAbbreviation)}</p>
          </div>
          
          {equippedUpgrade && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Training: {upgrades.find(u => u.id === equippedUpgrade)?.name}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PowerLevel;
