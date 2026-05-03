import React, { useMemo } from 'react';
import { CandlestickData } from '../utils/klineData';

interface CandlestickChartProps {
  data: CandlestickData[];
  width?: number;
  height?: number;
}

const DEFAULT_PADDING = { top: 20, right: 60, bottom: 40, left: 20 };

const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  width = 800,
  height = 400,
}) => {
  const padding = DEFAULT_PADDING;
  
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const {
    candlesticks,
    priceTicks,
  } = useMemo(() => {
    if (data.length === 0) {
      return {
        candlesticks: [],
        priceTicks: [],
      };
    }

    const allPrices = data.flatMap((d) => [d.high, d.low]);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);

    const priceRange = maxPrice - minPrice || 1;
    const paddingFactor = priceRange * 0.05;
    const adjustedMin = minPrice - paddingFactor;
    const adjustedMax = maxPrice + paddingFactor;
    const adjustedRange = adjustedMax - adjustedMin || 1;

    const candleWidth = Math.max(
      4,
      Math.min(chartWidth / data.length - 4, 20)
    );
    const candleSpacing = chartWidth / data.length;

    const candlesticks = data.map((candle, index) => {
      const x = padding.left + index * candleSpacing + candleSpacing / 2;
      
      const isPositive = candle.close >= candle.open;
      const color = isPositive 
        ? 'var(--color-green)' 
        : 'var(--color-red)';

      const scaleY = (price: number): number => {
        return (
          height -
          padding.bottom -
          ((price - adjustedMin) / adjustedRange) * chartHeight
        );
      };

      const openY = scaleY(candle.open);
      const closeY = scaleY(candle.close);
      const highY = scaleY(candle.high);
      const lowY = scaleY(candle.low);

      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(Math.abs(closeY - openY), 1);

      return {
        x,
        candleWidth,
        color,
        isPositive,
        wickTop: { x, y1: highY, y2: bodyTop },
        wickBottom: { x, y1: bodyTop + bodyHeight, y2: lowY },
        body: { x: x - candleWidth / 2, y: bodyTop, width: candleWidth, height: bodyHeight },
        open: candle.open,
        close: candle.close,
        high: candle.high,
        low: candle.low,
      };
    });

    const tickCount = 6;
    const priceTicks: Array<{ price: number; y: number }> = [];
    for (let i = 0; i < tickCount; i++) {
      const price = adjustedMin + (adjustedRange * i) / (tickCount - 1);
      const y = height - padding.bottom - (adjustedRange * i / (tickCount - 1)) / adjustedRange * chartHeight;
      priceTicks.push({ price, y });
    }

    return {
      candlesticks,
      priceTicks,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, chartWidth, chartHeight, height]);

  if (data.length === 0) {
    return (
      <div className="candlestick-chart-loading">
        <span>No data available</span>
      </div>
    );
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

  return (
    <div className="candlestick-chart">
      <svg width={width} height={height} className="candlestick-svg">
        <defs>
          <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--border-color)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--border-color)" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {priceTicks.map((tick, index) => (
          <g key={index}>
            <line
              x1={padding.left}
              y1={tick.y}
              x2={width - padding.right}
              y2={tick.y}
              stroke="var(--border-color)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <text
              x={width - padding.right + 8}
              y={tick.y + 4}
              fill="var(--text-tertiary)"
              fontSize="12"
              fontFamily="var(--font-mono)"
            >
              {formatPrice(tick.price)}
            </text>
          </g>
        ))}

        {candlesticks.map((candle, index) => (
          <g key={index} className="candlestick">
            <line
              x1={candle.wickTop.x}
              y1={candle.wickTop.y1}
              x2={candle.wickTop.x}
              y2={candle.wickTop.y2}
              stroke={candle.color}
              strokeWidth="1.5"
            />
            <line
              x1={candle.wickBottom.x}
              y1={candle.wickBottom.y1}
              x2={candle.wickBottom.x}
              y2={candle.wickBottom.y2}
              stroke={candle.color}
              strokeWidth="1.5"
            />
            <rect
              x={candle.body.x}
              y={candle.body.y}
              width={candle.body.width}
              height={candle.body.height}
              fill={candle.color}
              rx="1"
            />
          </g>
        ))}
      </svg>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-indicator bullish"></span>
          <span className="legend-text">Bullish (Close ≥ Open)</span>
        </div>
        <div className="legend-item">
          <span className="legend-indicator bearish"></span>
          <span className="legend-text">Bearish (Close {'<'} Open)</span>
        </div>
      </div>
    </div>
  );
};

export default CandlestickChart;
