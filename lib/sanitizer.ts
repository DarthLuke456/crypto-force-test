// Utilidades de sanitización y validación de entrada
// Para uso en servidor (Node.js) y cliente

export interface ValidationResult {
  isValid: boolean;
  sanitized?: string;
  error?: string;
}

// Sanitización básica de texto
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+\s*=/gi, '') // Remover event handlers
    .substring(0, 1000); // Limitar longitud
}

// Sanitización de HTML
export function sanitizeHTML(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remover scripts
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remover iframes
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remover objects
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '') // Remover embeds
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remover event handlers
    .replace(/javascript:/gi, '') // Remover javascript:
    .trim();
}

// Validación de email
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email es requerido' };
  }
  
  const sanitized = email.toLowerCase().trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(sanitized)) {
    return { isValid: false, error: 'Formato de email inválido' };
  }
  
  if (sanitized.length > 254) {
    return { isValid: false, error: 'Email demasiado largo' };
  }
  
  return { isValid: true, sanitized };
}

// Validación de teléfono
export function validatePhone(phone: string): ValidationResult {
  if (!phone || typeof phone !== 'string') {
    return { isValid: true, sanitized: '' }; // Teléfono es opcional
  }
  
  const sanitized = phone.replace(/\s/g, '').trim();
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  
  if (!phoneRegex.test(sanitized)) {
    return { isValid: false, error: 'Formato de teléfono inválido' };
  }
  
  if (sanitized.length > 15) {
    return { isValid: false, error: 'Número de teléfono demasiado largo' };
  }
  
  return { isValid: true, sanitized };
}

// Validación de nombre/apellido
export function validateName(name: string, fieldName: string = 'Nombre'): ValidationResult {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: `${fieldName} es requerido` };
  }
  
  const sanitized = sanitizeText(name);
  
  if (sanitized.length < 2) {
    return { isValid: false, error: `${fieldName} debe tener al menos 2 caracteres` };
  }
  
  if (sanitized.length > 50) {
    return { isValid: false, error: `${fieldName} demasiado largo` };
  }
  
  // Solo letras, espacios, guiones y apostrofes
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-']+$/;
  if (!nameRegex.test(sanitized)) {
    return { isValid: false, error: `${fieldName} contiene caracteres inválidos` };
  }
  
  return { isValid: true, sanitized };
}

// Validación de nickname
export function validateNickname(nickname: string): ValidationResult {
  if (!nickname || typeof nickname !== 'string') {
    return { isValid: false, error: 'Nickname es requerido' };
  }
  
  const sanitized = sanitizeText(nickname);
  
  if (sanitized.length < 3) {
    return { isValid: false, error: 'Nickname debe tener al menos 3 caracteres' };
  }
  
  if (sanitized.length > 30) {
    return { isValid: false, error: 'Nickname demasiado largo' };
  }
  
  // Solo letras, números, guiones bajos y guiones
  const nicknameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!nicknameRegex.test(sanitized)) {
    return { isValid: false, error: 'Nickname solo puede contener letras, números, guiones y guiones bajos' };
  }
  
  return { isValid: true, sanitized };
}

// Validación de contraseña
export function validatePassword(password: string): ValidationResult {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Contraseña es requerida' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Contraseña debe tener al menos 8 caracteres' };
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'Contraseña demasiado larga' };
  }
  
  // Verificar complejidad básica
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return { 
      isValid: false, 
      error: 'Contraseña debe contener al menos una letra mayúscula, una minúscula y un número' 
    };
  }
  
  return { isValid: true, sanitized: password };
}

// Validación de código de referido
export function validateReferralCode(code: string): ValidationResult {
  if (!code || typeof code !== 'string') {
    return { isValid: true, sanitized: '' }; // Código es opcional
  }
  
  const sanitized = code.toUpperCase().trim();
  
  if (sanitized.length < 3) {
    return { isValid: false, error: 'Código de referido debe tener al menos 3 caracteres' };
  }
  
  if (sanitized.length > 50) {
    return { isValid: false, error: 'Código de referido demasiado largo' };
  }
  
  // Solo letras, números y guiones bajos
  const codeRegex = /^[A-Z0-9_]+$/;
  if (!codeRegex.test(sanitized)) {
    return { isValid: false, error: 'Código de referido solo puede contener letras, números y guiones bajos' };
  }
  
  return { isValid: true, sanitized };
}

// Validación de exchange
export function validateExchange(exchange: string): ValidationResult {
  if (!exchange || typeof exchange !== 'string') {
    return { isValid: false, error: 'Exchange es requerido' };
  }
  
  const sanitized = sanitizeText(exchange);
  const validExchanges = [
    'Binance', 'Coinbase', 'Kraken', 'Bitget', 'Bybit', 'KuCoin', 
    'Huobi', 'OKX', 'Gate.io', 'MEXC', 'ZoomEx', 'Otro'
  ];
  
  if (!validExchanges.some(ex => ex.toLowerCase() === sanitized.toLowerCase())) {
    return { isValid: false, error: 'Exchange no válido' };
  }
  
  return { isValid: true, sanitized };
}

// Sanitización de URL
export function sanitizeURL(url: string): string {
  if (typeof url !== 'string') return '';
  
  try {
    const urlObj = new URL(url);
    // Solo permitir HTTP y HTTPS
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return '';
    }
    return urlObj.toString();
  } catch {
    return '';
  }
}

// Validación de nivel de usuario
export function validateUserLevel(level: any): ValidationResult {
  const numLevel = parseInt(level);
  
  if (isNaN(numLevel)) {
    return { isValid: false, error: 'Nivel de usuario debe ser un número' };
  }
  
  if (numLevel < 0 || numLevel > 6) {
    return { isValid: false, error: 'Nivel de usuario debe estar entre 0 y 6' };
  }
  
  return { isValid: true, sanitized: numLevel.toString() };
}

// Función de sanitización general
export function sanitizeInput(input: any, type: 'text' | 'html' | 'email' | 'phone' | 'name' | 'nickname' | 'password' | 'referral' | 'exchange' | 'url' | 'level'): ValidationResult {
  switch (type) {
    case 'text':
      return { isValid: true, sanitized: sanitizeText(input) };
    case 'html':
      return { isValid: true, sanitized: sanitizeHTML(input) };
    case 'email':
      return validateEmail(input);
    case 'phone':
      return validatePhone(input);
    case 'name':
      return validateName(input);
    case 'nickname':
      return validateNickname(input);
    case 'password':
      return validatePassword(input);
    case 'referral':
      return validateReferralCode(input);
    case 'exchange':
      return validateExchange(input);
    case 'url':
      return { isValid: true, sanitized: sanitizeURL(input) };
    case 'level':
      return validateUserLevel(input);
    default:
      return { isValid: false, error: 'Tipo de validación no soportado' };
  }
}
