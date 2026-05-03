import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CryptoCard from './components/CryptoCard';
import CryptoDetailPanel from './components/CryptoDetailPanel';
import { initialCryptoData } from './data/mockData';
import './App.css';

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

type SortDirection = 'asc' | 'desc';
type SortField = 'price' | 'change24h' | 'name';
type PriceChangeMap = Record<string, 'up' | 'down' | null>;
type SparklineDataMap = Record<string, number[]>;

const defaultSortField: SortField = 'change24h';
const defaultSortDirection: SortDirection = 'desc';
const SPARKLINE_POINTS = 24;

const generateInitialSparklineData = (
  currentPrice: number,
  change24h: number,
  points: number = SPARKLINE_POINTS
): number[] => {
  const data: number[] = [];
  
  const startPrice = currentPrice / (1 + change24h / 100);
  const trendPerPoint = (currentPrice - startPrice) / (points - 1);
  
  const volatility = currentPrice * 0.015;
  
  for (let i = 0; i < points; i++) {
    if (i === 0) {
      data.push(startPrice);
    } else if (i === points - 1) {
      data.push(currentPrice);
    } else {
      const baseValue = startPrice + trendPerPoint * i;
      const randomNoise = (Math.random() - 0.5) * volatility;
      const currentValue = baseValue + randomNoise;
      data.push(currentValue);
    }
  }
  
  return data;
};

const sortCryptosFn = (
  cryptosToSort: CryptoCurrency[],
  field: SortField,
  direction: SortDirection
): CryptoCurrency[] => {
  const sorted = [...cryptosToSort].sort((a, b) => {
    let comparison = 0;
    switch (field) {
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'change24h':
        comparison = a.change24h - b.change24h;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
    }
    return direction === 'asc' ? comparison : -comparison;
  });
  return sorted;
};

const getInitialSortedIds = (): string[] => {
  const sorted = sortCryptosFn(
    initialCryptoData as CryptoCurrency[],
    defaultSortField,
    defaultSortDirection
  );
  return sorted.map((c) => c.id);
};

const getInitialSparklineData = (): SparklineDataMap => {
  const data: SparklineDataMap = {};
  for (const crypto of initialCryptoData) {
    data[crypto.id] = generateInitialSparklineData(
      crypto.price,
      crypto.change24h
    );
  }
  return data;
};

const App: React.FC = () => {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>(
    initialCryptoData as CryptoCurrency[]
  );
  const [sortField, setSortField] = useState<SortField>(defaultSortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);
  const [priceChanges, setPriceChanges] = useState<PriceChangeMap>({});
  const [displayedIds, setDisplayedIds] = useState<string[]>(getInitialSortedIds);
  const [sparklineDataMap, setSparklineDataMap] = useState<SparklineDataMap>(getInitialSparklineData);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency | null>(null);

  const cryptoMap = useMemo(() => {
    return new Map(cryptos.map((c) => [c.id, c]));
  }, [cryptos]);

  const displayedCryptos = useMemo(() => {
    return displayedIds
      .map((id) => cryptoMap.get(id))
      .filter((c): c is CryptoCurrency => c !== undefined);
  }, [displayedIds, cryptoMap]);

  const simulatePriceChange = useCallback(() => {
    setCryptos((prevCryptos) => {
      const newPriceChanges: PriceChangeMap = {};
      const newSparklineUpdates: Record<string, number> = {};
      
      const newCryptos = prevCryptos.map((crypto) => {
        const priceChangePercent = (Math.random() - 0.5) * 0.02;
        const newPrice = crypto.price * (1 + priceChangePercent);
        
        const change24hChange = (Math.random() - 0.5) * 0.5;
        let newChange24h = crypto.change24h + change24hChange;
        newChange24h = Math.max(-15, Math.min(15, newChange24h));
        
        const priceChanged = priceChangePercent > 0.001 ? 'up' : priceChangePercent < -0.001 ? 'down' : null;
        if (priceChanged) {
          newPriceChanges[crypto.id] = priceChanged;
        }
        
        newSparklineUpdates[crypto.id] = newPrice;
        
        return {
          ...crypto,
          price: newPrice,
          change24h: newChange24h,
          marketCap: crypto.marketCap * (1 + (Math.random() - 0.5) * 0.01),
          volume24h: crypto.volume24h * (1 + (Math.random() - 0.5) * 0.02),
        };
      });
      
      setSparklineDataMap((prevMap) => {
        const newMap: SparklineDataMap = {};
        for (const [id, prevData] of Object.entries(prevMap)) {
          const newPrice = newSparklineUpdates[id];
          if (newPrice !== undefined) {
            const newData = [...prevData];
            newData.shift();
            newData.push(newPrice);
            newMap[id] = newData;
          } else {
            newMap[id] = prevData;
          }
        }
        return newMap;
      });
      
      setPriceChanges(newPriceChanges);
      
      setTimeout(() => {
        setPriceChanges({});
      }, 600);
      
      return newCryptos;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(simulatePriceChange, 3000);
    return () => clearInterval(interval);
  }, [simulatePriceChange]);

  const handleSort = useCallback(
    (field: SortField) => {
      let newSortDirection: SortDirection;
      
      if (sortField === field) {
        newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(newSortDirection);
      } else {
        setSortField(field);
        newSortDirection = 'desc';
        setSortDirection(newSortDirection);
      }
      
      const sorted = sortCryptosFn(
        cryptos,
        field,
        sortField === field ? newSortDirection : 'desc'
      );
      setDisplayedIds(sorted.map((c) => c.id));
    },
    [sortField, sortDirection, cryptos]
  );

  const stats = useMemo(() => {
    const totalMarketCap = cryptos.reduce((sum, c) => sum + c.marketCap, 0);
    const avgChange24h = cryptos.reduce((sum, c) => sum + c.change24h, 0) / cryptos.length;
    const positiveCount = cryptos.filter((c) => c.change24h >= 0).length;
    
    return {
      totalMarketCap,
      avgChange24h,
      positiveCount,
      totalCount: cryptos.length,
    };
  }, [cryptos]);

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

  const getSortIcon = (field: SortField): string => {
    if (sortField !== field) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Crypto Dashboard</h1>
          <p className="subtitle">Real-time cryptocurrency market data</p>
          <div className="live-indicator">
            <span className="live-dot"></span>
            <span>Live Updates</span>
          </div>
        </header>

        <div className="controls">
          <div className="sort-controls">
            <span className="sort-label">Sort by:</span>
            <div className="sort-buttons">
              <button
                className={`sort-btn ${sortField === 'change24h' ? 'active' : ''}`}
                onClick={() => handleSort('change24h')}
              >
                <span className="sort-icon">{getSortIcon('change24h')}</span>
                24h Change
              </button>
              <button
                className={`sort-btn ${sortField === 'price' ? 'active' : ''}`}
                onClick={() => handleSort('price')}
              >
                <span className="sort-icon">{getSortIcon('price')}</span>
                Price
              </button>
              <button
                className={`sort-btn ${sortField === 'name' ? 'active' : ''}`}
                onClick={() => handleSort('name')}
              >
                <span className="sort-icon">{getSortIcon('name')}</span>
                Name
              </button>
            </div>
          </div>

          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-label">Total Market Cap</span>
              <span className="stat-value">{formatLargeNumber(stats.totalMarketCap)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg 24h Change</span>
              <span className={`stat-value ${stats.avgChange24h >= 0 ? 'positive' : 'negative'}`}>
                {stats.avgChange24h >= 0 ? '+' : ''}{stats.avgChange24h.toFixed(2)}%
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Gainers / Total</span>
              <span className="stat-value">
                {stats.positiveCount} / {stats.totalCount}
              </span>
            </div>
          </div>
        </div>

        <div className="crypto-grid">
          {displayedCryptos.map((crypto, index) => (
            <CryptoCard
              key={crypto.id}
              crypto={crypto}
              rank={index + 1}
              priceChanged={priceChanges[crypto.id] || null}
              sparklineData={sparklineDataMap[crypto.id] || []}
              onClick={() => setSelectedCrypto(crypto)}
            />
          ))}
        </div>
      </div>
      
      {selectedCrypto && (
        <CryptoDetailPanel
          crypto={selectedCrypto}
          onClose={() => setSelectedCrypto(null)}
        />
      )}
    </div>
  );
};

export default App;
