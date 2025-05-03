import { Enemy } from '../types/game';
import { ENEMY_IMAGES } from './assets';

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
    image: ENEMY_IMAGES.WOLF,
    ki: 0,
    maxKi: 0,
    zeniReward: 10,
    ...calculateEnemyStats(5, playerPowerLevel)
  },
  {
    name: 'Bandit',
    image: ENEMY_IMAGES.BANDIT,
    ki: 10,
    maxKi: 10,
    zeniReward: 25,
    ...calculateEnemyStats(10, playerPowerLevel)
  },
  {
    name: 'Bear',
    image: ENEMY_IMAGES.BEAR,
    ki: 0,
    maxKi: 0,
    zeniReward: 50,
    ...calculateEnemyStats(20, playerPowerLevel)
  }
];

export const getDesertEnemies = (playerPowerLevel: number = 1): Enemy[] => [
  {
    name: 'Yamcha',
    image: ENEMY_IMAGES.YAMCHA,
    ki: 100,
    maxKi: 100,
    zeniReward: 200,
    ...calculateEnemyStats(50, playerPowerLevel)
  },
  {
    name: 'T-Rex',
    image: ENEMY_IMAGES.T_REX,
    ki: 0,
    maxKi: 0,
    zeniReward: 500,
    ...calculateEnemyStats(250, playerPowerLevel)
  },
  {
    name: 'Pterodactyl',
    image: ENEMY_IMAGES.PTERODACTYL,
    ki: 0,
    maxKi: 0,
    zeniReward: 300,
    ...calculateEnemyStats(150, playerPowerLevel)
  }
];

export const getWastelandEnemies = (playerPowerLevel: number = 1): Enemy[] => [
  {
    name: 'Saibaman',
    image: ENEMY_IMAGES.SAIBAMAN,
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
