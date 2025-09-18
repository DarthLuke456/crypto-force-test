// Motor de Generación de Carrousels del TRIBUNAL IMPERIAL
// Este motor genera automáticamente carrousels basados en el patrón de Iniciado

import { CustomModule, ContentBlock } from './types';

// Interfaz para el carrousel generado
export interface GeneratedCarrousel {
  id: string;
  title: string;
  description: string;
  modules: CarrouselModule[];
  category: 'theoretical' | 'practical' | 'mixed' | 'checkpoint';
  targetLevels: number[];
  totalModules: number;
  totalCheckpoints: number;
  estimatedDuration: number;
}

// Interfaz para cada módulo del carrousel
export interface CarrouselModule {
  id: string;
  title: string;
  description: string;
  type: 'content' | 'checkpoint';
  order: number;
  isLocked: boolean;
  level: string;
  icon: any;
  path: string;
  metadata: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration: number;
    tags: string[];
    prerequisites: string[];
  };
}

// Configuración de colores por nivel de dashboard
export const DASHBOARD_COLORS = {
  1: { // Iniciado
    primary: '#ec4d58',
    secondary: '#FFD700',
    accent: '#FF6B6B',
    background: '#0f0f0f',
    card: '#1a1a1a',
    border: '#333'
  },
  2: { // Acólito
    primary: '#FFD447',
    secondary: '#FFA500',
    accent: '#FFB347',
    background: '#0f0f0f',
    card: '#1a1a1a',
    border: '#333'
  },
  3: { // Warrior
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#60A5FA',
    background: '#0f0f0f',
    card: '#1a1a1a',
    border: '#333'
  },
  4: { // Lord
    primary: '#10B981',
    secondary: '#059669',
    accent: '#34D399',
    background: '#0f0f0f',
    card: '#1a1a1a',
    border: '#333'
  },
  5: { // Darth
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    accent: '#A78BFA',
    background: '#0f0f0f',
    card: '#1a1a1a',
    border: '#333'
  },
  6: { // Maestro
    primary: '#FFD700',
    secondary: '#FFA500',
    accent: '#FFB347',
    background: '#0f0f0f',
    card: '#1a1a1a',
    border: '#333'
  }
};

// Configuración de insignias por nivel
export const DASHBOARD_INSIGNIAS = {
  1: '1-iniciados.png',
  2: '2-acolitos.png',
  3: '3-warriors.png',
  4: '4-lords.png',
  5: '5-darths.png',
  6: '6-maestros.png'
};

// Motor principal de generación de carrousels
export class ContentCarrouselEngine {
  
  /**
   * Genera un carrousel completo basado en un módulo personalizado
   */
  static generateCarrousel(
    customModule: CustomModule,
    targetDashboardLevel: number
  ): GeneratedCarrousel {
    
    // Aplicar el patrón de Iniciado: 2 módulos → 1 checkpoint
    const carrouselModules = this.applyIniciadoPattern(customModule, targetDashboardLevel);
    
    // Calcular estadísticas del carrousel
    const totalModules = carrouselModules.filter(m => m.type === 'content').length;
    const totalCheckpoints = carrouselModules.filter(m => m.type === 'checkpoint').length;
    const estimatedDuration = this.calculateTotalDuration(carrouselModules);
    
    return {
      id: `carrousel_${customModule.id}_${targetDashboardLevel}`,
      title: customModule.title,
      description: customModule.description,
      modules: carrouselModules,
      category: customModule.category,
      targetLevels: customModule.targetLevels,
      totalModules,
      totalCheckpoints,
      estimatedDuration
    };
  }
  
  /**
   * Aplica el patrón de Iniciado: 2 módulos → 1 checkpoint
   */
  private static applyIniciadoPattern(
    customModule: CustomModule,
    targetDashboardLevel: number
  ): CarrouselModule[] {
    
    const result: CarrouselModule[] = [];
    let moduleIndex = 0;
    let checkpointIndex = 1;
    
    // Procesar cada bloque de contenido
    for (let i = 0; i < customModule.content.length; i++) {
      const block = customModule.content[i];
      
      // Agregar módulo de contenido
      if (block.type !== 'divider' && block.type !== 'checklist') {
        result.push({
          id: `module_${customModule.id}_${moduleIndex}`,
          title: this.generateModuleTitle(block, moduleIndex + 1),
          description: this.generateModuleDescription(block),
          type: 'content',
          order: result.length,
          isLocked: this.shouldModuleBeLocked(moduleIndex, customModule.difficulty),
          level: this.getModuleLevel(moduleIndex, customModule.difficulty),
          icon: this.getModuleIcon(block.type),
          path: `/dashboard/level-${targetDashboardLevel}/${customModule.category}/${customModule.id}/module-${moduleIndex + 1}`,
          metadata: {
            difficulty: customModule.difficulty,
            duration: this.estimateModuleDuration(block),
            tags: customModule.tags,
            prerequisites: this.getModulePrerequisites(moduleIndex, customModule.prerequisites)
          }
        });
        
        moduleIndex++;
        
        // Agregar checkpoint cada 2 módulos
        if (moduleIndex % 2 === 0) {
          result.push({
            id: `checkpoint_${customModule.id}_${checkpointIndex}`,
            title: `Punto de Control ${checkpointIndex}: Evaluación de Módulos ${moduleIndex - 1} y ${moduleIndex}`,
            description: `Punto de control: Evalúa los módulos "${result[result.length - 2].title}" y "${result[result.length - 1].title}"`,
            type: 'checkpoint',
            order: result.length,
            isLocked: this.shouldCheckpointBeLocked(checkpointIndex, customModule.difficulty),
            level: this.getCheckpointLevel(checkpointIndex, customModule.difficulty),
            icon: this.getCheckpointIcon(),
            path: `/dashboard/level-${targetDashboardLevel}/puntos-de-control/${customModule.category}/pc${checkpointIndex}`,
            metadata: {
              difficulty: customModule.difficulty,
              duration: 30, // 30 minutos para checkpoints
              tags: ['checkpoint', 'evaluacion'],
              prerequisites: [`module_${customModule.id}_${moduleIndex - 2}`, `module_${customModule.id}_${moduleIndex - 1}`]
            }
          });
          
          checkpointIndex++;
        }
      }
    }
    
    return result;
  }
  
  /**
   * Genera el título de un módulo basado en su contenido
   */
  private static generateModuleTitle(block: ContentBlock, moduleNumber: number): string {
    if (block.type === 'text' && typeof block.content === 'string') {
      // Extraer título del primer párrafo o usar número de módulo
      const firstLine = block.content.split('\n')[0];
      if (firstLine.length > 0 && firstLine.length < 100) {
        return firstLine;
      }
    }
    
    return `Módulo ${moduleNumber}`;
  }
  
  /**
   * Genera la descripción de un módulo
   */
  private static generateModuleDescription(block: ContentBlock): string {
    if (block.type === 'text' && typeof block.content === 'string') {
      // Usar los primeros 150 caracteres como descripción
      const text = block.content.replace(/\n/g, ' ');
      return text.length > 150 ? text.substring(0, 150) + '...' : text;
    }
    
    return 'Descripción del módulo';
  }
  
  /**
   * Determina si un módulo debe estar bloqueado
   */
  private static shouldModuleBeLocked(moduleIndex: number, difficulty: 'beginner' | 'intermediate' | 'advanced'): boolean {
    // Los primeros módulos están desbloqueados
    if (moduleIndex < 2) return false;
    
    // Dificultad avanzada: más módulos bloqueados
    if (difficulty === 'advanced' && moduleIndex < 4) return false;
    if (difficulty === 'intermediate' && moduleIndex < 3) return false;
    
    return true;
  }
  
  /**
   * Determina si un checkpoint debe estar bloqueado
   */
  private static shouldCheckpointBeLocked(checkpointIndex: number, difficulty: 'beginner' | 'intermediate' | 'advanced'): boolean {
    // El primer checkpoint siempre está desbloqueado
    if (checkpointIndex === 1) return false;
    
    // Dificultad avanzada: más checkpoints bloqueados
    if (difficulty === 'advanced' && checkpointIndex < 3) return false;
    if (difficulty === 'intermediate' && checkpointIndex < 2) return false;
    
    return true;
  }
  
  /**
   * Obtiene el nivel de un módulo
   */
  private static getModuleLevel(moduleIndex: number, difficulty: 'beginner' | 'intermediate' | 'advanced'): string {
    if (moduleIndex < 4) return 'nivel1';
    if (moduleIndex < 8) return 'nivel2';
    return 'nivel3';
  }
  
  /**
   * Obtiene el nivel de un checkpoint
   */
  private static getCheckpointLevel(checkpointIndex: number, difficulty: 'beginner' | 'intermediate' | 'advanced'): string {
    if (checkpointIndex <= 2) return 'nivel1';
    if (checkpointIndex <= 4) return 'nivel2';
    return 'nivel3';
  }
  
  /**
   * Obtiene el icono de un módulo
   */
  private static getModuleIcon(blockType: ContentBlock['type']): any {
    // Aquí puedes importar y retornar iconos específicos
    // Por ahora retornamos un icono genérico
    return '📚';
  }
  
  /**
   * Obtiene el icono de un checkpoint
   */
  private static getCheckpointIcon(): any {
    return '✅';
  }
  
  /**
   * Estima la duración de un módulo
   */
  private static estimateModuleDuration(block: ContentBlock): number {
    switch (block.type) {
      case 'text':
        return Math.max(15, Math.ceil((typeof block.content === 'string' ? block.content.length : 0) / 1000) * 10);
      case 'image':
        return 10;
      case 'video':
        return 20;
      case 'code':
        return 30;
      default:
        return 15;
    }
  }
  
  /**
   * Obtiene los prerrequisitos de un módulo
   */
  private static getModulePrerequisites(moduleIndex: number, globalPrerequisites: string[]): string[] {
    if (moduleIndex === 0) return [];
    
    const prerequisites: string[] = [];
    
    // Agregar prerrequisitos globales
    prerequisites.push(...globalPrerequisites);
    
    // Agregar prerrequisitos basados en el orden
    if (moduleIndex > 0) {
      prerequisites.push(`module_${moduleIndex - 1}`);
    }
    
    return prerequisites;
  }
  
  /**
   * Calcula la duración total del carrousel
   */
  private static calculateTotalDuration(modules: CarrouselModule[]): number {
    return modules.reduce((total, module) => total + module.metadata.duration, 0);
  }
  
  /**
   * Genera múltiples carrousels para diferentes niveles
   */
  static generateMultiLevelCarrousels(customModule: CustomModule): Record<number, GeneratedCarrousel> {
    const carrousels: Record<number, GeneratedCarrousel> = {};
    
    customModule.targetLevels.forEach(level => {
      carrousels[level] = this.generateCarrousel(customModule, level);
    });
    
    return carrousels;
  }
  
  /**
   * Valida si un carrousel cumple con los estándares del patrón de Iniciado
   */
  static validateCarrouselPattern(carrousel: GeneratedCarrousel): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    // Verificar que haya checkpoints cada 2 módulos
    const contentModules = carrousel.modules.filter(m => m.type === 'content');
    const checkpoints = carrousel.modules.filter(m => m.type === 'checkpoint');
    
    if (contentModules.length < 2) {
      issues.push('Se requieren al menos 2 módulos de contenido');
    }
    
    if (checkpoints.length === 0) {
      issues.push('Se requiere al menos 1 checkpoint');
    }
    
    // Verificar proporción de checkpoints
    const expectedCheckpoints = Math.floor(contentModules.length / 2);
    if (checkpoints.length !== expectedCheckpoints) {
      issues.push(`Se esperaban ${expectedCheckpoints} checkpoints, pero hay ${checkpoints.length}`);
      suggestions.push('Agregar checkpoints cada 2 módulos de contenido');
    }
    
    // Verificar duración total
    if (carrousel.estimatedDuration < 30) {
      suggestions.push('Considerar agregar más contenido para una experiencia completa');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }
}
