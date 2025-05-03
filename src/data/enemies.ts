
import { Enemy } from '../types/game';

const calculateEnemyStats = (basePower: number, playerPowerLevel: number = 1) => {
  // Scale enemy stats based on player's power level, but with a more balanced approach
  // We'll use the same calculation logic as for player stats
  // This ensures enemy stats grow at a similar rate to player stats
  
  return {
    power: basePower, // Keep base power intact to preserve progression difficulty
    hp: Math.floor(basePower * 10), // Same formula as player: powerLevel * 10
    maxHp: Math.floor(basePower * 10),
    damage: Math.floor(basePower * 0.8) // Same formula as player: powerLevel * 0.8
  };
};

export const getForestEnemies = (playerPowerLevel: number = 1): Enemy[] => [
  {
    name: 'Wolf',
    image: 'wolf.png',
    ki: 0,
    maxKi: 0,
    zeniReward: 10,
    ...calculateEnemyStats(5, playerPowerLevel)
  },
  {
    name: 'Bandit',
    image: 'bandit.png',
    ki: 10,
    maxKi: 10,
    zeniReward: 25,
    ...calculateEnemyStats(10, playerPowerLevel)
  },
  {
    name: 'Bear',
    image: 'bear.png',
    ki: 0,
    maxKi: 0,
    zeniReward: 50,
    ...calculateEnemyStats(20, playerPowerLevel)
  }
];

export const getDesertEnemies = (playerPowerLevel: number = 1): Enemy[] => [
  {
    name: 'Yamcha',
    image: 'yamcha.png',
    ki: 100,
    maxKi: 100,
    zeniReward: 200,
    ...calculateEnemyStats(50, playerPowerLevel)
  },
  {
    name: 'T-Rex',
    image: 't-rex.png',
    ki: 0,
    maxKi: 0,
    zeniReward: 500,
    ...calculateEnemyStats(250, playerPowerLevel)
  },
  {
    name: 'Pterodactyl',
    image: 'pterodactyl.png',
    ki: 0,
    maxKi: 0,
    zeniReward: 300,
    ...calculateEnemyStats(150, playerPowerLevel)
  }
];

export const getWastelandEnemies = (playerPowerLevel: number = 1): Enemy[] => [
  {
    name: 'Saibaman',
    image: 'saibaman.png',
    ki: 500,
    maxKi: 500,
    zeniReward: 1000,
    ...calculateEnemyStats(1500, playerPowerLevel)
  }
];

// Export static versions for reference
export const forestEnemies = getForestEnemies();
export const desertEnemies = getDesertEnemies();
export const wastelandEnemies = getWastelandEnemies();
