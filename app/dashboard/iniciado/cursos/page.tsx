'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  TrendingUp,
  CheckCircle,
  Users,
  Target,
  Shield,
  Building2,
  Network,
  BarChart3,
  Crown,
  Zap,
  Link as LinkIcon,
  Play,
  ArrowRight,
  ArrowLeft,
  Lock,
  Brain
} from 'lucide-react';
import Sidebar from '@/components/sidebar/Sidebar';
import { useSidebar } from '@/components/sidebar/SidebarContext';
import { useProgress } from '@/context/ProgressContext';
import ModuleCard from '../components/ModuleCard';
import EnhancedModuloCarousel from '../components/EnhancedModuloCarousel';
import { Module } from '@/types/module';

// Estilos CSS personalizados para line-clamp
const lineClampStyles = `
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
  
  .line-clamp-4 {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Módulos teóricos
const theoreticalModules: Module[] = [
  {
    id: '1',
    title: 'Introducción a la Lógica Económica',
    path: '/dashboard/iniciado/Teorico/1-introduccion-a-la-logica-economica',
    icon: <BookOpen className="w-6 h-6" />,
    description: 'Fundamentos de la economía y conceptos básicos de la lógica económica.',
    level: 'nivel1',
    type: 'content',
    moduleNumber: 1
  },
  {
    id: '2',
    title: 'Fuerzas del Mercado',
    path: '/dashboard/iniciado/Teorico/2-fuerzas-del-mercado',
    icon: <TrendingUp className="w-6 h-6" />,
    description: 'Análisis de la oferta, demanda y equilibrio de mercado.',
    level: 'nivel1',
    type: 'content',
    moduleNumber: 2
  },
  {
    id: 'PC1',
    title: 'Punto de Control 1',
    path: '/dashboard/iniciado/puntos-de-control/teorico/pc1',
    icon: <CheckCircle className="w-6 h-6" />,
    description: 'Evaluación: Introducción a la Lógica Económica y Fuerzas del Mercado.',
    level: 'nivel1',
    type: 'checkpoint',
    moduleNumber: 1
  },
  {
    id: '3',
    title: 'Acción del Gobierno en los Mercados',
    path: '/dashboard/iniciado/Teorico/3-accion-del-gobierno-en-los-mercados',
    icon: <Shield className="w-6 h-6" />,
    description: 'Intervención estatal, políticas públicas y regulación económica.',
    level: 'nivel1',
    type: 'content',
    moduleNumber: 3
  },
  {
    id: '4',
    title: 'Competencia Perfecta',
    path: '/dashboard/iniciado/Teorico/4-competencia-perfecta',
    icon: <Target className="w-6 h-6" />,
    description: 'Modelo de competencia perfecta y eficiencia de mercado.',
    level: 'nivel1',
    type: 'content',
    moduleNumber: 4
  },
  {
    id: 'PC2',
    title: 'Punto de Control 2',
    path: '/dashboard/iniciado/puntos-de-control/teorico/pc2',
    icon: <CheckCircle className="w-6 h-6" />,
    description: 'Evaluación: Acción del Gobierno y Competencia Perfecta.',
    level: 'nivel1',
    type: 'checkpoint',
    moduleNumber: 2
  },
  // Nivel 2 - Requieren PC1 completado
  {
    id: '5',
    title: 'Monopolio y Oligopolio',
    path: '/dashboard/iniciado/Teorico/5-monopolio-y-oligopolio',
    icon: <Crown className="w-6 h-6" />,
    description: 'Estructuras de mercado imperfectas y poder de mercado.',
    level: 'nivel2',
    type: 'content',
    moduleNumber: 5,
    requiredCheckpoint: 'PC1'
  },
  {
    id: '6',
    title: 'Tecnología Blockchain',
    path: '/dashboard/iniciado/Teorico/6-tecnologia-blockchain',
    icon: <LinkIcon className="w-6 h-6" />,
    description: 'Fundamentos de blockchain y su aplicación en economía.',
    level: 'nivel2',
    type: 'content',
    moduleNumber: 6,
    requiredCheckpoint: 'PC1'
  },
  {
    id: 'PC3',
    title: 'Punto de Control 3',
    path: '/dashboard/iniciado/puntos-de-control/teorico/pc3',
    icon: <CheckCircle className="w-6 h-6" />,
    description: 'Evaluación: Monopolio, Oligopolio y Tecnología Blockchain.',
    level: 'nivel2',
    type: 'checkpoint',
    moduleNumber: 3,
    requiredCheckpoint: 'PC2'
  },
  {
    id: '7',
    title: 'Módulo Avanzado 1',
    path: '/dashboard/iniciado/Teorico/7-modulo-avanzado-1',
    icon: <Zap className="w-6 h-6" />,
    description: 'Contenido avanzado de economía y trading.',
    level: 'nivel2',
    type: 'content',
    moduleNumber: 7,
    requiredCheckpoint: 'PC2'
  }
];

// Módulos prácticos
const practicalModules: Module[] = [
  {
    id: 'P1',
    title: 'Módulo Práctico 1',
    path: '/dashboard/iniciado/Practico/1-modulo-practico-1',
    icon: <TrendingUp className="w-6 h-6" />,
    description: 'Fundamentos prácticos de trading y análisis técnico.',
    level: 'nivel1',
    type: 'content',
    moduleNumber: 1
  },
  {
    id: 'P2',
    title: 'Módulo Práctico 2',
    path: '/dashboard/iniciado/Practico/2-modulo-practico-2',
    icon: <Target className="w-6 h-6" />,
    description: 'Estrategias de entrada y salida en mercados.',
    level: 'nivel1',
    type: 'content',
    moduleNumber: 2
  },
  {
    id: 'PC1',
    title: 'Punto de Control 1',
    path: '/dashboard/iniciado/puntos-de-control/practico/pc1',
    icon: <CheckCircle className="w-6 h-6" />,
    description: 'Evaluación: Módulos Prácticos 1 y 2.',
    level: 'nivel1',
    type: 'checkpoint',
    moduleNumber: 1
  },
  {
    id: 'P3',
    title: 'Módulo Práctico 3',
    path: '/dashboard/iniciado/Practico/3-modulo-practico-3',
    icon: <Shield className="w-6 h-6" />,
    description: 'Gestión de riesgo y psicología del trading.',
    level: 'nivel1',
    type: 'content',
    moduleNumber: 3
  },
  {
    id: 'P4',
    title: 'Módulo Práctico 4',
    path: '/dashboard/iniciado/Practico/4-modulo-practico-4',
    icon: <Users className="w-6 h-6" />,
    description: 'Análisis fundamental y noticias del mercado.',
    level: 'nivel1',
    type: 'content',
    moduleNumber: 4
  },
  {
    id: 'PC2',
    title: 'Punto de Control 2',
    path: '/dashboard/iniciado/puntos-de-control/practico/pc2',
    icon: <CheckCircle className="w-6 h-6" />,
    description: 'Evaluación: Módulos Prácticos 3 y 4.',
    level: 'nivel1',
    type: 'checkpoint',
    moduleNumber: 2
  },
  {
    id: 'P5',
    title: 'Módulo Práctico 5',
    path: '/dashboard/iniciado/Practico/5-modulo-practico-5',
    icon: <Building2 className="w-6 h-6" />,
    description: 'Plataformas de trading y herramientas avanzadas.',
    level: 'nivel1',
    type: 'content',
    moduleNumber: 5
  },
  {
    id: 'PC3',
    title: 'Punto de Control 3',
    path: '/dashboard/iniciado/puntos-de-control/practico/pc3',
    icon: <CheckCircle className="w-6 h-6" />,
    description: 'Evaluación: Módulo Práctico 5.',
    level: 'nivel1',
    type: 'checkpoint',
    moduleNumber: 3
  },
  // Nivel 2 - Requieren PC1 completado
  {
    id: 'P6',
    title: 'Módulo Práctico 6',
    path: '/dashboard/iniciado/Practico/6-modulo-practico-6',
    icon: <Network className="w-6 h-6" />,
    description: 'Trading algorítmico y automatización.',
    level: 'nivel2',
    type: 'content',
    moduleNumber: 6,
    requiredCheckpoint: 'PC1'
  },
  {
    id: 'P7',
    title: 'Módulo Práctico 7',
    path: '/dashboard/iniciado/Practico/7-modulo-practico-7',
    icon: <BarChart3 className="w-6 h-6" />,
    description: 'Análisis técnico avanzado y patrones complejos.',
    level: 'nivel2',
    type: 'content',
    moduleNumber: 7,
    requiredCheckpoint: 'PC1'
  },
  {
    id: 'PC4',
    title: 'Punto de Control 4',
    path: '/dashboard/iniciado/puntos-de-control/practico/pc4',
    icon: <CheckCircle className="w-6 h-6" />,
    description: 'Evaluación: Módulos Prácticos 6 y 7.',
    level: 'nivel2',
    type: 'checkpoint',
    moduleNumber: 4,
    requiredCheckpoint: 'PC2'
  },
  {
    id: 'P8',
    title: 'Módulo Práctico 8',
    path: '/dashboard/iniciado/Practico/8-modulo-practico-8',
    icon: <Crown className="w-6 h-6" />,
    description: 'Estrategias de trading profesional.',
    level: 'nivel2',
    requiredCheckpoint: 'PC3'
  },
  {
    id: 'P9',
    title: 'Módulo Práctico 9',
    path: '/dashboard/iniciado/Practico/9-modulo-practico-9',
    icon: <Zap className="w-6 h-6" />,
    description: 'Técnicas avanzadas de gestión de portafolio.',
    level: 'nivel2',
    requiredCheckpoint: 'PC3'
  },
  {
    id: 'P10',
    title: 'Módulo Práctico 10',
    path: '/dashboard/iniciado/Practico/10-modulo-practico-10',
    icon: <Zap className="w-6 h-6" />,
    description: 'Trading institucional y mercados globales.',
    level: 'nivel2',
    requiredCheckpoint: 'PC3'
  },
  {
    id: 'PC5',
    title: 'Punto de Control 5',
    path: '/dashboard/iniciado/puntos-de-control/practico/pc5',
    icon: <CheckCircle className="w-6 h-6" />,
    description: 'Evaluación final: Módulos Prácticos 8, 9 y 10.',
    level: 'nivel2',
    requiredCheckpoint: 'PC4'
  }
];

export default function CursosPage() {
  const [activeTab, setActiveTab] = useState<'theoretical' | 'practical'>('theoretical');
  const { isExpanded } = useSidebar();
  const { isCheckpointCompleted } = useProgress();

  // Función para verificar si un módulo está bloqueado
  const isModuleLocked = (module: Module): boolean => {
    // Los módulos de nivel 1 nunca están bloqueados
    if (module.level === 'nivel1') return false;
    
    // Si no tiene checkpoint requerido, no está bloqueado
    if (!module.requiredCheckpoint) return false;
    
    // Verificar si el checkpoint requerido está completado
    const isRequiredCheckpointCompleted = isCheckpointCompleted(activeTab, 'nivel1', module.requiredCheckpoint);
    
    // Si el módulo es un checkpoint del nivel 2, verificar el checkpoint anterior del nivel 1
    if (module.id.startsWith('PC') && module.level === 'nivel2') {
      const previousCheckpoint = module.id === 'PC3' ? 'PC2' : module.id === 'PC4' ? 'PC3' : 'PC2';
      return !isCheckpointCompleted(activeTab, 'nivel1', previousCheckpoint);
    }
    
    return !isRequiredCheckpointCompleted;
  };

  // Función para obtener el mensaje de bloqueo
  const getLockMessage = (module: Module): string => {
    if (!module.requiredCheckpoint) return '';
    
    const requiredCheckpoint = [...theoreticalModules, ...practicalModules]
      .find(m => m.id === module.requiredCheckpoint);
    
    if (requiredCheckpoint) {
      return `Completa "${requiredCheckpoint.title}" para desbloquear`;
    }
    
    return 'Completa el punto de control anterior para desbloquear';
  };

  const renderModuleCard = (module: Module) => {
    const isControlPoint = module.id.startsWith('PC');
    const isLocked = isModuleLocked(module);
    const isCompleted = module.isCompleted || (isControlPoint ? isCheckpointCompleted(activeTab, module.level, module.id) : false);
    const lockMessage = getLockMessage(module);

    return (
      <ModuleCard
        key={module.id}
        module={module}
        isControlPoint={isControlPoint}
        isLocked={isLocked}
        isCompleted={isCompleted}
        lockMessage={lockMessage}
      />
    );
  };

  const currentModules: Module[] = activeTab === 'theoretical' ? theoreticalModules : practicalModules;
  const nivel1Modules: Module[] = currentModules.filter(m => m.level === 'nivel1');
  const nivel2Modules: Module[] = currentModules.filter(m => m.level === 'nivel2');

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]">
      {/* Estilos CSS personalizados */}
      <style jsx>{lineClampStyles}</style>
      
      {/* Sidebar - SOLO en desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content - MUCHO MÁS CERCA DE LA SIDEBAR */}
      <div 
        className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
          isExpanded ? 'md:ml-20' : 'md:ml-16'
        }`}
      >
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <Link 
              href="/dashboard/iniciado" 
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-3 group"
            >
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:translate-x-[-2px] transition-transform" />
              Volver al Dashboard
            </Link>
            
            <h1 className="text-3xl font-light text-white tracking-wider mb-3">
              Explora la Academia
            </h1>
            
            <p className="text-gray-400 max-w-4xl leading-relaxed text-base">
              Explora todo el contenido disponible en nuestro programa integral de formación en trading y economía. 
              Navega por los módulos teóricos para construir una base sólida de conocimientos, o sumérgete en el contenido 
              práctico para desarrollar habilidades operativas reales. Cada módulo está diseñado para tu progreso continuo.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setActiveTab('theoretical')}
              className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center ${
                activeTab === 'theoretical'
                  ? 'bg-[#ec4d58] text-white shadow-lg shadow-[#ec4d58]/25'
                  : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
              }`}
            >
              <BookOpen className="mr-2 w-4 h-4" />
              <span className="font-medium text-sm">Contenido Teórico</span>
            </button>
            <button
              onClick={() => setActiveTab('practical')}
              className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center ${
                activeTab === 'practical'
                  ? 'bg-[#ec4d58] text-white shadow-lg shadow-[#ec4d58]/25'
                  : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
              }`}
            >
              <TrendingUp className="mr-2 w-4 h-4" />
              <span className="font-medium text-sm">Contenido Práctico</span>
            </button>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Nivel 1 Section - Carrusel Optimizado */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-xs font-bold mr-2">1</span>
                Nivel 1 - Fundamentos
              </h2>
              <EnhancedModuloCarousel 
                modules={nivel1Modules}
                title=""
                className="mb-0"
              />
            </div>

            {/* Nivel 2 Section - Carrusel Optimizado */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="w-6 h-6 bg-[#FFD447] text-black rounded-full flex items-center justify-center text-xs font-bold mr-2">2</span>
                Nivel 2 - Avanzado
              </h2>
              <EnhancedModuloCarousel 
                modules={nivel2Modules}
                title=""
                className="mb-0"
              />
            </div>
          </div>

          {/* Content Summary */}
          <div className="mt-8 p-6 bg-[#1a1a1a] border border-[#232323] rounded-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">
              Resumen del {activeTab === 'theoretical' ? 'Contenido Teórico' : 'Contenido Práctico'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-[#2a2a2a] rounded-xl">
                <div className="text-xl font-bold text-yellow-400 mb-1">
                  {nivel1Modules.length}
                </div>
                <span className="text-gray-300 font-medium text-xs">Módulos Nivel 1</span>
              </div>
              <div className="text-center p-3 bg-[#2a2a2a] rounded-xl">
                <div className="text-xl font-bold text-purple-400 mb-1">
                  {nivel2Modules.length}
                </div>
                <span className="text-gray-300 font-medium text-xs">Módulos Nivel 2</span>
              </div>
              <div className="text-center p-3 bg-[#2a2a2a] rounded-xl">
                <div className="text-xl font-bold text-[#FFD447] mb-1">
                  {currentModules.filter(m => m.id.startsWith('PC')).length}
                </div>
                <span className="text-gray-300 font-medium text-xs">Puntos de Control</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 