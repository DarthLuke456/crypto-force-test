'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ControlPointState {
  isActive: boolean;
  currentCheckpoint: string | null;
  timeRemaining: number; // tiempo restante en segundos para el timer de 20 minutos
  lastAttemptTime: { [key: string]: number }; // timestamp del último intento por checkpoint
  isNavigationBlocked: boolean;
}

interface ControlPointContextType {
  state: ControlPointState;
  startCheckpoint: (checkpointId: string) => void;
  finishCheckpoint: () => void;
  canTakeCheckpoint: (checkpointId: string) => boolean;
  getTimeUntilNextAttempt: (checkpointId: string) => number;
  getTimeRemaining: () => number;
  formatTime: (seconds: number) => string;
  forceUnlock: () => void; // Nueva función para forzar desbloqueo
}

const ControlPointContext = createContext<ControlPointContextType | null>(null);

export const useControlPoint = () => {
  const context = useContext(ControlPointContext);
  if (!context) {
    throw new Error('useControlPoint debe ser usado dentro de un ControlPointProvider');
  }
  return context;
};

const ONE_HOUR_IN_SECONDS = 1 * 60 * 60; // 1 hora en segundos
const CHECKPOINT_DURATION = 8 * 60; // 8 minutos en segundos

export const ControlPointProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ControlPointState>({
    isActive: false,
    currentCheckpoint: null,
    timeRemaining: CHECKPOINT_DURATION,
    lastAttemptTime: {},
    isNavigationBlocked: false,
  });

  // Cargar datos guardados al inicializar
  useEffect(() => {
    const savedState = localStorage.getItem('controlPointState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setState(prev => ({
        ...prev,
        lastAttemptTime: parsed.lastAttemptTime || {},
        isActive: parsed.isActive || false,
        currentCheckpoint: parsed.currentCheckpoint || null,
        timeRemaining: parsed.timeRemaining || CHECKPOINT_DURATION,
        isNavigationBlocked: parsed.isNavigationBlocked || false,
      }));
    }
  }, []);

  // Timer para el checkpoint activo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.isActive && state.timeRemaining > 0) {
      interval = setInterval(() => {
        setState(prev => {
          const newTimeRemaining = prev.timeRemaining - 1;
          
          // Guardar estado en localStorage
          const newState = {
            ...prev,
            timeRemaining: newTimeRemaining,
          };
          localStorage.setItem('controlPointState', JSON.stringify(newState));
          
          return newState;
        });
      }, 1000);
    } else if (state.isActive && state.timeRemaining <= 0) {
      // Tiempo agotado, finalizar automáticamente
      finishCheckpoint();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isActive, state.timeRemaining]);

  // Verificar si el usuario está en una página de checkpoint
  useEffect(() => {
    const checkCurrentPage = () => {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const isOnCheckpointPage = currentPath.includes('punto-de-control');
      
      // Si no está en una página de checkpoint pero el estado está bloqueado, desbloquear
      if (!isOnCheckpointPage && state.isNavigationBlocked) {
        forceUnlock();
      }
    };

    // Verificar al cargar y cuando cambie la URL
    checkCurrentPage();
    window.addEventListener('popstate', checkCurrentPage);
    
    return () => {
      window.removeEventListener('popstate', checkCurrentPage);
    };
  }, [state.isNavigationBlocked]);

  const startCheckpoint = (checkpointId: string) => {
    const newState = {
      isActive: true,
      currentCheckpoint: checkpointId,
      timeRemaining: CHECKPOINT_DURATION,
      lastAttemptTime: state.lastAttemptTime,
      isNavigationBlocked: true,
    };
    
    setState(newState);
    localStorage.setItem('controlPointState', JSON.stringify(newState));
  };

  const finishCheckpoint = () => {
    if (state.currentCheckpoint) {
      const newState = {
        isActive: false,
        currentCheckpoint: null,
        timeRemaining: CHECKPOINT_DURATION,
        lastAttemptTime: {
          ...state.lastAttemptTime,
          [state.currentCheckpoint]: Date.now(),
        },
        isNavigationBlocked: false,
      };
      
      setState(newState);
      localStorage.setItem('controlPointState', JSON.stringify(newState));
    }
  };

  const forceUnlock = () => {
    const newState = {
      isActive: false,
      currentCheckpoint: null,
      timeRemaining: CHECKPOINT_DURATION,
      lastAttemptTime: state.lastAttemptTime,
      isNavigationBlocked: false,
    };
    
    setState(newState);
    localStorage.setItem('controlPointState', JSON.stringify(newState));
  };

  const canTakeCheckpoint = (checkpointId: string): boolean => {
    const lastAttempt = state.lastAttemptTime[checkpointId];
    if (!lastAttempt) return true;
    
    const timeSinceLastAttempt = (Date.now() - lastAttempt) / 1000;
    return timeSinceLastAttempt >= ONE_HOUR_IN_SECONDS;
  };

  const getTimeUntilNextAttempt = (checkpointId: string): number => {
    const lastAttempt = state.lastAttemptTime[checkpointId];
    if (!lastAttempt) return 0;
    
    const timeSinceLastAttempt = (Date.now() - lastAttempt) / 1000;
    const timeRemaining = ONE_HOUR_IN_SECONDS - timeSinceLastAttempt;
    
    return Math.max(0, timeRemaining);
  };

  const getTimeRemaining = (): number => {
    return state.timeRemaining;
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const value = {
    state,
    startCheckpoint,
    finishCheckpoint,
    canTakeCheckpoint,
    getTimeUntilNextAttempt,
    getTimeRemaining,
    formatTime,
    forceUnlock,
  };

  return (
    <ControlPointContext.Provider value={value}>
      {children}
    </ControlPointContext.Provider>
  );
}; 