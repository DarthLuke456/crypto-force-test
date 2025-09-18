'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Cache global para el avatar
let globalAvatarCache: string | null = null;

// Listeners para cambios de avatar
const avatarListeners = new Set<(avatar: string | null) => void>();

// Funciones de utilidad para localStorage
const saveAvatarToStorage = (avatar: string | null) => {
  if (typeof window !== 'undefined') {
    if (avatar) {
      localStorage.setItem('user-avatar', avatar);
    } else {
      localStorage.removeItem('user-avatar');
    }
  }
};

const loadAvatarFromStorage = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user-avatar');
  }
  return null;
};

export function useAvatar() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateAvatar = useCallback((newAvatar: string | null) => {
    globalAvatarCache = newAvatar;
    saveAvatarToStorage(newAvatar);
    
    setAvatar(newAvatar);
    
    // Notificar a todos los listeners
    avatarListeners.forEach(listener => listener(newAvatar));
    
    // Disparar evento global
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('avatarChanged', { 
        detail: { avatar: newAvatar } 
      }));
    }
  }, []);

  const loadAvatar = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setAvatar(null);
        return;
      }

      const { data: profile, error } = await supabase
        .from('users')
        .select('avatar')
        .eq('id', session.user.id);

      if (error) {
        console.error('Error loading avatar:', error);
        return;
      }

      const avatarUrl = profile && profile.length > 0 ? profile[0]?.avatar || null : null;
      
      // Solo actualizar si no hay un avatar más reciente en el cache local
      const storedAvatar = loadAvatarFromStorage();
      if (storedAvatar && storedAvatar !== avatarUrl) {
        console.log('🔄 useAvatar - Usando avatar del cache local (más reciente)');
        globalAvatarCache = storedAvatar;
        setAvatar(storedAvatar);
      } else {
        console.log('🔄 useAvatar - Cargando avatar desde base de datos');
        globalAvatarCache = avatarUrl;
        setAvatar(avatarUrl);
        saveAvatarToStorage(avatarUrl);
      }
    } catch (error) {
      console.error('Error loading avatar:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const changeAvatar = useCallback(async (newAvatar: string | null) => {
    if (!newAvatar) return;

    try {
      console.log('🔄 useAvatar - Iniciando cambio de avatar...');
      
      // Actualizar inmediatamente el estado local para feedback visual
      updateAvatar(newAvatar);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No hay sesión activa');
      }

      console.log('🔄 useAvatar - Enviando avatar a API...');
      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ avatar: newAvatar })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ useAvatar - Avatar actualizado en base de datos');
        
        // Confirmar que el avatar se mantiene
        updateAvatar(newAvatar);
        
        // Forzar actualización global
        globalAvatarCache = newAvatar;
        saveAvatarToStorage(newAvatar);
        
        // Notificar a todos los listeners
        avatarListeners.forEach(listener => listener(newAvatar));
        
        // Disparar evento global
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('avatarChanged', { 
            detail: { avatar: newAvatar } 
          }));
        }
        
        console.log('✅ useAvatar - Avatar sincronizado globalmente');
      } else {
        const errorData = await response.json();
        console.error('❌ useAvatar - Error de API:', errorData);
        throw new Error(errorData.error || 'Error actualizando avatar');
      }
    } catch (error) {
      console.error('❌ useAvatar - Error changing avatar:', error);
      // Revertir el cambio local si falla
      const storedAvatar = loadAvatarFromStorage();
      updateAvatar(storedAvatar);
      throw error;
    }
  }, [updateAvatar]);

  // Listener para cambios de avatar
  useEffect(() => {
    const listener = (newAvatar: string | null) => {
      setAvatar(newAvatar);
    };

    avatarListeners.add(listener);

    // Inicializar desde localStorage si está disponible
    const storedAvatar = loadAvatarFromStorage();
    if (storedAvatar) {
      setAvatar(storedAvatar);
    }

    // Cargar desde API si no hay cache
    if (!globalAvatarCache) {
      loadAvatar();
    } else {
      setAvatar(globalAvatarCache);
    }

    return () => {
      avatarListeners.delete(listener);
    };
  }, [loadAvatar]);

  // Estado del avatar
  useEffect(() => {
    // Este efecto se ejecuta cuando el avatar cambia
  }, [avatar]);

  const refreshAvatar = useCallback(async () => {
    globalAvatarCache = null; // Limpiar cache
    await loadAvatar();
  }, [loadAvatar]);

  // Manejar cambios de autenticación
  useEffect(() => {
    const handleAuthChange = () => {
      if (!globalAvatarCache) {
        loadAvatar();
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sb-auth-token' || e.key?.includes('supabase')) {
        setTimeout(refreshAvatar, 1000); // Delay para asegurar que la sesión esté actualizada
      } else if (e.key === 'user-avatar') {
        const newAvatar = e.newValue && e.newValue !== 'null' ? e.newValue : null;
        updateAvatar(newAvatar);
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && !globalAvatarCache) {
        setTimeout(refreshAvatar, 500);
      }
    };

    const handleFocus = () => {
      if (!globalAvatarCache) {
        setTimeout(refreshAvatar, 300);
      }
    };

    const handleAvatarChanged = (event: CustomEvent) => {
      const newAvatar = event.detail.avatar;
      updateAvatar(newAvatar);
    };

    // Event listeners
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('avatarChanged', handleAvatarChanged as EventListener);

    // Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setTimeout(loadAvatar, 500);
      } else if (event === 'SIGNED_OUT') {
        updateAvatar(null);
      }
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('avatarChanged', handleAvatarChanged as EventListener);
      subscription.unsubscribe();
    };
  }, [loadAvatar, refreshAvatar, updateAvatar]);

  const forceUpdate = useCallback(() => {
    console.log('🔄 useAvatar - Forzando actualización de avatar...');
    const storedAvatar = loadAvatarFromStorage();
    globalAvatarCache = storedAvatar;
    setAvatar(storedAvatar);
    avatarListeners.forEach(listener => listener(storedAvatar));
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('avatarChanged', { 
        detail: { avatar: storedAvatar } 
      }));
    }
    console.log('✅ useAvatar - Avatar forzado actualizado:', storedAvatar ? 'Presente' : 'Ausente');
  }, []);

  const reloadAvatar = useCallback(async () => {
    console.log('🔄 useAvatar - Recargando avatar desde base de datos...');
    globalAvatarCache = null; // Limpiar cache para forzar recarga
    await loadAvatar();
  }, [loadAvatar]);

  return {
    avatar,
    isLoading,
    changeAvatar,
    refreshAvatar,
    forceUpdate,
    reloadAvatar
  };
}