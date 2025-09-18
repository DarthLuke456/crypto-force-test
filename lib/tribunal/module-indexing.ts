// 🏛️ SISTEMA DE ÍNDICES PARA MÓDULOS - TRIBUNAL IMPERIAL
// Gestiona la numeración y orden de los módulos

import { CustomModule } from './types';

export interface ModuleIndex {
  id: string;
  moduleId: string;
  category: 'theoretical' | 'practical' | 'checkpoint';
  order: number;
  displayNumber: number; // Número que se muestra en el carrusel
  isLocked: boolean;
  checkpointNumber?: number; // Solo para checkpoints
  prerequisites: string[];
  unlockConditions: string[];
}

export interface IndexedModule extends CustomModule {
  index: ModuleIndex;
}

export class ModuleIndexingSystem {
  
  /**
   * Crea un índice para un módulo
   */
  static createModuleIndex(
    module: CustomModule, 
    category: 'theoretical' | 'practical',
    order: number
  ): ModuleIndex {
    
    const isLocked = this.shouldModuleBeLocked(order, module.difficulty);
    const displayNumber = this.calculateDisplayNumber(order, category);
    
    return {
      id: `index_${module.id}`,
      moduleId: module.id,
      category: category,
      order: order,
      displayNumber: displayNumber,
      isLocked: isLocked,
      prerequisites: this.getModulePrerequisites(order, category),
      unlockConditions: this.getUnlockConditions(order, category)
    };
  }
  
  /**
   * Crea un índice para un checkpoint
   */
  static createCheckpointIndex(
    checkpointNumber: number,
    category: 'theoretical' | 'practical',
    relatedModules: string[]
  ): ModuleIndex {
    
    const order = checkpointNumber * 2; // Checkpoints van cada 2 módulos
    const isLocked = this.shouldCheckpointBeLocked(checkpointNumber);
    
    return {
      id: `checkpoint_${category}_${checkpointNumber}`,
      moduleId: `checkpoint_${category}_${checkpointNumber}`,
      category: 'checkpoint',
      order: order,
      displayNumber: checkpointNumber,
      isLocked: isLocked,
      checkpointNumber: checkpointNumber,
      prerequisites: relatedModules,
      unlockConditions: [`complete_modules_${relatedModules.join('_')}`]
    };
  }
  
  /**
   * Determina si un módulo debe estar bloqueado
   */
  private static shouldModuleBeLocked(order: number, difficulty: 'beginner' | 'intermediate' | 'advanced'): boolean {
    // Los primeros módulos están desbloqueados
    if (order <= 2) return false;
    
    // Dificultad avanzada: más módulos bloqueados
    if (difficulty === 'advanced' && order <= 4) return false;
    if (difficulty === 'intermediate' && order <= 3) return false;
    
    return true;
  }
  
  /**
   * Determina si un checkpoint debe estar bloqueado
   */
  private static shouldCheckpointBeLocked(checkpointNumber: number): boolean {
    // El primer checkpoint siempre está desbloqueado
    if (checkpointNumber === 1) return false;
    
    // Los checkpoints se desbloquean progresivamente
    if (checkpointNumber <= 2) return false;
    
    return true;
  }
  
  /**
   * Calcula el número de visualización del módulo
   */
  private static calculateDisplayNumber(order: number, category: 'theoretical' | 'practical'): number {
    return order;
  }
  
  /**
   * Obtiene los prerrequisitos de un módulo
   */
  private static getModulePrerequisites(order: number, category: 'theoretical' | 'practical'): string[] {
    if (order === 1) return [];
    
    const prerequisites: string[] = [];
    
    // Agregar módulo anterior como prerrequisito
    if (order > 1) {
      prerequisites.push(`${category}-${order - 1}`);
    }
    
    return prerequisites;
  }
  
  /**
   * Obtiene las condiciones de desbloqueo
   */
  private static getUnlockConditions(order: number, category: 'theoretical' | 'practical'): string[] {
    if (order === 1) return [];
    
    const conditions: string[] = [];
    
    // Condición básica: completar módulo anterior
    if (order > 1) {
      conditions.push(`complete_${category}_${order - 1}`);
    }
    
    // Condición especial para módulos avanzados
    if (order > 4) {
      conditions.push('complete_basic_modules');
    }
    
    return conditions;
  }
  
  /**
   * Aplica índices a una lista de módulos
   */
  static applyIndexesToModules(
    modules: CustomModule[], 
    category: 'theoretical' | 'practical'
  ): IndexedModule[] {
    
    return modules.map((module, index) => {
      const order = index + 1;
      const moduleIndex = this.createModuleIndex(module, category, order);
      
      return {
        ...module,
        index: moduleIndex
      };
    });
  }
  
  /**
   * Genera checkpoints para una lista de módulos
   */
  static generateCheckpointsForModules(
    modules: IndexedModule[], 
    category: 'theoretical' | 'practical'
  ): ModuleIndex[] {
    
    const checkpoints: ModuleIndex[] = [];
    const checkpointCount = Math.floor(modules.length / 2);
    
    for (let i = 1; i <= checkpointCount; i++) {
      const relatedModules = modules
        .filter(m => m.index.order >= (i - 1) * 2 + 1 && m.index.order <= i * 2)
        .map(m => m.id);
      
      const checkpoint = this.createCheckpointIndex(i, category, relatedModules);
      checkpoints.push(checkpoint);
    }
    
    return checkpoints;
  }
  
  /**
   * Obtiene el estado de desbloqueo de un módulo
   */
  static getModuleUnlockStatus(moduleIndex: ModuleIndex, completedModules: string[]): {
    isUnlocked: boolean;
    missingPrerequisites: string[];
    canUnlock: boolean;
  } {
    const missingPrerequisites = moduleIndex.prerequisites.filter(
      prereq => !completedModules.includes(prereq)
    );
    
    const isUnlocked = missingPrerequisites.length === 0;
    const canUnlock = moduleIndex.prerequisites.every(prereq => 
      completedModules.includes(prereq)
    );
    
    return {
      isUnlocked,
      missingPrerequisites,
      canUnlock
    };
  }
  
  /**
   * Valida la secuencia de módulos
   */
  static validateModuleSequence(modules: IndexedModule[]): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    // Verificar que los números de orden sean secuenciales
    const orders = modules.map(m => m.index.order).sort((a, b) => a - b);
    for (let i = 0; i < orders.length - 1; i++) {
      if (orders[i + 1] - orders[i] !== 1) {
        issues.push(`Secuencia de módulos interrumpida en orden ${orders[i]}`);
      }
    }
    
    // Verificar que no haya duplicados
    const uniqueOrders = new Set(orders);
    if (uniqueOrders.size !== orders.length) {
      issues.push('Hay números de orden duplicados');
    }
    
    // Verificar prerrequisitos
    modules.forEach(module => {
      module.index.prerequisites.forEach(prereq => {
        const prereqModule = modules.find(m => m.id === prereq);
        if (!prereqModule) {
          issues.push(`Módulo ${module.id} tiene prerrequisito inexistente: ${prereq}`);
        }
      });
    });
    
    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }
}
