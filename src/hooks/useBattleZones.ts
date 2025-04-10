
import { forestEnemies, desertEnemies } from '@/data/enemies';
import { Enemy } from '@/types/game';

export const useBattleZones = () => {
  const getFightEnemy = (zone: string): Enemy => {
    let selectedEnemy: Enemy;
    
    if (zone === 'forest') {
      const rand = Math.random();
      if (rand < 0.5) {
        selectedEnemy = { ...forestEnemies[0] };
      } else if (rand < 0.8) {
        selectedEnemy = { ...forestEnemies[1] };
      } else {
        selectedEnemy = { ...forestEnemies[2] };
      }
    } else {
      const rand = Math.random();
      if (rand < 0.2) {
        selectedEnemy = { ...desertEnemies[0] };
      } else {
        selectedEnemy = { ...desertEnemies[1] };
      }
    }
    
    return selectedEnemy;
  };
  
  return {
    forest: forestEnemies,
    desert: desertEnemies,
    getFightEnemy
  };
};
