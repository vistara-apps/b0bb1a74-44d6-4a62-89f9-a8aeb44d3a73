'use client';

import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { MarketAnalytics } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3,
  Calendar,
  Award
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface CreatorDashboardProps {
  analytics: MarketAnalytics;
  variant?: 'insights' | 'markets';
}

export function CreatorDashboard({ analytics, variant = 'insights' }: CreatorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'participants'>('overview');

  const handleResolveMarket = async (marketId: string, winningOutcomeId: string) => {
    try {
      const response = await fetch('/api/markets/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          marketId,
          winningOutcomeId,
          creatorAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' // Mock creator address
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Market resolved successfully! Transaction: ${result.txHash}\n\nPayout Summary:\n- Total Pool: ${result.summary.totalPool} ETH\n- Creator Cut: ${result.summary.creatorCut} ETH\n- Winners: ${result.summary.totalWinners}\n- Payout per Winner: ${result.summary.payoutPerWinner} ETH`);
      } else {
        alert(`Failed to resolve market: ${result.error}`);
      }
    } catch (error) {
      console.error('Error resolving market:', error);
      alert('Failed to resolve market. Please try again.');
    }
  };

  const stats = [
    {
      label: 'Total Revenue',
      value: formatCurrency(analytics.totalRevenue),
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      label: 'Total Participants',
      value: analytics.totalParticipants.toString(),
      change: '+8.2%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      label: 'Avg Bet Size',
      value: formatCurrency(analytics.averageBetSize),
      change: '+5.1%',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      label: 'Engagement Rate',
      value: formatPercentage(analytics.engagementRate),
      change: '+15.3%',
      icon: BarChart3,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Creator Dashboard</h1>
          <p className="text-textSecondary mt-1">
            Track your market performance and earnings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Last 7 days
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-textSecondary mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-textPrimary">{stat.value}</p>
                <p className={`text-sm ${stat.color} flex items-center gap-1 mt-1`}>
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-gray-50`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'revenue', label: 'Revenue' },
          { id: 'participants', label: 'Participants' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Markets */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Top Performing Markets</h3>
              <Award className="w-5 h-5 text-accent" />
            </div>
            <div className="space-y-3">
              {analytics.topPerformingMarkets.slice(0, 3).map((market, index) => (
                <div key={market.marketId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{market.question}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-textSecondary">
                      <span>{market.participants} participants</span>
                      <span>{formatCurrency(market.volume)} volume</span>
                    </div>
                  </div>
                  <Badge variant={index === 0 ? 'success' : index === 1 ? 'info' : 'default'}>
                    #{index + 1}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New market created</p>
                  <p className="text-xs text-textSecondary">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Market resolved</p>
                  <p className="text-xs text-textSecondary">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Payout processed</p>
                  <p className="text-xs text-textSecondary">1 hour ago</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'revenue' && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.revenueOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(240, 80%, 50%)" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(240, 80%, 50%)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {activeTab === 'participants' && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Participant Growth</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.participantGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [value, 'Participants']}
                />
                <Bar 
                  dataKey="participants" 
                  fill="hsl(180, 100%, 40%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Market Resolution */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Market Resolution</h3>
        <div className="space-y-4">
          <div className="text-sm text-textSecondary mb-4">
            Resolve completed markets to distribute payouts to winners
          </div>

          {/* Mock active markets for resolution */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium">Will ETH reach $5000 by end of 2024?</h4>
                <p className="text-sm text-textSecondary">Pool: 3.8 ETH • 45 participants</p>
              </div>
              <Button
                size="sm"
                onClick={() => handleResolveMarket('demo_market_1', 'yes')}
              >
                Resolve as "Yes"
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium">Will Bitcoin hit $100k in 2024?</h4>
                <p className="text-sm text-textSecondary">Pool: 4.0 ETH • 28 participants</p>
              </div>
              <Button
                size="sm"
                onClick={() => handleResolveMarket('demo_market_2', 'no')}
              >
                Resolve as "No"
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
