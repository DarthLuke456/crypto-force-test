// Orquestador Principal del Tribunal Imperial
// Conecta y coordina todos los sistemas mejorados para funcionalidad operativa completa

import { CustomModule, ProposalStatus } from './types';
import { EnhancedContentInjectionSystem } from './enhanced-content-injection';
import { EnhancedVotingSystem } from './enhanced-voting-system';
import { OptimizedCarrouselEngine } from './optimized-carousel-engine';
import { AutomatedIntegrationSystem } from './automated-integration-system';
import { PerformanceOptimizationSystem } from './performance-optimization-system';

// Interfaz para el estado del orquestador
export interface TribunalOrchestratorState {
  isInitialized: boolean;
  systemsStatus: {
    contentInjection: boolean;
    votingSystem: boolean;
    carouselEngine: boolean;
    integrationSystem: boolean;
    performanceOptimization: boolean;
  };
  activeOperations: string[];
  systemMetrics: {
    totalProposals: number;
    activeVotes: number;
    completedIntegrations: number;
    cacheHitRate: number;
    averagePerformance: number;
  };
  lastHealthCheck: Date;
}

// Configuración del orquestador
export const TRIBUNAL_ORCHESTRATOR_CONFIG = {
  AUTO_INITIALIZE: true,
  HEALTH_CHECK_INTERVAL: 60000, // 1 minuto
  METRICS_UPDATE_INTERVAL: 30000, // 30 segundos
  ERROR_RECOVERY_ENABLED: true,
  PERFORMANCE_MONITORING: true,
  AUTO_OPTIMIZATION: true,
  NOTIFICATION_ENABLED: true
};

// Clase principal del orquestador
export class TribunalOrchestrator {
  
  private static state: TribunalOrchestratorState = {
    isInitialized: false,
    systemsStatus: {
      contentInjection: false,
      votingSystem: false,
      carouselEngine: false,
      integrationSystem: false,
      performanceOptimization: false
    },
    activeOperations: [],
    systemMetrics: {
      totalProposals: 0,
      activeVotes: 0,
      completedIntegrations: 0,
      cacheHitRate: 0,
      averagePerformance: 0
    },
    lastHealthCheck: new Date()
  };
  
  private static healthCheckInterval: NodeJS.Timeout | null = null;
  private static metricsUpdateInterval: NodeJS.Timeout | null = null;
  private static subscribers: Set<(state: TribunalOrchestratorState) => void> = new Set();
  
  /**
   * Inicializa el orquestador y todos los sistemas
   */
  static async initialize(): Promise<{
    success: boolean;
    initializedSystems: string[];
    failedSystems: string[];
    errors: string[];
  }> {
    
    console.log('🎭 Inicializando Orquestador del Tribunal Imperial...');
    
    const initializedSystems: string[] = [];
    const failedSystems: string[] = [];
    const errors: string[] = [];
    
    try {
      // 1. Inicializar Sistema de Optimización de Rendimiento
      try {
        PerformanceOptimizationSystem.initialize();
        this.state.systemsStatus.performanceOptimization = true;
        initializedSystems.push('PerformanceOptimization');
        console.log('✅ Sistema de Optimización de Rendimiento inicializado');
      } catch (error) {
        failedSystems.push('PerformanceOptimization');
        errors.push(`PerformanceOptimization: ${error}`);
        console.error('❌ Error inicializando Sistema de Optimización:', error);
      }
      
      // 2. Inicializar Sistema de Inyección de Contenido
      try {
        EnhancedContentInjectionSystem.initialize();
        this.state.systemsStatus.contentInjection = true;
        initializedSystems.push('ContentInjection');
        console.log('✅ Sistema de Inyección de Contenido inicializado');
      } catch (error) {
        failedSystems.push('ContentInjection');
        errors.push(`ContentInjection: ${error}`);
        console.error('❌ Error inicializando Sistema de Inyección:', error);
      }
      
      // 3. Inicializar Sistema de Votación
      try {
        EnhancedVotingSystem.initialize();
        this.state.systemsStatus.votingSystem = true;
        initializedSystems.push('VotingSystem');
        console.log('✅ Sistema de Votación inicializado');
      } catch (error) {
        failedSystems.push('VotingSystem');
        errors.push(`VotingSystem: ${error}`);
        console.error('❌ Error inicializando Sistema de Votación:', error);
      }
      
      // 4. Inicializar Sistema de Integración Automática
      try {
        AutomatedIntegrationSystem.initialize();
        this.state.systemsStatus.integrationSystem = true;
        initializedSystems.push('IntegrationSystem');
        console.log('✅ Sistema de Integración Automática inicializado');
      } catch (error) {
        failedSystems.push('IntegrationSystem');
        errors.push(`IntegrationSystem: ${error}`);
        console.error('❌ Error inicializando Sistema de Integración:', error);
      }
      
      // 5. Marcar motor de carrousels como inicializado (no requiere inicialización explícita)
      this.state.systemsStatus.carouselEngine = true;
      initializedSystems.push('CarouselEngine');
      console.log('✅ Motor de Carrousels listo');
      
      // 6. Configurar monitoreo y salud del sistema
      this.setupHealthMonitoring();
      this.setupMetricsUpdate();
      
      // 7. Marcar como inicializado
      this.state.isInitialized = true;
      this.state.lastHealthCheck = new Date();
      
      // 8. Notificar a suscriptores
      this.notifySubscribers();
      
      console.log('🎭 Orquestador del Tribunal Imperial inicializado exitosamente');
      
      return {
        success: true,
        initializedSystems,
        failedSystems,
        errors
      };
      
    } catch (error) {
      console.error('❌ Error crítico inicializando orquestador:', error);
      return {
        success: false,
        initializedSystems,
        failedSystems,
        errors: [...errors, `Orchestrator: ${error}`]
      };
    }
  }
  
  /**
   * Procesa una propuesta completa desde la creación hasta el despliegue
   */
  static async processCompleteProposal(
    proposal: CustomModule,
    authorId: string,
    authorName: string,
    authorLevel: number
  ): Promise<{
    success: boolean;
    proposalId: string;
    votingState: any;
    integrationId: string;
    deploymentResults: any[];
    errors: string[];
  }> {
    
    const operationId = `complete_proposal_${Date.now()}`;
    this.state.activeOperations.push(operationId);
    
    try {
      console.log(`🎯 Procesando propuesta completa: ${proposal.title}`);
      
      const errors: string[] = [];
      const deploymentResults: any[] = [];
      
      // 1. Crear propuesta en el sistema de votación
      const votingResult = await EnhancedVotingSystem.createProposal(
        proposal,
        authorId,
        authorName,
        authorLevel
      );
      
      if (!votingResult.success) {
        throw new Error(`Error creando propuesta: ${votingResult.notifications.join(', ')}`);
      }
      
      console.log(`✅ Propuesta creada: ${votingResult.proposalId}`);
      
      // 2. Si la propuesta es aprobada automáticamente (para maestros), procesar integración
      if (authorLevel === 6 && TRIBUNAL_ORCHESTRATOR_CONFIG.AUTO_OPTIMIZATION) {
        console.log('🚀 Procesando integración automática para Maestro...');
        
        const integrationResult = await AutomatedIntegrationSystem.processApprovedModule(
          proposal,
          {
            priority: 'high',
            targetDashboards: proposal.targetLevels,
            pipelineId: 'fast'
          }
        );
        
        if (integrationResult.success) {
          console.log(`✅ Integración iniciada: ${integrationResult.integrationId}`);
          
          // 3. Inyectar contenido en dashboards
          for (const dashboardLevel of proposal.targetLevels) {
            try {
              const injectionResult = await EnhancedContentInjectionSystem.injectApprovedContent(
                proposal,
                [dashboardLevel],
                { priority: 'high', autoRefresh: true }
              );
              
              deploymentResults.push({
                dashboardLevel,
                success: injectionResult.success,
                injectedDashboards: injectionResult.injectedDashboards,
                errors: injectionResult.errors
              });
              
            } catch (error) {
              errors.push(`Dashboard ${dashboardLevel}: ${error}`);
            }
          }
        } else {
          errors.push(`Integración fallida: ${integrationResult.state?.currentStep || 'Error desconocido'}`);
        }
      }
      
      // 4. Actualizar métricas del sistema
      this.updateSystemMetrics();
      
      console.log(`🎯 Procesamiento completo finalizado: ${proposal.title}`);
      
      return {
        success: true,
        proposalId: votingResult.proposalId,
        votingState: votingResult.votingState,
        integrationId: votingResult.proposalId, // Usar el mismo ID
        deploymentResults,
        errors
      };
      
    } catch (error) {
      console.error(`❌ Error procesando propuesta completa: ${error}`);
      return {
        success: false,
        proposalId: '',
        votingState: null,
        integrationId: '',
        deploymentResults: [],
        errors: [error instanceof Error ? error.message : 'Error desconocido']
      };
    } finally {
      // Remover operación activa
      this.state.activeOperations = this.state.activeOperations.filter(id => id !== operationId);
      this.notifySubscribers();
    }
  }
  
  /**
   * Maneja la aprobación de una propuesta
   */
  static async handleProposalApproval(
    proposalId: string,
    approvedModule: CustomModule
  ): Promise<{
    success: boolean;
    integrationId: string;
    deploymentResults: any[];
    errors: string[];
  }> {
    
    const operationId = `approval_${proposalId}_${Date.now()}`;
    this.state.activeOperations.push(operationId);
    
    try {
      console.log(`🎉 Procesando aprobación de propuesta: ${proposalId}`);
      
      const errors: string[] = [];
      const deploymentResults: any[] = [];
      
      // 1. Procesar integración automática
      const integrationResult = await AutomatedIntegrationSystem.processApprovedModule(
        approvedModule,
        {
          priority: 'critical',
          targetDashboards: approvedModule.targetLevels,
          pipelineId: 'standard'
        }
      );
      
      if (!integrationResult.success) {
        throw new Error(`Error en integración: ${integrationResult.state?.currentStep || 'Error desconocido'}`);
      }
      
      console.log(`✅ Integración iniciada: ${integrationResult.integrationId}`);
      
      // 2. Inyectar contenido en todos los dashboards objetivo
      for (const dashboardLevel of approvedModule.targetLevels) {
        try {
          const injectionResult = await EnhancedContentInjectionSystem.injectApprovedContent(
            approvedModule,
            [dashboardLevel],
            { 
              priority: 'critical', 
              autoRefresh: true,
              notificationEnabled: true
            }
          );
          
          deploymentResults.push({
            dashboardLevel,
            success: injectionResult.success,
            injectedDashboards: injectionResult.injectedDashboards,
            errors: injectionResult.errors
          });
          
          if (injectionResult.success) {
            console.log(`✅ Contenido inyectado en dashboard ${dashboardLevel}`);
          } else {
            errors.push(`Dashboard ${dashboardLevel}: ${injectionResult.errors.join(', ')}`);
          }
          
        } catch (error) {
          errors.push(`Dashboard ${dashboardLevel}: ${error}`);
        }
      }
      
      // 3. Actualizar métricas
      this.updateSystemMetrics();
      
      console.log(`🎉 Aprobación procesada exitosamente: ${proposalId}`);
      
      return {
        success: true,
        integrationId: integrationResult.integrationId,
        deploymentResults,
        errors
      };
      
    } catch (error) {
      console.error(`❌ Error procesando aprobación: ${error}`);
      return {
        success: false,
        integrationId: '',
        deploymentResults: [],
        errors: [error instanceof Error ? error.message : 'Error desconocido']
      };
    } finally {
      this.state.activeOperations = this.state.activeOperations.filter(id => id !== operationId);
      this.notifySubscribers();
    }
  }
  
  /**
   * Obtiene el estado actual del orquestador
   */
  static getState(): TribunalOrchestratorState {
    return { ...this.state };
  }
  
  /**
   * Suscribe a actualizaciones del estado
   */
  static subscribe(callback: (state: TribunalOrchestratorState) => void): () => void {
    this.subscribers.add(callback);
    
    // Enviar estado actual inmediatamente
    callback(this.state);
    
    // Retornar función de desuscripción
    return () => {
      this.subscribers.delete(callback);
    };
  }
  
  /**
   * Configura el monitoreo de salud del sistema
   */
  private static setupHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, TRIBUNAL_ORCHESTRATOR_CONFIG.HEALTH_CHECK_INTERVAL);
  }
  
  /**
   * Configura la actualización de métricas
   */
  private static setupMetricsUpdate(): void {
    this.metricsUpdateInterval = setInterval(() => {
      this.updateSystemMetrics();
    }, TRIBUNAL_ORCHESTRATOR_CONFIG.METRICS_UPDATE_INTERVAL);
  }
  
  /**
   * Realiza verificación de salud del sistema
   */
  private static performHealthCheck(): void {
    try {
      console.log('🏥 Realizando verificación de salud del sistema...');
      
      // Verificar estado de cada sistema
      const healthStatus = {
        contentInjection: this.state.systemsStatus.contentInjection,
        votingSystem: this.state.systemsStatus.votingSystem,
        carouselEngine: this.state.systemsStatus.carouselEngine,
        integrationSystem: this.state.systemsStatus.integrationSystem,
        performanceOptimization: this.state.systemsStatus.performanceOptimization
      };
      
      // Verificar si todos los sistemas están funcionando
      const allSystemsHealthy = Object.values(healthStatus).every(status => status);
      
      if (!allSystemsHealthy) {
        console.warn('⚠️ Algunos sistemas no están funcionando correctamente:', healthStatus);
        
        // Intentar recuperación automática si está habilitada
        if (TRIBUNAL_ORCHESTRATOR_CONFIG.ERROR_RECOVERY_ENABLED) {
          this.attemptSystemRecovery();
        }
      } else {
        console.log('✅ Todos los sistemas funcionando correctamente');
      }
      
      this.state.lastHealthCheck = new Date();
      this.notifySubscribers();
      
    } catch (error) {
      console.error('❌ Error en verificación de salud:', error);
    }
  }
  
  /**
   * Intenta recuperar sistemas que no están funcionando
   */
  private static attemptSystemRecovery(): void {
    console.log('🔧 Intentando recuperación automática de sistemas...');
    
    // Reintentar inicialización de sistemas fallidos
    if (!this.state.systemsStatus.performanceOptimization) {
      try {
        PerformanceOptimizationSystem.initialize();
        this.state.systemsStatus.performanceOptimization = true;
        console.log('✅ Sistema de Optimización recuperado');
      } catch (error) {
        console.error('❌ Error recuperando Sistema de Optimización:', error);
      }
    }
    
    if (!this.state.systemsStatus.contentInjection) {
      try {
        EnhancedContentInjectionSystem.initialize();
        this.state.systemsStatus.contentInjection = true;
        console.log('✅ Sistema de Inyección recuperado');
      } catch (error) {
        console.error('❌ Error recuperando Sistema de Inyección:', error);
      }
    }
    
    if (!this.state.systemsStatus.votingSystem) {
      try {
        EnhancedVotingSystem.initialize();
        this.state.systemsStatus.votingSystem = true;
        console.log('✅ Sistema de Votación recuperado');
      } catch (error) {
        console.error('❌ Error recuperando Sistema de Votación:', error);
      }
    }
    
    if (!this.state.systemsStatus.integrationSystem) {
      try {
        AutomatedIntegrationSystem.initialize();
        this.state.systemsStatus.integrationSystem = true;
        console.log('✅ Sistema de Integración recuperado');
      } catch (error) {
        console.error('❌ Error recuperando Sistema de Integración:', error);
      }
    }
  }
  
  /**
   * Actualiza las métricas del sistema
   */
  private static updateSystemMetrics(): void {
    try {
      // Obtener métricas de cada sistema
      const performanceStats = PerformanceOptimizationSystem.getSystemStats();
      const votingStats = EnhancedVotingSystem.getVotingStats();
      const integrationStats = AutomatedIntegrationSystem.getSystemStats();
      const injectionStats = EnhancedContentInjectionSystem.getSystemStats();
      
      // Actualizar métricas del orquestador
      this.state.systemMetrics = {
        totalProposals: votingStats.activeProposals + votingStats.approvedProposals + votingStats.rejectedProposals,
        activeVotes: votingStats.activeProposals,
        completedIntegrations: integrationStats.completedIntegrations,
        cacheHitRate: performanceStats.cacheHitRate,
        averagePerformance: performanceStats.averageOperationTime
      };
      
      this.notifySubscribers();
      
    } catch (error) {
      console.error('Error actualizando métricas:', error);
    }
  }
  
  /**
   * Notifica a todos los suscriptores
   */
  private static notifySubscribers(): void {
    this.subscribers.forEach(callback => {
      try {
        callback(this.state);
      } catch (error) {
        console.error('Error notificando suscriptor:', error);
      }
    });
  }
  
  /**
   * Obtiene estadísticas completas del sistema
   */
  static getCompleteSystemStats(): {
    orchestrator: TribunalOrchestratorState;
    performance: any;
    voting: any;
    integration: any;
    injection: any;
    carousel: any;
  } {
    return {
      orchestrator: this.state,
      performance: PerformanceOptimizationSystem.getSystemStats(),
      voting: EnhancedVotingSystem.getVotingStats(),
      integration: AutomatedIntegrationSystem.getSystemStats(),
      injection: EnhancedContentInjectionSystem.getSystemStats(),
      carousel: OptimizedCarrouselEngine.getEngineStats()
    };
  }
  
  /**
   * Limpia y cierra el orquestador
   */
  static shutdown(): void {
    console.log('🛑 Cerrando Orquestador del Tribunal Imperial...');
    
    // Limpiar intervalos
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    if (this.metricsUpdateInterval) {
      clearInterval(this.metricsUpdateInterval);
    }
    
    // Limpiar suscriptores
    this.subscribers.clear();
    
    // Limpiar operaciones activas
    this.state.activeOperations = [];
    
    // Marcar como no inicializado
    this.state.isInitialized = false;
    
    console.log('✅ Orquestador cerrado');
  }
}

// Inicialización automática si está habilitada
if (TRIBUNAL_ORCHESTRATOR_CONFIG.AUTO_INITIALIZE && typeof window !== 'undefined') {
  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      TribunalOrchestrator.initialize();
    });
  } else {
    TribunalOrchestrator.initialize();
  }
}
