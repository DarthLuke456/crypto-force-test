'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Maximize2, Minimize2, BarChart3, ChevronDown } from 'lucide-react';

interface SimpleChartProps {
  candles: Array<{
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  symbol?: string;
  interval?: string;
}

const SimpleChart: React.FC<SimpleChartProps> = ({ 
  candles, 
  loading, 
  error, 
  onRefresh, 
  symbol = "BTCUSDT", 
  interval = "1h" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showIndicatorsMenu, setShowIndicatorsMenu] = useState(false);

  // Indicadores técnicos
  const technicalIndicators = [
    { id: 'sma20', name: 'SMA 20', type: 'Moving Average', color: '#ffeb3b' },
    { id: 'sma50', name: 'SMA 50', type: 'Moving Average', color: '#2196f3' },
    { id: 'ema12', name: 'EMA 12', type: 'Moving Average', color: '#4caf50' },
    { id: 'ema26', name: 'EMA 26', type: 'Moving Average', color: '#ff5722' },
    { id: 'bollinger', name: 'Bollinger Bands', type: 'Volatility', color: '#9c27b0' },
    { id: 'rsi', name: 'RSI (14)', type: 'Momentum', color: '#ff9800' },
    { id: 'macd', name: 'MACD', type: 'Momentum', color: '#607d8b' },
    { id: 'volume', name: 'Volume', type: 'Volume', color: '#795548' }
  ];

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Fondo
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    // Calcular precios min y max
    const prices = candles.flatMap(c => [c.high, c.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    if (priceRange === 0) return;

    // Configurar dimensiones del gráfico
    const padding = 50;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const candleWidth = chartWidth / candles.length * 0.8;

    // Dibujar grid
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    
    // Líneas horizontales
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      // Etiquetas de precio
      const price = maxPrice - (priceRange / 5) * i;
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(price.toFixed(2), padding - 10, y + 4);
    }

    // Líneas verticales
    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Dibujar velas
    candles.forEach((candle, index) => {
      const x = padding + (chartWidth / candles.length) * index;
      const centerX = x + (chartWidth / candles.length) / 2;

      // Calcular posiciones Y
      const openY = padding + ((maxPrice - candle.open) / priceRange) * chartHeight;
      const closeY = padding + ((maxPrice - candle.close) / priceRange) * chartHeight;
      const highY = padding + ((maxPrice - candle.high) / priceRange) * chartHeight;
      const lowY = padding + ((maxPrice - candle.low) / priceRange) * chartHeight;

      // Color de la vela
      const isGreen = candle.close > candle.open;
      const color = isGreen ? '#3ED598' : '#EC4D58';

      // Dibujar mecha (línea vertical)
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, highY);
      ctx.lineTo(centerX, lowY);
      ctx.stroke();

      // Dibujar cuerpo de la vela
      ctx.fillStyle = color;
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY);
      const bodyHeight2 = Math.max(bodyHeight, 1); // Mínimo 1 pixel
      
      ctx.fillRect(
        centerX - candleWidth / 2,
        bodyTop,
        candleWidth,
        bodyHeight2
      );
    });

    // Título
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${symbol} - ${interval}`, padding, 30);

    // Precio actual
    if (candles.length > 0) {
      const lastPrice = candles[candles.length - 1].close;
      const change = candles.length > 1 ? 
        ((lastPrice - candles[candles.length - 2].close) / candles[candles.length - 2].close * 100) : 0;
      
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = change >= 0 ? '#3ED598' : '#EC4D58';
      ctx.textAlign = 'right';
      ctx.fillText(
        `$${lastPrice.toFixed(2)} (${change >= 0 ? '+' : ''}${change.toFixed(2)}%)`,
        width - padding,
        30
      );
    }
  }, [candles, symbol, interval]);

  useEffect(() => {
    if (candles.length > 0) {
      const canvas = canvasRef.current;
      if (canvas) {
        // Configurar dimensiones del canvas
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(dpr, dpr);
        }
        
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        
        drawChart();
      }
    }
  }, [candles, isMaximized, drawChart]);

  // Redraw en resize
  useEffect(() => {
    const handleResize = () => {
      if (candles.length > 0) {
        setTimeout(drawChart, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [candles, drawChart]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec4d58] mx-auto mb-2"></div>
          <p className="text-gray-400">Cargando {symbol}...</p>
        </div>
      </div>
    );
  }

  if (error && candles.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d63d47] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full relative ${isMaximized ? 'fixed inset-0 z-50 bg-[#121212] p-4' : ''}`}>
      {/* Controles */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        {/* Menú de indicadores */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowIndicatorsMenu(!showIndicatorsMenu);
            }}
            className="p-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg text-white transition-colors flex items-center gap-1"
            title="Indicadores Técnicos"
          >
            <BarChart3 className="w-4 h-4" />
            <ChevronDown className="w-3 h-3" />
          </button>
          
          {showIndicatorsMenu && (
            <div 
              className="absolute top-full right-0 mt-1 w-72 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg shadow-xl z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 border-b border-[#3a3a3a]">
                <h3 className="text-white font-semibold text-sm">Indicadores Técnicos</h3>
                <p className="text-gray-400 text-xs">Funcionalidad próximamente</p>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {technicalIndicators.map((indicator) => (
                  <div
                    key={indicator.id}
                    className="p-3 hover:bg-[#2a2a2a] border-b border-[#2a2a2a] last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: indicator.color }}
                      ></div>
                      <div>
                        <div className="text-white text-sm font-medium">{indicator.name}</div>
                        <div className="text-gray-400 text-xs">{indicator.type}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botón maximizar */}
        <button
          onClick={toggleMaximize}
          className="p-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg text-white transition-colors"
          title={isMaximized ? "Minimizar" : "Maximizar"}
        >
          {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Canvas del gráfico */}
      <canvas
        ref={canvasRef}
        className={`w-full ${isMaximized ? 'h-screen' : 'h-96'} bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]`}
        style={{
          minHeight: isMaximized ? 'calc(100vh - 100px)' : '400px'
        }}
      />
      
      {/* Botón cerrar maximizado */}
      {isMaximized && (
        <button
          onClick={toggleMaximize}
          className="absolute top-4 right-4 p-2 bg-[#ec4d58] hover:bg-[#d63d47] rounded-lg text-white z-20"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      )}

      {/* Info del gráfico */}
      <div className="mt-2 text-center">
        <p className="text-gray-400 text-sm">
          Gráfico de {symbol} - Intervalo {interval} - {candles.length} velas
        </p>
      </div>
    </div>
  );
};

export default SimpleChart;
