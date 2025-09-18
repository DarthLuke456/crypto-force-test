'use client';

import React, { useState } from 'react';
import { useSafeAuth } from '@/context/AuthContext';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { LineChart, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';

// Importar el gráfico TradingView dinámicamente para evitar errores de SSR
const TradingViewChart = dynamic(() => import('@/components/TradingViewChart'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-[#0f0f0f] border border-[#232323] rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec4d58] mx-auto mb-4"></div>
        <p className="text-[#fafafa]">Cargando TradingView...</p>
      </div>
    </div>
  )
});

export default function TradingViewPage() {
  const { userData } = useSafeAuth();
  const scrollRef = useScrollPosition();
  const [showTips, setShowTips] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const tradingTips = [
    "💡 Siempre usa stop-loss para proteger tu capital",
    "📊 Analiza múltiples timeframes antes de tomar decisiones",
    "🎯 No inviertas más de lo que puedas permitirte perder",
    "📈 Mantén un diario de trading para aprender de tus errores",
    "🔍 Usa indicadores técnicos como confirmación, no como predicción",
    "⏰ El timing es crucial - espera confirmaciones claras",
    "📉 Las tendencias pueden continuar más tiempo del esperado",
    "🔄 Diversifica tu portafolio para reducir riesgos",
    "💰 Gestiona tu capital con la regla del 1-2% por operación",
    "🎲 No operes por emociones, sigue tu plan de trading",
    "📚 Aprende continuamente y mantente actualizado",
    "🔒 Usa siempre stop-loss y take-profit",
    "📊 Analiza el contexto del mercado antes de operar",
    "⏳ Sé paciente, las mejores oportunidades requieren espera",
    "📝 Documenta cada operación para mejorar",
    "🎯 Mantén un enfoque en la gestión de riesgo"
  ];

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tradingTips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + tradingTips.length) % tradingTips.length);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white scrollbar-iniciado" ref={scrollRef}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <LineChart className="w-8 h-8 text-[#ec4d58]" />
              <h1 className="text-3xl font-bold text-[#fafafa]">TradingView</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTips(!showTips)}
                className="px-4 py-2 bg-[#fafafa] hover:bg-[#e5e5e5] text-[#0f0f0f] rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Lightbulb className="w-4 h-4" />
                <span>{showTips ? 'Ocultar Tips' : 'Mostrar Tips'}</span>
              </button>
            </div>
          </div>
          
          <p className="text-[#8A8A8A] text-lg mb-2">
            Análisis técnico profesional de criptomonedas con TradingView
          </p>
        </div>

        {/* Mini-Carrusel de Tips Navegable - Solo visible cuando showTips es true */}
        {showTips && (
          <div className="mb-6 p-4 bg-[#1a1a1a] border border-[#232323] rounded-lg">
            <h3 className="text-lg font-semibold text-[#fafafa] mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 text-[#fafafa] mr-2" />
              Tips de Trading
            </h3>
            
            <div className="relative">
              {/* Navegación del carrusel */}
              <button
                onClick={prevTip}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#232323]/80 hover:bg-[#232323] text-[#fafafa] p-2 rounded-full transition-all duration-200 hover:scale-110"
                aria-label="Tip anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <button
                onClick={nextTip}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#232323]/80 hover:bg-[#232323] text-[#fafafa] p-2 rounded-full transition-all duration-200 hover:scale-110"
                aria-label="Tip siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Contenido del tip actual */}
              <div className="text-center py-8 px-12">
                <div className="text-[#fafafa] text-lg font-medium">
                  {tradingTips[currentTipIndex]}
                </div>
              </div>

              {/* Indicadores de posición */}
              <div className="flex justify-center space-x-2 mt-4">
                {tradingTips.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTipIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTipIndex 
                        ? 'bg-[#fafafa]' 
                        : 'bg-[#8A8A8A] hover:bg-[#fafafa]/70'
                    }`}
                    aria-label={`Ir al tip ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Gráfico TradingView */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#fafafa] mb-4">
            Gráfico en Tiempo Real
          </h2>
          <TradingViewChart height={600} />
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="p-4 bg-[#1a1a1a] border border-[#232323] rounded-lg">
            <h3 className="text-lg font-semibold text-[#fafafa] mb-2">Análisis Técnico</h3>
            <p className="text-[#8A8A8A] text-sm">
              Utiliza las herramientas profesionales de TradingView para analizar patrones, 
              tendencias y niveles de soporte/resistencia en tiempo real.
            </p>
          </div>
          
          <div className="p-4 bg-[#1a1a1a] border border-[#232323] rounded-lg">
            <h3 className="text-lg font-semibold text-[#fafafa] mb-2">Indicadores</h3>
            <p className="text-[#8A8A8A] text-sm">
              Accede a más de 100 indicadores técnicos incluyendo RSI, MACD, 
              Bollinger Bands, Fibonacci y muchos más.
            </p>
          </div>
          
          <div className="p-4 bg-[#1a1a1a] border border-[#232323] rounded-lg md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold text-[#fafafa] mb-2">Herramientas</h3>
            <p className="text-[#8A8A8A] text-sm">
              Dibuja líneas de tendencia, canales, patrones armónicos y 
              utiliza herramientas de análisis avanzado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
