import type { CandlestickData, TimeFrame } from '../types';

const generateCandlestick = (
  startPrice: number,
  volatility: number,
  trend: number
): CandlestickData => {
  const open = startPrice;
  const change = (Math.random() - 0.5 + trend) * volatility * open;
  const close = open + change;
  
  const highExtra = Math.random() * volatility * open * 0.5;
  const lowExtra = Math.random() * volatility * open * 0.5;
  
  const high = Math.max(open, close) + highExtra;
  const low = Math.min(open, close) - lowExtra;
  
  return {
    open,
    high,
    low,
    close,
    timestamp: Date.now(),
  };
};

export const generateKlineData = (
  currentPrice: number,
  timeFrame: TimeFrame,
  count: number = 30
): CandlestickData[] => {
  const data: CandlestickData[] = [];
  
  let volatility: number;
  let trendMultiplier: number;
  
  switch (timeFrame) {
    case 'day':
      volatility = 0.03;
      trendMultiplier = 0.1;
      break;
    case 'week':
      volatility = 0.08;
      trendMultiplier = 0.15;
      break;
    case 'month':
      volatility = 0.15;
      trendMultiplier = 0.2;
      break;
    default:
      volatility = 0.03;
      trendMultiplier = 0.1;
  }
  
  const baseTrend = (Math.random() - 0.5) * trendMultiplier;
  let price = currentPrice;
  
  const daysBack: number = timeFrame === 'day' ? 1 : timeFrame === 'week' ? 7 : 30;
  
  for (let i = count - 1; i >= 0; i--) {
    const candle = generateCandlestick(
      price,
      volatility,
      baseTrend
    );
    
    const daysAgo = i * daysBack;
    candle.timestamp = Date.now() - daysAgo * 24 * 60 * 60 * 1000;
    
    data.unshift(candle);
    price = candle.close;
  }
  
  if (data.length > 0) {
    data[0].close = currentPrice;
    if (data[0].high < currentPrice) {
      data[0].high = currentPrice;
    }
  }
  
  return data;
};
