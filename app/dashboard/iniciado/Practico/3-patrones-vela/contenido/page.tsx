import React from 'react';
import BackButton from '@/components/ui/BackButton';
import Image from 'next/image';

export default function ModuloPractico3Contenido() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-2 sm:px-8 py-8 max-w-3xl mx-auto">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 pt-12 relative">
        {/* Botón Volver en la esquina superior izquierda */}
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-[#ec4d58] mb-2 text-center">Curso Práctico de Trading</h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Módulo 3: Patrones de vela</h2>

        <section className="mb-8">
          <div className="space-y-8">
            {/* Sección A: El uso de Velas para Identificar Cambios de Tendencia */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">A) El uso de Velas para Identificar Cambios de Tendencia</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">¿En qué consisten las velas?</h4>
                  <p className="text-sm mb-3">Los gráficos de vela brindan información sobre el comportamiento del precio o del movimiento del precio de un par de divisas a lo largo de un determinado período de tiempo. Cada vela contiene cuatro atributos:</p>
                  <ul className="text-sm space-y-1 mb-3">
                    <li>• El precio de apertura de un par de divisas al momento de inaugurar la vela</li>
                    <li>• El precio de cierre</li>
                    <li>• El máximo en un marco de tiempo</li>
                    <li>• El mínimo en un marco de tiempo</li>
                  </ul>
                  <p className="text-sm mb-3">En un gráfico diario, cada vela representa un período de 24 horas; en un gráfico por hora cada vela representa una hora, y así sucesivamente.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Definiciones Clave</h4>
                  <p className="text-sm mb-3"><strong>Cuerpo:</strong> la diferencia entre el precio de apertura y el precio de cierre. Ello corresponde a la parte ancha de la vela en color rojo o verde.</p>
                  <p className="text-sm mb-3"><strong>Mecha o sombra:</strong> la parte delgada de la vela que representa los puntos extremos máximo y mínimo para el período de tiempo representado por tal vela.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Concepto Clave: las Velas Indican Cambios de Tendencia</h4>
                  <ul className="text-sm space-y-2 mb-3">
                    <li>• Las velas pueden utilizarse para identificar cambios en las tendencias del mercado</li>
                  </ul>
                  <p className="text-sm mb-3">Entonces, ¿Por qué las velas son tan importantes en la compraventa? En pocas palabras, se debe a que son el mejor indicador de lo que está ocurriendo en el mercado al momento presente. Las velas nos brindan una mirada interior de las emociones de los participantes del mercado. A pesar de que los operadores cambian a lo largo del tiempo, las emociones humanas son constantes. Una determinada serie de eventos genera un patrón de velas y cuando vemos tal patrón sabemos exactamente qué ha ocurrido.</p>
                  <p className="text-sm">En última instancia, las velas pueden utilizarse fácilmente para identificar cambios potenciales en las tendencias del mercado, especialmente cuando se las utiliza junto con otros indicadores.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Análisis Visual de la Vela</h4>
                  <p className="text-sm mb-3">A continuación, se presenta un análisis visual de la vela:</p>
                  
                  {/* Imagen 1 después de la frase sobre análisis visual de la vela */}
                  <div className="my-4 flex justify-center">
                    <Image
                      src="/images/modulo-practico-2/1.png"
                      alt="Análisis visual de la vela"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección B: Patrones de vela claves */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">B) Patrones de vela claves</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">Los siguientes son patrones de vela esenciales que se deben buscar:</p>
                
                {/* Imagen 2 después de la frase sobre patrones de vela esenciales */}
                <div className="my-4 flex justify-center">
                  <Image
                    src="/images/modulo-practico-2/2.png"
                    alt="Patrones de vela esenciales"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                
                <p className="text-sm mb-3">Cuando estos patrones aparecen en un gráfico y cuando aparecen en niveles que coinciden con otros indicadores, tales como los niveles de retroceso de Fibonacci o las medias móviles, se crea una potencial oportunidad de compraventa.</p>
                
                {/* Imagen 3 después de la frase sobre patrones que coinciden con otros indicadores */}
                <div className="my-4 flex justify-center">
                  <Image
                    src="/images/modulo-practico-2/3.png"
                    alt="Patrones que coinciden con otros indicadores"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Sección C: Significado de los Diferentes Patrones de Velas */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">C) Significado de los Diferentes Patrones de Velas</h3>
              
              {/* Imagen 4 después del título de la sección C */}
              <div className="my-4 flex justify-center">
                <Image
                  src="/images/modulo-practico-2/4.png"
                  alt="Significado de los diferentes patrones de velas"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Estrella Doji Alcista</h4>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">¿Cómo Identificarla?</p>
                    <ul className="text-sm space-y-1">
                      <li>• El primer periodo es una larga vela roja</li>
                      <li>• El segundo periodo es una doji en dirección de la tendencia previa</li>
                      <li>• Las mechas de la doji no deberán ser largas</li>
                    </ul>
                    <p className="text-sm font-semibold mt-3">¿Qué Significa?</p>
                    <p className="text-sm">En una tendencia bajista, el mercado fortalece a los vendedores con un largo periodo rojo. Sin embargo, el segundo periodo fluctúa en un rango muy cerrado, y cierra en o muy cerca de su precio de apertura. Este escenario generalmente muestra una posible reversión, ya que muchas posiciones han cambiado. Una confirmación del cambio de tendencia sería una vela verde en el siguiente periodo de operación.</p>
                    
                    {/* Imagen 5 después de la frase sobre confirmación del cambio de tendencia */}
                    <div className="my-4 flex justify-center">
                      <Image
                        src="/images/modulo-practico-2/5.png"
                        alt="Confirmación del cambio de tendencia"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Envolvente Alcista</h4>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">¿Cómo Identificarla?</p>
                    <ul className="text-sm space-y-1">
                      <li>• El primer periodo es una vela roja</li>
                      <li>• El segundo periodo es una vela verde que envuelve completamente al cuerpo del primer periodo</li>
                    </ul>
                    <p className="text-sm font-semibold mt-3">¿Qué Significa?</p>
                    <p className="text-sm">En una tendencia bajista, la vela envolvente abre en el precio de cierre de la vela anterior o en un nuevo bajo y cierra a un precio igual o más alto que el precio de apertura del periodo anterior. Esto significa que la tendencia bajista perdió su impulso y que los compradores están ganando fuerza.</p>
                    
                    {/* Imagen 6 después de la frase sobre tendencia bajista perdió impulso */}
                    <div className="my-4 flex justify-center">
                      <Image
                        src="/images/modulo-practico-2/6.png"
                        alt="Tendencia bajista perdió impulso"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Martillo</h4>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">¿Cómo Identificarlo?</p>
                    <ul className="text-sm space-y-1">
                      <li>• Es un cuerpo pequeño</li>
                      <li>• La mecha inferior es por lo menos el doble que su cuerpo</li>
                      <li>• Nada o casi nada de mecha superior</li>
                    </ul>
                    <p className="text-sm font-semibold mt-3">¿Qué Significa?</p>
                    <p className="text-sm">Después de que el mercado abre en una tendencia bajista, ocurre una severa sobreventa. Sin embargo, al final del periodo de operaciones el mercado cierra en o cerca del precio más alto del periodo. Esto significa que el sentimiento bajista se está debilitando, especialmente si el cuerpo de la vela es verde. El cambio de tendencia puede ser confirmado si la siguiente vela cierra a un precio más alto que el de apertura.</p>
                    
                    {/* Imagen 7 después de la frase sobre cambio de tendencia confirmado */}
                    <div className="my-4 flex justify-center">
                      <Image
                        src="/images/modulo-practico-2/7.png"
                        alt="Cambio de tendencia confirmado"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Harami Alcista</h4>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">¿Cómo Identificarlo?</p>
                    <ul className="text-sm space-y-1">
                      <li>• Ocurre un largo periodo rojo</li>
                      <li>• El segundo, es un periodo verde que está completamente cubierto por el cuerpo del periodo anterior</li>
                    </ul>
                    <p className="text-sm font-semibold mt-3">¿Qué Significa?</p>
                    <p className="text-sm">Después de un largo periodo rojo al final de una tendencia bajista, una vela verde abre a un precio igual o más alto que el cierre del periodo anterior. La reversión de la tendencia será confirmada si la próxima vela es verde.</p>
                    
                    {/* Imagen 8 después de la frase sobre reversión de tendencia */}
                    <div className="my-4 flex justify-center">
                      <Image
                        src="/images/modulo-practico-2/8.png"
                        alt="Reversión de tendencia"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Estrella Doji Bajista</h4>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">¿Cómo Identificarla?</p>
                    <ul className="text-sm space-y-1">
                      <li>• El primer periodo es un largo periodo verde</li>
                      <li>• El segundo periodo es una doji en dirección de la tendencia previa</li>
                      <li>• Las mechas de la doji deberán ser cortas</li>
                    </ul>
                    <p className="text-sm font-semibold mt-3">¿Qué Significa?</p>
                    <p className="text-sm">En una tendencia alcista, el mercado se fortalece con un largo periodo verde. Sin embargo, las fluctuaciones del segundo periodo ocurren en un rango apretado y el precio cierra muy cerca de la apertura. Este escenario generalmente muestra la pérdida de confianza en la tendencia actual. La confirmación de esta tendencia sería una vela roja a continuación.</p>
                    
                    {/* Imagen 9 después de la frase sobre confirmación de tendencia */}
                    <div className="my-4 flex justify-center">
                      <Image
                        src="/images/modulo-practico-2/9.png"
                        alt="Confirmación de tendencia"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Envolvente Bajista</h4>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">¿Cómo Identificarla?</p>
                    <ul className="text-sm space-y-1">
                      <li>• Un periodo verde ocurre</li>
                      <li>• El segundo, es un periodo rojo que envuelve completamente al cuerpo de la vela anterior</li>
                    </ul>
                    <p className="text-sm font-semibold mt-3">¿Qué Significa?</p>
                    <p className="text-sm">En una tendencia alcista, la vela envolvente abre al precio de cierre del periodo anterior o en un nuevo alto, seguido por mucho volumen de venta, hasta cerrar a un precio igual o más bajo que el precio de apertura de la vela anterior. Esto significa que la tendencia alcista ha sido herida y que los vendedores podrían estar ganando fuerza.</p>
                    
                    {/* Imagen 10 después de la frase sobre tendencia alcista herida */}
                    <div className="my-4 flex justify-center">
                      <Image
                        src="/images/modulo-practico-2/10.png"
                        alt="Tendencia alcista herida"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Hombre Colgado</h4>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">¿Cómo Identificarlo?</p>
                    <ul className="text-sm space-y-1">
                      <li>• Un cuerpo pequeño al final de una tendencia alcista</li>
                      <li>• La mecha inferior es al menos dos veces el largo del cuerpo</li>
                      <li>• Nada o casi nada de mecha superior</li>
                    </ul>
                    <p className="text-sm font-semibold mt-3">¿Qué Significa?</p>
                    <p className="text-sm">Después de que el mercado abre en una tendencia alcista, ocurre una severa sobreventa. Sin embargo, al final del periodo el mercado cierra en o cerca del precio más alto del periodo. Esto significa un posible cambio de tendencia. Una vela roja a continuación, confirmaría el cambio de tendencia.</p>
                    
                    {/* Imagen 11 después de la frase sobre posible cambio de tendencia */}
                    <div className="my-4 flex justify-center">
                      <Image
                        src="/images/modulo-practico-2/11.png"
                        alt="Posible cambio de tendencia"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Estrella Fugaz</h4>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">¿Cómo Identificarla?</p>
                    <ul className="text-sm space-y-1">
                      <li>• Cuerpo pequeño al final de una tendencia alcista</li>
                      <li>• La mecha superior al menos tres veces más larga que el cuerpo</li>
                      <li>• Nada o casi nada de mecha inferior</li>
                    </ul>
                    <p className="text-sm font-semibold mt-3">¿Qué Significa?</p>
                    <p className="text-sm">El mercado logra un nuevo alto pero no puede sostenerlo y la vela cierra cerca de su punto más bajo. Esto significa un posible cambio de tendencia. Una vela roja a continuación, confirmaría el cambio de tendencia.</p>
                    
                    {/* Imagen 12 después de la frase sobre posible cambio de tendencia */}
                    <div className="my-4 flex justify-center">
                      <Image
                        src="/images/modulo-practico-2/12.png"
                        alt="Posible cambio de tendencia"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Estrella Diurna Alcista</h4>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">¿Cómo Identificarla?</p>
                    <ul className="text-sm space-y-1">
                      <li>• El primer periodo es una larga vela roja</li>
                      <li>• El segundo periodo es una vela amarilla de cuerpo pequeño</li>
                      <li>• La tercera es una vela verde</li>
                    </ul>
                    <p className="text-sm font-semibold mt-3">¿Qué Significa?</p>
                    <p className="text-sm">En una tendencia bajista, el mercado se fortalece con una larga vela roja, pero en el siguiente periodo los precios fluctúan en un rango apretado. Este escenario muestra un posible cambio de tendencia. La confirmación se dará con una vela verde.</p>
                    
                    {/* Imagen 13 después de la frase sobre confirmación con vela verde */}
                    <div className="my-4 flex justify-center">
                      <Image
                        src="/images/modulo-practico-2/13.png"
                        alt="Confirmación con vela verde"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Cobertura de Nube Negra Bajista</h4>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">¿Cómo Identificarla?</p>
                    <ul className="text-sm space-y-1">
                      <li>• El primero, es un largo periodo verde</li>
                      <li>• El segundo es una vela roja que abre a un precio igual o mayor que el cierre de la vela anterior y cierra por la mitad del cuerpo de la vela verde</li>
                    </ul>
                    <p className="text-sm font-semibold mt-3">¿Qué Significa?</p>
                    <p className="text-sm">En una tendencia alcista, la vela abre con fuerza pero pierde su impulso para cerrar a la mitad del cuerpo de la vela anterior. La Cobertura de Nube Negra sugiere una oportunidad para los vendedores.</p>
                    
                    {/* Imagen 14 después de la frase sobre Cobertura de Nube Negra */}
                    <div className="my-4 flex justify-center">
                      <Image
                        src="/images/modulo-practico-2/14.png"
                        alt="Cobertura de Nube Negra"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Estrella del Atardecer Bajista</h4>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">¿Cómo Identificarla?</p>
                    <ul className="text-sm space-y-1">
                      <li>• El primer periodo es una larga vela verde</li>
                      <li>• La segunda es una vela roja de cuerpo pequeño</li>
                      <li>• El tercer periodo es una vela roja un poco más grande que la anterior</li>
                    </ul>
                    <p className="text-sm font-semibold mt-3">¿Qué Significa?</p>
                    <p className="text-sm">En una tendencia alcista, el mercado se fortalece con una vela verde. Sin embargo, el segundo periodo cambia y cierra con una pequeña vela roja. Este escenario muestra la pérdida de confianza en la tendencia actual. La confirmación de este cambio de tendencia es una vela roja en el siguiente periodo.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección D: Trabajo Práctico */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">D) Trabajo Práctico - Realizar una Operación</h3>
              
              <div className="space-y-4">
                <p className="text-sm">Identifique un par de divisas cuyo gráfico demuestre una formación de velas identificada en la presente lección en base a su vela diaria más reciente. Es MUY IMPORTANTE que la vela se encuentre cerrada; uno de los errores más comunes que cometen los operadores es analizar una vela que aún se encuentra abierta.</p>
                <p className="text-sm">Determine si es un buen punto para ingresar o no, en base a qué tan cerca aparecen las líneas de soporte y de resistencia respecto del precio actual. Si usted encuentra una buena operación, utilice una orden de entrada o de mercado para ingresar una posición. Si no hay buenas oportunidades disponibles, díganos por qué decidió no realizar ninguna operación.</p>
              </div>
            </div>

            {/* Sección E: La Pregunta del Día */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">E) La Pregunta del Día</h3>
              
              <div className="space-y-4">
                <p className="text-sm">Esta pregunta es válida para todos los indicadores técnicos, no sólo para los patrones de vela, ¿cómo vería usted un patrón de velas en un gráfico por horas, en un gráfico diario, en comparación con un gráfico de 5 minutos? ¿Cuál sería el más válido y por qué? ¿Cómo afectaría su objetivo en términos de ganancia?</p>
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-sm text-gray-300"><strong>NOTA:</strong> La pregunta del día es una pregunta retórica, cuyo objetivo es ayudarle a revisar lo que acaba de aprender. NO es necesario enviarnos una respuesta, ya que estas preguntas no son evaluadas. Sin embargo, si tiene dudas, o si desea compartir sus ideas con nosotros, no dude en contactarnos.</p>
                </div>
              </div>
            </div>

            {/* Sección F: Prueba */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">F) Prueba</h3>
              
              <div className="space-y-4">
                <p className="text-sm">Prueba: Velas</p>
                <p className="text-sm">Por favor evalúe su conocimiento sobre lo aprendido en esta lección.</p>
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-sm text-gray-300">La prueba estará disponible próximamente para evaluar su comprensión de los patrones de velas.</p>
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

