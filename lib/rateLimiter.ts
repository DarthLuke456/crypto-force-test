import { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

export function rateLimit(
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000, // 15 minutos por defecto
  keyGenerator?: (req: NextRequest) => string
) {
  return (req: NextRequest): RateLimitResult => {
    const now = Date.now();
    const key = keyGenerator ? keyGenerator(req) : getClientIP(req);
    
    // Limpiar entradas expiradas
    cleanupExpiredEntries(now);
    
    const entry = rateLimitMap.get(key);
    
    if (!entry) {
      // Primera request
      rateLimitMap.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      
      return {
        success: true,
        remaining: limit - 1,
        resetTime: now + windowMs
      };
    }
    
    if (now > entry.resetTime) {
      // Reset del contador
      rateLimitMap.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      
      return {
        success: true,
        remaining: limit - 1,
        resetTime: now + windowMs
      };
    }
    
    if (entry.count >= limit) {
      // Rate limit excedido
      return {
        success: false,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      };
    }
    
    // Incrementar contador
    entry.count++;
    rateLimitMap.set(key, entry);
    
    return {
      success: true,
      remaining: limit - entry.count,
      resetTime: entry.resetTime
    };
  };
}

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  // NextRequest no tiene propiedad ip, usar headers
  return 'unknown';
}

function cleanupExpiredEntries(now: number): void {
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

// Rate limiters específicos
export const apiRateLimit = rateLimit(60, 15 * 60 * 1000); // 60 requests por 15 minutos
export const authRateLimit = rateLimit(5, 15 * 60 * 1000); // 5 intentos de auth por 15 minutos
export const uploadRateLimit = rateLimit(10, 60 * 60 * 1000); // 10 uploads por hora
export const feedbackRateLimit = rateLimit(3, 60 * 60 * 1000); // 3 feedbacks por hora

// Rate limiter por usuario autenticado
export function userRateLimit(limit: number, windowMs: number) {
  return rateLimit(limit, windowMs, (req) => {
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      return `user:${authHeader.substring(7)}`;
    }
    return getClientIP(req);
  });
}
