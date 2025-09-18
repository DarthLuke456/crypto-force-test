import { useEffect, useCallback } from 'react';
import { useSafeAuth } from '@/context/AuthContext';

// Evento personalizado para sincronización de datos de usuario
const USER_DATA_UPDATED_EVENT = 'userDataUpdated';

export interface UserDataUpdateEvent {
  type: 'profile_updated' | 'user_created' | 'user_deleted';
  userId: string;
  userData?: any;
  timestamp: string;
}

export const useUserDataSync = () => {
  const { userData } = useSafeAuth();

  // Función para emitir evento de actualización
  const emitUserDataUpdate = useCallback((eventData: UserDataUpdateEvent) => {
    const event = new CustomEvent(USER_DATA_UPDATED_EVENT, {
      detail: eventData
    });
    window.dispatchEvent(event);
  }, []);

  // Función para escuchar eventos de actualización
  const listenToUserDataUpdates = useCallback((callback: (eventData: UserDataUpdateEvent) => void) => {
    const handleEvent = (event: CustomEvent<UserDataUpdateEvent>) => {
      callback(event.detail);
    };

    window.addEventListener(USER_DATA_UPDATED_EVENT, handleEvent as EventListener);
    
    return () => {
      window.removeEventListener(USER_DATA_UPDATED_EVENT, handleEvent as EventListener);
    };
  }, []);

  // Función para refrescar datos de usuario
  const refreshData = useCallback(async () => {
    // Recargar la página para obtener datos actualizados
    window.location.reload();
  }, []);

  return {
    emitUserDataUpdate,
    listenToUserDataUpdates,
    refreshData
  };
};

// Hook específico para escuchar actualizaciones de perfil
export const useProfileUpdateListener = (onProfileUpdate?: (eventData: UserDataUpdateEvent) => void) => {
  const { listenToUserDataUpdates } = useUserDataSync();

  useEffect(() => {
    if (!onProfileUpdate) return;

    const unsubscribe = listenToUserDataUpdates((eventData) => {
      if (eventData.type === 'profile_updated') {
        onProfileUpdate(eventData);
      }
    });

    return unsubscribe;
  }, [listenToUserDataUpdates, onProfileUpdate]);
};
