// Utilidades de optimización de performance
import React from 'react';

// Lazy loading de componentes
export function lazyLoadComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return React.lazy(importFunc);
}

// Debounce para búsquedas y filtros
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle para eventos de scroll y resize
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Memoización de funciones costosas
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Intersection Observer para lazy loading de imágenes
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) {
  if (typeof window === 'undefined') return null;
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  });
}

// Preload de recursos críticos
export function preloadResource(href: string, as: string) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

// Prefetch de rutas
export function prefetchRoute(href: string) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

// Optimización de imágenes
export function getOptimizedImageUrl(
  src: string,
  width?: number,
  height?: number,
  quality: number = 75
): string {
  if (!src) return '';
  
  // Si es una imagen de Supabase Storage
  if (src.includes('supabase')) {
    const url = new URL(src);
    if (width) url.searchParams.set('width', width.toString());
    if (height) url.searchParams.set('height', height.toString());
    url.searchParams.set('quality', quality.toString());
    return url.toString();
  }
  
  // Para otras imágenes, usar Next.js Image Optimization
  return src;
}

// Compresión de datos
export function compressData(data: any): string {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error comprimiendo datos:', error);
    return '';
  }
}

// Descompresión de datos
export function decompressData<T>(compressed: string): T | null {
  try {
    return JSON.parse(compressed);
  } catch (error) {
    console.error('Error descomprimiendo datos:', error);
    return null;
  }
}

// Cache en memoria
class MemoryCache {
  private cache = new Map<string, { data: any; expires: number }>();
  private maxSize = 100;
  private defaultTTL = 5 * 60 * 1000; // 5 minutos

  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    // Limpiar cache si está lleno
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      expires: Date.now() + ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const memoryCache = new MemoryCache();

// Hook para performance monitoring
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = React.useState({
    renderTime: 0,
    memoryUsage: 0,
    isSlow: false
  });

  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      setMetrics(prev => ({
        ...prev,
        renderTime,
        isSlow: renderTime > 16 // Más de 16ms es lento para 60fps
      }));
    };
  }, []);

  return metrics;
}

// Optimización de listas grandes
export function useVirtualization<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length - 1
  );
  
  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  };
}

// Bundle analyzer helper
export function analyzeBundle() {
  if (process.env.NODE_ENV !== 'development') return;
  
  // Solo en desarrollo para analizar el bundle
  console.log('Bundle analysis available in development mode');
}

// Performance budget
export const PERFORMANCE_BUDGET = {
  FCP: 1800, // First Contentful Paint
  LCP: 2500, // Largest Contentful Paint
  FID: 100,  // First Input Delay
  CLS: 0.1,  // Cumulative Layout Shift
  TTFB: 600, // Time to First Byte
};

// Verificar si cumple con el budget de performance
export function checkPerformanceBudget(metrics: any): boolean {
  return Object.entries(PERFORMANCE_BUDGET).every(([key, budget]) => {
    const value = metrics[key];
    return value !== undefined && value <= budget;
  });
}
