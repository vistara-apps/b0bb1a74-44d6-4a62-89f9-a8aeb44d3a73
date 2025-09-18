export class FarcasterService {
  private readonly HUBS_API_BASE = 'https://api.neynar.com/v2/farcaster';
  private readonly NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

  constructor() {
    if (!this.NEYNAR_API_KEY) {
      console.warn('Neynar API key not provided - Farcaster features will be limited');
    }
  }

  /**
   * Get user profile by FID
   */
  async getUserProfile(fid: number): Promise<{
    success: boolean;
    profile?: FarcasterUser;
    error?: string;
  }> {
    try {
      if (!this.NEYNAR_API_KEY) {
        // Return mock data for development
        return {
          success: true,
          profile: {
            fid,
            username: `user${fid}`,
            displayName: `User ${fid}`,
            bio: 'Farcaster user',
            pfp: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fid}`,
            followerCount: Math.floor(Math.random() * 1000),
            followingCount: Math.floor(Math.random() * 500)
          }
        };
      }

      const response = await fetch(`${this.HUBS_API_BASE}/user/bulk?fids=${fid}`, {
        headers: {
          'api_key': this.NEYNAR_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }

      const data = await response.json();
      const user = data.users?.[0];

      if (!user) {
        throw new Error('User not found');
      }

      return {
        success: true,
        profile: {
          fid: user.fid,
          username: user.username,
          displayName: user.display_name,
          bio: user.profile?.bio?.text || '',
          pfp: user.pfp_url,
          followerCount: user.follower_count,
          followingCount: user.following_count
        }
      };

    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get user's recent casts
   */
  async getUserCasts(fid: number, limit: number = 10): Promise<{
    success: boolean;
    casts?: FarcasterCast[];
    error?: string;
  }> {
    try {
      if (!this.NEYNAR_API_KEY) {
        // Return mock data
        return {
          success: true,
          casts: Array.from({ length: limit }, (_, i) => ({
            hash: `0x${Math.random().toString(16).substr(2, 64)}`,
            text: `Mock cast ${i + 1} from user ${fid}`,
            timestamp: Date.now() - (i * 3600000),
            likes: Math.floor(Math.random() * 100),
            recasts: Math.floor(Math.random() * 20)
          }))
        };
      }

      const response = await fetch(
        `${this.HUBS_API_BASE}/cast?fid=${fid}&limit=${limit}`,
        {
          headers: {
            'api_key': this.NEYNAR_API_KEY
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user casts: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        casts: data.casts?.map((cast: any) => ({
          hash: cast.hash,
          text: cast.text,
          timestamp: new Date(cast.timestamp).getTime(),
          likes: cast.reactions?.likes_count || 0,
          recasts: cast.reactions?.recasts_count || 0
        })) || []
      };

    } catch (error) {
      console.error('Error fetching user casts:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Search for users by username
   */
  async searchUsers(query: string, limit: number = 10): Promise<{
    success: boolean;
    users?: FarcasterUser[];
    error?: string;
  }> {
    try {
      if (!this.NEYNAR_API_KEY) {
        // Return mock data
        return {
          success: true,
          users: Array.from({ length: Math.min(limit, 3) }, (_, i) => ({
            fid: 1000 + i,
            username: `${query}${i}`,
            displayName: `${query} User ${i}`,
            bio: `Mock user for ${query}`,
            pfp: `https://api.dicebear.com/7.x/avataaars/svg?seed=${query}${i}`,
            followerCount: Math.floor(Math.random() * 1000),
            followingCount: Math.floor(Math.random() * 500)
          }))
        };
      }

      const response = await fetch(
        `${this.HUBS_API_BASE}/user/search?q=${encodeURIComponent(query)}&limit=${limit}`,
        {
          headers: {
            'api_key': this.NEYNAR_API_KEY
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to search users: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        users: data.users?.map((user: any) => ({
          fid: user.fid,
          username: user.username,
          displayName: user.display_name,
          bio: user.profile?.bio?.text || '',
          pfp: user.pfp_url,
          followerCount: user.follower_count,
          followingCount: user.following_count
        })) || []
      };

    } catch (error) {
      console.error('Error searching users:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get cast by hash
   */
  async getCast(hash: string): Promise<{
    success: boolean;
    cast?: FarcasterCast;
    error?: string;
  }> {
    try {
      if (!this.NEYNAR_API_KEY) {
        // Return mock data
        return {
          success: true,
          cast: {
            hash,
            text: 'Mock cast content',
            timestamp: Date.now(),
            likes: Math.floor(Math.random() * 100),
            recasts: Math.floor(Math.random() * 20)
          }
        };
      }

      const response = await fetch(
        `${this.HUBS_API_BASE}/cast?identifier=${hash}&type=hash`,
        {
          headers: {
            'api_key': this.NEYNAR_API_KEY
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch cast: ${response.status}`);
      }

      const data = await response.json();
      const cast = data.cast;

      if (!cast) {
        throw new Error('Cast not found');
      }

      return {
        success: true,
        cast: {
          hash: cast.hash,
          text: cast.text,
          timestamp: new Date(cast.timestamp).getTime(),
          likes: cast.reactions?.likes_count || 0,
          recasts: cast.reactions?.recasts_count || 0
        }
      };

    } catch (error) {
      console.error('Error fetching cast:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Validate if a user exists on Farcaster
   */
  async validateUser(fid: number): Promise<boolean> {
    try {
      const result = await this.getUserProfile(fid);
      return result.success && !!result.profile;
    } catch (error) {
      console.error('Error validating user:', error);
      return false;
    }
  }

  /**
   * Get user's verification status
   */
  async getUserVerification(fid: number): Promise<{
    success: boolean;
    verified?: boolean;
    verifiedAddresses?: string[];
    error?: string;
  }> {
    try {
      if (!this.NEYNAR_API_KEY) {
        // Return mock data
        return {
          success: true,
          verified: Math.random() > 0.5,
          verifiedAddresses: [`0x${Math.random().toString(16).substr(2, 40)}`]
        };
      }

      const response = await fetch(
        `${this.HUBS_API_BASE}/user/bulk?fids=${fid}`,
        {
          headers: {
            'api_key': this.NEYNAR_API_KEY
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user verification: ${response.status}`);
      }

      const data = await response.json();
      const user = data.users?.[0];

      if (!user) {
        throw new Error('User not found');
      }

      return {
        success: true,
        verified: user.verified || false,
        verifiedAddresses: user.verified_addresses || []
      };

    } catch (error) {
      console.error('Error fetching user verification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  bio: string;
  pfp: string;
  followerCount: number;
  followingCount: number;
}

export interface FarcasterCast {
  hash: string;
  text: string;
  timestamp: number;
  likes: number;
  recasts: number;
}

// Singleton instance
export const farcasterService = new FarcasterService();

