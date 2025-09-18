'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface ProgressState {
  theoretical: {
    nivel1: {
      checkpoints: {
        [key: string]: boolean;
      };
      results: {
        [key: string]: {
          score: number;
          completed: boolean;
          timestamp: number;
          timeSpent?: number;
          correctAnswers?: number;
          totalQuestions?: number;
        };
      };
    };
    nivel2: {
      checkpoints: {
        [key: string]: boolean;
      };
      results: {
        [key: string]: {
          score: number;
          completed: boolean;
          timestamp: number;
          timeSpent?: number;
          correctAnswers?: number;
          totalQuestions?: number;
        };
      };
    };
  };
  practical: {
    nivel1: {
      checkpoints: {
        [key: string]: boolean;
      };
      results: {
        [key: string]: {
          score: number;
          completed: boolean;
          timestamp: number;
          timeSpent?: number;
          correctAnswers?: number;
          totalQuestions?: number;
        };
      };
    };
    nivel2: {
      checkpoints: {
        [key: string]: boolean;
      };
      results: {
        [key: string]: {
          score: number;
          completed: boolean;
          timestamp: number;
          timeSpent?: number;
          correctAnswers?: number;
          totalQuestions?: number;
        };
      };
    };
  };
}

interface ProgressContextType {
  progress: ProgressState;
  completeCheckpoint: (courseType: 'theoretical' | 'practical', level: 'nivel1' | 'nivel2', checkpointId: string, result?: any) => void;
  isCheckpointCompleted: (courseType: 'theoretical' | 'practical', level: 'nivel1' | 'nivel2', checkpointId: string) => boolean;
  getCheckpointResult: (courseType: 'theoretical' | 'practical', level: 'nivel1' | 'nivel2', checkpointId: string) => any;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const initialProgress: ProgressState = {
  theoretical: {
    nivel1: {
      checkpoints: {
        'PC1': false, // Evaluación: Introducción + Fuerzas del Mercado
        'PC2': false, // Evaluación: Gobierno + Competencia Perfecta
      },
      results: {},
    },
    nivel2: {
      checkpoints: {
        'PC3': false, // Evaluación: Monopolio + Blockchain
        'PC4': false, // Evaluación final nivel 2
      },
      results: {},
    },
  },
  practical: {
    nivel1: {
      checkpoints: {
        'PC1': false, // Checkpoint práctico 1 (módulos 1-2)
        'PC2': false, // Checkpoint práctico 2 (módulos 3-4)
        'PC3': false, // Checkpoint práctico 3 (módulo 5)
      },
      results: {},
    },
    nivel2: {
      checkpoints: {
        'PC4': false, // Checkpoint práctico 4 (módulos 6-7)
        'PC5': false, // Checkpoint práctico 5 (módulos 8-10)
      },
      results: {},
    },
  },
};

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => {
    // Cargar progreso desde localStorage si existe
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userProgress');
      if (saved) {
        try {
          const parsedProgress = JSON.parse(saved);
          
          // Sincronizar con resultados de localStorage
          const syncWithLocalStorage = (courseType: 'theoretical' | 'practical', level: 'nivel1' | 'nivel2') => {
            const checkpoints = parsedProgress[courseType]?.[level]?.checkpoints || {};
            const results = parsedProgress[courseType]?.[level]?.results || {};
            
            // Verificar resultados en localStorage
            Object.keys(checkpoints).forEach(checkpointId => {
              // Para diferenciar entre teórico y práctico, usar prefijos
              const prefix = courseType === 'theoretical' ? 'teorico_' : 'practico_';
              const localStorageKey = prefix + checkpointId.toLowerCase() + '_result';
              const localStorageResult = localStorage.getItem(localStorageKey);
              
              if (localStorageResult) {
                try {
                  const result = JSON.parse(localStorageResult);
                  if (result.completed) {
                    checkpoints[checkpointId] = true;
                    results[checkpointId] = result;
                  }
                } catch (e) {
                  console.error('Error parsing localStorage result:', e);
                }
              }
            });
            
            return { checkpoints, results };
          };
          
          // Sincronizar teórico
          const theoreticalNivel1 = syncWithLocalStorage('theoretical', 'nivel1');
          const theoreticalNivel2 = syncWithLocalStorage('theoretical', 'nivel2');
          
          // Sincronizar práctico
          const practicalNivel1 = syncWithLocalStorage('practical', 'nivel1');
          const practicalNivel2 = syncWithLocalStorage('practical', 'nivel2');
          
          return {
            theoretical: {
              nivel1: {
                checkpoints: theoreticalNivel1.checkpoints,
                results: theoreticalNivel1.results,
              },
              nivel2: {
                checkpoints: theoreticalNivel2.checkpoints,
                results: theoreticalNivel2.results,
              },
            },
            practical: {
              nivel1: {
                checkpoints: practicalNivel1.checkpoints,
                results: practicalNivel1.results,
              },
              nivel2: {
                checkpoints: practicalNivel2.checkpoints,
                results: practicalNivel2.results,
              },
            },
          };
        } catch {
          return initialProgress;
        }
      }
    }
    return initialProgress;
  });

  // Guardar progreso en localStorage cuando cambie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userProgress', JSON.stringify(progress));
    }
  }, [progress]);

  const completeCheckpoint = (courseType: 'theoretical' | 'practical', level: 'nivel1' | 'nivel2', checkpointId: string, result?: any) => {
    setProgress(prev => {
      const newProgress = { ...prev };
      newProgress[courseType][level].checkpoints[checkpointId] = true;
      if (result) {
        newProgress[courseType][level].results[checkpointId] = result;
      }
      return newProgress;
    });
  };

  const isCheckpointCompleted = (courseType: 'theoretical' | 'practical', level: 'nivel1' | 'nivel2', checkpointId: string) => {
    if (!progress[courseType] || !progress[courseType][level] || !progress[courseType][level].checkpoints) {
      return false;
    }
    return progress[courseType][level].checkpoints[checkpointId] || false;
  };

  const getCheckpointResult = (courseType: 'theoretical' | 'practical', level: 'nivel1' | 'nivel2', checkpointId: string) => {
    if (!progress[courseType] || !progress[courseType][level] || !progress[courseType][level].results) {
      return null;
    }
    
    // Buscar en los resultados del contexto
    const contextResult = progress[courseType][level].results[checkpointId];
    if (contextResult) {
      return contextResult;
    }
    
    // Si no está en el contexto, buscar en localStorage
    const prefix = courseType === 'theoretical' ? 'teorico_' : 'practico_';
    const localStorageKey = prefix + checkpointId.toLowerCase() + '_result';
    const localStorageResult = localStorage.getItem(localStorageKey);
    
    if (localStorageResult) {
      try {
        const result = JSON.parse(localStorageResult);
        if (result.completed) {
          // Retornar el resultado sin actualizar el estado durante el renderizado
          return result;
        }
      } catch (e) {
        console.error('Error parsing localStorage result:', e);
      }
    }
    
    return null;
  };

  // Función separada para sincronizar resultados desde localStorage
  const syncCheckpointResults = useCallback(() => {
    if (typeof window === 'undefined') return;

    const courseTypes = ['theoretical', 'practical'] as const;
    const levels = ['nivel1', 'nivel2'] as const;

    courseTypes.forEach(courseType => {
      levels.forEach(level => {
        const checkpoints = progress[courseType][level].checkpoints;
        Object.keys(checkpoints).forEach(checkpointId => {
          const prefix = courseType === 'theoretical' ? 'teorico_' : 'practico_';
          const localStorageKey = prefix + checkpointId.toLowerCase() + '_result';
          const localStorageResult = localStorage.getItem(localStorageKey);
          
          if (localStorageResult && !progress[courseType][level].results[checkpointId]) {
            try {
              const result = JSON.parse(localStorageResult);
              if (result.completed) {
                setProgress(prev => {
                  const newProgress = { ...prev };
                  newProgress[courseType][level].results[checkpointId] = result;
                  newProgress[courseType][level].checkpoints[checkpointId] = true;
                  return newProgress;
                });
              }
            } catch (e) {
              console.error('Error parsing localStorage result:', e);
            }
          }
        });
      });
    });
  }, [progress]);

  // Ejecutar sincronización al montar el componente
  useEffect(() => {
    syncCheckpointResults();
  }, [syncCheckpointResults]);

  const resetProgress = () => {
    setProgress(initialProgress);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userProgress');
      // Limpiar también los resultados individuales de checkpoints
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('practico_pc') || key.includes('teorico_pc'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  };

  const cleanCorruptedProgress = () => {
    if (typeof window !== 'undefined') {
      // Limpiar completamente localStorage para forzar reinicialización
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('practico_pc') || key.includes('teorico_pc') || key === 'userProgress')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Forzar reinicialización del estado
      setProgress(initialProgress);
      
    }
  };

  // Limpiar datos corruptos solo una vez al inicializar
  useEffect(() => {
    // Forzar limpieza para aplicar corrección de números de módulos
    if (typeof window !== 'undefined') {
      const hasCleaned = localStorage.getItem('progressCleaned');
      if (!hasCleaned) {
        try {
          cleanCorruptedProgress();
          localStorage.setItem('progressCleaned', 'true');
        } catch (error) {
          console.error('Error durante la limpieza:', error);
        }
      }
    }
  }, []);

  const value: ProgressContextType = {
    progress,
    completeCheckpoint,
    isCheckpointCompleted,
    getCheckpointResult,
    resetProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
} 