import React from 'react';

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

const CryptoCard: React.FC<CryptoCardProps> = ({ crypto, rank, priceChanged }) => {
  const isPositive = crypto.change24h >= 0;
  const cardClassName = `crypto-card ${!isPositive ? 'negative' : ''}`;
  const changeClassName = `price-change ${isPositive ? 'positive' : 'negative'}`;

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
