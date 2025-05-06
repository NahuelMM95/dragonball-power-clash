
import { useState } from 'react';
import { useBattle } from '@/contexts/BattleContext';
import ZoneCard from './ZoneCard';

const ForestZone = () => {
  const [showEnemies, setShowEnemies] = useState(false);
  const { fightEnemy } = useBattle();

  const forestEnemiesInfo = [
    { name: "Wolf", power: 5, reward: "10 Zeni" },
    { name: "Bandit", power: 10, reward: "25 Zeni" },
    { name: "Bear", power: 20, reward: "50 Zeni" },
    { name: "Snake", power: 3, reward: "5 Zeni" }
  ];

  return (
    <ZoneCard
      zoneName="Forest"
      description="Battle wild creatures in the forest to test your power."
      enemies={forestEnemiesInfo}
      showEnemies={showEnemies}
      onToggleEnemies={() => setShowEnemies(!showEnemies)}
      onFindEnemy={() => fightEnemy('forest')}
      accentColor="forestGreen"
    />
  );
};

export default ForestZone;
