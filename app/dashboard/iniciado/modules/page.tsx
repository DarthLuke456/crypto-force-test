'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Play, CheckCircle, Clock, Award } from 'lucide-react';

export default function ModulesPage() {
  const [activeTab, setActiveTab] = useState<'teorico' | 'practico'>('teorico');

  const modulosTeoricos = [
    {
      id: 1,
      title: 'Introducción a la Lógica Económica',
      description: 'Fundamentos de la economía y su aplicación en los mercados financieros',
      status: 'completed',
      href: '/dashboard/iniciado/Teorico/1-introduccion-logica-economica'
    },
    {
      id: 2,
      title: 'Fuerzas del Mercado',
      description: 'Oferta, demanda y equilibrio en los mercados financieros',
      status: 'completed',
      href: '/dashboard/iniciado/Teorico/2-fuerzas-del-mercado'
    },
    {
      id: 3,
      title: 'Acción del Gobierno en los Mercados',
      description: 'Políticas monetarias y fiscales y su impacto',
      status: 'in-progress',
      href: '/dashboard/iniciado/Teorico/3-accion-gobierno-mercados'
    },
    {
      id: 4,
      title: 'Competencia Perfecta',
      description: 'Modelos de competencia y eficiencia de mercado',
      status: 'locked',
      href: '/dashboard/iniciado/Teorico/4-competencia-perfecta'
    },
    {
      id: 5,
      title: 'Monopolio y Oligopolio',
      description: 'Estructuras de mercado no competitivas',
      status: 'locked',
      href: '/dashboard/iniciado/Teorico/5-monopolio-oligopolio'
    },
    {
      id: 6,
      title: 'Tecnología Blockchain',
      description: 'Fundamentos de la tecnología blockchain y criptomonedas',
      status: 'locked',
      href: '/dashboard/iniciado/Teorico/6-tecnologia-blockchain'
    },
    {
      id: 7,
      title: 'Criptomonedas',
      description: 'Introducción al mundo de las criptomonedas',
      status: 'locked',
      href: '/dashboard/iniciado/Teorico/7-criptomonedas'
    },
    {
      id: 8,
      title: 'Operaciones con Criptomonedas',
      description: 'Cómo operar y gestionar criptomonedas',
      status: 'locked',
      href: '/dashboard/iniciado/Teorico/8-operaciones-criptomonedas'
    }
  ];

  const modulosPracticos = [
    {
      id: 1,
      title: 'Introducción al Trading',
      description: 'Fundamentos del trading y análisis de mercados',
      status: 'completed',
      href: '/dashboard/iniciado/Practico/1-introduccion-trading'
    },
    {
      id: 2,
      title: 'Introducción al Análisis Técnico',
      description: 'Herramientas básicas del análisis técnico',
      status: 'completed',
      href: '/dashboard/iniciado/Practico/2-introduccion-analisis-tecnico'
    },
    {
      id: 3,
      title: 'Patrones de Vela',
      description: 'Identificación y uso de patrones de velas japonesas',
      status: 'in-progress',
      href: '/dashboard/iniciado/Practico/3-patrones-vela'
    },
    {
      id: 4,
      title: 'Fibonacci y Medias Móviles',
      description: 'Uso de retrocesos de Fibonacci y medias móviles',
      status: 'locked',
      href: '/dashboard/iniciado/Practico/4-fibonacci-medias'
    },
    {
      id: 5,
      title: 'Indicadores RSI y MACD',
      description: 'Osciladores e indicadores de momentum',
      status: 'locked',
      href: '/dashboard/iniciado/Practico/5-indicadores-rsi-macd'
    },
    {
      id: 6,
      title: 'Estocástico y Bandas de Bollinger',
      description: 'Indicadores de volatilidad y momentum',
      status: 'locked',
      href: '/dashboard/iniciado/Practico/6-estocastico-bollinger'
    },
    {
      id: 7,
      title: 'Análisis Fundamental',
      description: 'Evaluación de activos basada en fundamentos',
      status: 'locked',
      href: '/dashboard/iniciado/Practico/7-analisis-fundamental'
    },
    {
      id: 8,
      title: 'Análisis Fundamental Avanzado',
      description: 'Técnicas avanzadas de análisis fundamental',
      status: 'locked',
      href: '/dashboard/iniciado/Practico/8-analisis-fundamental-2'
    },
    {
      id: 9,
      title: 'Gestión de Riesgo',
      description: 'Estrategias de gestión de riesgo en trading',
      status: 'locked',
      href: '/dashboard/iniciado/Practico/9-gestion-riesgo'
    },
    {
      id: 10,
      title: 'Plan de Trading',
      description: 'Desarrollo de un plan de trading personalizado',
      status: 'locked',
      href: '/dashboard/iniciado/Practico/10-plan-trading'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'locked':
        return <Award className="w-5 h-5 text-gray-400" />;
      default:
        return <Play className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'in-progress':
        return 'En Progreso';
      case 'locked':
        return 'Bloqueado';
      default:
        return 'Disponible';
    }
  };

  const currentModules = activeTab === 'teorico' ? modulosTeoricos : modulosPracticos;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Módulos de Aprendizaje</h1>
          <p className="text-gray-400">Explora los contenidos teóricos y prácticos disponibles</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('teorico')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'teorico'
                ? 'bg-white text-gray-900'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            Teórico
          </button>
          <button
            onClick={() => setActiveTab('practico')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'practico'
                ? 'bg-white text-gray-900'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Play className="w-5 h-5 inline mr-2" />
            Práctico
          </button>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentModules.map((modulo) => (
            <Link
              key={modulo.id}
              href={modulo.status === 'locked' ? '#' : modulo.href}
              className={`group relative bg-gray-800 rounded-xl p-6 transition-all duration-300 ${
                modulo.status === 'locked'
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:bg-gray-700 hover:transform hover:scale-105'
              }`}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {getStatusIcon(modulo.status)}
              </div>

              {/* Module Number */}
              <div className="text-2xl font-bold text-gray-400 mb-2">
                {modulo.id.toString().padStart(2, '0')}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#fafafa] transition-colors">
                {modulo.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {modulo.description}
              </p>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  modulo.status === 'completed' ? 'bg-green-900 text-green-300' :
                  modulo.status === 'in-progress' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-gray-700 text-gray-400'
                }`}>
                  {getStatusText(modulo.status)}
                </span>
                
                {modulo.status !== 'locked' && (
                  <div className="text-[#fafafa] group-hover:text-white transition-colors">
                    <Play className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Locked Overlay */}
              {modulo.status === 'locked' && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Completa módulos anteriores</p>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Progress Summary */}
        <div className="mt-12 bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Resumen de Progreso</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-gray-300 mb-2">Módulos Teóricos</h4>
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-[#fafafa] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(modulosTeoricos.filter(m => m.status === 'completed').length / modulosTeoricos.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-400">
                  {modulosTeoricos.filter(m => m.status === 'completed').length}/{modulosTeoricos.length}
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-300 mb-2">Módulos Prácticos</h4>
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-[#fafafa] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(modulosPracticos.filter(m => m.status === 'completed').length / modulosPracticos.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-400">
                  {modulosPracticos.filter(m => m.status === 'completed').length}/{modulosPracticos.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
