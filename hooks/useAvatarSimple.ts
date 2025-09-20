'use client';

import { useState, useEffect, useCallback } from 'react';

export function useAvatarSimple() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar avatar desde localStorage al inicializar - Solo una vez
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAvatar = localStorage.getItem('user-avatar');
      if (storedAvatar) {
        setAvatar(storedAvatar);
      } else {
        // Usar avatar por defecto
        const defaultAvatar = '/images/default-avatar.png';
        setAvatar(defaultAvatar);
        localStorage.setItem('user-avatar', defaultAvatar);
      }
    }
  }, []); // Dependencias vacías para ejecutar solo una vez

  const changeAvatar = useCallback(async (newAvatar: string | null) => {
    if (!newAvatar) return;

    try {
      setIsLoading(true);
      
      // Actualizar estado local
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
      const storedAvatar = localStorage.getItem('user-avatar');
      setAvatar(storedAvatar);
    }
  }, []);

  const refreshAvatar = useCallback(async () => {
    if (typeof window !== 'undefined') {
      const storedAvatar = localStorage.getItem('user-avatar');
      setAvatar(storedAvatar);
    }
  }, []);

  return {
    avatar,
    isLoading,
    changeAvatar,
    refreshAvatar,
    forceUpdate,
    reloadAvatar: refreshAvatar
  };
}
