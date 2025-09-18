'use client';

import React, { useState } from 'react';
import { MarketCard } from '@/components/MarketCard';
import { CreateMarketModal } from '@/components/CreateMarketModal';
import { PlaceBetModal } from '@/components/PlaceBetModal';
import { CreatorDashboard } from '@/components/CreatorDashboard';
import { Leaderboard } from '@/components/Leaderboard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockMarkets, mockAnalytics, mockLeaderboard } from '@/lib/mock-data';
import { Market } from '@/lib/types';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Zap,
  BarChart3,
  Trophy,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const [markets, setMarkets] = useState<Market[]>(mockMarkets);
  const [activeTab, setActiveTab] = useState<'markets' | 'dashboard' | 'leaderboard'>('markets');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [betModal, setBetModal] = useState<{
    isOpen: boolean;
    marketId: string;
    outcomeId: string;
    marketQuestion: string;
    outcomeName: string;
    outcomeOdds: number;
    outcomeColor: string;
  } | null>(null);

  const handleCreateMarket = (newMarket: Market) => {
    setMarkets([newMarket, ...markets]);
  };

  const handlePlaceBet = (marketId: string, outcomeId: string) => {
    const market = markets.find(m => m.marketId === marketId);
    const outcome = market?.outcomes.find(o => o.outcomeId === outcomeId);
    
    if (market && outcome) {
      setBetModal({
        isOpen: true,
        marketId,
        outcomeId,
        marketQuestion: market.question,
        outcomeName: outcome.name,
        outcomeOdds: outcome.odds,
        outcomeColor: outcome.color
      });
    }
  };

  const handleBetSubmit = async (amount: number) => {
    if (!betModal) return;
    
    // Update market with new bet
    setMarkets(prevMarkets => 
      prevMarkets.map(market => {
        if (market.marketId === betModal.marketId) {
          return {
            ...market,
            outcomes: market.outcomes.map(outcome => {
              if (outcome.outcomeId === betModal.outcomeId) {
                return {
                  ...outcome,
                  totalBets: outcome.totalBets + amount
                };
              }
              return outcome;
            }),
            participants: market.participants + 1,
            volume: market.volume + amount
          };
        }
        return market;
      })
    );
    
    setBetModal(null);
  };

  const activeMarkets = markets.filter(m => m.status === 'active');
  const resolvedMarkets = markets.filter(m => m.status === 'resolved');

  return (
    <div className="min-h-screen">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-accent" />
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              PredictaStream
            </h1>
          </div>
          <p className="text-xl text-textSecondary max-w-2xl mx-auto">
            Monetize your stream instantly with dynamic prediction markets
          </p>
          
          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-textPrimary">{activeMarkets.length}</div>
              <div className="text-sm text-textSecondary">Active Markets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-textPrimary">156</div>
              <div className="text-sm text-textSecondary">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-textPrimary">2.45 ETH</div>
              <div className="text-sm text-textSecondary">Total Volume</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {[
              { id: 'markets', label: 'Markets', icon: TrendingUp },
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-textSecondary hover:text-textPrimary hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'markets' && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Market
            </Button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'markets' && (
          <div className="space-y-8">
            {/* Active Markets */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-accent" />
                <h2 className="text-2xl font-bold text-textPrimary">Active Markets</h2>
                <Badge variant="success">{activeMarkets.length}</Badge>
              </div>
              
              {activeMarkets.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeMarkets.map((market) => (
                    <MarketCard
                      key={market.marketId}
                      market={market}
                      variant="active"
                      onPlaceBet={handlePlaceBet}
                    />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-textPrimary mb-2">
                    No active markets
                  </h3>
                  <p className="text-textSecondary mb-4">
                    Create your first prediction market to get started
                  </p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Market
                  </Button>
                </Card>
              )}
            </div>

            {/* Resolved Markets */}
            {resolvedMarkets.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-textSecondary" />
                  <h2 className="text-2xl font-bold text-textPrimary">Recently Resolved</h2>
                  <Badge variant="default">{resolvedMarkets.length}</Badge>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {resolvedMarkets.slice(0, 4).map((market) => (
                    <MarketCard
                      key={market.marketId}
                      market={market}
                      variant="resolved"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <CreatorDashboard analytics={mockAnalytics} />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard entries={mockLeaderboard} />
        )}

        {/* Modals */}
        <CreateMarketModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateMarket={handleCreateMarket}
        />

        {betModal && (
          <PlaceBetModal
            isOpen={betModal.isOpen}
            onClose={() => setBetModal(null)}
            marketQuestion={betModal.marketQuestion}
            outcomeName={betModal.outcomeName}
            outcomeOdds={betModal.outcomeOdds}
            outcomeColor={betModal.outcomeColor}
            onPlaceBet={handleBetSubmit}
          />
        )}
      </div>
    </div>
  );
}
