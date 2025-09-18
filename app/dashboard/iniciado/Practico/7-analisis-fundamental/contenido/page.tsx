import React from 'react';
import BackButton from '@/components/ui/BackButton';
import Image from 'next/image';

export default function ModuloPractico7Contenido() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-2 sm:px-8 py-8 max-w-3xl mx-auto">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 pt-12 relative">
        {/* Botón Volver en la esquina superior izquierda */}
        <div className="absolute top-4 left-4">
          <BackButton />
          </div>
          
        <h1 className="text-3xl sm:text-4xl font-bold text-[#ec4d58] mb-2 text-center">Curso Practico de Trading</h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Lección 6: Análisis Fundamental 1</h2>

        <section className="mb-8">
          <div className="space-y-8">
            {/* Sección A: ¿Qué es el Análisis Fundamental? */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">A) ¿Qué es el Análisis Fundamental?</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">
                  El análisis fundamental consiste en predecir las cotizaciones futuras de cierto instrumento financiero basado en el estudio de factores económicos y políticos.
                </p>
                <p className="text-sm mb-3">
                  En términos sencillos, el análisis fundamental es el análisis del mercado en función de la relación entre factores económicos y/o políticos y su influencia en la cotización de cierta divisa. El análisis fundamental evalúa los factores económicos y las condiciones geopolíticas (tales como los números de la economía, los flujos de capital, y los principales acontecimientos políticos) a fin de anticipar los tipos de cambio.
                </p>
              </div>
            </div>

            {/* Sección B: Estructura del Mercado de Divisas */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">B) Estructura del Mercado de Divisas</h3>
              
              <div className="space-y-4">
                <ul className="text-sm space-y-2 mb-3">
                  <li>• El Mercado de divisas es un mercado extrabursátil (OTC, por sus siglas en inglés) que no está centralizado en ninguna bolsa.</li>
                  <li>• Los operadores pueden elegir entre las diferentes empresas que ofrecen el servicio de compensación de operaciones.</li>
                </ul>
                
                <p className="text-sm mb-3">
                  En el mercado de divisas hay muchos agentes cuyo negocio es unir a compradores y vendedores. Cada agente tiene la habilidad y la autoridad de ejecutar las operaciones independientemente del resto. Esta estructura es inherentemente competitiva ya que los operadores tienen la posibilidad de elegir entre diferentes empresas que tienen la misma habilidad de ejecutar sus operaciones.
                </p>
                
                <p className="text-sm mb-3">
                  A diferencia de los principales mercados de futuros y acciones, la estructura del mercado FX es altamente descentralizada. Esto significa que no hay un lugar central donde se realizan las operaciones. La Bolsa de Nueva York (NYSE, por sus siglas en inglés), por ejemplo, es una bolsa totalmente centralizada.
                </p>
                
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    <strong>PARA DISCUTIR:</strong> El mercado FX tiene claras ventajas respecto al mercado accionario en relación a las eficiencias originadas por la descentralización y la competencia. ¿Cómo afecta la naturaleza de esta estructura de mercado a la ganancia de un operador?
                  </p>
                </div>
              </div>
          </div>

            {/* Sección C: Participantes Claves del Mercado */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">C) Participantes Claves del Mercado</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">
                  Si bien el mercado de divisas era tradicional y totalmente excluyente para todos excepto para un grupo seleccionado de grandes bancos, los avances de la tecnología y la reducción de las barreras del flujo de capital han incorporado una gran variedad de nuevos participantes.
                </p>

                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Bancos Comerciales y de Inversión</h4>
                  <ul className="text-sm space-y-2 mb-3">
                    <li>• Conforman el mercado "Interbancario" y operan mediante sistemas de correaje electrónico (EBS, por sus siglas en inglés).</li>
                    <li>• Estos bancos operan entre ellos mediante fuertes relaciones de crédito, y conforman la mayor parte de la compraventa de divisas.</li>
                    <li>• Estos bancos operan por cuenta propia (operan ellos mismos) y a través del flujo de clientes llenan las órdenes de los clientes que están fuera del mercado interbancario.</li>
            </ul>
          </div>
                
                <p className="text-sm mb-3">
                  El mercado interbancario está compuesto por los bancos comerciales y de inversión más grandes del mundo y en él tiene lugar el mayor volumen de operaciones comerciales así como una gran cantidad de compraventa intradía especulativa.
                </p>
        </div>
          </div>

            {/* Sección D: Participantes Claves del Mercado (Cont.) */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">D) Participantes Claves del Mercado (Cont.)</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Corporaciones</h4>
                  <ul className="text-sm space-y-2 mb-3">
                    <li>• Utilizan principalmente las divisas para protegerse en caso de depreciación de la divisa.</li>
                    <li>• Compran y venden divisas a fin de cumplir con la nómina de las oficinas internacionales.</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Bancos Centrales</h4>
                  <ul className="text-sm space-y-2 mb-3">
                    <li>• Tienen acceso a grandes reservas de capitales.</li>
                    <li>• Tienen objetivos económicos específicos.</li>
                    <li>• Pueden intervenir en el mercado para estabilizar su moneda.</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-[#ec4d58] mb-2">Operadores Minoristas</h4>
                  <ul className="text-sm space-y-2 mb-3">
                    <li>• Incluyen fondos de cobertura, fondos de pensiones y operadores individuales.</li>
                    <li>• Representan una parte creciente del volumen total del mercado.</li>
                    <li>• Operan principalmente con fines especulativos.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sección E: La pregunta del día */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">E) La pregunta del día</h3>
              
              <div className="space-y-4">
                <p className="text-sm mb-3">
                  ¿Cómo cree que la intervención de los bancos centrales afecta el comportamiento del mercado de divisas?
                </p>
                
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    <strong>NOTA:</strong> La pregunta del día es una pregunta retórica, cuyo objetivo es ayudarle a revisar lo que acaba de aprender. NO es necesario enviarnos una respuesta, ya que estas preguntas no son evaluadas. Sin embargo, si tiene dudas, o si desea compartir sus ideas con nosotros, no dude en contactarnos por email a Cursos@fxcmchile.cl
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





