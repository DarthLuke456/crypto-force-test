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
  Brain,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Timer
} from 'lucide-react';
import { useRealTribunalContent } from './hooks/useRealTribunalContent';

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

// Módulos de Iniciados (8 teóricos + 10 prácticos + 9 puntos de control)
const iniciadosModules: Module[] = [
  // Módulos Teóricos (8)
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
    id: 't2',
    title: 'Fuerzas del Mercado',
    type: 'theoretical',
    description: 'Oferta, demanda y equilibrio de mercado',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: FileText,
    level: 'iniciados'
  },
  {
    id: 't3',
    title: 'Acción del Gobierno en los Mercados',
    type: 'theoretical',
    description: 'Intervención gubernamental y regulaciones',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: BarChart3,
    level: 'iniciados'
  },
  {
    id: 't4',
    title: 'Competencia Perfecta',
    type: 'theoretical',
    description: 'Modelos de competencia y estructura de mercado',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: Award,
    level: 'iniciados'
  },
  {
    id: 't5',
    title: 'Teoría de Juegos',
    type: 'theoretical',
    description: 'Estrategias y toma de decisiones en mercados',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: Users,
    level: 'iniciados'
  },
  {
    id: 't6',
    title: 'Economía del Comportamiento',
    type: 'theoretical',
    description: 'Psicología y sesgos en la toma de decisiones',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: Brain,
    level: 'iniciados'
  },

  // Módulos Prácticos (10) - Solo estos, NO incluir puntos de control
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
  },
  {
    id: 'p2',
    title: 'Análisis Técnico Básico',
    type: 'practical',
    description: 'Gráficos y patrones básicos',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: BarChart3,
    level: 'iniciados'
  },
  {
    id: 'p3',
    title: 'Indicadores Técnicos',
    type: 'practical',
    description: 'RSI, MACD y otros indicadores',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: TrendingUp,
    level: 'iniciados'
  },
  {
    id: 'p4',
    title: 'Gestión de Riesgo',
    type: 'practical',
    description: 'Stop loss y position sizing',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: Shield,
    level: 'iniciados'
  },
  {
    id: 'p5',
    title: 'Psicología del Trading',
    type: 'practical',
    description: 'Control emocional y disciplina',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: Users,
    level: 'iniciados'
  },
  {
    id: 'p6',
    title: 'Análisis Fundamental 1',
    type: 'practical',
    description: 'Análisis de empresas y sectores',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: FileText,
    level: 'iniciados'
  },
  {
    id: 'p7',
    title: 'Análisis Fundamental 2',
    type: 'practical',
    description: 'Ratios financieros y valuación',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: FileText,
    level: 'iniciados'
  },
  {
    id: 'p8',
    title: 'Gestión de Riesgo Avanzada',
    type: 'practical',
    description: 'Hedging y diversificación',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: Shield,
    level: 'iniciados'
  },
  {
    id: 'p9',
    title: 'Plan de Trading',
    type: 'practical',
    description: 'Desarrollo de estrategias personalizadas',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: Target,
    level: 'iniciados'
  },
  {
    id: 'p10',
    title: 'Trading en Diferentes Mercados',
    type: 'practical',
    description: 'Forex, acciones, commodities',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: BarChart3,
    level: 'iniciados'
  },
  // Puntos de Control (9 total: 4 teóricos + 5 prácticos)
  {
    id: 'pc1',
    title: 'Punto de Control 1: Fundamentos Económicos',
    type: 'theoretical',
    description: 'Evaluación de conceptos básicos de economía',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: CheckCircle,
    level: 'iniciados'
  },
  {
    id: 'pc2',
    title: 'Punto de Control 2: Mercados y Competencia',
    type: 'theoretical',
    description: 'Evaluación de estructura de mercados',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: CheckCircle,
    level: 'iniciados'
  },
  {
    id: 'pc3',
    title: 'Punto de Control 3: Teoría de Juegos',
    type: 'theoretical',
    description: 'Evaluación de estrategias de decisión',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: CheckCircle,
    level: 'iniciados'
  },
  {
    id: 'pc4',
    title: 'Punto de Control 4: Economía del Comportamiento',
    type: 'theoretical',
    description: 'Evaluación de sesgos psicológicos',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: CheckCircle,
    level: 'iniciados'
  },
  {
    id: 'pc5',
    title: 'Punto de Control 5: Análisis Técnico Básico',
    type: 'practical',
    description: 'Evaluación de habilidades técnicas básicas',
    duration: '',
    checkpoints: 1,
    status: 'active',
    icon: CheckCircle,
    level: 'iniciados'
  },

];

export default function CoursesPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('iniciados');
  const [activeTab, setActiveTab] = useState<'overview' | 'theoretical' | 'practical' | 'checkpoints'>('overview');
  
  // Hook para contenido real del Tribunal Imperial
  const {
    realModules,
    tribunalStats,
    isLoading,
    error,
    lastUpdated,
    getModulesByLevel,
    getModulesByType,
    getLevelStats,
    refreshContent,
    getSystemStatus,
    hasRealContent,
    isSystemHealthy
  } = useRealTribunalContent();

  // Estilos CSS para line-clamp
  const lineClampStyle = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  // Obtener módulos reales del Tribunal Imperial para el nivel seleccionado
  const realLevelModules = getModulesByLevel(selectedLevel);
  const realTheoreticalModules = getModulesByType(selectedLevel, 'theoretical');
  const realPracticalModules = getModulesByType(selectedLevel, 'practical');
  const realCheckpointModules = getModulesByType(selectedLevel, 'checkpoint');
  const levelStats = getLevelStats(selectedLevel);

  // Combinar módulos reales con módulos de ejemplo (solo si no hay contenido real)
  const currentLevel = levels.find(level => level.id === selectedLevel);
  
  // Solo usar contenido real del Tribunal Imperial, NO mostrar contenido de ejemplo
  const theoreticalModules = realTheoreticalModules.map(module => ({
    id: module.id,
    title: module.title,
    type: module.type,
    description: module.description,
    duration: module.duration,
    checkpoints: module.checkpoints,
    status: module.status,
    icon: getIconComponent(module.icon),
    level: module.level
  }));

  const practicalModules = realPracticalModules.map(module => ({
    id: module.id,
    title: module.title,
    type: module.type,
    description: module.description,
    duration: module.duration,
    checkpoints: module.checkpoints,
    status: module.status,
    icon: getIconComponent(module.icon),
    level: module.level
  }));

  const checkpointModules = realCheckpointModules.map(module => ({
    id: module.id,
    title: module.title,
    type: module.type,
    description: module.description,
    duration: module.duration,
    checkpoints: module.checkpoints,
    status: module.status,
    icon: getIconComponent(module.icon),
    level: module.level
  }));

  // Función para obtener el componente de icono
  function getIconComponent(iconString: string) {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      '📚': BookOpen,
      '🎯': Target,
      '✅': CheckCircle,
      '📝': FileText,
      '⏳': Timer,
      '❌': XCircle,
      '📄': FileText,
      '🎥': Video,
      '💻': BarChart3,
      '🧠': Brain,
      '📊': BarChart3,
      '🏆': Award,
      '👥': Users,
      '🛡️': Shield,
      '⚡': Zap,
      '⭐': Star,
      '👑': Crown,
      '🗡️': Sword
    };
    return iconMap[iconString] || BookOpen;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': 
      case 'approved': 
        return 'text-green-400 bg-green-900';
      case 'draft': 
        return 'text-yellow-400 bg-yellow-900';
      case 'pending': 
        return 'text-blue-400 bg-blue-900';
      case 'rejected': 
        return 'text-red-400 bg-red-900';
      case 'archived': 
        return 'text-gray-400 bg-gray-900';
      default: 
        return 'text-gray-400 bg-gray-900';
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

      {/* Header con Botón de Crear Contenido y Estado del Sistema */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2">Seleccionar Nivel:</h3>
          <p className="text-sm text-gray-400">Haz clic en un nivel para gestionar su contenido</p>
          
          {/* Estado del Tribunal Imperial */}
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${isSystemHealthy ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-xs text-gray-400">
              Tribunal Imperial: {isSystemHealthy ? 'Activo' : 'Inactivo'}
            </span>
            {lastUpdated && (
              <span className="text-xs text-gray-500">
                • Actualizado: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Botón de Refrescar */}
          <button
            onClick={refreshContent}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-all duration-300"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Cargando...' : 'Actualizar'}
          </button>
        
        {/* Botón para Crear Contenido */}
        <button
          onClick={() => {
            // Redirigir al TRIBUNAL IMPERIAL
            window.location.href = '/dashboard/maestro/courses/tribunal-imperial';
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FF8C00] text-[#1a1a1a] font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Crear Contenido
        </button>
        </div>
      </div>

      {/* Estadísticas del Tribunal Imperial */}
      {hasRealContent && (
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#FFD700]" />
              Estadísticas del Tribunal Imperial
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              {tribunalStats.approvedModules} aprobados
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{tribunalStats.totalModules}</div>
              <div className="text-xs text-gray-400">Total Módulos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{tribunalStats.approvedModules}</div>
              <div className="text-xs text-gray-400">Aprobados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{tribunalStats.pendingModules}</div>
              <div className="text-xs text-gray-400">Pendientes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{tribunalStats.completedIntegrations}</div>
              <div className="text-xs text-gray-400">Integraciones</div>
            </div>
      </div>
          
          {tribunalStats.activeVotes > 0 && (
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-blue-400">
                <Timer className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {tribunalStats.activeVotes} propuesta{tribunalStats.activeVotes !== 1 ? 's' : ''} en votación
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mensaje de Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error del Tribunal Imperial</span>
          </div>
          <p className="text-red-300 text-sm mt-1">{error}</p>
        </div>
      )}

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
                {hasRealContent ? levelStats.theoretical : theoreticalModules.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Módulos Teóricos</div>
              {hasRealContent && levelStats.approved > 0 && (
                <div className="text-xs text-green-400 mt-1">
                  {levelStats.approved} aprobados
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                {hasRealContent ? levelStats.practical : practicalModules.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Módulos Prácticos</div>
              {hasRealContent && levelStats.pending > 0 && (
                <div className="text-xs text-blue-400 mt-1">
                  {levelStats.pending} pendientes
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                {hasRealContent ? levelStats.checkpoints : checkpointModules.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Puntos de Control</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                {hasRealContent ? levelStats.total : theoreticalModules.length + practicalModules.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Total Módulos</div>
              {hasRealContent && (
                <div className="text-xs text-gray-500 mt-1">
                  {levelStats.hasContent ? 'Contenido real' : 'Sin contenido'}
                </div>
              )}
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
          {/* Mensaje informativo sobre contenido del Tribunal Imperial */}
          {theoreticalModules.length === 0 && practicalModules.length === 0 && checkpointModules.length === 0 && (
            <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Crown className="w-5 h-5 text-[#FFD700] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-blue-400 font-medium mb-1">Contenido del Tribunal Imperial</h4>
                  <p className="text-blue-300 text-sm mb-2">
                    No hay contenido disponible para este nivel. Crea y aprueba módulos a través del Tribunal Imperial 
                    para que aparezcan aquí automáticamente.
                  </p>
                  <button
                    onClick={() => window.location.href = '/dashboard/maestro/tribunal-creator'}
                    className="text-[#FFD700] hover:text-[#FFA500] text-sm font-medium transition-colors"
                  >
                    Crear Contenido →
                  </button>
                </div>
              </div>
            </div>
          )}

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
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(module.status)}`}>
                          {module.status}
                        </span>
                          {hasRealContent && realLevelModules.some(rm => rm.id === module.id) && (
                            <div className="flex items-center gap-1">
                              <Crown className="w-3 h-3 text-[#FFD700]" />
                              <span className="text-xs text-[#FFD700]">Tribunal</span>
                            </div>
                          )}
                        </div>
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
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(module.status)}`}>
                          {module.status}
                        </span>
                          {hasRealContent && realLevelModules.some(rm => rm.id === module.id) && (
                            <div className="flex items-center gap-1">
                              <Crown className="w-3 h-3 text-[#FFD700]" />
                              <span className="text-xs text-[#FFD700]">Tribunal</span>
                            </div>
                          )}
                        </div>
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
                      {hasRealContent && realLevelModules.some(rm => rm.id === module.id) && (
                        <>
                          <span className="text-gray-400">⏱️ {module.duration}</span>
                          {realLevelModules.find(rm => rm.id === module.id)?.authorName && (
                            <span className="text-gray-400">
                              👤 {realLevelModules.find(rm => rm.id === module.id)?.authorName}
                            </span>
                          )}
                        </>
                      )}
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
                  <module.icon className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm sm:text-base font-medium mb-1">{module.title}</div>
                    <div className="text-gray-400 text-xs sm:text-sm mb-2">{module.description}</div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm">
                      <span className="text-gray-400">🎯 {module.checkpoints} punto{module.checkpoints !== 1 ? 's' : ''}</span>
                      {hasRealContent && realLevelModules.some(rm => rm.id === module.id) && (
                        <>
                          <span className="text-gray-400">⏱️ {module.duration}</span>
                          {realLevelModules.find(rm => rm.id === module.id)?.authorName && (
                            <span className="text-gray-400">
                              👤 {realLevelModules.find(rm => rm.id === module.id)?.authorName}
                            </span>
                          )}
                        </>
                      )}
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
