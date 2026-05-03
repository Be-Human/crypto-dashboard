export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  icon: string;
}

export type SortDirection = 'asc' | 'desc';
export type SortField = 'price' | 'change24h' | 'name';

export interface CandlestickData {
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp: number;
}

export type TimeFrame = 'day' | 'week' | 'month';

export const CRYPTO_TYPES = {
  CryptoCurrency: 'CryptoCurrency',
  SortDirection: 'SortDirection',
  SortField: 'SortField',
  CandlestickData: 'CandlestickData',
  TimeFrame: 'TimeFrame',
} as const;
