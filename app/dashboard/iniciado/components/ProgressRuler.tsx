'use client';

import { useProgress } from '@/context/ProgressContext';
import { CheckCircle, Lock, Unlock, Eye, Play, Flag } from 'lucide-react';
import { useState } from 'react';

interface ProgressRulerProps {
  courseType: 'theoretical' | 'practical';
}

export default function ProgressRuler({ courseType }: ProgressRulerProps) {
  const { progress, getCheckpointResult } = useProgress();
  const [hoveredCheckpoint, setHoveredCheckpoint] = useState<string | null>(null);

  // Obtener checkpoints completados
  const getCompletedCheckpoints = () => {
    const nivel1Checkpoints = Object.values(progress[courseType].nivel1.checkpoints).filter(Boolean).length;
    const nivel2Checkpoints = Object.values(progress[courseType].nivel2.checkpoints).filter(Boolean).length;
    const total = nivel1Checkpoints + nivel2Checkpoints;
    
    // Verificar que los checkpoints tengan el formato correcto
    const nivel1Keys = Object.keys(progress[courseType].nivel1.checkpoints);
    const nivel2Keys = Object.keys(progress[courseType].nivel2.checkpoints);
    
    console.log('Verificación de checkpoints:', {
      courseType,
      nivel1Keys,
      nivel2Keys,
      nivel1Completed: nivel1Checkpoints,
      nivel2Completed: nivel2Checkpoints,
      totalCompleted: total
    });
    
    return total;
  };

  // Total de checkpoints disponibles
  const totalCheckpoints = courseType === 'theoretical' ? 4 : 5; // 4 teóricos, 5 prácticos
  const completedCheckpoints = getCompletedCheckpoints();
  
  // Calcular el porcentaje de progreso basado en el último checkpoint completado
  // Si hay 1 checkpoint completado, debe pintar hasta el marcador 1
  // Para 5 checkpoints: 0=0%, 1=20%, 2=40%, 3=60%, 4=80%, 5=100%
  const progressPercentage = completedCheckpoints > 0 
    ? Math.round((completedCheckpoints / totalCheckpoints) * 100)
    : 0;

  // Función para formatear fecha
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para formatear tiempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#232323] rounded-xl p-6 mb-8">
      <h3 className="text-lg font-bold text-white mb-6">
        Barra de Progreso General - {courseType === 'theoretical' ? 'Teórico' : 'Práctico'}
      </h3>

      {/* Regla de Progreso */}
      <div className="relative">
        {/* Barra principal */}
        <div className="relative h-8 bg-[#2a2a2a] rounded-lg overflow-hidden border border-[#333] px-4">
          {/* Progreso visual */}
          <div 
            className="h-full bg-gradient-to-r from-[#ec4d58] to-[#d63d47] rounded-lg transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
          
          {/* Marcadores de checkpoints distribuidos uniformemente */}
          <div className="absolute inset-0 flex items-center px-4">
            {Array.from({ length: totalCheckpoints + 1 }, (_, index) => {
              const checkpointNumber = index;
              const isCompleted = index <= completedCheckpoints;
              let position = (index / totalCheckpoints) * 100;
              
              // Ajustar posición del primer número (0) hacia la derecha
              if (index === 0) {
                position = 5; // Mover un poco hacia la derecha
              }
              // Ajustar posición del último número hacia la izquierda
              else if (index === totalCheckpoints) {
                position = 95; // Mover un poco hacia la izquierda
              }
              
              return (
                <div 
                  key={index} 
                  className="absolute flex flex-col items-center transform -translate-x-1/2"
                  style={{ left: `${position}%` }}
                >
                  {/* Marcador vertical */}
                  <div 
                    className={`w-1 h-4 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-white' : 'bg-gray-600'
                    }`}
                  />
                  {/* Número del checkpoint */}
                  <span className={`text-xs mt-1 font-medium transition-all duration-300 ${
                    isCompleted ? 'text-white' : 'text-gray-500'
                  }`}>
                    {checkpointNumber}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Información de progreso */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <Play className="w-4 h-4 text-[#fafafa]" />
          </div>
          
          <div className="text-center">
            <span className="text-lg font-bold text-white">{completedCheckpoints}/{totalCheckpoints}</span>
            <span className="text-sm text-gray-400 ml-2">Puntos de Control</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Flag className="w-4 h-4 text-[#fafafa]" />
          </div>
        </div>

        {/* Estado de checkpoints */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-[#2a2a2a] border border-[#333] rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Nivel 1</h4>
            <div className="space-y-2">
              {Object.entries(progress[courseType].nivel1.checkpoints).map(([checkpointId, isCompleted]) => {
                const result = getCheckpointResult(courseType, 'nivel1', checkpointId);
                
                return (
                  <div key={checkpointId} className="flex items-center justify-between group">
                    <span className="text-sm text-gray-400">{checkpointId}</span>
                    <div className="flex items-center space-x-2">
                      {isCompleted ? (
                        <>
                          <Unlock className="w-4 h-4 text-[#fafafa]" />
                          {result && (
                            <div className="relative">
                              <Eye 
                                className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition-colors"
                                onMouseEnter={() => setHoveredCheckpoint(checkpointId)}
                                onMouseLeave={() => setHoveredCheckpoint(null)}
                              />
                              {/* Tooltip con resultados */}
                              {hoveredCheckpoint === checkpointId && (
                                <div className="absolute bottom-full right-0 mb-2 p-3 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg z-10 min-w-[200px]">
                                  <h5 className="text-sm font-semibold text-white mb-2">Resultado de Evaluación</h5>
                                  <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Puntuación:</span>
                                      <span className="text-white">{result.score.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Correctas:</span>
                                      <span className="text-white">{result.correctAnswers || 0}/{result.totalQuestions || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Fecha:</span>
                                      <span className="text-white">{formatDate(result.timestamp)}</span>
                                    </div>
                                    {result.timeSpent && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Tiempo:</span>
                                        <span className="text-white">{formatTime(result.timeSpent)}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <Lock className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-[#2a2a2a] border border-[#333] rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Nivel 2</h4>
            <div className="space-y-2">
              {Object.entries(progress[courseType].nivel2.checkpoints).map(([checkpointId, isCompleted]) => {
                const result = getCheckpointResult(courseType, 'nivel2', checkpointId);
                
                return (
                  <div key={checkpointId} className="flex items-center justify-between group">
                    <span className="text-sm text-gray-400">{checkpointId}</span>
                    <div className="flex items-center space-x-2">
                      {isCompleted ? (
                        <>
                          <Unlock className="w-4 h-4 text-[#fafafa]" />
                          {result && (
                            <div className="relative">
                              <Eye 
                                className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition-colors"
                                onMouseEnter={() => setHoveredCheckpoint(checkpointId)}
                                onMouseLeave={() => setHoveredCheckpoint(null)}
                              />
                              {/* Tooltip con resultados */}
                              {hoveredCheckpoint === checkpointId && (
                                <div className="absolute bottom-full right-0 mb-2 p-3 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg z-10 min-w-[200px]">
                                  <h5 className="text-sm font-semibold text-white mb-2">Resultado de Evaluación</h5>
                                  <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Puntuación:</span>
                                      <span className="text-white">{result.score.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Correctas:</span>
                                      <span className="text-white">{result.correctAnswers || 0}/{result.totalQuestions || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Fecha:</span>
                                      <span className="text-white">{formatDate(result.timestamp)}</span>
                                    </div>
                                    {result.timeSpent && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Tiempo:</span>
                                        <span className="text-white">{formatTime(result.timeSpent)}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <Lock className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 