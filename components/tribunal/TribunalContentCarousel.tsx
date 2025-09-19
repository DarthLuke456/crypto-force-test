'use client';

import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TribunalContentCard from './TribunalContentCard';
import { getTribunalColors, getLevelName } from '@/lib/tribunal-colors';

interface TribunalContent {
  id: string;
  title: string;
  subtitle: string;
  level: number;
  category?: 'theoretical' | 'practical';
  content_type?: 'module' | 'checkpoint' | 'resource';
  description?: string;
  thumbnail_url?: string;
  duration_minutes?: number;
  difficulty_level?: number;
  is_published?: boolean;
  is_featured?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
  duration?: number;
  difficulty?: number;
  isCompleted?: boolean;
  isLocked?: boolean;
}

interface TribunalContentCarouselProps {
  title: string;
  content: TribunalContent[];
  level: number;
  onContentClick?: (content: TribunalContent) => void;
  className?: string;
}

export default function TribunalContentCarousel({
  title,
  content,
  level,
  onContentClick,
  className = ''
}: TribunalContentCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const colors = getTribunalColors(level);
  const levelName = getLevelName(level);

  const itemsPerView = 3; // Número de items visibles
  const maxIndex = Math.max(0, content.length - itemsPerView);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.children[0]?.clientWidth || 0;
      const gap = 16; // gap-4 = 16px
      const scrollLeft = index * (itemWidth + gap);
      
      scrollRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
    setCurrentIndex(index);
  };

  const handlePrevious = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    scrollToIndex(newIndex);
  };

  const handleContentClick = (contentItem: TribunalContent) => {
    if (onContentClick) {
      onContentClick(contentItem);
    }
  };

  if (content.length === 0) {
    return (
      <div className={`w-full max-w-6xl mx-auto ${className}`}>
        <div className="text-center py-12">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              backgroundColor: `${colors.primary}20`,
              border: `2px solid ${colors.border}40`
            }}
          >
            <span className="text-2xl">📚</span>
          </div>
          <h3 
            className="text-xl font-bold mb-2"
            style={{ color: colors.text }}
          >
            No hay contenido disponible
          </h3>
          <p 
            className="text-sm opacity-70"
            style={{ color: colors.text }}
          >
            El contenido para {levelName} se está preparando
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 
            className="text-2xl font-bold mb-1"
            style={{ color: colors.text }}
          >
            {title}
          </h2>
          <p 
            className="text-sm opacity-70"
            style={{ color: colors.text }}
          >
            Contenido específico para {levelName}
          </p>
        </div>

        {/* Controles de navegación */}
        {content.length > itemsPerView && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
              `}
              style={{
                backgroundColor: `${colors.primary}20`,
                color: colors.primary,
                border: `1px solid ${colors.border}40`
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
              `}
              style={{
                backgroundColor: `${colors.primary}20`,
                color: colors.primary,
                border: `1px solid ${colors.border}40`
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-hidden scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {content.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-80"
            >
              <TribunalContentCard
                {...item}
                onClick={() => handleContentClick(item)}
              />
            </div>
          ))}
        </div>

        {/* Indicadores de posición */}
        {content.length > itemsPerView && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`
                  w-2 h-2 rounded-full transition-all duration-200
                  ${index === currentIndex ? 'scale-125' : 'scale-100'}
                `}
                style={{
                  backgroundColor: index === currentIndex ? colors.primary : `${colors.primary}40`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-6 text-center">
        <p 
          className="text-xs opacity-60"
          style={{ color: colors.text }}
        >
          {content.length} módulo{content.length !== 1 ? 's' : ''} disponible{content.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
