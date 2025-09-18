import { create } from 'ipfs-http-client';

export class IPFSService {
  private client;

  constructor() {
    // Initialize IPFS client with Infura or Pinata
    const projectId = process.env.INFURA_PROJECT_ID || process.env.PINATA_API_KEY;
    const projectSecret = process.env.INFURA_PROJECT_SECRET || process.env.PINATA_SECRET_API_KEY;

    if (projectId && projectSecret) {
      this.client = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
          authorization: `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`
        }
      });
    } else {
      // Fallback to public gateway (read-only)
      console.warn('IPFS credentials not provided, using public gateway');
    }
  }

  /**
   * Upload frame metadata to IPFS
   */
  async uploadFrameMetadata(metadata: FrameMetadata): Promise<{ success: boolean; cid?: string; url?: string; error?: string }> {
    try {
      if (!this.client) {
        throw new Error('IPFS client not initialized');
      }

      // Convert metadata to JSON
      const metadataJson = JSON.stringify(metadata, null, 2);

      // Add to IPFS
      const result = await this.client.add({
        path: `frame-metadata-${Date.now()}.json`,
        content: metadataJson
      });

      const cid = result.cid.toString();
      const url = `https://ipfs.io/ipfs/${cid}`;

      console.log(`📦 Uploaded frame metadata to IPFS: ${url}`);

      return {
        success: true,
        cid,
        url
      };

    } catch (error) {
      console.error('Error uploading to IPFS:', error);

      // Fallback: return mock data for development
      const mockCid = `Qm${Math.random().toString(36).substr(2, 44)}`;
      const mockUrl = `https://ipfs.io/ipfs/${mockCid}`;

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cid: mockCid,
        url: mockUrl
      };
    }
  }

  /**
   * Upload image to IPFS
   */
  async uploadImage(imageBuffer: Buffer, filename: string): Promise<{ success: boolean; cid?: string; url?: string; error?: string }> {
    try {
      if (!this.client) {
        throw new Error('IPFS client not initialized');
      }

      const result = await this.client.add({
        path: filename,
        content: imageBuffer
      });

      const cid = result.cid.toString();
      const url = `https://ipfs.io/ipfs/${cid}`;

      console.log(`🖼️ Uploaded image to IPFS: ${url}`);

      return {
        success: true,
        cid,
        url
      };

    } catch (error) {
      console.error('Error uploading image to IPFS:', error);

      // Fallback: return mock data
      const mockCid = `Qm${Math.random().toString(36).substr(2, 44)}`;
      const mockUrl = `https://ipfs.io/ipfs/${mockCid}`;

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cid: mockCid,
        url: mockUrl
      };
    }
  }

  /**
   * Generate frame metadata for a market
   */
  generateMarketFrameMetadata(market: any): FrameMetadata {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return {
      'fc:frame': 'vNext',
      'fc:frame:image': `${baseUrl}/api/og/market/${market.marketId}`,
      'fc:frame:button:1': `${market.outcomes[0].name} (${market.outcomes[0].odds.toFixed(1)}x)`,
      'fc:frame:button:2': `${market.outcomes[1].name} (${market.outcomes[1].odds.toFixed(1)}x)`,
      'fc:frame:button:3': market.outcomes.length > 2 ? `${market.outcomes[2].name} (${market.outcomes[2].odds.toFixed(1)}x)` : 'View Details',
      'fc:frame:button:4': 'My Bets',
      'fc:frame:input:text': 'Enter bet amount (ETH)',
      'fc:frame:post_url': `${baseUrl}/api/farcaster/interactions`,
      'og:title': market.question,
      'og:description': `Pool: ${market.poolAmount} ETH | ${market.participants} participants`,
      'og:image': `${baseUrl}/api/og/market/${market.marketId}`
    };
  }

  /**
   * Generate frame metadata for market creation
   */
  generateCreateMarketFrameMetadata(): FrameMetadata {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return {
      'fc:frame': 'vNext',
      'fc:frame:image': `${baseUrl}/api/og/create-market`,
      'fc:frame:button:1': 'Enter Question',
      'fc:frame:input:text': 'What\'s your prediction question?',
      'fc:frame:post_url': `${baseUrl}/api/farcaster/interactions`,
      'og:title': 'Create Prediction Market',
      'og:description': 'Launch a prediction market for your stream',
      'og:image': `${baseUrl}/api/og/create-market`
    };
  }

  /**
   * Generate frame metadata for bet confirmation
   */
  generateBetConfirmationFrameMetadata(betDetails: any): FrameMetadata {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return {
      'fc:frame': 'vNext',
      'fc:frame:image': `${baseUrl}/api/og/bet-placed`,
      'fc:frame:button:1': 'View Markets',
      'fc:frame:button:2': 'My Bets',
      'fc:frame:post_url': `${baseUrl}/api/farcaster/interactions`,
      'og:title': 'Bet Placed Successfully!',
      'og:description': `You bet ${betDetails.amount} ETH on "${betDetails.outcome}"`,
      'og:image': `${baseUrl}/api/og/bet-placed`
    };
  }

  /**
   * Generate frame metadata for user's bets
   */
  generateMyBetsFrameMetadata(userBets: any[]): FrameMetadata {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return {
      'fc:frame': 'vNext',
      'fc:frame:image': `${baseUrl}/api/og/my-bets`,
      'fc:frame:button:1': 'View Markets',
      'fc:frame:button:2': 'Create Market',
      'fc:frame:post_url': `${baseUrl}/api/farcaster/interactions`,
      'og:title': 'My Prediction Bets',
      'og:description': `You have ${userBets.length} active predictions`,
      'og:image': `${baseUrl}/api/og/my-bets`
    };
  }

  /**
   * Pin content to ensure persistence
   */
  async pinContent(cid: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.client) {
        throw new Error('IPFS client not initialized');
      }

      await this.client.pin.add(cid);

      console.log(`📌 Pinned content to IPFS: ${cid}`);

      return { success: true };

    } catch (error) {
      console.error('Error pinning content:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get content from IPFS
   */
  async getContent(cid: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      if (!this.client) {
        throw new Error('IPFS client not initialized');
      }

      const chunks = [];
      for await (const chunk of this.client.cat(cid)) {
        chunks.push(chunk);
      }

      const data = Buffer.concat(chunks).toString();

      return {
        success: true,
        data: JSON.parse(data)
      };

    } catch (error) {
      console.error('Error getting content from IPFS:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export interface FrameMetadata {
  'fc:frame': string;
  'fc:frame:image': string;
  'fc:frame:button:1': string;
  'fc:frame:button:2'?: string;
  'fc:frame:button:3'?: string;
  'fc:frame:button:4'?: string;
  'fc:frame:input:text'?: string;
  'fc:frame:post_url'?: string;
  'og:title': string;
  'og:description': string;
  'og:image': string;
  [key: string]: string | undefined;
}

// Singleton instance
export const ipfsService = new IPFSService();

