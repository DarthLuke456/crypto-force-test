export interface Pregunta {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
}

export const preguntas: Pregunta[] = [
  // Módulo 3: Acción del Gobierno en los Mercados (6 preguntas)
  {
    pregunta: "¿Cuál es el principal objetivo de la política fiscal del gobierno?",
    opciones: [
      "Controlar la oferta monetaria",
      "Influir en la demanda agregada a través de impuestos y gasto público",
      "Regular las tasas de interés",
      "Establecer precios máximos en los mercados"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué tipo de política económica utiliza el gobierno cuando aumenta el gasto público durante una recesión?",
    opciones: [
      "Política monetaria contractiva",
      "Política fiscal expansiva",
      "Política de oferta",
      "Política de demanda restrictiva"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Cuál es el efecto principal de un aumento en los impuestos sobre la demanda agregada?",
    opciones: [
      "Aumenta la demanda agregada",
      "Disminuye la demanda agregada",
      "No tiene efecto sobre la demanda",
      "Solo afecta a la oferta agregada"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué instrumento utiliza principalmente el banco central para implementar la política monetaria?",
    opciones: [
      "Impuestos",
      "Gasto público",
      "Tasas de interés",
      "Subsidios"
    ],
    respuestaCorrecta: 2
  },
  {
    pregunta: "¿Cuál es el objetivo principal de la política monetaria expansiva?",
    opciones: [
      "Reducir la inflación",
      "Estimular el crecimiento económico",
      "Aumentar los impuestos",
      "Reducir el gasto público"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué sucede cuando el gobierno establece un precio máximo por debajo del precio de equilibrio?",
    opciones: [
      "Se crea un excedente de oferta",
      "Se crea un excedente de demanda (escasez)",
      "El mercado se mantiene en equilibrio",
      "Los precios bajan automáticamente"
    ],
    respuestaCorrecta: 1
  },

  // Módulo 4: Competencia Perfecta (6 preguntas)
  {
    pregunta: "¿Cuál es la característica principal de un mercado en competencia perfecta?",
    opciones: [
      "Un solo vendedor",
      "Muchos compradores y vendedores con productos idénticos",
      "Barreras de entrada altas",
      "Productos diferenciados"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Por qué las empresas en competencia perfecta son 'price takers'?",
    opciones: [
      "Porque pueden fijar cualquier precio",
      "Porque el precio está determinado por el mercado y no pueden influir en él",
      "Porque tienen poder de monopolio",
      "Porque venden productos únicos"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué representa la curva de oferta de una empresa en competencia perfecta en el corto plazo?",
    opciones: [
      "Su curva de costo total",
      "Su curva de costo marginal por encima del costo variable medio",
      "Su curva de ingreso marginal",
      "Su curva de demanda"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿En qué punto maximiza beneficios una empresa en competencia perfecta?",
    opciones: [
      "Donde el ingreso total es máximo",
      "Donde el costo marginal iguala al ingreso marginal",
      "Donde el precio es mínimo",
      "Donde la producción es máxima"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué sucede en el largo plazo en un mercado de competencia perfecta con beneficios económicos?",
    opciones: [
      "Las empresas existentes reducen producción",
      "Nuevas empresas entran al mercado hasta que los beneficios económicos desaparecen",
      "Los precios aumentan automáticamente",
      "El gobierno interviene para regular"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Cuál es la eficiencia económica de la competencia perfecta?",
    opciones: [
      "Es ineficiente porque hay muchas empresas",
      "Es eficiente porque produce al costo mínimo y satisface las preferencias del consumidor",
      "Es ineficiente porque no hay innovación",
      "Es eficiente solo en el corto plazo"
    ],
    respuestaCorrecta: 1
  }
]; 