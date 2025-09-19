'use client';

import React from 'react';
import { Play, Clock, Star, ChevronRight } from 'lucide-react';
import { getTribunalColors, getLevelName, getLevelEmoji } from '@/lib/tribunal-colors';

interface TribunalContentCardProps {
  id: string;
  title: string;
  subtitle: string;
  level: number;
  customLevelText?: string; // Texto personalizado para el nivel
  duration?: number;
  difficulty?: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function TribunalContentCard({
  id,
  title,
  subtitle,
  level,
  customLevelText,
  duration = 0,
  difficulty = 1,
  isCompleted = false,
  isLocked = false,
  onClick,
  className = ''
}: TribunalContentCardProps) {
  const colors = getTribunalColors(level);
  
  // Usar texto personalizado si está disponible, sino usar el nivel normal
  const displayLevel = customLevelText || `Nivel ${level}`;
  const levelEmoji = level === 0 ? '📝' : `Nivel ${level}`;

  const handleClick = () => {
    if (!isLocked && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`
        relative group cursor-pointer transition-all duration-300 hover:scale-105
        ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
        ${className}
      `}
      onClick={handleClick}
      style={{
        backgroundColor: colors.card.background,
        borderColor: colors.border,
        boxShadow: colors.card.shadow
      }}
    >
      {/* Card Container */}
      <div className="relative overflow-hidden rounded-xl border-2 p-6 h-full flex flex-col">
        
        {/* Header con Nivel */}
        <div className="flex items-center justify-between mb-4">
          <div 
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `${colors.primary}20`,
              color: colors.primary,
              border: `1px solid ${colors.border}40`
            }}
          >
            <span>{displayLevel}</span>
          </div>
          
          {isCompleted && (
            <div className="flex items-center space-x-1">
              <span className="text-xs text-green-400 font-medium">Completado</span>
            </div>
          )}
        </div>

        {/* Título */}
        <h3 
          className="text-xl font-bold mb-2 line-clamp-2"
          style={{ color: colors.text }}
        >
          {title}
        </h3>

        {/* Subtítulo */}
        <p 
          className="text-sm mb-4 line-clamp-3 opacity-80 flex-grow"
          style={{ color: colors.text }}
        >
          {subtitle}
        </p>

        {/* Footer con duración y botón */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-4 text-xs opacity-70">
            {duration > 0 && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span style={{ color: colors.text }}>{duration} min</span>
              </div>
            )}
          </div>

          {/* Botón Comenzar */}
          <div
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm
              transition-all duration-200 group-hover:scale-105
              ${isLocked ? 'opacity-50' : ''}
            `}
            style={{
              backgroundColor: colors.button.background,
              color: colors.button.text
            }}
          >
            <Play className="w-4 h-4" />
            <span>Comenzar</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Overlay de bloqueado */}
        {isLocked && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                <span className="text-white text-xl">🔒</span>
              </div>
              <p className="text-white text-sm font-medium">Bloqueado</p>
            </div>
          </div>
        )}

        {/* Efecto hover */}
        <div 
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{ backgroundColor: colors.primary }}
        />
      </div>
    </div>
  );
}
