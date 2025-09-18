import React from 'react';

interface Props {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
  respuestaSeleccionada: number | null;
  respuestaCorrectaEstado: boolean | null;
  onSeleccion: (index: number) => void;
  modulo: number;
  preguntaActual: number;
  totalPreguntas: number;
  respuestasCorrectas: number;
}

export default function PreguntaCard({
  pregunta,
  opciones,
  respuestaCorrecta,
  respuestaSeleccionada,
  respuestaCorrectaEstado,
  onSeleccion,
  modulo,
  preguntaActual,
  totalPreguntas,
  respuestasCorrectas,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Barra de Progreso */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2 mb-6">
        <div className="text-sm text-gray-600 dark:text-gray-400 text-right">
          Módulo {modulo + 1} - Pregunta {preguntaActual + 1}/{totalPreguntas}
        </div>
        <div className="w-full sm:w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#ec4d58] transition-all duration-300" 
            style={{ width: `${((preguntaActual + 1) / totalPreguntas) * 100}%` }}
          />
        </div>
      </div>

      <p className="font-medium">{pregunta}</p>
      <div className="space-y-2">
        {opciones.map((opcion, index) => {
          let bgColor = 'bg-white dark:bg-[#232323]';
          let textColor = 'text-[rgb(var(--foreground))]';

          if (respuestaSeleccionada !== null) {
            if (index === respuestaSeleccionada) {
              if (respuestaCorrectaEstado) {
                bgColor = 'bg-green-200 dark:bg-green-300';
              } else {
                bgColor = 'bg-red-200 dark:bg-red-300';
              }
              textColor = 'text-[#121212]';
            }
          }

          return (
            <button
              key={index}
              onClick={() => onSeleccion(index)}
              className={`w-full p-3 rounded-md shadow transition-all duration-300 ${bgColor} ${textColor} border border-gray-300 dark:border-gray-600`}
              disabled={respuestaSeleccionada !== null}
            >
              {opcion}
            </button>
          );
        })}
      </div>
    </div>
  );
}
