import React, { useMemo } from 'react';
import Sparkline from './Sparkline';

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

interface CryptoCardProps {
  crypto: CryptoCurrency;
  rank: number;
  priceChanged?: 'up' | 'down' | null;
}

const formatPrice = (price: number): string => {
  if (price >= 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(price);
};

const formatLargeNumber = (num: number): string => {
  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(2)}T`;
  }
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  }
  if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
};

const generateSparklineData = (
  currentPrice: number,
  change24h: number,
  points: number = 24
): number[] => {
  const data: number[] = [];
  
  const startPrice = currentPrice / (1 + change24h / 100);
  const trendPerPoint = (currentPrice - startPrice) / (points - 1);
  
  let currentValue = startPrice;
  const volatility = currentPrice * 0.015;
  
  for (let i = 0; i < points; i++) {
    if (i === 0) {
      data.push(startPrice);
    } else if (i === points - 1) {
      data.push(currentPrice);
    } else {
      const baseValue = startPrice + trendPerPoint * i;
      const randomNoise = (Math.random() - 0.5) * volatility;
      currentValue = baseValue + randomNoise;
      data.push(currentValue);
    }
  }
  
  return data;
};

const CryptoCard: React.FC<CryptoCardProps> = ({ crypto, rank, priceChanged }) => {
  const isPositive = crypto.change24h >= 0;
  const cardClassName = `crypto-card ${!isPositive ? 'negative' : ''}`;
  const changeClassName = `price-change ${isPositive ? 'positive' : 'negative'}`;
  
  const sparklineData = useMemo(() => {
    return generateSparklineData(crypto.price, crypto.change24h, 24);
  }, [crypto.price, crypto.change24h]);

  return (
    <div className={cardClassName}>
      <div className="card-header">
        <div className="crypto-info">
          <div className="crypto-icon">{crypto.icon}</div>
          <div className="crypto-details">
            <h3>{crypto.name}</h3>
            <span className="symbol">{crypto.symbol}</span>
          </div>
        </div>
        <div className="rank-badge">#{rank}</div>
      </div>

      <div className="price-section">
        <div className="price-row">
          <div className={`current-price ${priceChanged ? `price-${priceChanged}` : ''}`}>
            {formatPrice(crypto.price)}
          </div>
          <div className={changeClassName}>
            <span className="change-arrow">{isPositive ? '▲' : '▼'}</span>
            <span>{isPositive ? '+' : ''}{crypto.change24h.toFixed(2)}%</span>
          </div>
        </div>
        <div className="price-label">24h Change</div>
      </div>

      <div className="sparkline-section">
        <Sparkline 
          data={sparklineData} 
          isPositive={isPositive}
          width={280}
          height={50}
        />
      </div>

      <div className="card-stats">
        <div className="stat">
          <span className="label">Market Cap</span>
          <span className="value">{formatLargeNumber(crypto.marketCap)}</span>
        </div>
        <div className="stat">
          <span className="label">Volume (24h)</span>
          <span className="value">{formatLargeNumber(crypto.volume24h)}</span>
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;
