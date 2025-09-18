'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Play, Pause } from 'lucide-react';

interface CarouselSlide {
  type: 'image' | 'title' | 'subtitle' | 'description' | 'quote' | 'philosophy';
  content: string;
  duration: number;
}

interface CarouselProps {
  content: CarouselSlide[];
}

export default function Carousel({ content }: CarouselProps) {
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

  const renderSlide = (slide: CarouselSlide) => {
    switch (slide.type) {
      case 'image':
        return (
          <div className="flex justify-center items-center h-64">
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <Image
                src={slide.content}
                alt="Iniciado"
                width={128}
                height={128}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        );
      case 'title':
        return (
          <div className="flex justify-center items-center h-64">
            <h1 className="text-3xl font-light text-white tracking-wider">
              {slide.content}
            </h1>
          </div>
        );
      case 'subtitle':
        return (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-300 font-light tracking-wide max-w-2xl text-center leading-relaxed">
              {slide.content}
            </p>
          </div>
        );
      case 'description':
        return (
          <div className="flex justify-center items-center h-64">
            <p className="text-sm text-gray-400 font-light tracking-wide max-w-3xl text-center leading-relaxed px-8">
              {slide.content}
            </p>
          </div>
        );
      case 'quote':
        return (
          <div className="flex justify-center items-center h-64">
            <blockquote className="text-lg text-white font-light italic tracking-wide max-w-2xl text-center leading-relaxed">
              "{slide.content}"
            </blockquote>
          </div>
        );
      case 'philosophy':
        return (
          <div className="flex justify-center items-center h-64">
            <p className="text-sm text-gray-300 font-light tracking-wide max-w-4xl text-center leading-relaxed px-8">
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
      className="w-full max-w-4xl mx-auto mb-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-in-out;
        }
      `}</style>
      
      <div className="bg-[#0f0f0f] border border-[#232323] rounded-lg overflow-hidden relative">
        <div className="relative h-64">
          <div 
            key={currentSlide}
            className="absolute inset-0 animate-fade-in"
          >
            {renderSlide(content[currentSlide])}
          </div>
          
          {/* Play/Pause Icon */}
          <div className="absolute top-4 right-4 z-10">
            {isPaused ? (
              <Pause className="text-[#fafafa] text-lg" />
            ) : (
              <Play className="text-[#fafafa] text-lg" />
            )}
          </div>
          
          {/* Progress dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {content.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 cursor-pointer ${
                  index === currentSlide 
                    ? 'bg-[#ec4d58] shadow-lg' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}    