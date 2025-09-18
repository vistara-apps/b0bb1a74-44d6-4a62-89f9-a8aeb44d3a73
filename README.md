# PredictaStream

Monetize your stream instantly with dynamic prediction markets.

## Overview

PredictaStream is a Next.js Base Mini App that enables creators to launch and manage instant prediction markets on their streams. The platform integrates with Farcaster for social features and Base blockchain for secure, gas-efficient transactions.

## Features

### Core Features
- **Instant Market Creation**: Creators can quickly set up prediction markets with questions, outcomes, and stakes
- **Dynamic Market Adjustment**: Markets automatically adjust prices based on real-time betting pressure and external data
- **Gamified Participation**: Users earn points, badges, and rewards for correct predictions with leaderboards
- **Creator Analytics Dashboard**: Comprehensive insights into market performance, engagement, and revenue

### Technical Features
- **Farcaster Frame Integration**: Seamless interaction within Farcaster client
- **Base Blockchain Integration**: Secure on-chain betting and payouts
- **IPFS Storage**: Decentralized storage for frame metadata
- **Real-time Market Adjustment**: Automated odds adjustment based on market dynamics

## Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Blockchain**: Base network, viem, wagmi
- **Storage**: IPFS (Infura/Pinata)
- **Social**: Farcaster (Neynar API)
- **UI Components**: Custom design system with shadcn/ui patterns

### Data Model

#### Entities
- **Creator**: Stream creator with analytics settings
- **Market**: Prediction market with outcomes and status
- **ParticipantBet**: Individual bets on market outcomes
- **Participant**: User profile with betting history and achievements

### API Endpoints

#### Farcaster Frame API
```
POST /api/farcaster/interactions
```
Handles frame interactions for market creation, betting, and navigation.

#### Market Resolution API
```
POST /api/markets/resolve
```
Resolves markets and processes payouts to winners.

#### OG Image Generation
```
GET /api/og/welcome
GET /api/og/create-market
GET /api/og/market/[marketId]
GET /api/og/bet-placed
GET /api/og/my-bets
GET /api/og/no-markets
```
Dynamic Open Graph images for social sharing.

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/b0bb1a74-44d6-4a62-89f9-a8aeb44d3a73.git
   cd predictastream
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```

   Configure the following environment variables:

   ```env
   # Base App Configuration
   NEXT_PUBLIC_BASE_URL=http://localhost:3000

   # Coinbase OnchainKit
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here

   # Base RPC Configuration
   BASE_RPC_URL=https://mainnet.base.org

   # Prediction Market Contract
   PREDICTION_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

   # Wallet Private Key (for contract interactions - keep secure!)
   PRIVATE_KEY=your_private_key_here

   # IPFS Configuration (choose one provider)
   INFURA_PROJECT_ID=your_infura_project_id
   INFURA_PROJECT_SECRET=your_infura_project_secret

   # OR
   PINATA_API_KEY=your_pinata_api_key
   PINATA_SECRET_API_KEY=your_pinata_secret_api_key

   # Farcaster API (Neynar)
   NEYNAR_API_KEY=your_neynar_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Documentation

### Farcaster Frame Interactions

The frame supports the following button interactions:

1. **Create Market** (Button 1): Opens market creation interface
2. **View Markets** (Button 2): Shows available active markets
3. **Place Bet** (Button 3): Initiates betting flow with amount input
4. **My Bets** (Button 4): Shows user's betting history

### Market Resolution

To resolve a market:

```javascript
const response = await fetch('/api/markets/resolve', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    marketId: 'market_123',
    winningOutcomeId: 'outcome_yes',
    creatorAddress: '0x...'
  })
});
```

### Services

#### Blockchain Service
Handles all Base network interactions:
- Balance checking
- Bet placement
- Market resolution
- Transaction monitoring

#### Market Adjustment Service
Automatically adjusts market odds based on:
- Betting pressure
- External data feeds
- Market volatility
- Time-based factors

#### IPFS Service
Manages decentralized storage:
- Frame metadata storage
- Image uploads
- Content pinning

#### Farcaster Service
Integrates with Farcaster ecosystem:
- User profile fetching
- Cast retrieval
- Social verification

## Business Model

### Revenue Streams
1. **Creator Fees**: 5% cut from each market pool
2. **Premium Features**: Subscription-based analytics and tools
3. **Tokenized Rewards**: Future staking and governance features

### User Flow

#### Creator Flow
1. Create market via frame or dashboard
2. Share market in stream/channel
3. Monitor engagement via analytics
4. Resolve market when event concludes
5. Receive automated payouts

#### Participant Flow
1. Discover market via Farcaster feed
2. Place bet using wallet
3. Track predictions in personal dashboard
4. Receive payouts for winning bets
5. Earn badges and climb leaderboards

## Deployment

### Production Deployment
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel/Netlify**
   - Connect your repository
   - Set environment variables
   - Deploy

3. **Contract Deployment**
   - Deploy prediction market contract to Base
   - Update contract address in environment

### Environment Setup
- Use production RPC endpoints
- Configure proper API keys
- Set up monitoring and alerts
- Enable SSL and security headers

## Security Considerations

### Smart Contract Security
- Use audited contracts
- Implement proper access controls
- Add emergency pause functionality
- Regular security audits

### API Security
- Rate limiting on all endpoints
- Input validation and sanitization
- Secure key management
- CORS configuration

### User Data Protection
- Minimal data collection
- On-chain privacy preservation
- Secure wallet interactions
- GDPR compliance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Check the documentation

---

Built with ❤️ for the Base ecosystem

