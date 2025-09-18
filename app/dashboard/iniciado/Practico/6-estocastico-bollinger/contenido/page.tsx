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
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Módulo 6: Estocástico y Bandas de Bollinger</h2>

        <section className="mb-8">
          <div className="space-y-8">
            {/* Sección A: ¿Cómo operar con estocástico? */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">A) ¿Cómo operar con estocástico?</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">¿Qué significa estocástico?</h4>
                  <ul className="text-sm space-y-2 mb-3">
                    <li>• Estocástico es un oscilador que funciona bien en los mercados basados en límites de parámetros.</li>
                  </ul>

                  <h4 className="font-semibold text-[#ec4d58] mb-2">¿Qué hace?</h4>
                  <p className="text-sm mb-3">
                    El estocástico es un oscilador, es decir, ofrece una medición de la desviación de la tasa (precio) de un par de divisas de sus niveles normales. El estocástico, al igual que todos los osciladores, brinda indicios respecto de cuándo un par de divisas se encuentra en sobrecompra/sobreventa. Por lo tanto, funciona bien en los mercados que no tienen una tendencia determinada sino que fluctúan entre un nivel superior (resistencia) y un nivel inferior (soporte).
                  </p>

                  <h4 className="font-semibold text-[#ec4d58] mb-2">Parámetros:</h4>
                  <p className="text-sm mb-3">El estocástico generalmente tiene tres parámetros que deben especificar los usuarios: %K, %D, y el número de períodos. A continuación presentamos la configuración que se usa normalmente para estos parámetros:</p>
                  <ul className="text-sm space-y-2 mb-3">
                    <li>• 5 para %K</li>
                    <li>• 5 para %D</li>
                    <li>• 3 para el número de períodos</li>
                  </ul>

                  <h4 className="font-semibold text-[#ec4d58] mb-2">Diferentes Entradas:</h4>
                  <p className="text-sm mb-3">
                    El estocástico rápido sólo requiere dos entradas, que generalmente son 5 y 5. El estocástico lento requiere una tercer entrada, que consiste en el número de períodos utilizados al tomar una media móvil de la línea %D rápida. A diferencia del MACD (que generalmente utiliza 12, 26 y 9) o el RSI (que utiliza 14), el estocástico lento tiene un número de configuraciones populares que pueden utilizarse.
                  </p>
                  <p className="text-sm mb-3">
                    La configuración utilizada normalmente es 5, 3 y 8. La configuración 15, 3, 3 la utilizan los operadores conservadores que están interesados en recibir menor cantidad de señales, mientras que 8, 5, 5 y 5, 5, 3 son configuraciones más agresivas para aquellos operadores que buscan señales más rápidas. Las ventajas y desventajas entre la exactitud y la velocidad es algo que debe evaluar cada operador al elegir las entradas que utilizarán en el estocástico.
                  </p>
                  <p className="text-sm mb-3">
                    %K es la línea de movimiento rápido; mide la fuerza relativa del activo, como el RSI. %D es una media móvil de %K, y por lo tanto, es una línea mucho más lenta.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">¿Cómo utilizar el estocástico en la compraventa de divisas?</h4>
                  <ul className="text-sm space-y-2 mb-3">
                    <li>• Puede utilizarse para determinar niveles de sobrecompra/venta, como el RSI</li>
                    <li>• Puede utilizarse como un cruce similar a las medias móviles</li>
                    <li>• Puede utilizarse para descubrir las divergencias, que indican posible debilidad en las tendencias</li>
                  </ul>

                  <h4 className="font-semibold text-[#ec4d58] mb-2">Cruce:</h4>
                  <p className="text-sm mb-3">
                    Cuando %K corta a %D (Cuando la línea rápida cruza a la lenta), puede interpretarse como una oportunidad de entrar a una operación. Los operadores pueden ingresar posiciones siguiendo la dirección de %K.
                  </p>
                  <p className="text-sm mb-3">
                    Alternativamente, si está por debajo de 20, el activo está sobrevendido, y por lo tanto puede ser una gran oportunidad de compra, ya que el mercado basado en límites de parámetros implicaría que el par de divisas se dirigirá a un precio más "normal".
                  </p>

                  <h4 className="font-semibold text-[#ec4d58] mb-2">Sobrecompra/Sobreventa:</h4>
                  <p className="text-sm mb-3">
                    Esté atento a que tanto %K y %D estén por encima/debajo de los niveles de 20/80. Si ambos están por encima de 80, puede ser una buena oportunidad para vender, ya que el activo está sobrecomprado y se espera que vuelva a su nivel normal.
                  </p>

                  <h4 className="font-semibold text-[#ec4d58] mb-2">Divergencia:</h4>
                  <p className="text-sm mb-3">
                    El estocástico no puede utilizarse para determinar cuando NO debe entrar a una posición. Por ejemplo, si la tendencia parece fuerte, los operadores pueden observar el estocástico para ver si hay divergencia entre el movimiento del activo y las líneas estocásticas. Si, por ejemplo, un par de divisas se encuentra en una tendencia alcista abrupta y está alcanzando nuevos máximos, pero el estocástico no está alcanzando nuevos máximos o incluso está bajando, entonces esto implica que la tendencia es débil, y los precios pueden volver a bajar.
                  </p>
                  <p className="text-sm mb-3">
                    Los operadores conservadores pueden observar la divergencia como una forma de precaución para no entrar a una operación basándose en el momento, mientras que los operadores más agresivos pueden utilizar la divergencia como una señal para entrar a una posición antes de que la tendencia comience a retraerse.
                  </p>

                  <h4 className="font-semibold text-[#ec4d58] mb-2">Estocástico Lento Vs. Rápido:</h4>
                  <p className="text-sm mb-3">
                    Hay dos tipos de estocástico: el lento y el rápido. Ambos muestran las mismas dos líneas, y éstos pueden interpretarse de igual forma para los cruces, las condiciones de sobrecompra/sobreventa y la divergencia. La diferencia es la siguiente: la línea %D del estocástico lento se suaviza al sacar la media móvil de la línea %D del estocástico rápido. Esto hace que la señal que brinda el estocástico lento sea más precisa pero más lenta para reaccionar al cambio del precio del mercado.
                  </p>
                </div>
              </div>
            </div>

            {/* Sección B: Estocástico: Operaciones Históricas */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">B) Estocástico: Operaciones Históricas</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">
                  A continuación presentamos dos ejemplos de cómo pudo haberse utilizado el estocástico para colocar operaciones redituables. Observe que el primer gráfico utiliza cruces para las señales, mientras que el segundo gráfico utiliza divergencia. Como la divergencia no es un indicador preciso en términos de tiempo, puede utilizarse el doble techo como un punto de entrada.
                </p>
                
                {/* Imagen 1 después de la frase sobre ejemplos de operaciones */}
                <div className="my-4 flex justify-center">
                  <Image
                    src="/imagenes%20modulo%20practico%20%234/1.png"
                    alt="Ejemplos de operaciones con estocástico"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Sección C: Estocástico: La Pregunta del Día */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">C) Estocástico: La Pregunta del Día</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">
                  El estocástico indica cuándo comprar o vender cuando las dos líneas cruzan por arriba de 80 o por debajo de 20.
                </p>
                <p className="text-sm mb-3">
                  ¿Cómo consideraría a un cruce que tiene lugar dentro de este canal? ¿Considera que es lo suficientemente importante como para basar una operación en el mismo? Recuerde lo que muestra el indicador aquí, cuando la línea rápida corta a la lenta, y no dude en observar el estocástico en la cantidad de gráficos que sean necesarios antes de tomar una decisión.
                </p>
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    <strong>NOTA:</strong> La pregunta del día es una pregunta retórica, cuyo objetivo es ayudarle a revisar lo que acaba de aprender. NO es necesario enviarnos una respuesta, ya que estas preguntas no son evaluadas. Sin embargo, si tiene dudas, o si desea compartir sus ideas con nosotros, no dude en contactarnos por email a Cursos@fxcmchile.cl
                  </p>
                </div>
              </div>
            </div>

            {/* Sección D: Prueba Estocástico */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">D) Prueba Estocástico</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">
                  Por favor evalúe su conocimiento sobre lo aprendido en esta lección. Acceda la prueba haciendo clic sobre el siguiente enlace:
                </p>
                <a 
                  href="http://www.cursosforex.cl/viewtopic.php?f=5&t=8&sid=1aedce756ccba5161b2d838a22cd9d1b" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-[#ec4d58] hover:bg-[#d63d47] text-white font-semibold rounded-lg transition-colors"
                >
                  <span>Acceder a la Prueba</span>
                </a>
              </div>
            </div>

            {/* Sección E: Las Bandas de Bollinger */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">E) Las Bandas de Bollinger</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">¿En qué consisten las bandas de Bollinger?</h4>
                  <p className="text-sm mb-3">
                    Excelente indicador del mercado en rango que mide la desviación estándar de una media móvil.
                  </p>
                  <p className="text-sm mb-3">
                    Desarrollado por John Bollinger, las bandas de Bollinger consisten en tres líneas:
                  </p>
                  <ul className="text-sm space-y-2 mb-3">
                    <li>• Una media móvil, que generalmente no está incluida en la mayoría de los paquetes de gráficos</li>
                    <li>• Banda superior con dos desviaciones estándar por encima de la media móvil</li>
                    <li>• Banda inferior con dos desviaciones estándar por debajo de la media móvil</li>
                  </ul>

                  <p className="text-sm mb-3">
                    Las bandas de Bollinger es un indicador excelente de mercados en rango. Es decir que funcionan mejor cuando el mercado no tiene una tendencia fuerte, pero mas bien fluctúan entre una barrera superior (resistencia) y una barrera inferior (soporte). Las bandas de Bollinger funcionan conforme a la lógica de que el precio del par de una divisa seguramente gravitará alrededor del promedio, y por lo tanto cuando se aparta demasiado lejos – como por ejemplo dos desviaciones estándar – el precio retrocederá hacia su media móvil.
                  </p>

                  <h4 className="font-semibold text-[#ec4d58] mb-2">Parámetros:</h4>
                  <p className="text-sm mb-3">Desviación estándar de 2; media móvil de 20 (generalmente se omite).</p>

                  <h4 className="font-semibold text-[#ec4d58] mb-2">¿Cómo pueden utilizarse?</h4>
                  
                  <h5 className="font-semibold text-[#ec4d58] mb-2">Mercado en Rango</h5>
                  <p className="text-sm mb-3">
                    La compraventa de divisas en los mercados en rango es bastante sencilla, fundamentalmente implica la venta en la banda superior y la compra en la banda inferior. Observe cómo las bandas se encuentran casi en posición horizontal cuando el mercado se encuentra en un rango determinado. Aquí es cuando los cambios de tendencia son más efectivos.
                  </p>

                  <h5 className="font-semibold text-[#ec4d58] mb-2">Ruptura de la Volatilidad</h5>
                  <p className="text-sm mb-3">
                    Cuando las bandas de Bollinger se estrechan (es decir, se tornan más angostas), significa que la volatilidad está disminuyendo, y que el par está operando en un rango más angosto. Generalmente, la volatilidad se estrecha justo antes de que se produzca una gran ruptura en el mercado.
                  </p>
                  <p className="text-sm mb-3">
                    Por lo tanto, al estrecharse la volatilidad (simbolizado mediante las Bandas angostas de Bollinger) es una señal para los operadores de que el mercado puede estar listo para que se produzca una gran ruptura.
                  </p>
                  <p className="text-sm mb-3">
                    El gráfico que aparece arriba muestra que las bandas se han estrechado hasta un rango muy angosto, precediendo una ruptura. Cuando las bandas comienzan a ensancharse, es señal para entrar en la dirección en la que se está moviendo el precio.
                  </p>
                  <p className="text-sm mb-3">
                    Por lo tanto, tal como lo muestra el gráfico, si el precio se encuentra en las bandas superiores y las bandas comienzan a ensancharse, es señal de entrar a una posición larga.
                  </p>
                </div>
              </div>
            </div>

            {/* Sección F: Las Bandas de Bollinger: Operaciones Históricas */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">F) Las Bandas de Bollinger: Operaciones Históricas</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">
                  A continuación se presentan dos gráficos que demuestran cómo pueden utilizar los operadores las Bandas de Bollinger para participar en forma activa en los mercados basados en límites de parámetros. Observe la importancia de las velas para validar el cambio de la tendencia.
                </p>
                <p className="text-sm mb-3">
                  Cuando la vela alcanza la Banda inferior de Bollinger en este gráfico de un día de GBP/USD, inmediatamente observamos un ascenso a la banda superior. También observamos una caída en la banda inferior cuando la formación Estrella del Atardecer tiene lugar en la banda superior.
                </p>
                <p className="text-sm mb-3">
                  La Estrella del Amanecer en la banda inferior de este gráfico de USD/CHF precede un cambio en el movimiento del precio a la banda superior. Luego, cuando el precio alcanza la banda superior, la Estrella del Atardecer y el Martillo Invertido preceden el retorno a la banda inferior.
                </p>
                
                {/* Imagen 2 después de la frase sobre operaciones históricas */}
                <div className="my-4 flex justify-center">
                  <Image
                    src="/imagenes%20modulo%20practico%20%234/2.png"
                    alt="Operaciones históricas con Bandas de Bollinger"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Sección G: Trabajo Práctico sobre las Bandas de Bollinger */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">G) Trabajo Práctico sobre las Bandas de Bollinger: Colocación de una Operación</h3>
              
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <p className="font-semibold mb-2">TRABAJO PRÁCTICO:</p>
                <p className="text-sm mb-2">
                  Coloque una operación basada en el indicador de las Bandas de Bollinger. Coméntenos por correo electrónico su operación y por qué la realizó. Si lo desea, no dude en enviarnos una imagen del gráfico que usted está viendo como ayuda para transmitirnos por qué realizó esa operación.
                </p>
              </div>
            </div>

            {/* Sección H: Prueba Las Bandas de Bollinger */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">H) Prueba Las Bandas de Bollinger</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">
                  Por favor, evalúe el conocimiento que aprendió en esta lección. Acceda la prueba haciendo clic sobre el siguiente enlace:
                </p>
                <a 
                  href="http://www.cursosforex.cl/viewtopic.php?f=5&t=8&sid=1aedce756ccba5161b2d838a22cd9d1b" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-[#ec4d58] hover:bg-[#d63d47] text-white font-semibold rounded-lg transition-colors"
                >
                  <span>Acceder a la Prueba</span>
                </a>
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