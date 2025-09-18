'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, Check, BookOpen } from 'lucide-react';
// Usar la interfaz del hook useProposals que es la que realmente se guarda
interface TribunalProposal {
  id: string;
  title: string;
  description: string;
  category: 'theoretical' | 'practical';
  targetHierarchy: number;
  content: any[];
  authorId: string;
  authorName: string;
  authorLevel: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  votes: {
    maestros: string[];
    approvals: string[];
    rejections: string[];
  };
}

interface DynamicTribunalCarouselProps {
  modules: TribunalProposal[];
  title: string;
  category: 'theoretical' | 'practical';
  className?: string;
}

export default function DynamicTribunalCarousel({ 
  modules, 
  title, 
  category, 
  className = '' 
}: DynamicTribunalCarouselProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Wheel navigation with enhanced focus - IDÉNTICO a Iniciado
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

  // Drag and drop navigation - IDÉNTICO a Iniciado
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

  // Touch support for mobile - IDÉNTICO a Iniciado
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

  // Show scrollbar and arrows on desktop when hovering - IDÉNTICO a Iniciado
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

  // Navigation functions - IDÉNTICO a Iniciado
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

  // Si no hay módulos, mostrar mensaje
  if (modules.length === 0) {
    return (
      <div className={`mb-8 ${className}`}>
        <h3 className="text-xl font-semibold text-[#FFD447] mb-4 flex items-center">
          {title}
          <span className="ml-2 text-sm text-gray-400">
            (0 módulos)
          </span>
        </h3>
        
        <div className="bg-[#0f0f0f] border border-[#232323] rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-2">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          </div>
          <p className="text-gray-400 text-lg">
            No hay módulos {category === 'theoretical' ? 'teóricos' : 'prácticos'} disponibles aún
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Los módulos aparecerán aquí una vez que sean aprobados por el Tribunal Imperial
          </p>
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
        /* Custom scrollbar styles - IDÉNTICO a Iniciado */
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FFD447;
          border-radius: 4px;
          transition: background 0.3s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #FFC437;
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
          border-top-color: #FFD447 !important;
        }
      `}</style>

      <h3 className="text-xl font-semibold text-[#FFD447] mb-4 flex items-center">
        {title}
        <span className="ml-2 text-sm text-gray-400">
          ({modules.length} módulos aprobados)
        </span>
      </h3>

      <div className="relative group">
        {/* Navigation arrows - only visible on desktop when hovering */}
        {showArrows && canScrollLeft() && (
          <button
            onClick={scrollToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-[#232323]/90 hover:bg-[#232323] text-[#fafafa] p-2 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
            aria-label="Módulos anteriores"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        
        {showArrows && canScrollRight() && (
          <button
            onClick={scrollToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-[#232323]/90 hover:bg-[#232323] text-[#fafafa] p-2 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
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
              {modules.map((module, index) => (
                <React.Fragment key={module.id}>
                  {/* Módulo de contenido */}
                  <div
                    className="module-card flex-shrink-0 w-80 bg-[#0f0f0f] border border-[#232323] rounded-lg p-4 transition-all duration-200 hover:border-[#FFD447]/50 hover:shadow-lg hover:shadow-[#FFD447]/10 flex flex-col hover:border-t-2 hover:border-t-[#FFD447]"
                    style={{ minHeight: '220px' }}
                  >
                    {/* Module Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400 uppercase tracking-wide">
                          {module.authorLevel === 5 ? 'Darth' : module.authorLevel === 6 ? 'Maestro' : 'Acólito'}
                        </span>
                        <span className="text-xs text-[#FFD447] bg-[#FFD447]/10 px-2 py-1 rounded-full">
                          {category === 'theoretical' ? 'Teórico' : 'Práctico'}
                        </span>
                      </div>
                    </div>

                    {/* Module Title */}
                    <h4 className="text-lg font-semibold text-[#fafafa] mb-2 line-clamp-2">
                      {module.title}
                    </h4>

                    {/* Module Description */}
                    <p className="text-sm text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                      {module.description}
                    </p>

                    {/* Author Info */}
                    <div className="text-xs text-gray-500 mb-4">
                      <span>Por: {module.authorName || 'Autor'}</span>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto flex justify-center">
                      <Link
                        href={`/dashboard/acolito/modulo/${module.id}`}
                        className="block w-full px-4 py-2 text-white rounded-lg text-sm font-medium text-center transition-colors duration-200 flex items-center justify-center space-x-2 bg-[#FFD447] hover:bg-[#FFC437] text-gray-900 font-semibold"
                      >
                        <Play className="w-4 h-4" />
                        <span>Comenzar Módulo</span>
                      </Link>
                    </div>
                  </div>

                  {/* Punto de Control cada 2 módulos */}
                  {(index + 1) % 2 === 0 && (
                    <div
                      className="module-card flex-shrink-0 w-80 bg-[#0f0f0f] border border-[#232323] rounded-lg p-4 transition-all duration-200 hover:border-[#FFD447]/50 hover:shadow-lg hover:shadow-[#FFD447]/10 flex flex-col hover:border-t-2 hover:border-t-[#FFD447]"
                      style={{ minHeight: '220px' }}
                    >
                      {/* Checkpoint Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400 uppercase tracking-wide">
                            Punto de Control
                          </span>
                          <span className="text-xs text-[#FFD447] bg-[#FFD447]/10 px-2 py-1 rounded-full">
                            {category === 'theoretical' ? 'Teórico' : 'Práctico'}
                          </span>
                        </div>
                      </div>

                      {/* Checkpoint Title */}
                      <h4 className="text-lg font-semibold text-[#fafafa] mb-2 line-clamp-2">
                        Punto de Control {Math.floor((index + 1) / 2)}
                      </h4>

                      {/* Checkpoint Description */}
                      <p className="text-sm text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                        Evalúa tus conocimientos adquiridos en los módulos anteriores
                      </p>

                      {/* Checkpoint Info */}
                      <div className="text-xs text-gray-500 mb-4">
                        <span>Módulos evaluados: {index + 1}</span>
                      </div>

                      {/* Action Button */}
                      <div className="mt-auto flex justify-center">
                        <Link
                          href={`/dashboard/acolito/punto-control/${category}/${Math.floor((index + 1) / 2)}`}
                          className="block w-full px-4 py-2 text-white rounded-lg text-sm font-medium text-center transition-colors duration-200 flex items-center justify-center space-x-2 bg-[#FFD447] hover:bg-[#FFC437] text-gray-900 font-semibold"
                        >
                          <Check className="w-4 h-4" />
                          <span>Tomar Punto de Control</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation hint */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="hidden md:inline">🖱️ Usa la rueda del mouse o arrastra para navegar</span>
          <span className="md:hidden">👆 Desliza para navegar</span>
        </div>
      </div>
    </div>
  );
}
