import { Enemy } from '@/types/game';
import { ENEMY_IMAGES } from './assets';

export const dbzEnemies: (Enemy & { id: number })[] = [
  {
    id: 0,
    name: 'Raditz',
    image: ENEMY_IMAGES.RADITZ,
    power: 1500,
    hp: 15000,
    maxHp: 15000,
    damage: 450,
    ki: 1000,
    maxKi: 1000,
    zeniReward: 2000
  },
  {
    id: 1,
    name: 'Saibaman 1',
    image: ENEMY_IMAGES.SAIBAMAN,
    power: 1200,
    hp: 12000,
    maxHp: 12000,
    damage: 360,
    ki: 800,
    maxKi: 800,
    zeniReward: 1000
  },
  {
    id: 2,
    name: 'Saibaman 2',
    image: ENEMY_IMAGES.SAIBAMAN,
    power: 1200,
    hp: 12000,
    maxHp: 12000,
    damage: 360,
    ki: 800,
    maxKi: 800,
    zeniReward: 1000
  },
  {
    id: 3,
    name: 'Saibaman 3',
    image: ENEMY_IMAGES.SAIBAMAN,
    power: 1200,
    hp: 12000,
    maxHp: 12000,
    damage: 360,
    ki: 800,
    maxKi: 800,
    zeniReward: 1000
  },
  {
    id: 4,
    name: 'Saibaman 4',
    image: ENEMY_IMAGES.SAIBAMAN,
    power: 1200,
    hp: 12000,
    maxHp: 12000,
    damage: 360,
    ki: 800,
    maxKi: 800,
    zeniReward: 1000
  },
  {
    id: 5,
    name: 'Saibaman 5',
    image: ENEMY_IMAGES.SAIBAMAN,
    power: 1200,
    hp: 12000,
    maxHp: 12000,
    damage: 360,
    ki: 800,
    maxKi: 800,
    zeniReward: 1000
  },
  {
    id: 6,
    name: 'Saibaman 6',
    image: ENEMY_IMAGES.SAIBAMAN,
    power: 1200,
    hp: 12000,
    maxHp: 12000,
    damage: 360,
    ki: 800,
    maxKi: 800,
    zeniReward: 1000
  },
  {
    id: 7,
    name: 'Nappa',
    image: ENEMY_IMAGES.NAPPA,
    power: 4000,
    hp: 40000,
    maxHp: 40000,
    damage: 1200,
    ki: 2000,
    maxKi: 2000,
    zeniReward: 5000
  },
  {
    id: 8,
    name: 'Vegeta',
    image: ENEMY_IMAGES.VEGETA,
    power: 18000,
    hp: 180000,
    maxHp: 180000,
    damage: 5400,
    ki: 10000,
    maxKi: 10000,
    zeniReward: 10000
  },
  {
    id: 9,
    name: 'Great Ape Vegeta',
    image: ENEMY_IMAGES.VEGETA_OZARU,
    power: 70000,
    hp: 700000,
    maxHp: 700000,
    damage: 21000,
    ki: 30000,
    maxKi: 30000,
    zeniReward: 25000
  },
  {
    id: 10,
    name: 'Injured Vegeta',
    image: ENEMY_IMAGES.VEGETA_INJURED,
    power: 7000,
    hp: 70000,
    maxHp: 70000,
    damage: 2100,
    ki: 5000,
    maxKi: 5000,
    zeniReward: 15000
  }
];
