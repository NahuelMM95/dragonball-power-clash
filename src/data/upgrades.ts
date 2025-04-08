
import { Upgrade } from '../types/game';

export const initialUpgrades: Upgrade[] = [
  { 
    id: 'pushups', 
    name: 'Push Ups', 
    description: 'Basic training that increases your power gain.', 
    powerBonus: 1, 
    cost: 10, 
    purchased: false 
  },
  { 
    id: 'pullups', 
    name: 'Pull Ups', 
    description: 'Advanced training that significantly boosts your power gain.', 
    powerBonus: 2, 
    cost: 25, 
    purchased: false 
  },
  { 
    id: 'onehand', 
    name: 'One-Handed Push Ups', 
    description: 'Master level training for substantial power gain boosts.', 
    powerBonus: 3, 
    cost: 50, 
    purchased: false 
  },
  { 
    id: 'weights', 
    name: '5Kg Weighted Clothes', 
    description: 'Train with weighted clothing to increase power gain by 15%.', 
    powerBonus: 0, 
    cost: 75, 
    purchased: false,
    itemType: 'weight'
  },
];
