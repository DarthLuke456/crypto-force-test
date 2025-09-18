import { useState, useEffect, useCallback } from 'react';
import { useSafeAuth } from '@/context/AuthContext';
import { CustomModule } from '@/lib/tribunal/types';

interface UseRealTribunalContentReturn {
  tribunalContent: CustomModule[];
  isLoading: boolean;
  error: string | null;
  refreshContent: () => void;
}

export const useRealTribunalContent = (): UseRealTribunalContentReturn => {
  const { userData, isReady } = useSafeAuth();
  const [tribunalContent, setTribunalContent] = useState<CustomModule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener contenido del Tribunal Imperial
  const fetchTribunalContent = useCallback(async () => {
    if (!userData || !isReady) {
      console.log('⏳ Esperando autenticación para obtener contenido del Tribunal Imperial...');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 Obteniendo contenido del Tribunal Imperial...');

      // Obtener contenido desde localStorage (donde se almacenan las propuestas aprobadas)
      const storedProposals = localStorage.getItem('tribunal_proposals');
      if (storedProposals) {
        const allProposals = JSON.parse(storedProposals);
        
        // Filtrar solo las propuestas aprobadas que están dirigidas al nivel 1 (Iniciado)
        const approvedContent = allProposals.filter((proposal: any) => 
          proposal.status === 'approved' && 
          proposal.targetLevels && 
          proposal.targetLevels.includes(1)
        );

        console.log(`✅ Encontradas ${approvedContent.length} propuestas aprobadas para Iniciado`);
        setTribunalContent(approvedContent);
      } else {
        console.log('ℹ️ No hay propuestas almacenadas en localStorage');
        setTribunalContent([]);
      }
    } catch (err) {
      console.error('❌ Error obteniendo contenido del Tribunal Imperial:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [userData, isReady]);

  // Función para refrescar contenido manualmente
  const refreshContent = useCallback(() => {
    fetchTribunalContent();
  }, [fetchTribunalContent]);

  // Efecto para cargar contenido automáticamente
  useEffect(() => {
    if (userData && isReady) {
      console.log('🚀 Cargando contenido del Tribunal Imperial...');
      fetchTribunalContent();
    }
  }, [userData, isReady, fetchTribunalContent]);

  // Efecto para escuchar cambios en localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tribunal_proposals') {
        console.log('🔄 Cambios detectados en propuestas del Tribunal Imperial, actualizando...');
        fetchTribunalContent();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchTribunalContent]);

  return {
    tribunalContent,
    isLoading,
    error,
    refreshContent
  };
};

