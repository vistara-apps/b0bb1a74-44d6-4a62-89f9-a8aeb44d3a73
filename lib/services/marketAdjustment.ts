import { Market, Outcome } from '../types';

export class MarketAdjustmentService {
  private adjustmentInterval: NodeJS.Timeout | null = null;
  private readonly ADJUSTMENT_INTERVAL = 30000; // 30 seconds
  private readonly VOLATILITY_FACTOR = 0.1; // How much external factors affect odds
  private readonly MOMENTUM_FACTOR = 0.05; // How much recent bets affect odds

  constructor() {
    this.startAdjustmentLoop();
  }

  /**
   * Start the automatic market adjustment loop
   */
  startAdjustmentLoop() {
    if (this.adjustmentInterval) {
      clearInterval(this.adjustmentInterval);
    }

    this.adjustmentInterval = setInterval(() => {
      this.adjustMarkets();
    }, this.ADJUSTMENT_INTERVAL);
  }

  /**
   * Stop the automatic market adjustment loop
   */
  stopAdjustmentLoop() {
    if (this.adjustmentInterval) {
      clearInterval(this.adjustmentInterval);
      this.adjustmentInterval = null;
    }
  }

  /**
   * Adjust all active markets based on various factors
   */
  private adjustMarkets() {
    // In a real implementation, this would fetch markets from a database
    // For now, we'll work with the mock data
    console.log('🔄 Adjusting market odds...');
  }

  /**
   * Adjust odds for a specific market based on betting patterns and external data
   */
  adjustMarketOdds(market: Market, externalFactors: ExternalFactors = {}): Market {
    if (market.status !== 'active') {
      return market;
    }

    const adjustedOutcomes = market.outcomes.map(outcome =>
      this.adjustOutcomeOdds(outcome, market, externalFactors)
    );

    return {
      ...market,
      outcomes: adjustedOutcomes
    };
  }

  /**
   * Adjust odds for a specific outcome
   */
  private adjustOutcomeOdds(
    outcome: Outcome,
    market: Market,
    externalFactors: ExternalFactors
  ): Outcome {
    const totalPool = market.outcomes.reduce((sum, o) => sum + o.totalBets, 0);

    if (totalPool === 0) {
      return outcome;
    }

    // Calculate current market share
    const marketShare = outcome.totalBets / totalPool;

    // Apply momentum adjustment based on recent betting patterns
    const momentumAdjustment = this.calculateMomentumAdjustment(outcome, market);

    // Apply external factor adjustment
    const externalAdjustment = this.calculateExternalAdjustment(outcome, externalFactors);

    // Calculate new odds using Kelly Criterion inspired formula
    const newOdds = this.calculateKellyOdds(marketShare, momentumAdjustment, externalAdjustment);

    return {
      ...outcome,
      odds: Math.max(1.1, Math.min(10.0, newOdds)) // Clamp between 1.1x and 10.0x
    };
  }

  /**
   * Calculate momentum adjustment based on recent betting velocity
   */
  private calculateMomentumAdjustment(outcome: Outcome, market: Market): number {
    // Simple momentum calculation - in reality this would analyze bet timing and volume
    const timeSinceCreation = Date.now() - market.creationTimestamp;
    const hoursActive = timeSinceCreation / (1000 * 60 * 60);

    // More recent markets have higher momentum potential
    if (hoursActive < 1) {
      return this.MOMENTUM_FACTOR * 2;
    } else if (hoursActive < 24) {
      return this.MOMENTUM_FACTOR;
    }

    return 0;
  }

  /**
   * Calculate external factor adjustment (news, social sentiment, etc.)
   */
  private calculateExternalAdjustment(outcome: Outcome, externalFactors: ExternalFactors): number {
    // This would integrate with external APIs for real-time data
    // For demo purposes, we'll use random factors
    const sentimentImpact = (Math.random() - 0.5) * this.VOLATILITY_FACTOR;
    const newsImpact = (Math.random() - 0.5) * this.VOLATILITY_FACTOR;

    return sentimentImpact + newsImpact;
  }

  /**
   * Calculate new odds using Kelly Criterion principles
   */
  private calculateKellyOdds(
    marketShare: number,
    momentumAdjustment: number,
    externalAdjustment: number
  ): number {
    // Kelly Criterion: f = (bp - q) / b
    // Where: b = odds - 1, p = probability, q = 1 - p

    // Estimate probability from market share (with some noise)
    const estimatedProb = marketShare + momentumAdjustment + externalAdjustment;
    const clampedProb = Math.max(0.05, Math.min(0.95, estimatedProb));

    // Calculate Kelly odds
    const b = 1; // Simplified - in reality this would be more complex
    const q = 1 - clampedProb;

    const kellyFraction = (clampedProb * b - q) / b;

    // Convert back to odds format (1 + kellyFraction)
    return 1 + kellyFraction;
  }

  /**
   * Get market volatility metrics
   */
  getMarketVolatility(market: Market): MarketVolatility {
    const totalPool = market.outcomes.reduce((sum, o) => sum + o.totalBets, 0);
    const outcomeRatios = market.outcomes.map(o => o.totalBets / totalPool);

    // Calculate variance in outcome distributions
    const mean = outcomeRatios.reduce((sum, ratio) => sum + ratio, 0) / outcomeRatios.length;
    const variance = outcomeRatios.reduce((sum, ratio) => sum + Math.pow(ratio - mean, 2), 0) / outcomeRatios.length;

    return {
      variance,
      volatility: Math.sqrt(variance),
      isHighVolatility: variance > 0.15,
      recommendedAdjustment: variance > 0.2 ? 'increase_spread' : 'maintain'
    };
  }

  /**
   * Predict market movement based on current trends
   */
  predictMarketMovement(market: Market): MarketPrediction {
    const volatility = this.getMarketVolatility(market);
    const totalPool = market.outcomes.reduce((sum, o) => sum + o.totalBets, 0);

    // Simple prediction logic
    const leadingOutcome = market.outcomes.reduce((prev, current) =>
      prev.totalBets > current.totalBets ? prev : current
    );

    const confidence = leadingOutcome.totalBets / totalPool;

    return {
      predictedWinner: leadingOutcome.name,
      confidence,
      timeToResolution: this.estimateTimeToResolution(market),
      recommendedAction: confidence > 0.7 ? 'resolve_early' : 'continue_monitoring'
    };
  }

  /**
   * Estimate time until market resolution based on activity
   */
  private estimateTimeToResolution(market: Market): number {
    const totalPool = market.outcomes.reduce((sum, o) => sum + o.totalBets, 0);
    const timeSinceCreation = Date.now() - market.creationTimestamp;
    const hoursActive = timeSinceCreation / (1000 * 60 * 60);

    // More active markets resolve faster
    if (totalPool > 10) {
      return Math.max(1, 24 - hoursActive);
    } else if (totalPool > 5) {
      return Math.max(1, 48 - hoursActive);
    }

    return Math.max(1, 72 - hoursActive);
  }
}

export interface ExternalFactors {
  sentiment?: number; // -1 to 1
  newsImpact?: number; // -1 to 1
  socialVolume?: number; // 0 to 1
  marketData?: Record<string, any>;
}

export interface MarketVolatility {
  variance: number;
  volatility: number;
  isHighVolatility: boolean;
  recommendedAdjustment: 'increase_spread' | 'maintain' | 'decrease_spread';
}

export interface MarketPrediction {
  predictedWinner: string;
  confidence: number;
  timeToResolution: number; // hours
  recommendedAction: 'resolve_early' | 'continue_monitoring' | 'increase_liquidity';
}

// Singleton instance
export const marketAdjustmentService = new MarketAdjustmentService();

