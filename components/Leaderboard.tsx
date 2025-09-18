'use client';

import React from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { LeaderboardEntry } from '@/lib/types';
import { formatCurrency, formatPercentage, truncateAddress } from '@/lib/utils';
import { Trophy, TrendingUp, TrendingDown, Medal, Award } from 'lucide-react';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export function Leaderboard({ entries }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-500" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-textSecondary">#{rank}</span>;
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return 'warning';
      case 2:
        return 'default';
      case 3:
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">Leaderboard</h2>
        <Badge variant="info">Top Predictors</Badge>
      </div>

      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div
            key={entry.participant.participantId}
            className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 hover:shadow-md ${
              index < 3 ? 'bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20' : 'bg-gray-50'
            }`}
          >
            {/* Rank */}
            <div className="flex items-center justify-center w-10 h-10">
              {getRankIcon(entry.participant.rank)}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-textPrimary">
                  @{entry.participant.farcasterId}
                </span>
                <span className="text-xs text-textSecondary">
                  {truncateAddress(entry.participant.walletAddress)}
                </span>
              </div>
              
              {/* Badges */}
              {entry.participant.badges.length > 0 && (
                <div className="flex gap-1 mb-2">
                  {entry.participant.badges.slice(0, 3).map((badge) => (
                    <span
                      key={badge.badgeId}
                      className="text-xs px-2 py-1 bg-white rounded-full border"
                      title={badge.description}
                    >
                      {badge.icon} {badge.name}
                    </span>
                  ))}
                  {entry.participant.badges.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                      +{entry.participant.badges.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-textSecondary">
                <span>Win Rate: {formatPercentage(entry.participant.winRate)}</span>
                <span>Total Bets: {formatCurrency(entry.participant.totalBets)}</span>
                <span>Winnings: {formatCurrency(entry.participant.totalWinnings)}</span>
              </div>
            </div>

            {/* Score and Change */}
            <div className="text-right">
              <div className="text-lg font-bold text-textPrimary mb-1">
                {entry.score.toLocaleString()}
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                entry.change > 0 ? 'text-green-600' : entry.change < 0 ? 'text-red-600' : 'text-textSecondary'
              }`}>
                {entry.change > 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : entry.change < 0 ? (
                  <TrendingDown className="w-3 h-3" />
                ) : null}
                {entry.change > 0 ? '+' : ''}{entry.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More */}
      <div className="mt-6 text-center">
        <button className="text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-200">
          View Full Leaderboard →
        </button>
      </div>
    </Card>
  );
}
