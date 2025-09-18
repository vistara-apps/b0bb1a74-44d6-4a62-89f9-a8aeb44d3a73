'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { formatCurrency, calculatePotentialPayout } from '@/lib/utils';
import { X, TrendingUp } from 'lucide-react';

interface PlaceBetModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketQuestion: string;
  outcomeName: string;
  outcomeOdds: number;
  outcomeColor: string;
  onPlaceBet: (amount: number) => void;
}

export function PlaceBetModal({
  isOpen,
  onClose,
  marketQuestion,
  outcomeName,
  outcomeOdds,
  outcomeColor,
  onPlaceBet
}: PlaceBetModalProps) {
  const [betAmount, setBetAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numericAmount = parseFloat(betAmount) || 0;
  const potentialPayout = calculatePotentialPayout(numericAmount, outcomeOdds);
  const potentialProfit = potentialPayout - numericAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) return;

    setIsSubmitting(true);
    
    try {
      await onPlaceBet(numericAmount);
      setBetAmount('');
      onClose();
    } catch (error) {
      console.error('Error placing bet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickAmounts = [0.01, 0.05, 0.1, 0.25];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold gradient-text">Place Bet</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-textPrimary mb-2">{marketQuestion}</h3>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: outcomeColor }}
              />
              <span className="font-semibold">{outcomeName}</span>
              <span className="text-textSecondary">at {outcomeOdds.toFixed(2)}x</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              label="Bet Amount (ETH)"
              type="number"
              step="0.001"
              min="0.001"
              placeholder="0.01"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              required
            />
            
            {/* Quick amount buttons */}
            <div className="flex gap-2 mt-2">
              {quickAmounts.map(amount => (
                <Button
                  key={amount}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setBetAmount(amount.toString())}
                  className="text-xs"
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>
          </div>

          {/* Payout calculation */}
          {numericAmount > 0 && (
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-textSecondary">Bet Amount</span>
                <span className="font-medium">{formatCurrency(numericAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-textSecondary">Potential Profit</span>
                <span className="font-medium text-green-600">
                  +{formatCurrency(potentialProfit)}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="font-medium">Total Payout</span>
                <span className="font-bold text-lg gradient-text">
                  {formatCurrency(potentialPayout)}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={numericAmount <= 0}
              className="flex-1"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Place Bet
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
