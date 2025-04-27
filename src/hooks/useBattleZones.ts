
import { getForestEnemies, getDesertEnemies, getWastelandEnemies } from '@/data/enemies';
import { Enemy } from '@/types/game';

export const useBattleZones = () => {
  const getFightEnemy = (zone: string, playerPowerLevel: number = 1): Enemy => {
    let selectedEnemy: Enemy;
    const forestEnemies = getForestEnemies(playerPowerLevel);
    const desertEnemies = getDesertEnemies(playerPowerLevel);
    const wastelandEnemies = getWastelandEnemies(playerPowerLevel);
    
    if (zone === 'forest') {
      const rand = Math.random();
      if (rand < 0.5) {
        selectedEnemy = { ...forestEnemies[0] };
      } else if (rand < 0.8) {
        selectedEnemy = { ...forestEnemies[1] };
      } else {
        selectedEnemy = { ...forestEnemies[2] };
      }
    } else if (zone === 'desert') {
      const rand = Math.random();
      if (rand < 0.2) {
        selectedEnemy = { ...desertEnemies[0] };
      } else if (rand < 0.6) {
        selectedEnemy = { ...desertEnemies[1] };
      } else {
        selectedEnemy = { ...desertEnemies[2] };
      }
    } else {
      selectedEnemy = { ...wastelandEnemies[0] };
    }
    
    return selectedEnemy;
  };
  
  return {
    forest: getForestEnemies(),
    desert: getDesertEnemies(),
    wasteland: getWastelandEnemies(),
    getFightEnemy
  };
};
