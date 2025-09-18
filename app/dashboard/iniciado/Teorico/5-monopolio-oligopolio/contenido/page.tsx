import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Modulo5ContenidoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="w-full max-w-3xl border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-transparent relative" style={{paddingTop: '3.5rem'}}>
        {/* Botón Volver arriba */}
        <Link
          href="/dashboard/iniciado/Teorico/5-monopolio-oligopolio"
          className="absolute left-4 top-4 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Módulo 5: Monopolio y Oligopolio
        </h1>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
          Herramientas Económicas e Introducción al Mundo de las Criptomonedas
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h3>Monopolio</h3>
          <p>Si usted es propietario de una computadora personal, probablemente utilice alguna versión de Windows, el sistema operativo que vende Microsoft Corporation. Hace muchos años, cuando Microsoft diseñó Windows, solicitó a las autoridades gubernamentales los derechos de propiedad intelectual, mismos que se le otorgaron. Tales derechos otorgan a Microsoft el derecho exclusivo de fabricar y vender copias del sistema operativo Windows. Por tanto, si una persona quiere comprar una copia de Windows, no le queda más remedio que pagar a Microsoft unos cuantos dólares, que es el precio que la empresa ha decidido establecer para su producto. Se dice que Microsoft tiene un monopolio en el mercado de Windows.</p>
          <p>Mientras que una empresa competitiva es tomadora de precios, un monopolio es creador de precios. Una empresa competitiva toma el precio de su producto que determina el mercado y decide la cantidad de este que ofrecerá para que el precio sea igual al costo marginal. En cambio, un monopolio establece un precio superior al costo marginal. Este resultado es claramente cierto en el caso del sistema operativo Windows de Microsoft. El costo marginal de Windows (el costo adicional en el que incurre Microsoft al imprimir una copia más del programa en un CD) es de sólo algunos dólares, pero el precio de mercado de Windows es muy superior al costo marginal.</p>
          <h3>Por qué surgen los monopolios</h3>
          <p>Una empresa es un monopolio si es la única que vende un producto y si este producto no tiene sustitutos cercanos. La causa fundamental del monopolio es erigir barreras de entrada: un monopolio es el único vendedor en su mercado, porque otras empresas no pueden entrar a éste y competir con él. A su vez, las barreras de entrada tienen tres causas principales:</p>
          <ul>
            <li>Recursos del monopolio: un recurso clave para la producción es propiedad de una sola empresa.</li>
            <li>Regulaciones del gobierno: las autoridades conceden a una sola empresa el derecho exclusivo de fabricar un producto o servicio.</li>
            <li>Proceso de producción: una sola empresa produce a un costo menor que un gran número de productores.</li>
          </ul>
          <h4>Recursos del monopolio</h4>
          <p>La manera más sencilla de que surja un monopolio es que una sola empresa sea propietaria de un recurso clave. Por ejemplo, considere el mercado del agua de un pequeño pueblo. Si docenas de habitantes del pueblo tienen pozos en funcionamiento, el modelo competitivo analizado anteriormente describe la conducta de los vendedores. Como consecuencia de la competencia entre los proveedores de agua, el precio del litro llega a ser igual al costo marginal de extraer un litro adicional. Pero si en el pueblo hay sólo un pozo y es imposible extraer agua de otros lugares, el propietario del pozo tiene el monopolio del agua. Como cabría esperar, el monopolista tiene mucho más poder de mercado que cualquier empresa en un mercado competitivo. En el caso de un artículo de primera necesidad, como el agua, el monopolista podría establecer un precio muy alto, aun cuando el costo marginal de extraer un litro de agua más sea bajo.</p>
          <h4>Monopolios creados por el gobierno</h4>
          <p>En muchos casos, los monopolios surgen porque el gobierno ha otorgado a una persona o a una empresa el derecho exclusivo de vender un bien o servicio. A veces el monopolio es fruto únicamente del poder político del aspirante a monopolio. Por ejemplo, en la antigüedad, los reyes concedían a sus amigos y aliados licencias de negocios exclusivas. Otras veces, los gobiernos conceden monopolios porque consideran que hacerlo es en aras del interés público. La legislación sobre patentes y derechos de propiedad intelectual son dos importantes ejemplos.</p>
          <h4>Monopolios naturales</h4>
          <p>Una industria es un monopolio natural cuando una sola empresa puede ofrecer un producto o servicio al mercado completo a menor costo que dos o más empresas. Un monopolio natural surge cuando hay economías de escala en el rango de producción relevante. En este caso, una sola empresa puede producir cualquier cantidad al menor costo posible. Es decir, para una cantidad de producción cualquiera, una mayor cantidad de empresas produce menos por empresa y a un costo total promedio mayor.</p>
          <h3>Cómo toman los monopolios sus decisiones de producción y fijación de precios</h3>
          <p>La curva de la demanda del mercado limita la capacidad del monopolio de beneficiarse de su poder de mercado. Un monopolio preferiría, de ser posible, establecer un precio alto y vender una gran cantidad a ese precio alto, pero la curva de la demanda del mercado se lo impide. En concreto, la curva de la demanda del mercado describe las combinaciones de precio y cantidad disponibles para un monopolio dado. Mediante ajustes a la cantidad producida (o, de modo equivalente, al precio establecido), el monopolio puede elegir cualquier punto de la curva de la demanda, pero no puede elegir ninguno que se encuentre fuera de esta curva. ¿Qué precio y cantidad de producción elegirá el monopolio? Suponemos que, al igual que en el caso de las empresas competitivas, la meta del monopolio es maximizar los beneficios.</p>
          <p>Como una empresa competitiva puede vender todo lo que desee al precio de mercado, no se produce ningún efecto-precio. Cuando produce una unidad más, recibe el precio de mercado por esa unidad y no recibe menos por las unidades que ya vendía. Es decir, como la empresa competitiva es tomadora de precios, su ingreso marginal es igual al precio de su producto. En cambio, cuando un monopolio produce una unidad más, debe reducir el precio que establece por cada una de las unidades que vende, y esta disminución del precio causa una reducción del ingreso generado por las unidades que ya vendía. Como consecuencia, el ingreso marginal del monopolio es menor que el precio de su producto.</p>
          <p>Un monopolio maximiza beneficios cuando selecciona la cantidad de producción a la cual el ingreso marginal es igual al costo marginal. Después utiliza la curva de la demanda para encontrar el precio que inducirá a los consumidores a comprar esa cantidad.</p>
          <h3>Medicamentos monopólicos frente a medicamentos genéricos</h3>
          <p>Con base en nuestro análisis, los precios se determinan de forma muy distinta en los mercados monopólicos y en los mercados competitivos. Un lugar lógico para probar esta teoría es el mercado de los medicamentos, ya que éste tiene los dos tipos de estructura. Cuando una empresa descubre un medicamento nuevo, la legislación sobre patentes le otorga el monopolio de la venta de dicho fármaco. Sin embargo, con el tiempo, cuando caduca la patente, cualquier empresa puede fabricar y vender el fármaco. En este momento el mercado deja de ser un monopolio y se convierte en un mercado competitivo.</p>
          <h3>El costo de los monopolios para el bienestar</h3>
          <p>¿Es el monopolio una buena forma de organizar el mercado? Hemos visto que un monopolio, a diferencia de una empresa competitiva, establece un precio superior al costo marginal. Desde el punto de vista de los consumidores, el monopolio no es deseable debido a este alto precio. Sin embargo, al mismo tiempo, el monopolio obtiene beneficios de establecer este precio alto. Desde el punto de vista de los propietarios de la empresa, el monopolio es muy deseable debido a este precio alto. ¿Es posible que los beneficios obtenidos por los propietarios de la empresa sean superiores al costo social impuesto a los consumidores y que, por tanto, el monopolio sea deseable desde el punto de vista de la sociedad? Podemos responder a esta pregunta utilizando los instrumentos de la economía del bienestar.</p>
          <h3>El análisis de la discriminación de precios</h3>
          <p>Veamos en términos un poco más formales cómo afecta la discriminación de precios al bienestar económico. Empecemos por suponer que el monopolio puede practicar la discriminación de precios perfecta. La discriminación de precios perfecta describe una situación en la que el monopolio conoce exactamente la disposición a pagar de cada cliente y así puede establecer un precio diferente para cada uno. En este caso, el monopolio cobra a cada cliente exactamente el precio que está dispuesto a pagar y el monopolio obtiene todo el excedente de cada transacción.</p>
          <h3>Política pública sobre los monopolios</h3>
          <p>Hemos visto que los monopolios, a diferencia de los mercados competitivos, no distribuyen eficientemente los recursos. Los monopolios producen una cantidad inferior a la que es socialmente deseable y, como resultado, establecen precios superiores al costo marginal. Los diseñadores de políticas del sector público pueden responder al problema del monopolio en una de las cuatro maneras siguientes:</p>
          <ul>
            <li>Tratar de que las industrias que funcionan como monopolios sean más competitivas.</li>
            <li>Regular la conducta de los monopolios.</li>
            <li>Convertir algunos monopolios privados en empresas públicas.</li>
            <li>No hacer nada.</li>
          </ul>
          <h3>Oligopolio</h3>
          <p>El mercado de las pelotas de tenis es un ejemplo de un oligopolio. La esencia de un mercado oligopólico es que hay muy pocos vendedores. Como resultado, las acciones de cualquiera de los vendedores en el mercado pueden tener un gran impacto en los beneficios de los otros vendedores. Las empresas oligopólicas son interdependientes de una forma en que las empresas competitivas no lo son.</p>
          <h4>El equilibrio para un oligopolio</h4>
          <p>Las empresas oligopólicas quisieran formar cárteles y obtener beneficios de monopolio, pero muchas veces esto es imposible. Las riñas entre miembros del cártel sobre cómo dividir los beneficios del mercado pueden ocasionar que sea difícil llegar a un acuerdo. Además, las leyes antimonopolio prohíben expresamente los acuerdos entre oligopolistas, como cuestión de política pública. Incluso hablar sobre fijar precios y restricciones de producción entre competidores puede ser un delito.</p>
          <p>Si los duopolistas buscan cada uno por su cuenta satisfacer su interés propio cuando deciden cuánto producir, producirán una cantidad total mayor que la de monopolio, establecerán un precio inferior al precio de monopolio y obtendrán beneficios totales menores que los beneficios de monopolio.</p>
          <h4>El dilema del prisionero</h4>
          <p>El dilema del prisionero es una historia sobre dos delincuentes que han sido detenidos por la policía. Llamémoslos Bonnie y Clyde. La policía cuenta con pruebas suficientes para condenar a Bonnie y a Clyde por el delito menor de portar un arma de fuego no registrada, por lo que cada uno pasará un año en prisión. La policía también sospecha que los dos delincuentes asaltaron juntos un banco, pero carecen de pruebas concretas para condenarlos por este delito grave. La policía interroga a Bonnie y a Clyde en cuartos diferentes y le ofrece a cada uno el siguiente trato: ...</p>
          <p>(Contenido resumido para brevedad. El texto completo puede ser consultado en la bibliografía original.)</p>
          <h4>Bibliografía</h4>
          <ul>
            <li>Mankiw, N. Gregory, Principles of Economics, Sixth Edition, South-Western, Cengage Learning, 2012</li>
            <li>Tetaz, Martín, Economía para Abogados, UNLP, 2006</li>
          </ul>
        </div>
        {/* Botón Volver abajo */}
        <div className="mt-8">
          <Link
            href="/dashboard/iniciado/Teorico/5-monopolio-oligopolio"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Link>
        </div>
      </div>
    </div>
  );
} 
