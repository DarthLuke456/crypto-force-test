// Motor de Compilación del TRIBUNAL IMPERIAL
// Transforma contenido aprobado en formato compatible con carruseles

import { 
  ContentBlock, 
  CustomModule, 
  ContentCategory,
  DifficultyLevel 
} from './types';

// Interfaz para el módulo compilado compatible con carruseles
export interface CompiledModule {
  id: string;
  title: string;
  description: string;
  category: 'theoretical' | 'practical' | 'mixed' | 'checkpoint';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // en minutos
  content: CompiledContentBlock[];
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
}

// Interfaz para bloques de contenido compilados
export interface CompiledContentBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'link' | 'code' | 'quote' | 'divider' | 'checklist' | 'carousel';
  content: any;
  order: number;
  metadata: {
    width?: string;
    height?: string;
    alignment?: 'left' | 'center' | 'right';
    caption?: string;
    alt?: string;
    url?: string;
    language?: string;
    text?: string;
    author?: string;
    fileName?: string;
    fileType?: string;
    fontSize?: string;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderlined?: boolean;
  };
}

// Configuración del compilador
export const COMPILER_CONFIG = {
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 300,
  DEFAULT_FONT_SIZE: 'text-base',
  DEFAULT_IMAGE_WIDTH: 'w-full',
  DEFAULT_IMAGE_HEIGHT: 'h-auto',
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  DEFAULT_DURATION: 30, // 30 minutos por defecto
  MIN_DURATION: 5, // 5 minutos mínimo
  MAX_DURATION: 480 // 8 horas máximo
};

// Clase principal del compilador
export class ContentCompiler {
  
  /**
   * Compila un módulo del Tribunal Imperial en formato de carrusel
   */
  static compileModule(module: CustomModule): CompiledModule {
    
    // Validar el módulo antes de compilar
    const validation = this.validateModule(module);
    if (!validation.isValid) {
      throw new Error(`Error de validación: ${validation.errors.join(', ')}`);
    }
    
    // Compilar bloques de contenido
    const compiledBlocks = module.content.map(block => this.compileBlock(block));
    
    // Generar metadatos automáticamente
    const autoMetadata = this.generateAutoMetadata(module, compiledBlocks);
    
    // Crear el módulo compilado
    const compiledModule: CompiledModule = {
      id: module.id,
      title: autoMetadata.title,
      description: autoMetadata.description,
      category: module.category,
      difficulty: module.difficulty,
      estimatedDuration: autoMetadata.estimatedDuration,
      content: compiledBlocks,
      thumbnail: autoMetadata.thumbnail,
      author: {
        id: module.authorId,
        name: module.authorName,
        level: module.authorLevel
      },
      createdAt: module.createdAt,
      isPublished: module.isPublished,
      tags: module.tags,
      prerequisites: module.prerequisites
    };
    
    return compiledModule;
  }
  
  /**
   * Compila un bloque de contenido individual
   */
  private static compileBlock(block: ContentBlock): CompiledContentBlock {
    
    // Asegurar que el bloque tenga metadatos
    const metadata = block.metadata || {};
    
    // Compilar según el tipo de bloque
    let compiledContent = block.content;
    
    switch (block.type) {
      case 'text':
        compiledContent = this.compileTextBlock(block.content, metadata);
        break;
      case 'image':
        compiledContent = this.compileImageBlock(block.content, metadata);
        break;
      case 'video':
        compiledContent = this.compileVideoBlock(block.content, metadata);
        break;
      case 'link':
        compiledContent = this.compileLinkBlock(block.content, metadata);
        break;
      case 'code':
        compiledContent = this.compileCodeBlock(block.content, metadata);
        break;
      case 'quote':
        compiledContent = this.compileQuoteBlock(block.content, metadata);
        break;
      case 'checklist':
        compiledContent = this.compileChecklistBlock(block.content, metadata);
        break;
      case 'divider':
        compiledContent = this.compileDividerBlock();
        break;
      case 'carousel':
        compiledContent = this.compileCarouselBlock(block.content, metadata);
        break;
    }
    
    return {
      id: block.id,
      type: block.type,
      content: compiledContent,
      order: block.order,
      metadata: {
        ...metadata,
        width: metadata.width || COMPILER_CONFIG.DEFAULT_IMAGE_WIDTH,
        height: metadata.height || COMPILER_CONFIG.DEFAULT_IMAGE_HEIGHT,
        fontSize: metadata.fontSize || COMPILER_CONFIG.DEFAULT_FONT_SIZE
      }
    };
  }
  
  /**
   * Compila un bloque de texto
   */
  private static compileTextBlock(content: any, metadata: any): string {
    let text = content || '';
    
    // Aplicar formato según metadatos
    if (metadata.isBold) text = `<strong>${text}</strong>`;
    if (metadata.isItalic) text = `<em>${text}</em>`;
    if (metadata.isUnderlined) text = `<u>${text}</u>`;
    
    // Aplicar tamaño de fuente
    const fontSize = metadata.fontSize || COMPILER_CONFIG.DEFAULT_FONT_SIZE;
    text = `<span class="${fontSize}">${text}</span>`;
    
    return text;
  }
  
  /**
   * Compila un bloque de imagen
   */
  private static compileImageBlock(content: any, metadata: any): string {
    const src = content || '';
    const alt = metadata.alt || 'Imagen del módulo';
    const caption = metadata.caption || '';
    const width = metadata.width || COMPILER_CONFIG.DEFAULT_IMAGE_WIDTH;
    const height = metadata.height || COMPILER_CONFIG.DEFAULT_IMAGE_HEIGHT;
    
    let html = `<img src="${src}" alt="${alt}" class="${width} ${height} rounded-lg shadow-md" />`;
    
    if (caption) {
      html += `<p class="text-sm text-gray-600 mt-2 text-center">${caption}</p>`;
    }
    
    return html;
  }
  
  /**
   * Compila un bloque de video
   */
  private static compileVideoBlock(content: any, metadata: any): string {
    const src = content || '';
    const caption = metadata.caption || '';
    const width = metadata.width || 'w-full';
    const height = metadata.height || 'h-64';
    
    let html = `<video controls class="${width} ${height} rounded-lg shadow-md">`;
    html += `<source src="${src}" type="video/mp4" />`;
    html += 'Tu navegador no soporta el elemento de video.';
    html += '</video>';
    
    if (caption) {
      html += `<p class="text-sm text-gray-600 mt-2 text-center">${caption}</p>`;
    }
    
    return html;
  }
  
  /**
   * Compila un bloque de enlace
   */
  private static compileLinkBlock(content: any, metadata: any): string {
    const url = content || '';
    const text = metadata.text || 'Enlace';
    const width = metadata.width || 'w-full';
    
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${width} text-blue-600 hover:text-blue-800 underline">${text}</a>`;
  }
  
  /**
   * Compila un bloque de código
   */
  private static compileCodeBlock(content: any, metadata: any): string {
    const code = content || '';
    const language = metadata.language || 'javascript';
    const width = metadata.width || 'w-full';
    
    return `<pre class="${width} bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto"><code class="language-${language}">${code}</code></pre>`;
  }
  
  /**
   * Compila un bloque de cita
   */
  private static compileQuoteBlock(content: any, metadata: any): string {
    const quote = content || '';
    const author = metadata.author || 'Anónimo';
    const width = metadata.width || 'w-full';
    
    let html = `<blockquote class="${width} border-l-4 border-yellow-500 pl-4 italic text-gray-700">`;
    html += `<p class="text-lg">"${quote}"</p>`;
    html += `<footer class="text-sm text-gray-500 mt-2">— ${author}</footer>`;
    html += '</blockquote>';
    
    return html;
  }
  
  /**
   * Compila un bloque de checklist
   */
  private static compileChecklistBlock(content: any, metadata: any): string {
    if (!Array.isArray(content)) return '';
    
    const items = content.map((item: string, index: number) => {
      const isCompleted = item.startsWith('✓');
      const text = isCompleted ? item.substring(1).trim() : item;
      const icon = isCompleted ? '✅' : '⭕';
      const textClass = isCompleted ? 'line-through text-gray-500' : 'text-gray-700';
      
      let html = `<li class="flex items-center space-x-2 mb-2">`;
      html += `<span class="text-lg">${icon}</span>`;
      html += `<span class="${textClass}">${text}</span>`;
      html += '</li>';
      
      return html;
    }).join('');
    
    return `<ul class="space-y-2">${items}</ul>`;
  }
  
  /**
   * Compila un bloque separador
   */
  private static compileDividerBlock(): string {
    return '<hr class="my-6 border-gray-300" />';
  }
  
  /**
   * Compila un bloque de carrusel
   */
  private static compileCarouselBlock(content: any, metadata: any): string {
    if (!Array.isArray(content)) return '';
    
    const items = content.map((item: any, index: number) => {
      let html = `<div class="carousel-item bg-white p-4 rounded-lg shadow-md">`;
      html += `<div class="text-center">${item}</div>`;
      html += '</div>';
      
      return html;
    }).join('');
    
    return `<div class="carousel-container overflow-hidden rounded-lg">${items}</div>`;
  }
  
  /**
   * Valida un módulo antes de compilar
   */
  private static validateModule(module: CustomModule): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    // Validar campos obligatorios
    if (!module.title || module.title.trim().length === 0) {
      errors.push('El título es obligatorio');
    }
    
    if (!module.description || module.description.trim().length === 0) {
      errors.push('La descripción es obligatoria');
    }
    
    if (!module.content || module.content.length === 0) {
      errors.push('El contenido no puede estar vacío');
    }
    
    // Validar longitud del título
    if (module.title && module.title.length > COMPILER_CONFIG.MAX_TITLE_LENGTH) {
      errors.push(`El título no puede exceder ${COMPILER_CONFIG.MAX_TITLE_LENGTH} caracteres`);
    }
    
    // Validar longitud de la descripción
    if (module.description && module.description.length > COMPILER_CONFIG.MAX_DESCRIPTION_LENGTH) {
      errors.push(`La descripción no puede exceder ${COMPILER_CONFIG.MAX_DESCRIPTION_LENGTH} caracteres`);
    }
    
    // Validar contenido
    if (module.content) {
      module.content.forEach((block, index) => {
        if (!block.type) {
          errors.push(`El bloque ${index + 1} no tiene tipo definido`);
        }
        if (!block.content) {
          errors.push(`El bloque ${index + 1} no tiene contenido`);
        }
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Genera metadatos automáticamente para el módulo
   */
  private static generateAutoMetadata(module: CustomModule, compiledBlocks: CompiledContentBlock[]): {
    title: string;
    description: string;
    estimatedDuration: number;
    thumbnail?: string;
  } {
    
    // Generar título automático si no existe
    let title = module.title;
    if (!title || title.trim().length === 0) {
      title = this.generateAutoTitle(compiledBlocks);
    }
    
    // Generar descripción automática si no existe
    let description = module.description;
    if (!description || description.trim().length === 0) {
      description = this.generateAutoDescription(compiledBlocks);
    }
    
    // Calcular duración estimada
    const estimatedDuration = this.calculateEstimatedDuration(compiledBlocks);
    
    // Generar thumbnail automático
    const thumbnail = this.generateAutoThumbnail(compiledBlocks);
    
    return {
      title,
      description,
      estimatedDuration,
      thumbnail
    };
  }
  
  /**
   * Genera un título automático basado en el contenido
   */
  private static generateAutoTitle(blocks: CompiledContentBlock[]): string {
    // Buscar el primer bloque de texto
    const textBlock = blocks.find(b => b.type === 'text');
    if (textBlock && textBlock.content) {
      const text = textBlock.content.replace(/<[^>]*>/g, '').trim();
      if (text.length > 0) {
        return text.length > 50 ? text.substring(0, 50) + '...' : text;
      }
    }
    
    return 'Módulo del Tribunal Imperial';
  }
  
  /**
   * Genera una descripción automática basada en el contenido
   */
  private static generateAutoDescription(blocks: CompiledContentBlock[]): string {
    const textBlocks = blocks.filter(b => b.type === 'text');
    if (textBlocks.length === 0) {
      return 'Módulo educativo del Tribunal Imperial';
    }
    
    const firstText = textBlocks[0].content.replace(/<[^>]*>/g, '').trim();
    if (firstText.length > 0) {
      return firstText.length > 150 ? firstText.substring(0, 150) + '...' : firstText;
    }
    
    return 'Módulo educativo del Tribunal Imperial';
  }
  
  /**
   * Calcula la duración estimada basada en el contenido
   */
  private static calculateEstimatedDuration(blocks: CompiledContentBlock[]): number {
    let totalDuration = 0;
    
    blocks.forEach(block => {
      switch (block.type) {
        case 'text':
          // 2 minutos por cada 100 palabras
          const text = block.content.replace(/<[^>]*>/g, '');
          const wordCount = text.split(/\s+/).length;
          totalDuration += Math.ceil(wordCount / 100) * 2;
          break;
        case 'image':
          // 1 minuto por imagen
          totalDuration += 1;
          break;
        case 'video':
          // 1.5x la duración del video (para pausas y repeticiones)
          totalDuration += 2; // Estimación por defecto
          break;
        case 'code':
          // 3 minutos por bloque de código
          totalDuration += 3;
          break;
        case 'checklist':
          // 1 minuto por cada 3 items
          if (Array.isArray(block.content)) {
            totalDuration += Math.ceil(block.content.length / 3);
          }
          break;
        default:
          // 1 minuto por defecto para otros tipos
          totalDuration += 1;
      }
    });
    
    // Aplicar límites
    totalDuration = Math.max(totalDuration, COMPILER_CONFIG.MIN_DURATION);
    totalDuration = Math.min(totalDuration, COMPILER_CONFIG.MAX_DURATION);
    
    return totalDuration;
  }
  
  /**
   * Genera un thumbnail automático basado en el contenido
   */
  private static generateAutoThumbnail(blocks: CompiledContentBlock[]): string | undefined {
    // Buscar la primera imagen
    const imageBlock = blocks.find(b => b.type === 'image');
    if (imageBlock && imageBlock.content) {
      return imageBlock.content;
    }
    
    // Si no hay imagen, buscar video
    const videoBlock = blocks.find(b => b.type === 'video');
    if (videoBlock && videoBlock.content) {
      return videoBlock.content; // Para videos, podríamos generar un frame
    }
    
    return undefined;
  }
  
  /**
   * Optimiza un módulo compilado para el rendimiento
   */
  static optimizeModule(module: CompiledModule): CompiledModule {
    // Aquí podríamos implementar optimizaciones como:
    // - Compresión de imágenes
    // - Minificación de HTML
    // - Lazy loading de recursos
    // - Caching de contenido estático
    
    return module;
  }
}
