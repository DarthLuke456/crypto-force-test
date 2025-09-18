'use client';

import Link from 'next/link';
import { ListChecks, TrendingUp, Shield, Brain, CheckCircle, BookOpen } from 'lucide-react';

export default function PlanTradingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6">
            <ListChecks className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Plan de Trading
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Crea tu plan de trading profesional y desarrolla la disciplina necesaria para el éxito en los mercados
          </p>
        </div>

        {/* Module Overview */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <BookOpen className="mr-3 text-blue-400" />
            ¿Por qué necesitas un plan de trading?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Hoja de Ruta Profesional</h3>
              <p className="leading-relaxed">
                Un plan de trading es tu GPS personal que te guía desde donde estás ahora hasta donde quieres llegar: 
                la rentabilidad consistente. Sin él, operar es como conducir sin mapa.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Control y Disciplina</h3>
              <p className="leading-relaxed">
                Te permite operar sin emociones, evaluar tu progreso objetivamente y mantener la disciplina 
                necesaria para el éxito a largo plazo en los mercados.
              </p>
            </div>
          </div>
        </div>

        {/* Key Topics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center mb-4">
              <Brain className="text-blue-400 text-2xl mr-3" />
              <h3 className="text-lg font-semibold text-white">Conócete a ti mismo</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Identifica tus fortalezas, debilidades y motivaciones reales para operar en los mercados
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center mb-4">
              <TrendingUp className="text-green-400 text-2xl mr-3" />
              <h3 className="text-lg font-semibold text-white">Estrategias y Set-ups</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Define tus estrategias de entrada, salida y las configuraciones específicas que utilizarás
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-lg rounded-xl p-6 border border-red-500/30">
            <div className="flex items-center mb-4">
              <Shield className="text-red-400 text-2xl mr-3" />
              <h3 className="text-lg font-semibold text-white">Gestión de Riesgo</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Establece parámetros claros de riesgo por operación y gestión del dinero
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center mb-4">
              <CheckCircle className="text-purple-400 text-2xl mr-3" />
              <h3 className="text-lg font-semibold text-white">Disciplina y Reglas</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Desarrolla las reglas de oro del trading y los sistemas de disciplina para mantenerlas
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30">
            <div className="flex items-center mb-4">
              <ListChecks className="text-yellow-400 text-2xl mr-3" />
              <h3 className="text-lg font-semibold text-white">Rutinas Diarias</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Establece rutinas pre-mercado y post-mercado para mantener la consistencia
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
            <div className="flex items-center mb-4">
              <BookOpen className="text-indigo-400 text-2xl mr-3" />
              <h3 className="text-lg font-semibold text-white">Registro y Análisis</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Implementa sistemas de registro y análisis para evaluar tu progreso constantemente
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-blue-500/30">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Beneficios de un Plan de Trading</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="text-green-400 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-300">Operar relajado, libre de estrés y con mayor simplicidad</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-green-400 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-300">Capacidad para controlar tu evolución y diagnosticar fallos</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-green-400 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-300">Prevenir problemas psicológicos desde la raíz</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="text-green-400 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-300">Reducir el número de operaciones malas</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-green-400 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-300">Evitar decisiones irracionales en el calor del momento</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-green-400 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-300">Desarrollar un alto grado de disciplina profesional</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link 
            href="/dashboard/iniciado/Practico/10-plan-trading/contenido"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ListChecks className="mr-3" />
            Comenzar Plan de Trading
          </Link>
        </div>

        {/* Progress Indicator */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full px-6 py-3">
            <span className="text-gray-300 text-sm">Progreso del Módulo:</span>
            <span className="text-white font-semibold">10 de 12</span>
          </div>
        </div>
      </div>
    </div>
  );
} 
