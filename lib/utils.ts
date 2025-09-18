import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'ETH'): string {
  return `${amount.toFixed(4)} ${currency}`;
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

export function calculateOdds(totalBets: number, outcomeBets: number): number {
  if (totalBets === 0 || outcomeBets === 0) return 2.0;
  return totalBets / outcomeBets;
}

export function calculatePotentialPayout(betAmount: number, odds: number): number {
  return betAmount * odds;
}

export function generateMarketId(): string {
  return `market_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateBetId(): string {
  return `bet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getRandomColor(): string {
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#F97316'];
  return colors[Math.floor(Math.random() * colors.length)];
}
