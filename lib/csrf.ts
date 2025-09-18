import { randomBytes, createHmac } from 'crypto';

export interface CSRFToken {
  token: string;
  expiresAt: number;
}

// Almacenamiento temporal de tokens CSRF (en producción usar Redis)
const csrfTokens = new Map<string, CSRFToken>();

// Configuración
const CSRF_CONFIG = {
  tokenLength: 32,
  expirationTime: 60 * 60 * 1000, // 1 hora
  cleanupInterval: 5 * 60 * 1000, // 5 minutos
};

// Limpiar tokens expirados
function cleanupExpiredTokens(): void {
  const now = Date.now();
  for (const [key, token] of csrfTokens.entries()) {
    if (now > token.expiresAt) {
      csrfTokens.delete(key);
    }
  }
}

// Ejecutar limpieza periódicamente
setInterval(cleanupExpiredTokens, CSRF_CONFIG.cleanupInterval);

// Generar token CSRF
export function generateCSRFToken(sessionId: string): string {
  const token = randomBytes(CSRF_CONFIG.tokenLength).toString('hex');
  const expiresAt = Date.now() + CSRF_CONFIG.expirationTime;
  
  csrfTokens.set(sessionId, {
    token,
    expiresAt
  });
  
  return token;
}

// Validar token CSRF
export function validateCSRFToken(sessionId: string, token: string): boolean {
  const storedToken = csrfTokens.get(sessionId);
  
  if (!storedToken) {
    return false;
  }
  
  if (Date.now() > storedToken.expiresAt) {
    csrfTokens.delete(sessionId);
    return false;
  }
  
  return storedToken.token === token;
}

// Revocar token CSRF
export function revokeCSRFToken(sessionId: string): void {
  csrfTokens.delete(sessionId);
}

// Generar hash HMAC para validación adicional
export function generateCSRFHash(token: string, secret: string): string {
  return createHmac('sha256', secret).update(token).digest('hex');
}

// Validar hash HMAC
export function validateCSRFHash(token: string, hash: string, secret: string): boolean {
  const expectedHash = generateCSRFHash(token, secret);
  return expectedHash === hash;
}

// Middleware para verificar CSRF
export function csrfMiddleware(req: Request, sessionId: string): { valid: boolean; error?: string } {
  const token = req.headers.get('x-csrf-token');
  
  if (!token) {
    return { valid: false, error: 'CSRF token requerido' };
  }
  
  if (!validateCSRFToken(sessionId, token)) {
    return { valid: false, error: 'CSRF token inválido o expirado' };
  }
  
  return { valid: true };
}

// Obtener token CSRF para el cliente
export function getCSRFToken(sessionId: string): string | null {
  const storedToken = csrfTokens.get(sessionId);
  
  if (!storedToken || Date.now() > storedToken.expiresAt) {
    return null;
  }
  
  return storedToken.token;
}

// Verificar si un token existe y es válido
export function hasValidCSRFToken(sessionId: string): boolean {
  const storedToken = csrfTokens.get(sessionId);
  return storedToken ? Date.now() <= storedToken.expiresAt : false;
}

// Obtener estadísticas de tokens CSRF (para debugging)
export function getCSRFStats(): { activeTokens: number; totalTokens: number } {
  const now = Date.now();
  let activeTokens = 0;
  
  for (const token of csrfTokens.values()) {
    if (now <= token.expiresAt) {
      activeTokens++;
    }
  }
  
  return {
    activeTokens,
    totalTokens: csrfTokens.size
  };
}
