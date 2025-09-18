export interface Pregunta {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
}

export const preguntas: Pregunta[] = [
  // Módulo 1: Introducción a la Lógica Económica (6 preguntas)
  {
    pregunta: "¿Qué es la escasez en economía?",
    opciones: [
      "La falta total de recursos",
      "La situación donde los recursos son limitados pero las necesidades son ilimitadas",
      "La pobreza extrema",
      "La falta de dinero",
      "La ausencia de tecnología",
      "La falta de educación"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Cuál es el costo de oportunidad?",
    opciones: [
      "El dinero que gastamos en algo",
      "El valor de la mejor alternativa que renunciamos al tomar una decisión",
      "El precio de un producto",
      "El tiempo que perdemos",
      "La energía que consumimos",
      "El esfuerzo que hacemos"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué significa 'marginal' en economía?",
    opciones: [
      "Algo muy pequeño",
      "El cambio en una variable cuando cambia otra en una unidad",
      "Algo sin importancia",
      "El límite de algo",
      "El mínimo necesario",
      "El máximo posible"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué es la utilidad marginal decreciente?",
    opciones: [
      "Que los productos se vuelven más caros",
      "Que la satisfacción adicional de consumir una unidad más disminuye",
      "Que los recursos se agotan",
      "Que la calidad baja",
      "Que el precio sube",
      "Que la demanda cae"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué son los incentivos en economía?",
    opciones: [
      "Premios y castigos",
      "Factores que motivan a las personas a actuar de cierta manera",
      "Subsidios del gobierno",
      "Bonificaciones",
      "Descuentos",
      "Recompensas"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Por qué es importante la especialización?",
    opciones: [
      "Para ganar más dinero",
      "Para aumentar la productividad y eficiencia",
      "Para ser el mejor en algo",
      "Para tener más trabajo",
      "Para destacar",
      "Para ser reconocido"
    ],
    respuestaCorrecta: 1
  },

  // Módulo 2: Fuerzas del Mercado (6 preguntas)
  {
    pregunta: "¿Qué es la ley de la demanda?",
    opciones: [
      "Que siempre hay demanda",
      "Que a mayor precio, menor cantidad demandada",
      "Que la demanda es infinita",
      "Que la demanda es constante",
      "Que la demanda varía",
      "Que la demanda es subjetiva"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué es la ley de la oferta?",
    opciones: [
      "Que siempre hay oferta",
      "Que a mayor precio, mayor cantidad ofrecida",
      "Que la oferta es infinita",
      "Que la oferta es constante",
      "Que la oferta varía",
      "Que la oferta es subjetiva"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué es el precio de equilibrio?",
    opciones: [
      "El precio más bajo",
      "El precio donde la oferta iguala a la demanda",
      "El precio más alto",
      "El precio promedio",
      "El precio justo",
      "El precio del mercado"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué es un bien sustituto?",
    opciones: [
      "Un bien de mala calidad",
      "Un bien que puede reemplazar a otro en el consumo",
      "Un bien complementario",
      "Un bien de lujo",
      "Un bien necesario",
      "Un bien barato"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué es un bien complementario?",
    opciones: [
      "Un bien que acompaña a otro",
      "Un bien que se consume junto con otro",
      "Un bien sustituto",
      "Un bien de lujo",
      "Un bien necesario",
      "Un bien barato"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué es la elasticidad de la demanda?",
    opciones: [
      "Qué tan flexible es la demanda",
      "Qué tan sensible es la cantidad demandada a cambios en el precio",
      "Qué tan variable es la demanda",
      "Qué tan estable es la demanda",
      "Qué tan alta es la demanda",
      "Qué tan baja es la demanda"
    ],
    respuestaCorrecta: 1
  }
]; 