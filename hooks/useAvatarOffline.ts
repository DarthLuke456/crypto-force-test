'use client';

import { useState, useEffect, useCallback } from 'react';

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

export function useAvatarOffline() {
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
      // Cargar desde localStorage
      const storedAvatar = loadAvatarFromStorage();
      if (storedAvatar) {
        globalAvatarCache = storedAvatar;
        setAvatar(storedAvatar);
      } else {
        // Usar avatar por defecto
        const defaultAvatar = '/images/default-avatar.png';
        globalAvatarCache = defaultAvatar;
        setAvatar(defaultAvatar);
        saveAvatarToStorage(defaultAvatar);
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
      // Actualizar inmediatamente el estado local
      updateAvatar(newAvatar);
      
      // Simular éxito (sin API)
      setTimeout(() => {
        console.log('✅ Avatar actualizado offline');
      }, 100);
      
    } catch (error) {
      console.error('Error changing avatar:', error);
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

    // Cargar desde cache global si no hay localStorage
    if (!globalAvatarCache) {
      loadAvatar();
    } else {
      setAvatar(globalAvatarCache);
    }

    return () => {
      avatarListeners.delete(listener);
    };
  }, [loadAvatar]);

  const refreshAvatar = useCallback(async () => {
    globalAvatarCache = null; // Limpiar cache
    await loadAvatar();
  }, [loadAvatar]);

  const forceUpdate = useCallback(() => {
    const storedAvatar = loadAvatarFromStorage();
    globalAvatarCache = storedAvatar;
    setAvatar(storedAvatar);
    avatarListeners.forEach(listener => listener(storedAvatar));
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('avatarChanged', { 
        detail: { avatar: storedAvatar } 
      }));
    }
  }, []);

  const reloadAvatar = useCallback(async () => {
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
