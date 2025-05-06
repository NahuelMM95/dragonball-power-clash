
import { useState } from 'react';
import { useBattle } from '@/contexts/BattleContext';
import ZoneCard from './ZoneCard';

const DesertZone = () => {
  const [showEnemies, setShowEnemies] = useState(false);
  const { fightEnemy } = useBattle();

  const desertEnemiesInfo = [
    { name: "Yamcha", power: 50, reward: "200 Zeni" },
    { name: "T-Rex", power: 250, reward: "500 Zeni" },
    { name: "Pterodactyl", power: 150, reward: "300 Zeni" },
    { name: "Desert Bandit", power: 15, reward: "100 Zeni" },
    { name: "Scorpion", power: 10, reward: "75 Zeni" }
  ];

  return (
    <ZoneCard
      zoneName="Desert"
      description="Challenge powerful creatures in the scorching desert."
      enemies={desertEnemiesInfo}
      showEnemies={showEnemies}
      onToggleEnemies={() => setShowEnemies(!showEnemies)}
      onFindEnemy={() => fightEnemy('desert')}
      accentColor="dbRed"
    />
  );
};

export default DesertZone;
