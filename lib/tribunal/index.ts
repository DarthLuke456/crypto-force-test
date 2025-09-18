// Índice del Sistema TRIBUNAL IMPERIAL
// Exporta todos los componentes del sistema de integración automática

// Sistema principal de integración
export { 
  TribunalIntegrationSystem,
  INTEGRATION_SYSTEM_CONFIG 
} from './tribunal-integration-system';

export type { IntegrationSystemState } from './tribunal-integration-system';

// Motor de compilación de contenido
export { 
  ContentCompiler,
  COMPILER_CONFIG 
} from './content-compiler';

export type { 
  CompiledModule,
  CompiledContentBlock 
} from './content-compiler';

// Motor de integración de carruseles
export { 
  CarouselIntegrationEngine,
  INTEGRATION_CONFIG 
} from './carousel-integration-engine';

export type { 
  IntegratedCarousel,
  IntegratedModule 
} from './carousel-integration-engine';

// Renderizador dinámico de carruseles
export { 
  DynamicCarouselRenderer,
  RENDERER_CONFIG 
} from './dynamic-carousel-renderer';

export type { CarouselRenderState } from './dynamic-carousel-renderer';

// Sistema de votación
export { 
  TribunalVotingSystem,
  VOTING_CONFIG 
} from './voting-system';

// Tipos base
export * from './types';

// Utilidades del sistema
export const TRIBUNAL_SYSTEM_VERSION = '1.0.0';
export const TRIBUNAL_SYSTEM_NAME = 'TRIBUNAL IMPERIAL Integration System';

// Función de inicialización del sistema completo
export function initializeTribunalSystem(): void {
  console.log(`🚀 Inicializando ${TRIBUNAL_SYSTEM_NAME} v${TRIBUNAL_SYSTEM_VERSION}`);
  
  // Importar dinámicamente para evitar dependencias circulares
  import('./tribunal-integration-system').then(({ TribunalIntegrationSystem }) => {
    TribunalIntegrationSystem.initialize();
  });
  
  console.log('✅ Sistema TRIBUNAL IMPERIAL inicializado correctamente');
}

// Función de verificación del estado del sistema
export async function checkTribunalSystemHealth(): Promise<{
  isHealthy: boolean;
  components: {
    integration: boolean;
    compiler: boolean;
    carousel: boolean;
    renderer: boolean;
    voting: boolean;
  };
  errors: string[];
}> {
  const health: {
    isHealthy: boolean;
    components: {
      integration: boolean;
      compiler: boolean;
      carousel: boolean;
      renderer: boolean;
      voting: boolean;
    };
    errors: string[];
  } = {
    isHealthy: true,
    components: {
      integration: false,
      compiler: false,
      carousel: false,
      renderer: false,
      voting: false
    },
    errors: []
  };
  
  try {
    // Verificar sistema de integración
    const { TribunalIntegrationSystem } = await import('./tribunal-integration-system');
    const state = TribunalIntegrationSystem.getSystemState();
    health.components.integration = state.isActive;
    
    if (!state.isActive) {
      health.errors.push('Sistema de integración inactivo');
      health.isHealthy = false;
    }
    
    // Verificar compilador
    const { ContentCompiler } = await import('./content-compiler');
    health.components.compiler = true;
    
    // Verificar motor de carruseles
    const { CarouselIntegrationEngine } = await import('./carousel-integration-engine');
    health.components.carousel = true;
    
    // Verificar renderizador
    const { DynamicCarouselRenderer } = await import('./dynamic-carousel-renderer');
    health.components.renderer = true;
    
    // Verificar sistema de votación
    const { TribunalVotingSystem } = await import('./voting-system');
    health.components.voting = true;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    health.errors.push(`Error de verificación: ${errorMessage}`);
    health.isHealthy = false;
  }
  
  return health;
}

// Función de limpieza del sistema
export async function cleanupTribunalSystem(): Promise<void> {
  console.log('🧹 Limpiando sistema TRIBUNAL IMPERIAL...');
  
  try {
    const { TribunalIntegrationSystem } = await import('./tribunal-integration-system');
    TribunalIntegrationSystem.shutdown();
    
    const { DynamicCarouselRenderer } = await import('./dynamic-carousel-renderer');
    DynamicCarouselRenderer.clearRenderState();
    
    console.log('✅ Sistema TRIBUNAL IMPERIAL limpiado correctamente');
  } catch (error) {
    console.error('❌ Error al limpiar el sistema:', error);
  }
}

// Exportar por defecto el sistema completo
const tribunalSystem = {
  initialize: initializeTribunalSystem,
  checkHealth: checkTribunalSystemHealth,
  cleanup: cleanupTribunalSystem,
  version: TRIBUNAL_SYSTEM_VERSION,
  name: TRIBUNAL_SYSTEM_NAME
};

export default tribunalSystem;
