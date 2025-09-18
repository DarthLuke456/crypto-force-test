'use client';

import React, { useState } from 'react';
import { useSafeAuth } from '@/context/AuthContext';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { LineChart, Lightbulb, ChevronLeft, ChevronRight, TrendingUp, BarChart3, Target } from 'lucide-react';
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

export default function MaestroTradingViewPage() {
  const { userData } = useSafeAuth();
  const scrollRef = useScrollPosition();
  const [showTips, setShowTips] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const advancedTradingTips = [
    "🎯 Como Maestro, enseña a tus estudiantes a usar stop-loss dinámicos",
    "📊 Analiza múltiples timeframes para confirmar tendencias",
    "💼 Gestiona el riesgo con posición sizing adecuado",
    "📈 Mantén un diario de trading detallado",
    "🔍 Usa indicadores técnicos como confirmación, no predicción",
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
    setCurrentTipIndex((prev) => (prev + 1) % advancedTradingTips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + advancedTradingTips.length) % advancedTradingTips.length);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white" ref={scrollRef}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <LineChart className="w-8 h-8 text-[#8A8A8A]" />
              <h1 className="text-3xl font-bold text-[#fafafa]">TradingView</h1>
              <span className="px-3 py-1 bg-[#8A8A8A] text-[#0f0f0f] rounded-full text-sm font-semibold">
                MAESTRO
              </span>
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
            Análisis técnico profesional de criptomonedas con TradingView - Acceso Maestro
          </p>
        </div>

        {/* Mini-Carrusel de Tips Avanzados Navegable - Solo visible cuando showTips es true */}
        {showTips && (
          <div className="mb-6 p-4 bg-[#1a1a1a] border border-[#232323] rounded-lg">
            <h3 className="text-lg font-semibold text-[#fafafa] mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 text-[#fafafa] mr-2" />
              Tips Avanzados para Maestros
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
                  {advancedTradingTips[currentTipIndex]}
                </div>
              </div>

              {/* Indicadores de posición */}
              <div className="flex justify-center space-x-2 mt-4">
                {advancedTradingTips.map((_, index) => (
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
            Gráfico Profesional en Tiempo Real
          </h2>
          <TradingViewChart height={700} />
        </div>

        {/* Información adicional para Maestros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="p-4 bg-[#1a1a1a] border border-[#232323] rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-[#8A8A8A] mr-2" />
              <h3 className="text-lg font-semibold text-[#fafafa]">Análisis Avanzado</h3>
            </div>
            <p className="text-[#8A8A8A] text-sm">
              Como Maestro, utiliza todas las herramientas profesionales de TradingView 
              para análisis técnico avanzado y enseñanza.
            </p>
          </div>
          
          <div className="p-4 bg-[#1a1a1a] border border-[#232323] rounded-lg">
            <div className="flex items-center mb-2">
              <BarChart3 className="w-5 h-5 text-[#8A8A8A] mr-2" />
              <h3 className="text-lg font-semibold text-[#fafafa]">Indicadores Pro</h3>
            </div>
            <p className="text-[#8A8A8A] text-sm">
              Acceso completo a más de 100 indicadores técnicos, patrones armónicos, 
              y herramientas de análisis profesional.
            </p>
          </div>
          
          <div className="p-4 bg-[#1a1a1a] border border-[#232323] rounded-lg md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-2">
              <Target className="w-5 h-5 text-[#8A8A8A] mr-2" />
              <h3 className="text-lg font-semibold text-[#fafafa]">Enseñanza</h3>
            </div>
            <p className="text-[#8A8A8A] text-sm">
              Comparte tu conocimiento con estudiantes, crea estrategias de trading 
              y guía a otros en su desarrollo profesional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
