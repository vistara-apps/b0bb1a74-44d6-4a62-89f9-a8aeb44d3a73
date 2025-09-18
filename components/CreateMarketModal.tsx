'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { CREATOR_CUT_OPTIONS, MARKET_DURATION_OPTIONS, OUTCOME_COLORS } from '@/lib/constants';
import { generateMarketId } from '@/lib/utils';
import { X, Plus, Trash2 } from 'lucide-react';

interface CreateMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMarket: (market: any) => void;
}

interface OutcomeInput {
  id: string;
  name: string;
  color: string;
}

export function CreateMarketModal({ isOpen, onClose, onCreateMarket }: CreateMarketModalProps) {
  const [question, setQuestion] = useState('');
  const [outcomes, setOutcomes] = useState<OutcomeInput[]>([
    { id: '1', name: 'Yes', color: OUTCOME_COLORS[0] },
    { id: '2', name: 'No', color: OUTCOME_COLORS[1] }
  ]);
  const [creatorCut, setCreatorCut] = useState(5);
  const [duration, setDuration] = useState(1800);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addOutcome = () => {
    if (outcomes.length < 6) {
      const newOutcome: OutcomeInput = {
        id: Date.now().toString(),
        name: '',
        color: OUTCOME_COLORS[outcomes.length % OUTCOME_COLORS.length]
      };
      setOutcomes([...outcomes, newOutcome]);
    }
  };

  const removeOutcome = (id: string) => {
    if (outcomes.length > 2) {
      setOutcomes(outcomes.filter(outcome => outcome.id !== id));
    }
  };

  const updateOutcome = (id: string, name: string) => {
    setOutcomes(outcomes.map(outcome => 
      outcome.id === id ? { ...outcome, name } : outcome
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || outcomes.some(o => !o.name.trim())) return;

    setIsSubmitting(true);
    
    try {
      const newMarket = {
        marketId: generateMarketId(),
        creatorId: 'current_user',
        question: question.trim(),
        outcomes: outcomes.map(outcome => ({
          outcomeId: outcome.id,
          name: outcome.name.trim(),
          odds: 2.0,
          totalBets: 0,
          color: outcome.color
        })),
        status: 'active' as const,
        creationTimestamp: Date.now(),
        poolAmount: 0,
        creatorCutPercentage: creatorCut,
        participants: 0,
        volume: 0
      };

      onCreateMarket(newMarket);
      
      // Reset form
      setQuestion('');
      setOutcomes([
        { id: '1', name: 'Yes', color: OUTCOME_COLORS[0] },
        { id: '2', name: 'No', color: OUTCOME_COLORS[1] }
      ]);
      setCreatorCut(5);
      setDuration(1800);
      
      onClose();
    } catch (error) {
      console.error('Error creating market:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Create New Market</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question */}
          <Input
            label="Market Question"
            placeholder="e.g., Will this stream reach 1000 viewers?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />

          {/* Outcomes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-textPrimary">
                Possible Outcomes
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addOutcome}
                disabled={outcomes.length >= 6}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Outcome
              </Button>
            </div>
            
            {outcomes.map((outcome, index) => (
              <div key={outcome.id} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: outcome.color }}
                />
                <Input
                  placeholder={`Outcome ${index + 1}`}
                  value={outcome.name}
                  onChange={(e) => updateOutcome(outcome.id, e.target.value)}
                  className="flex-1"
                  required
                />
                {outcomes.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOutcome(outcome.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Creator Cut */}
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Creator Cut
            </label>
            <select
              value={creatorCut}
              onChange={(e) => setCreatorCut(Number(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {CREATOR_CUT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Market Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {MARKET_DURATION_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
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
              className="flex-1"
            >
              Create Market
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
