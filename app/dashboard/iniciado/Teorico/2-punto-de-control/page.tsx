'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import CheckpointResultMessage from '@/app/dashboard/iniciado/components/CheckpointResultMessage';
import BackButton from '@/components/ui/BackButton';

const preguntas = [
  {
    pregunta: "¿Qué es la economía?",
    opciones: [
      "La ciencia que estudia cómo las sociedades utilizan recursos limitados para satisfacer necesidades ilimitadas",
      "El estudio de las empresas y sus ganancias",
      "La gestión del dinero personal",
      "El análisis de los precios de las acciones"
    ],
    respuestaCorrecta: 0
  },
  {
    pregunta: "¿Cuál es la ley fundamental de la oferta?",
    opciones: [
      "A mayor precio, mayor cantidad ofrecida",
      "A menor precio, mayor cantidad ofrecida", 
      "El precio no afecta la oferta",
      "La oferta siempre es constante"
    ],
    respuestaCorrecta: 0
  },
  {
    pregunta: "¿Qué representa la demanda en un mercado?",
    opciones: [
      "La cantidad de bienes que los productores quieren vender",
      "La cantidad de bienes que los consumidores están dispuestos a comprar",
      "El precio de equilibrio del mercado",
      "La competencia entre empresas"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué sucede cuando la oferta aumenta?",
    opciones: [
      "El precio sube y la cantidad vendida baja",
      "El precio baja y la cantidad vendida sube",
      "El precio y la cantidad se mantienen igual",
      "Solo el precio cambia"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué es el precio de equilibrio?",
    opciones: [
      "El precio más alto que puede cobrar un vendedor",
      "El precio más bajo que puede pagar un comprador",
      "El precio donde la oferta iguala la demanda",
      "El precio promedio del mercado"
    ],
    respuestaCorrecta: 2
  },
  {
    pregunta: "¿Cómo afecta un aumento en la demanda al precio?",
    opciones: [
      "El precio sube",
      "El precio baja",
      "El precio no cambia",
      "El precio fluctúa sin patrón"
    ],
    respuestaCorrecta: 0
  },
  {
    pregunta: "¿Qué son los bienes sustitutos?",
    opciones: [
      "Bienes que se consumen juntos",
      "Bienes que pueden reemplazarse entre sí",
      "Bienes de lujo",
      "Bienes básicos"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué representa la elasticidad de la demanda?",
    opciones: [
      "La velocidad de cambio del precio",
      "La sensibilidad de la cantidad demandada ante cambios en el precio",
      "La cantidad total de bienes disponibles",
      "El tiempo que tarda en ajustarse el mercado"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué es un monopolio?",
    opciones: [
      "Un mercado con muchos vendedores",
      "Un mercado con un solo vendedor",
      "Un mercado con pocos vendedores",
      "Un mercado sin regulación"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué es un oligopolio?",
    opciones: [
      "Un mercado con muchos vendedores",
      "Un mercado con un solo vendedor",
      "Un mercado con pocos vendedores",
      "Un mercado sin regulación"
    ],
    respuestaCorrecta: 2
  },
  {
    pregunta: "¿Qué es la competencia perfecta?",
    opciones: [
      "Un mercado con muchos compradores y vendedores",
      "Un mercado con un solo vendedor",
      "Un mercado con pocos vendedores",
      "Un mercado sin regulación"
    ],
    respuestaCorrecta: 0
  },
  {
    pregunta: "¿Qué es el excedente del consumidor?",
    opciones: [
      "La diferencia entre lo que el consumidor está dispuesto a pagar y lo que realmente paga",
      "El beneficio del productor",
      "El impuesto sobre las ventas",
      "El costo de producción"
    ],
    respuestaCorrecta: 0
  }
];

export default function PuntoDeControl2() {
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<number[]>(new Array(12).fill(null));
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [respuestasCorrectas, setRespuestasCorrectas] = useState(0);
  const router = useRouter();

  const totalPreguntas = preguntas.length;

  const handleRespuesta = (respuesta: number) => {
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[preguntaActual] = respuesta;
    setRespuestas(nuevasRespuestas);
    
    const esCorrecta = respuesta === preguntas[preguntaActual].respuestaCorrecta;
    if (esCorrecta) {
      setRespuestasCorrectas(prev => prev + 1);
    }
  };

  const siguientePregunta = () => {
    if (preguntaActual < totalPreguntas - 1) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      setMostrarResultados(true);
    }
  };

  const preguntaAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(preguntaActual - 1);
    }
  };

  const reiniciar = () => {
    setPreguntaActual(0);
    setRespuestas(new Array(12).fill(null));
    setMostrarResultados(false);
    setRespuestasCorrectas(0);
  };

  const porcentajeAprobacion = (respuestasCorrectas / totalPreguntas) * 100;
  const aprobado = porcentajeAprobacion >= 70;

  if (mostrarResultados) {
    return (
      <div className="min-h-screen bg-[#121212] text-white pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Punto de Control 1</h1>
              <p className="text-xl text-gray-300">
                Evaluación: Módulos 1 y 2 - Fundamentos Económicos
              </p>
            </div>

            <div className="mb-8">
              <CheckpointResultMessage 
                score={porcentajeAprobacion} 
                isApproved={aprobado} 
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#232323] p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Módulo 1: Introducción a la Lógica Económica</h3>
                <div className="space-y-2">
                  {preguntas.slice(0, 6).map((pregunta, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full ${
                        respuestas[index] === pregunta.respuestaCorrecta 
                          ? 'bg-green-500' 
                          : 'bg-red-500'
                      }`} />
                      <span className="text-sm">Pregunta {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#232323] p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Módulo 2: Fuerzas del Mercado</h3>
                <div className="space-y-2">
                  {preguntas.slice(6, 12).map((pregunta, index) => (
                    <div key={index + 6} className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full ${
                        respuestas[index + 6] === pregunta.respuestaCorrecta 
                          ? 'bg-green-500' 
                          : 'bg-red-500'
                      }`} />
                      <span className="text-sm">Pregunta {index + 7}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={reiniciar}
                className="px-6 py-3 bg-[#ec4d58] hover:bg-[#d63d47] text-white rounded-lg transition-colors"
              >
                Intentar de Nuevo
              </button>
              <button
                onClick={() => router.push('/dashboard/iniciado')}
                className="px-6 py-3 bg-[#232323] hover:bg-[#2a2a2a] text-white rounded-lg transition-colors"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pregunta = preguntas[preguntaActual];
  const modulo = preguntaActual < 6 ? 1 : 2;

  return (
    <div className="min-h-screen bg-[#121212] text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Punto de Control 1</h1>
            <p className="text-xl text-gray-300">
              Evaluación: Módulos 1 y 2 - Fundamentos Económicos
            </p>
            <div className="mt-4 text-sm text-gray-400">
              Pregunta {preguntaActual + 1} de {totalPreguntas} • Módulo {modulo}
            </div>
          </div>

          <div className="bg-[#232323] rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">{pregunta.pregunta}</h2>
            
            <div className="space-y-4">
              {pregunta.opciones.map((opcion, index) => (
                <button
                  key={index}
                  onClick={() => handleRespuesta(index)}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    respuestas[preguntaActual] === index
                      ? 'bg-[#ec4d58] border-[#ec4d58] text-white'
                      : 'bg-[#2a2a2a] border-[#333] hover:bg-[#333] text-gray-300'
                  }`}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <BackButton />

            <div className="flex gap-4">
              {preguntaActual > 0 && (
                <button
                  onClick={preguntaAnterior}
                  className="px-6 py-3 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-lg transition-colors"
                >
                  Anterior
                </button>
              )}
              
              {respuestas[preguntaActual] !== null && (
                <button
                  onClick={siguientePregunta}
                  className="px-6 py-3 bg-[#ec4d58] hover:bg-[#d63d47] text-white rounded-lg transition-colors"
                >
                  {preguntaActual === totalPreguntas - 1 ? 'Finalizar' : 'Siguiente'}
                </button>
              )}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-center space-x-2">
              {preguntas.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    respuestas[index] !== null
                      ? respuestas[index] === preguntas[index].respuestaCorrecta
                        ? 'bg-green-500'
                        : 'bg-red-500'
                      : 'bg-[#333]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}