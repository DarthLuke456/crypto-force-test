import { useState, useEffect, useCallback } from 'react';
import { useSafeAuth } from '@/context/AuthContext';

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

interface UseSimpleTrackingReturn {
  activeUsers: ActiveUser[];
  activityStats: ActivityStats | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => void;
}

export const useSimpleTracking = (): UseSimpleTrackingReturn => {
  const { userData, isReady } = useSafeAuth();
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [activityStats, setActivityStats] = useState<ActivityStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener datos de usuarios activos
  const fetchActiveUsers = useCallback(async () => {
    if (!userData || !isReady) {
      console.log('⏳ Esperando autenticación para obtener usuarios activos...');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 Simple Tracking - Fetching active users...');

      const response = await fetch('/api/real-time/active-users-simple');
      const data = await response.json();

      console.log('🔍 Simple Tracking - Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error obteniendo usuarios activos');
      }

      setActiveUsers(data.activeUsers || []);
      setActivityStats(data.stats || null);
      
      console.log('✅ Simple Tracking - Data updated successfully');
    } catch (err) {
      console.error('❌ Simple Tracking - Error obteniendo usuarios activos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [userData, isReady]);

  // Función para refrescar datos manualmente
  const refreshData = useCallback(() => {
    fetchActiveUsers();
  }, [fetchActiveUsers]);

  // Efecto para cargar datos automáticamente
  useEffect(() => {
    if (userData && isReady) {
      console.log('🚀 Simple Tracking - Starting automatic data fetch...');
      fetchActiveUsers();
    }
  }, [userData, isReady, fetchActiveUsers]);

  // Efecto para actualizar datos periódicamente
  useEffect(() => {
    if (!userData || !isReady) return;

    const interval = setInterval(() => {
      console.log('🔄 Simple Tracking - Periodic refresh...');
      fetchActiveUsers();
    }, 10000); // Cada 10 segundos

    return () => clearInterval(interval);
  }, [userData, isReady, fetchActiveUsers]);

  return {
    activeUsers,
    activityStats,
    isLoading,
    error,
    refreshData
  };
};
