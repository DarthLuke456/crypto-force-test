import React from 'react';
import BackButton from '@/components/ui/BackButton';

export default function Modulo4Contenido() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-2 sm:px-8 py-8 max-w-3xl mx-auto">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 pt-12 relative">
        {/* Botón Volver en la esquina superior izquierda */}
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-[#ec4d58] mb-2 text-center">Criptomonedas. Herramientas Económicas</h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Módulo 4: Competencia Perfecta</h2>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Competencia Perfecta</h3>
          <p className="mb-2">Si la estación de servicio de su barrio incrementara 30% el precio de la nafta, la cantidad de nafta super que vende sufriría una fuerte caída, ya que los clientes decidirían de inmediato comprar combustible en otras estaciones de servicio. Por otro lado, si la empresa que abastece de agua potable a la ciudad incrementa 30% el precio del servicio de provisión de agua, ésta sólo experimentará una pequeña disminución en la cantidad de agua vendida. Las personas lavarán menos las veredas y también regarán menos los jardines, pero tendrán dificultades en reducir de manera importante su consumo de agua y difícilmente encontrarán otro proveedor del mismo servicio. La diferencia entre el mercado de la nafta y el mercado del agua potable es evidente: muchas empresas venden naftas en el mercado local, pero sólo una provee el agua. Como podría esperarse, la diferencia en la estructura del mercado determina las decisiones sobre fijación de precios y el nivel de producción que toman las empresas que operan en estos mercados.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">¿Qué es un mercado competitivo?</h3>
          <p className="mb-2">Un mercado competitivo, muchas veces llamado mercado perfectamente competitivo o mercado de competencia perfecta, tiene dos características:</p>
          <ul className="list-disc list-inside mb-2 space-y-2">
            <li>Existen muchos compradores y vendedores en el mercado.</li>
            <li>Los bienes ofrecidos por los diversos vendedores son básicamente los mismos.</li>
          </ul>
          <p className="mb-2">Como resultado de estas condiciones, las acciones de un solo comprador o vendedor en el mercado tienen un efecto insignificante en el precio de mercado. Cada comprador y vendedor toma el precio de mercado como dado (son precio-aceptantes).</p>
          <p className="mb-2">Como ejemplo, considere el mercado de zapatos. Ningún consumidor de zapatos por sí solo puede influir en el precio del mismo, porque cada comprador adquiere una pequeña cantidad en relación con el tamaño del mercado. De la misma manera, cada productor tiene control limitado sobre el precio, porque muchos vendedores ofrecen zapatos que son esencialmente idénticos. Debido a que cada vendedor puede vender todo lo que quiera al precio de mercado, no tendrá razones para cobrar menos, y si cobra más, los compradores se irán a otro lugar. Compradores y vendedores en mercados competitivos deben aceptar el precio que el mercado determina y, por tanto, se dice que son tomadores de precios.</p>
          <p className="mb-2">Además de las dos condiciones anteriores para la competencia, agregaremos una tercera que en ocasiones se piensa que caracteriza a los mercados perfectamente competitivos:</p>
          <ul className="list-disc list-inside mb-2">
            <li>Las empresas pueden entrar y salir libremente del mercado.</li>
          </ul>
          <p className="mb-2">Si, por ejemplo, cualquiera puede decidir iniciar un negocio de venta de calzado y cualquier productor de zapatos existente puede decidir dejar el negocio, la industria del calzado satisface esta condición.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Los ingresos de una empresa competitiva</h3>
          <p className="mb-2">Una empresa que opera en un mercado competitivo, como muchas otras empresas en la economía, trata de maximizar sus beneficios (ingresos totales menos costos totales). Así como previamente fueron útiles los conceptos de costo medio y marginal en el análisis de los costos, también serán útiles para analizar los ingresos.</p>
          <p className="mb-2">Para entender qué indican estos conceptos, consideremos estas dos preguntas:</p>
          <ul className="list-disc list-inside mb-2 space-y-2">
            <li>¿Cuánto ingreso recibe la empresa por la venta de un bien o servicio?</li>
            <li>¿Cuánto ingreso adicional recibe la empresa si incrementa su producción de ese bien o servicio?</li>
          </ul>
          <p className="mb-2"><b>Ingreso medio:</b> Ingresos totales divididos por la cantidad vendida.</p>
          <p className="mb-2"><b>Ingreso marginal:</b> Cambio en los ingresos totales que ocasiona vender una unidad adicional.</p>
          <p className="mb-2">Uno de los Diez principios de la economía es que las personas racionales piensan en términos marginales. Ahora vemos cómo cualquier empresa puede aplicar este principio. Si el ingreso marginal es mayor que el costo marginal la empresa debe incrementar su producción porque así obtendrá más dinero (ingreso marginal) de lo que gasta (costo marginal).</p>
          <p className="mb-2">Si el ingreso marginal es menor que el costo marginal, la empresa debe disminuir la producción. Si los propietarios de la empresa piensan en términos marginales y hacen ajustes incrementales al nivel de producción, llegarán naturalmente a la cantidad que maximiza sus beneficios.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">La curva de costo marginal y la decisión de la empresa respecto a la oferta</h3>
          <p className="mb-2">Para ampliar este análisis de maximización de beneficios, considere las curvas de costos. Estas curvas tienen tres características que se cree que describen a casi todas las empresas: la curva de costo marginal (CMg) tiene pendiente positiva (ascendente). La curva de costo total medio o promedio (CTP) tiene forma de U. La curva de costo marginal interseca la curva de costo total promedio en el mínimo del costo total promedio. También hay una línea horizontal en el precio de mercado (P). La línea del precio es horizontal porque la empresa es tomadora de precios: el precio de la producción de la empresa es el mismo sin importar la cantidad que la empresa decida producir. Recuerde que para una empresa competitiva, el precio de la empresa es igual al ingreso promedio o medio (IP) y al ingreso marginal (IMg).</p>
          <p className="mb-2">¿Dónde acaban los ajustes marginales a la producción? Sin importar si la empresa empieza con un nivel bajo de producción o en un nivel alto, a la larga la empresa ajustará su producción hasta que la cantidad producida alcance QMÁX. Este análisis produce tres reglas generales para la maximización de beneficios:</p>
          <ul className="list-disc list-inside mb-2 space-y-2">
            <li>Si el ingreso marginal es mayor que el costo marginal, la empresa debe aumentar la producción.</li>
            <li>Si el costo marginal es mayor que el ingreso marginal, la empresa debe disminuir la producción.</li>
            <li>En el nivel de producción que maximiza los beneficios, el ingreso marginal y el costo marginal son exactamente iguales.</li>
          </ul>
          <p className="mb-2">Estas reglas son la clave de la toma de decisiones racionales para una empresa maximizadora de beneficios. Se aplican no sólo a las empresas competitivas, sino también, a otros tipos de empresas. Ahora podemos entender cómo una empresa competitiva decide la cantidad de bienes que ofrecerá en el mercado. Debido a que una empresa competitiva es tomadora de precios, su ingreso marginal es igual al precio de mercado. Para cualquier precio dado, la cantidad que maximiza los beneficios de una empresa competitiva se encuentra en la intersección del precio con la curva de costo marginal.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">La decisión de la empresa de cerrar a corto plazo</h3>
          <p className="mb-2">En ciertas circunstancias, sin embargo, la empresa decide cerrar y no producir nada. Aquí debemos distinguir entre el cierre temporal de una empresa y la salida permanente de ésta del mercado. Cierre se refiere a una decisión a corto plazo de no producir nada durante un periodo específico, debido a las condiciones actuales del mercado. Salida se refiere a la decisión a largo plazo de abandonar el mercado.</p>
          <p className="mb-2">Las decisiones a corto y largo plazo difieren porque la mayoría de las empresas no puede evitar los costos fijos a corto plazo, pero sí a largo plazo. Esto es, una empresa que cierra temporalmente tiene que pagar de todos modos sus costos fijos, mientras que una empresa que sale del mercado no tiene que pagar ningún costo, ni fijo ni variable.</p>
          <p className="mb-2">Por ejemplo, considere la decisión de producir que enfrenta un agricultor. El costo de la tierra es uno de los costos fijos que tiene. Si el agricultor decide no producir nada una temporada, la tierra se queda sin cultivar y no puede recuperar este costo. Al tomar la decisión a corto plazo de cerrar por una temporada, se dice que el costo fijo de la tierra es un costo hundido. Por otro lado, si el agricultor decide dejar de cultivar por completo, puede vender la tierra. Al tomar la decisión a largo plazo de salir del mercado, el costo de la tierra no es hundido.</p>
          <p className="mb-2">Ahora considere qué determina la decisión de cierre de una empresa. Si la empresa cierra, pierde todos los ingresos que obtendría de la venta de su producto. Al mismo tiempo, se ahorra el costo variable de producir el bien (pero aun así tiene que pagar los costos fijos). Así, la empresa cierra si el ingreso que obtendría de producir es menor que los costos variables de la producción.</p>
          <p className="mb-2">Un poco de matemática puede hacer más útil este criterio de cierre. Si IT representa los ingresos totales y CV representa el costo variable, la decisión de cierre de la empresa se puede escribir así:</p>
          <p className="mb-2"><b>Cerrar si IT &lt; CV.</b></p>
          <p className="mb-2">La empresa cierra si los ingresos totales son menores que el costo variable. Al dividir ambos lados de esta desigualdad por la cantidad Q, podemos escribir:</p>
          <p className="mb-2"><b>Cerrar si IT/Q &lt; CV/Q.</b></p>
          <p className="mb-2">El lado izquierdo de la desigualdad, IT/Q, es ingresos totales P × Q dividido por la cantidad Q, que es el ingreso promedio, expresado simplemente como el precio del bien, P. El lado derecho de la desigualdad, CV/Q, es el costo variable promedio, CVP.</p>
          <p className="mb-2">Por tanto, el criterio de cierre se puede reescribir como:</p>
          <p className="mb-2"><b>Cerrar si P &lt; CVP.</b></p>
          <p className="mb-2">Esto es, una empresa decide cerrar si el precio del bien es menor que el costo de producción variable promedio. Este criterio es intuitivo: cuando la empresa opta por producir, compara el precio que recibe por una unidad típica con el costo variable promedio en el que debe incurrir para producirla. Si el precio no cubre el costo variable promedio, la empresa estará mejor si deja de producir por completo. La empresa pierde dinero de todos modos, (porque tiene que pagar los costos fijos), pero perdería más si sigue operando. La empresa puede reabrir en el futuro si las condiciones cambian y el precio supera el costo variable promedio.</p>
          <p className="mb-2">Ahora tenemos una descripción completa de la estrategia de maximización de beneficios de una empresa. Si la empresa produce algo, producirá la cantidad en la que el costo marginal es igual al precio del bien. Sin embargo, si el precio es menor que el costo variable promedio en esa cantidad, la empresa estará mejor si cierra y no produce nada.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">La decisión de la empresa de entrar o salir del mercado a largo plazo</h3>
          <p className="mb-2">La decisión de una empresa de salir a largo plazo del mercado es similar a la decisión de cerrar por un tiempo. Si la empresa decide salir, perderá todos los ingresos de las ventas de su producto, pero ahorrará no sólo sus costos variables, sino también sus costos fijos. Por consiguiente, la empresa sale del mercado si el ingreso que obtendría de producir es menor que sus costos totales.</p>
          <p className="mb-2">Podemos aplicar de nuevo este criterio de una forma más útil si los escribimos en términos matemáticos. Si IT representa los ingresos totales y CT los costos totales, el criterio de salida de la empresa se puede escribir así:</p>
          <p className="mb-2"><b>Salir si IT &lt; CT.</b></p>
          <p className="mb-2">La empresa saldrá del mercado si los ingresos totales son menores que los costos totales. Al dividir ambos lados de esta desigualdad por la cantidad Q, podemos escribirla así:</p>
          <p className="mb-2"><b>Salir si IT/Q &lt; CT/Q.</b></p>
          <p className="mb-2">Para simplificar esto todavía más, advertimos que IT/Q es el ingreso promedio, que es igual al precio P, y que CT/Q es el costo total promedio, CTP. Así, el criterio de salida de la empresa es:</p>
          <p className="mb-2"><b>Salir si P &lt; CTP.</b></p>
          <p className="mb-2">Es decir, la empresa decide salir si el precio del bien es menor que el costo total promedio de producción.</p>
          <p className="mb-2">Un análisis paralelo se aplica a un emprendedor que estudia la posibilidad de constituir una empresa, la cual entrará al mercado si esta acción es rentable, lo que ocurre si el precio del bien es mayor que el costo total promedio de la producción.</p>
          <p className="mb-2">El criterio de entrada es:</p>
          <p className="mb-2"><b>Entrar si P &gt; CTP.</b></p>
          <p className="mb-2">El criterio de entrada es exactamente lo contrario del criterio de salida.</p>
          <p className="mb-2">Ahora podemos describir la estrategia de maximización de beneficios a largo plazo de la empresa competitiva. Si la empresa opera en el mercado, producirá la cantidad en la que el costo marginal iguala el precio del bien. Sin embargo, si el precio es menor que el costo total promedio en esa cantidad, la empresa decide salir del mercado (o no entrar).</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">¿Por qué las empresas competitivas siguen operando si obtienen cero beneficios?</h3>
          <p className="mb-2">A primera vista puede parecer raro que las empresas competitivas no reciban beneficios a largo plazo. Después de todo, el propósito de las empresas es obtener beneficios. Si la entrada produce a la larga beneficios cero, no parece haber muchas razones para seguir operando. Para entender mejor la condición de cero beneficios o beneficios nulos, recuerde que los beneficios son iguales a los ingresos totales menos los costos totales y que estos últimos incluyen todos los costos de oportunidad de la empresa. En particular, los costos totales incluyen el tiempo y el dinero que los propietarios de la empresa invierten en el negocio. En el equilibrio de cero beneficios, los ingresos de la empresa deben compensar a los propietarios por estos costos de oportunidad.</p>
          <p className="mb-2">Considere un ejemplo. Suponga que para iniciar su empresa, un agricultor tuvo que invertir $1 millón, que de otra forma habría podido depositar en el banco y ganar $50 000 al año en intereses. Además, tuvo que dejar otro trabajo en el que le habrían pagado $30 000 al año. Entonces, el costo de oportunidad de cultivar la tierra incluye tanto el interés que el agricultor pudo haber ganado como el salario que dejó de percibir; es decir, un total de $80.000. Aunque sus beneficios sean cero, los ingresos por cultivar compensan estos costos de oportunidad.</p>
          <p className="mb-2 italic">Ver video: Milton Friedman - Historia de un lápiz</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">¿Hay competencia en el mundo Criptomonedas?</h3>
          <p className="mb-2">Desde el momento que Satoshi Nakamoto publicó el paper titulado Bitcoin: Un Sistema de pago Electrónico Usuario-a-Usuario, en el año 2009, inició una nueva revolución tecnológica y económica, un cambio de paradigma en lo que respecta al sector financiero internacional. Una red descentralizada, construida de forma colaborativa y cooperativa entre los usuarios, sin ningún tipo de limitación geográfica, una red que valiéndose de los desarrollos tecnológicos en materia criptográfica garantiza la seguridad de las transacciones y la protección del activo (como reserva de valor). Esto en contraste, con el sistema monetario tradicional, donde la emisión de monedas, se encuentra monopolizada por un organismo centralizado para cada país, conocidos como los Bancos Centrales, su objetivo es asegurar la estabilidad de los precios internos y velar por el valor de la moneda local, utilizando para ello distintos instrumentos de política monetaria.</p>
          <p className="mb-2">Con el pasar de los años, los errores cometidos por los gobiernos al momento de monitorear y regular el sistema financiero han lapidado poco a poco la confianza de los agentes económicos. Estos elementos han sido claves, en el crecimiento vertiginoso de las criptomonedas, especialmente del Bitcoin, una moneda que para la fecha cumple con las tres funciones del dinero: como medio de pago, reserva de valor y unidad de medida.</p>
          <p className="mb-2">La aceptación del Bitcoin a nivel mundial se ve reflejada en el volumen de sus transacciones. No obstante, su precio que inició con un valor aproximado de 0,06 centavos de dólar por bitcoin para agosto del año 2010, ha presentado un crecimiento exponencial, superando a principios del 2021 la barrera de los 63.000 dólares por bitcoin, este comportamiento es motivo de preocupación de algunos inversores y otros jugadores del mercado.</p>
          <p className="mb-2">Ahora bien al no ser un mercado regulado, es totalmente libre y más allá de ser aún muy volátil podríamos concluir que es sumamente competitivo.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">¿Cuánto sabemos de?</h3>
          <div className="space-y-4">
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <p className="mb-2"><b>1)</b> Una de las características de la competencia es la libre entrada al (y salida del) mercado. Esta característica garantiza que:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>a. Las empresas no puedan determinar el precio, puesto que lo determina el mercado</li>
                <li>b. Los beneficios de la empresa tenderán a ser mínimos o nulos</li>
                <li>c. El costo marginal sea mayor que el costo medio</li>
                <li>d. Ninguna de las respuestas anteriores</li>
              </ul>
              <p className="mt-2 text-sm text-[#ec4d58]"><b>Respuesta:</b> Los beneficios de la empresa tenderán a ser mínimos o nulos, porque en un Mercado con superbeneficios genera que ingresen más empresas y los beneficios para todas disminuye. Por el contrario si en el Mercado hay pérdidas genera salida de empresas de ese Mercado aumentando levemente el ingreso de las que quedan. Esto se da hasta que se equilibra salida y entrada de empresas en donde se da el beneficio nulo y no hay incentivos para salir o entrar.</p>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <p className="mb-2"><b>2)</b> Si una empresa de jugos decide imponer un precio mayor al de equilibrio, genera:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>a. que aumente sus ventas</li>
                <li>b. que disminuya sus ventas</li>
                <li>c. que se tenga que adecuar al precio de Mercado</li>
                <li>d. todas son correctas</li>
              </ul>
              <p className="mt-2 text-sm text-[#ec4d58]"><b>Respuesta:</b> que tenga que adecuar el precio al que vende al precio de Mercado, dado que al ser un Mercado de competencia perfecta hay miles de empresas que ofrecen el mismo bien y si no se quiere quedar sin Mercado tundra que adaptarse. El precio es un "dato" que me brinda el Mercado.</p>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <p className="mb-2"><b>3)</b> Si un empresario quiere cobrar mucho menos del precio de equilibrio por el producto que ofrece, genera:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>a. que venda muchísimo más</li>
                <li>b. que obtenga grandes beneficios</li>
                <li>c. no ocurre nada</li>
                <li>d. tendrá que subir el precio</li>
              </ul>
              <p className="mt-2 text-sm text-[#ec4d58]"><b>Respuesta:</b> tundra que subir el precio y adecuarse al precio de equilibrio porque sino se queda sin oferta, un precio más bajo agota la oferta rápidamente y para contentar al Mercado tundra que subir el precio nuevamente.</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Bibliografía</h3>
          <ul className="list-disc list-inside">
            <li>Mankiw, N. Gregory, Principles of Economics, Sixth Edition, South-Western, Cengage Learning, 2012</li>
            <li>Tetaz, Martín, Economía para Abogados, UNLP, 2006</li>
          </ul>
        </section>

        {/* Botón Volver al final del texto, del lado izquierdo */}
        <div className="mt-8">
          <BackButton />
        </div>
      </div>
    </div>
  );
} 





