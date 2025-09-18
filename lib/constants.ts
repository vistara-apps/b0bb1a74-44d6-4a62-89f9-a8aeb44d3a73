export const MARKET_CATEGORIES = [
  'Gaming',
  'Sports',
  'Entertainment',
  'Tech',
  'Crypto',
  'General'
] as const;

export const OUTCOME_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#F97316', // Orange
] as const;

export const BADGE_TYPES = {
  FIRST_BET: {
    name: 'First Bet',
    description: 'Placed your first prediction',
    icon: '🎯',
    rarity: 'common' as const
  },
  WINNING_STREAK: {
    name: 'Hot Streak',
    description: '5 correct predictions in a row',
    icon: '🔥',
    rarity: 'rare' as const
  },
  BIG_WINNER: {
    name: 'Big Winner',
    description: 'Won over 1 ETH in a single market',
    icon: '💎',
    rarity: 'epic' as const
  },
  MARKET_MASTER: {
    name: 'Market Master',
    description: 'Created 10 successful markets',
    icon: '👑',
    rarity: 'legendary' as const
  }
} as const;

export const CREATOR_CUT_OPTIONS = [
  { value: 2, label: '2%' },
  { value: 5, label: '5%' },
  { value: 10, label: '10%' },
  { value: 15, label: '15%' }
] as const;

export const MARKET_DURATION_OPTIONS = [
  { value: 300, label: '5 minutes' },
  { value: 900, label: '15 minutes' },
  { value: 1800, label: '30 minutes' },
  { value: 3600, label: '1 hour' },
  { value: 7200, label: '2 hours' }
] as const;
