// Hook Mejorado para Módulos del Tribunal Imperial
// Optimizado para rendimiento, funcionalidad operativa y experiencia de usuario

import { useState, useEffect, useCallback, useRef } from 'react';
import { CustomModule, ProposalStatus } from '@/lib/tribunal/types';
import { EnhancedContentInjectionSystem } from '@/lib/tribunal/enhanced-content-injection';

interface UseEnhancedTribunalModulesOptions {
  dashboardLevel: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableNotifications?: boolean;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

interface UseEnhancedTribunalModulesReturn {
  // Contenido
  theoreticalModules: CustomModule[];
  practicalModules: CustomModule[];
  checkpointModules: CustomModule[];
  
  // Estado
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  
  // Estadísticas
  totalModules: number;
  lastUpdated: Date | null;
  
  // Acciones
  refreshModules: () => Promise<void>;
  forceRefresh: () => Promise<void>;
  clearCache: () => void;
  
  // Sistema
  systemStats: {
    queueSize: number;
    activeInjections: number;
    cachedModules: number;
    subscribers: number;
  };
}

export function useEnhancedTribunalModules(
  options: UseEnhancedTribunalModulesOptions
): UseEnhancedTribunalModulesReturn {
  
  const {
    dashboardLevel,
    autoRefresh = true,
    refreshInterval = 30000,
    enableNotifications = true,
    priority = 'medium'
  } = options;
  
  // Estados principales
  const [theoreticalModules, setTheoreticalModules] = useState<CustomModule[]>([]);
  const [practicalModules, setPracticalModules] = useState<CustomModule[]>([]);
  const [checkpointModules, setCheckpointModules] = useState<CustomModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Referencias para cleanup
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const isMountedRef = useRef(true);
  
  // Función para procesar contenido recibido
  const processContent = useCallback((content: CustomModule[]) => {
    if (!isMountedRef.current) return;
    
    try {
      // Filtrar por nivel de dashboard
      const filteredContent = content.filter(module => 
        module.targetLevels.includes(dashboardLevel)
      );
      
      // Separar por categorías
      const theoretical = filteredContent.filter(module => 
        module.category === 'theoretical'
      );
      
      const practical = filteredContent.filter(module => 
        module.category === 'practical'
      );
      
      const checkpoints = filteredContent.filter(module => 
        module.category === 'checkpoint'
      );
      
      // Ordenar por fecha de actualización (más reciente primero)
      const sortByDate = (a: CustomModule, b: CustomModule) => {
        const dateA = new Date(a.updatedAt || a.createdAt);
        const dateB = new Date(b.updatedAt || b.createdAt);
        return dateB.getTime() - dateA.getTime();
      };
      
      setTheoreticalModules(theoretical.sort(sortByDate));
      setPracticalModules(practical.sort(sortByDate));
      setCheckpointModules(checkpoints.sort(sortByDate));
      
      setLastUpdated(new Date());
      setError(null);
      
      console.log(`📚 Módulos actualizados para dashboard ${dashboardLevel}:`, {
        theoretical: theoretical.length,
        practical: practical.length,
        checkpoints: checkpoints.length
      });
      
    } catch (err) {
      console.error('Error procesando contenido:', err);
      setError('Error procesando el contenido recibido');
    }
  }, [dashboardLevel]);
  
  // Función para cargar contenido inicial
  const loadInitialContent = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🔄 Cargando contenido inicial para dashboard ${dashboardLevel}`);
      
      // Obtener contenido desde el sistema mejorado
      const content = await EnhancedContentInjectionSystem.getContentForDashboard(dashboardLevel);
      
      if (isMountedRef.current) {
        processContent(content);
        setIsLoading(false);
      }
      
    } catch (err) {
      console.error('Error cargando contenido inicial:', err);
      if (isMountedRef.current) {
        setError('Error cargando el contenido inicial');
        setIsLoading(false);
      }
    }
  }, [dashboardLevel, processContent]);
  
  // Función para refrescar módulos
  const refreshModules = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    try {
      setIsRefreshing(true);
      setError(null);
      
      console.log(`🔄 Refrescando módulos para dashboard ${dashboardLevel}`);
      
      // Obtener contenido actualizado
      const content = await EnhancedContentInjectionSystem.getContentForDashboard(dashboardLevel);
      
      if (isMountedRef.current) {
        processContent(content);
        setIsRefreshing(false);
      }
      
    } catch (err) {
      console.error('Error refrescando módulos:', err);
      if (isMountedRef.current) {
        setError('Error refrescando los módulos');
        setIsRefreshing(false);
      }
    }
  }, [dashboardLevel, processContent]);
  
  // Función para forzar refresco completo
  const forceRefresh = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    try {
      setIsRefreshing(true);
      setError(null);
      
      console.log(`🔄 Forzando refresco completo para dashboard ${dashboardLevel}`);
      
      // Recargar contenido
      await loadInitialContent();
      
      if (isMountedRef.current) {
        setIsRefreshing(false);
      }
      
    } catch (err) {
      console.error('Error en refresco forzado:', err);
      if (isMountedRef.current) {
        setError('Error en el refresco forzado');
        setIsRefreshing(false);
      }
    }
  }, [dashboardLevel, loadInitialContent]);
  
  // Función para limpiar cache
  const clearCache = useCallback(() => {
    // Limpiar localStorage del Tribunal Imperial
    localStorage.removeItem('tribunal_proposals');
    localStorage.removeItem('tribunal_approved_modules');
    console.log('🗑️ Cache limpiado');
  }, []);
  
  // Configurar suscripción a actualizaciones en tiempo real
  useEffect(() => {
    if (!isMountedRef.current) return;
    
    console.log(`📡 Suscribiendo dashboard ${dashboardLevel} a actualizaciones en tiempo real`);
    
    // Suscribirse a actualizaciones
    const unsubscribe = EnhancedContentInjectionSystem.subscribeDashboard(
      dashboardLevel,
      processContent
    );
    
    unsubscribeRef.current = unsubscribe;
    
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [dashboardLevel, processContent]);
  
  // Configurar auto-refresh
  useEffect(() => {
    if (!autoRefresh || !isMountedRef.current) return;
    
    console.log(`⏰ Configurando auto-refresh cada ${refreshInterval}ms`);
    
    refreshIntervalRef.current = setInterval(() => {
      if (isMountedRef.current) {
        refreshModules();
      }
    }, refreshInterval);
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [autoRefresh, refreshInterval, refreshModules]);
  
  // Cargar contenido inicial
  useEffect(() => {
    loadInitialContent();
  }, [loadInitialContent]);
  
  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);
  
  // Calcular estadísticas
  const totalModules = theoreticalModules.length + practicalModules.length + checkpointModules.length;
  
  // Obtener estadísticas del sistema
  const systemStats = EnhancedContentInjectionSystem.getSystemStats();
  
  return {
    // Contenido
    theoreticalModules,
    practicalModules,
    checkpointModules,
    
    // Estado
    isLoading,
    isRefreshing,
    error,
    
    // Estadísticas
    totalModules,
    lastUpdated,
    
    // Acciones
    refreshModules,
    forceRefresh,
    clearCache,
    
    // Sistema
    systemStats
  };
}

// Hook simplificado para compatibilidad con el sistema existente
export function useTribunalModules() {
  return useEnhancedTribunalModules({
    dashboardLevel: 2, // Acólito por defecto
    autoRefresh: true,
    refreshInterval: 30000,
    enableNotifications: true,
    priority: 'medium'
  });
}
