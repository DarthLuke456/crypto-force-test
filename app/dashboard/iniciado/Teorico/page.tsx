'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, TrendingUp, Cog, Target, Crown, Network, DollarSign, Wrench, CheckCircle } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  path: string;
  icon: React.JSX.Element;
  description: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  level: 'nivel1' | 'nivel2';
}

// Módulos Teóricos Nivel 1
const theoreticalModulesNivel1: Module[] = [
  {
    id: '1',
    title: 'Introducción a la Lógica Económica',
    path: '/dashboard/iniciado/Teorico/1-introduccion-logica-economica',
    icon: <BookOpen />,
    description: 'Fundamentos de la economía y su aplicación en los mercados',
    isLocked: false,
    level: 'nivel1'
  },
  {
    id: '2',
    title: 'Fuerzas del Mercado',
    path: '/dashboard/iniciado/Teorico/2-fuerzas-del-mercado',
    icon: <TrendingUp />,
    description: 'Oferta, demanda y las fuerzas que mueven los mercados',
    isLocked: false,
    level: 'nivel1'
  },
  {
    id: 'PC1',
    title: 'Evaluación: Introducción a la Lógica Económica y Fuerzas del Mercado',
    path: '/dashboard/iniciado/puntos-de-control/teorico/pc1',
    icon: <CheckCircle />,
    description: 'Punto de control: Evalúa los módulos "Introducción a la Lógica Económica" y "Fuerzas del Mercado"',
    isLocked: false,
    level: 'nivel1'
  },
  {
    id: '3',
    title: 'Acción del Gobierno en los Mercados',
    path: '/dashboard/iniciado/Teorico/3-accion-gobierno-mercados',
    icon: <Cog />,
    description: 'Cómo las políticas gubernamentales afectan los mercados',
    isLocked: false,
    level: 'nivel1'
  },
  {
    id: '4',
    title: 'Competencia Perfecta',
    path: '/dashboard/iniciado/Teorico/4-competencia-perfecta',
    icon: <Target />,
    description: 'Análisis de mercados en competencia perfecta',
    isLocked: false,
    level: 'nivel1'
  },
  {
    id: 'PC2',
    title: 'Evaluación: Acción del Gobierno en los Mercados y Competencia Perfecta',
    path: '/dashboard/iniciado/puntos-de-control/teorico/pc2',
    icon: <CheckCircle />,
    description: 'Punto de control: Evalúa los módulos "Acción del Gobierno en los Mercados" y "Competencia Perfecta"',
    isLocked: false,
    level: 'nivel1'
  }
];

// Módulos Teóricos Nivel 2
const theoreticalModulesNivel2: Module[] = [
  {
    id: '5',
    title: 'Monopolio y Oligopolio',
    path: '/dashboard/iniciado/Teorico/5-monopolio-oligopolio',
    icon: <Crown />,
    description: 'Análisis de mercados con poder de mercado concentrado',
    isLocked: true,
    level: 'nivel2'
  },
  {
    id: '6',
    title: 'Tecnología Blockchain',
    path: '/dashboard/iniciado/Teorico/6-tecnologia-blockchain',
    icon: <Network />,
    description: 'Fundamentos de la tecnología blockchain y criptomonedas',
    isLocked: true,
    level: 'nivel2'
  },
  {
    id: 'PC3',
    title: 'Evaluación: Monopolio y Oligopolio y Tecnología Blockchain',
    path: '/dashboard/iniciado/puntos-de-control/teorico/pc3',
    icon: <CheckCircle />,
    description: 'Punto de control: Evalúa los módulos "Monopolio y Oligopolio" y "Tecnología Blockchain"',
    isLocked: true,
    level: 'nivel2'
  },
  {
    id: '7',
    title: 'Criptomonedas',
    path: '/dashboard/iniciado/Teorico/7-criptomonedas',
    icon: <DollarSign />,
    description: 'Análisis fundamental de criptomonedas y tokens',
    isLocked: true,
    level: 'nivel2'
  },
  {
    id: '8',
    title: 'Operaciones con Criptomonedas',
    path: '/dashboard/iniciado/Teorico/8-operaciones-criptomonedas',
    icon: <Wrench />,
    description: 'Técnicas avanzadas de trading en criptomonedas',
    isLocked: true,
    level: 'nivel2'
  },
  {
    id: 'PC4',
    title: 'Evaluación: Criptomonedas y Operaciones con Criptomonedas',
    path: '/dashboard/iniciado/puntos-de-control/teorico/pc4',
    icon: <CheckCircle />,
    description: 'Punto de control: Evalúa los módulos "Criptomonedas" y "Operaciones con Criptomonedas"',
    isLocked: true,
    level: 'nivel2'
  }
];

export default function TeoricoIndex() {
  // Función para obtener progreso del módulo
  const getModuleProgress = (moduleId: string) => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`module_${moduleId}_progress`);
      return saved ? JSON.parse(saved) : { isCompleted: false, progress: 0 };
    }
    return { isCompleted: false, progress: 0 };
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white px-2 sm:px-8 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard/iniciado" 
          className="inline-flex items-center text-gray-400 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Dashboard
        </Link>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-[#ec4d58] mb-2">
          Módulos Teóricos
        </h1>
        <p className="text-gray-400">
          Fundamentos económicos y análisis de mercados
        </p>
      </div>

      {/* Nivel 1 */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-black font-bold text-sm">1</span>
          </div>
          <h2 className="text-2xl font-bold text-yellow-500">Nivel 1 - Fundamentos</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {theoreticalModulesNivel1.map((module) => {
            const progress = getModuleProgress(module.id);
            const isCompleted = progress.isCompleted || progress.progress >= 100;
            const isControlPoint = module.id.startsWith('PC');
            
            return (
              <div 
                key={module.id}
                className="bg-[#1a1a1a] border border-[#232323] rounded-xl p-6 hover:bg-[#2a2a2a] hover:border-[#ec4d58]/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isCompleted ? 'bg-green-500 text-white' : 
                    module.isLocked ? 'bg-[#2a2a2a] text-gray-400' : 
                    'bg-[#ec4d58] text-white'
                  }`}>
                    {module.icon}
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    isCompleted ? 'bg-green-500 text-white' : 
                    module.isLocked ? 'bg-[#2a2a2a] text-gray-300' : 
                    'bg-[#ec4d58] text-white'
                  }`}>
                    {module.id}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold mb-2 line-clamp-2">{module.title}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-3">{module.description}</p>
                
                <Link
                  href={module.path}
                  className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors w-full justify-center ${
                    module.isLocked ? 'bg-[#2a2a2a] text-gray-400 cursor-not-allowed' : 
                    isCompleted ? 'bg-green-500 hover:bg-green-600 text-white' : 
                    'bg-[#ec4d58] hover:bg-[#d63d47] text-white'
                  }`}
                >
                  {module.isLocked ? (
                    <>
                      <span className="mr-2">🔒</span>
                      Bloqueado
                    </>
                  ) : isCompleted ? (
                    <>
                      <CheckCircle className="mr-2" />
                      Completado
                    </>
                  ) : isControlPoint ? (
                    <>
                      <CheckCircle className="mr-2" />
                      Tomar Evaluación
                    </>
                  ) : (
                    <>
                      <BookOpen className="mr-2" />
                      Comenzar
                    </>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nivel 2 */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">2</span>
          </div>
          <h2 className="text-2xl font-bold text-purple-500">Nivel 2 - Avanzado</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {theoreticalModulesNivel2.map((module) => {
            const progress = getModuleProgress(module.id);
            const isCompleted = progress.isCompleted || progress.progress >= 100;
            const isControlPoint = module.id.startsWith('PC');
            
            return (
              <div 
                key={module.id}
                className="bg-[#1a1a1a] border border-[#232323] rounded-xl p-6 hover:bg-[#2a2a2a] hover:border-[#ec4d58]/30 transition-all duration-300 opacity-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#2a2a2a] text-gray-400">
                    {module.icon}
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#2a2a2a] text-gray-300">
                    {module.id}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold mb-2 line-clamp-2">{module.title}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-3">{module.description}</p>
                
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-4">
                  <div className="flex items-center justify-center gap-2 text-yellow-400">
                    <span className="text-sm">🔒</span>
                    <span className="text-xs">Completa 50% del Nivel 1</span>
                  </div>
                </div>
                
                <div className="bg-[#2a2a2a] text-gray-400 px-4 py-2 rounded-lg text-center cursor-not-allowed">
                  <span className="mr-2">🔒</span>
                  Bloqueado
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-6">
        <h3 className="text-xl font-bold text-[#ec4d58] mb-4">Información sobre los Módulos Teóricos</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-yellow-500 mb-2">Nivel 1 - Fundamentos</h4>
            <p className="text-sm text-gray-400 mb-3">
              Los módulos del Nivel 1 te introducen a los conceptos fundamentales de la economía y su aplicación en los mercados financieros.
            </p>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Conceptos básicos de economía</li>
              <li>• Oferta y demanda</li>
              <li>• Intervención gubernamental</li>
              <li>• Competencia perfecta</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-500 mb-2">Nivel 2 - Avanzado</h4>
            <p className="text-sm text-gray-400 mb-3">
              Los módulos del Nivel 2 profundizan en conceptos avanzados y se enfocan en las criptomonedas y blockchain.
            </p>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Monopolios y oligopolios</li>
              <li>• Tecnología blockchain</li>
              <li>• Análisis de criptomonedas</li>
              <li>• Operaciones avanzadas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 