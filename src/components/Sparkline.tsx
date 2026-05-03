import React, { useMemo } from 'react';

interface SparklineProps {
  data: number[];
  isPositive: boolean;
  width?: number;
  height?: number;
}

const Sparkline: React.FC<SparklineProps> = ({ 
  data, 
  isPositive, 
  width = 120, 
  height = 40 
}) => {
  const padding = 2;
  
  const { points, fillPoints, lastPointX, lastPointY } = useMemo(() => {
    if (data.length < 2) {
      return { points: '', fillPoints: '', lastPointX: 0, lastPointY: 0 };
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const xStep = (width - padding * 2) / (data.length - 1);

    const pointsArray = data.map((value, index) => {
      const x = padding + index * xStep;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    });

    const points = pointsArray.join(' ');
    
    const firstX = padding;
    const lastX = padding + (data.length - 1) * xStep;
    const bottomY = height - padding;
    const lastValue = data[data.length - 1];
    const lastY = height - padding - ((lastValue - min) / range) * (height - padding * 2);
    
    const fillPoints = `${firstX},${bottomY} ${points} ${lastX},${bottomY}`;

    return { points, fillPoints, lastPointX: lastX, lastPointY: lastY };
  }, [data, width, height, padding]);

  if (data.length < 2) {
    return null;
  }

  const strokeColor = isPositive ? 'var(--color-green)' : 'var(--color-red)';

  return (
    <svg 
      width={width} 
      height={height} 
      className="sparkline"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient 
          id={`gradient-${isPositive ? 'up' : 'down'}`} 
          x1="0%" 
          y1="0%" 
          x2="0%" 
          y2="100%"
        >
          <stop 
            offset="0%" 
            stopColor={isPositive ? 'var(--color-green)' : 'var(--color-red)'} 
            stopOpacity="0.3" 
          />
          <stop 
            offset="100%" 
            stopColor={isPositive ? 'var(--color-green)' : 'var(--color-red)'} 
            stopOpacity="0.05" 
          />
        </linearGradient>
      </defs>
      
      <polygon 
        points={fillPoints} 
        fill={`url(#gradient-${isPositive ? 'up' : 'down'})`}
      />
      
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      <circle
        cx={lastPointX}
        cy={lastPointY}
        r="3"
        fill={strokeColor}
      />
    </svg>
  );
};

export default Sparkline;
