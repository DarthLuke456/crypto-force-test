// Sistema de Despliegue Dinámico del TRIBUNAL IMPERIAL
// Renderiza carruseles integrados en tiempo real

import { 
  IntegratedCarousel, 
  IntegratedModule 
} from './carousel-integration-engine';

// Interfaz para el estado del renderizador
export interface CarouselRenderState {
  isRendering: boolean;
  lastRenderTime: Date;
  renderErrors: string[];
  renderWarnings: string[];
  performanceMetrics: {
    renderTime: number;
    moduleCount: number;
    memoryUsage: number;
  };
}

// Configuración del renderizador
export const RENDERER_CONFIG = {
  AUTO_RENDER: true, // Renderizado automático
  LAZY_LOADING: true, // Carga perezosa de módulos
  VIRTUAL_SCROLLING: false, // Scroll virtual para carruseles grandes
  ANIMATION_ENABLED: true, // Animaciones de transición
  PERFORMANCE_MONITORING: true, // Monitoreo de rendimiento
  ERROR_BOUNDARY: true, // Límites de error para módulos individuales
  MAX_RENDER_TIME: 1000, // Tiempo máximo de renderizado (ms)
  MEMORY_THRESHOLD: 50 * 1024 * 1024 // Umbral de memoria (50MB)
};

// Clase principal del renderizador dinámico
export class DynamicCarouselRenderer {
  
  private static renderState: CarouselRenderState = {
    isRendering: false,
    lastRenderTime: new Date(),
    renderErrors: [],
    renderWarnings: [],
    performanceMetrics: {
      renderTime: 0,
      moduleCount: 0,
      memoryUsage: 0
    }
  };
  
  /**
   * Renderiza un carrusel integrado en tiempo real
   */
  static async renderCarousel(
    carousel: IntegratedCarousel,
    targetElement: HTMLElement,
    options: {
      enableAnimations?: boolean;
      lazyLoading?: boolean;
      showPerformanceMetrics?: boolean;
    } = {}
  ): Promise<{
    success: boolean;
    renderTime: number;
    moduleCount: number;
    errors: string[];
  }> {
    
    const startTime = performance.now();
    
    try {
      // Validar el carrusel
      const validation = this.validateCarouselForRendering(carousel);
      if (!validation.isValid) {
        throw new Error(`Error de validación: ${validation.errors.join(', ')}`);
      }
      
      // Actualizar estado del renderizador
      this.renderState.isRendering = true;
      this.renderState.renderErrors = [];
      this.renderState.renderWarnings = [];
      
      // Limpiar el elemento objetivo
      this.clearTargetElement(targetElement);
      
      // Renderizar el carrusel
      const renderResult = await this.performRender(carousel, targetElement, options);
      
      // Actualizar métricas de rendimiento
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      this.updatePerformanceMetrics(renderTime, carousel.modules.length);
      
      // Verificar límites de rendimiento
      if (renderTime > RENDERER_CONFIG.MAX_RENDER_TIME) {
        this.renderState.renderWarnings.push(
          `El renderizado tardó ${renderTime.toFixed(2)}ms, superando el límite de ${RENDERER_CONFIG.MAX_RENDER_TIME}ms`
        );
      }
      
      // Actualizar estado final
      this.renderState.isRendering = false;
      this.renderState.lastRenderTime = new Date();
      
      return {
        success: true,
        renderTime,
        moduleCount: carousel.modules.length,
        errors: this.renderState.renderErrors
      };
      
    } catch (error) {
      // Manejar errores de renderizado
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      this.renderState.renderErrors.push(errorMessage);
      this.renderState.isRendering = false;
      
      // Renderizar estado de error
      this.renderErrorState(targetElement, errorMessage);
      
      return {
        success: false,
        renderTime: performance.now() - startTime,
        moduleCount: 0,
        errors: this.renderState.renderErrors
      };
    }
  }
  
  /**
   * Realiza el renderizado del carrusel
   */
  private static async performRender(
    carousel: IntegratedCarousel,
    targetElement: HTMLElement,
    options: any
  ): Promise<void> {
    
    // Crear contenedor principal del carrusel
    const carouselContainer = this.createCarouselContainer(carousel);
    
    // Renderizar encabezado del carrusel
    const header = this.renderCarouselHeader(carousel);
    carouselContainer.appendChild(header);
    
    // Renderizar módulos
    const modulesContainer = this.createModulesContainer();
    
    if (options.lazyLoading !== false && RENDERER_CONFIG.LAZY_LOADING) {
      // Renderizado con carga perezosa
      await this.renderModulesLazy(carousel.modules, modulesContainer, options);
    } else {
      // Renderizado completo
      carousel.modules.forEach(module => {
        const moduleElement = this.renderModule(module, options);
        modulesContainer.appendChild(moduleElement);
      });
    }
    
    carouselContainer.appendChild(modulesContainer);
    
    // Renderizar pie del carrusel
    const footer = this.renderCarouselFooter(carousel);
    carouselContainer.appendChild(footer);
    
    // Añadir al elemento objetivo
    targetElement.appendChild(carouselContainer);
    
    // Aplicar animaciones si están habilitadas
    if (options.enableAnimations !== false && RENDERER_CONFIG.ANIMATION_ENABLED) {
      this.applyCarouselAnimations(carouselContainer);
    }
  }
  
  /**
   * Crea el contenedor principal del carrusel
   */
  private static createCarouselContainer(carousel: IntegratedCarousel): HTMLElement {
    const container = document.createElement('div');
    container.className = 'tribunal-carousel-container';
    container.setAttribute('data-carousel-id', carousel.id);
    container.setAttribute('data-category', carousel.category);
    container.setAttribute('data-dashboard-level', carousel.dashboardLevel.toString());
    
    // Aplicar estilos según el nivel del dashboard
    this.applyDashboardStyling(container, carousel.dashboardLevel);
    
    return container;
  }
  
  /**
   * Aplica estilos según el nivel del dashboard
   */
  private static applyDashboardStyling(container: HTMLElement, dashboardLevel: number): void {
    const levelStyles: Record<number, string> = {
      1: 'border-red-500 bg-gradient-to-r from-red-50 to-red-100', // Iniciado
      2: 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100', // Acólito
      3: 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100', // Warrior
      4: 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100', // Lord
      5: 'border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100', // Darth
      6: 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-indigo-100' // Maestro
    };
    
    const baseClasses = 'border-2 rounded-lg p-6 shadow-lg';
    const levelClass = levelStyles[dashboardLevel] || levelStyles[2]; // Por defecto Acólito
    
    container.className = `${container.className} ${baseClasses} ${levelClass}`;
  }
  
  /**
   * Renderiza el encabezado del carrusel
   */
  private static renderCarouselHeader(carousel: IntegratedCarousel): HTMLElement {
    const header = document.createElement('div');
    header.className = 'carousel-header mb-6';
    
    const title = document.createElement('h2');
    title.className = 'text-2xl font-bold text-gray-800 mb-2';
    title.textContent = this.getCategoryDisplayName(carousel.category);
    
    const stats = document.createElement('div');
    stats.className = 'flex items-center space-x-4 text-sm text-gray-600';
    
    const moduleCount = document.createElement('span');
    moduleCount.innerHTML = `<strong>${carousel.totalModules}</strong> módulos`;
    
    const tribunalCount = carousel.modules.filter(m => m.isTribunalModule).length;
    const tribunalInfo = document.createElement('span');
    tribunalInfo.innerHTML = `<span class="text-yellow-600">⚡ ${tribunalCount}</span> del Tribunal Imperial`;
    
    const lastUpdate = document.createElement('span');
    lastUpdate.innerHTML = `Actualizado: <time>${carousel.lastUpdated.toLocaleDateString('es-ES')}</time>`;
    
    stats.appendChild(moduleCount);
    stats.appendChild(tribunalInfo);
    stats.appendChild(lastUpdate);
    
    header.appendChild(title);
    header.appendChild(stats);
    
    return header;
  }
  
  /**
   * Crea el contenedor de módulos
   */
  private static createModulesContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'modules-container grid gap-6';
    
    // Aplicar grid responsivo
    container.style.cssText = `
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    `;
    
    return container;
  }
  
  /**
   * Renderiza un módulo individual
   */
  private static renderModule(module: IntegratedModule, options: any): HTMLElement {
    const moduleElement = document.createElement('div');
    moduleElement.className = 'module-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300';
    moduleElement.setAttribute('data-module-id', module.id);
    moduleElement.setAttribute('data-tribunal-module', module.isTribunalModule.toString());
    
    // Añadir indicador visual para módulos del Tribunal
    if (module.isTribunalModule) {
      moduleElement.classList.add('tribunal-module');
      moduleElement.style.borderLeft = '4px solid #f59e0b'; // Borde dorado
    }
    
    // Renderizar contenido del módulo
    const content = this.renderModuleContent(module);
    moduleElement.appendChild(content);
    
    return moduleElement;
  }
  
  /**
   * Renderiza el contenido de un módulo
   */
  private static renderModuleContent(module: IntegratedModule): HTMLElement {
    const content = document.createElement('div');
    content.className = 'p-6';
    
    // Título del módulo
    const title = document.createElement('h3');
    title.className = 'text-lg font-semibold text-gray-800 mb-2';
    title.textContent = module.title;
    
    // Descripción
    const description = document.createElement('p');
    description.className = 'text-gray-600 text-sm mb-4';
    description.textContent = module.description;
    
    // Metadatos del módulo
    const metadata = this.renderModuleMetadata(module);
    
    // Badge del Tribunal Imperial si aplica
    let tribunalBadge = null;
    if (module.isTribunalModule) {
      tribunalBadge = this.createTribunalBadge();
    }
    
    content.appendChild(title);
    if (tribunalBadge) content.appendChild(tribunalBadge);
    content.appendChild(description);
    content.appendChild(metadata);
    
    return content;
  }
  
  /**
   * Renderiza los metadatos de un módulo
   */
  private static renderModuleMetadata(module: IntegratedModule): HTMLElement {
    const metadata = document.createElement('div');
    metadata.className = 'flex flex-wrap items-center gap-2 text-xs text-gray-500';
    
    // Dificultad
    const difficulty = document.createElement('span');
    difficulty.className = `px-2 py-1 rounded-full ${this.getDifficultyColor(module.difficulty)}`;
    difficulty.textContent = module.difficulty;
    
    // Duración
    const duration = document.createElement('span');
    duration.innerHTML = `⏱️ ${module.estimatedDuration} min`;
    
    // Categoría
    const category = document.createElement('span');
    category.innerHTML = `📚 ${this.getCategoryDisplayName(module.category)}`;
    
    // Autor
    const author = document.createElement('span');
    author.innerHTML = `👤 ${module.author.name}`;
    
    metadata.appendChild(difficulty);
    metadata.appendChild(duration);
    metadata.appendChild(category);
    metadata.appendChild(author);
    
    return metadata;
  }
  
  /**
   * Crea el badge del Tribunal Imperial
   */
  private static createTribunalBadge(): HTMLElement {
    const badge = document.createElement('div');
    badge.className = 'inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full mb-3';
    badge.innerHTML = '⚡ Tribunal Imperial';
    return badge;
  }
  
  /**
   * Renderiza módulos con carga perezosa
   */
  private static async renderModulesLazy(
    modules: IntegratedModule[],
    container: HTMLElement,
    options: any
  ): Promise<void> {
    
    const batchSize = 5; // Renderizar 5 módulos a la vez
    
    for (let i = 0; i < modules.length; i += batchSize) {
      const batch = modules.slice(i, i + batchSize);
      
      // Renderizar lote
      batch.forEach(module => {
        const moduleElement = this.renderModule(module, options);
        container.appendChild(moduleElement);
      });
      
      // Pausa para permitir que el navegador procese
      if (i + batchSize < modules.length) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
  }
  
  /**
   * Renderiza el pie del carrusel
   */
  private static renderCarouselFooter(carousel: IntegratedCarousel): HTMLElement {
    const footer = document.createElement('div');
    footer.className = 'carousel-footer mt-6 pt-4 border-t border-gray-200';
    
    const info = document.createElement('div');
    info.className = 'text-center text-sm text-gray-500';
    
    const tribunalModules = carousel.modules.filter(m => m.isTribunalModule);
    const originalModules = carousel.modules.filter(m => !m.isTribunalModule);
    
    info.innerHTML = `
      <p>Total: <strong>${carousel.totalModules}</strong> módulos</p>
      <p>Originales: <strong>${originalModules.length}</strong> | Tribunal Imperial: <strong class="text-yellow-600">${tribunalModules.length}</strong></p>
    `;
    
    footer.appendChild(info);
    
    return footer;
  }
  
  /**
   * Aplica animaciones al carrusel
   */
  private static applyCarouselAnimations(container: HTMLElement): void {
    // Animación de entrada
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    requestAnimationFrame(() => {
      container.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    });
    
    // Animación de módulos individuales
    const modules = container.querySelectorAll('.module-card');
    modules.forEach((module, index) => {
      const element = module as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'scale(0.9)';
      
      setTimeout(() => {
        element.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
      }, index * 100);
    });
  }
  
  /**
   * Renderiza estado de error
   */
  private static renderErrorState(targetElement: HTMLElement, errorMessage: string): void {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-container bg-red-50 border border-red-200 rounded-lg p-6 text-center';
    
    errorContainer.innerHTML = `
      <div class="text-red-600 text-4xl mb-4">⚠️</div>
      <h3 class="text-lg font-semibold text-red-800 mb-2">Error al renderizar el carrusel</h3>
      <p class="text-red-600">${errorMessage}</p>
      <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
        Reintentar
      </button>
    `;
    
    targetElement.appendChild(errorContainer);
  }
  
  /**
   * Limpia el elemento objetivo
   */
  private static clearTargetElement(targetElement: HTMLElement): void {
    targetElement.innerHTML = '';
  }
  
  /**
   * Valida el carrusel para renderizado
   */
  private static validateCarouselForRendering(carousel: IntegratedCarousel): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!carousel.modules || carousel.modules.length === 0) {
      errors.push('El carrusel no tiene módulos para renderizar');
    }
    
    if (!carousel.id) {
      errors.push('El carrusel no tiene ID válido');
    }
    
    if (!carousel.category) {
      errors.push('El carrusel no tiene categoría válida');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Actualiza métricas de rendimiento
   */
  private static updatePerformanceMetrics(renderTime: number, moduleCount: number): void {
    this.renderState.performanceMetrics = {
      renderTime,
      moduleCount,
      memoryUsage: this.getMemoryUsage()
    };
  }
  
  /**
   * Obtiene el uso de memoria (si está disponible)
   */
  private static getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }
  
  /**
   * Obtiene el nombre de visualización de una categoría
   */
  private static getCategoryDisplayName(category: string): string {
    const categoryNames: Record<string, string> = {
      'theoretical': 'Teórico',
      'practical': 'Práctico',
      'mixed': 'Mixto'
    };
    
    return categoryNames[category] || category;
  }
  
  /**
   * Obtiene el color CSS para una dificultad
   */
  private static getDifficultyColor(difficulty: string): string {
    const difficultyColors: Record<string, string> = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-red-100 text-red-800'
    };
    
    return difficultyColors[difficulty] || 'bg-gray-100 text-gray-800';
  }
  
  /**
   * Obtiene el estado actual del renderizador
   */
  static getRenderState(): CarouselRenderState {
    return { ...this.renderState };
  }
  
  /**
   * Limpia el estado del renderizador
   */
  static clearRenderState(): void {
    this.renderState = {
      isRendering: false,
      lastRenderTime: new Date(),
      renderErrors: [],
      renderWarnings: [],
      performanceMetrics: {
        renderTime: 0,
        moduleCount: 0,
        memoryUsage: 0
      }
    };
  }
}
