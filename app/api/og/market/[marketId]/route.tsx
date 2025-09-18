import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Mock market data - in production this would come from a database
const mockMarkets: Record<string, any> = {
  'demo_market_1': {
    question: 'Will ETH reach $5000 by end of 2024?',
    outcomes: [
      { name: 'Yes', odds: 2.1, totalBets: 1.5, color: '#10B981' },
      { name: 'No', odds: 1.9, totalBets: 2.3, color: '#EF4444' }
    ],
    poolAmount: 3.8,
    participants: 45
  },
  'demo_market_2': {
    question: 'Will Bitcoin hit $100k in 2024?',
    outcomes: [
      { name: 'Yes', odds: 3.2, totalBets: 0.8, color: '#10B981' },
      { name: 'No', odds: 1.4, totalBets: 3.2, color: '#EF4444' }
    ],
    poolAmount: 4.0,
    participants: 28
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { marketId: string } }
) {
  const marketId = params.marketId;
  const market = mockMarkets[marketId];

  if (!market) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f3f4f6',
            fontSize: 24,
            color: '#374151',
          }}
        >
          Market not found
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px',
          color: 'white',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '32px', marginRight: '15px' }}>🎯</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>PredictaStream</div>
        </div>

        {/* Question */}
        <div style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '30px',
          lineHeight: '1.2'
        }}>
          {market.question}
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '30px',
          marginBottom: '30px',
          fontSize: '18px'
        }}>
          <div>Pool: {market.poolAmount} ETH</div>
          <div>Participants: {market.participants}</div>
        </div>

        {/* Outcomes */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {market.outcomes.map((outcome: any, index: number) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: `2px solid ${outcome.color}`,
                flex: '1',
                minWidth: '200px'
              }}
            >
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '10px',
                color: outcome.color
              }}>
                {outcome.name}
              </div>
              <div style={{ fontSize: '20px', marginBottom: '5px' }}>
                {outcome.odds.toFixed(1)}x odds
              </div>
              <div style={{ fontSize: '16px', opacity: 0.8 }}>
                {outcome.totalBets} ETH bet
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 'auto',
          fontSize: '16px',
          opacity: 0.8,
          textAlign: 'center'
        }}>
          Place your prediction on Base
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

