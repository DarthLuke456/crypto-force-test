'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time, LineStyle } from 'lightweight-charts';
import { BarChart3, Settings, TrendingUp } from 'lucide-react';

interface TradingChartProps {
  symbol?: string;
  timeframe?: string;
  selectedIndicator?: string | null;
}

interface StochasticData {
  time: number;
  k: number; // %K line
  d: number; // %D line (SMA de %K)
}

const TradingChart: React.FC<TradingChartProps> = ({ 
  symbol = "BTCUSDT", 
  timeframe = "1h",
  selectedIndicator = null
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const stochasticKSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const stochasticDSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const isDestroyedRef = useRef(false);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [candles, setCandles] = useState<Array<{
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showIndicatorsMenu, setShowIndicatorsMenu] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [stochasticEnabled, setStochasticEnabled] = useState(false);
  const [stochasticPeriod, setStochasticPeriod] = useState(14);
  const [stochasticKPeriod, setStochasticKPeriod] = useState(3);
  const [stochasticDPeriod, setStochasticDPeriod] = useState(3);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  // Hook para manejar el redimensionamiento de la ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      // Redimensionar el gráfico si existe
      if (chartRef.current && chartContainerRef.current) {
        const resizeObserver = new ResizeObserver(() => {
          if (chartRef.current && chartContainerRef.current) {
            chartRef.current.applyOptions({
              width: chartContainerRef.current.clientWidth,
              height: chartContainerRef.current.clientHeight,
            });
          }
        });
        
        resizeObserver.observe(chartContainerRef.current);
        return () => resizeObserver.disconnect();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Hook para redimensionar el gráfico cuando cambie el tamaño del contenedor
  useEffect(() => {
    if (!chartRef.current || !chartContainerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    });

    resizeObserver.observe(chartContainerRef.current);
    return () => resizeObserver.disconnect();
  }, [candles]);

  // Hook para manejar el cambio de indicador seleccionado
  useEffect(() => {
    if (selectedIndicator === 'stochastic') {
      setStochasticEnabled(true);
    } else {
      setStochasticEnabled(false);
    }
  }, [selectedIndicator]);

  // Función para limpiar el gráfico de forma segura
  const cleanupChart = useCallback(() => {
    if (chartRef.current && !isDestroyedRef.current) {
      try {
        chartRef.current.remove();
        chartRef.current = null;
        candlestickSeriesRef.current = null;
        stochasticKSeriesRef.current = null;
        stochasticDSeriesRef.current = null;
      } catch (error) {
        console.warn('Error during chart cleanup:', error);
      }
    }
  }, []);

  // Generar datos de ejemplo con precios actualizados (solo como fallback)
  const generateUpdatedMockData = useCallback(() => {
    if (isDestroyedRef.current) return;
    
    console.log('Generating updated mock data for:', symbol, timeframe);
    
    const mockCandles = [];
    const now = Date.now();
    const intervalMs = timeframe === '1m' ? 60000 : 
                      timeframe === '5m' ? 300000 : 
                      timeframe === '15m' ? 900000 : 
                      timeframe === '1h' ? 3600000 : 
                      timeframe === '4h' ? 14400000 : 86400000;
    
    // Precios actualizados y realistas (2024)
    let basePrice = 116000; // Bitcoin actual ~$116k
    if (symbol === 'ETHUSDT') basePrice = 3200;      // Ethereum ~$3.2k
    else if (symbol === 'BNBUSDT') basePrice = 580;  // BNB ~$580
    else if (symbol === 'ADAUSDT') basePrice = 0.45; // Cardano ~$0.45
    else if (symbol === 'SOLUSDT') basePrice = 140;  // Solana ~$140
    else if (symbol === 'DOTUSDT') basePrice = 6.80; // Polkadot ~$6.80
    else if (symbol === 'MATICUSDT') basePrice = 0.75; // Polygon ~$0.75
    else if (symbol === 'LINKUSDT') basePrice = 14.50; // Chainlink ~$14.50
    else if (symbol === 'UNIUSDT') basePrice = 7.20;  // Uniswap ~$7.20
    else if (symbol === 'AVAXUSDT') basePrice = 35.80; // Avalanche ~$35.80

    for (let i = 200; i >= 0; i--) {
      const time = now - (i * intervalMs);
      const volatility = 0.015; // 1.5% de volatilidad (más realista)
      const change = (Math.random() - 0.5) * volatility;
      const open = basePrice * (1 + change);
      const high = open * (1 + Math.random() * 0.008);
      const low = open * (1 - Math.random() * 0.008);
      const close = open * (1 + (Math.random() - 0.5) * 0.004);
      
      mockCandles.push({
        time: Math.floor(time / 1000),
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2))
      });
      
      basePrice = close;
    }
    
    console.log('Generated', mockCandles.length, 'updated mock candles');
    
    if (!isDestroyedRef.current) {
      setCandles(mockCandles);
      setLoading(false);
    }
  }, [symbol, timeframe]);

  // Función para calcular el Estocástico REAL
  const calculateStochastic = useCallback((candles: Array<{time: number, open: number, high: number, low: number, close: number}>, period: number, kPeriod: number, dPeriod: number): StochasticData[] => {
    if (candles.length < period) return [];

    const stochasticData: StochasticData[] = [];
    
    for (let i = period - 1; i < candles.length; i++) {
      // Encontrar el máximo y mínimo en el período
      let highestHigh = candles[i].high;
      let lowestLow = candles[i].low;
      
      for (let j = i - period + 1; j <= i; j++) {
        if (candles[j].high > highestHigh) highestHigh = candles[j].high;
        if (candles[j].low < lowestLow) lowestLow = candles[j].low;
      }
      
      // Calcular %K
      const currentClose = candles[i].close;
      const range = highestHigh - lowestLow;
      const k = range === 0 ? 50 : ((currentClose - lowestLow) / range) * 100;
      
      // Calcular %D (SMA de %K)
      let dSum = k;
      let dCount = 1;
      
      for (let j = 1; j < kPeriod && (i - j) >= 0; j++) {
        const prevIndex = i - j;
        if (prevIndex >= period - 1) {
          let prevHighestHigh = candles[prevIndex].high;
          let prevLowestLow = candles[prevIndex].low;
          
          for (let k = prevIndex - period + 1; k <= prevIndex; k++) {
            if (candles[k].high > prevHighestHigh) prevHighestHigh = candles[k].high;
            if (candles[k].low < prevLowestLow) prevLowestLow = candles[k].low;
          }
          
          const prevRange = prevHighestHigh - prevLowestLow;
          const prevK = prevRange === 0 ? 50 : ((candles[prevIndex].close - prevLowestLow) / prevRange) * 100;
          dSum += prevK;
          dCount++;
        }
      }
      
      const d = dSum / dCount;
      
      stochasticData.push({
        time: candles[i].time,
        k: k,
        d: d
      });
    }
    
    // Aplicar suavizado adicional a %D si es necesario
    if (dPeriod > 1) {
      for (let i = dPeriod - 1; i < stochasticData.length; i++) {
        let dSum = 0;
        for (let j = 0; j < dPeriod; j++) {
          dSum += stochasticData[i - j].d;
        }
        stochasticData[i].d = dSum / dPeriod;
      }
    }
    
    return stochasticData;
  }, []);

  // Función para obtener datos de Binance en tiempo real
  const fetchBinanceData = useCallback(async () => {
    if (isDestroyedRef.current) return;
    
    try {
      console.log('Fetching real-time data from Binance for', symbol, timeframe);
      setLoading(true);
      setError(null);
      
      // Calcular límite basado en el timeframe para obtener suficientes datos para el estocástico
      const limit = Math.max(100, stochasticPeriod * 3); // Mínimo 100, idealmente 3x el período del estocástico
      
      const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframe}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Formatear datos de velas
      const formattedCandles = data.map((candle: any) => ({
        time: Math.floor(new Date(candle[0]).getTime() / 1000),
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4])
      }));
      
      // Obtener precio actual
      const currentPriceResponse = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
      if (currentPriceResponse.ok) {
        const priceData = await currentPriceResponse.json();
        setCurrentPrice(parseFloat(priceData.price).toFixed(2));
      }
      
      console.log('Fetched', formattedCandles.length, 'real candles from Binance');
      console.log('Current price:', currentPrice);
      
      if (!isDestroyedRef.current) {
        setCandles(formattedCandles);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching Binance data:', error);
      if (!isDestroyedRef.current) {
        setError('Error al obtener datos de Binance. Usando datos de ejemplo actualizados.');
        // Fallback a datos de ejemplo con precios actualizados
        generateUpdatedMockData();
      }
    }
  }, [symbol, timeframe, generateUpdatedMockData, stochasticPeriod]);

  // Cargar datos cuando cambie el símbolo o timeframe
  useEffect(() => {
    console.log('useEffect triggered for symbol/timeframe change');
    if (!isDestroyedRef.current) {
      fetchBinanceData();
    }
  }, [fetchBinanceData]);

  // Configurar actualización automática
  useEffect(() => {
    if (isDestroyedRef.current) return;

    // Limpiar intervalo anterior
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }

    // Configurar nuevo intervalo de actualización
    const intervalMs = timeframe === '1m' ? 30000 : 
                      timeframe === '5m' ? 60000 : 
                      timeframe === '15m' ? 300000 : 
                      timeframe === '1h' ? 600000 : 
                      timeframe === '4h' ? 2400000 : 86400000;

    updateIntervalRef.current = setInterval(() => {
      if (!isDestroyedRef.current) {
        fetchBinanceData();
      }
    }, intervalMs);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
    };
  }, [fetchBinanceData, timeframe]);

  // Crear y configurar el gráfico
  useEffect(() => {
    console.log('Chart useEffect triggered. Candles length:', candles.length);
    console.log('Chart container ref:', chartContainerRef.current);
    console.log('Is destroyed:', isDestroyedRef.current);
    
    if (!chartContainerRef.current) {
      console.log('Chart container not ready');
      return;
    }
    
    if (candles.length === 0) {
      console.log('No candles data available');
      return;
    }
    
    if (isDestroyedRef.current) {
      console.log('Component is destroyed');
      return;
    }

    try {
      console.log('Creating chart with', candles.length, 'candles');
      
      // Limpiar gráfico anterior
      cleanupChart();

      // Crear nuevo gráfico
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          background: { color: '#121212' },
          textColor: '#d1d4dc',
          fontSize: windowSize.width < 640 ? 10 : windowSize.width < 1024 ? 12 : 14,
        },
        grid: {
          vertLines: { color: '#2a2a2a' },
          horzLines: { color: '#2a2a2a' },
        },
        crosshair: {
          mode: 1,
        },
        rightPriceScale: {
          borderColor: '#2a2a2a',
          scaleMargins: {
            top: 0.1,
            bottom: 0.1,
          },
        },
        timeScale: {
          borderColor: '#2a2a2a',
          timeVisible: true,
          secondsVisible: false,
          rightOffset: windowSize.width < 640 ? 8 : 12,
          barSpacing: windowSize.width < 640 ? 2 : windowSize.width < 1024 ? 4 : 6,
        },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
          horzTouchDrag: true,
          vertTouchDrag: true,
        },
        handleScale: {
          axisPressedMouseMove: {
            time: true,
            price: true,
          },
          mouseWheel: true,
          pinch: true,
        },
        kineticScroll: {
          touch: true,
          mouse: false,
        },
      });

      console.log('Chart created successfully');

      // Crear serie de velas
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#3ED598',
        downColor: '#EC4D58',
        borderDownColor: '#EC4D58',
        borderUpColor: '#3ED598',
        wickDownColor: '#EC4D58',
        wickUpColor: '#3ED598',
      });

      console.log('Candlestick series created');

      // Configurar datos de velas
      const candlestickData = candles.map(c => ({
        time: c.time as Time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close
      }));
      
      console.log('Setting chart data:', candlestickData.length);
      candlestickSeries.setData(candlestickData);

      // Calcular y agregar Estocástico si está habilitado
      if (stochasticEnabled && candles.length >= stochasticPeriod) {
        try {
          console.log('Calculating stochastic with period:', stochasticPeriod);
          const stochasticData = calculateStochastic(candles, stochasticPeriod, stochasticKPeriod, stochasticDPeriod);
          
          if (stochasticData.length > 0) {
            console.log('Stochastic data calculated:', stochasticData.length, 'points');
            
            // Crear serie %K (línea azul) en el gráfico principal
            const kSeries = chart.addLineSeries({
              color: '#3B82F6',
              lineWidth: 2,
              title: `%K (${stochasticPeriod},${stochasticKPeriod})`,
              priceScaleId: 'stochastic',
            });

            // Crear serie %D (línea roja) en el gráfico principal
            const dSeries = chart.addLineSeries({
              color: '#EF4444',
              lineWidth: 2,
              title: `%D (${stochasticPeriod},${stochasticKPeriod},${stochasticDPeriod})`,
              priceScaleId: 'stochastic',
            });

            // Líneas de referencia de sobrecompra (80) y sobreventa (20)
            const overboughtLine = chart.addLineSeries({
              color: '#F59E0B',
              lineWidth: 1,
              lineStyle: LineStyle.Dashed,
              title: 'Sobrecompra (80)',
              priceScaleId: 'stochastic',
            });

            const oversoldLine = chart.addLineSeries({
              color: '#F59E0B',
              lineWidth: 1,
              lineStyle: LineStyle.Dashed,
              title: 'Sobreventa (20)',
              priceScaleId: 'stochastic',
            });

            // Crear escala de precios separada para el estocástico
            const stochasticPriceScale = chart.priceScale('stochastic');
            if (stochasticPriceScale) {
              stochasticPriceScale.applyOptions({
                scaleMargins: {
                  top: 0.1,
                  bottom: 0.1,
                },
                visible: true,
                autoScale: false,
              });
            }

            // Configurar datos del estocástico
            const kData = stochasticData.map(s => ({
              time: s.time as Time,
              value: s.k
            }));

            const dData = stochasticData.map(s => ({
              time: s.time as Time,
              value: s.d
            }));

            // Líneas de referencia
            const overboughtData = stochasticData.map(s => ({
              time: s.time as Time,
              value: 80
            }));

            const oversoldData = stochasticData.map(s => ({
              time: s.time as Time,
              value: 20
            }));

            kSeries.setData(kData);
            dSeries.setData(dData);
            overboughtLine.setData(overboughtData);
            oversoldLine.setData(oversoldData);

            // Guardar referencias
            stochasticKSeriesRef.current = kSeries;
            stochasticDSeriesRef.current = dSeries;

            console.log('Stochastic indicator added successfully');
          }
        } catch (stochError) {
          console.error('Error adding stochastic indicator:', stochError);
        }
      }

      // Guardar referencias
      chartRef.current = chart;
      candlestickSeriesRef.current = candlestickSeries;

      console.log('Chart setup completed successfully');

      // Responsive
      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current && !isDestroyedRef.current) {
          try {
            chartRef.current.applyOptions({
              width: chartContainerRef.current.clientWidth,
              height: chartContainerRef.current.clientHeight,
            });
          } catch (error) {
            console.warn('Error during chart resize:', error);
          }
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    } catch (error) {
      console.error('Error creating chart:', error);
      if (!isDestroyedRef.current) {
        setError('Error al crear el gráfico: ' + error);
      }
    }
  }, [candles, cleanupChart, windowSize, stochasticEnabled, stochasticPeriod, stochasticKPeriod, stochasticDPeriod, calculateStochastic]);

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      console.log('Component unmounting, cleaning up');
      isDestroyedRef.current = true;
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      cleanupChart();
    };
  }, [cleanupChart]);

  return (
    <div className="w-full h-full relative">
      {/* Controles del Indicador Estocástico */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-[#1a1a1a] rounded-lg border border-[#3a3a3a] p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm font-medium">Estocástico</span>
            <button
              onClick={() => setStochasticEnabled(!stochasticEnabled)}
              className={`ml-auto px-2 py-1 rounded text-xs font-medium transition-colors ${
                stochasticEnabled 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-600 text-gray-300'
              }`}
            >
              {stochasticEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
          
          {stochasticEnabled && (
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Período</label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={stochasticPeriod}
                  onChange={(e) => setStochasticPeriod(parseInt(e.target.value) || 14)}
                  className="w-16 px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">%K</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={stochasticKPeriod}
                  onChange={(e) => setStochasticKPeriod(parseInt(e.target.value) || 3)}
                  className="w-16 px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">%D</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={stochasticDPeriod}
                  onChange={(e) => setStochasticDPeriod(parseInt(e.target.value) || 3)}
                  className="w-16 px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estado de Carga */}
      {loading && (
        <div className="absolute inset-0 bg-[#121212]/80 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8A8A8A] mx-auto mb-4"></div>
            <p className="text-white text-sm">Cargando datos en tiempo real...</p>
          </div>
        </div>
      )}

      {/* Estado de Error */}
      {error && (
        <div className="absolute top-4 left-4 z-10 bg-red-900/80 border border-red-500/50 rounded-lg p-3 max-w-md">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Información del Precio */}
      {currentPrice && (
        <div className="absolute top-4 left-4 z-10 bg-[#1a1a1a]/90 border border-[#3a3a3a] rounded-lg p-3">
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">Precio Actual</p>
            <p className="text-white text-lg font-bold">${currentPrice}</p>
            <p className="text-gray-500 text-xs">{symbol}</p>
          </div>
        </div>
      )}

      {/* Contenedor del Gráfico */}
      <div 
        ref={chartContainerRef} 
        className="w-full h-full min-h-[400px]"
        style={{ 
          height: Math.max(400, windowSize.height * 0.6),
          width: '100%'
        }}
      />
      
      {/* Información del Indicador */}
      {stochasticEnabled && (
        <div className="absolute bottom-4 left-4 z-10 bg-[#1a1a1a]/90 border border-[#3a3a3a] rounded-lg p-3">
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-2">Estocástico</p>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-white">%K</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-white">%D</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full border border-dashed"></div>
                <span className="text-white">80/20</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              {stochasticPeriod},{stochasticKPeriod},{stochasticDPeriod}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingChart;
