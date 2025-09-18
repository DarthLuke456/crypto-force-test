import React from 'react';
import BackButton from '@/components/ui/BackButton';

export default function ModuloPractico1Contenido() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-2 sm:px-8 py-8 max-w-3xl mx-auto">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 pt-12 relative">
        {/* Botón Volver en la esquina superior izquierda */}
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-[#ec4d58] mb-2 text-center">Curso Práctico de Trading</h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Módulo 1: Introducción al Trading</h2>

        <section className="mb-8">
          <div className="space-y-6">
            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">¿Qué es el trading?</h3>
              <div className="space-y-3 text-sm">
                <p>• Tener muy claro qué no es el Trading para enfocarte en lo que sí es realmente</p>
                <p>• Conocer cómo es el proceso del trader</p>
                <p>• Cuáles son los pilares en los que se sostiene la operativa bursátil</p>
              </div>
            </div>

            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">El Gráfico</h3>
              <p className="text-sm">• Entender la información que nos puede proporcionar un gráfico, y qué utilidad tiene</p>
            </div>

            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">Las Velas Japonesas</h3>
              <p className="text-sm">• Entender la composición de cada vela, así como la información que transmite una vela y un conjunto de velas en una zona determinada</p>
            </div>

            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">El Precio</h3>
              <p className="text-sm mb-3">• La importancia de esta clase radica en la relevancia del Trading: &quot;No se trata de adivinar lo que hará el precio, sino de adaptarnos a su movimiento&quot;</p>
              <div className="space-y-2 text-sm">
                <p>• Entender correctamente el movimiento del precio</p>
                <p>• De este modo podremos analizar el gráfico de forma correcta, y preparar nuestra operativa</p>
              </div>
            </div>

            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">Psicotrading</h3>
              <div className="space-y-2 text-sm">
                <p>• Aprende a pensar como un trader</p>
                <p>• Aprender el concepto de que no pasa nada por perder dinero, ya que es parte del negocio</p>
                <p>• Entiende el comportamiento de la masa, para anteponerte a ella</p>
              </div>
            </div>

            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">Gestión monetaria I</h3>
              <div className="space-y-2 text-sm">
                <p>• Ser conscientes de que el primer objetivo de un trader es preservar su capital, para poder volver otro día al mercado</p>
                <p>• Entender la combinación del ratio de acierto y del ratio Bo/Riesgo</p>
              </div>
            </div>

            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">Gestión monetaria II</h3>
              <div className="space-y-2 text-sm">
                <p>• Entender la importancia del STOP LOSS y la obligación de usarlo siempre</p>
                <p>• Cómo colocar correctamente el Stop Loss</p>
              </div>
            </div>

            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">El Plan de Trading</h3>
              <p className="text-sm">• Entender cada una de las partes que componen el Plan de Trading, ya que será nuestra piedra angular</p>
            </div>

            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">Análisis de mercado</h3>
              <div className="space-y-2 text-sm">
                <p>• Entender cómo es un análisis gráfico eficiente, en busca de zonas relevantes del gráfico</p>
                <p>• Nos interesa conocer la importancia de estas zonas, ya que, si están bien puestas, lo normal es que el precio vaya de una zona a otra</p>
                <p>• Un buen análisis gráfico nos allana el camino para preparar nuestra operativa</p>
              </div>
            </div>

            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">La Operativa</h3>
              <p className="text-sm mb-3">• Entender el proceso operativo completo:</p>
              <div className="space-y-2 text-sm">
                <p>• Antes de abrir la posición, qué tenemos que tener en cuenta</p>
                <p>• Una vez abierta la posición en qué debemos fijarnos</p>
                <p>• Saber cuándo cerrar la operación</p>
              </div>
            </div>

            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">Tipos de Órdenes</h3>
              <p className="text-sm">• Conocer bien las diferentes alternativas, ya que dependiendo de la operativa que planteemos, necesitamos usar una u otra</p>
            </div>

            <div className="bg-[#181818] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#ec4d58] mb-4">¿Cómo conseguir consistencia?</h3>
              <div className="space-y-2 text-sm">
                <p>• Entender que esto es una carrera de fondo, no un sprint</p>
                <p>• Es un mundo muy cambiante, por lo que es necesaria la formación continua</p>
                <p>• Debemos de ser tremendamente disciplinados y pacientes, durante todo el proceso</p>
                <p>• Que lo verdaderamente importante es ganar de forma recurrente</p>
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

