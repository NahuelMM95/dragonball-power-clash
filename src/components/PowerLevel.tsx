
import { useGame } from '@/contexts/GameContext';
import { useUpgrades } from '@/contexts/UpgradeContext';
import { useItems } from '@/contexts/ItemContext';
import { useSettings } from '@/hooks/useSettings';
import { abbreviateNumber } from '@/utils/numberAbbreviation';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const PowerLevel = () => {
  const { powerLevel, gameOver, resetProgress } = useGame();
  const { equippedUpgrade, upgrades } = useUpgrades();
  const { equippedItems } = useItems();
  const { settings } = useSettings();
  
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
    <div className="bg-white/90 p-4 rounded-lg shadow-lg border-2 border-dragonOrange">
      <h2 className="text-xs font-bold text-dbRed mb-3 text-center">POWER STATUS</h2>
      
      {gameOver ? (
        <div className="flex flex-col items-center py-3">
          <AlertCircle className="text-red-500 h-6 w-6 mb-2" />
          <p className="text-xs font-bold text-red-500 mb-2">GAME OVER</p>
          <p className="text-xs text-gray-700 mb-3 text-center">Your power level has dropped to zero!</p>
          <Button onClick={handleReset} variant="destructive" size="sm" className="text-xs h-6">
            Reset Game
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-dbRed rounded-full mr-2"></div>
              <span className="text-xs font-bold">Power Level:</span>
            </div>
            <span className="text-xs font-bold text-dbRed">
              {abbreviateNumber(powerLevel, settings.numberAbbreviation)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-dbBlue rounded-full mr-2"></div>
              <span className="text-xs font-bold">Power Gain:</span>
            </div>
            <span className="text-xs font-bold text-dbBlue">
              +{abbreviateNumber(powerGain, settings.numberAbbreviation)}
            </span>
          </div>
          
          {equippedUpgrade && (
            <div className="text-xs text-gray-600 text-center bg-gray-100 rounded p-1">
              Training: {upgrades.find(u => u.id === equippedUpgrade)?.name}
            </div>
          )}
          
          {equippedItems.some(item => item.effect?.type === 'power_gain_chance_increase') && (
            <div className="text-xs text-green-600 text-center bg-green-100 rounded p-1">
              Weighted Training: +5% power gain chance
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PowerLevel;
