'use client';

import React from 'react';
import { Market } from '@/lib/types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { formatCurrency, formatTimeAgo, formatPercentage } from '@/lib/utils';
import { Clock, Users, TrendingUp } from 'lucide-react';

interface MarketCardProps {
  market: Market;
  variant?: 'active' | 'resolved';
  onPlaceBet?: (marketId: string, outcomeId: string) => void;
}

export function MarketCard({ market, variant = 'active', onPlaceBet }: MarketCardProps) {
  const isActive = market.status === 'active';
  const totalPool = market.outcomes.reduce((sum, outcome) => sum + outcome.totalBets, 0);

  return (
    <Card className="market-card" hover={isActive}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-textPrimary mb-2">
              {market.question}
            </h3>
            <div className="flex items-center gap-4 text-sm text-textSecondary">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTimeAgo(market.creationTimestamp)}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {market.participants} participants
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {formatCurrency(market.volume)}
              </div>
            </div>
          </div>
          <Badge 
            variant={isActive ? 'success' : 'default'}
            className="ml-4"
          >
            {market.status}
          </Badge>
        </div>

        {/* Pool Info */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-textSecondary">Total Pool</span>
            <span className="text-lg font-bold gradient-text">
              {formatCurrency(totalPool)}
            </span>
          </div>
        </div>

        {/* Outcomes */}
        <div className="space-y-2">
          {market.outcomes.map((outcome) => {
            const percentage = totalPool > 0 ? (outcome.totalBets / totalPool) * 100 : 0;
            
            return (
              <div key={outcome.outcomeId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: outcome.color }}
                    />
                    <span className="font-medium">{outcome.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{outcome.odds.toFixed(2)}x</div>
                    <div className="text-xs text-textSecondary">
                      {formatPercentage(percentage / 100)}
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: outcome.color 
                    }}
                  />
                </div>

                {/* Bet button */}
                {isActive && onPlaceBet && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full outcome-button"
                    style={{ 
                      borderColor: outcome.color,
                      color: outcome.color 
                    }}
                    onClick={() => onPlaceBet(market.marketId, outcome.outcomeId)}
                  >
                    Bet on {outcome.name}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Resolution info for resolved markets */}
        {market.status === 'resolved' && market.winningOutcomeId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm font-medium text-green-800">
                Resolved: {market.outcomes.find(o => o.outcomeId === market.winningOutcomeId)?.name} won
              </span>
            </div>
            {market.resolutionTimestamp && (
              <div className="text-xs text-green-600 mt-1">
                {formatTimeAgo(market.resolutionTimestamp)}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
