
import { Enemy } from '../types/game';

export const forestEnemies: Enemy[] = [
  {
    name: 'Wolf',
    power: 5,
    image: 'wolf.png',
    hp: 50,
    maxHp: 50,
    damage: 3,
    ki: 0,
    maxKi: 0,
    zeniReward: 10
  },
  {
    name: 'Bandit',
    power: 10,
    image: 'bandit.png',
    hp: 80,
    maxHp: 80,
    damage: 5,
    ki: 10,
    maxKi: 10,
    zeniReward: 25
  },
  {
    name: 'Bear',
    power: 20,
    image: 'bear.png',
    hp: 150,
    maxHp: 150,
    damage: 8,
    ki: 0,
    maxKi: 0,
    zeniReward: 50
  }
];

export const desertEnemies: Enemy[] = [
  {
    name: 'Yamcha',
    power: 50,
    image: 'yamcha.png',
    hp: 300,
    maxHp: 300,
    damage: 15,
    ki: 100,
    maxKi: 100,
    zeniReward: 200
  },
  {
    name: 'T-Rex',
    power: 250,
    image: 't-rex.png',
    hp: 1000,
    maxHp: 1000,
    damage: 35,
    ki: 0,
    maxKi: 0,
    zeniReward: 500
  }
];
