import React from 'react';
import BackButton from '@/components/ui/BackButton';

export default function Modulo3Contenido() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-2 sm:px-8 py-8 max-w-3xl mx-auto">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 pt-12 relative">
        {/* Boton Volver en la esquina superior izquierda */}
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-[#ec4d58] mb-2 text-center">Criptomonedas. Herramientas Economicas</h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Modulo 3: Accion del Gobierno en los Mercados</h2>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Accion del Gobierno en los Mercados</h3>
          <p className="mb-2">El gobierno puede intervenir en los mercados de varias maneras para corregir fallos del mercado y promover objetivos sociales.</p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-[#ec4d58] mb-2">Tipos de Intervencion</h4>
              <ul className="list-disc list-inside mb-2">
                <li>Regulacion de precios (precios maximos y minimos)</li>
                <li>Impuestos y subsidios</li>
                <li>Regulacion de la competencia</li>
                <li>Proteccion de derechos de propiedad</li>
                <li>Provision de bienes publicos</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#ec4d58] mb-2">Precios Maximos</h4>
              <p className="mb-2">Los precios maximos se establecen por debajo del precio de equilibrio para hacer los bienes mas accesibles.</p>
              <p className="mb-2">Ejemplos: control de alquileres, precios de medicamentos, tarifas de servicios publicos.</p>
              <p className="mb-2">Consecuencias: escasez, mercados negros, reduccion de la calidad.</p>
            </div>

            <div>
              <h4 className="font-semibold text-[#ec4d58] mb-2">Precios Minimos</h4>
              <p className="mb-2">Los precios minimos se establecen por encima del precio de equilibrio para proteger a los productores.</p>
              <p className="mb-2">Ejemplos: salario minimo, precios agricolas, tarifas profesionales.</p>
              <p className="mb-2">Consecuencias: excedentes, desempleo, ineficiencia.</p>
            </div>

            <div>
              <h4 className="font-semibold text-[#ec4d58] mb-2">Impuestos</h4>
              <p className="mb-2">Los impuestos pueden usarse para desalentar el consumo de ciertos bienes o para generar ingresos.</p>
              <p className="mb-2">Efectos: reduccion de la cantidad intercambiada, perdida de eficiencia economica.</p>
            </div>

            <div>
              <h4 className="font-semibold text-[#ec4d58] mb-2">Subsidios</h4>
              <p className="mb-2">Los subsidios se otorgan para fomentar la produccion o consumo de ciertos bienes.</p>
              <p className="mb-2">Ejemplos: subsidios agricolas, energia renovable, educacion.</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Regulacion de la Competencia</h3>
          <p className="mb-2">Los gobiernos regulan la competencia para prevenir practicas monopolisticas y proteger a los consumidores.</p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-[#ec4d58] mb-2">Leyes Antimonopolio</h4>
              <ul className="list-disc list-inside mb-2">
                <li>Prevencion de fusiones anticompetitivas</li>
                <li>Prohibicion de practicas monopolisticas</li>
                <li>Promocion de la competencia</li>
                <li>Proteccion de los consumidores</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#ec4d58] mb-2">Regulacion de Servicios Publicos</h4>
              <p className="mb-2">Los servicios publicos como electricidad, agua y telecomunicaciones suelen estar regulados.</p>
              <p className="mb-2">Objetivos: garantizar acceso universal, controlar precios, mantener calidad.</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Bienes Publicos</h3>
          <p className="mb-2">Los bienes publicos son aquellos que no pueden ser excluidos del consumo y no son rivales.</p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-[#ec4d58] mb-2">Caracteristicas</h4>
              <ul className="list-disc list-inside mb-2">
                <li>No exclusion: no se puede impedir que alguien los use</li>
                <li>No rivalidad: el uso por una persona no reduce la disponibilidad para otros</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#ec4d58] mb-2">Ejemplos</h4>
              <ul className="list-disc list-inside mb-2">
                <li>Defensa nacional</li>
                <li>Alumbrado publico</li>
                <li>Parques nacionales</li>
                <li>Investigacion basica</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#ec4d58] mb-2">Problema del Free Rider</h4>
              <p className="mb-2">Los bienes publicos enfrentan el problema del free rider: las personas pueden beneficiarse sin pagar.</p>
              <p className="mb-2">Solucion: provision gubernamental financiada con impuestos.</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Externalidades</h3>
          <p className="mb-2">Las externalidades son efectos secundarios de las actividades economicas que afectan a terceros.</p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-[#ec4d58] mb-2">Externalidades Negativas</h4>
              <p className="mb-2">Efectos perjudiciales para terceros (ej: contaminacion, ruido).</p>
              <p className="mb-2">Soluciones: impuestos pigouvianos, regulacion, derechos de propiedad.</p>
            </div>

            <div>
              <h4 className="font-semibold text-[#ec4d58] mb-2">Externalidades Positivas</h4>
              <p className="mb-2">Efectos beneficiosos para terceros (ej: educacion, investigacion).</p>
              <p className="mb-2">Soluciones: subsidios, provision publica.</p>
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





