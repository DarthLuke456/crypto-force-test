// 🏛️ EXTRACTOR DE MIGRACIÓN - TRIBUNAL IMPERIAL
// Extrae automáticamente el contenido de los módulos existentes de Iniciado

import { CustomModule, ContentBlock, ContentCategory, DifficultyLevel } from './types';

// Interfaz para módulos extraídos
export interface ExtractedModule {
  id: string;
  title: string;
  description: string;
  path: string;
  content: string;
  category: 'theoretical' | 'practical';
  order: number;
  isControlPoint: boolean;
  checkpointNumber?: number;
}

// Datos de los módulos teóricos existentes
const THEORETICAL_MODULES: ExtractedModule[] = [
  {
    id: 'teorico-1',
    title: 'Introducción y la lógica económica',
    description: 'Comprende los principios básicos de la economía y cómo pensamos los humanos en términos de recursos escasos.',
    path: '1-introduccion-logica-economica',
    content: `
# Introducción y la lógica económica

La economía actúa como complemento del derecho. Contribuye en la interactuación con clientes, tanto a nivel empresarial como estatal.

## Preguntas clave:
- ¿Cómo escribir contratos que ayuden lograr los objetivos del negocio de la empresa?
- ¿Cómo lograr que las regulaciones sirvan para promover metas sociales?

A menudo se contempla al derecho solo en su papel de proveedor de justicia.

Con el estudio de la economía, se visualizan las leyes como incentivos para el cambio de comportamientos y como instrumentos para el logro de los objetivos de las políticas (eficiencia y distribución). Es por ello por lo que es sumamente conveniente entender que hay problemas económicos que son la génesis de las acciones legales del cliente (ej. monopolio, externalidades negativas, etc.)

La Ley de divorcio, las tasas de criminalidad, los contratos, la eutanasia, el derecho de propiedad, las instituciones en el sentido amplio de la palabra, el sistema electoral, el aborto, las reparaciones por daños y perjuicios, las patentes, el Derecho internacional, la decisión de anotarse en la Facultad, el Derecho Constitucional, la contaminación ambiental, el Derecho Laboral y naturalmente el Tributario también, son algunos de los temas en que la Economía y el Derecho se dan la mano.

Estudiar economía es una excelente inversión para aprender a interpretar un cuerpo normativo, no ya por la intención declarada de su letra, sino por los hechos jurídicos que efectivamente produce.

En efecto, el estudio de las consecuencias económicas de una norma permite conocer hasta qué punto esta es apropiada a los objetivos que su cuerpo declarativo enumera.

Ya mostramos que cuando la Constitución dice que la educación es gratuita solo contempla el no pago de aranceles, pero no garantiza de ninguna manera que esta no sea costosa para el alumno.

*Tetaz, Martin (2006) Economía para Abogados.*

## La palabra economía

La palabra economía proviene del griego quien administra el Hogar (Tetaz Martin; 2006). Decisiones en cada hogar: el objetivo es asignar los escasos recursos para satisfacer la mayor cantidad de necesidades.

### Glosario:
- **Escasez:** significa que la sociedad tiene recursos limitados y debido a ello, no puede producir todos los bienes y servicios que serían deseables. La administración de los recursos de una sociedad es importante porque estos son escasos.

La economía entrena para pensar en términos de alternativas, evaluar los costos y beneficios de las elecciones privadas (empresas o individuos) y sociales, examinar y comprender cómo se relacionan determinados sucesos y tópicos.

Un ejemplo más concreto de las relaciones entre la economía y el derecho es el de la legislación tributaria, en el que puede existir una diferencia muy grande entre la aparente voluntad del legislador y el efecto económico final de la norma.

Es sabido que a nadie le gusta pagar impuestos, por lo que establecido el mismo por la ley, el sujeto de derecho de la obligación hará cuanto esté a su alcance por endosarle la carga del tributo a otros. Si este es un productor es probable que traslade parte de la carga a los consumidores hacia adelante y si no lograra hacerlo, intentará que sus empleados absorban el coste vía una reducción de salarios, trasladando hacia atrás la carga.

Si el contribuyente de iure es un consumidor, este puede simplemente dejar de consumir el bien gravado y sustituirlo por otro, con lo que el productor obtendrá un menor precio neto de impuesto y terminará por tanto absorbiendo parte de la carga.

Solo de casualidad, el impacto económico final se corresponderá con el que surge de la interpretación literal de la norma, y en todo caso el legislador deberá ser muy cuidadoso para garantizar que la ley efectivamente cumpla con el propósito para el que es dictada.

Naturalmente esto no agota, ni mucho menos, la relación entre la economía y el derecho.

## Microeconomía y Macroeconomía

A nivel general, la Microeconomía se focaliza en las unidades individuales de la economía. Cómo las familias y empresas toman sus decisiones y cómo interactúan en mercados específicos. Mientras que la Macroeconomía mira a la economía como un todo. Cómo los mercados interactúan a nivel nacional.

## Principios Básicos de la Microeconomía

1. **La gente enfrenta disyuntivas (trade off):** El comportamiento de una economía refleja el comportamiento de sus individuos. Por cada hora que el abogado destine a estudiar una nueva causa, automáticamente dejará de contestar un requerimiento durante ese tiempo. Las leyes necesarias para hacer que las empresas contaminen menos provocan que los costos de producción de los bienes y servicios aumenten y, debido a estos costos más altos, las empresas ganan menos, o pagan salarios más bajos o venden los bienes a precios más altos, o crean una combinación de estas variables.

2. **El costo de una cosa es aquello a lo que se renuncia para obtenerla:** El costo de oportunidad de una cosa es aquello a lo que renunciamos para conseguirla. Si decidimos seguir capacitándonos seguramente dejaríamos de generar honorarios mientras dure dicha capacitación, pero en el futuro esos honorarios crecerán considerablemente.

3. **Las personas racionales piensan en términos marginales:** Las personas racionales saben que las decisiones en la vida raras veces se traducen en elegir entre lo blanco y lo negro y, generalmente, existen muchos matices de grises. Un tomador de decisiones racional emprende una acción si y solo si el beneficio marginal de esta acción es mayor al costo marginal.

4. **Las personas responden a los incentivos:** Un incentivo es algo que induce a las personas a actuar y puede ser una recompensa o un castigo. Los incentivos son fundamentales cuando se analiza cómo funcionan los mercados.

5. **El comercio puede mejorar el bienestar de todos:** El comercio permite a cada persona especializarse en las actividades que mejor realiza, ya sea cultivar el campo, coser o construir casas. El comerciar permite a las personas comprar una mayor variedad de bienes y servicios a un menor precio.

6. **Los mercados normalmente son un buen mecanismo para organizar la actividad económica:** En una economía de mercado, las decisiones que antes se tomaban de manera centralizada son sustituidas por las decisiones de millones de empresas y familias.

7. **El gobierno puede mejorar algunas veces los resultados del mercado:** Una de las razones por las cuales necesitamos al gobierno es porque la magia de la mano invisible de la economía solo funciona cuando aquel hace valer las reglas y mantiene las instituciones que son clave para el libre mercado.

8. **El nivel de vida de un país depende de la capacidad que tenga para producir bienes y servicios:** Casi todas las variaciones de los niveles de vida pueden atribuirse a las diferencias existentes entre los niveles de productividad de los países.

9. **Cuando el gobierno imprime demasiado dinero los precios se incrementan:** Inflación es el crecimiento sostenido y generalizado del nivel general de precios. Cuando un gobierno emite grandes cantidades de dinero, el valor de este disminuye.

10. **La sociedad enfrenta a corto plazo una disyuntiva entre inflación y desempleo:** En la economía, un incremento en la cantidad de dinero estimula el nivel total el gasto y, por ende, estimula también la demanda de bienes y servicios.

## Surgimiento de las criptomonedas

En 1998 el criptógrafo Wei Dai publicó su idea de evitar la necesidad de intermediarios en las transacciones de pago electrónico. Su idea era crear un sistema de intercambio de valor y ejecución de contratos basados en una moneda electrónica no rastreable, que le permitiera a sus dueños mantenerse anónimos.

En 2009 un programador bajo el alias de Satoshi Nakamoto llevó a la realidad la idea de Dai al crear una moneda cuasi anónima: el Bitcoin, la primera moneda digital descentralizada de la historia. Satoshi Nakamoto publicó un documento denominado Bitcoin: A peer to peer Electronic Cash System, que en español se debería traducir como Bitcoin, un sistema de dinero electrónico entre pares.

La verdadera identidad de Satoshi sigue siendo desconocida hasta el día de hoy. Según sus propias declaraciones realizadas el 2012, él era un hombre de 37 años que vivía en algún lugar de Japón. Sin embargo, hay muchas dudas sobre esto, por ejemplo, escribe en inglés con fluidez y el software de Bitcoin no está documentado en japonés, lo que lleva a muchos a pensar que, en realidad, no es japonés.

¿Alguna vez sabremos quién es el creador de Bitcoin? ¿O se trata de un equipo de personas? Puede que nunca lo sepamos, pero una cosa es segura: Esta persona o personas controlan aproximadamente un millón de Bitcoins.

Las criptomonedas son archivos, bits con datos (como los populares PDF o MP3) que buscan cumplir todas y cada una de las funciones que se le asignan al dinero tradicional, pero usando la web como medio de transmisión.

## Bibliografía
- Mankiw, N. Gregory, Principles of Economics, Sixth Edition, South-Western, Cengage Learning, 2012
- Tetaz, Martin, Economía para Abogados, UNLP, 2006
    `,
    category: 'theoretical',
    order: 1,
    isControlPoint: false
  },
  {
    id: 'teorico-2',
    title: 'Fuerzas del mercado',
    description: 'Explora la oferta, la demanda y cómo se forman los precios en los mercados libres.',
    path: '2-fuerzas-del-mercado',
    content: `# Fuerzas del mercado

[Contenido del módulo 2 - Fuerzas del mercado]

Este módulo explora los conceptos fundamentales de oferta y demanda, y cómo estas fuerzas determinan los precios en los mercados libres.

## Conceptos clave:
- Ley de la oferta y la demanda
- Equilibrio de mercado
- Elasticidad de precios
- Factores que afectan la oferta y demanda

[Contenido detallado del módulo...]
    `,
    category: 'theoretical',
    order: 2,
    isControlPoint: false
  },
  // Agregar más módulos teóricos...
];

// Datos de los módulos prácticos existentes
const PRACTICAL_MODULES: ExtractedModule[] = [
  {
    id: 'practico-1',
    title: 'Introducción al Trading',
    description: 'Aprende los conceptos básicos del trading y cómo funciona el mercado financiero.',
    path: '1-introduccion-trading',
    content: `# Introducción al Trading

## ¿Qué es el trading?

• Tener muy claro qué no es el Trading para enfocarte en lo que sí es realmente
• Conocer cómo es el proceso del trader
• Cuáles son los pilares en los que se sostiene la operativa bursátil

## El Gráfico

• Entender la información que nos puede proporcionar un gráfico, y qué utilidad tiene

## Las Velas Japonesas

• Entender la composición de cada vela, así como la información que transmite una vela y un conjunto de velas en una zona determinada

## El Precio

• La importancia de esta clase radica en la relevancia del Trading: "No se trata de adivinar lo que hará el precio, sino de adaptarnos a su movimiento"
• Entender correctamente el movimiento del precio
• De este modo podremos analizar el gráfico de forma correcta, y preparar nuestra operativa

## Psicotrading

• Aprende a pensar como un trader
• Aprender el concepto de que no pasa nada por perder dinero, ya que es parte del negocio
• Entiende el comportamiento de la masa, para anteponerte a ella

## Gestión monetaria I

• Ser conscientes de que el primer objetivo de un trader es preservar su capital, para poder volver otro día al mercado
• Entender la combinación del ratio de acierto y del ratio Bo/Riesgo

## Gestión monetaria II

• Entender la importancia del STOP LOSS y la obligación de usarlo siempre
• Cómo colocar correctamente el Stop Loss

## El Plan de Trading

• Entender cada una de las partes que componen el Plan de Trading, ya que será nuestra piedra angular

## Análisis de mercado

• Entender cómo es un análisis gráfico eficiente, en busca de zonas relevantes del gráfico
• Nos interesa conocer la importancia de estas zonas, ya que, si están bien puestas, lo normal es que el precio vaya de una zona a otra
• Un buen análisis gráfico nos allana el camino para preparar nuestra operativa

## La Operativa

• Entender el proceso operativo completo:
• Antes de abrir la posición, qué tenemos que tener en cuenta
• Una vez abierta la posición en qué debemos fijarnos
• Saber cuándo cerrar la operación

## Tipos de Órdenes

• Conocer bien las diferentes alternativas, ya que dependiendo de la operativa que planteemos, necesitamos usar una u otra

## ¿Cómo conseguir consistencia?

• Entender que esto es una carrera de fondo, no un sprint
• Es un mundo muy cambiante, por lo que es necesaria la formación continua
• Debemos de ser tremendamente disciplinados y pacientes, durante todo el proceso
• Que lo verdaderamente importante es ganar de forma recurrente
    `,
    category: 'practical',
    order: 1,
    isControlPoint: false
  },
  // Agregar más módulos prácticos...
];

export class MigrationExtractor {
  
  /**
   * Extrae todos los módulos teóricos
   */
  static extractTheoreticalModules(): ExtractedModule[] {
    return THEORETICAL_MODULES;
  }
  
  /**
   * Extrae todos los módulos prácticos
   */
  static extractPracticalModules(): ExtractedModule[] {
    return PRACTICAL_MODULES;
  }
  
  /**
   * Extrae todos los módulos (teóricos + prácticos)
   */
  static extractAllModules(): ExtractedModule[] {
    return [...THEORETICAL_MODULES, ...PRACTICAL_MODULES];
  }
  
  /**
   * Convierte un módulo extraído a ContentBlock[]
   */
  static convertToContentBlocks(module: ExtractedModule): ContentBlock[] {
    const blocks: ContentBlock[] = [];
    
    // Dividir el contenido en secciones
    const sections = module.content.split('\n## ');
    
    sections.forEach((section, index) => {
      if (section.trim()) {
        // Agregar título principal si es la primera sección
        if (index === 0) {
          const lines = section.split('\n');
          const title = lines[0].replace('# ', '');
          const content = lines.slice(1).join('\n').trim();
          
          blocks.push({
            id: `${module.id}-title-${index}`,
            type: 'text',
            content: `# ${title}`,
            order: index * 2,
            metadata: {
              fontSize: '2xl',
              isBold: true,
              alignment: 'center'
            }
          });
          
          if (content) {
            blocks.push({
              id: `${module.id}-content-${index}`,
              type: 'text',
              content: content,
              order: index * 2 + 1,
              metadata: {
                fontSize: 'base',
                alignment: 'left'
              }
            });
          }
        } else {
          // Agregar sección con subtítulo
          const lines = section.split('\n');
          const subtitle = lines[0];
          const content = lines.slice(1).join('\n').trim();
          
          blocks.push({
            id: `${module.id}-subtitle-${index}`,
            type: 'text',
            content: `## ${subtitle}`,
            order: index * 2,
            metadata: {
              fontSize: 'xl',
              isBold: true,
              alignment: 'left'
            }
          });
          
          if (content) {
            blocks.push({
              id: `${module.id}-subcontent-${index}`,
              type: 'text',
              content: content,
              order: index * 2 + 1,
              metadata: {
                fontSize: 'base',
                alignment: 'left'
              }
            });
          }
        }
      }
    });
    
    return blocks;
  }
  
  /**
   * Genera un CustomModule completo para el Tribunal Imperial
   */
  static generateCustomModule(module: ExtractedModule, authorId: string, authorName: string): CustomModule {
    return {
      id: module.id,
      title: module.title,
      description: module.description,
      authorId: authorId,
      authorName: authorName,
      authorLevel: 6, // Maestro
      targetLevels: [1], // Solo Iniciado por ahora
      category: module.category,
      content: this.convertToContentBlocks(module),
      isPublished: false, // Pendiente de aprobación
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: this.generateTags(module),
      difficulty: this.determineDifficulty(module),
      estimatedDuration: this.estimateDuration(module),
      prerequisites: this.getPrerequisites(module)
    };
  }
  
  /**
   * Genera tags automáticamente basados en el contenido
   */
  private static generateTags(module: ExtractedModule): string[] {
    const tags: string[] = [module.category];
    
    if (module.category === 'theoretical') {
      tags.push(...['economia', 'teoria', 'conceptos']);
    } else {
      tags.push(...['trading', 'practico', 'operativa']);
    }
    
    // Agregar tags basados en el contenido
    const content = module.content.toLowerCase();
    if (content.includes('bitcoin') || content.includes('criptomoneda')) {
      tags.push('criptomonedas');
    }
    if (content.includes('análisis') || content.includes('analisis')) {
      tags.push('analisis');
    }
    if (content.includes('riesgo') || content.includes('gestión')) {
      tags.push('gestion-riesgo');
    }
    
    return [...new Set(tags)]; // Eliminar duplicados
  }
  
  /**
   * Determina la dificultad del módulo
   */
  private static determineDifficulty(module: ExtractedModule): 'beginner' | 'intermediate' | 'advanced' {
    if (module.order <= 2) return 'beginner';
    if (module.order <= 6) return 'intermediate';
    return 'advanced';
  }
  
  /**
   * Estima la duración del módulo en minutos
   */
  private static estimateDuration(module: ExtractedModule): number {
    const wordCount = module.content.split(' ').length;
    return Math.max(15, Math.ceil(wordCount / 200) * 5); // 5 min por cada 200 palabras
  }
  
  /**
   * Obtiene los prerrequisitos del módulo
   */
  private static getPrerequisites(module: ExtractedModule): string[] {
    if (module.order === 1) return [];
    
    const prerequisites: string[] = [];
    
    // Agregar módulo anterior como prerrequisito
    if (module.order > 1) {
      const prevModule = module.category === 'theoretical' 
        ? `teorico-${module.order - 1}`
        : `practico-${module.order - 1}`;
      prerequisites.push(prevModule);
    }
    
    return prerequisites;
  }
}
