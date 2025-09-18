import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Modulo8ContenidoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="w-full max-w-3xl border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-transparent relative" style={{paddingTop: '3.5rem'}}>
        {/* Botón Volver arriba */}
        <Link
          href="/dashboard/iniciado/8-operaciones-criptomonedas"
          className="absolute left-4 top-4 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Módulo 8: Operaciones con Criptomonedas
        </h1>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
          Herramientas Económicas e Introducción al Mundo de las Criptomonedas
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h3>Pasos para comprar y vender Criptomonedas</h3>
          <p>Para operar con criptomonedas se debe recurrir a una plataforma en la cual se abre una cuenta o billetera virtual "wallet" para poder comprar y vender. Es en la práctica una especie de "casa de cambio" digital.</p>
          <p>En la Argentina son varias las empresas que ofrecen este servicio. Entre las plataformas más conocidas se encuentran Ripio, Satoshi Tango, CryptoMarket, SeSocio, Bitso, Bitex, ArgenBTC y Buenbit.</p>
          <p>Para registrarse bastan los datos personales, foto del DNI y una selfie, para comprobar la identidad del usuario. Lo siguiente es ingresar el dinero, en pesos, que puede hacerse por transferencia desde una cuenta bancaria, otra billetera virtual como Mercado Pago por ejemplo, y en algunos casos en efectivo a través de locales como Pago Fácil o Rapipago.</p>
          <p>La acreditación de los fondos puede demorar entre uno ó dos días Y hay que aclarar que cada plataforma tiene límites en el monto que se puede operar.</p>
          <p>Una vez con los fondos en la wallet, el inversor ya puede comenzar a operar. Solo tiene que indicar en la plataforma qué criptomoneda y cuánto quiere comprar. La conversión se hace al tipo de cambio del momento. Las plataformas suelen imponer un monto mínimo de inversión, en algunos casos equivalente a 10 dólares.</p>
          <p>Uno de los alternativos más populares al Bitcoin es Ethereum, con una lógica similar. Pero también hay otros como el DAI o el USD Coin, conocidos como "stablecoins" porque su valor está vinculado al del dólar, lo que los vuelve opciones menos volátiles.</p>
          <h3>Comisiones por operar con criptomonedas</h3>
          <p>Las "casas de cambio" virtuales en las que se operan las criptomonedas cobran una comisión. Lo que hacen es fijar, para las distintas operaciones o movimientos, comisiones y cargos que conviene tener en cuenta antes de empezar a invertir.</p>
          <p>Por ejemplo, al depositar los pesos suelen quedarse con entre un 0,5% y el 6% de lo ingresado, dependiendo el monto y la modalidad. Luego, la compra-venta suele tener una comisión del 1%. A veces, pero no necesariamente siempre, puede haber un cargo extra por retirar la inversión, especialmente si se quiere tener el efectivo.</p>
          <h3>¿Qué hacer con las Criptomonedas?</h3>
          <p>Una vez que se es poseedor de criptomonedas las opciones son las mismas que con cualquier instrumento financiero. Es decir, se puede ahorrar esperando que suba su valor, o venderlo en el momento que se crea conveniente.</p>
          <p>Por supuesto también son transferibles a otras personas, en cualquier lugar del mundo, y pueden ser utilizadas para compras. Por caso, se viene incrementando la aceptación en los comercios, y ya incluso se utilizan para operaciones inmobiliarias, autos, hoteles cinco estrellas, etc. Importante saber que cada criptobilletera tiene un código propio que opera como si fuese el CBU.</p>
          <h3>Las criptomonedas como mecanismo de financiación de empresas</h3>
          <p>En la actualidad, las empresas tienen pretensiones de poder captar grandes cantidades de dinero para poder financiar sus proyectos en días o horas de cualquier parte del mundo. Poco a poco está aspiración se está convirtiendo en una realidad gracias a la irrupción de nuestras vidas del blockchain.</p>
          <p>El Blockchain parece un fenómeno que al principio parecía reservados a ciertos expertos, pero que ahora ha atraído el interés de empresas de todo tipo de clase, así como de inversores profesionales y minoristas, a través de las ofertas iniciales de criptomonedas (Initial Coin Offering, o más conocido como ICO).</p>
          <p>Las ICOs consisten en la emisión por parte del solicitante de la financiación de un determinado activo de digital, denominado tokens, a cambio de dinero de curso oficial, es decir, euros o dólares estadounidenses, o de criptomonedas como bitcoin que los inversores aportan para comprar dichos tokens.</p>
          <p>Está nueva forma de financiación ha captado hasta este momento 4.600 millones de dólares estadounidenses, a través de unos 430 ICOs, según la asociación "Crypto Valley Association suiza", y ya está recaptando y canalizando dinero hacía proyectos de blockchain del invertido por fondos de venture capital tradicionales.</p>
          <p>La popularización de este tipo de financiación de la ICOs ha captado la atención de los reguladores por su potencial para aglutinar fondos de los diferentes usuarios, su carácter de romper las barreras nacionales y sus características que no están recogidas dentro de las normativas legales nacionales actuales.</p>
          <h4>Regulación en Estados Unidos</h4>
          <p>El primer regulador en intentar normalizarlo ha sido el de Estados Unidos (la SEC), quien ha analizado la emisión de "The DAO", para llegar a la conclusión que los tokens emitidos deben considerar como securities (valores negociables) aplicando el &apos;Test de Howey&apos;.</p>
          <p>En el contexto de tokens de blockchain, la prueba de Howey se puede expresar como tres independientes elementos:</p>
          <ul>
            <li>Una inversión de dinero.</li>
            <li>En una empresa común.</li>
            <li>Con una expectativa de ganancias predominantemente de los esfuerzos de otros.</li>
          </ul>
          <p>Los tres elementos se deben cumplir para que un token sea un valor. El tercer elemento abarca tanto la tercera como la cuarta punta del Howey tradicional prueba. Si se tiene la intención de recaudar grandes cantidades de capital de inversores, que es de lo que se trata ICO, para hacerlo debe vender un valor.</p>
          <p>Para crear un token de utilidad en Estados Unidos se debe establecer un precio fijo (puede ser gratuito o decir 1 dólar estadounidense). Entonces nadie lo compraría como una inversión, solo lo comprarían por su valor como dispositivo que proporciona la función. Esta es una manera excelente de obtener dinero de personas que las necesitan, pero totalmente inútiles para recaudar grandes cantidades de capital, lo cual es el punto de partida para que la SEC lo quiera regular.</p>
          <h4>Regulación en Europa</h4>
          <p>En Europa, existen 2 declaraciones emitidas por la Autoridad Europea de Mercados y Valores (ESMA) en noviembre del año pasado. En la primera declaración, ESMA establece que, en los casos en que las monedas o tokens se califiquen como instrumentos financieros, es probable que estén ofreciendo valores negociables y realizando actividades reguladas de colocación, negociación o asesoramiento sobre instrumentos financieros o de gestión o comercialización de entidades de inversión colectiva.</p>
          <p>En la segunda declaración, la ESMA advierte que existen varios riesgos a los que se exponen los inversores en ICOs.</p>
          <h3>Principales sectores donde se usan criptomonedas</h3>
          <p>El uso de criptomonedas no solo se ha limitado a inversionistas que compran y venden este activo. Estos son los principales sectores que usan criptomonedas y se benefician de sus ventajas:</p>
          <h4>Sector financiero</h4>
          <p>Hoy en día, el sector bancario, que durante mucho tiempo se ha ceñido a procesos tediosos, ha empezado a experimentar el cambio. La tecnología blockchain permite realizar transacciones globales seguras y sin fisuras en cuestión de minutos. Las criptomonedas ofrecen una moneda digital y una plataforma para que los bancos y los usuarios realicen transacciones. Esto es solo una punta de los cambios que se avecinan.</p>
          <h4>Industria de los casinos</h4>
          <p>La industria de los casinos ha adoptado la tecnología de vanguardia para sobrevivir. La mayoría de las marcas de casinos están en la red y muchas aceptan criptodivisas en sus pagos. Plataformas de juego como bspin aceptan ahora bitcoins, aceptando así a jugadores de todo el mundo. Las transacciones de casino en criptomonedas son ahora más seguras y rápidas. También hay criptodivisas dirigidas a los juegos de azar y otros sectores del entretenimiento.</p>
          <h4>Industria musical</h4>
          <p>Los creadores de contenidos, como los músicos, han sufrido durante mucho tiempo en manos de los productores. Es difícil vender contenido incluso en esta era digital y aquí es donde la tecnología blockchain y las criptomonedas son útiles. XRP es una de las criptodivisas que marcan tendencia y que están dirigidas a los creadores de contenido. Al eliminar a los intermediarios, esta tecnología permite a los músicos beneficiarse directamente. También permite a los consumidores acceder a los contenidos y pagar por ellos fácilmente.</p>
          <h4>Empresas que aceptan las criptomonedas como forma de pago</h4>
          <p>Hace una década, el dinero virtual todavía era una realidad ambigua, pero hoy forma parte del núcleo de algunas empresas. Si hablamos de criptomonedas como medio digital de intercambio, lo más lógico es enlazarlo al año 2009 con el nacimiento del bitcoin, pero si lo hacemos como inclusión en las grandes organizaciones, quizás, la fecha sea más actual.</p>
          <p>Se dice que 2017 fue el año del cambio, y es que las criptomonedas fueron el fenómeno revolucionario del sistema financiero. Han sido tildadas de burbuja cientos de veces, e incluso la falta de un sustento oficial ha hecho dudar a muchos de su condición.</p>
          <p>Grandes nombres como KFC, Microsoft, Fotocasa y Subway forman parte del círculo de las criptomonedas. Las han incluido en sus medios económicos porque han visto en ellas una manera eficiente de llevar a cabo los pagos. Ha entrado a formar parte de su estructura, sobre todo por las ventajas que ofrecen.</p>
          <p>Las razones por las que estas y otras compañías están barajando las monedas virtuales entre sus alternativas de pago:</p>
          <ul>
            <li>Han encontrado una manera efectiva de intercambiar el valor.</li>
            <li>Han tomado conciencia de las ventajas de tener el poder sobre su dinero.</li>
            <li>Los pagos se vuelen más transparentes, más instantáneos y más seguros.</li>
            <li>El coste es más bajo y el dinero se puede rastrear.</li>
            <li>Creen que rompen con el ciclo de dependencia financiera.</li>
          </ul>
          <p>Son los efectos de una revolución estrechamente relacionada con las ventajas de internet. Tanto, que ya se habla del Internet del valor para hacer referencia al intercambio de este en forma de criptomonedas. No tiene por qué ser dinero como tal, sino que los contratos, las acciones o incluso la propiedad intelectual también forman parte de aquellas cosas que tienen valor para la sociedad.</p>
          <h3>¿Y en Argentina?</h3>
          <p>Según el sitio www.coinmap.org, que registra todos los locales que dan la posibilidad de pagar con bitcoin en el mundo (hoy son 14.718), a nivel local ya son 215 los comercios que habilitaron este medio de intercambio. Eran 150 en 2018 y 100 en 2017. Además, la mitad de ellos se encuentra en la Capital Federal, con mayor densidad en microcentro, San Telmo, Retiro y Barrio Norte.</p>
          <p>Hay desde heladerías, casas de indumentaria y farmacias hasta restaurantes, hoteles y agencias de viajes, pasando por delivery de sushi, librerías y supermercados chinos. Algunos de ellos son: Hotel Argenta Tower, Conexión a Tierra (productos de jardinería), BitCofee (café/bar), ArtCopy (librería), Hostel Rock, Pet's Home (veterinaria), Allegro (heladería), Ediciones LEE (editorial), Hotel Viejo Telmo, Galería del Asombro (museo), Sports Rock and Bar, Subway Puerto Madero y Doble Seis Bar.</p>
          <h4>¿Por qué las criptomonedas están penetrando cada vez más sectores?</h4>
          <p>Más de un tercio de la población mundial no tiene acceso a servicios bancarios básicos que puedan ayudarlos en caso de una crisis financiera personal: préstamos o cuentas corrientes. Estas personas, que en la mayoría de los casos ya se encuentran en desventaja financiera, suelen recurrir a prácticas crediticias dudosas y peligrosas. La tasa de interés de estas prácticas es cualquier cosa menos justa, lo que en consecuencia conduce a una mayor inestabilidad entre las personas que solicitaron el préstamo.</p>
          <p>Y es en estos casos donde entran las criptomonedas con su alta seguridad y facilidad de uso. En la actualidad existen muchas aplicaciones y programas que facilitan el uso de las criptomonedas y las acercan a un público más amplio. Un beneficio adicional del uso de criptomonedas es que está completamente descentralizado, por lo que el comercio se puede realizar libremente a través de las fronteras. El uso de la tecnología facilitará una revolución financiera que aumentará la cantidad de sectores donde se usan criptomonedas y también dejará a todos más conectados, empoderados y habilitados financieramente.</p>
          <p>Debido a que las criptomonedas y blockchain no necesitan un edificio físico real para existir, los costes asociados con su transacción son mínimos. No hay necesidad de pagar los salarios de los empleados, las facturas de servicios públicos o el alquiler. Por lo que estos ahorros se transforman naturalmente en tarifas de transacción bajas. Esto, a su vez, alienta a más personas a confiar en estas nuevas herramientas financieras y comenzar a realizar transacciones, lo que permite que la economía global esté más entrelazada.</p>
          <h4>Bibliografía</h4>
          <ul>
            <li>https://academy.bit2me.com</li>
            <li>www.coinmap.org</li>
          </ul>
        </div>
        {/* Botón Volver abajo */}
        <div className="mt-8">
          <Link
            href="/dashboard/iniciado/8-operaciones-criptomonedas"
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





