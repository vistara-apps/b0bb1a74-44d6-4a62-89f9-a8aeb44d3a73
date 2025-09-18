import { createPublicClient, createWalletClient, http, parseEther, formatEther } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { Market, ParticipantBet } from '../types';

export class BlockchainService {
  private publicClient;
  private walletClient;
  private contractAddress: `0x${string}`;

  constructor() {
    // Initialize Base network client
    this.publicClient = createPublicClient({
      chain: base,
      transport: http(process.env.BASE_RPC_URL || 'https://mainnet.base.org')
    });

    // Initialize wallet client for transactions
    if (process.env.PRIVATE_KEY) {
      const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
      this.walletClient = createWalletClient({
        account,
        chain: base,
        transport: http(process.env.BASE_RPC_URL || 'https://mainnet.base.org')
      });
    }

    // Prediction market contract address (would be deployed separately)
    this.contractAddress = (process.env.PREDICTION_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`;
  }

  /**
   * Place a bet on a prediction market
   */
  async placeBet(
    marketId: string,
    outcomeId: string,
    betAmount: number,
    userAddress: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.walletClient) {
        throw new Error('Wallet client not initialized');
      }

      const amountInWei = parseEther(betAmount.toString());

      // In a real implementation, this would call the prediction market contract
      // For demo purposes, we'll simulate the transaction
      console.log(`🎯 Placing bet: ${betAmount} ETH on outcome ${outcomeId} for market ${marketId}`);

      // Simulate transaction
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      return {
        success: true,
        txHash: mockTxHash
      };

    } catch (error) {
      console.error('Error placing bet:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Resolve a market and distribute payouts
   */
  async resolveMarket(
    marketId: string,
    winningOutcomeId: string,
    winningBets: ParticipantBet[]
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.walletClient) {
        throw new Error('Wallet client not initialized');
      }

      console.log(`🏆 Resolving market ${marketId} with winner ${winningOutcomeId}`);

      // Calculate total payout pool
      const totalPool = winningBets.reduce((sum, bet) => sum + bet.betAmount, 0);
      const creatorCut = totalPool * 0.05; // 5% creator fee
      const payoutPool = totalPool - creatorCut;

      // In a real implementation, this would:
      // 1. Call the contract to resolve the market
      // 2. Distribute payouts to winning participants
      // 3. Send creator cut to market creator

      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      return {
        success: true,
        txHash: mockTxHash
      };

    } catch (error) {
      console.error('Error resolving market:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get user's ETH balance
   */
  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.publicClient.getBalance({
        address: address as `0x${string}`
      });

      return formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  /**
   * Check if user has sufficient balance for a bet
   */
  async hasSufficientBalance(address: string, requiredAmount: number): Promise<boolean> {
    try {
      const balance = await this.getBalance(address);
      const balanceNum = parseFloat(balance);

      return balanceNum >= requiredAmount;
    } catch (error) {
      console.error('Error checking balance:', error);
      return false;
    }
  }

  /**
   * Get current gas price on Base
   */
  async getGasPrice(): Promise<string> {
    try {
      const gasPrice = await this.publicClient.getGasPrice();
      return formatEther(gasPrice);
    } catch (error) {
      console.error('Error getting gas price:', error);
      return '0';
    }
  }

  /**
   * Estimate gas cost for a bet transaction
   */
  async estimateBetGas(betAmount: number): Promise<{ gasLimit: string; gasCost: string }> {
    try {
      // Estimate gas for a typical bet transaction
      const gasLimit = 150000n; // Conservative estimate
      const gasPrice = await this.publicClient.getGasPrice();
      const gasCost = gasLimit * gasPrice;

      return {
        gasLimit: gasLimit.toString(),
        gasCost: formatEther(gasCost)
      };
    } catch (error) {
      console.error('Error estimating gas:', error);
      return {
        gasLimit: '150000',
        gasCost: '0.001' // Fallback estimate
      };
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(txHash: string): Promise<{
    status: 'pending' | 'confirmed' | 'failed';
    blockNumber?: number;
    gasUsed?: string;
  }> {
    try {
      const receipt = await this.publicClient.getTransactionReceipt({
        hash: txHash as `0x${string}`
      });

      return {
        status: receipt.status === 'success' ? 'confirmed' : 'failed',
        blockNumber: Number(receipt.blockNumber),
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      // Transaction might still be pending
      return {
        status: 'pending'
      };
    }
  }

  /**
   * Get Base network stats
   */
  async getNetworkStats(): Promise<{
    blockNumber: number;
    gasPrice: string;
    baseFee: string;
  }> {
    try {
      const [blockNumber, gasPrice, block] = await Promise.all([
        this.publicClient.getBlockNumber(),
        this.publicClient.getGasPrice(),
        this.publicClient.getBlock({ blockTag: 'latest' })
      ]);

      return {
        blockNumber: Number(blockNumber),
        gasPrice: formatEther(gasPrice),
        baseFee: block.baseFeePerGas ? formatEther(block.baseFeePerGas) : '0'
      };
    } catch (error) {
      console.error('Error getting network stats:', error);
      return {
        blockNumber: 0,
        gasPrice: '0',
        baseFee: '0'
      };
    }
  }

  /**
   * Validate Ethereum address
   */
  isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Format address for display
   */
  formatAddress(address: string): string {
    if (!this.isValidAddress(address)) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}

// Prediction Market Contract ABI (simplified)
export const PREDICTION_CONTRACT_ABI = [
  {
    inputs: [
      { name: 'marketId', type: 'bytes32' },
      { name: 'outcomeId', type: 'bytes32' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'placeBet',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'marketId', type: 'bytes32' },
      { name: 'winningOutcomeId', type: 'bytes32' }
    ],
    name: 'resolveMarket',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'marketId', type: 'bytes32' }],
    name: 'claimWinnings',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: '', type: 'bytes32' }],
    name: 'markets',
    outputs: [
      { name: 'creator', type: 'address' },
      { name: 'question', type: 'string' },
      { name: 'status', type: 'uint8' },
      { name: 'poolAmount', type: 'uint256' },
      { name: 'winningOutcomeId', type: 'bytes32' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// Singleton instance
export const blockchainService = new BlockchainService();

