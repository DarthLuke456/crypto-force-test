import React from 'react';
import BackButton from '@/components/ui/BackButton';

export default function Modulo2Contenido() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-2 sm:px-8 py-8 max-w-3xl mx-auto">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 pt-12 relative">
        {/* Botón Volver en la esquina superior izquierda */}
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-[#ec4d58] mb-2 text-center">Criptomonedas. Herramientas Económicas</h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Módulo 2: Las fuerzas del mercado</h2>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Las fuerzas del mercado de la oferta y la demanda</h3>
          <p className="mb-2">Los economistas utilizan muy a menudo los términos oferta y demanda y lo hacen por una buena razón. La oferta y la demanda son las dos fuerzas que hacen que las economías de mercado funcionen. Estas fuerzas determinan la cantidad que se produce de cada bien y el precio al que debe venderse. Si usted quiere saber cómo un acontecimiento determinado afectará la economía, lo primero que tiene que hacer es pensar en términos de oferta y demanda.</p>
          <p className="mb-2">Los términos oferta y demanda se refieren al comportamiento de las personas al momento de interactuar unas con otras en un mercado competitivo. Antes de analizar la manera en que los compradores y los vendedores se comportan, consideremos primero, de forma detallada, lo que significan los términos mercado y competencia.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">¿Qué es un mercado?</h3>
          <p className="mb-2">Un mercado es un grupo de compradores y vendedores de un bien o servicio en particular. Los compradores son el grupo que determina la demanda del producto y los vendedores son el grupo que determina la oferta de dicho producto.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">¿Qué es la competencia?</h3>
          <p className="mb-2">La mayoría de los mercados en la economía, son altamente competitivos. Cada uno de los compradores sabe que hay varios vendedores a los que se les puede comprar y cada uno de los vendedores está consciente de que su producto es similar al ofrecido por otros vendedores. El resultado de esto es que tanto el precio como la cantidad que se vende no se determinan por un solo vendedor o por un solo comprador, sino que el precio y la cantidad se fijan por todos los compradores y vendedores que interactúan en el mercado.</p>
          <p className="mb-2">Los economistas utilizan el término mercado competitivo para describir un mercado en el que hay múltiples compradores y vendedores y, por tanto, individualmente ninguno de ellos tiene un impacto significativo en el precio de mercado.</p>
          <p className="mb-2">Para llegar a esta forma de competencia, que es la más avanzada, el mercado debe tener dos características:</p>
          <ol className="list-decimal list-inside mb-2 space-y-2">
            <li>Los bienes que se venden deben de ser exactamente los mismos y</li>
            <li>Los compradores y vendedores son tan numerosos que ninguno puede, por sí solo, influir en el precio del bien en el mercado.</li>
          </ol>
          <p className="mb-2">Debido a que en los mercados perfectamente competitivos los compradores y vendedores deben aceptar el precio que el mercado determina, se dice que ambos son tomadores de precios.</p>
          <p className="mb-2">Sin embargo, no todos los bienes y servicios se venden en mercados perfectamente competitivos.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">La demanda</h3>
          <p className="mb-2">La cantidad demandada de un bien determinado es la cantidad que de ese bien están dispuestos a adquirir los compradores. Como veremos, existen muchos factores que determinan la cantidad demandada de un bien; sin embargo, cuando se analiza cómo funcionan los mercados, un determinante fundamental es el precio del bien.</p>
          <p className="mb-2">Esta relación entre el precio y la cantidad demandada es verdadera para casi todos los bienes de la economía y, de hecho, es una relación tan generalizada que los economistas la denominan la ley de la demanda. Es decir, si todo lo demás permanece constante, cuando el precio de un bien aumenta, la cantidad demandada de dicho bien disminuye, y cuando el precio disminuye, la cantidad demandada aumenta.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">La demanda del mercado frente a la demanda individual</h3>
          <p className="mb-2">Con el fin de analizar cómo funcionan los mercados, es necesario determinar la demanda del mercado en su conjunto; es decir, la suma de las demandas individuales que existen de un bien o servicio en particular.</p>
          <p className="mb-2">Por lo tanto, la curva de la demanda muestra lo que le sucede a la cantidad demandada de un bien cuando el precio de éste cambia, siempre y cuando todas las demás variables que afectan a los consumidores se mantengan constantes. Cuando una de estas variables cambia, la curva de la demanda se desplaza.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Algunos conceptos a tener en cuenta de distintas clasificaciones de bienes:</h3>
          <ul className="list-disc list-inside mb-2 space-y-2">
            <li><b>Bien normal:</b> Un bien por el cual, con todo lo demás constante, un incremento en el ingreso lleva a un incremento en la demanda.</li>
            <li><b>Bien inferior:</b> Un bien por el cual, con todo lo demás constante, un incremento en el ingreso lleva a una caída en la demanda.</li>
            <li><b>Bienes Sustitutos:</b> Dos bienes para los que un incremento en el precio de uno lleva a un incremento en la demanda del otro.</li>
            <li><b>Bienes Complementarios:</b> Dos bienes para los que un incremento en el precio de uno lleva a una caída en la demanda del otro.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Desplazamientos en la curva de la demanda</h3>
          <p className="mb-2">Debido a que en la curva de la demanda del mercado todo lo demás permanece constante, no necesita permanecer estable en el tiempo. Si ocurre algo que altere la cantidad demandada a un precio dado, automáticamente la curva de la demanda se desplazará. Suponga, por ejemplo, que la organización mundial de la salud asevera que las personas que cotidianamente consumen manteca viven más tiempo y tienen una vida más saludable. Es de esperar que dicha declaración incremente considerablemente la demanda de manteca, independientemente de cual sea su precio y que, por tanto, la curva de la demanda se desplace.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Variables que trasladan la curva de demanda:</h3>
          <ul className="list-disc list-inside mb-2 space-y-2">
            <li><b>Ingreso:</b> ¿Qué sucedería con su demanda de gaseosa si usted perdiera su empleo? Automáticamente disminuye su demanda por gaseosas más allá de cual sea su precio. Si la demanda de un bien disminuye, cuando se reduce el ingreso, se dice que es un bien normal. No todos los bienes son normales. Si la demanda de un bien aumenta cuando el ingreso disminuye, se dice que es un bien inferior.</li>
            <li><b>Precios de bienes relacionados:</b> Suponga ahora que el precio del yogur congelado disminuye; según la ley de la demanda, aumentaría la cantidad que se compraría. Del mismo modo se compraría menos helado, ya que ambos, el helado y el yogur congelado, son postres dulces, cremosos y fríos y, por tanto, satisfacen deseos similares. Cuando la reducción en el precio de un bien reduce la demanda de otro, se dice que los bienes son sustitutos.</li>
            <li><b>Gustos:</b> Uno de los determinantes más obvios de la demanda son los gustos. Si a una persona le gusta mucho el flan, comprará más de ese bien. Por lo general, los economistas no tratan de explicar los gustos de las personas, ya que éstos son determinados por otros factores a veces psicológicos que se encuentran más allá del campo de estudio de la economía. Sin embargo, los economistas sí se dedican a estudiar lo que sucede cuando los gustos varían.</li>
            <li><b>Expectativas:</b> Las expectativas que sobre el futuro tengan las personas pueden afectar, en el presente, la demanda de bienes y servicios. Por ejemplo, si una persona espera ganar mucho dinero el siguiente mes o año, entonces es probable que esta persona decida ahorrar menos y gastar una mayor cantidad de su ingreso para comprar más bienes en el presente.</li>
          </ul>
          <p className="mb-2">Recuerde: una curva se desplaza cuando hay un cambio en una variable relevante que no está medida en ninguno de los ejes de la gráfica. Debido a que el precio se representa en el eje vertical, un cambio en el precio representa un movimiento a lo largo de la curva. Por el contrario, el ingreso, los precios de bienes relacionados, los gustos, las expectativas y el número de compradores son variables que no son medidas en ninguno de los ejes y, por tanto, un cambio en cualquiera de ellas significará un desplazamiento de la curva de la demanda.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">La oferta</h3>
          <h4 className="text-md font-semibold mb-2">La curva de la oferta: la relación que existe entre el precio y la cantidad ofrecida</h4>
          <p className="mb-2">La cantidad ofrecida de cualquier bien o servicio es la cantidad que los vendedores quieren y pueden vender. Existen muchos factores que determinan la cantidad que se ofrece pero, una vez más, el precio desempeña un papel muy importante en nuestro análisis. Cuando el precio de un bien o servicio aumenta, vender es muy rentable y, por tanto, la cantidad que se ofrece es grande. Los vendedores trabajan muchas horas, compran más máquinas para elaborar más bienes y contratan más personal. Por el contrario, cuando el precio del bien es bajo, el negocio es menos rentable y los vendedores producen menos. Incluso, a un precio bajo, algunos vendedores pueden optar por cerrar y provocar con esto que la cantidad que ofrecen caiga a cero. Esta relación entre el precio y la cantidad ofrecida se llama ley de la oferta y establece que, con todo lo demás constante, cuando el precio de un bien aumenta, la cantidad ofrecida de dicho bien también aumenta y cuando el precio de un bien disminuye, la cantidad que se ofrece de dicho bien también disminuye.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">La oferta del mercado frente a la oferta individual</h3>
          <p className="mb-2">Así como la demanda del mercado es la suma de la demanda de todos los compradores, la oferta del mercado es la suma de todo lo ofrecido por los vendedores.</p>
          <p className="mb-2">La curva de la oferta del mercado muestra las variaciones de la cantidad total ofrecida conforme varía el precio del bien, manteniendo constantes todos los demás factores que, además del precio, influyen en las decisiones de los productores respecto a la cantidad que venderán.</p>
          <p className="mb-2">La curva de la oferta muestra qué sucede con la cantidad ofrecida de un bien cuando su precio varía, manteniendo constantes todas las demás variables que influyen en los vendedores. Cuando una de estas otras variables cambia, la curva de la oferta se desplaza. Una vez más, para recordar si debe desplazar la curva de la oferta o si debe moverse a lo largo de la curva de la oferta, tenga en mente que la curva se desplaza solamente cuando hay un cambio en una variable relevante que no se menciona en ninguno de los ejes. El precio está en el eje vertical, por lo que un cambio en el precio representa un movimiento a lo largo de la curva de la oferta. En contraste, debido a que los precios de los insumos, la tecnología, las expectativas y el número de vendedores no se miden en ninguno de los ejes, un cambio en alguna de estas variables desplaza la curva de la oferta.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Desplazamientos en la curva de la oferta</h3>
          <p className="mb-2">Debido a que la curva de la oferta mantiene todo lo demás constante, la curva se desplaza cuando uno de los factores cambia. Por ejemplo, suponga que el precio de la harina disminuye. La harina es un insumo para producir pan, por lo que la caída en el precio de la harina hace que vender pan sea más rentable. Esto incrementa la oferta de pan: a cualquier precio dado, los vendedores ahora están dispuestos a producir una cantidad mayor. La curva de la oferta de pan se desplaza hacia la derecha.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Variables que desplazan la curva de la oferta</h3>
          <ul className="list-disc list-inside mb-2 space-y-2">
            <li><b>Precios de los insumos:</b> Para producir pan, los vendedores utilizan varios insumos: harina sal, levadura, máquinas, la infraestructura que se requiere para producirlo y la mano de obra de los trabajadores para mezclar los ingredientes y operar las máquinas. Cuando el precio de uno o más de estos insumos se incrementa, producir pan es menos rentable y las empresas ofrecen menos pan. Si los precios de los insumos aumentan sustancialmente, una empresa podrá cerrar y no ofrecer pan en absoluto.</li>
            <li><b>Tecnología:</b> La tecnología para convertir los insumos en pan es otra determinante de la oferta. Por ejemplo, la invención de la máquina para hacer pan de forma mecanizada redujo la cantidad de mano de obra necesaria para fabricarlo. Al reducir los costos de las empresas, los avances tecnológicos aumentaron la oferta de pan.</li>
            <li><b>Expectativas:</b> La cantidad de pan que una empresa ofrece hoy puede depender de sus expectativas sobre el futuro. Por ejemplo, si espera que el precio del pan aumente en los días siguientes, almacenará una parte de su producción actual y ofrecerá menos en el mercado hoy.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Oferta y demanda juntas</h3>
          <p className="mb-2">Hay un punto en el cual dichas curvas se intersecan. Este punto se llama equilibrio del mercado. El precio en esta intersección se conoce como el precio de equilibrio y la cantidad se llama cantidad de equilibrio.</p>
          <p className="mb-2">El diccionario define la palabra equilibrio como una situación en la cual varias fuerzas están balanceadas (y esto también describe el equilibrio de un mercado). En el precio de equilibrio, la cantidad del bien que los compradores están dispuestos y son capaces de comprar equivale exactamente a la cantidad que los vendedores están dispuestos y son capaces de vender. El precio de equilibrio se conoce a veces como precio de liquidación de mercado, porque a este precio todos en el mercado están satisfechos: los compradores han comprado todo lo que querían y los vendedores han vendido todo lo que querían.</p>
          <p className="mb-2">Las acciones de compradores y vendedores mueven naturalmente los mercados hacia el equilibrio de la oferta y la demanda. Para entender por qué, considere lo que sucede cuando el precio de mercado no es igual al precio de equilibrio.</p>
          <p className="mb-2">Si el precio de mercado está por arriba del precio de equilibrio tenemos entonces un exceso de oferta, a ese precio para los oferentes es más tentador llevar más bienes al mercado porque el precio es más alto, pero para los demandantes ese precio es muy elevado y deciden consumir menos, lo que genera un excedentes de bienes en el mercado.</p>
          <p className="mb-2">Por el otro lado, si el precio de mercado está por debajo del precio de equilibrio, tenemos un exceso de demanda, ahora los consumidores desean comprar más bienes porque está más barato, pero a ese precio a los oferentes no les conviene y deciden ofrecer menos, lo que genera una escasez o desabastecimiento en el mercado.</p>
          <p className="mb-2">El exceso de oferta presiona los precios a la baja y el exceso de demanda presiona los precios de mercado al alza, retornando nuevamente al equilibrio.</p>
          <p className="mb-2">Una vez que el mercado alcanza el equilibrio, todos los compradores y vendedores están satisfechos y no hay presiones sobre el precio para que éste aumente o disminuya. La rapidez con la que se llega al equilibrio varía de un mercado a otro, dependiendo de la rapidez con la que se ajusten los precios. En la mayoría de los mercados libres, los excedentes y la escasez son solamente temporales porque, a la larga, los precios se mueven hacia sus niveles de equilibrio.</p>
          <p className="mb-2">De hecho, este fenómeno es tan general que se lo conoce como la ley de la oferta y la demanda.</p>
          <p className="mb-2 italic">Fuente: Economía@BSAK (2011) [Imagen titulada: Un par de caricaturas para alegrar el ánimo] Recuperado de: http://dbseconomics.blogspot.com/2011/04/unit-1-couple-of-cartoons-to-lighten.html</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">El Mercado de las Criptomonedas</h3>
          <p className="mb-2">En el mercado Cripto se opera de forma diferente en comparación con otros mercados financieros, lo que hace que sea fundamental saber cómo funciona y comprender la jerga que se emplea para describirlo antes de empezar a operar.</p>
          <p className="mb-2">Como todo mercado el de las criptomonedas no es distinto al resto con su oferta, demanda y precios (cotizaciones) con todo lo que ello implica.</p>
          <p className="mb-2">El mercado de criptomonedas es una red de divisas virtuales descentralizadas, lo que significa que funciona a través de un sistema de transacciones entre pares en lugar de emplear un servidor central. Cuando las criptomonedas se compran y venden, las transacciones se añaden al blockchain, que es un libro de cuentas virtuales compartido que registra datos, a través de un proceso que se conoce como «minar».</p>
          <p className="mb-2">Las criptomonedas también son conocidas por ser volátiles, lo que hace que sea fundamental saber hacia dónde es posible que se mueva el mercado. Múltiples factores pueden causar los movimientos del mercado, desde ofertas iniciales de monedas o blockchain forks, hasta las últimas noticias o normativas gubernamentales.</p>
          <p className="mb-2">Los mercados de criptomonedas se encuentran descentralizados, lo que significa que estas no las emite ni respalda ninguna autoridad central, como un gobierno. En su lugar, se gestionan mediante una red de ordenadores, aunque pueden comprarse y venderse en mercados de negociación y almacenarse en carteras.</p>
          <p className="mb-2">A diferencia de las divisas tradicionales, las criptomonedas solo existen como un registro de propiedad digital compartido almacenado en cadenas de bloques. Cuando un usuario desea enviar a otro unidades de criptomoneda, las manda a la cartera digital del destinatario. La transacción no se considera completada hasta que se verifica y se añade a la cadena de bloques a través de un proceso llamado minado, que también es el proceso mediante el que se crean nuevos tokens de criptomonedas.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">Bibliografía</h3>
          <ul className="list-disc list-inside">
            <li>Mankiw, N. Gregory, Principles of Economics, Sixth Edition, South-Western, Cengage Learning, 2012.</li>
            <li>Tetaz, Martín, Economía para Abogados, UNLP, 2006.</li>
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
