'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, Play } from 'lucide-react';

export default function Modulo7Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/iniciado" 
            className="inline-flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Módulo 7: Criptomonedas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Herramientas Económicas e Introducción al Mundo de las Criptomonedas
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Contenido del Módulo
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">1</span>
            </div>
            <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Introducción a las Criptomonedas</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Bitcoin, Ethereum y las generaciones de criptomonedas
                  </p>
            </div>
          </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">¿Qué es un Rig de minería?</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Concepto y tipos de hardware para minería
                  </p>
                </div>
          </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Tipos de Rig de minería</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    CPU, GPU, FPGA y ASIC
                  </p>
                </div>
          </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">¿Cómo armar un Rig de minería?</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Factores a considerar y planificación
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">5</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Dogecoin</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Historia, características y el fenómeno de las memecoins
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/dashboard/iniciado/Teorico/7-criptomonedas/contenido"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Ver Contenido Completo
            </Link>
            
            <Link
              href="/dashboard/iniciado"
              className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
