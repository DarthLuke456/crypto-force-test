import React from 'react';
import BackButton from '@/components/ui/BackButton';
import Image from 'next/image';

export default function ModuloPractico6Contenido() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-2 sm:px-8 py-8 max-w-3xl mx-auto">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 pt-12 relative">
        {/* Botón Volver en la esquina superior izquierda */}
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-[#ec4d58] mb-2 text-center">Curso Práctico de Trading</h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Módulo 6: Indicadores RSI y MACD</h2>

        <section className="mb-8">
          <div className="space-y-8">
            {/* Sección A: RSI (Índice de Fuerza Relativa) */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">A) RSI (Índice de Fuerza Relativa)</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">¿Qué es el RSI?</h4>
                  <p className="text-sm mb-3">El RSI es un oscilador de momentum que mide la velocidad y magnitud de los cambios de precio.</p>
                  <p className="text-sm mb-3">Oscila entre 0 y 100, donde valores por encima de 70 indican sobrecompra y valores por debajo de 30 indican sobreventa.</p>
                  <p className="text-sm mb-3">El RSI se calcula comparando las ganancias promedio con las pérdidas promedio durante un periodo de tiempo específico.</p>
                  <p className="text-sm mb-3">en otras palabras, cuando se espera que el mercado simplemente oscile entre un nivel superior e inferior</p>
                  
                  {/* Imagen 1 después de la frase sobre oscilación del mercado */}
                  <div className="my-4 flex justify-center">
                    <Image
                      src="/imagenes%20modulo%20practico%20%234/1.png"
                      alt="Oscilación del mercado entre niveles"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">¿Cómo interpretar el RSI?</h4>
                  <ul className="text-sm space-y-2 mb-3">
                    <li>• RSI &gt; 70: Mercado sobrecomprado, posible reversión bajista</li>
                    <li>• RSI &lt; 30: Mercado sobrevendido, posible reversión alcista</li>
                    <li>• Divergencias: Cuando el precio y el RSI se mueven en direcciones opuestas</li>
                    <li>• Niveles de 50: Línea central que separa momentum alcista y bajista</li>
                  </ul>
                  <p className="text-sm mb-3">Si el patrón de velas lo confirma, el operador puede valerse de esta oportunidad para ingresar una posición.</p>
                  
                  {/* Imagen 2 después de la frase sobre confirmación del patrón de velas */}
                  <div className="my-4 flex justify-center">
                    <Image
                      src="/imagenes%20modulo%20practico%20%234/2.png"
                      alt="Confirmación del patrón de velas"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Niveles de Sobrecompra y Sobreventa</h4>
                  <p className="text-sm mb-3">Las lecturas por encima de 70 indican la sobrecompra y las lecturas por debajo de 30 indican la sobreventa.</p>
                  
                  {/* Imagen 3 después de la frase sobre lecturas de sobrecompra y sobreventa */}
                  <div className="my-4 flex justify-center">
                    <Image
                      src="/imagenes%20modulo%20practico%20%234/3.png"
                      alt="Niveles de sobrecompra y sobreventa"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Divergencias en el RSI</h4>
                  <p className="text-sm mb-3">Divergencia: el gráfico que aparece a continuación es un ejemplo de cómo se podría haber utilizado una divergencia en el RSI para operar.</p>
                  
                  {/* Imagen 4 después de la frase sobre divergencia en el RSI */}
                  <div className="my-4 flex justify-center">
                    <Image
                      src="/imagenes%20modulo%20practico%20%234/4.png"
                      alt="Divergencia en el RSI"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección B: MACD */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">B) MACD (Convergencia-Divergencia de Medias Móviles)</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">¿Qué es el MACD?</h4>
                  <p className="text-sm mb-3">El MACD es un indicador de momentum que muestra la relación entre dos medias móviles exponenciales.</p>
                  <p className="text-sm mb-3">Se compone de tres elementos: la línea MACD, la línea de señal y el histograma.</p>
                  <p className="text-sm mb-3">El MACD se calcula restando la EMA de 26 periodos de la EMA de 12 periodos.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Componentes del MACD</h4>
                  <ul className="text-sm space-y-2 mb-3">
                    <li>• Línea MACD: Diferencia entre EMA 12 y EMA 26</li>
                    <li>• Línea de Señal: EMA de 9 periodos de la línea MACD</li>
                    <li>• Histograma: Diferencia entre la línea MACD y la línea de señal</li>
                  </ul>
                  <p className="text-sm mb-3">El punto "cero" del histograma, que significa el punto en el que las barras se cruzan por encima y por debajo, se denomina línea central.</p>
                  
                  {/* Imagen 5 después de la frase sobre el punto cero del histograma */}
                  <div className="my-4 flex justify-center">
                    <Image
                      src="/imagenes%20modulo%20practico%20%234/5.png"
                      alt="Punto cero del histograma MACD"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Señales del MACD</h4>
                  <p className="text-sm mb-3">• Cruce alcista: La línea MACD cruza por encima de la línea de señal</p>
                  <p className="text-sm mb-3">• Cruce bajista: La línea MACD cruza por debajo de la línea de señal</p>
                  <p className="text-sm mb-3">• Divergencias: Cuando el precio y el MACD se mueven en direcciones opuestas</p>
                  <p className="text-sm mb-3">• Histograma: Muestra la fuerza del momentum</p>
                  <p className="text-sm mb-3">Considere el gráfico que aparece a continuación, éste explica cómo se puede utilizar un indicador MACD.</p>
                  
                  {/* Imagen 6 después de la frase sobre cómo utilizar el indicador MACD */}
                  <div className="my-4 flex justify-center">
                    <Image
                      src="/imagenes%20modulo%20practico%20%234/6.png"
                      alt="Cómo utilizar el indicador MACD"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Consideraciones Importantes</h4>
                  <p className="text-sm mb-3">Siempre considere el apoyo/resistencia al ingresar a una operación, más allá de los cruces</p>
                  
                  {/* Imagen 7 después de la frase sobre considerar apoyo/resistencia */}
                  <div className="my-4 flex justify-center">
                    <Image
                      src="/imagenes%20modulo%20practico%20%234/7.png"
                      alt="Considerar apoyo y resistencia"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección C: Estrategias Combinadas */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">C) Estrategias Combinadas</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">La combinación del RSI y MACD puede proporcionar señales más confiables:</p>
                <ul className="text-sm space-y-2 mb-3">
                  <li>• Confirmación de tendencia: RSI y MACD en la misma dirección</li>
                  <li>• Entrada alcista: RSI en sobreventa + cruce alcista del MACD</li>
                  <li>• Entrada bajista: RSI en sobrecompra + cruce bajista del MACD</li>
                  <li>• Divergencias múltiples: Cuando ambos indicadores muestran divergencias</li>
                </ul>
                <p className="text-sm mb-3">Esto reduce las señales falsas y aumenta la probabilidad de éxito.</p>
                <p className="text-sm mb-3">Esta divergencia en un gráfico diario tuvo un año de duración antes de que el par finalmente rompiera el nivel se soporte y cayera.</p>
                
                {/* Imagen 8 después de la frase sobre divergencia de un año de duración */}
                <div className="my-4 flex justify-center">
                  <Image
                    src="/imagenes%20modulo%20practico%20%234/8.png"
                    alt="Divergencia de un año de duración"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Sección D: La Pregunta del Día */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">D) La Pregunta del Día</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">1. ¿Cómo utilizaría el RSI para identificar divergencias en una tendencia fuerte?</p>
                <p className="text-sm mb-3">2. ¿Qué diferencia hay entre un cruce del MACD y una divergencia del MACD?</p>
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-sm text-gray-300"><strong>NOTA:</strong> La pregunta del día es una pregunta retórica, cuyo objetivo es ayudarle a revisar lo que acaba de aprender. NO es necesario enviarnos una respuesta, ya que estas preguntas no son evaluadas.</p>
                </div>
              </div>
            </div>
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
