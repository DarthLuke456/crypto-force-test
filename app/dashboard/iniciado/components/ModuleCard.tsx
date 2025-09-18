'use client';

import Link from 'next/link';
import { CheckCircle, Play, Lock } from 'lucide-react';
import { Module } from '@/types/module';

interface ModuleCardProps {
  module: Module;
  isControlPoint: boolean;
  isLocked: boolean;
  isCompleted: boolean;
  lockMessage: string;
}

export default function ModuleCard({ 
  module, 
  isControlPoint, 
  isLocked, 
  isCompleted, 
  lockMessage 
}: ModuleCardProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#232323] rounded-xl p-4 hover:bg-[#2a2a2a] hover:border-[#ec4d58]/30 transition-all duration-300 group w-full h-[260px] flex flex-col">
      {/* Header con ícono - Altura fija */}
      <div className="flex items-start justify-between mb-3 h-10">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
          isCompleted ? 'bg-green-500 text-white' : 
          isLocked ? 'bg-[#2a2a2a] text-gray-400' : 
          'bg-[#ec4d58] text-white group-hover:bg-[#d63d47]'
        }`}>
          {isLocked ? <Lock className="w-3.5 h-3.5" /> : isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : (module.icon || <Play className="w-3.5 h-3.5" />)}
        </div>
      </div>
      
      {/* Título - Altura fija con más espacio */}
      <h3 className="text-base font-bold mb-3 text-white group-hover:text-[#ec4d58] transition-colors h-12 line-clamp-2 leading-tight">
        {module.title}
      </h3>
      
      {/* Descripción - Altura fija con scroll si es necesario */}
      <div className="flex-1 min-h-0 mb-3">
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 overflow-hidden">
          {module.description}
        </p>
      </div>

      {/* Botón o mensaje de bloqueo - Altura reducida */}
      <div className="h-10 flex-shrink-0">
        {isLocked && lockMessage ? (
          <div className="h-full p-2 bg-[#2a2a2a] border border-gray-600 rounded-lg flex items-center justify-center">
            <p className="text-xs text-gray-400 text-center line-clamp-2">
              🔒 {lockMessage}
            </p>
          </div>
        ) : (
          <Link
            href={module.path}
            className={`h-full flex items-center justify-center w-full text-center px-3 py-1.5 rounded-lg transition-all duration-300 font-medium text-sm ${
              isControlPoint ? 'bg-[#FFD447] hover:bg-[#e6c040] text-black shadow-lg hover:shadow-xl' :
              isCompleted ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl' : 
              'bg-[#ec4d58] hover:bg-[#d63d47] text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <span className="inline-flex items-center justify-center">
              {isControlPoint ? (
                <>
                  <CheckCircle className="mr-1.5 w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate text-xs">Tomar Evaluación</span>
                </>
              ) : isCompleted ? (
                <>
                  <CheckCircle className="mr-1.5 w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate text-xs">Completado</span>
                </>
              ) : (
                <>
                  <Play className="mr-1.5 w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate text-xs">Acceder al Módulo</span>
                </>
              )}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
} 