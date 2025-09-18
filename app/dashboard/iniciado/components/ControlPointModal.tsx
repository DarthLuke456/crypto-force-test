'use client';

import React from 'react';
import { CheckCircle, XCircle, Hourglass, Lock } from 'lucide-react';

interface ControlPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  checkpointTitle: string;
  modulesToEvaluate: string[];
  timeUntilNextAttempt?: number;
  formatTime: (seconds: number) => string;
}

export default function ControlPointModal({
  isOpen,
  onClose,
  onStart,
  checkpointTitle,
  modulesToEvaluate,
  timeUntilNextAttempt = 0,
  formatTime
}: ControlPointModalProps) {
  if (!isOpen) return null;

  const canStart = timeUntilNextAttempt === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="text-2xl text-black" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{checkpointTitle}</h2>
          <p className="text-gray-300">Evaluación de Conocimientos</p>
        </div>

        {/* Información sobre los módulos a evaluar */}
        <div className="bg-[#232323] rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <CheckCircle className="mr-2 text-green-500" />
            Módulos a Evaluar:
          </h3>
          <ul className="space-y-2">
            {modulesToEvaluate.map((module, index) => (
              <li key={index} className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                {module}
              </li>
            ))}
          </ul>
        </div>

        {/* Reglas y metodología */}
        <div className="space-y-4 mb-6">
          <div className="bg-[#232323] rounded-xl p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center">
              <Hourglass className="mr-2 text-blue-500" />
              Metodología de Evaluación
            </h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <strong>Duración:</strong> Máximo 8 minutos para completar la evaluación</li>
              <li>• <strong>Formato:</strong> 12 preguntas de opción múltiple (6 por módulo)</li>
              <li>• <strong>Aprobación:</strong> Mínimo 70% de respuestas correctas</li>
              <li>• <strong>Navegación:</strong> Se bloqueará durante la evaluación</li>
            </ul>
          </div>

          <div className="bg-[#232323] rounded-xl p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center">
              <Lock className="mr-2 text-red-500" />
              Restricciones de Tiempo
            </h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <strong>Cooldown:</strong> 1 hora entre intentos del mismo checkpoint</li>
              <li>• <strong>Preparación:</strong> Te recomendamos revisar el contenido antes</li>
              <li>• <strong>Una vez iniciado:</strong> No podrás salir hasta completarlo</li>
            </ul>
          </div>
        </div>

        {/* Timer de cooldown si aplica */}
        {timeUntilNextAttempt > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <div className="text-center">
              <Hourglass className="text-2xl text-red-500 mx-auto mb-2" />
              <p className="text-red-400 font-semibold mb-1">Debes esperar antes del próximo intento</p>
              <p className="text-red-300 text-lg font-mono">
                {formatTime(timeUntilNextAttempt)}
              </p>
              <p className="text-red-300 text-sm mt-2">
                Te recomendamos usar este tiempo para revisar el contenido de los módulos
              </p>
            </div>
          </div>
        )}

        {/* Recomendaciones */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
          <h4 className="text-blue-400 font-semibold mb-2">💡 Recomendaciones:</h4>
          <ul className="text-sm text-blue-300 space-y-1">
            <li>• Revisa los conceptos clave de ambos módulos</li>
            <li>• Ten a mano tus apuntes si los tienes</li>
            <li>• Lee cada pregunta con atención</li>
            <li>• No te presiones, tienes tiempo suficiente</li>
          </ul>
        </div>

        {/* Botones */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-[#232323] hover:bg-[#2a2a2a] text-white rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onStart}
            disabled={!canStart}
            className={`px-6 py-3 rounded-lg transition-colors flex items-center ${
              canStart
                ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {canStart ? (
              <>
                <Lock className="mr-2" />
                Comenzar Evaluación
              </>
            ) : (
              <>
                <Lock className="mr-2" />
                Bloqueado
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 