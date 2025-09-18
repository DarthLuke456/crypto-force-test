import React from 'react';
import BackButton from '@/components/ui/BackButton';

export default function Modulo1Contenido() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-2 sm:px-8 py-8 max-w-3xl mx-auto">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 pt-12 relative">
        {/* Boton Volver en la esquina superior izquierda */}
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-[#ec4d58] mb-2 text-center">Criptomonedas. Herramientas Economicas</h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Modulo 1: Introduccion y la logica economica</h2>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Introduccion y la logica economica</h3>
          <p className="mb-2">La economia actua como complemento del derecho. Contribuye en la interactuacion con clientes, tanto a nivel empresarial como estatal.</p>
          <ul className="list-disc list-inside mb-2">
            <li>Como escribir contratos que ayuden lograr los objetivos del negocio de la empresa?</li>
            <li>Como lograr que las regulaciones sirvan para promover metas sociales?</li>
          </ul>
          <p className="mb-2">A menudo se contempla al derecho solo en su papel de proveedor de justicia.</p>
          <p className="mb-2">Con el estudio de la economia, se visualizan las leyes como incentivos para el cambio de comportamientos y como instrumentos para el logro de los objetivos de las politicas (eficiencia y distribucion). Es por ello por lo que es sumamente conveniente entender que hay problemas economicos que son la genesis de las acciones legales del cliente (ej. monopolio, externalidades negativas, etc.)</p>
          <p className="mb-2">La Ley de divorcio, las tasas de criminalidad, los contratos, la eutanasia, el derecho de propiedad, las instituciones en el sentido amplio de la palabra, el sistema electoral, el aborto, las reparaciones por danos y perjuicios, las patentes, el Derecho internacional, la decision de anotarse en la Facultad, el Derecho Constitucional, la contaminacion ambiental, el Derecho Laboral y naturalmente el Tributario tambien, son algunos de los temas en que la Economia y el Derecho se dan la mano.</p>
          <p className="mb-2">Estudiar economia es una excelente inversion para aprender a interpretar un cuerpo normativo, no ya por la intencion declarada de su letra, sino por los hechos juridicos que efectivamente produce.</p>
          <p className="mb-2">En efecto, el estudio de las consecuencias economicas de una norma permite conocer hasta que punto esta es apropiada a los objetivos que su cuerpo declarativo enumera.</p>
          <p className="mb-2">Ya mostramos que cuando la Constitucion dice que la educacion es gratuita solo contempla el no pago de aranceles, pero no garantiza de ninguna manera que esta no sea costosa para el alumno.</p>
          <p className="mb-2 italic">Tetaz, Martin (2006) Economia para Abogados.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">La palabra economia</h3>
          <p className="mb-2">La palabra economia proviene del griego quien administra el Hogar (Tetaz Martin; 2006). Decisiones en cada hogar: el objetivo es asignar los escasos recursos para satisfacer la mayor cantidad de necesidades.</p>
          <p className="mb-2 font-semibold">Glosario:</p>
          <ul className="list-disc list-inside mb-2">
            <li><b>Escasez:</b> significa que la sociedad tiene recursos limitados y debido a ello, no puede producir todos los bienes y servicios que serian deseables. La administracion de los recursos de una sociedad es importante porque estos son escasos.</li>
          </ul>
          <p className="mb-2">La economia entrena para pensar en terminos de alternativas, evaluar los costos y beneficios de las elecciones privadas (empresas o individuos) y sociales, examinar y comprender como se relacionan determinados sucesos y topicos.</p>
          <p className="mb-2">Un ejemplo mas concreto de las relaciones entre la economia y el derecho es el de la legislacion tributaria, en el que puede existir una diferencia muy grande entre la aparente voluntad del legislador y el efecto economico final de la norma.</p>
          <p className="mb-2">Es sabido que a nadie le gusta pagar impuestos, por lo que establecido el mismo por la ley, el sujeto de derecho de la obligacion hara cuanto este a su alcance por endosarle la carga del tributo a otros. Si este es un productor es probable que traslade parte de la carga a los consumidores hacia adelante y si no lograra hacerlo, intentara que sus empleados absorban el coste via una reduccion de salarios, trasladando hacia atras la carga.</p>
          <p className="mb-2">Si el contribuyente de iure es un consumidor, este puede simplemente dejar de consumir el bien gravado y sustituirlo por otro, con lo que el productor obtendra un menor precio neto de impuesto y terminara por tanto absorbiendo parte de la carga.</p>
          <p className="mb-2">Solo de casualidad, el impacto economico final se correspondera con el que surge de la interpretacion literal de la norma, y en todo caso el legislador debera ser muy cuidadoso para garantizar que la ley efectivamente cumpla con el proposito para el que es dictada.</p>
          <p className="mb-2">Naturalmente esto no agota, ni mucho menos, la relacion entre la economia y el derecho.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Microeconomia y Macroeconomia</h3>
          <p className="mb-2">A nivel general, la Microeconomia se focaliza en las unidades individuales de la economia. Como las familias y empresas toman sus decisiones y como interactuan en mercados especificos. Mientras que la Macroeconomia mira a la economia como un todo. Como los mercados interactuan a nivel nacional.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Principios Basicos de la Microeconomia</h3>
          <ol className="list-decimal list-inside mb-2 space-y-2">
            <li><b>La gente enfrenta disyuntivas (trade off):</b> El comportamiento de una economia refleja el comportamiento de sus individuos. Por cada hora que el abogado destine a estudiar una nueva causa, automaticamente dejara de contestar un requerimiento durante ese tiempo. Las leyes necesarias para hacer que las empresas contaminen menos provocan que los costos de produccion de los bienes y servicios aumenten y, debido a estos costos mas altos, las empresas ganan menos, o pagan salarios mas bajos o venden los bienes a precios mas altos, o crean una combinacion de estas variables.</li>
            <li><b>El costo de una cosa es aquello a lo que se renuncia para obtenerla:</b> El costo de oportunidad de una cosa es aquello a lo que renunciamos para conseguirla. Si decidimos seguir capacitandonos seguramente dejariamos de generar honorarios mientras dure dicha capacitacion, pero en el futuro esos honorarios creceran considerablemente.</li>
            <li><b>Las personas racionales piensan en terminos marginales:</b> Las personas racionales saben que las decisiones en la vida raras veces se traducen en elegir entre lo blanco y lo negro y, generalmente, existen muchos matices de grises. Un tomador de decisiones racional emprende una accion si y solo si el beneficio marginal de esta accion es mayor al costo marginal.</li>
            <li><b>Las personas responden a los incentivos:</b> Un incentivo es algo que induce a las personas a actuar y puede ser una recompensa o un castigo. Los incentivos son fundamentales cuando se analiza como funcionan los mercados.</li>
            <li><b>El comercio puede mejorar el bienestar de todos:</b> El comercio permite a cada persona especializarse en las actividades que mejor realiza, ya sea cultivar el campo, coser o construir casas. El comerciar permite a las personas comprar una mayor variedad de bienes y servicios a un menor precio.</li>
            <li><b>Los mercados normalmente son un buen mecanismo para organizar la actividad economica:</b> En una economia de mercado, las decisiones que antes se tomaban de manera centralizada son sustituidas por las decisiones de millones de empresas y familias.</li>
            <li><b>El gobierno puede mejorar algunas veces los resultados del mercado:</b> Una de las razones por las cuales necesitamos al gobierno es porque la magia de la mano invisible de la economia solo funciona cuando aquel hace valer las reglas y mantiene las instituciones que son clave para el libre mercado.</li>
            <li><b>El nivel de vida de un pais depende de la capacidad que tenga para producir bienes y servicios:</b> Casi todas las variaciones de los niveles de vida pueden atribuirse a las diferencias existentes entre los niveles de productividad de los paises.</li>
            <li><b>Cuando el gobierno imprime demasiado dinero los precios se incrementan:</b> Inflacion es el crecimiento sostenido y generalizado del nivel general de precios. Cuando un gobierno emite grandes cantidades de dinero, el valor de este disminuye.</li>
            <li><b>La sociedad enfrenta a corto plazo una disyuntiva entre inflacion y desempleo:</b> En la economia, un incremento en la cantidad de dinero estimula el nivel total el gasto y, por ende, estimula tambien la demanda de bienes y servicios.</li>
          </ol>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Surgimiento de las criptomonedas</h3>
          <p className="mb-2">En 1998 el criptografo Wei Dai publico su idea de evitar la necesidad de intermediarios en las transacciones de pago electronico. Su idea era crear un sistema de intercambio de valor y ejecucion de contratos basados en una moneda electronica no rastreable, que le permitiera a sus duenos mantenerse anonimos.</p>
          <p className="mb-2">En 2009 un programador bajo el alias de Satoshi Nakamoto llevo a la realidad la idea de Dai al crear una moneda cuasi anonima: el Bitcoin, la primera moneda digital descentralizada de la historia. Satoshi Nakamoto publico un documento denominado Bitcoin: A peer to peer Electronic Cash System, que en espanol se deberia traducir como Bitcoin, un sistema de dinero electronico entre pares.</p>
          <p className="mb-2">La verdadera identidad de Satoshi sigue siendo desconocida hasta el dia de hoy. Segun sus propias declaraciones realizadas el 2012, el era un hombre de 37 anos que vivia en algun lugar de Japon. Sin embargo, hay muchas dudas sobre esto, por ejemplo, escribe en ingles con fluidez y el software de Bitcoin no esta documentado en japones, lo que lleva a muchos a pensar que, en realidad, no es japones.</p>
          <p className="mb-2">Alguna vez sabremos quien es el creador de Bitcoin? O se trata de un equipo de personas? Puede que nunca lo sepamos, pero una cosa es segura: Esta persona o personas controlan aproximadamente un millon de Bitcoins.</p>
          <p className="mb-2">Las criptomonedas son archivos, bits con datos (como los populares PDF o MP3) que buscan cumplir todas y cada una de las funciones que se le asignan al dinero tradicional, pero usando la web como medio de transmision.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Bibliografia</h3>
          <ul className="list-disc list-inside">
            <li>Mankiw, N. Gregory, Principles of Economics, Sixth Edition, South-Western, Cengage Learning, 2012</li>
            <li>Tetaz, Martin, Economia para Abogados, UNLP, 2006</li>
          </ul>
        </section>

        {/* Boton Volver al final del texto, del lado izquierdo */}
        <div className="mt-8">
          <BackButton />
        </div>
      </div>
    </div>
  );
} 





