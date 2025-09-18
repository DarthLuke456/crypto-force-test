'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import CheckpointResultMessage from '@/app/dashboard/iniciado/components/CheckpointResultMessage';
import BackButton from '@/components/ui/BackButton';

const preguntas = [
  {
    pregunta: "¿Qué es la intervención del gobierno en los mercados?",
    opciones: [
      "La participación del gobierno para regular y controlar los mercados",
      "Solo la compra de bienes por parte del gobierno",
      "La venta de productos gubernamentales",
      "La privatización de empresas"
    ],
    respuestaCorrecta: 0
  },
  {
    pregunta: "¿Qué son los impuestos?",
    opciones: [
      "Pagos obligatorios al gobierno por parte de ciudadanos y empresas",
      "Donaciones voluntarias al gobierno",
      "Solo pagos por servicios públicos",
      "Solo pagos de empresas"
    ],
    respuestaCorrecta: 0
  },
  {
    pregunta: "¿Qué es un subsidio?",
    opciones: [
      "Un pago del gobierno para reducir el costo de un bien o servicio",
      "Un impuesto adicional",
      "Una multa gubernamental",
      "Un préstamo bancario"
    ],
    respuestaCorrecta: 0
  },
  {
    pregunta: "¿Qué es el control de precios?",
    opciones: [
      "La regulación gubernamental de los precios de bienes y servicios",
      "El control de la inflación por parte de los bancos",
      "La fijación de precios por parte de las empresas",
      "El control de precios por parte de los consumidores"
    ],
    respuestaCorrecta: 0
  },
  {
    pregunta: "¿Qué es un precio máximo?",
    opciones: [
      "El precio más alto que se permite cobrar por un bien o servicio",
      "El precio más bajo que se permite cobrar",
      "El precio de equilibrio del mercado",
      "El precio promedio del mercado"
    ],
    respuestaCorrecta: 0
  },
  {
    pregunta: "¿Qué es un precio mínimo?",
    opciones: [
      "El precio más bajo que se permite cobrar por un bien o servicio",
      "El precio más alto que se permite cobrar",
      "El precio de equilibrio del mercado",
      "El precio promedio del mercado"
    ],
    respuestaCorrecta: 0
  },
  {
    pregunta: "¿Qué es la competencia perfecta?",
    opciones: [
      "Un mercado con muchos compradores y vendedores con productos idénticos",
      "Un mercado con un solo vendedor",
      "Un mercado con pocos vendedores",
      "Un mercado sin regulación"
    ],
    respuestaCorrecta: 0
  },
  {
    pregunta: "¿Qué caracteriza a la competencia perfecta?",
    opciones: [
      "Productos idénticos, muchos vendedores, información perfecta",
      "Productos únicos, pocos vendedores, información limitada",
      "Productos diferenciados, un solo vendedor, información perfecta",
      "Productos variados, muchos vendedores, información limitada"
    ],
    respuestaCorrecta: 0
  },
  {
    pregunta: "¿Qué es un precio tomador?",
    opciones: [
      "Un vendedor que no puede influir en el precio del mercado",
      "Un vendedor que controla el precio del mercado",
      "Un comprador que controla el precio",
      "Un intermediario del mercado"
    ],
    respuestaCorrecta: 0
  },
  {
    pregunta: "¿Qué es la libertad de entrada y salida en competencia perfecta?",
    opciones: [
      "Las empresas pueden entrar y salir del mercado sin restricciones",
      "Solo las empresas grandes pueden entrar al mercado",
      "Las empresas no pueden salir del mercado",
      "Solo el gobierno puede controlar la entrada y salida"
    ],
    respuestaCorrecta: 0
  },
  {
    pregunta: "¿Qué es la información perfecta en competencia perfecta?",
    opciones: [
      "Todos los participantes conocen todos los precios y productos",
      "Solo los vendedores conocen los precios",
      "Solo los compradores conocen los precios",
      "Nadie conoce los precios"
    ],
    respuestaCorrecta: 0
  },
  {
    pregunta: "¿Por qué es importante la competencia perfecta?",
    opciones: [
      "Porque maximiza la eficiencia y el bienestar social",
      "Porque maximiza las ganancias de las empresas",
      "Porque reduce la innovación",
      "Porque aumenta los precios"
    ],
    respuestaCorrecta: 0
  }
];

export default function PuntoDeControl4() {
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
              <h1 className="text-4xl font-bold mb-4">Punto de Control 2</h1>
              <p className="text-xl text-gray-300">
                Evaluación: Módulos 3 y 4 - Intervención y Competencia
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
                <h3 className="text-lg font-semibold mb-4">Módulo 3: Acción del Gobierno en los Mercados</h3>
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
                <h3 className="text-lg font-semibold mb-4">Módulo 4: Competencia Perfecta</h3>
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
  const modulo = preguntaActual < 6 ? 3 : 4;

  return (
    <div className="min-h-screen bg-[#121212] text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Punto de Control 2</h1>
            <p className="text-xl text-gray-300">
              Evaluación: Módulos 3 y 4 - Intervención y Competencia
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