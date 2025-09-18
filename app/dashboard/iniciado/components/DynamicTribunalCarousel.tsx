'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, BookOpen, Zap, CheckCircle, Lock, RefreshCw, Play } from 'lucide-react';
import ControlPointBadge from './ControlPointBadge';

// Interfaces
interface TribunalModule {
  id: string;
  title: string;
  description: string;
  category: 'theoretical' | 'practical' | 'checkpoint';
  order: number;
  displayNumber: number;
  isLocked: boolean;
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  path: string;
  checkpointNumber?: number;
}

interface DynamicTribunalCarouselProps {
  modules: TribunalModule[];
  checkpoints: any[];
  title: string;
  category: 'theoretical' | 'practical';
  className?: string;
}

// Iconos para diferentes tipos de módulos
const getModuleIcon = (category: string, order: number) => {
  const icons = {
    theoretical: [
      <BookOpen className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="book-1" />,
      <BookOpen className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="book-2" />,
      <BookOpen className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="book-3" />,
      <BookOpen className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="book-4" />,
      <BookOpen className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="book-5" />,
      <BookOpen className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="book-6" />,
      <BookOpen className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="book-7" />,
      <BookOpen className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="book-8" />
    ],
    practical: [
      <Zap className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="zap-1" />,
      <Zap className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="zap-2" />,
      <Zap className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="zap-3" />,
      <Zap className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="zap-4" />,
      <Zap className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="zap-5" />,
      <Zap className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="zap-6" />,
      <Zap className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="zap-7" />,
      <Zap className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="zap-8" />,
      <Zap className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="zap-9" />,
      <Zap className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="zap-10" />
    ],
    checkpoint: [
      <CheckCircle className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="check-1" />,
      <CheckCircle className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="check-2" />,
      <CheckCircle className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="check-3" />,
      <CheckCircle className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="check-4" />,
      <CheckCircle className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" key="check-5" />
    ]
  };
  
  return icons[category as keyof typeof icons]?.[order - 1] || icons.theoretical[0];
};

// Colores por dificultad
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'text-green-400';
    case 'intermediate': return 'text-yellow-400';
    case 'advanced': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

// Colores por categoría
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'theoretical': return '#ec4d58';
    case 'practical': return '#3B82F6';
    case 'checkpoint': return '#10B981';
    default: return '#6B7280';
  }
};

export default function DynamicTribunalCarousel({ 
  modules, 
  checkpoints, 
  title, 
  category, 
  className = '' 
}: DynamicTribunalCarouselProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Simular módulos completados (en producción vendría de la base de datos)
      setCompletedModules(['teorico-1', 'practico-1']);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Wheel navigation with enhanced focus
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Enhanced wheel navigation with smooth scrolling
      const scrollAmount = e.deltaY * 1.5;
      const currentScroll = carousel.scrollLeft;
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      
      let newScroll = currentScroll + scrollAmount;
      newScroll = Math.max(0, Math.min(newScroll, maxScroll));
      
      carousel.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    };

    // Add wheel listener with passive: false
    carousel.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      carousel.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Drag and drop navigation
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
    
    // Add cursor style
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grabbing';
      carouselRef.current.style.userSelect = 'none';
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUpOrLeave = useCallback(() => {
    setIsDragging(false);
    
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
      carouselRef.current.style.userSelect = 'auto';
    }
  }, []);

  // Touch support for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!carouselRef.current) return;
    
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return;
    
    e.preventDefault();
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Show scrollbar and arrows on desktop when hovering
  const handleMouseEnter = useCallback(() => {
    if (window.innerWidth >= 768) { // Desktop only
      setShowScrollbar(true);
      setShowArrows(true);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowScrollbar(false);
    setShowArrows(false);
  }, []);

  // Navigation functions
  const scrollToPrevious = useCallback(() => {
    if (!carouselRef.current) return;
    
    const carousel = carouselRef.current;
    const cardWidth = carousel.querySelector('.module-card')?.clientWidth || 320;
    const scrollAmount = cardWidth + 16; // card width + gap
    
    carousel.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  }, []);

  const scrollToNext = useCallback(() => {
    if (!carouselRef.current) return;
    
    const carousel = carouselRef.current;
    const cardWidth = carousel.querySelector('.module-card')?.clientWidth || 320;
    const scrollAmount = cardWidth + 16; // card width + gap
    
    carousel.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }, []);

  const canScrollLeft = () => {
    if (!carouselRef.current) return false;
    return carouselRef.current.scrollLeft > 0;
  };

  const canScrollRight = () => {
    if (!carouselRef.current) return false;
    const carousel = carouselRef.current;
    return carousel.scrollLeft < carousel.scrollWidth - carousel.clientWidth;
  };

  // Función para determinar si un módulo está desbloqueado
  const isModuleUnlocked = (module: TribunalModule) => {
    if (module.isLocked) return false;
    
    // Verificar prerrequisitos
    if (module.order === 1) return true;
    
    // Verificar si el módulo anterior está completado
    const previousModule = modules.find(m => m.order === module.order - 1);
    if (previousModule) {
      return completedModules.includes(previousModule.id);
    }
    
    return true;
  };

  // Función para refrescar datos
  const handleRefresh = () => {
    setIsLoading(true);
    // Simular recarga de datos
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className={`mb-8 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#ec4d58]" />
            <span className="text-[#fafafa]">Cargando módulos del Tribunal Imperial...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`mb-8 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style jsx>{`
        /* Custom scrollbar styles */
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fafafa;
          border-radius: 4px;
          transition: background 0.3s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e5e5e5;
        }
        
        /* Hide scrollbar on mobile */
        @media (max-width: 767px) {
          .custom-scrollbar::-webkit-scrollbar {
            display: none;
          }
        }
        
        /* Line clamp styles */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Ensure hover effects are not clipped */
        .module-card:hover {
          z-index: 10;
          position: relative;
        }
        
        /* Ensure top border is visible on hover */
        .hover\:border-t-2:hover {
          border-top-width: 2px !important;
          border-top-color: #fafafa !important;
        }
      `}</style>

      <h3 className="text-xl font-semibold text-[#fafafa] mb-4 flex items-center">
        {title} - Tribunal Imperial
        <span className="ml-2 text-sm text-[#fafafa]/70">
          ({modules.filter(m => m.category !== 'checkpoint').length} módulos, {modules.filter(m => m.category === 'checkpoint').length} puntos de control)
        </span>
        <button
          onClick={handleRefresh}
          className="ml-4 p-2 hover:bg-[#fafafa]/10 rounded-lg transition-colors"
          title="Actualizar módulos"
        >
          <RefreshCw className="w-4 h-4 text-[#fafafa]" />
        </button>
      </h3>

      <div className="relative group">
        {/* Navigation arrows - only visible on desktop when hovering */}
        {showArrows && canScrollLeft() && (
          <button
            onClick={scrollToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-[#fafafa]/90 hover:bg-[#fafafa] text-[#121212] p-2 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
            aria-label="Módulos anteriores"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        
        {showArrows && canScrollRight() && (
          <button
            onClick={scrollToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-[#fafafa]/90 hover:bg-[#fafafa] text-[#121212] p-2 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
            aria-label="Módulos siguientes"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div 
          ref={containerRef}
          className="relative"
        >
          <div
            ref={carouselRef}
            className={`custom-scrollbar transition-all duration-300 ${
              showScrollbar ? 'overflow-x-auto' : 'overflow-x-hidden'
            }`}
            style={{
              scrollbarWidth: showScrollbar ? 'auto' : 'none',
              msOverflowStyle: showScrollbar ? 'auto' : 'none',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: isDragging ? 'none' : 'auto'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex space-x-4 pb-4 pt-4">
              {modules.map((module) => {
                const isUnlocked = isModuleUnlocked(module);
                const isCompleted = completedModules.includes(module.id);
                const isControlPoint = module.category === 'checkpoint';
                
                return (
                  <div
                    key={module.id}
                    className="module-card flex-shrink-0 w-80 bg-[#0f0f0f] border border-[#232323] rounded-lg p-4 transition-all duration-200 hover:border-[#fafafa]/50 hover:shadow-lg hover:shadow-[#fafafa]/10 flex flex-col hover:border-t-2 hover:border-t-[#fafafa]"
                    style={{ minHeight: '220px' }}
                  >
                    {/* Control Point Badge */}
                    {isControlPoint && module.checkpointNumber && module.checkpointNumber > 0 && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <ControlPointBadge className="w-32" />
                      </div>
                    )}

                    {/* Module Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400 uppercase tracking-wide">
                          {module.difficulty}
                        </span>
                        {isCompleted && (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                        {!isUnlocked && (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        #{module.displayNumber}
                      </span>
                    </div>

                    {/* Module Title */}
                    <h4 className="text-lg font-semibold text-[#fafafa] mb-2 line-clamp-2">
                      {module.title}
                    </h4>

                    {/* Module Description */}
                    <p className="text-sm text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                      {module.description}
                    </p>

                    {/* Tags de duración */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                        {module.estimatedDuration} min
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                        {module.tags[0] || category}
                      </span>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto flex justify-center">
                      {!isUnlocked ? (
                        <button
                          disabled
                          className="w-full px-4 py-2 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium flex items-center justify-center space-x-2"
                        >
                          <Lock className="w-4 h-4" />
                          <span>Bloqueado</span>
                        </button>
                      ) : (
                        <Link
                          href={`/dashboard/iniciado/tribunal-content/${module.id}`}
                          className={`block w-full px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors duration-200 flex items-center justify-center space-x-2 ${
                            isControlPoint 
                              ? 'bg-[#FFD447] hover:bg-[#FFC437] text-[#121212] font-semibold' 
                              : 'bg-[#fafafa] hover:bg-[#e5e5e5] text-[#121212]'
                          }`}
                        >
                          {isControlPoint ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span>Tomar Punto de Control</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              <span>{isCompleted ? 'Revisar' : 'Comenzar'}</span>
                            </>
                          )}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation hint */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-[#fafafa]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="hidden md:inline">🖱️ Usa la rueda del mouse o arrastra para navegar</span>
          <span className="md:hidden">👆 Desliza para navegar</span>
        </div>
      </div>
    </div>
  );
}
