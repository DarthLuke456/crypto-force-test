'use client';

import { useState, useEffect, useRef } from 'react';
import { useSafeAuth } from '@/context/AuthContext';
import { BookOpen, Play, Eye, Zap, Flame, Crown, Users, Target, Brain, Shield } from 'lucide-react';
import Image from 'next/image';
import EnhancedCarousel from '@/app/dashboard/iniciado/components/EnhancedCarousel';
import DynamicTribunalCarousel from './components/DynamicTribunalCarousel';
import { useTribunalModules } from './hooks/useTribunalModules';

// Tipos para el carrusel
interface CarouselSlide {
  type: 'image' | 'title' | 'subtitle' | 'description' | 'quote' | 'philosophy';
  content: string;
  duration: number;
}

// Módulos teóricos para Acólito
const theoreticalModules = [
  {
    id: '1',
    title: 'Análisis Técnico Avanzado',
    description: 'Domina las técnicas avanzadas de análisis técnico y patrones complejos.',
    icon: <Brain className="w-8 h-8 text-[#FFD447]" />,
    isCompleted: false,
    level: 'nivel2',
    type: 'theoretical',
    moduleNumber: 1
  },
  {
    id: '2',
    title: 'Teoría de Ondas de Elliott',
    description: 'Aprende los principios de las ondas de Elliott y su aplicación práctica.',
    icon: <Target className="w-8 h-8 text-[#FFD447]" />,
    isCompleted: false,
    level: 'nivel2',
    type: 'theoretical',
    moduleNumber: 2
  },
  {
    id: '3',
    title: 'Análisis de Volumen',
    description: 'Interpreta el volumen y confirma tendencias con precisión.',
    icon: <Eye className="w-8 h-8 text-[#FFD447]" />,
    isCompleted: false,
    level: 'nivel2',
    type: 'theoretical',
    moduleNumber: 3
  }
];

// Módulos prácticos para Acólito
const practicalModules = [
  {
    id: '4',
    title: 'Simulador de Trading Avanzado',
    description: 'Practica con herramientas avanzadas de trading en un entorno seguro.',
    icon: <Play className="w-8 h-8 text-[#FFD447]" />,
    isCompleted: false,
    level: 'nivel2',
    type: 'practical',
    moduleNumber: 1
  },
  {
    id: '5',
    title: 'Análisis de Mercado en Tiempo Real',
    description: 'Desarrolla habilidades de análisis en tiempo real del mercado.',
    icon: <Zap className="w-8 h-8 text-[#FFD447]" />,
    isCompleted: false,
    level: 'nivel2',
    type: 'practical',
    moduleNumber: 2
  },
  {
    id: '6',
    title: 'Checkpoint: Evaluación Acólito',
    description: 'Demuestra tu dominio de las técnicas avanzadas del acólito.',
    icon: <Crown className="w-8 h-8 text-[#FFD447]" />,
    isCompleted: false,
    level: 'nivel2',
    type: 'checkpoint',
    moduleNumber: 1
  }
];

// Contenido del carrusel para Acólito
const carouselContent = [
  {
    id: 1,
    title: 'Bienvenido al Nivel del Acólito',
    description: 'Has despertado de la sombra interior. Ahora comienza tu verdadero viaje hacia el poder.',
    icon: <Eye className="w-12 h-12 text-[#FFD447]" />,
    color: 'from-[#FFD447]/20 to-[#FFD447]/30',
    borderColor: 'border border-[#232323] hover:border-[#FFD447] hover:border-t-2 hover:border-t-[#FFD447]'
  },
  {
    id: 2,
    title: 'Iluminación de Verdades Ocultas',
    description: 'Descubre las técnicas avanzadas que solo los acólitos pueden dominar.',
    icon: <Zap className="w-12 h-12 text-[#FFD447]" />,
    color: 'from-[#FFD447]/20 to-[#FFD447]/30',
    borderColor: 'border border-[#232323] hover:border-[#FFD447] hover:border-t-2 hover:border-t-[#FFD447]'
  },
  {
    id: 3,
    title: 'Curiosidad por el Poder',
    description: 'Tu sed de conocimiento te llevará a niveles que nunca imaginaste alcanzar.',
    icon: <Flame className="w-12 h-12 text-[#FFD447]" />,
    color: 'from-[#FFD447]/20 to-[#FFD447]/30',
    borderColor: 'border border-[#232323] hover:border-[#FFD447] hover:border-t-2 hover:border-t-[#FFD447]'
  }
];

export default function AcolitoDashboard() {
  const { userData } = useSafeAuth();
  const [activeTab, setActiveTab] = useState('theoretical');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Hook para obtener módulos del Tribunal Imperial
  const { theoreticalModules: tribunalTheoretical, practicalModules: tribunalPractical, isLoading, error } = useTribunalModules();

  // Obtener módulos locales según el tab activo
  const getLocalModules = () => {
    if (activeTab === 'theoretical') {
      return theoreticalModules;
    } else {
      return practicalModules;
    }
  };

  // Contenido del carrusel principal
  const mainCarouselContent: CarouselSlide[] = [
    {
      type: 'image' as const,
      content: '/images/insignias/2-acolitos.png',
      duration: 2500
    },
    {
      type: 'title' as const,
      content: 'ACÓLITO',
      duration: 2500
    },
    {
      type: 'subtitle' as const,
      content: 'El despertar forja al acólito. La curiosidad lo ilumina.',
      duration: 2500
    },
    {
      type: 'description' as const,
      content: 'Este es tu espacio de iluminación. Aquí desarrollarás la curiosidad insaciable, las técnicas avanzadas, el análisis profundo y la sed de conocimiento que caracterizan a un verdadero Acólito. Cada módulo es un paso hacia la maestría del trading avanzado.',
      duration: 11000
    },
    {
      type: 'quote' as const,
      content: 'Un Acólito no teme la complejidad, la abraza, la estudia y la domina con curiosidad.',
      duration: 3000
    },
    {
      type: 'philosophy' as const,
      content: 'Acólito no es solo un título, es una transformación. Es la capacidad de ver más allá de lo obvio, de cuestionar lo establecido, de buscar la verdad en cada patrón y de convertir cada descubrimiento en una ventaja. Aquí no buscamos solo conocimiento, buscamos iluminación.',
      duration: 13000
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] text-white scrollbar-acolito">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-in-out;
        }
        
        .animate-slide-in-up {
          animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .modules-grid > div {
          animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          animation-fill-mode: both;
        }
        
        .modules-grid > div:nth-child(1) { animation-delay: 0.1s; }
        .modules-grid > div:nth-child(2) { animation-delay: 0.2s; }
        .modules-grid > div:nth-child(3) { animation-delay: 0.3s; }
        .modules-grid > div:nth-child(4) { animation-delay: 0.4s; }
        .modules-grid > div:nth-child(5) { animation-delay: 0.5s; }
        .modules-grid > div:nth-child(6) { animation-delay: 0.6s; }
        
        /* Ensure hover effects are not clipped */
        .hover\:scale-105:hover {
          z-index: 10;
          position: relative;
        }
        
        /* Ensure borders are visible on hover */
        .group:hover {
          z-index: 5;
          position: relative;
        }
        
        /* Ensure module cards have proper spacing for hover effects */
        .grid > div {
          position: relative;
        }
      `}</style>
      
      <div className="container mx-auto px-2 sm:px-4 py-4 md:py-8 pb-24 md:pb-8 transition-all duration-300">
        {/* Mensaje de Bienvenida */}
        <div className="w-full max-w-4xl mx-auto mb-6 md:mb-8 text-center px-4 md:px-0">
          <h2 className="text-xl md:text-2xl font-light text-gray-300 tracking-wide">
            Bienvenido al Nivel del Acólito{userData?.nickname ? (
              <>
                <span className="text-[#fafafa]">, </span>
                <span className="text-[#FFD447] font-medium">{userData.nickname}</span>
              </>
            ) : ''}
          </h2>
        </div>

        {/* Carousel Component */}
        <EnhancedCarousel content={mainCarouselContent} titleColor="#FFD447" dotsColor="#FFD447" />

        {/* Video introductorio */}
        <div className="w-full flex justify-center mb-8 px-2 md:px-0">
          <div className="w-full max-w-4xl">
            <video className="rounded-xl shadow-lg w-full h-64 md:h-80 object-cover" controls>
              <source src="/videos/acolito-intro.mp4" type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
        </div>

        {/* Navegación por Pestañas */}
        <div className="flex justify-center mb-8 px-2 md:px-0">
          <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-1 md:p-2 w-full max-w-md hover:border-[#FFD447] hover:border-t-2 hover:border-t-[#FFD447] hover:shadow-lg hover:shadow-[#FFD447]/20 transition-all duration-300">
            <button
              onClick={() => handleTabChange('theoretical')}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 text-sm md:text-base w-1/2 ${
                activeTab === 'theoretical'
                  ? 'bg-[#FFD447] text-gray-900 shadow-lg'
                  : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
              }`}
            >
              <BookOpen className="inline mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Teórico</span>
              <span className="sm:hidden">Teórico</span>
            </button>
            <button
              onClick={() => handleTabChange('practical')}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 text-sm md:text-base w-1/2 ${
                activeTab === 'practical'
                  ? 'bg-[#FFD447] text-gray-900 shadow-lg'
                  : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
              }`}
            >
              <Play className="inline mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Práctico</span>
              <span className="sm:hidden">Práctico</span>
            </button>
          </div>
        </div>

        {/* Módulos del Tribunal Imperial - Sistema Dinámico */}
        <div className="w-full max-w-6xl mx-auto mb-8 px-2 md:px-0">
          <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-6 hover:border-[#FFD447] hover:border-t-2 hover:border-t-[#FFD447] hover:shadow-lg hover:shadow-[#FFD447]/20 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <Crown className="w-8 h-8 text-[#FFD447]" />
              <h3 className="text-2xl font-bold text-[#FFD447]">Tribunal Imperial</h3>
            </div>
            <p className="text-gray-300 mb-6">
              El Tribunal Imperial ha preparado módulos especiales para tu nivel de Acólito. Estos contenidos se actualizan dinámicamente y se integran perfectamente con tu progreso.
            </p>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD447] mx-auto"></div>
                <p className="text-gray-400 mt-4">Cargando módulos del Tribunal Imperial...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-400">Error al cargar los módulos del Tribunal Imperial</p>
              </div>
            ) : (
              <div className="space-y-6">
                <DynamicTribunalCarousel 
                  modules={tribunalTheoretical}
                  title="Módulos Teóricos del Tribunal"
                  category="theoretical"
                />
                <DynamicTribunalCarousel 
                  modules={tribunalPractical}
                  title="Módulos Prácticos del Tribunal"
                  category="practical"
                />
              </div>
            )}
          </div>
        </div>

        {/* Grid de Módulos Locales */}
        <div className="w-full max-w-6xl mx-auto mb-8 px-2 md:px-0">
          <h3 className="text-2xl font-bold text-center mb-6 text-[#FFD447]">
            Módulos del Nivel Acólito
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 modules-grid">
            {getLocalModules().map((module, index) => (
              <div
                key={module.id}
                className="bg-[#1a1a1a] border border-[#232323] rounded-xl p-6 hover:border-[#FFD447] hover:border-t-2 hover:border-t-[#FFD447] hover:shadow-lg hover:shadow-[#FFD447]/20 transition-all duration-300 group cursor-pointer transform hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#FFD447]/20 rounded-lg group-hover:bg-[#FFD447]/30 transition-colors duration-300">
                    {module.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white group-hover:text-[#FFD447] transition-colors duration-300">
                      {module.title}
                    </h4>
                    <span className="text-xs text-[#FFD447] font-medium">
                      {module.type === 'theoretical' ? 'Teórico' : 
                       module.type === 'practical' ? 'Práctico' : 'Checkpoint'}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {module.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Módulo {module.moduleNumber}
                  </span>
                  {module.isCompleted ? (
                    <span className="text-xs text-green-400 font-medium">✓ Completado</span>
                  ) : (
                    <span className="text-xs text-[#FFD447] font-medium">→ Comenzar</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Información Adicional */}
        <div className="w-full max-w-6xl mx-auto mb-8 px-2 md:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="bg-[#1a1a1a] border border-[#232323] rounded-xl p-6 hover:border-[#FFD447] hover:border-t-2 hover:border-t-[#FFD447] hover:shadow-lg hover:shadow-[#FFD447]/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-[#FFD447]" />
                <h4 className="text-lg font-semibold text-white">Próximos Pasos</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Continúa tu aprendizaje con los módulos disponibles. Cada módulo te acerca más a convertirte en un trader profesional.
              </p>
            </div>
            
            <div className="bg-[#1a1a1a] border border-[#232323] rounded-xl p-6 hover:border-[#FFD447] hover:border-t-2 hover:border-t-[#FFD447] hover:shadow-lg hover:shadow-[#FFD447]/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-[#FFD447]" />
                <div className="text-lg font-semibold text-white">▲ Puntos de Control</div>
              </div>
              <p className="text-gray-300 text-sm">
                Cada 2 módulos encontrarás un punto de control para evaluar tu progreso y consolidar tu aprendizaje.
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas del Acólito */}
        <div className="w-full max-w-6xl mx-auto px-2 md:px-0">
          <h3 className="text-2xl font-bold text-center mb-6 text-[#FFD447]">
            Tu Progreso como Acólito
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            <div className="bg-[#1a1a1a] border border-[#232323] rounded-xl p-6 text-center hover:border-[#FFD447] hover:border-t-2 hover:border-t-[#FFD447] hover:shadow-lg hover:shadow-[#FFD447]/20 transition-all duration-300">
              <div className="w-16 h-16 bg-[#FFD447]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-[#FFD447]" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Módulos Teóricos</h4>
              <p className="text-2xl font-bold text-[#FFD447]">3</p>
              <p className="text-gray-400 text-sm">Disponibles para el acólito</p>
            </div>
            
            <div className="bg-[#1a1a1a] border border-[#232323] rounded-xl p-6 text-center hover:border-[#FFD447] hover:border-t-2 hover:border-t-[#FFD447] hover:shadow-lg hover:shadow-[#FFD447]/20 transition-all duration-300">
              <div className="w-16 h-16 bg-[#FFD447]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-[#FFD447]" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Módulos Prácticos</h4>
              <p className="text-2xl font-bold text-[#FFD447]">3</p>
              <p className="text-gray-400 text-sm">Para dominar las técnicas</p>
            </div>
            
            <div className="bg-[#1a1a1a] border border-[#232323] rounded-xl p-6 text-center hover:border-[#FFD447] hover:border-t-2 hover:border-t-[#FFD447] hover:shadow-lg hover:shadow-[#FFD447]/20 transition-all duration-300">
              <div className="w-16 h-16 bg-[#FFD447]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-[#FFD447]" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Puntos de Control</h4>
              <p className="text-2xl font-bold text-[#FFD447]">1</p>
              <p className="text-gray-400 text-sm">Para evaluar tu progreso</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}