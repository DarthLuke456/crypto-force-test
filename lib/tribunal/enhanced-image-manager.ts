// 🏛️ GESTIÓN MEJORADA DE IMÁGENES - TRIBUNAL IMPERIAL
// Maneja la subida y gestión de imágenes desde computadora

import { ContentBlock } from './types';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  metadata?: {
    fileName: string;
    fileSize: number;
    fileType: string;
    dimensions?: {
      width: number;
      height: number;
    };
  };
}

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  resizeMode?: 'contain' | 'cover' | 'fill';
}

export class EnhancedImageManager {
  
  /**
   * Procesa y sube una imagen desde el input de archivo
   */
  static async uploadImageFromFile(
    file: File,
    options: ImageProcessingOptions = {}
  ): Promise<ImageUploadResult> {
    
    try {
      // Validar tipo de archivo
      if (!this.isValidImageType(file.type)) {
        return {
          success: false,
          error: 'Tipo de archivo no válido. Solo se permiten JPG, PNG, GIF y WebP.'
        };
      }
      
      // Validar tamaño
      if (!this.isValidFileSize(file.size)) {
        return {
          success: false,
          error: 'El archivo es demasiado grande. Máximo 10MB.'
        };
      }
      
      // Procesar imagen
      const processedImage = await this.processImage(file, options);
      
      // Subir a Supabase Storage
      const uploadResult = await this.uploadToSupabase(processedImage, file.name);
      
      if (uploadResult.success) {
        return {
          success: true,
          url: uploadResult.url,
          metadata: {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            dimensions: processedImage.dimensions
          }
        };
      } else {
        return {
          success: false,
          error: uploadResult.error || 'Error al subir la imagen'
        };
      }
      
    } catch (error) {
      console.error('Error en uploadImageFromFile:', error);
      return {
        success: false,
        error: 'Error inesperado al procesar la imagen'
      };
    }
  }
  
  /**
   * Procesa una imagen con las opciones especificadas
   */
  private static async processImage(
    file: File, 
    options: ImageProcessingOptions
  ): Promise<{
    blob: Blob;
    dimensions: { width: number; height: number };
  }> {
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('No se pudo obtener el contexto del canvas'));
        return;
      }
      
      img.onload = () => {
        const { width, height } = this.calculateDimensions(
          img.width, 
          img.height, 
          options.maxWidth || 1920, 
          options.maxHeight || 1080,
          options.resizeMode || 'contain'
        );
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                blob,
                dimensions: { width, height }
              });
            } else {
              reject(new Error('Error al procesar la imagen'));
            }
          },
          `image/${options.format || 'jpeg'}`,
          options.quality || 0.8
        );
      };
      
      img.onerror = () => reject(new Error('Error al cargar la imagen'));
      img.src = URL.createObjectURL(file);
    });
  }
  
  /**
   * Calcula las dimensiones de redimensionamiento
   */
  private static calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number,
    resizeMode: 'contain' | 'cover' | 'fill'
  ): { width: number; height: number } {
    
    const aspectRatio = originalWidth / originalHeight;
    
    switch (resizeMode) {
      case 'contain':
        if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
          return { width: originalWidth, height: originalHeight };
        }
        
        const scale = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
        return {
          width: Math.round(originalWidth * scale),
          height: Math.round(originalHeight * scale)
        };
        
      case 'cover':
        const coverScale = Math.max(maxWidth / originalWidth, maxHeight / originalHeight);
        return {
          width: Math.round(originalWidth * coverScale),
          height: Math.round(originalHeight * coverScale)
        };
        
      case 'fill':
        return { width: maxWidth, height: maxHeight };
        
      default:
        return { width: originalWidth, height: originalHeight };
    }
  }
  
  /**
   * Sube la imagen procesada a Supabase Storage
   */
  private static async uploadToSupabase(
    processedImage: { blob: Blob; dimensions: { width: number; height: number } },
    fileName: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    
    try {
      // Generar nombre único para el archivo
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileExtension = fileName.split('.').pop() || 'jpg';
      const uniqueFileName = `tribunal-images/${timestamp}-${randomId}.${fileExtension}`;
      
      // Aquí iría la lógica de subida a Supabase
      // Por ahora simulamos la subida
      const mockUrl = `https://supabase-storage-url.com/${uniqueFileName}`;
      
      return {
        success: true,
        url: mockUrl
      };
      
    } catch (error) {
      console.error('Error al subir a Supabase:', error);
      return {
        success: false,
        error: 'Error al subir la imagen al servidor'
      };
    }
  }
  
  /**
   * Valida el tipo de archivo
   */
  private static isValidImageType(mimeType: string): boolean {
    const validTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp'
    ];
    
    return validTypes.includes(mimeType);
  }
  
  /**
   * Valida el tamaño del archivo
   */
  private static isValidFileSize(size: number): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return size <= maxSize;
  }
  
  /**
   * Crea un ContentBlock de imagen
   */
  static createImageContentBlock(
    imageUrl: string,
    metadata: {
      fileName: string;
      fileSize: number;
      fileType: string;
      dimensions?: { width: number; height: number };
    },
    order: number
  ): ContentBlock {
    
    return {
      id: `image_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      type: 'image',
      content: imageUrl,
      order: order,
      metadata: {
        fileName: metadata.fileName,
        fileType: metadata.fileType,
        width: metadata.dimensions?.width?.toString() || 'auto',
        height: metadata.dimensions?.height?.toString() || 'auto',
        alignment: 'center',
        caption: metadata.fileName
      }
    };
  }
  
  /**
   * Obtiene la URL de una imagen optimizada
   */
  static getOptimizedImageUrl(
    originalUrl: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'jpeg' | 'png' | 'webp';
    } = {}
  ): string {
    
    // Si es una URL de Supabase, aplicar transformaciones
    if (originalUrl.includes('supabase')) {
      const params = new URLSearchParams();
      
      if (options.width) params.append('width', options.width.toString());
      if (options.height) params.append('height', options.height.toString());
      if (options.quality) params.append('quality', options.quality.toString());
      if (options.format) params.append('format', options.format);
      
      const queryString = params.toString();
      return queryString ? `${originalUrl}?${queryString}` : originalUrl;
    }
    
    return originalUrl;
  }
  
  /**
   * Genera un placeholder para imágenes
   */
  static generateImagePlaceholder(
    width: number = 400,
    height: number = 300,
    text: string = 'Imagen'
  ): string {
    
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="16" fill="#6b7280">
          ${text}
        </text>
      </svg>
    `)}`;
  }
}
