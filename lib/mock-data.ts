import { Market, Participant, MarketAnalytics, LeaderboardEntry } from './types';

export const mockMarkets: Market[] = [
  {
    marketId: 'market_1',
    creatorId: 'creator_1',
    question: 'Will this stream reach 1000 viewers?',
    outcomes: [
      { outcomeId: 'yes', name: 'Yes', odds: 1.8, totalBets: 2.5, color: '#10B981' },
      { outcomeId: 'no', name: 'No', odds: 2.2, totalBets: 1.8, color: '#EF4444' }
    ],
    status: 'active',
    creationTimestamp: Date.now() - 300000,
    poolAmount: 4.3,
    creatorCutPercentage: 5,
    participants: 23,
    volume: 4.3
  },
  {
    marketId: 'market_2',
    creatorId: 'creator_1',
    question: 'Next game outcome?',
    outcomes: [
      { outcomeId: 'win', name: 'Win', odds: 1.5, totalBets: 3.2, color: '#10B981' },
      { outcomeId: 'lose', name: 'Lose', odds: 2.8, totalBets: 1.1, color: '#EF4444' },
      { outcomeId: 'draw', name: 'Draw', odds: 4.5, totalBets: 0.7, color: '#F59E0B' }
    ],
    status: 'active',
    creationTimestamp: Date.now() - 600000,
    poolAmount: 5.0,
    creatorCutPercentage: 10,
    participants: 31,
    volume: 5.0
  },
  {
    marketId: 'market_3',
    creatorId: 'creator_1',
    question: 'Will Bitcoin hit $100k today?',
    outcomes: [
      { outcomeId: 'yes', name: 'Yes', odds: 3.2, totalBets: 1.2, color: '#10B981' },
      { outcomeId: 'no', name: 'No', odds: 1.4, totalBets: 2.8, color: '#EF4444' }
    ],
    status: 'resolved',
    creationTimestamp: Date.now() - 7200000,
    resolutionTimestamp: Date.now() - 3600000,
    winningOutcomeId: 'no',
    poolAmount: 4.0,
    creatorCutPercentage: 5,
    participants: 18,
    volume: 4.0
  }
];

export const mockParticipants: Participant[] = [
  {
    participantId: 'participant_1',
    farcasterId: 'user123',
    walletAddress: '0x1234567890123456789012345678901234567890',
    totalBets: 12.5,
    totalWinnings: 18.3,
    winRate: 0.68,
    rank: 1,
    badges: [
      { badgeId: 'badge_1', name: 'Hot Streak', description: '5 wins in a row', icon: '🔥', rarity: 'rare' },
      { badgeId: 'badge_2', name: 'Big Winner', description: 'Won over 1 ETH', icon: '💎', rarity: 'epic' }
    ]
  },
  {
    participantId: 'participant_2',
    farcasterId: 'user456',
    walletAddress: '0x2345678901234567890123456789012345678901',
    totalBets: 8.2,
    totalWinnings: 11.7,
    winRate: 0.72,
    rank: 2,
    badges: [
      { badgeId: 'badge_3', name: 'First Bet', description: 'Placed first prediction', icon: '🎯', rarity: 'common' }
    ]
  }
];

export const mockAnalytics: MarketAnalytics = {
  totalRevenue: 2.45,
  totalParticipants: 156,
  averageBetSize: 0.08,
  engagementRate: 0.34,
  topPerformingMarkets: mockMarkets.slice(0, 3),
  revenueOverTime: [
    { date: '2024-01-01', revenue: 0.5 },
    { date: '2024-01-02', revenue: 0.8 },
    { date: '2024-01-03', revenue: 1.2 },
    { date: '2024-01-04', revenue: 1.8 },
    { date: '2024-01-05', revenue: 2.45 }
  ],
  participantGrowth: [
    { date: '2024-01-01', participants: 25 },
    { date: '2024-01-02', participants: 48 },
    { date: '2024-01-03', participants: 89 },
    { date: '2024-01-04', participants: 124 },
    { date: '2024-01-05', participants: 156 }
  ]
};

export const mockLeaderboard: LeaderboardEntry[] = [
  { participant: mockParticipants[0], score: 1850, change: 12 },
  { participant: mockParticipants[1], score: 1720, change: -5 },
  {
    participant: {
      participantId: 'participant_3',
      farcasterId: 'user789',
      walletAddress: '0x3456789012345678901234567890123456789012',
      totalBets: 6.8,
      totalWinnings: 9.2,
      winRate: 0.65,
      rank: 3,
      badges: []
    },
    score: 1680,
    change: 8
  }
];
