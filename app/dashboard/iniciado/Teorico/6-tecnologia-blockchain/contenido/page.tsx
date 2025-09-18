import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export default function Modulo6ContenidoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="w-full max-w-3xl border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-transparent relative" style={{paddingTop: '3.5rem'}}>
        {/* Botón Volver arriba */}
        <Link
          href="/dashboard/iniciado/6-tecnologia-blockchain"
          className="absolute left-4 top-4 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Módulo 6: La Tecnología Blockchain
        </h1>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
          Herramientas Económicas e Introducción al Mundo de las Criptomonedas
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h3>Funcionamiento de la tecnología criptográfica</h3>
          <p>Básicamente, la criptografía es la técnica que protege documentos y datos. Funciona a través de la utilización de cifras o códigos para escribir algo secreto en documentos y datos confidenciales que circulan en redes locales o en internet. Su utilización es tan antigua como la escritura. Los romanos usaban códigos para ocultar sus proyectos de guerra de aquellos que no debían conocerlos, con el fin de que sólo las personas que conocían el significado de estos códigos descifren el mensaje oculto.</p>
          <p>A partir de la evolución de las computadoras, la criptografía fue ampliamente divulgada, empleada y modificada, y se constituyó luego con algoritmos matemáticos. Además de mantener la seguridad del usuario, la criptografía preserva la integridad de la web, la autenticación del usuario así como también la del remitente, el destinatario y de la actualidad del mensaje o del acceso.</p>
          <p>Criptografía es la ciencia y arte de escribir mensajes en forma cifrada o en código. Es parte de un campo de estudios que trata las comunicaciones secretas, usadas, entre otras finalidades, para:</p>
          <ul>
            <li>Autentificar la identidad de usuarios</li>
            <li>Autentificar y proteger el sigilo de comunicaciones personales y de transacciones comerciales y bancarias</li>
            <li>Proteger la integridad de transferencias electrónicas de fondos</li>
          </ul>
          <p>Un mensaje codificado por un método de criptografía debe ser privado, o sea, solamente aquel que envió y aquel que recibe debe tener acceso al contenido del mensaje. Además de eso, un mensaje debe poder ser suscrito, o sea, la persona que la recibió debe poder verificar si el remitente es realmente la persona que dice ser y tener la capacidad de identificar si un mensaje puede haber sido modificado.</p>
          <p>Los métodos de criptografía actuales son seguros y eficientes y basan su uso en una o más llaves. La llave es una secuencia de caracteres, que puede contener letras, dígitos y símbolos (como una contraseña), y que es convertida en un número, utilizada por los métodos de criptografía para codificar y decodificar mensajes.</p>
          <h4>Tipos de claves criptográficas</h4>
          <p>Las claves criptográficas pueden ser básicamente de dos tipos:</p>
          <ul>
            <li><strong>Simétricas:</strong> Es la utilización de determinados algoritmos para descifrar y encriptar (ocultar) documentos. Son grupos de algoritmos distintos que se relacionan unos con otros para mantener la conexión confidencial de la información.</li>
            <li><strong>Asimétricas:</strong> Es una fórmula matemática que utiliza dos llaves, una pública y la otra privada. La llave pública es aquella a la que cualquier persona puede tener acceso, mientras que la llave privada es aquella que sólo la persona que la recibe es capaz de descifrar.</li>
          </ul>
          <p>Actualmente, los métodos criptográficos pueden ser subdivididos en dos grandes categorías, de acuerdo con el tipo de llave utilizado: criptografía de llave única y la criptografía de llave pública y privada.</p>
          <ul>
            <li><strong>Criptografía de llave única:</strong> La criptografía de llave única utiliza la misma llave tanto para codificar como para decodificar mensajes. A pesar de que este método es bastante eficiente en relación al tiempo de procesamiento, o sea, el tiempo que gasta para codificar y decodificar mensajes, tiene como principal desventaja la necesidad de utilización de un medio seguro para que la llave pueda ser compartida entre personas o entidades que deseen intercambiar información criptografiada.</li>
            <li><strong>Criptografía de llaves pública y privada:</strong> La criptografía de llaves pública y privada utiliza dos llaves distintas, una para codificar y otra para decodificar mensajes. Con este método cada persona o entidad mantiene dos llaves: una pública, que puede ser divulgada libremente, y otra privada, que debe ser mantenida en secreto por su dueño. Los mensajes codificados con la llave pública solo pueden ser decodificados con la llave privada correspondiente.</li>
          </ul>
          <p>Como ejemplo, José y María quieren comunicarse de manera sigilosa. Entonces, ellos tendrán que realizar los siguientes procedimientos:</p>
          <ol>
            <li>José codifica un mensaje utilizando la llave pública de María, que está disponible para el uso de cualquier persona.</li>
            <li>Después de criptografiarlo, José envía el mensaje a María, a través de Internet.</li>
            <li>María recibe y decodifica el mensaje, utilizando su llave privada, que es sólo de su conocimiento.</li>
          </ol>
          <p>Si María quisiera responder el mensaje, deberá realizar el mismo procedimiento, pero utilizando la llave pública de José. A pesar de que este método tiene un desempeño muy inferior en relación al tiempo de procesamiento, comparado al método de criptografía de llave única, presenta como principal ventaja la libre distribución de llaves públicas, no necesitando de un medio seguro para que llaves sean combinadas con antelación.</p>
          <h3>¿Qué es firma digital?</h3>
          <p>La firma digital consiste en la creación de un código, a través de la utilización de una llave privada, de modo que la persona o entidad que recibe un mensaje conteniendo este código pueda verificar si el remitente es quien dice ser e identificar cualquier mensaje que pueda haber sido modificado.</p>
          <p>De esta forma, es utilizado el método de criptografía de llaves pública y privada, pero en un proceso inverso al presentado en el ejemplo anterior. Si José quisiera enviar un mensaje suscrito a María, él codificará un mensaje con su llave privada. En este proceso será generada una firma digital, que será añadida al mensaje enviado a María. Al recibir el mensaje, María utilizará la llave pública de José para decodificar el mensaje. En este proceso será generada una segunda firma digital, que será comparada con la primera. Si las firmas fueran idénticas, María tendrá certeza de que el remitente del mensaje fue José y que el mensaje no fue modificado.</p>
          <p>Es importante resaltar que la seguridad del método se basa en el hecho de que la llave privada es conocida sólo por su dueño. También es importante resaltar que el hecho de firmar un mensaje no significará un mensaje sigiloso. Para el ejemplo anterior, si José quisiera firmar el mensaje y tener certeza de que sólo María tendrá acceso a su contenido, sería preciso codificarla con la llave pública de María, después de firmarla.</p>
          <h3>¿Qué tamaño de llave criptográfica debe ser utilizado?</h3>
          <p>Los métodos de criptografía actualmente utilizados, y que presentan buenos niveles de seguridad, son públicamente conocidos y son seguros por la robustez de sus algoritmos y por el tamaño de las llaves que utilizan. Para que alguien descubra una llave necesita utilizar algún método de fuerza bruta, o sea, probar combinaciones de llaves hasta que la correcta sea descubierta. Por lo tanto, cuanto mayor sea la llave criptográfica, mayor será el número de combinaciones a probar, inviabilizando así el descubrimiento de una llave en un tiempo normal. Además de eso, las llaves pueden ser cambiadas regularmente, haciendo los métodos de criptografía aún más seguros.</p>
          <p>Actualmente, para obtenerse un buen nivel de seguridad en la utilización de un método de criptografía de llave única, es aconsejable utilizar llaves de un mínimo de 128 bits. Y para el método de criptografía de llaves pública y privada es aconsejable utilizar llaves de 2048 bits, siendo el mínimo aceptable de 1024 bits. Dependiendo para los fines para los cuales los métodos criptográficos serán utilizados, se debe considerar la utilización de llaves mayores: 256 o 512 bits para llave única y 4096 o 8192 bits para llaves pública y privada.</p>
          <h3>Smart Contracts</h3>
          <p>Para entender un smart contract, primero hemos de recordar qué significa un contrato. Un contrato no es más que un acuerdo entre dos o más partes, un entorno donde se define lo que se puede hacer, cómo se puede hacer, qué pasa si algo no se hace. Es decir, unas reglas de juego que permiten a todas las partes que lo aceptan entender en qué va a consistir la interacción que van a realizar.</p>
          <p>Hasta ahora los contratos han sido documentos verbales o caros documentos escritos. Estos documentos están sujetos a las leyes y jurisdicciones territoriales, y en ocasiones requieren de notarios. Es decir, más costes, tiempo y terceros que intervienen en el proceso. Debido a ello, no son accesibles para cualquier persona. Y esto no es lo peor: los contenidos de los contratos pueden estar sujetos a la interpretación.</p>
          <p>En cambio un contrato inteligente es capaz de ejecutarse y hacerse cumplir por sí mismo, de manera autónoma y automática, sin intermediarios ni mediadores. Evitan el lastre de la interpretación al no ser verbal o escrito en los lenguajes que hablamos. Los smart contracts se tratan de "scripts" (códigos informáticos) escritos con lenguajes de programación. Esto quiere decir que los términos del contrato son puras sentencias y comandos en el código que lo forma.</p>
          <p>Por otro lado, un smart contract puede ser creado y llamado por personas físicas y/o jurídicas. Pero también por máquinas u otros programas que funcionan de manera autónoma. Un smart contract tiene validez sin depender de autoridades. Esto se debe a su naturaleza: es un código visible por todos y que no se puede cambiar al existir sobre la tecnología blockchain. Esto le confiere un carácter descentralizado, inmutable y transparente.</p>
          <p>Con lo anterior, seguramente has podido ver el enorme potencial que encierran estos smarts contracts. Es importante destacar que, al estar distribuido por miles de ordenadores, se evita que una gran compañía los custodie, lo que elimina burocracia, censuras y los grandes costes / tiempos implícitos de este proceso que, dicho sea de paso, hasta ahora es el custodio.</p>
          <p>Si juntamos los principios de un smart contract con la creatividad de muchos desarrolladores del planeta, el resultado son posibilidades jamás vistas, accesibles para todos y a costes que rozan la gratuidad. Ecosistemas sin figuras autoritarias que someten a su voluntad a sus integrantes. Hablamos de un mundo más justo.</p>
          <p>Imagina un coche Tesla autoconducido, comprado en grupo, capaz de autogestionarse y alquilarse por sí solo. Todo ello sin una compañía tipo Uber detrás llevándose el 10 %. De esa podemos decir: bienvenido al mundo de los contratos inteligentes.</p>
          <h4>Los primeros contratos inteligentes</h4>
          <p>La primera vez que se tiene constancia de forma pública sobre los smart contracts es a través de Nick Szabo, jurista y criptógrafo Nick Szabo que mencionó públicamente el término en un documento en 1995. Dos años después, en 1997, desarrolló un documento mucho más detallado explicando los Smart Contracts.</p>
          <p>Lamentablemente, pese a definir la teoría, era imposible hacerla realidad con la infraestructura tecnológica existente. Para que los contratos inteligentes se puedan ejecutar, es necesario que existan las transacciones programables y un sistema financiero que las reconozca, digitalmente nativo. Precisamente, lo que Szabo definía como inexistente en 1995, en 2009 (casi 15 años después) se haría realidad con la aparición de Bitcoin y su tecnología, la cadena de bloques (blockchain).</p>
          <h4>Bitcoin y los smart contracts</h4>
          <p>Bitcoin tiene algunos smart contracts ya creados que se ejecutan por defecto y de manera transparente al usuario. Cuando hablamos de contratos de distribución, nos referimos a uno de los casos de uso de Bitcoin para formar acuerdos entre personas a través de la blockchain. Y es que Bitcoin, entre todas sus ventajas, permite añadir lógica al dinero, algo único de este tipo de dinero: es dinero programable. Esta lógica aplicada al dinero nos permite resolver problemas comunes que podemos encontrarnos en la actualidad, pero aumentando el nivel de confianza a lo largo de todo el proceso automatizado en el que se desarrolla la interacción.</p>
          <h4>Algunos ejemplos de smarts contracts en Bitcoin</h4>
          <p>Ejemplificando, podrían desarrollarse nuevos productos o aplicaciones como por ejemplo:</p>
          <ul>
            <li>Mercados distribuidos que permitieran implementar contratos P2P y trading en los mercados con Bitcoin postulándose como un competidor completo al sistema financiero actual.</li>
            <li>Propiedades como automóviles, teléfonos, casas o elementos no físicos controlados a través de la cadena de bloques conforman las nombradas smart property. Mediante el uso de los contratos y con propiedades inteligentes se permite que el nivel de confianza sea muy superior reduciendo el fraude, los honorarios de mediación para terceras partes y permite que las operaciones se lleven a un nuevo nivel.</li>
            <li>Automatización de herencias estableciendo la asignación de los activos tras el fallecimiento. En cuanto llegase el fallecimiento, el contrato entraría en vigor y se ejecutaría repartiendo en este caso los fondos a la dirección establecida en el contrato.</li>
            <li>Seguros: partes de accidente, pagos de la compañía para reparaciones, reducción del fraude en accidentes…</li>
          </ul>
          <p>Y es que los smart contracts se sirven de la tecnología de Bitcoin para existir, algo que le viene genial a Bitcoin, pues está haciendo que reciba mucha más atención trayendo cientos de miles de nuevos usuarios a su ecosistema. De hecho no es difícil encontrar afirmaciones del tipo: "Los smart contracts son la killer APP de Bitcoin".</p>
          <p>Esta lógica que puede aplicarse a las transacciones Bitcoin se realiza a través del uso de todo un lenguaje propio, permitiendo que sea la misma blockchain quien determine qué hacer basándose en las indicaciones programadas. Esto quiere decir que tenemos una transacción con unas instrucciones de forma distribuida e inmutable, dando una seguridad completa y sin interpretaciones.</p>
          <h4>Un Smart Contract no es lo que piensas</h4>
          <p>Hoy en día todo está controlado por sistemas informáticos. Todo interactúa con ellos. En el desarrollo de aplicaciones es normal que los programadores creen una serie de "puertas" a su aplicación (llamadas APIs). Estas puertas permiten que otros programadores puedan entrar a tu aplicación para crear u obtener información. Casi todas las webs o programas tienen las suyas. Es decir, se define un protocolo, un contrato, una forma conocida en la que se llama a la aplicación con una estructura de datos. Es por medio de esta puerta por la que vamos a obtener una respuesta, pero con la estructura de datos predecible. En este caso, para que no falle la comunicación y, consigo, los programas.</p>
          <p>Pero este contrato no está garantizado. El servidor de la aplicación está controlado por alguien que tiene la capacidad de hacer que mañana el programa funcione diferente. Está centralizado y puede mutar a la decisión de ese tercero. No es "smart".</p>
          <p>La gente necesita entornos predecibles, transparentes e incorruptibles. Los smart contracts son pedazos de códigos similares, es decir tienen formas de llamarlos y obtener unas respuestas, tienen un contrato, pero además son inmutables pues están distribuidos en miles de nodos que no pueden alterar su contenido. De esa forma obtienes un programa que siempre va a actuar de la misma forma sin requerir de la buena voluntad de ese tercero. Algo que para casi cualquier caso de uso es necesario. Los Smart Contracts son programas en la nube que siempre actúan igual, y permiten almacenar información que no puede ser modificada a traición. Son los programas más seguros jamás creados en la humanidad y solo fallan cuando están mal programados.</p>
          <h4>¿Cómo se realiza un contrato inteligente en Bitcoin?</h4>
          <p>Para que todo esto sea posible, tiene que haber un proceso completamente seguro que garantice que, al menos dos partes, puedan ejecutar el contrato sin necesidad de confiar el uno del otro, ni tan siquiera conocerse. Los contratos utilizan el sistema descentralizado de Bitcoin para hacer cumplir acuerdos financieros sin dependencia de agentes externos, como sistemas judiciales, disminuyendo el riesgo de tratar con entidades desconocidas en transacciones financieras.</p>
          <h4>Proceso de generación de un smart contract</h4>
          <p>Existen varios pasos para la creación de smart contracts seguros. Ejemplifiquemos con el caso de realizar depósitos seguros en cualquier página web que acepte bitcoins. ¿A nadie le gusta perder su dinero, ¿verdad?</p>
          <p>En conjunto, todas estas características no solo permiten construir nuevas e interesantes herramientas financieras sobre la cadena de bloques Bitcoin sino que, al estar cada contrato inteligente formado por personas o máquinas, las posibilidades de innovación para el ámbito del Internet of Things, Insurtech, Logística, Administración son tan amplias que es probable que empiecen a salir muy pronto las primeras killer app o aplicaciones revolucionarias de estos ámbitos.</p>
          <h4>Pasos para la generación de un smart contract</h4>
          <ol>
            <li>El usuario y la página web se envían entre sí una clave pública recién generada.</li>
            <li>Seguidamente el usuario crea la primera transacción sin transmitirla poniendo por ejemplo 5 BTC en un output que requiere tanto el usuario como el sitio web para firmarlo.</li>
            <li>El usuario envía el hash de la primera transacción a la página web.</li>
            <li>El portal crea una segunda transacción correspondiente al contrato. En esta segunda transacción se gasta la primera y se devuelve al usuario a través de la dirección que proporcionó en el primer paso. Pero como la primera transacción requería dos firmas (usuario y página web) esta operación todavía no estaría completa. Aquí es dónde toma importancia un nuevo parámetro: nLockTime. Este se puede añadir en una transacción de bitcoin estableciendo una fecha futura de por ejemplo 6 meses. Antes de esta fecha, esos fondos no se podrían incorporar en ninguna transacción.</li>
            <li>El Sequence Number del input también se pone a 0.</li>
            <li>Finalmente, la transacción sin firmar por completo se devolvería al usuario. Este comprobaría que todo está correcto y que las monedas volverían a su posesión. Eso sí, tras los 6 meses que se estipularon con nLockTime. Al tener el Sequence Number en 0, este contrato podría ser modificado en un futuro si ambas partes así lo creen conveniente. Pero claro… Si los administradores de la página web desaparecen, ¿cómo podría el usuario recuperar los fondos?</li>
            <li>Hay que tener en cuenta que el script del input (instrucciones grabadas en cada transacción) todavía no ha finalizado. El espacio reservado para la firma del usuario todavía está formado por un conjunto de ceros después de que el portal creará la segunda transacción. Ahora tan solo faltaría la firma del usuario en dicho contrato.</li>
            <li>A partir de aquí, tras los 6 meses que se delimitaron sí se transmitirían tanto la primera como la segunda transacción y los 5 BTC de la primera transacción, se devolverían al usuario en cuestión.</li>
          </ol>
          <h3>Cadena lateral o Sidechain</h3>
          <p>Una cadena lateral o sidechain es una cadena de bloques alterna que es usada para mejorar las prestaciones de una cadena de bloques o blockchain ya existente. Esto es posible gracias a que una cadena lateral o sidechain permite que esta nueva cadena de bloques pueda ser conectada e interactuar con una blockchain existente. Esta nueva cadena contiene una programación y características completamente distinta, pero es compatible con la cadena a la que se une. Gracias a ello, ambas cadenas pueden comunicarse y complementar sus capacidades.</p>
          <p>Un ejemplo de esto puede ser el siguiente. Imagine que un desarrollador desea crear una DApp y desplegarla sobre Bitcoin. Lograr esto directamente sobre Bitcoin de momento es extremadamente complejo. Sin embargo, es posible desarrollar una sidechain que agregue dicha funcionalidad a Bitcoin de una forma más sencilla. Esta sidechain tendría la capacidad de desplegar las DApps e interactuar de forma bidireccional con la cadena de Bitcoin. El resultado es que sería posible desarrollar DApps que aprovechen el potencial de Bitcoin (su minería y demás propiedades) gracias al uso de esta sidechain.</p>
          <h4>¿Cómo funcionan las sidechains?</h4>
          <p>El funcionamiento de una cadena lateral o sidechain no es nada sencillo. Técnicamente es un desafío enorme que ha llevado muchos años de desarrollo. Pero a grandes rasgos el funcionamiento de las cadenas laterales es el siguiente:</p>
          <p>En primer lugar, se envían las criptomonedas a una dirección específica. Una vez allí, los fondos son congelados y nadie puede manejarlos. La única manera de acceder a dichos fondos es demostrar que dichas criptomonedas no se están usando en otro lugar. Una vez que se confirma que dichos fondos no son usados en otro lugar, se manda una notificación a la sidechain. Tras ello, la sidechain creará de forma automática, el mismo número exacto de activos de criptomoneda que se mandaron. Esto claro usando el token que dicha sidechain maneja.</p>
          <p>El control de estos tokens será completamente tuyo. A partir de este momento, se podrán intercambiar y mover estos tokens para hacer uso del potencial de esa sidechain. Todo ello siguiendo las directrices y protocolo que ésta tenga estipulado. Por ejemplo, quizá la velocidad de creación de los bloques es más rápida en esta o quizá los scripts de transacción en esa cadena son turing completos. A partir de aquí y como puedes apreciar, las posibilidades de testeo son prácticamente ilimitadas.</p>
          <h3>¿Qué es la tokenización?</h3>
          <p>La tokenización es una de las consecuencias más disruptivas de la tecnología blockchain. Este proceso, promete transformar la sociedad en dirección a una visión más materialista y mercantilizada, donde las personas puedan valorar e intercambiar cualquier elemento en función de su oferta y demanda.</p>
          <p>La tokenización es la transformación y representación de un activo u objeto dentro de una blockchain. Para lograr esto, la tokenización conlleva un proceso de transformación que toma las propiedades de dicho objeto. Este proceso de transformación consiste en digitalizar dicho objeto y llevar toda su información a un bloque de una blockchain. Una vez registrado, el mismo puede ser intercambiado o almacenado. Durante este proceso se otorga a dicho objeto un token que permite que tal objeto pueda ser manipulado como una parte integral de dicha blockchain.</p>
          <p>Lo mejor de todo esto es que la tokenización en blockchain puede aplicarse a prácticamente cualquier cosa. Desde una bebida, un activo, documentos, identidades, una casa, hasta cada elemento que sale de una línea de producción industrial. Prácticamente, cualquier elemento podría ser tokenizado.</p>
          <p>Esta situación, podría transformar profundamente distintos procesos, como por ejemplo, una cadena de suministros o de comercialización. Una tokenización en una cadena de suministros, será capaz de mejorar la seguridad de esta, mientras agrega transparencia y trazabilidad reduciendo costes por intermediarios.</p>
          <p>Sin duda, la tecnología blockchain abre las puertas a todo un universo de posibilidades que anteriormente eran difíciles o complejas de resolver. Dicha transformación, empezó en primer lugar en el aspecto económico y a pesar de ello, continúa extendiéndose. Y es que el potencial de la tecnología blockchain y la tokenización es gigantesco. Aún hoy en día, no alcanzamos a imaginar las posibilidades de un sistema descentralizado y tan seguro como este.</p>
          <p>Y es que, lo que más ha captado la atención del mundo, es precisamente el hecho de poder acceder a la información de forma segura desde cualquier parte. A esto podemos sumar, la capacidad de tomar los datos de un objeto o elementos, para disponer de ellos en una red descentralizada a la que es posible acceder con una alta granularidad y bajos costes. Un logro por tanto, al alcance de muy pocos sistemas.</p>
          <h4>Ejemplo: Tokenizando el mundo</h4>
          <p>Una empresa tiene varias líneas de producción y desea tener un registro de cada uno de sus productos, partes que lo componen y todo elemento que forma parte de dichas líneas. Toda la información producida por cada uno de estos elementos debe quedar grabado como si de una gran bitácora industrial se tratase.</p>
          <p>Al mismo tiempo, la empresa desea que se reparta entre sus distintos departamentos, el acceso a dicha información en tiempo real. Todo sin que se solapen permisos ni que se acceda a información fuera de sus límites de trabajo. Adicional a esto, el sistema debe ser lo suficientemente abierto para permitir la auditoría en tiempo real por terceros.</p>
          <p>Gracias a la tokenización y la tecnología blockchain un sistema de estas capacidades es posible de construirse sin mayores dificultades. Podemos unir elementos como la Internet de las Cosas (IoT) y otros elementos propios de la industria para construir lo que conocemos como Industria 4.0.</p>
          <p>Pues bien, todo esto es posible gracias al uso de tecnología blockchain y la tokenización. Y si bien el ejemplo habla de una empresa y sus líneas de producción, el mismo puede aplicarse a cualquier otra circunstancia. En consecuencia, la tokenización del mundo tal y como lo conocemos, supondrá la redefinición del mismo.</p>
          <h4>Bibliografía</h4>
          <ul>
            <li>https://www.tecnologia-informatica.com/que-es-la-criptografia/</li>
            <li>https://academy.bit2me.com/que-son-los-smart-contracts/</li>
            <li>https://academy.bit2me.com/que-es-cadena-lateral-sidechain/</li>
          </ul>
        </div>
        {/* Botón Volver abajo */}
        <div className="mt-8">
          <Link
            href="/dashboard/iniciado/6-tecnologia-blockchain"
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





