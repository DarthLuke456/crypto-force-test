import React from 'react';
import BackButton from '@/components/ui/BackButton';
import Image from 'next/image';

export default function ModuloPractico9GestionRiesgoContenido() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-2 sm:px-8 py-8 max-w-3xl mx-auto">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 pt-12 relative">
        {/* Boton Volver en la esquina superior izquierda */}
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#ec4d58] mb-2 text-center">Curso Practico de Trading</h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Lección 8: Gestión de Riesgo</h2>

        <section className="mb-8">
          <div className="space-y-8">
            {/* Seccion A: ¿Por qué la mayoría de los operadores pierden dinero? */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">A) ¿Por qué la mayoría de los operadores pierden dinero?</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">El hecho es que la mayoría de los operadores, más allá de cuan inteligentes y entendidos sean en los mercados, pierden dinero. ¿Cuál puede ser la causa de ello? ¿Los mercados son realmente tan enigmáticos que pocos se benefician o existe una serie de errores comunes que cometen muchos operadores? La respuesta es ésta última y la buena noticia es que el problema, mientras que plantea un desafío emocional y psicológico, puede resolverse utilizando sólidas técnicas de administración del dinero.</p>
                
                <p className="text-sm mb-3">La mayoría de los operadores pierden dinero simplemente porque no comprenden o se adhieren a las buenas prácticas de la administración del dinero. Parte de la administración del dinero se trata esencialmente de determinar el riesgo que usted asume antes de realizar una operación. Sin conocimiento sobre la administración del dinero, la mayoría de los operadores se mantienen en posiciones de pérdida durante demasiado tiempo y obtienen ganancias en las posiciones favorables en forma prematura.</p>
                
                <p className="text-sm mb-3">Esto resulta en un escenario aparentemente paradójico, que en realidad es demasiado común: el operador termina cerrando más operaciones de ganancias que de pérdida, aunque de todas maneras pierde dinero.</p>
                
                <div className="bg-[#1a1a1a] rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Prácticas Claves sobre la Administración del Dinero</h4>
                  <ul className="text-sm space-y-2">
                    <li><strong>• Relación Riesgo-Recompensa:</strong> los operadores deberían establecer una relación riesgo-recompensa para cada operación que quieren realizar. En otras palabras, deberían saber cuánto están dispuestos a perder y cuánto están intentando ganar. En general, la relación riesgo-recompensa debería ser de 1:2, si no más. Esto significa que el riesgo debería equivaler a no más que la mitad de la potencial recompensa.</li>
                    <li><strong>• Órdenes "Stop-Loss":</strong> los operadores deberían también utilizar las órdenes "stop-loss" como una manera de especificar la pérdida máxima que están dispuestos a aceptar. Mediante el uso de estas órdenes "stop-loss", los operadores pueden evitar el escenario corriente, en el que tienen la mayoría de las operaciones de ganancias, pero una única pérdida lo suficientemente grande como para eliminar cualquier rastro de rentabilidad en la cuenta.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Seccion B: El uso de Órdenes "Stop-Loss" para Administrar el Riesgo */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">B) El uso de Órdenes "Stop-Loss" para Administrar el Riesgo</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">Debido a la importancia de la administración del dinero para lograr una operación exitosa a largo plazo, el uso de las órdenes "stop-loss" es imperativo para cualquier operador que desee tener éxito en el mercado de divisas. Las órdenes "stop-loss" les permiten a los operadores especificar la pérdida máxima que están dispuestos a aceptar en una operación determinada.</p>
                
                <p className="text-sm mb-3">Si el mercado alcanza el índice que el operador hubiera especificado en su orden "stop-loss", la operación se cerrará inmediatamente. Como resultado, el uso de las órdenes "stop-loss" le permiten cuantificar el riesgo que usted corre cada vez que ingresa a una operación.</p>
                
                <p className="text-sm mb-3">Existen dos pasos para usar en forma exitosa las órdenes "stop-loss": 1) Establecer la salida o "stop" en un nivel razonable y 2) Hacer un seguimiento de la salida, es decir, trasladarla hacia adelante en dirección a la rentabilidad a medida que avanza la operación favorablemente.</p>
                
                <div className="bg-[#1a1a1a] rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Colocar las Órdenes "Stop-Loss"</h4>
                  <p className="text-sm mb-3">Aquí hay dos maneras recomendadas para colocar y hacer un seguimiento de una orden "stop-loss":</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-semibold text-[#ec4d58] mb-1">• Un mínimo de dos días:</h5>
                      <p className="text-sm">Esta técnica implica colocar su orden "stop-loss" aproximadamente 10 pips por debajo de un mínimo de 2 días del par. La idea que avala esta técnica es que el precio se quiebra ante nuevos mínimos, el operador no quiere mantener la posición. Por ejemplo, si la caída en la vela más reciente sobre EUR/USD fuera de 1,2900 y la caída de la vela anterior fue de 1,2800, la salida debería entonces ubicarse alrededor de los 1,2790, 10 puntos debajo de la baja de dos días, si un operador deseara ingresar.</p>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-[#ec4d58] mb-1">• Indicador Parabólico (SAR):</h5>
                      <p className="text-sm mb-3">Un tipo de salida en base a la volatilidad es la del SAR, un indicador que se encuentra en muchas aplicaciones para realizar gráficos sobre la compraventa de divisas. El SAR es un indicador en base a la volatilidad que en forma gráfica muestra un pequeño punto en un lugar del gráfico donde se debe establecer la salida.</p>
                      <p className="text-sm mb-3">A continuación, consta un ejemplo de un gráfico que utiliza el SAR.</p>
                      
                      <div className="flex justify-center my-4">
                                                  <Image
                            src="/imagenes%20modulo%20practico%20%239/1.jpg"
                            alt="Ejemplo de gráfico con Parabolic SAR"
                            width={600}
                            height={400}
                            className="rounded-lg shadow-lg"
                          />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seccion C: Distintos Estilos para Operar */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">C) Distintos Estilos para Operar</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">No hay una definición precisa, sin embargo, se considera que los siguientes son los estilos de compraventa más corrientes:</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-[#ec4d58] mb-2">Operadores Intradía:</h4>
                    <p className="text-sm">Generalmente toman posiciones que duran entre algunos minutos a algunas horas, a menudo los operadores intradía no mantienen sus posturas de un día al otro. Usualmente también utilizarán gráficos de muy corto plazo, como gráficos de 15 minutos.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#ec4d58] mb-2">Operadores de Corto Plazo (Swing Trader):</h4>
                    <p className="text-sm">Toman una postura por algunas horas que puede durar algunos días, incluso una semana o dos. Pueden utilizar gráficos de 1 hora o más para hacerlo.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#ec4d58] mb-2">Operadores de Posición:</h4>
                    <p className="text-sm">En general mantienen sus posiciones para un período incluso más largo que el de los operadores de corto plazo y ello puede durar algunas semanas o algunos meses.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#ec4d58] mb-2">Carry Trade:</h4>
                    <p className="text-sm">Es una operación que se basa en la diferencia entre las tasas de interés (poner al descubierto las divisas de menor rentabilidad para obtener retornos en una moneda de mayor rentabilidad) y puede durar algunos años o más.</p>
                  </div>
                </div>
                
                <p className="text-sm mb-3">Cuanto más largo sea el período que considera el operador, más largo serán los períodos de tiempo utilizados en los gráficos. En general, son populares los gráficos diarios, semanales e incluso mensuales.</p>
              </div>
            </div>

            {/* Seccion D: Claves Útiles para Operar */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">D) Claves Útiles para Operar</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">¿Cuándo aumentar/disminuir el tamaño de una posición?</h4>
                  <p className="text-sm mb-3">Cada vez que un operador atraviesa un período difícil, la primera reacción debería ser la de disminuir el tamaño de la operación. Por ejemplo, cambiar una operación de 5 lotes a la vez por una de 2 lotes a la vez.</p>
                  <p className="text-sm mb-3">Desafortunadamente, muchos operadores intentan recuperar sus pérdidas aumentando el tamaño de sus operaciones. Ello casi nunca funciona debido a que es una decisión que se basa más en la emoción que en la razón. El momento para elevar el tamaño es cuando todo está resultando bien; ese es el mejor momento para que un operador sea agresivo.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">¿Cómo quitar la emoción de sus operaciones?</h4>
                  <p className="text-sm mb-3">La mejor manera para quitar la emoción de sus operaciones es planear por anticipado tanto la operación como antes de ingresar. Muchos operadores se concentran en lo que sucede después de que ellos ingresan a la operación, pero los movimientos del precio no son de su control. Lo que el operador puede controlar es el planeamiento de dónde ingresar, en qué lugar detenerse o establecer límites y la determinación por anticipado sobre qué hacer en caso de que aconteciera una situación determinada.</p>
                  <p className="text-sm mb-3">Como norma general, cualquier momento en el que usted sienta que sus emociones le están demandando demasiado de sí mismo, es la oportunidad para dar un paso al costado de la operación, para evitar tomar decisiones apresuradas.</p>
                </div>
              </div>
            </div>

            {/* Seccion E: Trabajo Práctico – Colocación de una Operación */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">E) Trabajo Práctico – Colocación de una Operación</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3"><strong>TRABAJO PRÁCTICO:</strong> utilizando la cuenta demo, realice una operación que incluya una orden "stop-loss", aplicando las tácticas discutidas en la presente lección. Coméntenos por e-mail su operación y por qué la realizó. Si lo desea, no dude en enviarnos una imagen del gráfico que usted está viendo como ayuda para transmitirnos por qué realizó esa operación.</p>
              </div>
            </div>

            {/* Seccion F: La pregunta del Día */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">F) La pregunta del Día</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">Además del mínimo de dos días y el SAR y las técnicas stop-loss, según su criterio ¿cuáles otros métodos para determinar los niveles stop-loss resultan razonables?</p>
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-sm text-gray-300"><strong>NOTA:</strong> la pregunta del día es una pregunta retórica, cuyo objetivo es ayudarle a revisar lo que acaba de aprender. NO es necesario enviarnos una respuesta, ya que estas preguntas no son evaluadas.</p>
                </div>
              </div>
            </div>

            {/* Seccion G: La Psicología del Buen Operador */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">G) La Psicología del Buen Operador</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Sepa Cuando Tomarse un Descanso</h4>
                  <p className="text-sm mb-3">Ser un buen operador implica más que sólo contar con la capacidad de analizar el mercado técnica y/o fundamentalmente. Uno de los elementos más importantes pero que se pasa por alto respecto de las operaciones exitosas es el de mantener una perspectiva psicológica saludable. A fin de cuentas, un operador que no es capaz de tratar con el estrés de las fluctuaciones del mercado no pasará la prueba del tiempo, sin importar qué tan capaz sea en cuanto a los elementos más específicos de operar.</p>
                  <p className="text-sm mb-3">Si estuviera atravesando una mala racha, considere la posibilidad de retirarse momentáneamente de las operaciones para evitar que el temor y la ambición dominen su estrategia.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Desapego Emocional</h4>
                  <p className="text-sm mb-3">Uno de los atributos principales del buen operador es el contar con desapego emocional: mientras que son dedicados y se encuentran plenamente involucrados en sus operaciones, no se casan emocionalmente con ellas; aceptan perder y toman sus decisiones de inversiones a nivel mental.</p>
                  <p className="text-sm mb-3">Los operadores que se involucran emocionalmente con una operación a menudo cometen errores sustanciales dado que tienden a modificar su estrategia inusualmente después de algunas operaciones en pérdida o se vuelven demasiado descuidados después de algunas operaciones de ganancia. Un buen operador debe ser equilibrado emocionalmente y debe basar todas sus decisiones de operaciones en la estrategia, no en el miedo o la ambición.</p>
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






