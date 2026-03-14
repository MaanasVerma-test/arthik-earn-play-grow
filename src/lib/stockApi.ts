import axios from 'axios';
import { mockStocks } from '../data/mockData';

export type TimeRange = '1D' | '5D' | '15D' | '1M' | '5M' | '1Y';

// Cache to store historical data and prevent redundant API calls
const chartCache: Record<string, { data: ChartDataPoint[], timestamp: number }> = {};
const quoteCache: Record<string, { data: StockQuote, timestamp: number }> = {};
const CACHE_DURATION_MS = 60 * 1000; // 1 minute for quotes and charts (Yahoo is free, but let's be polite)

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  isMock?: boolean;
}

export interface ChartDataPoint {
  day: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  timestamp?: number;
}

// ------------------------------------------------------------------
// Mock Fallback Engine (Volatility Simulator)
// ------------------------------------------------------------------

const mockPrices: Record<string, number> = {};

export const getMockQuote = (symbol: string): StockQuote => {
  const baseStock = mockStocks.find(s => s.symbol === symbol) || mockStocks[0];
  
  if (!mockPrices[symbol]) mockPrices[symbol] = baseStock.price;

  const volatility = 0.002; 
  const changePct = (Math.random() - 0.5) * 2 * volatility;
  
  const newPrice = mockPrices[symbol] * (1 + changePct);
  mockPrices[symbol] = newPrice;

  const absoluteChange = newPrice - baseStock.price;
  const totalChangePercent = (absoluteChange / baseStock.price) * 100;

  return {
    symbol,
    price: Number(newPrice.toFixed(2)),
    change: Number(absoluteChange.toFixed(2)),
    changePercent: Number(totalChangePercent.toFixed(2)),
    isMock: true
  };
};

const getTradingDays = (range: TimeRange): number => {
  switch(range) {
    case '1D': return 24;
    case '5D': return 5;
    case '15D': return 15;
    case '1M': return 22;
    case '5M': return 110;
    case '1Y': return 252;
    default: return 22;
  }
};

export const getMockHistoricalData = (symbol: string, range: TimeRange = '1M'): ChartDataPoint[] => {
  const baseStock = mockStocks.find(s => s.symbol === symbol) || mockStocks[0];
  const days = getTradingDays(range);
  
  const points: ChartDataPoint[] = [];
  let currentPrice = baseStock.price * 0.8; 

  for(let i = days; i >= 0; i--) {
      const volatility = range === '1D' ? 0.001 : 0.01;
      const open = currentPrice;
      const close = currentPrice * (1 + ((Math.random() - 0.45) * 2 * volatility));
      const high = Math.max(open, close) * (1 + Math.random() * volatility);
      const low = Math.min(open, close) * (1 - Math.random() * volatility);
      
      const label = range === '1D' ? `${10+Math.abs(days-i)}:00` : `D-${i}`;
      
      points.push({ 
          day: label, 
          price: Number(close.toFixed(2)),
          open: Number(open.toFixed(2)),
          high: Number(high.toFixed(2)),
          low: Number(low.toFixed(2)),
           close: Number(close.toFixed(2)),
           timestamp: new Date().getTime() - (i * 24 * 60 * 60 * 1000)
      });
      currentPrice = close;
  }

  const quote = getMockQuote(symbol);
  if (points.length > 0) {
      points[points.length - 1].price = quote.price;
  }
  
  return points;
};

// ------------------------------------------------------------------
// Live API Methods (Yahoo Finance via Vite Proxy)
// ------------------------------------------------------------------

const getYahooSymbol = (symbol: string) => {
    // Yahoo uses .NS for NSE and .BO for BSE
    // We'll default to NSE for Indian stocks in our mock list
    return `${symbol}.NS`;
};

export const fetchLiveQuote = async (symbol: string): Promise<StockQuote> => {
    const cacheKey = `quote_${symbol}`;
    const cached = quoteCache[cacheKey];
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION_MS)) {
        return cached.data;
    }

    try {
        const yahooSymbol = getYahooSymbol(symbol);
        // We use the chart endpoint to get the latest quote easily without crumb
        const response = await axios.get(`/api/yahoo/v8/finance/chart/${yahooSymbol}`, {
            params: { range: '1d', interval: '1d' }
        });

        const result = response.data?.chart?.result?.[0];
        if (!result) throw new Error("Invalid Yahoo Finance response");

        const meta = result.meta;
        const price = meta.regularMarketPrice;
        const previousClose = meta.chartPreviousClose || meta.previousClose;
        const change = price - previousClose;
        const changePercent = (change / previousClose) * 100;

        const quote: StockQuote = {
            symbol,
            price: Number(price.toFixed(2)),
            change: Number(change.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
            isMock: false
        };

        quoteCache[cacheKey] = { data: quote, timestamp: Date.now() };
        return quote;

    } catch (error) {
        console.error(`Error fetching live quote for ${symbol} from Yahoo:`, error);
        return getMockQuote(symbol);
    }
};

export const fetchHistoricalData = async (symbol: string, range: TimeRange = '1M'): Promise<ChartDataPoint[]> => {
    const cacheKey = `chart_${symbol}_${range}`;
    const cached = chartCache[cacheKey];
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION_MS)) {
        return cached.data;
    }

    try {
        const yahooSymbol = getYahooSymbol(symbol);
        
        let yfRange = '1mo';
        let yfInterval = '1d';
        
        // Map our TimeRange to Yahoo Finance query params
        switch(range) {
            case '1D': yfRange = '1d'; yfInterval = '5m'; break;
            case '5D': yfRange = '5d'; yfInterval = '15m'; break;
            case '15D': yfRange = '1mo'; yfInterval = '1d'; break; // We'll slice
            case '1M': yfRange = '1mo'; yfInterval = '1d'; break;
            case '5M': yfRange = '6mo'; yfInterval = '1d'; break; // We'll slice
            case '1Y': yfRange = '1y'; yfInterval = '1d'; break;
        }

        const response = await axios.get(`/api/yahoo/v8/finance/chart/${yahooSymbol}`, {
            params: { range: yfRange, interval: yfInterval }
        });

        const result = response.data?.chart?.result?.[0];
        if (!result || !result.timestamp || !result.indicators?.quote?.[0]?.close) {
             throw new Error("Invalid chart data layout");
        }

        const timestamps: number[] = result.timestamp;
        const closes: number[] = result.indicators.quote[0].close;
        const opens: number[] = result.indicators.quote[0].open;
        const highs: number[] = result.indicators.quote[0].high;
        const lows: number[] = result.indicators.quote[0].low;

        let formattedData: ChartDataPoint[] = [];

        for (let i = 0; i < timestamps.length; i++) {
            if (closes[i] !== null && closes[i] !== undefined) {
                const date = new Date(timestamps[i] * 1000);
                
                let dayLabel = "";
                if (range === '1D' || range === '5D') {
                    // Intraday: show hours:minutes
                    dayLabel = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                    // For 5D, maybe append day
                    if (range === '5D') dayLabel = date.toLocaleDateString('en-IN', { weekday: 'short' }) + ' ' + dayLabel;
                } else {
                    // Daily: show DD-MMM
                    dayLabel = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                }

                formattedData.push({
                    day: dayLabel,
                    price: Number(closes[i].toFixed(2)),
                    open: opens?.[i] ? Number(opens[i].toFixed(2)) : undefined,
                    high: highs?.[i] ? Number(highs[i].toFixed(2)) : undefined,
                    low: lows?.[i] ? Number(lows[i].toFixed(2)) : undefined,
                    close: closes?.[i] ? Number(closes[i].toFixed(2)) : undefined,
                    timestamp: timestamps[i] * 1000
                });
            }
        }

        // Slice if we fetched more than we needed to cover gaps (like 15D or 5M)
        if (range === '15D') {
            formattedData = formattedData.slice(-15);
        } else if (range === '5M') {
            const fiveMonthsAgo = new Date();
            fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);
            
            // Re-filter the raw data based on timestamp
            formattedData = [];
            for (let i = 0; i < timestamps.length; i++) {
                if (closes[i] !== null && timestamps[i] * 1000 >= fiveMonthsAgo.getTime()) {
                    const date = new Date(timestamps[i] * 1000);
                     formattedData.push({
                        day: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                        price: Number(closes[i].toFixed(2)),
                        open: opens?.[i] ? Number(opens[i].toFixed(2)) : undefined,
                        high: highs?.[i] ? Number(highs[i].toFixed(2)) : undefined,
                        low: lows?.[i] ? Number(lows[i].toFixed(2)) : undefined,
                        close: closes?.[i] ? Number(closes[i].toFixed(2)) : undefined,
                        timestamp: timestamps[i] * 1000
                    });
                }
            }
        }

        chartCache[cacheKey] = { data: formattedData, timestamp: Date.now() };
        return formattedData;

    } catch (error) {
        console.error(`Error fetching historical data for ${symbol} from Yahoo:`, error);
        return getMockHistoricalData(symbol, range);
    }
};
