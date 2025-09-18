'use client';
import React from 'react';
import Link from 'next/link';
import BackButton from '@/components/ui/BackButton';
import { BookOpen, TrendingUp, Target, Zap } from 'lucide-react';

export default function AnalisisFundamental2Page() {
  const learningObjectives = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Análisis Fundamental Avanzado",
      description: "Profundiza en técnicas avanzadas de análisis fundamental."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Indicadores Económicos",
      description: "Aprende a interpretar indicadores económicos clave."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Estrategias Avanzadas",
      description: "Desarrolla estrategias basadas en análisis fundamental."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Aplicación Práctica",
      description: "Implementa análisis fundamental en tu operativa."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <BackButton />
          <div className="text-center mt-6">
            <h1 className="text-4xl md:text-5xl font-bold text-[#ec4d58] mb-4">
              Módulo 8: Análisis Fundamental 2
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Técnicas Avanzadas
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <span>📊 Análisis Avanzado</span>
              <span>•</span>
              <span>📈 Indicadores</span>
              <span>•</span>
              <span>🎯 Estrategias</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Module Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Module Overview */}
            <div className="bg-[#181818] rounded-2xl p-6 border border-[#232323]">
              <h2 className="text-2xl font-bold text-[#ec4d58] mb-4 flex items-center gap-3">
                <BookOpen className="w-7 h-7" />
                Descripción del Módulo
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Este módulo está en desarrollo. Próximamente tendrás acceso a técnicas avanzadas 
                de análisis fundamental que te permitirán tomar decisiones de trading más informadas.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Aprenderás a interpretar indicadores económicos clave, desarrollar estrategias 
                avanzadas y aplicar el análisis fundamental en tu operativa diaria.
              </p>
            </div>

            {/* Learning Objectives */}
            <div className="bg-[#181818] rounded-2xl p-6 border border-[#232323]">
              <h2 className="text-2xl font-bold text-[#ec4d58] mb-6">🎯 Objetivos de Aprendizaje</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learningObjectives.map((objective, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-[#232323] rounded-lg">
                    <div className="text-[#ec4d58] flex-shrink-0 mt-1">
                      {objective.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{objective.title}</h3>
                      <p className="text-sm text-gray-400">{objective.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Navigation & Resources */}
          <div className="space-y-6">
            {/* Start Module Button */}
            <div className="bg-[#181818] rounded-2xl p-6 border border-[#232323] text-center">
              <h3 className="text-xl font-bold text-[#ec4d58] mb-4">🚀 Próximamente</h3>
              <p className="text-gray-300 mb-6">
                Este módulo está en desarrollo. Mantente atento a las actualizaciones.
              </p>
              <div className="text-center">
                <button 
                  disabled
                  className="inline-flex items-center px-6 py-3 bg-gray-600 text-gray-400 font-semibold rounded-lg cursor-not-allowed"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  En Desarrollo
                </button>
              </div>
            </div>

            {/* Module Stats */}
            <div className="bg-[#181818] rounded-2xl p-6 border border-[#232323]">
              <h3 className="text-xl font-bold text-[#ec4d58] mb-4">📊 Estado del Módulo</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Estado:</span>
                  <span className="text-yellow-400 font-semibold">En Desarrollo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Progreso:</span>
                  <span className="text-white font-semibold">0%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Fecha estimada:</span>
                  <span className="text-white font-semibold">Próximamente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
