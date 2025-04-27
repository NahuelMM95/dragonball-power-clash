
import { Upgrade } from '../types/game';

export const initialUpgrades: Upgrade[] = [
  { 
    id: 'pushups', 
    name: 'Push Ups', 
    description: 'Increases your power gain by +1 per click.', 
    powerBonus: 1, 
    cost: 10, 
    purchased: false 
  },
  { 
    id: 'pullups', 
    name: 'Pull Ups', 
    description: 'Increases your power gain by +2 per click.', 
    powerBonus: 2, 
    cost: 25, 
    purchased: false 
  },
  { 
    id: 'onehand', 
    name: 'One-Handed Push Ups', 
    description: 'Increases your power gain by +3 per click.', 
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
