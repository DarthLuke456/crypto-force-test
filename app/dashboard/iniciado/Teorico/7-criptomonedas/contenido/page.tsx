import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Modulo7ContenidoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="w-full max-w-3xl border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-transparent relative" style={{paddingTop: '3.5rem'}}>
        {/* Botón Volver arriba */}
        <Link
          href="/dashboard/iniciado/7-criptomonedas"
          className="absolute left-4 top-4 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Módulo 7: Criptomonedas
        </h1>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
          Herramientas Económicas e Introducción al Mundo de las Criptomonedas
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h3>Introducción a las Criptomonedas</h3>
          <p>En 2008, casi en silencio, un hasta ahora desconocido Satoshi Nakamoto publicó el whitepaper de Bitcoin que iniciaba la era de las criptomonedas. En ese documento, se proponía &quot;un sistema de dinero electrónico persona a persona&quot; que revolucionaba todo lo conocido: no requería de ninguna empresa o autoridad que gobernara la plataforma.</p>
          <p>De este modo, la &quot;confianza&quot; de la divisa no estaría a cargo de un Estado emisor o compañías procesadoras de pago, sino en los propios individuos, la blockchain, el consenso del ecosistema y el robusto esquema criptográfico que permitía las transacciones.</p>
          <p>Así, aparecieron otras monedas de esta &quot;primera generación&quot;, como Monero y Litecoin. Pero en 2014 apareció Ethereum y dio inicio a la segunda: puso el foco no sólo en las transacciones, sino en la posibilidad de generar contratos inteligentes dentro de la cadena de bloques. Es decir, programas que ejecutan acciones de manera automática ante ciertos sucesos, como depósitos, transferencias, inversiones, distribución de ganancias, etcétera.</p>
          <p>Sin embargo, tanto Bitcoin como Ethereum presentan problemas para ciertos casos de uso que, hasta el momento, no se han podido solucionar. Y, a pesar de ser las dos plataformas líderes -representan el 61% y el 12%, respectivamente, de la capitalización total del mercado cripto-, emergieron redes de &quot;tercera generación&quot; para resolver esas limitaciones.</p>
          <p>Estas nuevas propuestas brindan una oportunidad para quienes deseen lograr alguna ganancia a corto plazo: como valen algunos dólares -incluso, algunas hasta valen centavos- es posible realizar una apuesta baja en estas divisas y multiplicar varias veces la inversión hasta que el activo estabilice su precio.</p>
          <h3>¿Qué es un Rig de minería?</h3>
          <p>Seguramente en alguna conversación del mundo cripto con tus amigos habrás escuchado o leído la palabra &quot;Rig&quot;, y te has preguntado ¿Qué es un Rig de minería?</p>
          <p>Un Rig de minería es un arreglo de elementos de hardware, bien sea de CPU, GPU, FPGA o ASIC que han sido dispuestos para realizar minería de criptomonedas. ¿Sencillo, no crees? La verdad es que sí, es un concepto muy sencillo, pero hacerlo una realidad es lo complejo. ¿Por qué? Porque no basta con solo unir estos elementos así porque, hay que hacerlo de la mejor manera para que la inversión que realices, sea una inversión que a largo plazo puedas recuperar con ganancias.</p>
          <h3>Tipos de Rig de minería</h3>
          <p>Los Rig pueden se pueden clasificar dependiendo del tipo de hardware minero que usen. En tal caso, los tipos de Rig de minería existentes hasta el momento son:</p>
          <h4>CPU</h4>
          <p>Uno de los rigs de minería más sencillos de instalar y configurar son los rigs CPU, los cuales no son más que varios ordenadores instalados juntos para minar una criptomoneda específica que pueda ser minada usando estos dispositivos.</p>
          <p>Para lograr maximizar el rendimiento los mineros buscaban procesadores con múltiples núcleos o tarjetas madre de múltiples CPU, todo con el fin de maximizar la potencia de minería a su favor. Incluso se llegaban a construir clústeres de computación, pequeños superordenadores que aprovechaban de forma más óptima el poder cómputo de todos los ordenadores más pequeñas por separado.</p>
          <p>Sin embargo, la llegada de la minería por GPU, FPGA y ASIC rápidamente los reemplazó, aunque hay criptomonedas como Monero (XMR) que aún sacan provecho de la minería por CPU.</p>
          <h4>GPU</h4>
          <p>Los rigs de GPU son de los más populares hoy en día, debido a que se pueden usar para minar criptomonedas como Ethereum (ETH), Ethereum Classic (ETC), Zcash (ZEC), entre otras. En un Rig de minería GPU lo que tenemos es un ordenador al que conectamos varios GPU o tarjetas gráficas para usarlas como aceleradores de minería. Cada GPU actúa como un nodo de minería que ofrece una enorme potencia, y esa potencia es multiplicada por los GPUs instalados en el Rig.</p>
          <p>Debido a la facilidad de montaje y bajo mantenimiento de los mismos, los Rigs GPU son el elemento de minería favorito de los pequeños mineros de criptomonedas. Además son altamente versátiles. Por ejemplo, si un minero se dedica a minar Ethereum con un Rig y este deja de ser viable, puede utilizar el Rig para minar alguna otra criptomoneda simplemente cambiando el programa de minería y dirigiéndolo a otra criptomoneda.</p>
          <h4>FPGA</h4>
          <p>Los FPGA son otra herramienta muy usada para minar criptomonedas en su momento. En su momento ofrecían una buena capacidad de minería para distintas criptomonedas, pero la optimización de la minería GPU y la llegada de los ASIC terminó desplazándolos por completo.</p>
          <h4>ASIC</h4>
          <p>La herramienta más usada en la actualidad por los mineros son los ASIC o Circuitos Integrados para Aplicaciones Específicas. Estos son dispositivos de hardware diseñados especialmente para realizar una tarea muy específica. De allí que, los mineros ASIC sean tan potentes pues han sido diseñados para sacar el máximo de potencia posible para tal fin.</p>
          <h3>¿Cómo armar un Rig de minería?</h3>
          <p>En este punto seguramente la gran pregunta que ronda por tu mente es ¿Cómo creo un Rig de minería? La respuesta a esta pregunta es un poco compleja porque depende de diferentes factores que debes tomar en cuenta para ello.</p>
          <p>Por ejemplo, pregúntate lo siguiente ¿Piensas minar desde casa? ¿Quieres un recibo de electricidad excesivamente alto y tu configuración eléctrica lo permite? ¿Tienes espacio para poner un Rig de minería que no te moleste a ti o a los vecinos? ¿Cuánto planeas invertir? ¿Qué conocimiento tienes sobre los elementos que pueden formar un Rig? ¿Qué monedas vas a minar exactamente? ¿Cuánta viabilidad de minería deseas alcanzar?</p>
          <p>La verdad es que son muchas preguntas, pero son necesarias porque las respuestas que des a cada una de ellas te darán una idea como deberás armar tu Rig para sacarle el mejor provecho. Por poner un ejemplo, no es lo mismo minar Ethereum desde tu cuarto usando un Rig de cuatro GPUs, que hacerlo con un Rig de cuatro ASICs, entre otras cosas porque no podrás dormir debido al ruido de los ASICs.</p>
          <h3>Dogecoin</h3>
          <p>El Dogecoin es una criptomoneda inventada por los ingenieros de software Billy Markus y Jackson Palmer. La pareja creó un sistema de pago instantáneo, divertido y libre de los cargos bancarios tradicionales. El Dogecoin se representa con la cara del perro Shiba Inu del meme "Doge" como su logotipo y homónimo.</p>
          <h4>El Dogecoin comenzó como una broma</h4>
          <p>El director ejecutivo de Tesla (NASDAQ:TSLA), Elon Musk, ha sido un gran fan del Dogecoin estos últimos meses. El 1 de abril, tuiteó: &quot;SpaceX va a mandar el Dogecoin a la luna literalmente&quot;. En febrero, tuiteó, &quot;Doge&quot; seguido de &quot;El Dogecoin es la criptomoneda del pueblo&quot;. El talento de Elon Musk para convertir al ingeniero nerd en el nuevo &quot;tío guay&quot; impulsó los precios del Dogecoin un 50% tras este tweet.</p>
          <p>Musk no es el único famoso partidario del Dogecoin. No es de extrañar que la criptomoneda llamara la atención del rapero Snoop Dogg, que puso un Shiba Inu &quot;Snoop Doge&quot; en la portada de un álbum. Mientras tanto, el exbajista de KISS, Gene Simmons, se ha apodado a sí mismo &quot;el dios del Dogecoin&quot;.</p>
          <p>Esta moneda alternativa que comenzó como una broma se ha beneficiado de una oleada de apoyo público positivo por parte de las celebridades. Su capitalización de mercado asciende a más de 40.000 millones de dólares; eso no es ninguna broma.</p>
          <p>Las 10 principales criptomonedas tienen capitalizaciones de mercado de más de 18.000 millones de dólares. El exclusivo grupo representa menos del 0,11% del número total de monedas digitales que flotan por el ciberespacio. El Dogecoin es miembro de este estimado grupo. A fecha de 28 de abril, se negociaba a más de 32 centavos, con una capitalización de mercado de alrededor de 40.000 millones de dólares.</p>
          <h4>Bibliografía</h4>
          <ul>
            <li>https://es.investing.com/analysis/el-dogecoin-explota-la-broma-criptografica-se-convierte-en-una-bestia-del-sector-200443205</li>
          </ul>
        </div>
        {/* Botón Volver abajo */}
        <div className="mt-8">
          <Link
            href="/dashboard/iniciado/7-criptomonedas"
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





