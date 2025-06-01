
import { useState } from 'react';
import { useBattle } from '@/contexts/BattleContext';
import ZoneCard from './ZoneCard';

const WastelandZone = () => {
  const [showEnemies, setShowEnemies] = useState(false);
  const { fightEnemy } = useBattle();

  const wastelandEnemiesInfo = [
    { name: "Saibaman", power: 1500, reward: "1,000 Zeni" },
    { name: "T-Rex", power: 250, reward: "500 Zeni" },
    { name: "Pterodactyl", power: 150, reward: "300 Zeni" }
  ];

  return (
    <ZoneCard
      zoneName="Wasteland"
      description="Face off against powerful plant-based warriors and prehistoric beasts in this desolate area."
      enemies={wastelandEnemiesInfo}
      showEnemies={showEnemies}
      onToggleEnemies={() => setShowEnemies(!showEnemies)}
      onFindEnemy={() => fightEnemy('wasteland')}
      accentColor="wasteland"
    />
  );
};

export default WastelandZone;
