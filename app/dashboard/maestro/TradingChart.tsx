'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts';
import { Maximize2, Minimize2, BarChart3, ChevronDown } from 'lucide-react';

interface TradingChartProps {
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

const TradingChart: React.FC<TradingChartProps> = ({ 
  candles, 
  loading, 
  error, 
  onRefresh, 
  symbol = "BTCUSDT", 
  interval = "1h" 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const [isMaximized, setIsMaximized] = useState(false);
  const [showIndicatorsMenu, setShowIndicatorsMenu] = useState(false);
  const [activeIndicators, setActiveIndicators] = useState<string[]>([]);

  // Manejar eventos de pantalla completa del navegador
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && 
          !(document as any).webkitFullscreenElement && 
          !(document as any).msFullscreenElement) {
        setIsMaximized(false);
      }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMaximized) {
        setIsMaximized(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isMaximized]);

  // Lista de indicadores técnicos
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

  // Funciones de control
  const toggleIndicator = (indicatorId: string) => {
    setActiveIndicators(prev => 
      prev.includes(indicatorId) 
        ? prev.filter(id => id !== indicatorId)
        : [...prev, indicatorId]
    );
  };

  const toggleMaximize = () => {
    if (!isMaximized) {
      // Entrar en pantalla completa
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        (document.documentElement as any).webkitRequestFullscreen();
      } else if ((document.documentElement as any).msRequestFullscreen) {
        (document.documentElement as any).msRequestFullscreen();
      }
    } else {
      // Salir de pantalla completa
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
    setIsMaximized(!isMaximized);
  };

  // Crear gráfico con configuración mejorada
  useEffect(() => {
    if (!chartContainerRef.current) {
      console.log('No container ref');
      return;
    }

    // Limpiar gráfico anterior
    if (chartRef.current) {
      try {
      chartRef.current.remove();
      } catch (e) {
        console.warn('Error removing chart:', e);
      }
      chartRef.current = null;
      candlestickSeriesRef.current = null;
    }

    // Crear nuevo gráfico
    try {
      const container = chartContainerRef.current;
      const width = container.clientWidth || 800;
      const height = isMaximized ? (window.innerHeight - 100) : 400;

      console.log('Creating chart:', { width, height, isMaximized });

      const chart = createChart(container, {
        width,
        height,
      layout: {
          background: { color: '#121212' },
        textColor: '#ffffff',
          fontSize: isMaximized ? 14 : 12,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      },
      grid: {
        vertLines: { color: '#2a2a2a' },
        horzLines: { color: '#2a2a2a' },
      },
      crosshair: {
        mode: 1,
          vertLine: { color: '#ec4d58', width: 1, style: 3 },
          horzLine: { color: '#ec4d58', width: 1, style: 3 },
        },
        rightPriceScale: {
          borderColor: '#333333',
          textColor: '#ffffff',
          scaleMargins: {
            top: 0.05,
            bottom: 0.05,
          },
          mode: 1,
          autoScale: true,
          alignLabels: true,
          borderVisible: true,
          visible: true,
          minimumWidth: isMaximized ? 100 : 80,
          entireTextOnly: false,
      },
      timeScale: {
          borderColor: '#333333',
        timeVisible: true,
        secondsVisible: false,
          rightOffset: isMaximized ? 20 : 12,
          barSpacing: isMaximized ? 12 : 10,
          minBarSpacing: 3,
          fixLeftEdge: false,
          fixRightEdge: false,
          lockVisibleTimeRangeOnResize: false,
          rightBarStaysOnScroll: true,
          borderVisible: true,
          visible: true,
        },
        // Configuración de interactividad mejorada
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
        // Habilitar interacción completa
        kineticScroll: {
          touch: true,
          mouse: false,
        },
    });

      // Agregar serie de velas con mejores colores
    const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#00d4aa',
        downColor: '#ec4d58',
        borderDownColor: '#ec4d58',
        borderUpColor: '#00d4aa',
        wickDownColor: '#ec4d58',
        wickUpColor: '#00d4aa',
        borderVisible: true,
        wickVisible: true,
        priceLineVisible: true,
        priceLineSource: 'close' as any, // close price
        priceLineWidth: 1,
        priceLineColor: '#ec4d58',
        priceLineStyle: 2,
        lastValueVisible: true,
        title: symbol || 'BTCUSDT',
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

      // Agregar eventos de teclado para navegación mejorada
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!chart) return;
        
        switch (e.key) {
          case 'r':
          case 'R':
            // Reset del zoom
            chart.timeScale().fitContent();
            break;
          case '+':
          case '=':
            // Zoom in
            chart.timeScale().scrollToPosition(2, true);
            break;
          case '-':
            // Zoom out
            chart.timeScale().scrollToPosition(-2, true);
            break;
          case 'ArrowLeft':
            // Mover a la izquierda
            e.preventDefault();
            chart.timeScale().scrollToPosition(-10, false);
            break;
          case 'ArrowRight':
            // Mover a la derecha
            e.preventDefault();
            chart.timeScale().scrollToPosition(10, false);
            break;
          case 'Home':
            // Ir al inicio
            e.preventDefault();
            if (candles.length > 0) {
              chart.timeScale().setVisibleLogicalRange({
                from: 0,
                to: Math.min(50, candles.length - 1)
              });
            }
            break;
          case 'End':
            // Ir al final
            e.preventDefault();
            chart.timeScale().scrollToRealTime();
            break;
        }
      };

      console.log('Chart created successfully with enhanced interactivity');

      // Configurar resize
      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          const newWidth = chartContainerRef.current.clientWidth || 800;
          const newHeight = isMaximized ? (window.innerHeight - 100) : 400;
          chartRef.current.applyOptions({ width: newWidth, height: newHeight });
        }
      };

      window.addEventListener('resize', handleResize);
      
      // Agregar listener de teclado solo si está maximizado
      if (isMaximized) {
        document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
        window.removeEventListener('resize', handleResize);
        if (isMaximized) {
          document.removeEventListener('keydown', handleKeyDown);
      }
      if (chartRef.current) {
          try {
        chartRef.current.remove();
          } catch (e) {
            console.warn('Error in cleanup:', e);
          }
          chartRef.current = null;
          candlestickSeriesRef.current = null;
      }
    };
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }, [isMaximized, candles.length, symbol]);

  // Cargar datos
  useEffect(() => {
    if (candlestickSeriesRef.current && candles.length > 0) {
      try {
        console.log('Loading data:', candles.length, 'candles');
        
      const formattedData: CandlestickData<Time>[] = candles.map(candle => ({
        time: candle.time as Time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }));

      candlestickSeriesRef.current.setData(formattedData);
        console.log('Data loaded successfully');
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
  }, [candles]);

  // Estados de carga
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
    <div 
      className={`w-full relative transition-all duration-300 ${
        isMaximized 
          ? 'fixed inset-0 z-[9999] bg-[#121212] overflow-hidden' 
          : 'rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] overflow-hidden'
      }`}
      style={isMaximized ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        margin: 0,
        padding: 0
      } : {}}
    >
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
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {technicalIndicators.map((indicator) => (
                  <div
                    key={indicator.id}
                    className="p-3 hover:bg-[#2a2a2a] border-b border-[#2a2a2a] last:border-b-0"
                  >
                    <label className="flex items-center justify-between cursor-pointer">
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
                      <input
                        type="checkbox"
                        checked={activeIndicators.includes(indicator.id)}
                        onChange={() => toggleIndicator(indicator.id)}
                        className="w-4 h-4 text-[#ec4d58] bg-[#2a2a2a] border-[#3a3a3a] rounded"
                      />
                    </label>
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

      {/* Indicadores activos */}
      {activeIndicators.length > 0 && (
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-[#1a1a1a]/90 rounded-lg p-2 border border-[#3a3a3a]">
            <div className="flex flex-wrap gap-1">
              {activeIndicators.map((indicatorId) => {
                const indicator = technicalIndicators.find(i => i.id === indicatorId);
                return indicator ? (
                  <div
                    key={indicatorId}
                    className="flex items-center gap-1 bg-[#2a2a2a] rounded px-2 py-1"
                  >
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: indicator.color }}
                    ></div>
                    <span className="text-white text-xs">{indicator.name}</span>
                    <button
                      onClick={() => toggleIndicator(indicatorId)}
                      className="text-gray-400 hover:text-white ml-1"
                    >
                      ×
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}

      {/* Contenedor del gráfico */}
      <div 
        ref={chartContainerRef} 
        className={`w-full relative ${
          isMaximized 
            ? 'h-screen' 
            : 'h-96 md:h-[500px] lg:h-[600px]'
        }`}
        style={{
          width: isMaximized ? '100vw' : '100%',
          height: isMaximized ? '100vh' : 'auto',
          minHeight: isMaximized ? '100vh' : '400px',
          backgroundColor: '#121212',
          border: isMaximized ? 'none' : '1px solid #333333',
          borderRadius: isMaximized ? '0' : '12px',
          boxShadow: isMaximized ? 'none' : '0 10px 25px rgba(0,0,0,0.5)',
          cursor: 'crosshair',
          userSelect: 'none',
          touchAction: 'pan-x pan-y',
          overflow: 'hidden',
          position: isMaximized ? 'absolute' : 'relative',
          top: isMaximized ? '0' : 'auto',
          left: isMaximized ? '0' : 'auto'
        }}
        // Asegurar que el contenedor puede recibir eventos
        onMouseDown={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      />
      
      {/* Overlay mejorado para pantalla completa */}
      {isMaximized && (
        <>
          {/* Header con controles */}
          <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
            <div className="flex justify-between items-center p-6">
              <div className="flex items-center space-x-6">
                <h2 className="text-white font-bold text-2xl">
                  {symbol?.replace('USDT', '/USDT')} - {interval}
                </h2>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">Tiempo real</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-white text-sm bg-black/50 px-3 py-1 rounded-lg backdrop-blur-sm">
                  Presiona ESC para salir
                </div>
                <button
                  onClick={toggleMaximize}
                  className="p-3 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300 transition-all duration-200 backdrop-blur-sm border border-red-500/30"
                  title="Salir de pantalla completa"
                >
                  <Minimize2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer con controles */}
          <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
            <div className="flex justify-between items-end p-6">
              <div className="bg-black/70 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10">
                <div className="text-white text-sm">
                  <p className="font-semibold mb-2">Controles:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                    <div>• Zoom: Rueda del ratón</div>
                    <div>• Desplazar: Arrastrar</div>
                    <div>• Crosshair: Doble click</div>
                    <div>• Reset: Tecla R</div>
                  </div>
                </div>
              </div>
              
              {activeIndicators.length > 0 && (
                <div className="bg-black/70 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10">
                  <div className="text-white text-sm">
                    <p className="font-semibold mb-2">Indicadores activos:</p>
                    <div className="flex flex-wrap gap-1">
                      {activeIndicators.map(id => {
                        const indicator = technicalIndicators.find(i => i.id === id);
                        return (
                          <span 
                            key={id}
                            className="text-xs bg-[#ec4d58] text-white px-2 py-1 rounded-full"
                          >
                            {indicator?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Botón maximizar para modo normal */}
      {!isMaximized && (
        <button
          onClick={toggleMaximize}
          className="absolute top-3 right-3 p-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg text-white z-20 transition-all duration-200 hover:scale-110"
          title="Maximizar a pantalla completa"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default TradingChart; 