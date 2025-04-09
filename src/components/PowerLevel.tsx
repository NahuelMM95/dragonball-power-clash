
import { useGame } from '@/contexts/GameContext';
import { useUpgrades } from '@/contexts/UpgradeContext';

const PowerLevel = () => {
  const { powerLevel } = useGame();
  const { equippedUpgrade, upgrades } = useUpgrades();
  
  // Calculate power gain based on equipped upgrade
  const powerGain = (() => {
    if (!equippedUpgrade) return 1;
    const upgrade = upgrades.find(u => u.id === equippedUpgrade);
    return upgrade ? 1 + upgrade.powerBonus : 1;
  })();

  return (
    <div className="bg-white/90 p-4 rounded-lg shadow-md backdrop-blur-sm border-2 border-dragonOrange">
      <h2 className="text-xl font-bold text-dbRed mb-2">Power Status</h2>
      <div className="flex items-center mb-2">
        <div className="h-4 w-4 bg-dbRed rounded-full mr-2"></div>
        <p className="text-lg font-semibold">Power Level: {powerLevel}</p>
      </div>
      <div className="flex items-center">
        <div className="h-4 w-4 bg-dbBlue rounded-full mr-2"></div>
        <p className="text-lg font-semibold">Power Gain: +{powerGain}/100 clicks</p>
      </div>
      
      {equippedUpgrade && (
        <div className="mt-2 text-sm text-gray-600">
          Training: {upgrades.find(u => u.id === equippedUpgrade)?.name}
        </div>
      )}
    </div>
  );
};

export default PowerLevel;
