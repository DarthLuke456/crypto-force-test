'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import ControlPointBadge from '@/app/dashboard/iniciado/components/ControlPointBadge';

interface Module {
  title: string;
  path: string;
  description?: string;
}

interface ModuloCarrouselProps {
  modules: Module[];
}

const icons = [
  // 1. Introducción al Trading
  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-p1"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  // 2. Introducción al Análisis Técnico
  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-p2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  // 3. Patrones de vela
  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-p3"><path d="M12 2v20m0-20l-4 4m4-4l4 4m-4 16l-4-4m4 4l4-4" /></svg>,
  // 4. Fibonacci y medias móviles
  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-p4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M8 12h8m-4-4v8" /></svg>,
  // 5. Estocástico y Bollinger
  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-p5"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /><path d="M9 12l2 2 4-4" /></svg>,
  // 6. Indicadores RSI y MACD
  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-p6"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /><path d="M12 8v8m-4-4h8" /></svg>,
  // 7. Análisis fundamental I
  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-p7"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  // 8. Análisis fundamental II
  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-p8"><path d="M3 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m4 0v-6a2 2 0 012-2h2a2 2 0 012 2v6" /></svg>,
  // 9. Gestión de riesgo
  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-p9"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  // 10. Plan general trading
  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" key="icon-p10"><path d="M9 11l3 3L22 4M2 20h20M2 16h20M2 12h7" /></svg>,
];

const descriptions = [
  'Aprende los conceptos básicos del trading y cómo funciona el mercado financiero.',
  'Descubre los fundamentos del análisis técnico y su importancia en el trading.',
  'Identifica y utiliza los patrones de velas japonesas para anticipar movimientos.',
  'Aplica Fibonacci y medias móviles para encontrar zonas clave de soporte y resistencia.',
  'Comprende los indicadores Estocástico y Bollinger para mejorar tus entradas y salidas.',
  'Domina los indicadores RSI y MACD para analizar la fuerza y tendencia del mercado.',
  'Iníciate en el análisis fundamental: noticias, economía y su impacto en los precios.',
  'Profundiza en el análisis fundamental con casos prácticos y ejemplos reales.',
  'Gestiona el riesgo de tus operaciones y protege tu capital como un profesional.'
];

export default function ModuloCarrouselPractico({ modules }: ModuloCarrouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Agregar event listener no-pasivo para wheel
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleWheel = (e: WheelEvent) => {
      console.log('⚡ Scroll NATIVO en carrousel PRÁCTICO detectado!', e.deltaY);
      e.preventDefault();
      e.stopPropagation();
      
      // Usar deltaY (scroll vertical) para mover horizontalmente
      const scrollAmount = e.deltaY * 1.5; // Aumentar velocidad
      const oldScrollLeft = carousel.scrollLeft;
      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
      
      // Calcular nuevo scrollLeft con límites
      let newScrollLeft = oldScrollLeft + scrollAmount;
      newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));
      
      carousel.scrollLeft = newScrollLeft;
      console.log('⚡ Práctico scroll NATIVO: ', oldScrollLeft, '->', carousel.scrollLeft, 'max:', maxScrollLeft);
    };

    // Agregar listener con { passive: false } para poder usar preventDefault
    carousel.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      carousel.removeEventListener('wheel', handleWheel);
    };
  }, []);

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
    <div className="card">
      <h2 className="text-xl font-bold mb-6 text-center">Módulos Prácticos de Trading</h2>
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
            const isLocked = idx > 4;
            const isControlPoint = (idx + 1) % 2 === 0;
            return (
              <div
                key={idx}
                className={`flex-none w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] xl:w-[calc(25%-12px)] p-0 relative`}
              >
                {/* Control Point Badge */}
                {isControlPoint && idx > 0 && (
                  <div className="absolute -top-4 -right-4 z-10">
                    <ControlPointBadge className="w-40" />
                  </div>
                )}
                <div
                  className={`p-6 rounded-2xl shadow-md h-[260px] bg-[#18181b] flex flex-col text-center group border border-[#232323] transition-all duration-300 relative ${
                    isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.02] cursor-default'
                  }`}
                  style={{height:'100%', minHeight:'260px', display:'flex', flexDirection:'column', justifyContent:'space-between'}}
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                  )}
                  {/* Contenido */}
                  <div className="flex-1 flex flex-col justify-start">
                    <h3 className="font-semibold mb-2 text-base leading-tight flex items-center gap-2 justify-center">
                      <span className="text-gray-100 dark:text-gray-200">{mod.title}</span>
                    </h3>
                    <p className="text-xs text-gray-400 leading-tight px-1 mt-1" style={{maxHeight:'3.6em', overflow:'hidden'}}>
                      {mod.description || descriptions[idx]}
                    </p>
                  </div>
                  {/* Action Button - ONLY this button allows access */}
                  <div className="mt-auto flex justify-center">
                    {isLocked ? (
                      <button
                        disabled
                        className="w-full px-4 py-2 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Bloqueado</span>
                      </button>
                    ) : (
                      <Link
                        href={`/dashboard/iniciado/${mod.path}`}
                        className={`block w-full px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors duration-200 flex items-center justify-center space-x-2 ${
                          isControlPoint 
                            ? 'bg-[#FFD447] hover:bg-[#FFC437] text-[#121212] font-semibold' 
                            : 'bg-[#fafafa] hover:bg-[#e5e5e5] text-[#121212]'
                        }`}
                      >
                        {isControlPoint ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Tomar Punto de Control</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Comenzar</span>
                          </>
                        )}
                      </Link>
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
  );
} 