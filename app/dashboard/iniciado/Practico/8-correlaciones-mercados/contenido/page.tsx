import React from 'react';
import BackButton from '@/components/ui/BackButton';
import Image from 'next/image';

export default function ModuloPractico8Contenido() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-2 sm:px-8 py-8 max-w-3xl mx-auto">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 pt-12 relative">
        {/* Botón Volver en la esquina superior izquierda */}
        <div className="absolute top-4 left-4">
          <BackButton />
          </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#ec4d58] mb-2 text-center">Curso Practico de Trading</h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Lección 7: Análisis Fundamental 2</h2>

        <section className="mb-8">
          <div className="space-y-8">
            {/* Sección A: Petróleo Crudo */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">A) Petróleo Crudo</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">
                  Petróleo: el precio del petróleo crudo dulce ligero (o Light Sweet Oil en inglés) puede tener un gran efecto sobre el mercado de divisas, y afecta especialmente a divisas tales como el dólar canadiense (CAD), el dólar estadounidense (USD) y el yen japonés (JPY) por diferentes razones.
                </p>
                
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">CAD: el petróleo representa alrededor del 8% de la economía de Canadá</h4>
                  <p className="text-sm mb-3">
                    Por lo tanto, por cada dólar que sube el precio del petróleo, la economía canadiense tiende a beneficiarse. Por otro lado, si cae el precio del petróleo, la economía canadiense tiende a perjudicarse. La economía canadiense depende de las exportaciones de madera y petróleo, así como también de los artículos básicos de consumo como el trigo y otros cereales.
                  </p>
                  <p className="text-sm mb-3">
                    Siendo Canadá el noveno productor de petróleo crudo más grande del mundo, existe una fuerte correlación positiva entre la divisa canadiense y los precios del petróleo. De hecho, entre el 2004 y el 2005, la correlación semanal estuvo cerca del 70%.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">USD: Canadá es el principal proveedor de petróleo de los Estados Unidos</h4>
                  <p className="text-sm mb-3">
                    De hecho, Estados Unidos consume más petróleo proveniente de Canadá que del Medio Oriente. Debido a que los Estados Unidos y Japón son países altamente industrializados, los altos precios del petróleo tienden a reducir la capacidad de los Estados Unidos de continuar siendo productivo.
                  </p>
                  <p className="text-sm mb-3">
                    Los altos precios del petróleo pueden tener un efecto serio sobre industrias tales como el sector aerocomercial, químico, automotor, y la producción industrial. El precio del petróleo tiene una muy fuerte correlación o relación con el par de divisas USD/CAD.
                  </p>
          </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">JPY: Japón importa el 99% del petróleo que consume</h4>
                  <p className="text-sm mb-3">
                    Ya que también es considerada una economía altamente industrializada. Su economía tiende a beneficiarse cuando los precios del petróleo caen, ya que su economía está generalmente bajo tensión durante períodos de altos precios del petróleo.
                  </p>
                  <p className="text-sm mb-3">
                    La mayoría de las principales industrias, tales como la industria automotriz y la producción industrial, depende del petróleo día a día. Debido a que el precio de petróleo ha continuado subiendo durante el transcurso de los últimos años, las industrias japonesas no son capaces de mantener el mismo nivel de crecimiento a largo plazo debido a este aumento en el costo de producción.
                  </p>
                </div>
                
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    <strong>PARA DISCUTIR:</strong> Los operadores que se dan cuenta de esta correlación entre mercados pueden operar en el mercado de divisas con una tendencia, dependiendo de su mercado de commodities respectivo.
                  </p>
          </div>
          </div>
          </div>

            {/* Sección B: Oro */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">B) Oro</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">
                  Oro: además del petróleo, el precio del oro tiende a tener una muy fuerte correlación o relación con divisas tales como el CHF, y una correlación opuesta o inversa con el USD.
                </p>
                
                <p className="text-sm mb-3">
                  Hasta hace poco tiempo, el CHF estaba respaldado por el oro, de la misma manera en que lo estaba el USD un par de décadas atrás. El oro es considerado un "refugio seguro" para el capital durante épocas de malestar político y/o económico.
                </p>
                
                <p className="text-sm mb-3">
                  A medida que el capital se aleja del USD, el oro tiende a beneficiarse, ya que el capital se ve atraído por bienes tangibles, tales como los metales preciosos, principalmente el oro, en tiempos de incertidumbre. Por otro lado, durante épocas de prosperidad, el capital abandonará la seguridad del oro, y se trasladará a instrumentos financieros más especulativos, como por ejemplo los mercados de acciones.
                </p>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">USD/CHF & EUR/USD</h4>
                  <p className="text-sm mb-3">
                    El precio del oro también tiende a tener un efecto doble sobre el par de divisas USD/CHF. A medida que aumenta el precio del oro, el USD tiende a disminuir en valor a la vez que el CHF tiende a beneficiarse. Debido a que tanto el oro como el CHF son considerados instrumentos financieros seguros, conservadores, cualquier cambio en su valor tiende a tener un fuerte impacto sobre el otro.
                  </p>
                  <p className="text-sm mb-3">
                    A medida que aumenta el precio del oro, el capital tiende a salirse del USD, mientras que el CHF tiende a beneficiarse. Además, el par de divisas EUR/USD tiende a tener una fuerte correlación con el precio del oro, y una relación inversa con el par USD/CHF.
                  </p>
              </div>
              </div>
            </div>

            {/* Sección C: Cobre */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">C) Cobre</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">
                  Cobre: Australia es la segunda productora más grande del mundo de este metal precioso, con una producción de alrededor de 261 toneladas al año, después de Sudáfrica con una producción de 345 toneladas. Más de la mitad de las exportaciones de Australia son metales, lo que resulta en una fuerte correlación entre los metales y el dólar australiano.
                </p>
                
                <p className="text-sm mb-3">
                  Principalmente el oro y el cobre tienen un gran efecto. El precio del cobre desempeña un papel importante no sólo en la economía australiana sino también en diferentes sectores. Por ejemplo, el sector de viviendas (los constructores) utiliza una gran cantidad de cobre para cañerías y otros artefactos.
                </p>
                
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Tasas de Interés y Carry Trade</h4>
                  <p className="text-sm mb-3">
                    Debido a que la economía de los Estados Unidos y muchas otras economías en el mundo están cayendo bajo presión, el FOMC (EE.UU.) y otros bancos centrales del mundo bajaron sus tasas de interés a fin incentivar el crecimiento económico alrededor del mundo.
                  </p>
                  <p className="text-sm mb-3">
                    Las tasas de interés más bajas facilitaron al consumidor promedio la compra de hogares nuevos o refinanciamiento de viviendas existentes. Esto ha generado un gran beneficio sobre el dólar australiano.
                  </p>
          </div>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Operación de Financiación (Carry Trade)</h4>
                  <p className="text-sm mb-3">
                    La operación de financiación conocida en inglés como "carry trade" consiste en la compra de una divisa a una tasa de interés más alta y la venta de otra a una tasa de interés más baja. Con miras hacia el futuro, aquellos interesados en la estrategia de "carry trade" no sólo deberían estudiar las tasas de interés actuales sino también la anticipación de las tasas de interés futuras.
                  </p>
                  <p className="text-sm mb-3">
                    El mercado forex se mueve en anticipación a tasas de interés más altas o bajas según la información actual. El mercado de divisas, al igual que cualquier otro mercado, es un "mecanismo anticipatorio".
                  </p>
                </div>
                
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    <strong>IMPORTANTE:</strong> Los operadores que siguen el comportamiento del AUD deben además observar la acción del precio del cobre al igual que los informes fundamentales emitidos desde Australia que estén relacionados con sus mercados de viviendas.
                  </p>
            </div>
          </div>
        </div>

            {/* Sección D: La pregunta del día */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">D) La pregunta del día</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">
                  ¿Cómo utilizaría las correlaciones entre mercados para mejorar sus decisiones de trading?
                </p>
                
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    <strong>NOTA:</strong> La pregunta del día es una pregunta retórica, cuyo objetivo es ayudarle a revisar lo que acaba de aprender. NO es necesario enviarnos una respuesta, ya que estas preguntas no son evaluadas.
                  </p>
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






