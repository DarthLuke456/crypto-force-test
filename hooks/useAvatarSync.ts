'use client';

import { useEffect } from 'react';
import { useAvatar } from './useAvatar';

/**
 * Hook para sincronizar el avatar entre componentes
 * Se suscribe a cambios de avatar y fuerza actualizaciones
 */
export function useAvatarSync() {
  const { avatar, forceUpdate, reloadAvatar } = useAvatar();

  useEffect(() => {
    // Listener para cambios de avatar desde otros componentes
    const handleAvatarChanged = (event: CustomEvent) => {
      console.log('🔄 useAvatarSync - Avatar cambiado desde otro componente');
      forceUpdate();
    };

    // Listener para cambios de storage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user-avatar') {
        console.log('🔄 useAvatarSync - Avatar cambiado en storage');
        forceUpdate();
      }
    };

    // Listener para cambios de visibilidad (cuando el usuario regresa a la pestaña)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 useAvatarSync - Página visible, sincronizando avatar');
        setTimeout(() => {
          reloadAvatar();
          forceUpdate();
        }, 500);
      }
    };

    // Event listeners
    window.addEventListener('avatarChanged', handleAvatarChanged as EventListener);
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('avatarChanged', handleAvatarChanged as EventListener);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [forceUpdate, reloadAvatar]);

  return { avatar, forceUpdate, reloadAvatar };
}
