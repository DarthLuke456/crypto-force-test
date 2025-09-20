'use client';

import { useState, useEffect, useCallback } from 'react';

// Cache global para evitar re-renders innecesarios
let globalAvatarCache: string | null = null;
let cacheInitialized = false;

export function useAvatarStable() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Inicializar avatar una sola vez
  useEffect(() => {
    if (typeof window !== 'undefined' && !cacheInitialized) {
      try {
        const storedAvatar = localStorage.getItem('user-avatar');
        if (storedAvatar) {
          globalAvatarCache = storedAvatar;
          setAvatar(storedAvatar);
        } else {
          const defaultAvatar = '/images/default-avatar.png';
          globalAvatarCache = defaultAvatar;
          setAvatar(defaultAvatar);
          localStorage.setItem('user-avatar', defaultAvatar);
        }
        cacheInitialized = true;
      } catch (error) {
        console.error('Error initializing avatar:', error);
        globalAvatarCache = '/images/default-avatar.png';
        setAvatar('/images/default-avatar.png');
        cacheInitialized = true;
      }
    } else if (cacheInitialized && globalAvatarCache) {
      setAvatar(globalAvatarCache);
    }
  }, []);

  const changeAvatar = useCallback(async (newAvatar: string | null) => {
    if (!newAvatar) return;

    try {
      setIsLoading(true);
      
      // Actualizar cache global
      globalAvatarCache = newAvatar;
      setAvatar(newAvatar);
      
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user-avatar', newAvatar);
      }
      
      // Simular éxito
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error changing avatar:', error);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const forceUpdate = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedAvatar = localStorage.getItem('user-avatar');
        if (storedAvatar && storedAvatar !== globalAvatarCache) {
          globalAvatarCache = storedAvatar;
          setAvatar(storedAvatar);
        }
      } catch (error) {
        console.error('Error in forceUpdate:', error);
      }
    }
  }, []);

  const refreshAvatar = useCallback(async () => {
    forceUpdate();
  }, [forceUpdate]);

  return {
    avatar: avatar || '/images/default-avatar.png',
    isLoading,
    changeAvatar,
    refreshAvatar,
    forceUpdate,
    reloadAvatar: refreshAvatar
  };
}
