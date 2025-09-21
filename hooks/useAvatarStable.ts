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
    if (typeof window !== 'undefined') {
      try {
        const storedAvatar = localStorage.getItem('user-avatar');
        console.log('🔍 useAvatarStable: Avatar almacenado:', storedAvatar);
        
        if (storedAvatar) {
          globalAvatarCache = storedAvatar;
          setAvatar(storedAvatar);
          console.log('✅ useAvatarStable: Avatar restaurado desde localStorage');
        } else {
          const defaultAvatar = '/images/default-avatar.png';
          globalAvatarCache = defaultAvatar;
          setAvatar(defaultAvatar);
          localStorage.setItem('user-avatar', defaultAvatar);
          console.log('✅ useAvatarStable: Avatar por defecto establecido');
        }
        cacheInitialized = true;
      } catch (error) {
        console.error('❌ useAvatarStable: Error initializing avatar:', error);
        globalAvatarCache = '/images/default-avatar.png';
        setAvatar('/images/default-avatar.png');
        cacheInitialized = true;
      }
    }
  }, []);

  const changeAvatar = useCallback(async (newAvatar: string | null) => {
    if (!newAvatar) return;

    try {
      console.log('🔍 useAvatarStable: Cambiando avatar a:', newAvatar.substring(0, 50) + '...');
      setIsLoading(true);
      
      // Actualizar cache global
      globalAvatarCache = newAvatar;
      setAvatar(newAvatar);
      
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user-avatar', newAvatar);
        console.log('✅ useAvatarStable: Avatar guardado en localStorage');
      }
      
      // Simular éxito
      setTimeout(() => {
        setIsLoading(false);
        console.log('✅ useAvatarStable: Avatar cambiado exitosamente');
      }, 500);
      
    } catch (error) {
      console.error('❌ useAvatarStable: Error changing avatar:', error);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const forceUpdate = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedAvatar = localStorage.getItem('user-avatar');
        console.log('🔍 useAvatarStable: forceUpdate - Avatar almacenado:', storedAvatar?.substring(0, 50) + '...');
        console.log('🔍 useAvatarStable: forceUpdate - Cache global:', globalAvatarCache?.substring(0, 50) + '...');
        
        if (storedAvatar && storedAvatar !== globalAvatarCache) {
          globalAvatarCache = storedAvatar;
          setAvatar(storedAvatar);
          console.log('✅ useAvatarStable: forceUpdate - Avatar actualizado desde localStorage');
        } else if (storedAvatar) {
          console.log('✅ useAvatarStable: forceUpdate - Avatar ya está actualizado');
        }
      } catch (error) {
        console.error('❌ useAvatarStable: Error in forceUpdate:', error);
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
