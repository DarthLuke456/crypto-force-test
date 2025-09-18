import React from 'react';
import BackButton from '@/components/ui/BackButton';
import Image from 'next/image';

export default function ModuloPractico2Contenido() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-2 sm:px-8 py-8 max-w-3xl mx-auto">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 pt-12 relative">
        {/* Boton Volver en la esquina superior izquierda */}
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-[#ec4d58] mb-2 text-center">Curso Practico de Trading</h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Modulo 2: Introduccion al Analisis Tecnico</h2>

        <section className="mb-8">
          <div className="space-y-8">
            {/* Seccion A: La logica del Analisis Tecnico */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">A) La logica del Analisis Tecnico</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Que es el analisis tecnico?</h4>
                  <p className="text-sm mb-3">El analisis tecnico consiste en predecir el movimiento de los tipos de cambio basandose unicamente en las estadisticas y patrones de precio.</p>
                  <p className="text-sm mb-3">En terminos sencillos, el analisis tecnico es el analisis del mercado en funcion del comportamiento del precio. Mientras que el analisis fundamental evalua los factores economicos y las condiciones geopoliticas (tales como los numeros de la economia, los flujos de capital, y los principales acontecimientos politicos) a fin de anticipar los tipos de cambio, el analisis tecnico se basa en las estadisticas y patrones en el movimiento del precio para su prediccion.</p>
                  <p className="text-sm mb-3">El analisis tecnico ha ganado gran popularidad en los ultimos anos, especialmente debido a que las tendencias en la compraventa computarizada continúan desarrollandose y los operadores activos continúan mejorando sus estrategias para evaluar mejor lo que esta sucediendo en el mercado en todo momento.</p>
                  <p className="text-sm">En el mercado de hoy en dia, el analisis tecnico se ha convertido en una herramienta esencial para cualquier operador con aspiraciones.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Por que funciona el Análisis Tecnico?</h4>
                  <ul className="text-sm space-y-2 mb-3">
                    <li>• Muy popular, y por ende ofrece conocimientos sobre lo que muchos operadores estan haciendo</li>
                    <li>• Mas claro y menos controversial que el analisis fundamental</li>
                    <li>• Una manera simple de tomar decisiones de compraventa</li>
                  </ul>
                  <p className="text-sm mb-3">Muchos operadores creen que el analisis tecnico es una profecia destinada a cumplirse, en otras palabras, que funciona unicamente porque es popular y es utilizado por muchos operadores.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Indicadores mas comunes</h4>
                  <p className="text-sm mb-3">A continuacion, aparece una lista de los indicadores mas comunes, los cuales seran analizados en las siguientes lecciones:</p>
                  <ul className="text-sm space-y-1 mb-3">
                    <li>• Principales patrones de graficos de velas japonesas</li>
                    <li>• Retrocesos de Fibonacci</li>
                    <li>• Medias moviles</li>
                    <li>• Indice de Fuerza Relativa (RSI)</li>
                    <li>• Estocastico</li>
                    <li>• Convergencia-Divergencia de la Media Movil (MACD)</li>
                    <li>• Bandas de Bollinger</li>
                  </ul>
                  <p className="text-sm mb-3">Si bien puede parecer intimidante, el analisis tecnico es en realidad muy simple, en general mas simple que el analisis fundamental.</p>
                </div>
              </div>
            </div>

            {/* Seccion B: Teoria del analisis tecnico */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">B) Teoria del analisis tecnico: Mercados en Rangos vs. Mercados en Tendencia</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">El Soporte y la Resistencia</h4>
                  <p className="text-sm mb-3">El soporte y la resistencia conforman la base de la mayoria de los patrones de grafico del analisis tecnico. Identificar los niveles de soporte y resistencia claves es un ingrediente esencial para alcanzar un analisis tecnico exitoso.</p>
                  <p className="text-sm mb-3">Si un par se acerca a un nivel de soporte importante, puede ser una alerta para estar muy atentos a los signos de mayor presion de compra y un posible cambio de tendencia.</p>
                  <p className="text-sm mb-3">La ruptura del nivel de resistencia es senal de que la demanda (alza) lleva las de ganar y la ruptura del nivel de soporte es senal de que la oferta (baja) ha ganado la batalla.</p>
                  
                  {/* Imagen 1.1 después de la frase sobre ruptura de resistencia */}
                  <div className="my-4 flex justify-center">
                    <Image
                      src="/images/modulo-practico-1/1.1.png"
                      alt="Ilustración de ruptura de nivel de resistencia"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Soporte</h4>
                  <p className="text-sm mb-3">Los niveles de soporte y resistencia representan puntos de cambio clave en los que se encuentran la fuerza de los vendedores (oferta) y los compradores (demanda).</p>
                  <p className="text-sm mb-3">El nivel de soporte consiste en el nivel de precio en el que se considera que la demanda es lo suficientemente fuerte como para evitar que el precio continúe bajando.</p>
                  
                  {/* Imagen 1.2 después de la frase sobre soporte */}
                  <div className="my-4 flex justify-center">
                    <Image
                      src="/images/modulo-practico-1/1.2.png"
                      alt="Ilustración de nivel de soporte"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Resistencia</h4>
                  <p className="text-sm mb-3">El nivel de resistencia es el nivel de precio en el que se considera que la venta es lo suficientemente fuerte como para evitar que el precio aumente mas.</p>
                  <p className="text-sm mb-3">El mercado tiene memoria: cuando el precio alcanza un nuevo maximo y luego se produce un retroceso, los vendedores que perdieron el pico anterior estaran dispuestos a vender cuando el precio alcance ese nivel.</p>
                  
                  {/* Imagen 1.3 después de la frase sobre resistencia */}
                  <div className="my-4 flex justify-center">
                    <Image
                      src="/images/modulo-practico-1/1.3.png"
                      alt="Ilustración de nivel de resistencia"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Seccion C: Canales de precios */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">C) Canales de precios</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">El soporte y resistencia no tienen que ser lineas horizontales, y generalmente en un mercado que se mueve mas alto o mas bajo, las lineas de tendencia efectivamente conectan los maximos o minimos para crear un canal de precios.</p>
                <p className="text-sm mb-3">Sin embargo, la linea que sigue una tendencia (soporte en una tendencia alcista y resistencia en una tendencia bajista) debe ser considerada por lejos la mas fuerte de las dos.</p>
                
                {/* Imagen 1.4 después de la frase sobre canales de precios */}
                <div className="my-4 flex justify-center">
                  <Image
                    src="/images/modulo-practico-1/1.4.png"
                    alt="Ilustración de canales de precios"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                
                {/* Imagen 1.5 después de la frase sobre canales de precios */}
                <div className="my-4 flex justify-center">
                  <Image
                    src="/images/modulo-practico-1/1.5.png"
                    alt="Ilustración de compraventa por impulso"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                
                {/* Imagen 1.6 después de la frase sobre canales de precios */}
                <div className="my-4 flex justify-center">
                  <Image
                    src="/images/modulo-practico-1/1.6.png"
                    alt="Ilustración de operación con riesgo mínimo"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                
                {/* Imagen 1.7 después de la frase sobre canales de precios */}
                <div className="my-4 flex justify-center">
                  <Image
                    src="/images/modulo-practico-1/1.7.png"
                    alt="Ilustración de líneas de tendencia en mercado bajista"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Seccion D: La pregunta del dia */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">D) La pregunta del dia</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">1. Ahora que ha leido acerca del soporte y la resistencia, Donde colocaria ordenes de compra y ordenes de venta con respecto a estos niveles al operar una estrategia de ruptura de niveles?</p>
                <p className="text-sm mb-3">2. Donde colocaria una orden "stop loss" una vez que coloca la posicion (en relacion al soporte y la resistencia)?</p>
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



