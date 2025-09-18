'use client';

import Link from 'next/link';
import { Shield, AlertTriangle, TrendingUp, Brain, CheckCircle } from 'lucide-react';

export default function GestionRiesgoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-6">
            <Shield className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Gestión de Riesgo
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Aprende las técnicas fundamentales para proteger tu capital y mantener la disciplina emocional en el trading
          </p>
        </div>

        {/* Module Overview */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <AlertTriangle className="mr-3 text-red-400" />
            ¿Por qué es crucial la gestión de riesgo?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Protección del Capital</h3>
              <p className="leading-relaxed">
                La mayoría de los operadores pierden dinero no por falta de conocimiento técnico, 
                sino por no aplicar correctamente las técnicas de administración del dinero y gestión de riesgo.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Disciplina Emocional</h3>
              <p className="leading-relaxed">
                Aprender a controlar las emociones y mantener la disciplina es fundamental para 
                el éxito a largo plazo en los mercados financieros.
              </p>
            </div>
          </div>
        </div>

        {/* Key Topics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-lg rounded-xl p-6 border border-red-500/30">
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-red-400 text-2xl mr-3" />
              <h3 className="text-lg font-semibold text-white">¿Por qué pierden dinero?</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Análisis de los errores más comunes que cometen los operadores y cómo evitarlos
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center mb-4">
              <Shield className="text-blue-400 text-2xl mr-3" />
              <h3 className="text-lg font-semibold text-white">Stop-Loss</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Técnicas avanzadas para colocar y gestionar órdenes de stop-loss efectivas
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center mb-4">
              <TrendingUp className="text-green-400 text-2xl mr-3" />
              <h3 className="text-lg font-semibold text-white">Estilos de Trading</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Diferentes enfoques: intradía, swing trading, posicional y carry trade
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center mb-4">
              <Brain className="text-purple-400 text-2xl mr-3" />
              <h3 className="text-lg font-semibold text-white">Psicología del Trading</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Control emocional, desapego y mentalidad para operar exitosamente
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30">
            <div className="flex items-center mb-4">
              <CheckCircle className="text-yellow-400 text-2xl mr-3" />
              <h3 className="text-lg font-semibold text-white">Trabajo Práctico</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Ejercicios prácticos para aplicar las técnicas de gestión de riesgo
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
            <div className="flex items-center mb-4">
              <Shield className="text-indigo-400 text-2xl mr-3" />
              <h3 className="text-lg font-semibold text-white">Claves Útiles</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Consejos prácticos para mejorar la gestión de riesgo y el rendimiento
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link 
            href="/dashboard/iniciado/Practico/9-gestion-riesgo/contenido"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Shield className="mr-3" />
            Comenzar Lección
          </Link>
        </div>

        {/* Progress Indicator */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full px-6 py-3">
            <span className="text-gray-300 text-sm">Progreso del Módulo:</span>
            <span className="text-white font-semibold">9 de 9</span>
          </div>
        </div>
      </div>
    </div>
  );
} 
