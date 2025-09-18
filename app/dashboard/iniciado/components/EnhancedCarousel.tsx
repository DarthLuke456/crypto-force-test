'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselSlide {
  type: 'image' | 'title' | 'subtitle' | 'description' | 'quote' | 'philosophy';
  content: string;
  duration: number;
}

interface EnhancedCarouselProps {
  content: CarouselSlide[];
  className?: string;
  titleColor?: string;
  dotsColor?: string;
}

export default function EnhancedCarousel({ content, className = '', titleColor = '#fafafa', dotsColor = '#ec4d58' }: EnhancedCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef(content);

  // Update content ref when content changes
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Function to go to specific slide
  const goToSlide = useCallback((slideIndex: number) => {
    setCurrentSlide(slideIndex);
  }, []);

  // Auto-advance effect
  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const currentDuration = contentRef.current[currentSlide]?.duration || 2500;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % contentRef.current.length);
    }, currentDuration);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, currentSlide]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + content.length) % content.length);
  }, [content.length]);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % content.length);
  }, [content.length]);

  const renderSlide = (slide: CarouselSlide) => {
    switch (slide.type) {
      case 'image':
        return (
          <div className="flex items-center justify-center h-full">
            <img 
              src={slide.content} 
              alt="Iniciado Insignia" 
              className="max-h-48 max-w-full object-contain"
            />
          </div>
        );
      case 'title':
        return (
          <div className="flex items-center justify-center h-full text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-wider" style={{ color: titleColor }}>
              {slide.content}
            </h2>
          </div>
        );
      case 'subtitle':
        return (
          <div className="flex items-center justify-center h-full text-center px-8">
            <h3 className="text-xl md:text-2xl text-[#fafafa] font-medium">
              {slide.content}
            </h3>
          </div>
        );
      case 'description':
        return (
          <div className="flex items-center justify-center h-full text-center px-8">
            <p className="text-base md:text-lg text-[#fafafa] leading-relaxed max-w-2xl">
              {slide.content}
            </p>
          </div>
        );
      case 'quote':
        return (
          <div className="flex items-center justify-center h-full text-center px-8">
            <blockquote className="text-lg md:text-xl text-[#fafafa] font-medium italic">
              "{slide.content}"
            </blockquote>
          </div>
        );
      case 'philosophy':
        return (
          <div className="flex items-center justify-center h-full text-center px-8">
            <p className="text-sm md:text-base text-[#fafafa] leading-relaxed max-w-3xl">
              {slide.content}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`w-full max-w-4xl mx-auto mb-16 ${className}`}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
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
      `}</style>
      
      <div className="bg-[#0f0f0f] border border-[#232323] rounded-lg overflow-hidden relative">
        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-[#232323]/80 hover:bg-[#232323] text-[#fafafa] p-2 rounded-full transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-[#232323]/80 hover:bg-[#232323] text-[#fafafa] p-2 rounded-full transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
          aria-label="Slide siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div 
          className="relative h-64 group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            key={currentSlide}
            className="absolute inset-0 animate-fade-in"
          >
            {renderSlide(content[currentSlide])}
          </div>
          
          {/* Play/Pause Icon - Clickeable */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="absolute top-4 right-4 z-10 bg-[#232323]/80 hover:bg-[#232323] rounded-full p-2 transition-all duration-200 hover:scale-110 cursor-pointer"
            aria-label={isPaused ? "Reanudar presentación" : "Pausar presentación"}
          >
            {isPaused ? (
              <div className="w-4 h-4 bg-[#fafafa] rounded-sm" />
            ) : (
              <div className="w-0 h-0 border-l-[8px] border-l-[#fafafa] border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
            )}
          </button>
          
          {/* Progress dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {content.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 cursor-pointer ${
                  index === currentSlide 
                    ? 'shadow-lg' 
                    : 'bg-[#fafafa]/30 hover:bg-[#fafafa]/50'
                }`}
                style={{
                  backgroundColor: index === currentSlide ? dotsColor : undefined
                }}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Wheel navigation hint */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="hidden md:inline">🖱️ Usa la rueda del mouse para navegar</span>
          <span className="md:hidden">👆 Desliza para navegar</span>
        </div>
      </div>
    </div>
  );
}
