// Sistema de logging robusto para debugging de autenticación
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component: string;
  message: string;
  data?: any;
  stack?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private currentLevel = LogLevel.DEBUG;

  log(level: LogLevel, component: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      data: data ? JSON.parse(JSON.stringify(data)) : undefined,
      stack: level >= LogLevel.ERROR ? new Error().stack : undefined
    };

    this.logs.push(entry);
    
    // Mantener solo los últimos maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log a consola con colores
    const color = this.getColor(level);
    const prefix = `[${entry.timestamp}] [${component}]`;
    
    if (data) {
      console.log(`%c${prefix} ${message}`, color, data);
    } else {
      console.log(`%c${prefix} ${message}`, color);
    }
  }

  private getColor(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG: return 'color: #888';
      case LogLevel.INFO: return 'color: #00f';
      case LogLevel.WARN: return 'color: #f80';
      case LogLevel.ERROR: return 'color: #f00';
      default: return 'color: #000';
    }
  }

  debug(component: string, message: string, data?: any) {
    this.log(LogLevel.DEBUG, component, message, data);
  }

  info(component: string, message: string, data?: any) {
    this.log(LogLevel.INFO, component, message, data);
  }

  warn(component: string, message: string, data?: any) {
    this.log(LogLevel.WARN, component, message, data);
  }

  error(component: string, message: string, data?: any) {
    this.log(LogLevel.ERROR, component, message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLogsByComponent(component: string): LogEntry[] {
    return this.logs.filter(log => log.component === component);
  }

  clear() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();

// Función helper para logging de autenticación
export const authLog = {
  debug: (message: string, data?: any) => logger.debug('AUTH', message, data),
  info: (message: string, data?: any) => logger.info('AUTH', message, data),
  warn: (message: string, data?: any) => logger.warn('AUTH', message, data),
  error: (message: string, data?: any) => logger.error('AUTH', message, data)
};

// Función helper para logging de layout
export const layoutLog = {
  debug: (message: string, data?: any) => logger.debug('LAYOUT', message, data),
  info: (message: string, data?: any) => logger.info('LAYOUT', message, data),
  warn: (message: string, data?: any) => logger.warn('LAYOUT', message, data),
  error: (message: string, data?: any) => logger.error('LAYOUT', message, data)
};

// Función helper para logging de supabase
export const supabaseLog = {
  debug: (message: string, data?: any) => logger.debug('SUPABASE', message, data),
  info: (message: string, data?: any) => logger.info('SUPABASE', message, data),
  warn: (message: string, data?: any) => logger.warn('SUPABASE', message, data),
  error: (message: string, data?: any) => logger.error('SUPABASE', message, data)
};
