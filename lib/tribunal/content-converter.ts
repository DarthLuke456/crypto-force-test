// 🏛️ CONVERSOR DE CONTENIDO - TRIBUNAL IMPERIAL
// Convierte contenido existente al formato del Tribunal Imperial

import { CustomModule, ContentBlock, ContentCategory, DifficultyLevel } from './types';
import { ExtractedModule } from './migration-extractor';
import { ModuleIndexingSystem, IndexedModule } from './module-indexing';

export interface ConversionResult {
  success: boolean;
  modules?: IndexedModule[];
  checkpoints?: any[];
  errors?: string[];
  warnings?: string[];
}

export class ContentConverter {
  
  /**
   * Convierte todos los módulos extraídos al formato Tribunal Imperial
   */
  static convertAllModules(
    theoreticalModules: ExtractedModule[],
    practicalModules: ExtractedModule[],
    authorId: string,
    authorName: string
  ): ConversionResult {
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    try {
      // Convertir módulos teóricos
      const theoreticalCustomModules = theoreticalModules.map(module => 
        this.convertToCustomModule(module, authorId, authorName)
      );
      
      // Convertir módulos prácticos
      const practicalCustomModules = practicalModules.map(module => 
        this.convertToCustomModule(module, authorId, authorName)
      );
      
      // Aplicar índices
      const indexedTheoretical = ModuleIndexingSystem.applyIndexesToModules(
        theoreticalCustomModules, 
        'theoretical'
      );
      
      const indexedPractical = ModuleIndexingSystem.applyIndexesToModules(
        practicalCustomModules, 
        'practical'
      );
      
      // Generar checkpoints
      const theoreticalCheckpoints = ModuleIndexingSystem.generateCheckpointsForModules(
        indexedTheoretical, 
        'theoretical'
      );
      
      const practicalCheckpoints = ModuleIndexingSystem.generateCheckpointsForModules(
        indexedPractical, 
        'practical'
      );
      
      // Validar secuencias
      const theoreticalValidation = ModuleIndexingSystem.validateModuleSequence(indexedTheoretical);
      const practicalValidation = ModuleIndexingSystem.validateModuleSequence(indexedPractical);
      
      if (!theoreticalValidation.isValid) {
        errors.push(...theoreticalValidation.issues.map(issue => `Teórico: ${issue}`));
      }
      
      if (!practicalValidation.isValid) {
        errors.push(...practicalValidation.issues.map(issue => `Práctico: ${issue}`));
      }
      
      warnings.push(...theoreticalValidation.suggestions.map(suggestion => `Teórico: ${suggestion}`));
      warnings.push(...practicalValidation.suggestions.map(suggestion => `Práctico: ${suggestion}`));
      
      return {
        success: errors.length === 0,
        modules: [...indexedTheoretical, ...indexedPractical],
        checkpoints: [...theoreticalCheckpoints, ...practicalCheckpoints],
        errors: errors.length > 0 ? errors : undefined,
        warnings: warnings.length > 0 ? warnings : undefined
      };
      
    } catch (error) {
      console.error('Error en convertAllModules:', error);
      return {
        success: false,
        errors: ['Error inesperado durante la conversión']
      };
    }
  }
  
  /**
   * Convierte un módulo extraído a CustomModule
   */
  private static convertToCustomModule(
    module: ExtractedModule,
    authorId: string,
    authorName: string
  ): CustomModule {
    
    return {
      id: module.id,
      title: module.title,
      description: module.description,
      authorId: authorId,
      authorName: authorName,
      authorLevel: 6, // Maestro
      targetLevels: [1], // Solo Iniciado por ahora
      category: module.category,
      content: this.convertContentToBlocks(module.content, module.id),
      isPublished: false, // Pendiente de aprobación
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: this.generateTags(module),
      difficulty: this.determineDifficulty(module),
      estimatedDuration: this.estimateDuration(module),
      prerequisites: this.getPrerequisites(module)
    };
  }
  
  /**
   * Convierte el contenido de texto a ContentBlock[]
   */
  private static convertContentToBlocks(content: string, moduleId: string): ContentBlock[] {
    const blocks: ContentBlock[] = [];
    
    // Dividir por secciones (## o ###)
    const sections = content.split(/\n(?=#{2,3}\s)/);
    
    sections.forEach((section, index) => {
      if (section.trim()) {
        const lines = section.split('\n');
        const firstLine = lines[0];
        
        // Determinar si es título principal o subtítulo
        const isMainTitle = firstLine.startsWith('# ');
        const isSubtitle = firstLine.startsWith('## ');
        const isSubSubtitle = firstLine.startsWith('### ');
        
        if (isMainTitle || isSubtitle || isSubSubtitle) {
          // Agregar bloque de título
          const titleText = firstLine.replace(/^#{1,3}\s/, '');
          const titleLevel = firstLine.match(/^#+/)?.[0].length || 1;
          
          blocks.push({
            id: `${moduleId}-title-${index}`,
            type: 'text',
            content: firstLine,
            order: index * 2,
            metadata: {
              fontSize: this.getTitleFontSize(titleLevel),
              isBold: true,
              alignment: isMainTitle ? 'center' : 'left',
              text: titleText
            }
          });
          
          // Agregar contenido de la sección
          const sectionContent = lines.slice(1).join('\n').trim();
          if (sectionContent) {
            blocks.push({
              id: `${moduleId}-content-${index}`,
              type: 'text',
              content: this.formatContent(sectionContent),
              order: index * 2 + 1,
              metadata: {
                fontSize: 'base',
                alignment: 'left'
              }
            });
          }
        } else {
          // Sección sin título, agregar como contenido normal
          blocks.push({
            id: `${moduleId}-content-${index}`,
            type: 'text',
            content: this.formatContent(section),
            order: index * 2,
            metadata: {
              fontSize: 'base',
              alignment: 'left'
            }
          });
        }
      }
    });
    
    return blocks;
  }
  
  /**
   * Formatea el contenido de texto
   */
  private static formatContent(content: string): string {
    return content
      // Convertir listas con • a markdown
      .replace(/^•\s(.+)$/gm, '- $1')
      // Convertir texto en negrita **texto** a <b>texto</b>
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      // Convertir texto en cursiva *texto* a <i>texto</i>
      .replace(/\*(.+?)\*/g, '<i>$1</i>')
      // Convertir enlaces [texto](url) a <a href="url">texto</a>
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Limpiar saltos de línea excesivos
      .replace(/\n{3,}/g, '\n\n');
  }
  
  /**
   * Obtiene el tamaño de fuente para títulos
   */
  private static getTitleFontSize(level: number): string {
    switch (level) {
      case 1: return '3xl';
      case 2: return '2xl';
      case 3: return 'xl';
      default: return 'lg';
    }
  }
  
  /**
   * Genera tags automáticamente
   */
  private static generateTags(module: ExtractedModule): string[] {
    const tags: string[] = [module.category];
    
    if (module.category === 'theoretical') {
      tags.push(...['economia', 'teoria', 'conceptos']);
    } else {
      tags.push(...['trading', 'practico', 'operativa']);
    }
    
    // Agregar tags basados en el contenido
    const content = module.content.toLowerCase();
    if (content.includes('bitcoin') || content.includes('criptomoneda')) {
      tags.push('criptomonedas');
    }
    if (content.includes('análisis') || content.includes('analisis')) {
      tags.push('analisis');
    }
    if (content.includes('riesgo') || content.includes('gestión')) {
      tags.push('gestion-riesgo');
    }
    if (content.includes('vela') || content.includes('candlestick')) {
      tags.push('velas-japonesas');
    }
    if (content.includes('fibonacci') || content.includes('fibonacci')) {
      tags.push('fibonacci');
    }
    if (content.includes('rsi') || content.includes('macd')) {
      tags.push('indicadores-tecnicos');
    }
    
    return [...new Set(tags)]; // Eliminar duplicados
  }
  
  /**
   * Determina la dificultad del módulo
   */
  private static determineDifficulty(module: ExtractedModule): 'beginner' | 'intermediate' | 'advanced' {
    if (module.order <= 2) return 'beginner';
    if (module.order <= 6) return 'intermediate';
    return 'advanced';
  }
  
  /**
   * Estima la duración del módulo
   */
  private static estimateDuration(module: ExtractedModule): number {
    const wordCount = module.content.split(' ').length;
    const readingSpeed = 200; // palabras por minuto
    const baseTime = 5; // tiempo base en minutos
    
    return Math.max(baseTime, Math.ceil(wordCount / readingSpeed) * 2);
  }
  
  /**
   * Obtiene los prerrequisitos del módulo
   */
  private static getPrerequisites(module: ExtractedModule): string[] {
    if (module.order === 1) return [];
    
    const prerequisites: string[] = [];
    
    // Agregar módulo anterior como prerrequisito
    if (module.order > 1) {
      const prevModule = module.category === 'theoretical' 
        ? `teorico-${module.order - 1}`
        : `practico-${module.order - 1}`;
      prerequisites.push(prevModule);
    }
    
    return prerequisites;
  }
  
  /**
   * Valida la conversión
   */
  static validateConversion(result: ConversionResult): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    if (!result.success) {
      issues.push('La conversión falló');
      if (result.errors) {
        issues.push(...result.errors);
      }
    }
    
    if (!result.modules || result.modules.length === 0) {
      issues.push('No se generaron módulos');
    }
    
    if (!result.checkpoints || result.checkpoints.length === 0) {
      suggestions.push('Considerar agregar checkpoints para evaluar el progreso');
    }
    
    // Validar que todos los módulos tengan contenido
    if (result.modules) {
      result.modules.forEach(module => {
        if (!module.content || module.content.length === 0) {
          issues.push(`Módulo ${module.id} no tiene contenido`);
        }
        
        if (!module.title || module.title.trim() === '') {
          issues.push(`Módulo ${module.id} no tiene título`);
        }
        
        if (!module.description || module.description.trim() === '') {
          suggestions.push(`Módulo ${module.id} podría beneficiarse de una descripción más detallada`);
        }
      });
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }
}
