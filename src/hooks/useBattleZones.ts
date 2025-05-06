
import { getCrystalCaveEnemies, getForestEnemies, getDesertEnemies, getWastelandEnemies } from '@/data/enemies';
import { Enemy } from '@/types/game';

export const useBattleZones = () => {
  const getFightEnemy = (zone: string, playerPowerLevel: number = 1): Enemy | Enemy[] => {
    // Check if this should be a multiple fight (5% chance)
    const isMultipleFight = Math.random() < 0.05;
    
    if (isMultipleFight && zone !== 'story') {
      // For multiple fights, create an array of 2-6 enemies
      const enemyCount = Math.floor(Math.random() * 5) + 2; // Random number between 2 and 6
      const enemies: Enemy[] = [];
      
      for (let i = 0; i < enemyCount; i++) {
        // Get a single enemy and add it to the array
        const singleEnemy = getSingleEnemy(zone, playerPowerLevel);
        enemies.push({ ...singleEnemy, isPartOfSequence: true });
      }
      
      // Set the sequence info
      return enemies.map((enemy, index) => ({
        ...enemy,
        sequencePosition: index + 1,
        sequenceTotal: enemies.length
      }));
    }
    
    // Regular single enemy fight
    return getSingleEnemy(zone, playerPowerLevel);
  };
  
  // Helper function to get a single enemy based on zone
  const getSingleEnemy = (zone: string, playerPowerLevel: number): Enemy => {
    let selectedEnemy: Enemy;
    const forestEnemies = getForestEnemies(playerPowerLevel);
    const desertEnemies = getDesertEnemies(playerPowerLevel);
    const wastelandEnemies = getWastelandEnemies(playerPowerLevel);
    const crystalCaveEnemies = getCrystalCaveEnemies(playerPowerLevel);
    
    if (zone === 'forest') {
      const rand = Math.random();
      if (rand < 0.4) {
        selectedEnemy = { ...forestEnemies[0] }; // Wolf
      } else if (rand < 0.7) {
        selectedEnemy = { ...forestEnemies[1] }; // Bandit
      } else if (rand < 0.9) {
        selectedEnemy = { ...forestEnemies[2] }; // Bear
      } else {
        selectedEnemy = { ...forestEnemies[3] }; // Snake
      }
    } else if (zone === 'desert') {
      const rand = Math.random();
      if (rand < 0.2) {
        selectedEnemy = { ...desertEnemies[0] }; // Yamcha
      } else if (rand < 0.4) {
        selectedEnemy = { ...desertEnemies[1] }; // T-Rex
      } else if (rand < 0.6) {
        selectedEnemy = { ...desertEnemies[2] }; // Pterodactyl
      } else if (rand < 0.8) {
        selectedEnemy = { ...desertEnemies[3] }; // Desert Bandit
      } else {
        selectedEnemy = { ...desertEnemies[4] }; // Scorpion
      }
    } else if (zone === 'crystal-cave') {
      const rand = Math.random();
      if (rand < 0.6) {
        selectedEnemy = { ...crystalCaveEnemies[0] }; // Crystal Monster
      } else {
        selectedEnemy = { ...crystalCaveEnemies[1] }; // Malfunctioning Robot
      }
    } else {
      selectedEnemy = { ...wastelandEnemies[0] };
    }
    
    return selectedEnemy;
  };
  
  return {
    forest: getForestEnemies(),
    desert: getDesertEnemies(),
    crystalCave: getCrystalCaveEnemies(),
    wasteland: getWastelandEnemies(),
    getFightEnemy
  };
};
