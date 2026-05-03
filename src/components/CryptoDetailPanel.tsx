import React, { useState, useEffect, useMemo } from 'react';
import CandlestickChart from './CandlestickChart';
import { generateKlineData } from '../utils/klineData';
import type { TimeFrame, CryptoCurrency } from '../types';

interface CryptoDetailPanelProps {
  crypto: CryptoCurrency;
  onClose: () => void;
}

const CryptoDetailPanel: React.FC<CryptoDetailPanelProps> = ({
  crypto,
  onClose,
}) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('day');
  const [isVisible, setIsVisible] = useState(false);

  const klineData = useMemo(() => {
    return generateKlineData(crypto.price, timeFrame, 30);
  }, [crypto.price, timeFrame]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleTimeFrameChange = (newTimeFrame: TimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

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

  const timeFrameLabels: Record<TimeFrame, string> = {
    day: '日 K',
    week: '周 K',
    month: '月 K',
  };

  const isPositive = crypto.change24h >= 0;

  return (
    <div className={`detail-panel-overlay ${isVisible ? 'visible' : ''}`}>
      <div className="detail-panel-backdrop" onClick={handleClose}></div>
      <div className={`detail-panel ${isVisible ? 'visible' : ''}`}>
        <div className="detail-panel-header">
          <div className="panel-title-section">
            <div className="crypto-icon-large">{crypto.icon}</div>
            <div className="panel-title-info">
              <h2>{crypto.name}</h2>
              <span className="panel-symbol">{crypto.symbol}</span>
            </div>
          </div>
          <button className="close-button" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="detail-panel-price-section">
          <div className="current-price-large">
            {formatPrice(crypto.price)}
          </div>
          <div className={`price-change-large ${isPositive ? 'positive' : 'negative'}`}>
            <span className="change-arrow">{isPositive ? '▲' : '▼'}</span>
            <span>{isPositive ? '+' : ''}{crypto.change24h.toFixed(2)}%</span>
            <span className="change-label"> (24h)</span>
          </div>
        </div>

        <div className="detail-panel-stats">
          <div className="stat-card">
            <span className="stat-label">Market Cap</span>
            <span className="stat-value">{formatLargeNumber(crypto.marketCap)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Volume (24h)</span>
            <span className="stat-value">{formatLargeNumber(crypto.volume24h)}</span>
          </div>
        </div>

        <div className="detail-panel-chart-section">
          <div className="timeframe-controls">
            <span className="timeframe-label">时间维度:</span>
            <div className="timeframe-buttons">
              {(['day', 'week', 'month'] as TimeFrame[]).map((tf) => (
                <button
                  key={tf}
                  className={`timeframe-btn ${timeFrame === tf ? 'active' : ''}`}
                  onClick={() => handleTimeFrameChange(tf)}
                >
                  {timeFrameLabels[tf]}
                </button>
              ))}
            </div>
          </div>

          <div className="chart-container">
            <CandlestickChart
              data={klineData}
              width={720}
              height={400}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetailPanel;
