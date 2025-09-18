import React from "react";
import { useState, useCallback } from 'react';

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

const INTERVALS = ['1m','5m','15m','1h','4h','1d'];

// Datos de prueba
const generateMockData = (symbol: string): Candle[] => {
  const basePrice = symbol.includes('BTC') ? 45000 : 
                   symbol.includes('ETH') ? 2500 :
                   symbol.includes('BNB') ? 300 : 1;
  
  return Array.from({ length: 100 }, (_, i) => {
    const timestamp = Math.floor(Date.now() / 1000) - (100 - i) * 3600;
    const variation = 0.02; // 2% de variación
    const open = basePrice * (1 + (Math.random() - 0.5) * variation);
    const change = (Math.random() - 0.5) * variation * 2;
    const close = open * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    
    return {
      time: timestamp,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
    };
  });
};

export function useBinanceKlines(symbol: string, interval: string) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchKlines = useCallback(async () => {
    console.log('🔄 Fetching data for:', symbol, interval);
    setLoading(true);
    setError(null);
    
    try {
      // Intentar API real primero
      const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`;
      console.log('📡 Requesting:', url);
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Real data received:', data.length, 'candles');
        
        const parsed: Candle[] = data.map((k: any[]) => ({
          time: Math.floor(k[0] / 1000),
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
        }));
        
        setCandles(parsed);
        setError(null);
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
      
    } catch (e: any) {
      console.warn('⚠️ API failed, using mock data:', e.message);
      
      // Usar datos de prueba
      const mockData = generateMockData(symbol);
      console.log('🎭 Mock data generated:', mockData.length, 'candles');
      
      setCandles(mockData);
      setError('Usando datos de demostración (API no disponible)');
    } finally {
      setLoading(false);
      setLastUpdate(new Date());
    }
  }, [symbol, interval]);

  // Cargar datos al cambiar símbolo/intervalo
  React.useEffect(() => {
    fetchKlines();
  }, [fetchKlines]);

  // Auto-refresh cada 30 segundos (solo para datos reales)
  React.useEffect(() => {
    if (error) return; // No auto-refresh con datos mock

    const intervalId = setInterval(() => {
      console.log('🔄 Auto-refresh triggered');
      fetchKlines();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [fetchKlines, error]);

  return { candles, loading, error, refetch: fetchKlines, lastUpdate };
}

export { INTERVALS };