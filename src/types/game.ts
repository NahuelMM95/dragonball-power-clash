
export type Enemy = {
  name: string;
  power: number;
  image: string;
  hp: number;
  maxHp: number;
  damage: number;
  ki: number;
  maxKi: number;
  zeniReward?: number;
};

export type ItemType = 'weapon' | 'weight' | 'consumable';

export type Item = {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  slot?: string;
  quantity: number;
  effect?: {
    type: string;
    value: number;
    duration?: number;
  };
  usableInBattle?: boolean;
};

export type BattleState = {
  inProgress: boolean;
  playerStats: CombatStats;
  enemy: Enemy | null;
  log: string[];
  playerTurn: boolean;
};

export type CombatStats = {
  hp: number;
  maxHp: number;
  damage: number;
  ki: number;
  maxKi: number;
  damageMultiplier?: number;
};

export type SkillType = 'basic' | 'special' | 'ultimate';

export type Skill = {
  name: string;
  type: SkillType;
  damageMultiplier: number;
  kiCost: number;
  description: string;
  purchased?: boolean;
  cost?: number;
};

export type Upgrade = {
  id: string;
  name: string;
  description: string;
  powerBonus: number;
  cost: number;
  purchased: boolean;
  itemType?: string;
};

export type ActiveBuff = {
  id: string;
  endTime: number;
};

// New interfaces for our separate contexts
export interface BattleContextType {
  forest: Enemy[];
  desert: Enemy[];
  fightEnemy: (zone: string) => void;
  fightResult: { enemy: Enemy | null; won: boolean | null } | null;
  clearFightResult: () => void;
  battleState: BattleState;
  skills: Skill[];
  purchaseSkill: (skillName: string) => number | void;
  startBattle: (enemy: Enemy) => void;
  useSkill: (skill: Skill) => void;
  fleeFromBattle: () => void;
  endBattle: (victory: boolean) => void;
  useItemInBattle: (itemId: string, inventory: Item[], setInventory: React.Dispatch<React.SetStateAction<Item[]>>) => void;
  resetSkills: () => void;
}

export interface ItemContextType {
  inventory: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
  equippedItems: Item[];
  setEquippedItems: React.Dispatch<React.SetStateAction<Item[]>>;
  equipItem: (itemId: string | null, slotType: string) => void;
  useItem: (itemId: string) => void;
  purchaseItem: (itemType: string) => void;
  activeBuffs: ActiveBuff[];
  setActiveBuffs: React.Dispatch<React.SetStateAction<ActiveBuff[]>>;
}

export interface UpgradeContextType {
  upgrades: Upgrade[];
  equippedUpgrade: string | null;
  purchaseUpgrade: (id: string) => void;
  equipUpgrade: (id: string) => void;
  resetUpgrades: () => void;
}

// Main game context that combines all the others
export type GameContextType = {
  clicks: number;
  powerLevel: number;
  zeni: number;
  increaseClicks: () => void;
  resetProgress: () => void;
  setPowerLevel: React.Dispatch<React.SetStateAction<number>>;
  setZeni: React.Dispatch<React.SetStateAction<number>>;
};
