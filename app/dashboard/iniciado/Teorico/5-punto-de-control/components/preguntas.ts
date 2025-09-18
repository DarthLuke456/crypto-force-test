// app/dashboard/iniciado/5-punto-de-control/preguntas.ts

export type Pregunta = {
    pregunta: string;
    opciones: string[];
    respuestaCorrecta: number;
  };
  
  export const preguntasPorModulo: Pregunta[][] = [
    // Módulo 1 - Fundamentos Crypto
    [
      {
        pregunta: "¿Qué es una criptomoneda?",
        opciones: [
          "Un tipo de moneda física emitida por gobiernos",
          "Un activo digital que usa criptografía",
          "Un bono emitido por bancos",
          "Una acción de una empresa tecnológica"
        ],
        respuestaCorrecta: 1,
      },
      {
        pregunta: "¿Cuál es la principal tecnología detrás de las criptomonedas?",
        opciones: ["Blockchain", "Inteligencia Artificial", "Big Data", "Metaverso"],
        respuestaCorrecta: 0,
      },
      {
        pregunta: "¿Cuál fue la primera criptomoneda creada?",
        opciones: ["Ethereum", "Solana", "Bitcoin", "Ripple"],
        respuestaCorrecta: 2,
      },
      {
        pregunta: "¿Qué se necesita para operar criptomonedas con seguridad?",
        opciones: [
          "Nada, es muy intuitivo",
          "Educación y prácticas de seguridad",
          "Una cuenta bancaria",
          "Solo suerte y rapidez"
        ],
        respuestaCorrecta: 1,
      }
    ],
  
    // Módulo 2 - Análisis Básico
    [
      {
        pregunta: "¿Qué es el análisis técnico?",
        opciones: [
          "El estudio del precio y volumen históricos",
          "Una predicción emocional del mercado",
          "Una forma de controlar a los exchanges",
          "Una técnica para crear criptomonedas"
        ],
        respuestaCorrecta: 0,
      },
      {
        pregunta: "¿Qué herramienta se utiliza en análisis técnico?",
        opciones: ["Patrones de velas", "Tendencias", "Indicadores", "Todas las anteriores"],
        respuestaCorrecta: 3,
      },
      {
        pregunta: "¿Cuál es una ventaja del análisis técnico?",
        opciones: ["Predecir con exactitud el futuro", "Identificar puntos de entrada y salida", "Evitar cualquier pérdida", "Eliminar el riesgo"],
        respuestaCorrecta: 1,
      },
      {
        pregunta: "¿Qué NO forma parte del análisis técnico?",
        opciones: ["Soportes y resistencias", "Noticias políticas", "Indicadores RSI y MACD", "Tendencias"],
        respuestaCorrecta: 1,
      }
    ],
  
    // Módulo 3 - Gestión de Riesgo
    [
      {
        pregunta: "¿Cuál es el objetivo principal de la gestión de riesgo?",
        opciones: ["Obtener ganancias máximas inmediatas", "Minimizar pérdidas y proteger capital", "Evitar operar", "Ignorar las emociones"],
        respuestaCorrecta: 1,
      },
      {
        pregunta: "¿Qué es el Stop Loss?",
        opciones: ["Un tipo de moneda estable", "Una orden para limitar pérdidas", "Una estrategia de inversión a largo plazo", "Un indicador técnico"],
        respuestaCorrecta: 1,
      },
      {
        pregunta: "¿Qué significa diversificación?",
        opciones: ["Invertir todo en una sola criptomoneda", "Operar sin análisis", "Distribuir el capital en varios activos", "Apostar al azar"],
        respuestaCorrecta: 2,
      },
      {
        pregunta: "¿Qué representa el ratio riesgo/beneficio?",
        opciones: [
          "La cantidad exacta de ganancia asegurada",
          "La proporción entre lo que arriesgo y lo que espero ganar",
          "Una señal de entrada",
          "La volatilidad del mercado"
        ],
        respuestaCorrecta: 1,
      }
    ],
  
    // Módulo 4 - Psicología del Trader
    [
      {
        pregunta: "¿Qué es la psicología del trading?",
        opciones: ["Un mito sin relevancia real", "El estudio de criptomonedas", "El impacto de las emociones en tus decisiones de trading", "Una técnica para programar bots"],
        respuestaCorrecta: 2,
      },
      {
        pregunta: "¿Qué emoción puede llevarte a mantener una posición perdedora?",
        opciones: ["Alegría", "Miedo", "Esperanza", "Euforia"],
        respuestaCorrecta: 2,
      },
      {
        pregunta: "¿Por qué es importante el autocontrol en trading?",
        opciones: ["Para evitar errores emocionales", "Para operar más rápido", "Para ganar más que otros", "Para dejar de estudiar"],
        respuestaCorrecta: 0,
      },
      {
        pregunta: "¿Cuál es una recomendación para manejar la euforia tras una racha ganadora?",
        opciones: ["Doblar la inversión inmediatamente", "Hacer más operaciones impulsivas", "Reflexionar y mantener la disciplina", "Dejar el análisis"],
        respuestaCorrecta: 2,
      }
    ]
  ];