'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  BookOpen, 
  Plus,
  Target,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  FileText,
  Video,
  Play,
  Award,
  TrendingUp,
  Crown,
  Shield,
  Sword,
  Star,
  Zap,
  Brain
} from 'lucide-react';

interface Module {
  id: string;
  title: string;
  type: 'theoretical' | 'practical';
  description: string;
  duration: string;
  checkpoints: number;
  status: 'active' | 'draft' | 'archived';
  icon: React.ComponentType<{ className?: string }>;
  level: string;
}

interface Level {
  id: string;
  name: string;
  description: string;
  image: string;
  color: string;
  bgColor: string;
  modules: Module[];
  isUnlocked: boolean;
}

const levels: Level[] = [
  {
    id: 'iniciados',
    name: 'Iniciados',
    description: 'Fundamentos básicos de economía y trading',
    image: '/images/insignias/1-iniciados.png',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    isUnlocked: true,
    modules: []
  },
  {
    id: 'acolitos',
    name: 'Acólitos',
    description: 'Conceptos intermedios y análisis técnico',
    image: '/images/insignias/2-acolitos.png',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    isUnlocked: true,
    modules: []
  },
  {
    id: 'warriors',
    name: 'Warriors',
    description: 'Estrategias avanzadas y gestión de riesgo',
    image: '/images/insignias/3-warriors.png',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    isUnlocked: true,
    modules: []
  },
  {
    id: 'lord',
    name: 'Lord',
    description: 'Mastery en análisis fundamental',
    image: '/images/insignias/4-lords.png',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    isUnlocked: true,
    modules: []
  },
  {
    id: 'darth',
    name: 'Darth',
    description: 'Nivel máximo: Trading institucional',
    image: '/images/insignias/5-darths.png',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    isUnlocked: true,
    modules: []
  },
  {
    id: 'maestro',
    name: 'Maestro',
    description: 'Control total del sistema educativo',
    image: '/images/insignias/6-maestros.png',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20',
    isUnlocked: true,
    modules: []
  }
];

// Módulos de ejemplo para Iniciados
const iniciadosModules: Module[] = [
  {
    id: 't1',
    title: 'Introducción a la Lógica Económica',
    type: 'theoretical',
    description: 'Fundamentos de la economía y lógica de mercado',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: BookOpen,
    level: 'iniciados'
  },
  {
    id: 'p1',
    title: 'Introducción al Trading',
    type: 'practical',
    description: 'Primeros pasos en el mundo del trading',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: Target,
    level: 'iniciados'
  }
];

export default function DarthCoursesPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('iniciados');
  const [activeTab, setActiveTab] = useState<'overview' | 'theoretical' | 'practical' | 'checkpoints'>('overview');

  // Estilos CSS para line-clamp
  const lineClampStyle = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  // Asignar módulos de Iniciados al nivel correspondiente
  levels[0].modules = iniciadosModules;
  
  // Para otros niveles, no mostrar contenido placeholder
  levels.forEach((level, index) => {
    if (index > 0) {
      level.modules = [];
    }
  });

  const currentLevel = levels.find(level => level.id === selectedLevel);
  const theoreticalModules = currentLevel?.modules.filter(m => m.type === 'theoretical') || [];
  const practicalModules = currentLevel?.modules.filter(m => m.type === 'practical') || [];
  const checkpointModules = currentLevel?.modules.filter(m => m.id.startsWith('pc')) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-900';
      case 'draft': return 'text-yellow-400 bg-yellow-900';
      case 'archived': return 'text-gray-400 bg-gray-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'theoretical' 
      ? 'text-blue-400 bg-blue-900' 
      : 'text-green-400 bg-green-900';
  };

  return (
    <div className="w-full max-w-none">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#8A8A8A] mb-2">
          Gestión de Contenido
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-400">
          Administra el contenido educativo por niveles de la plataforma
        </p>
      </div>

      {/* Header con Botón de Crear Contenido */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2">Seleccionar Nivel:</h3>
          <p className="text-sm text-gray-400">Haz clic en un nivel para gestionar su contenido</p>
        </div>
        
        {/* Botón para Crear Contenido */}
        <button
          onClick={() => {
            // Redirigir al TRIBUNAL IMPERIAL
            window.location.href = '/dashboard/darth/courses/tribunal-imperial';
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FF8C00] text-[#1a1a1a] font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Crear Contenido
        </button>
      </div>

      {/* Selector de Niveles - Cards más pequeñas */}
      <div className="mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`p-3 rounded-lg border transition-all duration-300 ${
                selectedLevel === level.id
                  ? 'border-[#8A8A8A] bg-gradient-to-br from-[#2a2a2a] to-[#3a3a3a]'
                  : 'border-[#3a3a3a] bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] hover:border-[#4a4a4a]'
              } hover:scale-105`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 mb-2 relative">
                  <Image
                    src={level.image}
                    alt={level.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h4 className="text-white font-medium text-xs mb-1">
                  {level.name}
                </h4>
                <p className="text-gray-400 text-xs leading-tight" style={lineClampStyle}>
                  {level.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Estadísticas del Nivel Seleccionado */}
      {currentLevel && (
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <div className="w-16 h-16 relative">
              <Image
                src={currentLevel.image}
                alt={currentLevel.name}
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">
                {currentLevel.name}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                {currentLevel.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                {theoreticalModules.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Módulos Teóricos</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                {practicalModules.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Módulos Prácticos</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                {checkpointModules.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Puntos de Control</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                {theoreticalModules.length + practicalModules.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Total Módulos</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs de Contenido */}
      <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-2 sm:px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm lg:text-base whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-[#8A8A8A] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Vista General
        </button>
        <button
          onClick={() => setActiveTab('theoretical')}
          className={`px-2 sm:px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm lg:text-base whitespace-nowrap ${
            activeTab === 'theoretical'
              ? 'bg-[#8A8A8A] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Teóricos ({theoreticalModules.length})
        </button>
        <button
          onClick={() => setActiveTab('practical')}
          className={`px-2 sm:px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm lg:text-base whitespace-nowrap ${
            activeTab === 'practical'
              ? 'bg-[#8A8A8A] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Prácticos ({practicalModules.length})
        </button>
        <button
          onClick={() => setActiveTab('checkpoints')}
          className={`px-2 sm:px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm lg:text-base whitespace-nowrap ${
            activeTab === 'checkpoints'
              ? 'bg-[#8A8A8A] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Puntos de Control ({checkpointModules.length})
        </button>
      </div>

      {/* Contenido según Tab */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] overflow-hidden">
        <div className="p-3 sm:p-4 lg:p-6 border-b border-[#3a3a3a]">
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white">
            {activeTab === 'overview' && 'Vista General del Nivel'}
            {activeTab === 'theoretical' && 'Módulos Teóricos'}
            {activeTab === 'practical' && 'Módulos Prácticos'}
            {activeTab === 'checkpoints' && 'Puntos de Control'}
          </h3>
        </div>
        
        <div className="p-3 sm:p-4 lg:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-medium mb-3 text-sm sm:text-base">Módulos Teóricos</h4>
                  <div className="space-y-2">
                    {theoreticalModules.slice(0, 4).map((module) => (
                      <div key={module.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-[#2a2a2a] rounded-lg">
                        <module.icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-xs sm:text-sm font-medium truncate">{module.title}</div>
                          <div className="text-gray-400 text-xs">{module.description}</div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(module.status)} flex-shrink-0`}>
                          {module.status}
                        </span>
                      </div>
                    ))}
                    {theoreticalModules.length > 4 && (
                      <div className="text-center text-gray-400 text-xs sm:text-sm py-2">
                        +{theoreticalModules.length - 4} módulos más
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-3 text-sm sm:text-base">Módulos Prácticos</h4>
                  <div className="space-y-2">
                    {practicalModules.slice(0, 4).map((module) => (
                      <div key={module.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-[#2a2a2a] rounded-lg">
                        <module.icon className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-xs sm:text-sm font-medium truncate">{module.title}</div>
                          <div className="text-gray-400 text-xs">{module.description}</div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(module.status)} flex-shrink-0`}>
                          {module.status}
                        </span>
                      </div>
                    ))}
                    {practicalModules.length > 4 && (
                      <div className="text-center text-gray-400 text-xs sm:text-sm py-2">
                        +{practicalModules.length - 4} módulos más
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theoretical' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
              {theoreticalModules.map((module) => (
                <div key={module.id} className="flex items-start gap-3 p-3 sm:p-4 bg-[#2a2a2a] rounded-lg">
                  <module.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm sm:text-base font-medium mb-1">{module.title}</div>
                    <div className="text-gray-400 text-xs sm:text-sm mb-2">{module.description}</div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm">
                      <span className="text-gray-400">🎯 {module.checkpoints} punto{module.checkpoints !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(module.status)} flex-shrink-0`}>
                    {module.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'practical' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
              {practicalModules.map((module) => (
                <div key={module.id} className="flex items-start gap-3 p-3 sm:p-4 bg-[#2a2a2a] rounded-lg">
                  <module.icon className="w-5 h-5 sm:w-6 sm:h-5 text-green-400 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm sm:text-base font-medium mb-1">{module.title}</div>
                    <div className="text-gray-400 text-xs sm:text-sm mb-2">{module.description}</div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm">
                      <span className="text-gray-400">🎯 {module.checkpoints} punto{module.checkpoints !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(module.status)} flex-shrink-0`}>
                    {module.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'checkpoints' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
              {checkpointModules.map((module) => (
                <div key={module.id} className="flex items-start gap-3 p-3 sm:p-4 bg-[#2a2a2a] rounded-lg">
                  <module.icon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm sm:text-base font-medium mb-1">{module.title}</div>
                    <div className="text-gray-400 text-xs sm:text-sm mb-2">{module.description}</div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm">
                      <span className="text-gray-400">🎯 {module.checkpoints} punto{module.checkpoints !== 1 ? 's' : ''}</span>
                      <span className={`px-2 py-1 rounded text-xs ${getTypeColor(module.type)}`}>
                        {module.type === 'theoretical' ? 'Teórico' : 'Práctico'}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(module.status)} flex-shrink-0`}>
                    {module.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
