// Sistema de tracking de usuarios activos en tiempo real
import { supabase } from '@/lib/supabaseClient';

export interface UserActivity {
  id: string;
  user_id: string;
  nickname: string;
  user_level: number;
  last_activity: Date;
  is_online: boolean;
  current_page: string;
  session_id: string;
  ip_address?: string;
  user_agent?: string;
}

export interface ActiveUser {
  id: string;
  nickname: string;
  user_level: number;
  last_seen: Date;
  current_page: string;
  is_online: boolean;
}

// Configuración del sistema
const ACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutos de inactividad = offline
const HEARTBEAT_INTERVAL = 30 * 1000; // Heartbeat cada 30 segundos

class UserActivityTracker {
  private static instance: UserActivityTracker;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private currentUserId: string | null = null;
  private currentSessionId: string | null = null;

  private constructor() {}

  public static getInstance(): UserActivityTracker {
    if (!UserActivityTracker.instance) {
      UserActivityTracker.instance = new UserActivityTracker();
    }
    return UserActivityTracker.instance;
  }

  // Inicializar tracking para el usuario actual
  public async initializeTracking(userId: string, nickname: string, userLevel: number): Promise<void> {
    try {
      this.currentUserId = userId;
      this.currentSessionId = this.generateSessionId();
      
      // Registrar actividad inicial
      await this.recordActivity(userId, nickname, userLevel, window.location.pathname);
      
      // Iniciar heartbeat
      this.startHeartbeat();
      
      console.log('✅ UserActivityTracker inicializado para:', nickname);
    } catch (error) {
      console.error('❌ Error inicializando UserActivityTracker:', error);
    }
  }

  // Registrar actividad del usuario
  public async recordActivity(
    userId: string, 
    nickname: string, 
    userLevel: number, 
    currentPage: string
  ): Promise<void> {
    try {
      const activityData = {
        user_id: userId,
        nickname,
        user_level: userLevel,
        last_activity: new Date().toISOString(),
        is_online: true,
        current_page: currentPage,
        session_id: this.currentSessionId || this.generateSessionId(),
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent
      };

      // Insertar o actualizar actividad en la base de datos
      const { error } = await supabase
        .from('user_activity')
        .upsert(activityData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('❌ Error registrando actividad:', error);
      } else {
        console.log('✅ Actividad registrada para:', nickname);
      }
    } catch (error) {
      console.error('❌ Error inesperado registrando actividad:', error);
    }
  }

  // Obtener usuarios activos en tiempo real
  public async getActiveUsers(): Promise<ActiveUser[]> {
    try {
      const cutoffTime = new Date(Date.now() - ACTIVITY_TIMEOUT).toISOString();
      
      const { data, error } = await supabase
        .from('user_activity')
        .select('user_id, nickname, user_level, last_activity, current_page, is_online')
        .gte('last_activity', cutoffTime)
        .eq('is_online', true)
        .order('last_activity', { ascending: false });

      if (error) {
        console.error('❌ Error obteniendo usuarios activos:', error);
        return [];
      }

      return (data || []).map(user => ({
        id: user.user_id,
        nickname: user.nickname,
        user_level: user.user_level,
        last_seen: new Date(user.last_activity),
        current_page: user.current_page,
        is_online: user.is_online
      }));
    } catch (error) {
      console.error('❌ Error inesperado obteniendo usuarios activos:', error);
      return [];
    }
  }

  // Obtener estadísticas de actividad
  public async getActivityStats(): Promise<{
    totalActive: number;
    maestrosActive: number;
    darthsActive: number;
    othersActive: number;
    lastUpdate: Date;
  }> {
    try {
      const activeUsers = await this.getActiveUsers();
      const now = new Date();
      
      const maestrosActive = activeUsers.filter(u => u.user_level >= 6).length;
      const darthsActive = activeUsers.filter(u => u.user_level === 5).length;
      const othersActive = activeUsers.filter(u => u.user_level < 5).length;

      return {
        totalActive: activeUsers.length,
        maestrosActive,
        darthsActive,
        othersActive,
        lastUpdate: now
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de actividad:', error);
      return {
        totalActive: 0,
        maestrosActive: 0,
        darthsActive: 0,
        othersActive: 0,
        lastUpdate: new Date()
      };
    }
  }

  // Marcar usuario como offline
  public async markUserOffline(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_activity')
        .update({ 
          is_online: false,
          last_activity: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('❌ Error marcando usuario como offline:', error);
      } else {
        console.log('✅ Usuario marcado como offline:', userId);
      }
    } catch (error) {
      console.error('❌ Error inesperado marcando usuario offline:', error);
    }
  }

  // Iniciar heartbeat
  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(async () => {
      if (this.currentUserId) {
        // Obtener datos del usuario desde el contexto de auth
        const userData = await this.getCurrentUserData();
        if (userData) {
          await this.recordActivity(
            this.currentUserId,
            userData.nickname,
            userData.user_level,
            window.location.pathname
          );
        }
      }
    }, HEARTBEAT_INTERVAL);
  }

  // Detener heartbeat
  public stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Limpiar usuarios inactivos
  public async cleanupInactiveUsers(): Promise<void> {
    try {
      const cutoffTime = new Date(Date.now() - ACTIVITY_TIMEOUT).toISOString();
      
      const { error } = await supabase
        .from('user_activity')
        .update({ is_online: false })
        .lt('last_activity', cutoffTime)
        .eq('is_online', true);

      if (error) {
        console.error('❌ Error limpiando usuarios inactivos:', error);
      } else {
        console.log('✅ Usuarios inactivos marcados como offline');
      }
    } catch (error) {
      console.error('❌ Error inesperado limpiando usuarios inactivos:', error);
    }
  }

  // Funciones auxiliares
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  private async getCurrentUserData(): Promise<{ nickname: string; user_level: number } | null> {
    try {
      // Obtener datos del usuario desde localStorage o contexto
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        return {
          nickname: parsed.nickname || 'Usuario',
          user_level: parsed.user_level || 1
        };
      }
      return null;
    } catch {
      return null;
    }
  }
}

// Exportar instancia singleton
export const userActivityTracker = UserActivityTracker.getInstance();

// Hook para usar en componentes React
export const useUserActivity = () => {
  const startTracking = async (userId: string, nickname: string, userLevel: number) => {
    await userActivityTracker.initializeTracking(userId, nickname, userLevel);
  };

  const stopTracking = async (userId: string) => {
    await userActivityTracker.markUserOffline(userId);
    userActivityTracker.stopHeartbeat();
  };

  const getActiveUsers = async () => {
    return await userActivityTracker.getActiveUsers();
  };

  const getActivityStats = async () => {
    return await userActivityTracker.getActivityStats();
  };

  return {
    startTracking,
    stopTracking,
    getActiveUsers,
    getActivityStats
  };
};
