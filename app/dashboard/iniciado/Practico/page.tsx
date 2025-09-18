'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import BackButton from '@/components/ui/BackButton';

interface Module {
  title: string;
  path: string;
  description?: string;
}

const modules: Module[] = [
  { title: 'Introducción al Trading', path: '1-introduccion-trading' },
  { title: 'Introducción al Análisis Técnico', path: '2-introduccion-analisis-tecnico' },
  { title: 'Patrones de Vela', path: '3-patrones-vela' },
  { title: 'Fibonacci y Medias Móviles', path: '4-fibonacci-medias' },
  { title: 'Estocástico y Bandas de Bollinger', path: '5-estocastico-bollinger' },
  { title: 'Indicadores RSI y MACD', path: '6-indicadores-rsi-macd' },
  { title: 'Análisis Fundamental', path: '7-analisis-fundamental' },
  { title: 'Correlaciones entre Mercados', path: '8-correlaciones-mercados' },
  { title: 'Gestión de Riesgo', path: '9-gestion-riesgo' },
  { title: 'Plan de Trading', path: '10-plan-trading' },
  { title: 'Psicología del Trading', path: '11-psicologia-trading' },
  { title: 'Plan de Trading Completo', path: '12-plan-trading-completo' },
];

const icons = [
  // Módulo 1: Introducción al Trading - Gráfico de trading
  <svg className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-1">
    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>,
  // Módulo 2: Análisis Técnico - Lupa de análisis
  <svg className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-2">
    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>,
  // Módulo 3: Patrones de Vela - Vela japonesa
  <svg className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-3">
    <path d="M12 2v20m0-20l-4 4m4-4l4 4m-4 16l-4-4m4 4l4-4" />
  </svg>,
  // Módulo 4: Fibonacci y Medias Móviles - Espiral de Fibonacci
  <svg className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-4">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <path d="M8 12h8m-4-4v8" />
  </svg>,
  // Módulo 5: Estocástico y Bandas de Bollinger - Indicadores
  <svg className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-5">
    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
  // Módulo 6: Indicadores RSI y MACD - Oscilador
  <svg className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-6">
    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    <path d="M12 8v8m-4-4h8" />
  </svg>,
  // Módulo 7: Análisis Fundamental - Gráfico de barras con tendencia
  <svg className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-7">
    <path d="M3 3v18h18M7 14l3-3 3 3 4-4M7 7h.01M11 7h.01M15 7h.01" />
  </svg>,
  // Módulo 8: Correlaciones entre Mercados - Gráfico de correlación
  <svg className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-8">
    <path d="M3 3v18h18M7 14l3-3 3 3 4-4M7 7h.01M11 7h.01M15 7h.01" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
  // Módulo 9: Gestión de Riesgo - Escudo de protección
  <svg className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-9">
    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>,
  // Módulo 10: Plan de Trading - Lista de verificación
  <svg className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-10">
    <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>,
  // Módulo 11: Psicología del Trading - Cerebro/Mente
  <svg className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-11">
    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>,
  // Módulo 12: Plan de Trading Completo - Checklist completo
  <svg className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-12">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
];

const descriptions = [
  'Aprende los fundamentos del trading y desarrolla la mentalidad correcta para operar en los mercados financieros.',
  'Domina las herramientas del análisis técnico para identificar oportunidades de trading.',
  'Identifica y utiliza los patrones de velas japonesas para tomar decisiones informadas.',
  'Aplica los niveles de Fibonacci y las medias móviles para encontrar entradas y salidas óptimas.',
  'Utiliza el estocástico y las bandas de Bollinger para identificar sobrecompra y sobreventa.',
  'Combina los indicadores RSI y MACD para confirmar señales de trading.',
  'Comprende quién y qué mueve el mercado a través del análisis fundamental.',
  'Descubre cómo los commodities como petróleo, oro y cobre influyen en las divisas.',
  'Aprende las técnicas fundamentales para proteger tu capital y mantener la disciplina emocional.',
  'Crea tu plan de trading profesional y desarrolla la disciplina necesaria para el éxito en los mercados.',
  'Controla tus emociones y desarrolla la disciplina mental necesaria para el trading.',
  'Crea un plan de trading completo y profesional para tu operativa diaria.'
];

export default function CursoPracticoIndex() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => setIsDragging(false);

  return (
    <div className="min-h-screen bg-[#121212] text-white px-2 sm:px-8 py-8 max-w-7xl mx-auto">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 pt-12 relative">
        {/* Botón Volver en la esquina superior izquierda */}
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-[#ec4d58] mb-2 text-center">Curso Práctico de Trading</h1>
        <p className="text-lg text-center text-gray-300 mb-8">Domina las técnicas prácticas del trading profesional</p>

        {/* Carousel de módulos */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6 text-center">📈 Módulos de Trading Práctico</h2>
          <div
            ref={carouselRef}
            className="overflow-x-auto px-1 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
          >
            <div className="flex gap-4 p-2">
              {modules.map((mod, idx) => {
                const isLocked = idx > 9; // Los últimos 2 módulos están bloqueados
                return (
                  <div
                    key={idx}
                    className={`flex-none w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] xl:w-[calc(20%-10px)] p-0`}
                  >
                    <div
                      className={`p-6 rounded-2xl shadow-md h-[280px] bg-[#18181b] flex flex-col text-center group border border-[#232323] transition-all duration-300 relative ${
                        isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.02] cursor-default'
                      }`}
                      style={{height:'100%', minHeight:'280px', display:'flex', flexDirection:'column', justifyContent:'space-between'}}
                    >
                      {/* Ícono grande y número */}
                      <div className="flex flex-col items-center justify-center gap-1 mb-2">
                        <span className="text-[#ec4d58] group-hover:text-[#d63d47] transition-colors" style={{fontSize:'2.5rem', display:'flex', alignItems:'center', justifyContent:'center'}}>
                          {icons[idx]}
                        </span>
                        <span className="text-xs text-[#ec4d58] font-semibold mt-1">{idx + 1}</span>
                      </div>
                      {/* Candado si está bloqueado */}
                      {isLocked && (
                        <div className="absolute top-3 left-3 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      )}
                      {/* Contenido */}
                      <div className="flex-1 flex flex-col justify-start">
                        <h3 className="font-semibold mb-2 text-sm leading-tight flex items-center gap-2 justify-center">
                          <span className="text-gray-100 dark:text-gray-200">{mod.title}</span>
                        </h3>
                        {/* Descripción */}
                        <p className="text-xs text-gray-400 leading-tight px-1 mt-1" style={{maxHeight:'3.6em', overflow:'hidden'}}>
                          {mod.description || descriptions[idx]}
                        </p>
                      </div>
                      {/* Call to action alineado perfectamente abajo */}
                      <div className="w-full flex items-end justify-center mt-4" style={{marginTop:'auto'}}>
                        {!isLocked ? (
                          <Link
                            href={`/dashboard/iniciado/Practico/${mod.path}`}
                            className="text-xs text-[#ec4d58] font-semibold group-hover:text-[#d63d47] transition-colors px-4 py-2 rounded bg-[#232323] hover:bg-[#ec4d58]/10 focus:outline-none focus:ring-2 focus:ring-[#ec4d58] focus:ring-offset-2 border border-[#ec4d58]/30"
                            style={{minWidth:'90px'}}
                          >
                            Explorar
                          </Link>
                        ) : (
                          <button
                            className="text-xs text-gray-400 font-medium px-4 py-2 rounded bg-gray-700/20 cursor-not-allowed border border-gray-700/40"
                            disabled
                            title="Completa los módulos anteriores para desbloquear"
                            style={{minWidth:'90px'}}
                          >
                            Bloqueado
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Desliza horizontalmente para ver todos los módulos
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-[#ec4d58]">🎯 Objetivo del Curso</h3>
            <p className="text-sm text-gray-300">
              Desarrollar las habilidades prácticas necesarias para operar en los mercados financieros de manera profesional y rentable.
            </p>
          </div>
          
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-[#ec4d58]">📊 Metodología</h3>
            <p className="text-sm text-gray-300">
              Aprende a través de ejercicios prácticos, análisis de casos reales y aplicación directa de las técnicas de trading.
            </p>
          </div>
        </div>

        {/* Botón Volver al final */}
        <div className="mt-8">
          <BackButton />
        </div>
      </div>
    </div>
  );
} 
