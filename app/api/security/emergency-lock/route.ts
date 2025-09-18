import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Configuración de seguridad
const SECURITY_CONFIG = {
  maxLockDuration: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
  maxLockAttempts: 3, // Máximo 3 intentos de bloqueo por hora
  cooldownPeriod: 60 * 60 * 1000, // 1 hora de cooldown después de 3 intentos
  allowedEmails: ['coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com']
};

interface LockAttempt {
  email: string;
  timestamp: number;
  action: 'LOCK' | 'UNLOCK';
  success: boolean;
}

// En producción, esto debería estar en una base de datos
const lockAttempts: LockAttempt[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userEmail, mfaCode, reason, lockId } = body;

    // Validar email autorizado
    if (!SECURITY_CONFIG.allowedEmails.includes(userEmail)) {
      return NextResponse.json(
        { error: 'No autorizado para gestionar el bloqueo de emergencia' },
        { status: 403 }
      );
    }

    // Verificar límite de intentos
    const now = Date.now();
    const recentAttempts = lockAttempts.filter(
      attempt => 
        attempt.email === userEmail && 
        attempt.timestamp > now - SECURITY_CONFIG.cooldownPeriod
    );

    if (recentAttempts.length >= SECURITY_CONFIG.maxLockAttempts) {
      return NextResponse.json(
        { 
          error: 'Demasiados intentos. Espera antes de intentar nuevamente.',
          cooldownUntil: new Date(now + SECURITY_CONFIG.cooldownPeriod).toISOString()
        },
        { status: 429 }
      );
    }

    // Registrar intento
    lockAttempts.push({
      email: userEmail,
      timestamp: now,
      action,
      success: false
    });

    // Validar MFA (en producción, usar un servicio real)
    if (mfaCode && !validateMFACode(mfaCode, userEmail)) {
      return NextResponse.json(
        { error: 'Código MFA inválido' },
        { status: 400 }
      );
    }

    // Obtener estado actual del bloqueo
    const currentLock = await getCurrentLockState();

    if (action === 'LOCK') {
      // Verificar si ya está bloqueado
      if (currentLock.isLocked) {
        return NextResponse.json(
          { error: 'El sistema ya está bloqueado' },
          { status: 400 }
        );
      }

      // Crear nuevo bloqueo
      const lockData = {
        isLocked: true,
        lockedBy: userEmail,
        lockedAt: new Date().toISOString(),
        reason: reason || 'Sistema bloqueado por seguridad',
        lockId: lockId || `lock_${now}_${Math.random().toString(36).substr(2, 9)}`,
        lockExpiry: new Date(now + SECURITY_CONFIG.maxLockDuration).toISOString(),
        requiresMFA: true
      };

      // Guardar en base de datos (en producción)
      await saveLockState(lockData);

      // Registrar éxito
      lockAttempts[lockAttempts.length - 1].success = true;

      // Enviar notificaciones de seguridad
      await sendSecurityNotifications('LOCK', lockData);

      return NextResponse.json({
        success: true,
        lockData,
        message: 'Sistema bloqueado exitosamente'
      });

    } else if (action === 'UNLOCK') {
      // Verificar si está bloqueado
      if (!currentLock.isLocked) {
        return NextResponse.json(
          { error: 'El sistema no está bloqueado' },
          { status: 400 }
        );
      }

      // Verificar que el usuario que desbloquea sea el mismo que bloqueó
      if (currentLock.lockedBy !== userEmail) {
        return NextResponse.json(
          { error: 'Solo el usuario que bloqueó el sistema puede desbloquearlo' },
          { status: 403 }
        );
      }

      // Desbloquear
      const unlockData = {
        isLocked: false,
        lockedBy: null,
        lockedAt: null,
        reason: null,
        lockId: null,
        lockExpiry: null,
        requiresMFA: true
      };

      // Guardar en base de datos (en producción)
      await saveLockState(unlockData);

      // Registrar éxito
      lockAttempts[lockAttempts.length - 1].success = true;

      // Enviar notificaciones de seguridad
      await sendSecurityNotifications('UNLOCK', { unlockedBy: userEmail, timestamp: new Date().toISOString() });

      return NextResponse.json({
        success: true,
        unlockData,
        message: 'Sistema desbloqueado exitosamente'
      });

    } else if (action === 'STATUS') {
      // Retornar estado actual
      return NextResponse.json({
        success: true,
        lockState: currentLock
      });

    } else {
      return NextResponse.json(
        { error: 'Acción no válida' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error en API de bloqueo de emergencia:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Función para validar código MFA (placeholder)
function validateMFACode(code: string, email: string): boolean {
  // En producción, esto debería validar contra un servicio real de MFA
  // Por ahora, aceptamos cualquier código de 6 dígitos
  return /^\d{6}$/.test(code);
}

// Función para obtener estado actual del bloqueo
async function getCurrentLockState() {
  try {
    // En producción, esto debería consultar la base de datos
    // Por ahora, retornamos un estado por defecto
    return {
      isLocked: false,
      lockedBy: null,
      lockedAt: null,
      reason: null,
      lockId: null,
      lockExpiry: null,
      requiresMFA: true
    };
  } catch (error) {
    console.error('Error obteniendo estado del bloqueo:', error);
    return {
      isLocked: false,
      lockedBy: null,
      lockedAt: null,
      reason: null,
      lockId: null,
      lockExpiry: null,
      requiresMFA: true
    };
  }
}

// Función para guardar estado del bloqueo
async function saveLockState(lockData: any) {
  try {
    // En producción, esto debería guardar en la base de datos
    console.log('Guardando estado del bloqueo:', lockData);
  } catch (error) {
    console.error('Error guardando estado del bloqueo:', error);
    throw error;
  }
}

// Función para enviar notificaciones de seguridad
async function sendSecurityNotifications(action: 'LOCK' | 'UNLOCK', data: any) {
  try {
    // En producción, aquí enviarías notificaciones a:
    // - Email de administradores
    // - Slack/Discord webhook
    // - Sistema de monitoreo
    // - Logs de seguridad
    
    console.log(`🔔 Notificación de seguridad: ${action}`, data);
    
    // Ejemplo de notificación por email (en producción)
    // await sendEmail({
    //   to: 'admin@cryptoforce.com',
    //   subject: `🚨 Sistema ${action === 'LOCK' ? 'BLOQUEADO' : 'DESBLOQUEADO'}`,
    //   body: `Acción: ${action}\nUsuario: ${data.lockedBy || data.unlockedBy}\nTimestamp: ${new Date().toISOString()}`
    // });
    
  } catch (error) {
    console.error('Error enviando notificaciones de seguridad:', error);
  }
}
