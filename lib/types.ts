export interface Creator {
  creatorId: string;
  farcasterId: string;
  streamUrl: string;
  analyticsSettings: AnalyticsSettings;
}

export interface AnalyticsSettings {
  showRevenue: boolean;
  showParticipants: boolean;
  showEngagement: boolean;
}

export interface Market {
  marketId: string;
  creatorId: string;
  question: string;
  outcomes: Outcome[];
  status: 'active' | 'resolved' | 'cancelled';
  creationTimestamp: number;
  resolutionTimestamp?: number;
  winningOutcomeId?: string;
  poolAmount: number;
  creatorCutPercentage: number;
  participants: number;
  volume: number;
}

export interface Outcome {
  outcomeId: string;
  name: string;
  odds: number;
  totalBets: number;
  color: string;
}

export interface ParticipantBet {
  betId: string;
  marketId: string;
  participantId: string;
  outcomeId: string;
  betAmount: number;
  betTimestamp: number;
  status: 'pending' | 'won' | 'lost';
  potentialPayout: number;
}

export interface Participant {
  participantId: string;
  farcasterId: string;
  walletAddress: string;
  totalBets: number;
  totalWinnings: number;
  winRate: number;
  rank: number;
  badges: Badge[];
}

export interface Badge {
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface MarketAnalytics {
  totalRevenue: number;
  totalParticipants: number;
  averageBetSize: number;
  engagementRate: number;
  topPerformingMarkets: Market[];
  revenueOverTime: { date: string; revenue: number }[];
  participantGrowth: { date: string; participants: number }[];
}

export interface LeaderboardEntry {
  participant: Participant;
  score: number;
  change: number;
}
