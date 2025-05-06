
import { useState } from 'react';
import { useBattle } from '@/contexts/BattleContext';
import ZoneCard from './ZoneCard';

const CrystalCaveZone = () => {
  const [showEnemies, setShowEnemies] = useState(false);
  const { fightEnemy } = useBattle();

  const crystalCaveEnemiesInfo = [
    { name: "Crystal Monster", power: 70, reward: "800 Zeni" },
    { name: "Malfunctioning Robot", power: 120, reward: "1200 Zeni" }
  ];

  return (
    <ZoneCard
      zoneName="Crystal Cave"
      description="Explore the dangerous crystal caves filled with mysterious enemies."
      enemies={crystalCaveEnemiesInfo}
      showEnemies={showEnemies}
      onToggleEnemies={() => setShowEnemies(!showEnemies)}
      onFindEnemy={() => fightEnemy('crystal-cave')}
      accentColor="crystalBlue"
    />
  );
};

export default CrystalCaveZone;
