import React from 'react';
import BackButton from '@/components/ui/BackButton';

export default function ModuloPractico10PlanTradingContenido() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-2 sm:px-8 py-8 max-w-3xl mx-auto">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 pt-12 relative">
        {/* Boton Volver en la esquina superior izquierda */}
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#ec4d58] mb-2 text-center">Curso Practico de Trading</h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Lección 9: Plan de Trading</h2>

        <section className="mb-8">
          <div className="space-y-8">
            {/* Introducción */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">Introducción</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">Hacia el final de 2004, un hilo titulado "¡Uno debe tener un plan de Trading!" Se inició en el foro 'Trading for a Living' de www.trade2win.com, en T2W. El objetivo del hilo era producir una plantilla en la que todos los operadores, independientemente de la experiencia, los instrumentos negociados, TF, brókers, etc, pudieran crear un plan de trading profesional.</p>
                
                <p className="text-sm mb-3">Este documento es el resultado de ese hilo. Se compone de dos secciones principales con un tercer apartado que en el tiempo, es de esperar, contenga ejemplos de los planes reales creados utilizando la plantilla.</p>
              </div>
            </div>

            {/* PLAN GENERAL DE TRADING */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">PLAN GENERAL DE TRADING</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">La visión general del Plan de trading se ocupa de cuestiones fundamentales sobre el tema, comenzando con una definición simple. A continuación pasa a discutir por qué los traders necesitan un plan en absoluto y, una vez que hayan creado uno, lo que este plan va a hacer por ellos.</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[#ec4d58] mb-2">1. ¿Qué es un plan de trading?</h4>
                    <p className="text-sm mb-3">Un plan de trading es un conjunto completo de normas que abarca todos los aspectos de su vida comercial. Muchos expertos se refieren a la necesidad de tener una "ventaja" para inclinar la balanza de probabilidades de éxito en su favor. En sí mismo, un plan no es una ventaja, pero, con el tiempo, al trader con un plan le va mucho mejor que al trader que no tiene uno.</p>
                    <p className="text-sm mb-3">Los operadores con un plan tienen la capacidad de monitorear su desempeño. Ellos pueden evaluar su progreso constante, día a día, de una manera que es objetiva y completa. Esto les permite operar sin emoción y sin la más mínima tensión.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#ec4d58] mb-2">2. ¿Quién necesita un plan de trading?</h4>
                    <p className="text-sm mb-3">A menos que haya sido un operador constantemente rentable durante un período de tiempo suficiente para abarcar una serie de condiciones diferentes del mercado, entonces ¡USTED necesita un plan de trading!</p>
                    <p className="text-sm mb-3">Algunas personas han descrito un plan de trading como una hoja de ruta. Es, literalmente, la ruta que le llevará desde donde usted está ahora a donde usted desea ir, lo que para la mayoría de los traders, es la rentabilidad consistente.</p>
                  </div>
                  
              <div>
                    <h4 className="font-semibold text-[#ec4d58] mb-2">3. ¿Qué hará un plan de Trading?</h4>
                    <p className="text-sm mb-3">Un plan de trading hará el acto de operar más simple de lo que sería si se opera sin un plan. Limitará su probabilidad de hacer operaciones malas y le evitará muchos problemas psicológicos desde la raíz.</p>
                    <p className="text-sm mb-3">Un plan de trading debería utilizar la mayor parte del tiempo necesario para la toma de decisiones en el calor del momento. Cuestiones emocionales se harán muy poderosas cuando el dinero real está en la línea y, probablemente, le obliguen a tomar decisiones irracionales.</p>
              </div>

              <div>
                    <h4 className="font-semibold text-[#ec4d58] mb-2">4. Antes de comenzar...</h4>
                    <p className="text-sm mb-3">Antes de empezar a crear su propio plan de trading, utilizando el modelo, aquí le presentamos algunas sugerencias para ayudar a garantizar que se construye el mejor plan posible.</p>
                    <p className="text-sm mb-3">Evite la tentación de saltarse alguna de las secciones y asegúrese de trabajarlas en el orden en que aparecen. El orden es específico, por razones que deberían quedar claras en su momento.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* PLANTILLA PLAN DE TRADING */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">PLANTILLA PLAN DE TRADING</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">Esta sección es, las tuercas y los tornillos de todo el documento. Consta de diez unidades clave, con una serie de preguntas en cada una de ellas: unas 50 en total. Esto se completa con una unidad final: "Reglas de Oro del Trading".</p>
              
                <div className="space-y-4">
              <div>
                    <h4 className="font-semibold text-[#ec4d58] mb-2">5. Conózcase a usted mismo. Conozca sus Objetivos</h4>
                    <p className="text-sm mb-3">Casi cualquier operador profesional le dirá que la clave del éxito en los mercados radica en la comprensión de su propia psique. Muchos operadores inexpertos no están preparados para el asalto violento a sus pensamientos y emociones al comienzo de sus carreras.</p>
                    <p className="text-sm mb-3">Junto con la comprensión de su propia psique, es importante saber por qué es que usted quiere ser un operador. ¿Cuál es su objetivo? - ¿Qué significa el éxito como trader para usted?</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#ec4d58] mb-2">6. Objetivos de Trading</h4>
                    <p className="text-sm mb-3">Fijar metas es una parte esencial de su plan de trading, ya que proporcionan con un faro para trabajar en pro de, la capacidad de seguimiento de su progreso y la motivación, necesarias para realizar el trabajo.</p>
                    <p className="text-sm mb-3">Trate de definir sus objetivos en términos de su desarrollo como operador, en oposición a objetivos puramente financieros. Si se centra en convertirse en un operador competente, las recompensas financieras esté seguro que le seguirán.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#ec4d58] mb-2">7. Mercados, Instrumentos y Time Frame</h4>
                    <p className="text-sm mb-3">Decida qué mercado desea operar; y el instrumento(s) que está disponible en ese mercado y las razones de su elección. Como regla general, los operadores profesionales tienden a limitar su enfoque a un número limitado de mercados e instrumentos.</p>
                    <p className="text-sm mb-3">Esperemos que haya decidido qué tipo de operador es o desea ser, es decir, un intradiario, swing trader o trader de posición. Ahora tiene que concentrarse en sus time frame dentro de la categoría de su elección.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#ec4d58] mb-2">8. Las Herramientas del Trading</h4>
                    <p className="text-sm mb-3">Sea cual sea el vehículo que utilizará para negociar; acciones, "spread betting", Contratos por Diferencias (CFDs.), etc debe comprender plenamente las ventajas y desventajas asociadas a su elección.</p>
                    <p className="text-sm mb-3">El Bróker y la Plataforma de Trading son esenciales para su desempeño, así como son fundamentales las raquetas de tenis para Roger Federer o las botas de rugby para Jonny Wilkinson.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#ec4d58] mb-2">9. Antes de que el mercado abra...</h4>
                    <p className="text-sm mb-3">Comenzar a operar sin hacer su tarea de antemano es un poco como emprender ese viaje en coche sin controlar los niveles de aceite y combustible antes de salir. Es esencial someterse a una rutina pre-diario del mercado para asegurarse de que está plenamente preparado para el día de negociación que tiene por delante.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#ec4d58] mb-2">10. Riesgo y Gerencia del Dinero</h4>
                    <p className="text-sm mb-3">Este es el meollo de todo el documento. El fracaso en la aplicación rigurosa del control al riesgo y los principios de gestión del dinero, casi con seguridad, lo llevará a la ruina financiera.</p>
                    <p className="text-sm mb-3">La gestión del riesgo se centra en las medidas necesarias para minimizar las pérdidas mediante la evaluación de las condiciones del mercado, el ratio riesgo/recompensa, y el uso de órdenes stop-loss, etc. El manejo del dinero, en cambio, se centra en las medidas necesarias para maximizar los beneficios mediante el uso de "trailing stops" y ajustes en el tamaño de la posición, etc.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#ec4d58] mb-2">11. Estrategia de Salida</h4>
                    <p className="text-sm mb-3">En las estrategias de salida es más difícil de acertar que en las estrategias de entrada. Lamentablemente, ellas son mucho más importantes porque, claramente, ellas controlan las pérdidas y las ganancias.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#ec4d58] mb-2">12. Estrategias de Trading, Configuraciones y Entradas</h4>
                    <p className="text-sm mb-3">Las estrategias varían según las condiciones del mercado, la hora del día y el calendario en el que cotizan. Podría decirse que prácticamente todas las estrategias caen en uno de estos tres grupos genéricos: rupturas (breakouts), retrocesos (retracements) y reversiones (reversals).</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#ec4d58] mb-2">13. Después del cierre del mercado</h4>
                    <p className="text-sm mb-3">Una vez que haya terminado el día de trading, es tentador para acabar, abrir una botella ya sea ¡para celebrar o para ahogar tus penas! Su plan de trading puede o no puede permitir estas actividades. De cualquier manera, debe incluir el examen de trades ganadores y perdedores.</p>
                    </div>
                    
              <div>
                    <h4 className="font-semibold text-[#ec4d58] mb-2">14. ¡Disciplina!</h4>
                    <p className="text-sm mb-3">Tener un plan de trading global con criterios de entrada y de salida, con un excelente control del riesgo, y procedimientos de gestión del dinero, no cuentan para nada si falta la disciplina necesaria para ponerlos en práctica.</p>
                    </div>
                    
              <div>
                    <h4 className="font-semibold text-[#ec4d58] mb-2">15. Reglas de Oro del Trading</h4>
                    <p className="text-sm mb-3">Sus reglas deben ser las que son pertinentes y significativos para usted. Aquí hay una lista para hacerle pensar:</p>
                    
                    <div className="bg-[#1a1a1a] rounded-lg p-4 mt-4">
                      <ul className="text-sm space-y-2">
                        <li><strong># 1. ¡PROTEGER Y CONSERVAR SU CAPITAL!</strong></li>
                        <li><strong># 2. SIEMPRE PONGA UN STOP LOSS. ¡SIEMPRE!</strong></li>
                        <li><strong># 3. REDUCIR LAS PÉRDIDAS RAPIDAMENTE - DEJA LOS BENEFICIOS CONTROLADOS!</strong></li>
                        <li><strong># 4. OPERE LO QUE VEA - ¡NO LO QUE USTED PIENSE!</strong></li>
                        <li><strong># 5. NUNCA PERSIGA SUS PÉRDIDAS. ¡JAMÁS!</strong></li>
                        <li><strong># 6. NUNCA PROMEDIE A LA BAJA. ¡JAMÁS!</strong></li>
                        <li><strong># 7. ¡LLEVAR UN EXCELENTE REGISTRO!</strong></li>
                        <li><strong># 8. ¡MANTENER LA DISCIPLINA!</strong></li>
                        <li><strong># 9. MANTENGALO SIMPLE!</strong></li>
                        <li><strong># 10. PLANIFIQUE SU TRADING – OPERE SU PLAN!</strong></li>
                  </ul>
                    </div>
                  </div>
                </div>
              </div>
                    </div>
                    
            {/* EJEMPLOS DE PLAN DE OPERACIONES */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">EJEMPLOS DE PLAN DE OPERACIONES</h3>
              
                <div className="space-y-4">
                <p className="text-sm mb-3">Actualmente, esta sección contiene ejemplos de operaciones del plan. Lo ideal sería que contuviera al menos tres planes de trading completos: uno para los operadores de futuros, uno para los operadores del Forex y uno para los operadores de acciones.</p>
                
                <p className="text-sm mb-3">La guinda del pastel sería si también abarcara los tres principales Time Frame: Operador Intradía, Swing Trader y Operador de Posición.</p>
                
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <h4 className="font-semibold text-[#ec4d58] mb-2">16. Roll up, Roll Up...</h4>
                  <p className="text-sm mb-3">Esta sección está diseñada para contener ejemplos prácticos de planes de trading reales que los operadores han creado utilizando esta plantilla.</p>
                  <p className="text-sm">Los ejemplos incluirán casos de estudio de diferentes tipos de operadores y estrategias, proporcionando una guía práctica para la implementación del plan de trading.</p>
                </div>
              </div>
                  </div>
                  
            {/* Conclusión */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">Conclusión</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">Si usted ha llegado hasta este punto y respondió a todas las preguntas - ¡Felicidades! Ahora está entre una minoría de traders que tienen un plan detallado y probado.</p>
                
                <p className="text-sm mb-3">Su futuro éxito como operador no es garantizado, pero al completar esta plantilla y crear su propio plan de trading, las posibilidades han cambiado de manera significativa a su favor.</p>
                
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    <strong>NOTA:</strong> Este plan de trading es una herramienta fundamental para cualquier operador serio. Recuerde que el trading no es un juego, es un negocio que requiere planificación, disciplina y gestión del riesgo.
                  </p>
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


