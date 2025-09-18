interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: 'LOCK' | 'UNLOCK' | 'ATTEMPT' | 'FAILED_ATTEMPT' | 'UNAUTHORIZED_ACCESS';
  userId: string;
  userEmail: string;
  ipAddress: string;
  userAgent: string;
  details: any;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  resolved: boolean;
}

class AuditLogger {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000; // Mantener solo los últimos 1000 eventos

  logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>) {
    const securityEvent: SecurityEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...event
    };

    this.events.unshift(securityEvent);
    
    // Mantener solo los eventos más recientes
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    // En producción, aquí enviarías a un servicio de logging
    console.log('🔒 Security Event:', securityEvent);
    
    // Enviar alertas para eventos críticos
    if (event.severity === 'CRITICAL') {
      this.sendCriticalAlert(securityEvent);
    }
  }

  logLockAttempt(userEmail: string, ipAddress: string, userAgent: string, success: boolean, details?: any) {
    this.logEvent({
      eventType: success ? 'LOCK' : 'FAILED_ATTEMPT',
      userId: userEmail,
      userEmail,
      ipAddress,
      userAgent,
      details: {
        action: 'LOCK',
        success,
        ...details
      },
      severity: success ? 'HIGH' : 'CRITICAL',
      resolved: success
    });
  }

  logUnlockAttempt(userEmail: string, ipAddress: string, userAgent: string, success: boolean, details?: any) {
    this.logEvent({
      eventType: success ? 'UNLOCK' : 'FAILED_ATTEMPT',
      userId: userEmail,
      userEmail,
      ipAddress,
      userAgent,
      details: {
        action: 'UNLOCK',
        success,
        ...details
      },
      severity: success ? 'HIGH' : 'CRITICAL',
      resolved: success
    });
  }

  logUnauthorizedAccess(userEmail: string, ipAddress: string, userAgent: string, details?: any) {
    this.logEvent({
      eventType: 'UNAUTHORIZED_ACCESS',
      userId: userEmail,
      userEmail,
      ipAddress,
      userAgent,
      details,
      severity: 'CRITICAL',
      resolved: false
    });
  }

  getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.events.slice(0, limit);
  }

  getEventsByType(eventType: SecurityEvent['eventType']): SecurityEvent[] {
    return this.events.filter(event => event.eventType === eventType);
  }

  getEventsBySeverity(severity: SecurityEvent['severity']): SecurityEvent[] {
    return this.events.filter(event => event.severity === severity);
  }

  getFailedAttempts(userEmail: string, timeWindow: number = 60 * 60 * 1000): SecurityEvent[] {
    const cutoff = Date.now() - timeWindow;
    return this.events.filter(event => 
      event.userEmail === userEmail && 
      event.eventType === 'FAILED_ATTEMPT' &&
      new Date(event.timestamp).getTime() > cutoff
    );
  }

  private sendCriticalAlert(event: SecurityEvent) {
    // En producción, aquí enviarías alertas a:
    // - Email de administradores
    // - Slack/Discord webhook
    // - Sistema de monitoreo
    // - SMS/WhatsApp
    
    console.log('🚨 CRITICAL SECURITY ALERT:', event);
    
    // Ejemplo de notificación crítica
    const alertMessage = `
🚨 ALERTA CRÍTICA DE SEGURIDAD 🚨

Tipo: ${event.eventType}
Usuario: ${event.userEmail}
IP: ${event.ipAddress}
Timestamp: ${event.timestamp}
Severidad: ${event.severity}

Detalles: ${JSON.stringify(event.details, null, 2)}
    `;
    
    console.log(alertMessage);
  }

  // Método para obtener estadísticas de seguridad
  getSecurityStats() {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);
    const last7d = now - (7 * 24 * 60 * 60 * 1000);

    const recentEvents = this.events.filter(event => 
      new Date(event.timestamp).getTime() > last24h
    );

    const weeklyEvents = this.events.filter(event => 
      new Date(event.timestamp).getTime() > last7d
    );

    return {
      totalEvents: this.events.length,
      last24h: {
        total: recentEvents.length,
        locks: recentEvents.filter(e => e.eventType === 'LOCK').length,
        unlocks: recentEvents.filter(e => e.eventType === 'UNLOCK').length,
        failedAttempts: recentEvents.filter(e => e.eventType === 'FAILED_ATTEMPT').length,
        unauthorizedAccess: recentEvents.filter(e => e.eventType === 'UNAUTHORIZED_ACCESS').length
      },
      last7d: {
        total: weeklyEvents.length,
        locks: weeklyEvents.filter(e => e.eventType === 'LOCK').length,
        unlocks: weeklyEvents.filter(e => e.eventType === 'UNLOCK').length,
        failedAttempts: weeklyEvents.filter(e => e.eventType === 'FAILED_ATTEMPT').length,
        unauthorizedAccess: weeklyEvents.filter(e => e.eventType === 'UNAUTHORIZED_ACCESS').length
      },
      severity: {
        critical: this.events.filter(e => e.severity === 'CRITICAL').length,
        high: this.events.filter(e => e.severity === 'HIGH').length,
        medium: this.events.filter(e => e.severity === 'MEDIUM').length,
        low: this.events.filter(e => e.severity === 'LOW').length
      }
    };
  }
}

// Instancia singleton del logger
export const auditLogger = new AuditLogger();

// Función helper para obtener IP del request
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// Función helper para obtener User Agent
export function getClientUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown';
}
