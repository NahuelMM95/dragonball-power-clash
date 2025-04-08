
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
};

export type ActiveBuff = {
  id: string;
  endTime: number;
};

export type GameContextType = {
  clicks: number;
  powerLevel: number;
  zeni: number;
  increaseClicks: () => void;
  upgrades: Upgrade[];
  equippedUpgrade: string | null;
  purchaseUpgrade: (id: string) => void;
  equipUpgrade: (id: string) => void;
  forest: Enemy[];
  desert: Enemy[];
  fightEnemy: (zone: string) => void;
  fightResult: { enemy: Enemy | null; won: boolean | null } | null;
  clearFightResult: () => void;
  battleState: BattleState;
  skills: Skill[];
  purchaseSkill: (skillName: string) => void;
  startBattle: (enemy: Enemy) => void;
  useSkill: (skill: Skill) => void;
  fleeFromBattle: () => void;
  endBattle: (victory: boolean) => void;
  inventory: Item[];
  equippedItems: Item[];
  equipItem: (itemId: string | null, slotType: string) => void;
  useItem: (itemId: string) => void;
  useItemInBattle: (itemId: string) => void;
  purchaseItem: (itemType: string) => void;
  resetProgress: () => void;
  activeBuffs: ActiveBuff[];
};
