// Hook para integrar contenido real del Tribunal Imperial en la página de cursos del maestro
// Reemplaza los datos ficticios con contenido real y coherente

import { useState, useEffect, useCallback } from 'react';
import { CustomModule, ProposalStatus } from '@/lib/tribunal/types';
import { EnhancedContentInjectionSystem } from '@/lib/tribunal/enhanced-content-injection';
import { TribunalOrchestrator } from '@/lib/tribunal/tribunal-orchestrator';

// Interfaz para módulos reales del Tribunal Imperial
interface RealTribunalModule {
  id: string;
  title: string;
  type: 'theoretical' | 'practical' | 'checkpoint';
  description: string;
  duration: string;
  checkpoints: number;
  status: 'active' | 'draft' | 'archived' | 'pending' | 'approved' | 'rejected';
  icon: string;
  level: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  targetLevels: number[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  content: any[];
  isFromTribunal: boolean;
  tribunalStatus?: 'pending' | 'approved' | 'rejected';
  votingProgress?: {
    totalVotes: number;
    votesCast: number;
    votesRemaining: number;
    approvalPercentage: number;
  };
}

// Interfaz para estadísticas reales
interface RealTribunalStats {
  totalModules: number;
  approvedModules: number;
  pendingModules: number;
  rejectedModules: number;
  activeVotes: number;
  completedIntegrations: number;
  systemHealth: {
    isInitialized: boolean;
    systemsStatus: any;
    activeOperations: string[];
  };
}

// Configuración del hook
const TRIBUNAL_CONTENT_CONFIG = {
  AUTO_REFRESH_INTERVAL: 30000, // 30 segundos
  ENABLE_REAL_TIME_UPDATES: true,
  SHOW_TRIBUNAL_STATUS: true,
  INCLUDE_VOTING_PROGRESS: true,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
};

export function useRealTribunalContent() {
  const [realModules, setRealModules] = useState<RealTribunalModule[]>([]);
  const [tribunalStats, setTribunalStats] = useState<RealTribunalStats>({
    totalModules: 0,
    approvedModules: 0,
    pendingModules: 0,
    rejectedModules: 0,
    activeVotes: 0,
    completedIntegrations: 0,
    systemHealth: {
      isInitialized: false,
      systemsStatus: {},
      activeOperations: []
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Función para cargar contenido real del Tribunal Imperial
  const loadRealTribunalContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔄 Cargando contenido real del Tribunal Imperial...');

      // 1. Obtener propuestas del localStorage
      const storedProposals = localStorage.getItem('tribunal_proposals');
      let tribunalProposals: any[] = [];

      if (storedProposals) {
        tribunalProposals = JSON.parse(storedProposals);
        console.log(`📋 Propuestas encontradas: ${tribunalProposals.length}`);
      }

      // 2. Convertir propuestas a módulos reales
      const realModulesData: RealTribunalModule[] = tribunalProposals.map((proposal: any) => ({
        id: proposal.id,
        title: proposal.title,
        type: proposal.category === 'checkpoint' ? 'checkpoint' : proposal.category,
        description: proposal.description,
        duration: calculateModuleDuration(proposal.content),
        checkpoints: proposal.category === 'checkpoint' ? 1 : calculateCheckpoints(proposal.content),
        status: mapTribunalStatus(proposal.status),
        icon: getModuleIcon(proposal.category, proposal.status),
        level: getLevelName(proposal.targetLevels?.[0] || 1),
        authorId: proposal.authorId,
        authorName: proposal.authorName,
        createdAt: proposal.createdAt,
        approvedAt: proposal.approvedAt,
        rejectedAt: proposal.rejectedAt,
        targetLevels: proposal.targetLevels || [1],
        difficulty: proposal.difficulty || 'intermediate',
        tags: proposal.tags || [],
        content: proposal.content || [],
        isFromTribunal: true,
        tribunalStatus: proposal.status,
        votingProgress: proposal.votingProgress
      }));

      // 3. Obtener estadísticas del sistema
      const systemStats = TribunalOrchestrator.getCompleteSystemStats();
      
      const realStats: RealTribunalStats = {
        totalModules: realModulesData.length,
        approvedModules: realModulesData.filter(m => m.tribunalStatus === 'approved').length,
        pendingModules: realModulesData.filter(m => m.tribunalStatus === 'pending').length,
        rejectedModules: realModulesData.filter(m => m.tribunalStatus === 'rejected').length,
        activeVotes: systemStats.voting.activeProposals,
        completedIntegrations: systemStats.integration.completedIntegrations,
        systemHealth: {
          isInitialized: systemStats.orchestrator.isInitialized,
          systemsStatus: systemStats.orchestrator.systemsStatus,
          activeOperations: systemStats.orchestrator.activeOperations
        }
      };

      // 4. Actualizar estado
      setRealModules(realModulesData);
      setTribunalStats(realStats);
      setLastUpdated(new Date());

      console.log(`✅ Contenido real cargado: ${realModulesData.length} módulos`);
      console.log(`📊 Estadísticas: ${realStats.approvedModules} aprobados, ${realStats.pendingModules} pendientes`);

    } catch (err) {
      console.error('❌ Error cargando contenido real del Tribunal:', err);
      setError('Error cargando contenido del Tribunal Imperial');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para obtener módulos por nivel
  const getModulesByLevel = useCallback((levelId: string): RealTribunalModule[] => {
    const levelNumber = getLevelNumber(levelId);
    return realModules.filter(module => 
      module.targetLevels.includes(levelNumber)
    );
  }, [realModules]);

  // Función para obtener módulos por tipo
  const getModulesByType = useCallback((levelId: string, type: 'theoretical' | 'practical' | 'checkpoint'): RealTribunalModule[] => {
    return getModulesByLevel(levelId).filter(module => module.type === type);
  }, [getModulesByLevel]);

  // Función para obtener estadísticas por nivel
  const getLevelStats = useCallback((levelId: string) => {
    const levelModules = getModulesByLevel(levelId);
    const theoretical = levelModules.filter(m => m.type === 'theoretical').length;
    const practical = levelModules.filter(m => m.type === 'practical').length;
    const checkpoints = levelModules.filter(m => m.type === 'checkpoint').length;
    const approved = levelModules.filter(m => m.tribunalStatus === 'approved').length;
    const pending = levelModules.filter(m => m.tribunalStatus === 'pending').length;

    return {
      total: levelModules.length,
      theoretical,
      practical,
      checkpoints,
      approved,
      pending,
      hasContent: levelModules.length > 0
    };
  }, [getModulesByLevel]);

  // Función para refrescar contenido
  const refreshContent = useCallback(() => {
    loadRealTribunalContent();
  }, [loadRealTribunalContent]);

  // Función para obtener estado del sistema
  const getSystemStatus = useCallback(() => {
    return {
      isHealthy: tribunalStats.systemHealth.isInitialized,
      activeOperations: tribunalStats.systemHealth.activeOperations,
      systemsStatus: tribunalStats.systemHealth.systemsStatus
    };
  }, [tribunalStats]);

  // Cargar contenido inicial
  useEffect(() => {
    loadRealTribunalContent();
  }, [loadRealTribunalContent]);

  // Configurar auto-refresh
  useEffect(() => {
    if (!TRIBUNAL_CONTENT_CONFIG.ENABLE_REAL_TIME_UPDATES) return;

    const interval = setInterval(() => {
      loadRealTribunalContent();
    }, TRIBUNAL_CONTENT_CONFIG.AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [loadRealTribunalContent]);

  // Escuchar eventos del Tribunal Imperial
  useEffect(() => {
    const handleTribunalUpdate = () => {
      console.log('🔄 Evento del Tribunal Imperial recibido, actualizando contenido...');
      loadRealTribunalContent();
    };

    window.addEventListener('tribunal_proposal_updated', handleTribunalUpdate);
    window.addEventListener('tribunal_vote_cast', handleTribunalUpdate);
    window.addEventListener('tribunal_proposal_approved', handleTribunalUpdate);

    return () => {
      window.removeEventListener('tribunal_proposal_updated', handleTribunalUpdate);
      window.removeEventListener('tribunal_vote_cast', handleTribunalUpdate);
      window.removeEventListener('tribunal_proposal_approved', handleTribunalUpdate);
    };
  }, [loadRealTribunalContent]);

  return {
    // Datos
    realModules,
    tribunalStats,
    
    // Estado
    isLoading,
    error,
    lastUpdated,
    
    // Funciones
    getModulesByLevel,
    getModulesByType,
    getLevelStats,
    refreshContent,
    getSystemStatus,
    
    // Utilidades
    hasRealContent: realModules.length > 0,
    isSystemHealthy: tribunalStats.systemHealth.isInitialized
  };
}

// Funciones auxiliares

function calculateModuleDuration(content: any[]): string {
  if (!content || !Array.isArray(content) || content.length === 0) return '0 min';
  
  // Estimación basada en el tipo y cantidad de contenido
  let totalMinutes = 0;
  
  content.forEach(block => {
    switch (block.type) {
      case 'text':
        const textLength = typeof block.content === 'string' ? block.content.length : 0;
        totalMinutes += Math.max(5, Math.ceil(textLength / 500)); // 1 min por 500 caracteres
        break;
      case 'image':
        totalMinutes += 2;
        break;
      case 'video':
        totalMinutes += 10;
        break;
      case 'code':
        totalMinutes += 15;
        break;
      default:
        totalMinutes += 5;
    }
  });
  
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  }
}

function calculateCheckpoints(content: any[]): number {
  if (!content || !Array.isArray(content) || content.length === 0) return 0;
  
  // Calcular checkpoints basado en el patrón "2 módulos → 1 checkpoint"
  const contentBlocks = content.filter(block => 
    block.type !== 'divider' && block.type !== 'checklist'
  );
  
  return Math.floor(contentBlocks.length / 2);
}

function mapTribunalStatus(status: string): 'active' | 'draft' | 'archived' | 'pending' | 'approved' | 'rejected' {
  switch (status) {
    case 'approved':
      return 'active';
    case 'pending':
      return 'pending';
    case 'rejected':
      return 'rejected';
    case 'draft':
      return 'draft';
    default:
      return 'draft';
  }
}

function getModuleIcon(category: string, status: string): string {
  if (status === 'pending') return '⏳';
  if (status === 'rejected') return '❌';
  if (status === 'approved') {
    switch (category) {
      case 'theoretical': return '📚';
      case 'practical': return '🎯';
      case 'checkpoint': return '✅';
      default: return '📄';
    }
  }
  return '📝';
}

function getLevelName(levelNumber: number): string {
  const levelNames = {
    1: 'iniciados',
    2: 'acolitos',
    3: 'warriors',
    4: 'lord',
    5: 'darth',
    6: 'maestro'
  };
  return levelNames[levelNumber as keyof typeof levelNames] || 'iniciados';
}

function getLevelNumber(levelId: string): number {
  const levelNumbers = {
    'iniciados': 1,
    'acolitos': 2,
    'warriors': 3,
    'lord': 4,
    'darth': 5,
    'maestro': 6
  };
  return levelNumbers[levelId as keyof typeof levelNumbers] || 1;
}
