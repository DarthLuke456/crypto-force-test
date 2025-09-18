import React from 'react';
import BackButton from '@/components/ui/BackButton';

export default function ModuloPractico8Contenido() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-2 sm:px-8 py-8 max-w-3xl mx-auto">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 pt-12 relative">
        {/* Boton Volver en la esquina superior izquierda */}
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-[#ec4d58] mb-2 text-center">Curso Practico de Trading</h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Modulo 8: Analisis Fundamental Avanzado</h2>

        <section className="mb-8">
          <div className="space-y-8">
            {/* Seccion A: Eventos Economicos */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">A) Eventos Economicos Importantes</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Calendario Economico</h4>
                  <p className="text-sm mb-3">Los traders deben estar atentos al calendario economico para anticipar movimientos del mercado.</p>
                  <p className="text-sm mb-3">Los eventos economicos mas importantes incluyen:</p>
                  <ul className="text-sm space-y-2 mb-3">
                    <li>• Decisiones de tasas de interes de bancos centrales</li>
                    <li>• Reportes de empleo (NFP en Estados Unidos)</li>
                    <li>• Datos de inflacion (CPI, PPI)</li>
                    <li>• Reportes de PIB</li>
                    <li>• Encuestas de confianza del consumidor</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Expectativas del Mercado</h4>
                  <p className="text-sm mb-3">El mercado reacciona no solo a los datos reales, sino tambien a como se comparan con las expectativas.</p>
                  <p className="text-sm">• Datos mejores que las expectativas: Generalmente fortalece la moneda</p>
                  <p className="text-sm">• Datos peores que las expectativas: Generalmente debilita la moneda</p>
                </div>
              </div>
            </div>

            {/* Seccion B: Correlaciones */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">B) Correlaciones entre Mercados</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Correlaciones Principales</h4>
                  <p className="text-sm mb-3">Las correlaciones entre diferentes mercados pueden proporcionar informacion valiosa:</p>
                  <ul className="text-sm space-y-2 mb-3">
                    <li>• USD y Oro: Generalmente correlacion negativa</li>
                    <li>• USD y Petroleo: Puede ser positiva o negativa segun el contexto</li>
                    <li>• EUR/USD y GBP/USD: Alta correlacion positiva</li>
                    <li>• USD/JPY y Nikkei: Correlacion positiva</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Como usar las correlaciones</h4>
                  <p className="text-sm mb-3">• Confirmacion de señales: Si dos pares correlacionados muestran la misma señal</p>
                  <p className="text-sm mb-3">• Diversificacion: Evitar posiciones en pares altamente correlacionados</p>
                  <p className="text-sm">• Oportunidades de arbitraje: Cuando las correlaciones se rompen temporalmente</p>
                </div>
              </div>
            </div>

            {/* Seccion C: Sentimiento del Mercado */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">C) Sentimiento del Mercado</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Indicadores de Sentimiento</h4>
                  <p className="text-sm mb-3">El sentimiento del mercado puede ser un indicador contrarian importante:</p>
                  <ul className="text-sm space-y-2 mb-3">
                    <li>• Encuestas de confianza del consumidor</li>
                    <li>• Indices de volatilidad (VIX)</li>
                    <li>• Posiciones de los traders (Commitment of Traders)</li>
                    <li>• Flujos de capital y fondos mutuos</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Trading Contrarian</h4>
                  <p className="text-sm mb-3">Cuando el sentimiento es extremadamente alcista o bajista, puede indicar una posible reversión.</p>
                  <p className="text-sm">• Sentimiento extremadamente alcista: Posible tope del mercado</p>
                  <p className="text-sm">• Sentimiento extremadamente bajista: Posible fondo del mercado</p>
                </div>
              </div>
            </div>

            {/* Seccion D: La pregunta del dia */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">D) La pregunta del dia</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">1. Como utilizaria las correlaciones entre mercados para mejorar sus decisiones de trading?</p>
                <p className="text-sm mb-3">2. Que indicadores de sentimiento considera mas confiables para identificar posibles reversiones?</p>
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-sm text-gray-300"><strong>NOTA:</strong> La pregunta del dia es una pregunta retorica, cuyo objetivo es ayudarle a revisar lo que acaba de aprender. NO es necesario enviarnos una respuesta, ya que estas preguntas no son evaluadas.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Boton Volver al final del texto, del lado izquierdo */}
        <div className="mt-8">
          <BackButton />
        </div>
      </div>
    </div>
  );
}

