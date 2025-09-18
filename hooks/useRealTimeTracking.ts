import { useState, useEffect, useCallback } from 'react';
import { useSafeAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

interface ActiveUser {
  user_id: string;
  nickname: string;
  user_level: number;
  last_seen: string;
  current_page: string;
  is_online: boolean;
}

interface ActivityStats {
  totalActive: number;
  maestrosActive: number;
  darthsActive: number;
  othersActive: number;
  lastUpdate: string;
}

interface UseRealTimeTrackingReturn {
  activeUsers: ActiveUser[];
  activityStats: ActivityStats | null;
  isLoading: boolean;
  error: string | null;
  startTracking: () => void;
  stopTracking: () => void;
  refreshData: () => void;
}

export const useRealTimeTracking = (): UseRealTimeTrackingReturn => {
  const { userData, isReady } = useSafeAuth();
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [activityStats, setActivityStats] = useState<ActivityStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Función para obtener datos de usuarios activos
  const fetchActiveUsers = useCallback(async () => {
    if (!userData || !isReady) {
      console.log('⏳ Esperando autenticación para obtener usuarios activos...');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Obtener el token de autenticación
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔍 Debug - fetchActiveUsers Session data:', { 
        hasSession: !!session, 
        hasToken: !!session?.access_token
      });
      
      if (!session?.access_token) {
        throw new Error('No hay token de autenticación disponible');
      }

      console.log('🔍 Debug - fetchActiveUsers Token (first 20 chars):', session.access_token.substring(0, 20) + '...');

      const response = await fetch('/api/real-time/active-users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error obteniendo usuarios activos');
      }

      setActiveUsers(data.activeUsers || []);
      setActivityStats(data.stats || null);
    } catch (err) {
      console.error('Error obteniendo usuarios activos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [userData, isReady]);

  // Función para registrar actividad del usuario actual
  const recordActivity = useCallback(async () => {
    if (!userData || !isReady || !userData.id) {
      console.log('⏳ Esperando autenticación completa...');
      return;
    }

    try {
      // Obtener el token de autenticación
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔍 Debug - Session data:', { 
        hasSession: !!session, 
        hasToken: !!session?.access_token,
        userId: userData.id,
        nickname: userData.nickname 
      });
      
      if (!session?.access_token) {
        console.log('⏳ No hay token de autenticación disponible para registrar actividad');
        return;
      }

      const requestData = {
        user_id: userData.id,
        nickname: userData.nickname || 'Usuario',
        user_level: userData.user_level || 1,
        current_page: window.location.pathname
      };
      
      console.log('🔍 Debug - Request data:', requestData);
      console.log('🔍 Debug - Token (first 20 chars):', session.access_token.substring(0, 20) + '...');

      const response = await fetch('/api/real-time/active-users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error registrando actividad');
      }
    } catch (err) {
      console.error('Error registrando actividad:', err);
    }
  }, [userData, isReady]);

  // Función para marcar usuario como offline
  const markUserOffline = useCallback(async () => {
    if (!userData || !userData.id) {
      console.log('⏳ No hay usuario para marcar como offline');
      return;
    }

    try {
      // Obtener el token de autenticación
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.log('⏳ No hay token de autenticación disponible para marcar offline');
        return;
      }

      const response = await fetch('/api/real-time/active-users', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.id
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error marcando usuario offline');
      }
    } catch (err) {
      console.error('Error marcando usuario offline:', err);
    }
  }, [userData]);

  // Función para iniciar tracking
  const startTracking = useCallback(() => {
    if (!userData || !isReady || isTracking || !userData.id) {
      console.log('⏳ Condiciones no cumplidas para iniciar tracking:', {
        hasUserData: !!userData,
        isReady,
        isTracking,
        hasUserId: !!userData?.id
      });
      return;
    }

    setIsTracking(true);
    
    // Registrar actividad inicial
    recordActivity();
    
    // Configurar intervalos
    const activityInterval = setInterval(recordActivity, 30000); // Cada 30 segundos
    const dataInterval = setInterval(fetchActiveUsers, 10000); // Cada 10 segundos

    // Guardar intervalos para limpiarlos después
    (window as any).activityInterval = activityInterval;
    (window as any).dataInterval = dataInterval;

    console.log('✅ Tracking de actividad iniciado para:', userData.nickname);
  }, [userData, isReady, isTracking, recordActivity, fetchActiveUsers]);

  // Función para detener tracking
  const stopTracking = useCallback(() => {
    if (!isTracking) return;

    setIsTracking(false);
    
    // Limpiar intervalos
    if ((window as any).activityInterval) {
      clearInterval((window as any).activityInterval);
      (window as any).activityInterval = null;
    }
    
    if ((window as any).dataInterval) {
      clearInterval((window as any).dataInterval);
      (window as any).dataInterval = null;
    }

    // Marcar usuario como offline
    markUserOffline();

    console.log('❌ Tracking de actividad detenido');
  }, [isTracking, markUserOffline]);

  // Función para refrescar datos manualmente
  const refreshData = useCallback(() => {
    fetchActiveUsers();
  }, [fetchActiveUsers]);

  // Efecto para iniciar tracking automáticamente
  useEffect(() => {
    if (userData && isReady && !isTracking && userData.id) {
      console.log('🚀 Iniciando tracking automático...');
      // Pequeño delay para asegurar que la autenticación esté completamente lista
      const timer = setTimeout(() => {
        startTracking();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [userData, isReady, isTracking, startTracking]);

  // Efecto para limpiar al desmontar
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  // Efecto para manejar cambios de página
  useEffect(() => {
    if (isTracking) {
      recordActivity();
    }
  }, [window.location.pathname, isTracking, recordActivity]);

  // Efecto para manejar visibilidad de la página
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Página oculta - pausar tracking
        if ((window as any).activityInterval) {
          clearInterval((window as any).activityInterval);
        }
      } else {
        // Página visible - reanudar tracking
        if (isTracking) {
          recordActivity();
          (window as any).activityInterval = setInterval(recordActivity, 30000);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isTracking, recordActivity]);

  return {
    activeUsers,
    activityStats,
    isLoading,
    error,
    startTracking,
    stopTracking,
    refreshData
  };
};
