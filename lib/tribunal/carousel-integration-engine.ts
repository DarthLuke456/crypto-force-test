// Motor de Integración de Carruseles del TRIBUNAL IMPERIAL
// Integra automáticamente módulos compilados en los carruseles existentes

import { CompiledModule } from './content-compiler';

// Interfaz para el carrusel integrado
export interface IntegratedCarousel {
  id: string;
  category: 'theoretical' | 'practical' | 'mixed' | 'checkpoint';
  modules: IntegratedModule[];
  totalModules: number;
  lastUpdated: Date;
  dashboardLevel: number; // 1 = Iniciado, 2 = Acólito, etc.
}

// Interfaz para módulos integrados en el carrusel
export interface IntegratedModule {
  id: string;
  title: string;
  description: string;
  category: 'theoretical' | 'practical' | 'mixed' | 'checkpoint';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  thumbnail?: string;
  author: {
    id: string;
    name: string;
    level: number;
  };
  createdAt: Date;
  isPublished: boolean;
  tags: string[];
  prerequisites: string[];
  isTribunalModule: boolean; // Indica si es un módulo del Tribunal Imperial
  tribunalApprovalDate?: Date;
  order: number; // Posición en el carrusel
}

// Configuración del motor de integración
export const INTEGRATION_CONFIG = {
  AUTO_REORDER: true, // Reordena automáticamente los módulos
  INSERT_AT_END: false, // Inserta al final del carrusel
  PRESERVE_ORIGINAL_ORDER: true, // Preserva el orden original de los módulos existentes
  MAX_MODULES_PER_CAROUSEL: 50, // Máximo de módulos por carrusel
  CHECKPOINT_INTERVAL: 2, // Insertar checkpoint cada N módulos
  TRIBUNAL_MODULE_PRIORITY: 'high' as 'high' | 'medium' | 'low' // Prioridad de módulos del Tribunal
};

// Clase principal del motor de integración
export class CarouselIntegrationEngine {
  
  /**
   * Integra un módulo compilado en el carrusel existente
   */
  static integrateModule(
    existingCarousel: IntegratedCarousel,
    newModule: CompiledModule,
    dashboardLevel: number
  ): IntegratedCarousel {
    
    // Validar el carrusel existente
    if (!existingCarousel || !existingCarousel.modules) {
      throw new Error('Carrusel existente no válido');
    }
    
    // Crear el módulo integrado
    const integratedModule: IntegratedModule = {
      ...newModule,
      isTribunalModule: true,
      tribunalApprovalDate: new Date(),
      order: this.calculateOptimalOrder(existingCarousel, newModule)
    };
    
    // Insertar el módulo en la posición óptima
    const updatedModules = this.insertModuleAtPosition(
      existingCarousel.modules,
      integratedModule,
      existingCarousel.category
    );
    
    // Reordenar si es necesario
    const finalModules = INTEGRATION_CONFIG.AUTO_REORDER 
      ? this.reorderModules(updatedModules, existingCarousel.category)
      : updatedModules;
    
    // Crear el carrusel actualizado
    const updatedCarousel: IntegratedCarousel = {
      ...existingCarousel,
      modules: finalModules,
      totalModules: finalModules.length,
      lastUpdated: new Date(),
      dashboardLevel
    };
    
    return updatedCarousel;
  }
  
  /**
   * Calcula la posición óptima para insertar un nuevo módulo
   */
  private static calculateOptimalOrder(
    carousel: IntegratedCarousel,
    newModule: CompiledModule
  ): number {
    
    if (INTEGRATION_CONFIG.INSERT_AT_END) {
      return carousel.modules.length;
    }
    
    // Buscar la posición óptima basada en la categoría y dificultad
    const optimalPosition = this.findOptimalPosition(carousel.modules, newModule);
    
    return optimalPosition;
  }
  
  /**
   * Encuentra la posición óptima para un módulo basado en su contenido
   */
  private static findOptimalPosition(
    modules: IntegratedModule[],
    newModule: CompiledModule
  ): number {
    
    // Si es el primer módulo, insertar al principio
    if (modules.length === 0) {
      return 0;
    }
    
    // Buscar módulos similares para agrupar
    const similarModules = modules.filter(module => 
      module.category === newModule.category &&
      module.difficulty === newModule.difficulty
    );
    
    if (similarModules.length > 0) {
      // Insertar después del último módulo similar
      const lastSimilarIndex = Math.max(...similarModules.map(m => m.order));
      return lastSimilarIndex + 1;
    }
    
    // Si no hay módulos similares, insertar al final de la categoría
    const categoryModules = modules.filter(module => 
      module.category === newModule.category
    );
    
    if (categoryModules.length > 0) {
      const lastCategoryIndex = Math.max(...categoryModules.map(m => m.order));
      return lastCategoryIndex + 1;
    }
    
    // Si no hay módulos de la misma categoría, insertar al final
    return modules.length;
  }
  
  /**
   * Inserta un módulo en una posición específica
   */
  private static insertModuleAtPosition(
    modules: IntegratedModule[],
    newModule: IntegratedModule,
    category: string
  ): IntegratedModule[] {
    
    const updatedModules = [...modules];
    
    // Si la posición es mayor que el número de módulos, insertar al final
    if (newModule.order >= modules.length) {
      updatedModules.push(newModule);
    } else {
      // Insertar en la posición específica
      updatedModules.splice(newModule.order, 0, newModule);
      
      // Actualizar el orden de los módulos siguientes
      for (let i = newModule.order + 1; i < updatedModules.length; i++) {
        updatedModules[i].order = i;
      }
    }
    
    return updatedModules;
  }
  
  /**
   * Reordena los módulos para mantener la secuencia lógica
   */
  private static reorderModules(
    modules: IntegratedModule[],
    category: string
  ): IntegratedModule[] {
    
    if (!INTEGRATION_CONFIG.PRESERVE_ORIGINAL_ORDER) {
      return modules;
    }
    
    // Crear una copia para no modificar el original
    const reorderedModules = [...modules];
    
    // Ordenar por categoría, dificultad y fecha de creación
    reorderedModules.sort((a, b) => {
      // Primero por categoría
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      
      // Luego por dificultad
      const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
      const aDifficulty = difficultyOrder[a.difficulty] || 0;
      const bDifficulty = difficultyOrder[b.difficulty] || 0;
      
      if (aDifficulty !== bDifficulty) {
        return aDifficulty - bDifficulty;
      }
      
      // Finalmente por fecha de creación
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    
    // Actualizar el orden de los módulos
    reorderedModules.forEach((module, index) => {
      module.order = index;
    });
    
    return reorderedModules;
  }
  
  /**
   * Integra múltiples módulos del Tribunal Imperial
   */
  static integrateMultipleModules(
    existingCarousel: IntegratedCarousel,
    newModules: CompiledModule[],
    dashboardLevel: number
  ): IntegratedCarousel {
    
    let updatedCarousel = { ...existingCarousel };
    
    // Integrar cada módulo secuencialmente
    newModules.forEach(module => {
      updatedCarousel = this.integrateModule(updatedCarousel, module, dashboardLevel);
    });
    
    return updatedCarousel;
  }
  
  /**
   * Remueve un módulo del Tribunal Imperial del carrusel
   */
  static removeTribunalModule(
    carousel: IntegratedCarousel,
    moduleId: string
  ): IntegratedCarousel {
    
    const updatedModules = carousel.modules.filter(module => module.id !== moduleId);
    
    // Reordenar los módulos restantes
    const reorderedModules = updatedModules.map((module, index) => ({
      ...module,
      order: index
    }));
    
    return {
      ...carousel,
      modules: reorderedModules,
      totalModules: reorderedModules.length,
      lastUpdated: new Date()
    };
  }
  
  /**
   * Actualiza un módulo existente del Tribunal Imperial
   */
  static updateTribunalModule(
    carousel: IntegratedCarousel,
    moduleId: string,
    updatedModule: CompiledModule
  ): IntegratedCarousel {
    
    const updatedModules = carousel.modules.map(module => 
      module.id === moduleId 
        ? { ...module, ...updatedModule, lastUpdated: new Date() }
        : module
    );
    
    return {
      ...carousel,
      modules: updatedModules,
      lastUpdated: new Date()
    };
  }
  
  /**
   * Obtiene estadísticas del carrusel integrado
   */
  static getCarouselStats(carousel: IntegratedCarousel): {
    totalModules: number;
    tribunalModules: number;
    originalModules: number;
    categories: Record<string, number>;
    difficulties: Record<string, number>;
    averageDuration: number;
    lastTribunalUpdate?: Date;
  } {
    
    const tribunalModules = carousel.modules.filter(m => m.isTribunalModule);
    const originalModules = carousel.modules.filter(m => !m.isTribunalModule);
    
    const categories = carousel.modules.reduce((acc, module) => {
      acc[module.category] = (acc[module.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const difficulties = carousel.modules.reduce((acc, module) => {
      acc[module.difficulty] = (acc[module.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const totalDuration = carousel.modules.reduce((sum, module) => sum + module.estimatedDuration, 0);
    const averageDuration = carousel.modules.length > 0 ? totalDuration / carousel.modules.length : 0;
    
    const lastTribunalUpdate = tribunalModules.length > 0 
      ? new Date(Math.max(...tribunalModules.map(m => new Date(m.tribunalApprovalDate || 0).getTime())))
      : undefined;
    
    return {
      totalModules: carousel.modules.length,
      tribunalModules: tribunalModules.length,
      originalModules: originalModules.length,
      categories,
      difficulties,
      averageDuration: Math.round(averageDuration * 100) / 100,
      lastTribunalUpdate
    };
  }
  
  /**
   * Valida la integridad del carrusel integrado
   */
  static validateCarousel(carousel: IntegratedCarousel): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Validar estructura básica
    if (!carousel.modules || !Array.isArray(carousel.modules)) {
      errors.push('El carrusel no tiene módulos válidos');
      return { isValid: false, errors, warnings };
    }
    
    // Validar límites
    if (carousel.modules.length > INTEGRATION_CONFIG.MAX_MODULES_PER_CAROUSEL) {
      errors.push(`El carrusel excede el límite máximo de ${INTEGRATION_CONFIG.MAX_MODULES_PER_CAROUSEL} módulos`);
    }
    
    // Validar orden de módulos
    const moduleOrders = carousel.modules.map(m => m.order).sort((a, b) => a - b);
    const expectedOrders = Array.from({ length: carousel.modules.length }, (_, i) => i);
    
    if (JSON.stringify(moduleOrders) !== JSON.stringify(expectedOrders)) {
      errors.push('El orden de los módulos no es secuencial');
    }
    
    // Validar módulos del Tribunal
    const tribunalModules = carousel.modules.filter(m => m.isTribunalModule);
    tribunalModules.forEach(module => {
      if (!module.tribunalApprovalDate) {
        warnings.push(`El módulo del Tribunal "${module.title}" no tiene fecha de aprobación`);
      }
    });
    
    // Validar duplicados
    const moduleIds = carousel.modules.map(m => m.id);
    const uniqueIds = new Set(moduleIds);
    if (moduleIds.length !== uniqueIds.size) {
      errors.push('Hay módulos duplicados en el carrusel');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * Optimiza el carrusel para mejor rendimiento
   */
  static optimizeCarousel(carousel: IntegratedCarousel): IntegratedCarousel {
    
    // Aquí podríamos implementar optimizaciones como:
    // - Lazy loading de módulos
    // - Compresión de thumbnails
    // - Caching de contenido estático
    // - Prefetching de módulos próximos
    
    return carousel;
  }
}
