
import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import ZoneCard from './ZoneCard';

const ForestZone = () => {
  const [showEnemies, setShowEnemies] = useState(false);
  const { fightEnemy } = useGame();

  const forestEnemiesInfo = [
    { name: "Wolf", power: 5, reward: "10 Zeni reward" },
    { name: "Bandit", power: 10, reward: "25 Zeni reward" },
    { name: "Bear", power: 20, reward: "50 Zeni reward" }
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
