import React from 'react';
import BackButton from '@/components/ui/BackButton';
import Image from 'next/image';

export default function ModuloPractico4Contenido() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-2 sm:px-8 py-8 max-w-3xl mx-auto">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 pt-12 relative">
        {/* Botón Volver en la esquina superior izquierda */}
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-[#ec4d58] mb-2 text-center">Curso Práctico de Trading</h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Lección 3: Líneas de Fibonacci y Medias Móviles</h2>

        <section className="mb-8">
          <div className="space-y-8">
            {/* Sección A: ¿En qué consisten los retrocesos de Fibonacci? */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">A) ¿En qué consisten los retrocesos de Fibonacci?</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Retrocesos de Fibonacci</h4>
                  <p className="text-sm mb-3">¿En qué consisten los retrocesos de Fibonacci?</p>
                  <ul className="text-sm space-y-2 mb-3">
                    <li>• Niveles en los que se espera que se produzca un retroceso en el mercado después de una fuerte tendencia.</li>
                  </ul>
                  <p className="text-sm mb-3">Basado en números matemáticos que se repiten en todas las condiciones, los retrocesos de Fibonacci tienen por objeto calcular los retrocesos que posiblemente realizará un par de divisas dentro de un rango. Los números clave en la compraventa de divisas son: 38,2%, 50% y 61,8%.</p>
                  <p className="text-sm mb-3">Observe el siguiente ejemplo para entender cómo funcionan los retrocesos de Fibonacci:</p>
                  <p className="text-sm mb-3">Imagínese que un activo se encuentra en una tendencia alcista, asciende desde 0 a 1.000. Después de que el activo alcanza los 1.000, ¿cuánto será el retroceso, es decir, cuánto caerá, antes de reanudar con su tendencia alcista? Utilizando los números de Fibonacci podemos descubrir cuánto será el retroceso que debemos esperar después de que la tendencia alcance el "límite" superior.</p>
                  <p className="text-sm mb-3">Por lo tanto, matemáticamente funciona así:</p>
                  
                  <div className="bg-[#1a1a1a] rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold mb-2">• La línea del 38,2%:</p>
                    <p className="text-sm mb-2">Calcula el 38,2% del tamaño del movimiento significativo del precio. El tamaño del movimiento significativo del precio en este caso es (1,000) menos el límite inferior (0). En este caso, el tamaño del movimiento significativo del precio es 1.000 pips. 0,382 x 1000 = 382 pips. Se espera que el activo retroceda 382 puntos desde su pico. Asumiendo que el activo aumenta de 0 a 1.000, retrocedería 382 pips de 1.000. 1.000 – 382 = 618. Por lo tanto, este es un nivel clave en el que hay que estar atento; usted querrá comprar en este nivel (618) ya que se espera que la tendencia alcista comience nuevamente después de alcanzar este nivel de retroceso.</p>
                  </div>
                  
                  <div className="bg-[#1a1a1a] rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold mb-2">• La línea del 50,0%:</p>
                    <p className="text-sm mb-2">Misma situación; el 50% del movimiento significativo del precio (1.000 pips) es 500. Réstelo del límite superior (1.000) ya que es una tendencia alcista. 1.000 – 500 = 500. Esté atento a la tendencia alcista que comenzará nuevamente en ese punto.</p>
                  </div>
                  
                  <div className="bg-[#1a1a1a] rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold mb-2">• La línea del 61,8%:</p>
                    <p className="text-sm mb-2">El 61,8% del movimiento significativo del precio es 618. 1.000 – 618 = 382. Si el activo retrocede hasta este punto, se considera que es una oportunidad de compra.</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Tendencias Bajistas</h4>
                  <p className="text-sm mb-3">Si el activo tuviera una tendencia bajista, es decir que baja desde 1.000 a 0, entonces usted usaría los números de Fibonacci para calcular el retroceso en relación a cuánto podría subir el precio antes de reanudar nuevamente con la tendencia bajista. Usted calcularía los retrocesos de Fibonacci de la misma manera, excepto que comenzaría en el punto más alto del movimiento significativo del precio hacia el punto más bajo del movimiento.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Otros Niveles</h4>
                  <p className="text-sm mb-3">Por favor recuerde que existen otros niveles de retrocesos en los estudios de Fibonacci pero no son utilizados ampliamente en el mercado. Entre ellos encontramos extensiones de 21,4% y 78,6% así como también 127,2% y 161,8%. La mayoría de los paquetes gráficos ni siquiera hacen referencia a estos niveles y la mayoría de los operadores alegarían que si el mercado retrocede el 100% de un movimiento anterior, la tendencia original ya no es válida. Otros estudios de Fibonacci llamados abanicos y arcos son matemáticamente complicados y por lo tanto ignorados por la mayoría de los operadores.</p>
                  
                  <div className="bg-[#1a1a1a] rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold mb-2">Parámetros:</p>
                    <p className="text-sm mb-2">38,2%, 50,0%, y 61,8% son los niveles de Fibonacci más comunes. Se considera que el nivel de 38,2% es el menos significativo de los tres niveles principales de Fibonacci. A mayor línea de porcentaje (es decir, 61,8%) mayor será la probabilidad de que el precio encuentre soporte.</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Concepto Clave: Busque la confirmación</h4>
                  <p className="text-sm mb-3">• Los operadores deberían ingresar cuando obtienen la confirmación (por ejemplo, los patrones de vela clave) en los niveles de Fibonacci. Los operadores también pueden obtener la confirmación utilizando una variedad de otros indicadores, tal como veremos en el transcurso del curso.</p>
                </div>
              </div>
            </div>

            {/* Sección B: Cómo Dibujar las Líneas de Fibonacci */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">B) Cómo Dibujar las Líneas de Fibonacci</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Los Retrocesos de Fibonacci: ¿Cómo Dibujarlos?</h4>
                  <p className="text-sm mb-3">Es fácil dibujar las líneas de Fibonacci. Puede dividirse en tres pasos sencillos:</p>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold mb-2">1. Identifique el punto más bajo y más alto de la tendencia.</p>
                      <p className="text-sm mb-3">Al punto más bajo se lo denomina soporte y al punto más alto, resistencia. Si bien son subjetivos, los niveles de soporte y resistencia pueden determinarse fácilmente mirando simplemente el gráfico.</p>
                      
                      {/* Imagen 1 después de la frase sobre niveles subjetivos */}
                      <div className="my-4 flex justify-center">
                        <Image
                          src="/imagenes%20modulo%20practico%20%233/1.png"
                          alt="Niveles de soporte y resistencia"
                          width={600}
                          height={400}
                          className="rounded-lg shadow-lg"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold mb-2">2. Utilizando el paquete de gráficos que a usted más le guste, trace las líneas de Fibonacci desde el nivel de soporte hacia el nivel de resistencia.</p>
                      <p className="text-sm mb-3">Deberían aparecer las tres líneas: Una en el 38,2% de la diferencia desde el punto máximo al mínimo; otra en el 50% y otra en el 61,8%. Estos son los niveles de Fibonacci claves en base a los cuales usted debería buscar oportunidades potenciales para ingresar operaciones.</p>
                      
                      {/* Imagen 2 después de la frase sobre niveles de Fibonacci claves */}
                      <div className="my-4 flex justify-center">
                        <Image
                          src="/imagenes%20modulo%20practico%20%233/2.png"
                          alt="Niveles de Fibonacci claves"
                          width={600}
                          height={400}
                          className="rounded-lg shadow-lg"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold mb-2">3. Después de eso, simplemente observe el comportamiento del precio para confirmar la oportunidad de ingresar una operación.</p>
                      
                      {/* Imagen 3 después de la frase sobre observar el comportamiento del precio */}
                      <div className="my-4 flex justify-center">
                        <Image
                          src="/imagenes%20modulo%20practico%20%233/3.png"
                          alt="Observar comportamiento del precio"
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

            {/* Sección C: Los Retrocesos de Fibonacci: Operaciones Históricas */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">C) Los Retrocesos de Fibonacci: Operaciones Históricas</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Los Retrocesos de Fibonacci: Operaciones Históricas</h4>
                  <p className="text-sm mb-3">A continuación presentamos dos ejemplos de cómo los retrocesos de Fibonacci, cuando se les utiliza junto con los patrones de vela, pueden ser indicadores útiles para sugerir cuándo retrocederá una tendencia. Observe cómo funcionan los retrocesos de Fibonacci tanto en los mercados alcistas como bajistas.</p>
                  
                  {/* Imagen 4 después de la frase sobre funcionamiento en diferentes mercados */}
                  <div className="my-4 flex justify-center">
                    <Image
                      src="/imagenes%20modulo%20practico%20%233/4.png"
                      alt="Funcionamiento en mercados alcistas y bajistas"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Una Mirada a una Mala Operación Fibonacci</h4>
                  <p className="text-sm mb-3">A fin de aprender la mejor manera de utilizar los retrocesos de Fibonacci al operar en el mercado de divisas, vale la pena evaluar los ejemplos de las operaciones que no se utilizaron correctamente.</p>
                  <p className="text-sm mb-3">El siguiente ejemplo muestra cómo la impaciencia puede llevar a un operador a entrar en el mercado sin justificación alguna.</p>
                  <p className="text-sm mb-3">En el cuadro que aparece abajo, observe cómo el precio casi toca el nivel de Fibonacci (por 13 pips) pero no lo rompe. Aunque muchos operadores pueden considerar esto un signo positivo (pueden pensar que el nivel era tan fuerte que los operadores no esperaron hasta que tocara el nivel de Fibonacci) lo ideal es ver que se rompe el nivel. Esto se debe a que los operadores que compran o venden divisas cuando el par de divisas rompe el nivel de soporte ("breakout traders") pueden ingresar al mercado pensando que el precio caerá aún más, incluso más bajo que el nivel de Fibonacci. Cuando el mercado retrocede y vuelve sobre una tendencia, estos operadores en corto ahora tendrán que cubrir sus operaciones con pérdidas. Los operadores en corto que necesitan cubrir sus posiciones se sumarán a la presión de compra, por lo tanto aumentando la probabilidad del resultado de la operación a su favor.</p>
                  
                  {/* Imagen 5 después de la frase sobre presión de compra */}
                  <div className="my-4 flex justify-center">
                    <Image
                      src="/imagenes%20modulo%20practico%20%233/5.png"
                      alt="Presión de compra y venta"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección D: Trabajo Práctico */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">D) Trabajo Práctico</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3"><strong>TRABAJO PRÁCTICO:</strong> utilizando la aplicación de gráficos que desee, trace las líneas de retroceso de Fibonacci en gráficos para los diferentes pares de divisas a los que accede desde su plataforma de operaciones. Luego, una vez analizados los gráficos, busque oportunidades de compraventa en base a los retrocesos de Fibonacci. Responda informándonos qué operación colocó y por qué la colocó.</p>
                <p className="text-sm mb-3">En este caso, la operación podría ser una orden de entrada que está esperando a que el precio retroceda a un nivel de Fibonacci determinado. No dude en cargar la imagen del gráfico que estaba observando. De ser posible, trate de concentrarse en un período de tiempo más prolongado, como un gráfico diario. Puede utilizar situaciones actuales o pasadas.</p>
              </div>
            </div>

            {/* Sección E: La pregunta del día */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">E) La pregunta del día</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">Muchos operadores consideran que los niveles de Fibonacci sólo son importantes porque los niveles son altamente publicitados y otros operadores tienen conocimiento de los mismos. Esta profecía autocumplida tiene el efecto de hacer significativos a estos niveles porque muchos operadores los consideran niveles importantes.</p>
                <p className="text-sm mb-3">Si esto fuera verdad, ¿cuál es el peligro de utilizar los niveles de retroceso de Fibonacci para un movimiento pequeño que tiene lugar en un gráfico de 1 hora o en un período de tiempo aún menor?</p>
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-sm text-gray-300"><strong>NOTA:</strong> La pregunta del día es una pregunta retórica, cuyo objetivo es ayudarle a revisar lo que acaba de aprender. NO es necesario enviarnos una respuesta, ya que estas preguntas no son evaluadas.</p>
                </div>
              </div>
            </div>



            {/* Sección G: Utilizando las Medias Móviles */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">G) Utilizando las Medias Móviles</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Utilizando las Medias Móviles</h4>
                  <p className="text-sm mb-3"><strong>¿En qué consisten las medias móviles?</strong></p>
                  <p className="text-sm mb-3">Las medias móviles simplemente miden el precio o tipo de cambio promedio de un par de divisas específico en un determinado período de tiempo. Por ejemplo, si tomamos los precios de cierre de los últimos 10 días, los sumamos y dividimos el resultado por 10, hemos creado una medía móvil simple (SMA, por sus siglas en inglés) de 10 días.</p>
                  
                  <div className="bg-[#1a1a1a] rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold mb-2">Parámetros:</p>
                    <p className="text-sm mb-2">Los períodos de tiempo más comunes para las medias móviles son períodos de 10, 20, 50, y 200 en un gráfico diario. Como siempre, cuanto más largo es el período de tiempo, más confiable es el estudio. Sin embargo, las medias móviles de períodos más cortos reaccionarán más rápido a los movimientos del mercado y brindarán rápidamente señales de compraventa.</p>
                  </div>
                  
                  <p className="text-sm mb-3">También existen las medias móviles exponenciales (EMA, por sus siglas en inglés). Funcionan de la misma manera que las medias móviles simples salvo que dan más importancia a los precios de cierre más recientes. Las matemáticas de una media móvil exponencial son complejas, pero afortunadamente la mayoría de los paquetes de gráficos las calculan automática e instantáneamente.</p>
                  
                  {/* Imagen 6 después de la frase sobre medias móviles de períodos cortos */}
                  <div className="my-4 flex justify-center">
                    <Image
                      src="/imagenes%20modulo%20practico%20%233/6.png"
                      alt="Medias móviles de períodos cortos"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">¿Cómo utilizar las medias móviles en la compraventa de divisas?</h4>
                  <ul className="text-sm space-y-2 mb-3">
                    <li>• Ingrese cuando una tendencia fuerte retroceda hacia la línea de una media móvil</li>
                    <li>• Ingrese en el cruce de una media móvil</li>
                  </ul>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold mb-2">Evalúe la Tendencia Global:</p>
                      <p className="text-sm mb-3">Las medias móviles muestran una línea tenue de la tendencia general. Cuanto más largo sea el período de la media móvil, más tenue será la línea. A fin de evaluar la fuerza de una tendencia en el mercado, trace la SMA de los días 10, 20, 50 y 200. En una tendencia alcista, las medias móviles más cortas deberían estar por encima de las más largas, y el precio actual debería estar por encima de la SMA de 10 días. La inclinación del operador en este caso debería ser operar al alza, buscando oportunidades de compra cuando el precio se mueve hacia abajo en vez de tomar una posición en corto.</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold mb-2">Confirmación del Comportamiento del Precio:</p>
                      <p className="text-sm mb-3">Como siempre, los operadores deben observar los patrones de vela y otros indicadores para descubrir lo que realmente está sucediendo en el mercado en ese momento. El gráfico que aparece anteriormente muestra el patrón envolvente alcista que tiene lugar cuando la divisa rebota en la EMA de 20 días. Tocar la EMA de 20 días, junto con el patrón de velas, sugieren una tendencia alcista. Los operadores deben entrar una vez que la vela envolvente alcista es blanca.</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold mb-2">Cruces:</p>
                      <p className="text-sm mb-3">Cuando una media móvil más corta cruza una más larga (es decir, si la EMA de 20 días cruza por debajo de la EMA de 200 días) es considerado por muchos como un indicador de que el par se moverá en dirección a la media móvil más corta (por lo tanto en el caso que aparece arriba, se movería con tendencia bajista). Históricamente, los cruces de las medias móviles no han sido indicadores de compraventa precisos, pero ayudan a comprender la psicología del mercado. Por lo tanto, en caso de que un par se moviera en dirección contraria a la EMA más corta y la cruzara, esto debería considerarse como una oportunidad para ingresar una posición.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección H: Medias Móviles: Históricas */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">H) Medias Móviles: Históricas</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Medias Móviles: Operaciones Históricas</h4>
                  <p className="text-sm mb-3">El primer gráfico que aparece abajo muestra ejemplos de las medias móviles. Cuando se confirma el comportamiento del precio mediante las medias móviles, este puede ser traducido en señales de oportunidades de compraventa.</p>
                  <p className="text-sm mb-3">Aquí vemos un patrón de vela clásico, ya que sólo las sombras alargadas rompen por debajo de la media móvil a largo plazo (200-SMA). Al atravesar la SMA de 200 días en este gráfico diario del par USD/CHF, observamos el aumento subsiguiente del par.</p>
                  
                  {/* Imagen 7 y 8 después de la frase sobre atravesar la SMA de 200 días */}
                  <div className="my-4 flex justify-center">
                    <Image
                      src="/imagenes%20modulo%20practico%20%233/7.png"
                      alt="Atravesar la SMA de 200 días"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="my-4 flex justify-center">
                    <Image
                      src="/imagenes%20modulo%20practico%20%233/8.png"
                      alt="Aumento subsiguiente del par"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Segundo Ejemplo</h4>
                  <p className="text-sm mb-3">En el segundo gráfico observamos medias móviles aplicadas al par de divisas USD/CHF. Observe el patrón de vela martillo que penetra la media móvil de 200 (Línea negra) Este patrón de movimiento inverso y el hecho de que la media móvil de 200 rebote muestra que el momento de baja se perdió y a su vez que el alza puede seguir.</p>
                </div>
              </div>
            </div>

            {/* Sección I: Trabajo Práctico – Colocación de una Operación */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">I) Trabajo Práctico – Colocación de una Operación</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3"><strong>TRABAJO PRÁCTICO:</strong> trace las medias móviles en un gráfico de un par de divisas y coloque una operación basada en las medias móviles. Responda a estas preguntas informándonos qué operación colocó y por qué la colocó. No dude en cargar una imagen del gráfico a este ejercicio. De ser posible, trate de concentrarse en un período de tiempo más prolongado, como un gráfico diario. Puede utilizar situaciones actuales o pasadas.</p>
              </div>
            </div>

            {/* Sección J: La Pregunta del Día */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">J) La Pregunta del Día</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">En la primera parte de esta lección introdujimos el concepto de que los niveles de retroceso de Fibonacci son importantes porque un gran número de operadores los conocen y se convierten en una profecía autocumplida.</p>
                <p className="text-sm mb-3">En su opinión, y no hay una respuesta correcta para esta pregunta, ¿Cree que una media móvil es un indicador importante aunque no se utilizan comúnmente? Para poner un ejemplo utilizando un número completamente al azar, ¿Cree que una MA de 15 días podría ser útil?</p>
                <p className="text-sm mb-3">El mismo concepto puede plantearse para una media móvil. Generalmente las medias móviles de 10, 20, 50, 100 y 200 días son las más utilizadas, pero esto no significa necesariamente que otras medias móviles no son válidas. De hecho, algunos indicadores que discutiremos en las próximas lecciones se crean a partir de medias móviles. Usted también puede trazar medias móviles en gráficos de períodos más cortos.</p>
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-sm text-gray-300"><strong>NOTA:</strong> La pregunta del día es una pregunta retórica, cuyo objetivo es ayudarle a revisar lo que acaba de aprender. NO es necesario enviarnos una respuesta, ya que estas preguntas no son evaluadas. Sin embargo, si tiene dudas, o si desea compartir sus ideas con nosotros, no dude en contactarnos por email.</p>
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






