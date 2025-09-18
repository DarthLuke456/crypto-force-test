import React from 'react';
import BackButton from '@/components/ui/BackButton';

export default function ModuloPractico5Contenido() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-2 sm:px-8 py-8 max-w-3xl mx-auto">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 pt-12 relative">
        {/* Boton Volver en la esquina superior izquierda */}
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-[#ec4d58] mb-2 text-center">Curso Practico de Trading</h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Modulo 5: Estocastico y Bandas de Bollinger</h2>

        <section className="mb-8">
          <div className="space-y-8">
            {/* Seccion A: Estocastico */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">A) Estocastico</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Que es el estocastico?</h4>
                  <p className="text-sm mb-3">El estocastico es un indicador de momentum que compara el precio de cierre actual con el rango de precios durante un periodo de tiempo especifico.</p>
                  <p className="text-sm mb-3">Se compone de dos lineas: %K (linea principal) y %D (media movil de %K).</p>
                  <p className="text-sm">El estocastico oscila entre 0 y 100, donde valores por encima de 80 indican sobrecompra y valores por debajo de 20 indican sobreventa.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Como interpretar el estocastico</h4>
                  <ul className="text-sm space-y-2 mb-3">
                    <li>• Valores por encima de 80: Mercado sobrecomprado, posible reversión bajista</li>
                    <li>• Valores por debajo de 20: Mercado sobrevendido, posible reversión alcista</li>
                    <li>• Cruces de %K y %D: Pueden generar señales de entrada y salida</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Divergencias</h4>
                  <p className="text-sm mb-3">Una divergencia ocurre cuando el precio hace nuevos máximos pero el estocastico no, o viceversa.</p>
                  <p className="text-sm">Las divergencias pueden ser señales importantes de posibles reversiones de tendencia.</p>
                </div>
              </div>
            </div>

            {/* Seccion B: Bandas de Bollinger */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">B) Bandas de Bollinger</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Que son las Bandas de Bollinger?</h4>
                  <p className="text-sm mb-3">Las Bandas de Bollinger son un indicador de volatilidad que consiste en tres lineas:</p>
                  <ul className="text-sm space-y-2 mb-3">
                    <li>• Banda superior: Media movil + (2 x desviación estándar)</li>
                    <li>• Banda media: Media movil simple (generalmente 20 periodos)</li>
                    <li>• Banda inferior: Media movil - (2 x desviación estándar)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Interpretación de las Bandas</h4>
                  <p className="text-sm mb-3">• Cuando el precio toca la banda superior: Posible sobrecompra</p>
                  <p className="text-sm mb-3">• Cuando el precio toca la banda inferior: Posible sobreventa</p>
                  <p className="text-sm">• El ancho de las bandas indica la volatilidad del mercado</p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Squeeze y Expansión</h4>
                  <p className="text-sm mb-3">• Squeeze: Las bandas se estrechan, indicando baja volatilidad y posible movimiento importante</p>
                  <p className="text-sm">• Expansión: Las bandas se separan, indicando alta volatilidad</p>
                </div>
              </div>
            </div>

            {/* Seccion C: Estrategias combinadas */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">C) Estrategias combinadas</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">La combinación del estocastico con las Bandas de Bollinger puede proporcionar señales más confiables:</p>
                <ul className="text-sm space-y-2 mb-3">
                  <li>• Entrada alcista: Estocastico en sobreventa + precio cerca de la banda inferior</li>
                  <li>• Entrada bajista: Estocastico en sobrecompra + precio cerca de la banda superior</li>
                  <li>• Confirmación: Buscar divergencias en el estocastico</li>
                </ul>
                <p className="text-sm">Esto aumenta la probabilidad de éxito en las operaciones.</p>
              </div>
            </div>

            {/* Seccion D: La pregunta del dia */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">D) La pregunta del dia</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">1. Como utilizaria el estocastico para identificar puntos de entrada en un mercado lateral?</p>
                <p className="text-sm mb-3">2. Que indicaria si las Bandas de Bollinger se estrechan significativamente?</p>
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





