'use client';

import { useState, useEffect, useRef } from 'react';
import { useSafeAuth } from '@/context/AuthContext';
import { BookOpen, Play, Eye, Zap, Flame, Shield, Sword, Target, Crown } from 'lucide-react';
import Image from 'next/image';
import EnhancedCarousel from '@/app/dashboard/iniciado/components/EnhancedCarousel';

// Tipos para el carrusel
interface CarouselSlide {
  type: 'image' | 'title' | 'subtitle' | 'description' | 'quote' | 'philosophy';
  content: string;
  duration: number;
}

// Módulos teóricos para Warrior
const theoreticalModules = [
  {
    id: '1',
    title: 'Fundamentos del Trading Disciplinado',
    description: 'Aprende los principios fundamentales que todo Warrior debe dominar.',
    icon: <Shield className="w-8 h-8 text-[#3ED598]" />,
    isCompleted: false,
    level: 'nivel3',
    type: 'theoretical',
    moduleNumber: 1
  },
  {
    id: '2',
    title: 'Análisis Técnico Avanzado',
    description: 'Domina las herramientas técnicas que separan a los Warriors de los principiantes.',
    icon: <Target className="w-8 h-8 text-[#3ED598]" />,
    isCompleted: false,
    level: 'nivel3',
    type: 'theoretical',
    moduleNumber: 2
  },
  {
    id: '3',
    title: 'Gestión de Riesgo Estratégica',
    description: 'La disciplina en el riesgo es lo que define a un verdadero Warrior.',
    icon: <Sword className="w-8 h-8 text-[#3ED598]" />,
    isCompleted: false,
    level: 'nivel3',
    type: 'theoretical',
    moduleNumber: 3
  }
];

// Módulos prácticos para Warrior
const practicalModules = [
  {
    id: '4',
    title: 'Simulador de Trading Avanzado',
    description: 'Practica tus estrategias en un entorno controlado y realista.',
    icon: <Play className="w-8 h-8 text-[#3ED598]" />,
    isCompleted: false,
    level: 'nivel3',
    type: 'practical',
    moduleNumber: 1
  },
  {
    id: '5',
    title: 'Análisis de Mercado en Tiempo Real',
    description: 'Desarrolla tu instinto para leer las señales del mercado.',
    icon: <Eye className="w-8 h-8 text-[#3ED598]" />,
    isCompleted: false,
    level: 'nivel3',
    type: 'practical',
    moduleNumber: 2
  },
  {
    id: '6',
    title: 'Checkpoint: Evaluación Warrior',
    description: 'Demuestra tu dominio de las técnicas avanzadas de trading.',
    icon: <Crown className="w-8 h-8 text-[#3ED598]" />,
    isCompleted: false,
    level: 'nivel3',
    type: 'checkpoint',
    moduleNumber: 1
  }
];

// Contenido del carrusel para Warrior
const carouselContent = [
  {
    id: 1,
    title: 'Bienvenido al Nivel del Warrior',
    description: 'Has demostrado disciplina y estructura. Ahora comienza tu verdadero entrenamiento en el arte del trading.',
    icon: <Shield className="w-12 h-12 text-[#3ED598]" />,
    color: 'from-[#3ED598]/20 to-[#3ED598]/30',
    borderColor: 'border border-[#232323] hover:border-[#3ED598] hover:border-t-2 hover:border-t-[#3ED598]'
  },
  {
    id: 2,
    title: 'Dominio de la Disciplina',
    description: 'Un Warrior no actúa por impulso, sino por estrategia y análisis profundo.',
    icon: <Sword className="w-12 h-12 text-[#3ED598]" />,
    color: 'from-[#3ED598]/20 to-[#3ED598]/30',
    borderColor: 'border border-[#232323] hover:border-[#3ED598] hover:border-t-2 hover:border-t-[#3ED598]'
  },
  {
    id: 3,
    title: 'Precisión en la Acción',
    description: 'Cada movimiento debe ser calculado, cada decisión debe ser estratégica.',
    icon: <Target className="w-12 h-12 text-[#3ED598]" />,
    color: 'from-[#3ED598]/20 to-[#3ED598]/30',
    borderColor: 'border border-[#232323] hover:border-[#3ED598] hover:border-t-2 hover:border-t-[#3ED598]'
  }
];

export default function WarriorDashboard() {
  const { userData } = useSafeAuth();
  const [activeTab, setActiveTab] = useState('theoretical');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Obtener todos los módulos según el tab activo
  const getAllModules = () => {
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
      content: '/images/insignias/3-warriors.png',
      duration: 2500
    },
    {
      type: 'title' as const,
      content: 'WARRIOR',
      duration: 2500
    },
    {
      type: 'subtitle' as const,
      content: 'La disciplina forja al guerrero. La estrategia lo perfecciona.',
      duration: 2500
    },
    {
      type: 'description' as const,
      content: 'Este es tu campo de batalla digital. Aquí desarrollarás la disciplina mental, las estrategias avanzadas, el análisis técnico profundo y la gestión de riesgo que caracterizan a un verdadero Warrior. Cada módulo es un paso hacia la maestría del trading disciplinado.',
      duration: 11000
    },
    {
      type: 'quote' as const,
      content: 'Un Warrior no teme la batalla, la estudia, la planifica y la ejecuta con precisión.',
      duration: 3000
    },
    {
      type: 'philosophy' as const,
      content: 'Warrior no es solo un título, es una mentalidad. Es la capacidad de mantener la calma en la tormenta, de actuar con precisión bajo presión, de convertir cada pérdida en una lección y cada ganancia en una confirmación de tu estrategia. Aquí no buscamos suerte, buscamos dominio.',
      duration: 13000
    }
  ];

  return (
    <div 
      ref={scrollRef}
      className="min-h-screen bg-[#0f0f0f] text-white overflow-y-auto scrollbar-warrior"
    >
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
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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
        
        .objectives-grid > div {
          animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          animation-fill-mode: both;
        }
        
        .objectives-grid > div:nth-child(1) { animation-delay: 0.1s; }
        .objectives-grid > div:nth-child(2) { animation-delay: 0.2s; }
        .objectives-grid > div:nth-child(3) { animation-delay: 0.3s; }
        .objectives-grid > div:nth-child(4) { animation-delay: 0.4s; }
        .objectives-grid > div:nth-child(5) { animation-delay: 0.5s; }
        .objectives-grid > div:nth-child(6) { animation-delay: 0.6s; }
      `}</style>
      <div className="container mx-auto px-2 sm:px-4 py-4 md:py-8 pb-24 md:pb-8 transition-all duration-300">
        {/* Welcome Message */}
        <div className="w-full max-w-4xl mx-auto mb-6 md:mb-8 text-center px-4 md:px-0">
          <h2 className="text-xl md:text-2xl font-light text-gray-300 tracking-wide">
            Te damos la bienvenida{userData?.nickname ? (
              <>
                <span className="text-[#fafafa]">, </span>
                <span className="text-[#3ED598] font-medium">{userData.nickname}</span>
              </>
            ) : ''}
          </h2>
        </div>

        {/* Carousel Component */}
        <EnhancedCarousel content={mainCarouselContent} titleColor="#3ED598" dotsColor="#3ED598" />

        {/* Video introductorio */}
        <div className="w-full flex justify-center mb-8 px-2 md:px-0">
          <div className="w-full max-w-4xl">
            <video className="rounded-xl shadow-lg w-full h-64 md:h-80 object-cover" controls>
              <source src="/videos/warrior-intro.mp4" type="video/mp4" />
              Tu navegador no soporta el video.
            </video>
          </div>
        </div>

        {/* Carrusel de Bienvenida */}
        <div className="w-full max-w-6xl mx-auto mb-8 px-2 md:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            {carouselContent.map((item, index) => (
              <div
                key={item.id}
                className={`bg-gradient-to-br ${item.color} ${item.borderColor} rounded-2xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#3ED598]/20 animate-slide-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Video introductorio del warrior */}
        <div className="w-full flex justify-center mb-8 px-2 md:px-0">
          <div className="w-full max-w-4xl">
            <div className="bg-gradient-to-r from-[#3ED598]/10 to-[#3ED598]/20 border border-[#232323] rounded-xl p-6 text-center hover:border-[#3ED598] hover:border-t-2 hover:border-t-[#3ED598] hover:shadow-lg hover:shadow-[#3ED598]/20 transition-all duration-300">
              <h3 className="text-xl font-semibold text-[#3ED598] mb-4">Video de Bienvenida del Warrior</h3>
              <p className="text-gray-300 mb-4">
                Prepárate para dominar las técnicas avanzadas que solo los Warriors pueden ejecutar.
              </p>
              <div className="bg-gray-800 rounded-lg p-8 border border-[#232323] hover:border-[#3ED598] hover:border-t-2 hover:border-t-[#3ED598] hover:shadow-lg hover:shadow-[#3ED598]/20 transition-all duration-300">
                <Shield className="w-16 h-16 text-[#3ED598] mx-auto mb-4" />
                <p className="text-gray-400">Video introductorio del warrior</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación por Pestañas */}
        <div className="flex justify-center mb-8 px-2 md:px-0">
          <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-1 md:p-2 w-full max-w-md hover:border-[#3ED598] hover:border-t-2 hover:border-t-[#3ED598] hover:shadow-lg hover:shadow-[#3ED598]/20 transition-all duration-300">
            <button
              onClick={() => handleTabChange('theoretical')}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 text-sm md:text-base w-1/2 ${
                activeTab === 'theoretical'
                  ? 'bg-[#3ED598] text-gray-900 shadow-lg'
                  : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
              }`}
            >
              <BookOpen className="inline mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5" />
              Teórico
            </button>
            <button
              onClick={() => handleTabChange('practical')}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 text-sm md:text-base w-1/2 ${
                activeTab === 'practical'
                  ? 'bg-[#3ED598] text-gray-900 shadow-lg'
                  : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
              }`}
            >
              <Play className="inline mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5" />
              Práctico
            </button>
          </div>
        </div>

        {/* Grid de Módulos */}
        <div className="w-full max-w-6xl mx-auto px-2 md:px-0">
          <div className="objectives-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {getAllModules().map((module, index) => (
              <div
                key={module.id}
                className={`bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#232323] rounded-2xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#3ED598]/20 hover:border-[#3ED598] hover:border-t-2 hover:border-t-[#3ED598] cursor-pointer group`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {module.icon}
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-[#3ED598] transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Módulo {module.moduleNumber}
                      </p>
                    </div>
                  </div>
                  {module.isCompleted && (
                    <div className="w-6 h-6 bg-[#3ED598] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {module.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 bg-[#232323] px-2 py-1 rounded">
                    {module.type === 'theoretical' ? 'Teórico' : 
                     module.type === 'practical' ? 'Práctico' : 'Checkpoint'}
                  </span>
                  <div className="flex items-center text-[#3ED598] text-sm font-medium group-hover:text-white transition-colors">
                    Comenzar
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de Tribunal Imperial - Integración dinámica */}
        <div className="w-full max-w-6xl mx-auto mt-12 px-2 md:px-0">
          <div className="bg-gradient-to-r from-[#3ED598]/10 to-[#3ED598]/20 border border-[#232323] rounded-xl p-6 hover:border-[#3ED598] hover:border-t-2 hover:border-t-[#3ED598] hover:shadow-lg hover:shadow-[#3ED598]/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Crown className="w-8 h-8 text-[#3ED598]" />
                <div>
                  <h3 className="text-xl font-semibold text-[#3ED598]">Contenido del Tribunal Imperial</h3>
                  <p className="text-gray-300 text-sm">Módulos aprobados por los Maestros</p>
                </div>
              </div>
              <div className="bg-[#3ED598] text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                Dinámico
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Los Maestros del Tribunal Imperial pueden inyectar contenido directamente en tu carrusel de aprendizaje. 
              Estos módulos aparecerán automáticamente cuando sean aprobados y estarán marcados con el sello del Tribunal.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] border border-[#232323] rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Módulos Pendientes</h4>
                <p className="text-gray-400 text-sm">Esperando aprobación del Tribunal</p>
                <div className="text-[#3ED598] text-sm font-medium mt-2">0 módulos</div>
              </div>
              <div className="bg-[#1a1a1a] border border-[#232323] rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Última Actualización</h4>
                <p className="text-gray-400 text-sm">Contenido del Tribunal</p>
                <div className="text-[#3ED598] text-sm font-medium mt-2">Hace 2 días</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}