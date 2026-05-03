interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  icon: string;
}

export const initialCryptoData: CryptoCurrency[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 67432.50,
    change24h: 2.34,
    marketCap: 1324500000000,
    volume24h: 28450000000,
    icon: '₿',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3456.78,
    change24h: -1.23,
    marketCap: 415600000000,
    volume24h: 15670000000,
    icon: 'Ξ',
  },
  {
    id: 'binancecoin',
    name: 'BNB',
    symbol: 'BNB',
    price: 589.42,
    change24h: 0.87,
    marketCap: 89700000000,
    volume24h: 1230000000,
    icon: '◈',
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    price: 145.67,
    change24h: 4.56,
    marketCap: 65400000000,
    volume24h: 3450000000,
    icon: '◎',
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.4567,
    change24h: -2.34,
    marketCap: 16200000000,
    volume24h: 345000000,
    icon: '₳',
  },
  {
    id: 'xrp',
    name: 'XRP',
    symbol: 'XRP',
    price: 0.5234,
    change24h: 1.23,
    marketCap: 28900000000,
    volume24h: 1560000000,
    icon: '✕',
  },
  {
    id: 'dogecoin',
    name: 'Dogecoin',
    symbol: 'DOGE',
    price: 0.1234,
    change24h: 5.67,
    marketCap: 17500000000,
    volume24h: 890000000,
    icon: 'Ð',
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    price: 7.234,
    change24h: -0.56,
    marketCap: 10200000000,
    volume24h: 234000000,
    icon: '●',
  },
];
