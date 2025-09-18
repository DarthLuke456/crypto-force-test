import { useEffect, useRef } from 'react';

export const useHeartbeat = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        await fetch('/api/user/heartbeat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Error enviando heartbeat:', error);
      }
    };

    // Enviar heartbeat inmediatamente
    sendHeartbeat();

    // Configurar intervalo para enviar heartbeat cada 30 segundos
    intervalRef.current = setInterval(sendHeartbeat, 30000);

    // Cleanup al desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Función para enviar heartbeat manualmente
  const sendManualHeartbeat = async () => {
    try {
      await fetch('/api/user/heartbeat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error enviando heartbeat manual:', error);
    }
  };

  return { sendManualHeartbeat };
};
