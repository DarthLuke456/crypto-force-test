import React from 'react';
import BackButton from '@/components/ui/BackButton';
import Link from 'next/link';

export default function ModuloPractico8Index() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-2 sm:px-8 py-8 max-w-3xl mx-auto">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 pt-12 relative">
        {/* Botón Volver en la esquina superior izquierda */}
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-[#ec4d58] mb-2 text-center">Curso Práctico de Trading</h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Módulo 8: Correlaciones entre Mercados</h2>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">Resumen del Módulo</h3>
          <p className="mb-6">En este módulo aprenderás a identificar y aprovechar las correlaciones entre diferentes mercados. Descubrirás cómo el petróleo, el oro y el cobre afectan las divisas, y cómo estos conocimientos pueden mejorar significativamente tus decisiones de trading.</p>
          
          <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
            <h4 className="text-md font-semibold mb-3 text-[#ec4d58]">Temas principales:</h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Petróleo Crudo</li>
              <li>Oro</li>
              <li>Cobre</li>
              <li>Prueba: Correlaciones</li>
            </ul>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
            <h4 className="text-md font-semibold mb-3 text-[#ec4d58]">Objetivos de aprendizaje:</h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Comprender cómo el petróleo afecta las divisas CAD, USD y JPY</li>
              <li>Analizar la correlación entre oro, CHF y USD</li>
              <li>Estudiar la relación entre cobre y el dólar australiano</li>
              <li>Desarrollar una visión macroeconómica de los mercados</li>
            </ul>
          </div>

          <div className="text-center">
            <Link 
              href="/dashboard/iniciado/Practico/8-correlaciones-mercados/contenido"
              className="inline-flex items-center px-6 py-3 bg-[#ec4d58] hover:bg-[#d63d47] text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <span>Ver Contenido Completo</span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Botón Volver al final del texto, del lado izquierdo */}
        <div className="mt-8">
          <BackButton />
        </div>
      </div>
    </div>
  );
} 
