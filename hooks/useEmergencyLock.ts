import { useState, useEffect } from 'react';

interface EmergencyLockState {
  isLocked: boolean;
  lockedBy: string | null;
  lockedAt: string | null;
  reason: string | null;
  lockId: string | null;
  requiresMFA: boolean;
  mfaToken?: string;
  lockExpiry?: string | null;
}

const EMERGENCY_LOCK_KEY = 'crypto_force_emergency_lock';
const LOCK_EXPIRY_HOURS = 24; // El bloqueo expira automáticamente después de 24 horas

export const useEmergencyLock = () => {
  const [lockState, setLockState] = useState<EmergencyLockState>({
    isLocked: false,
    lockedBy: null,
    lockedAt: null,
    reason: null,
    lockId: null,
    requiresMFA: true,
    lockExpiry: null
  });

  // Cargar estado inicial desde localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(EMERGENCY_LOCK_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Verificar si el bloqueo ha expirado
        if (parsedState.lockExpiry && new Date(parsedState.lockExpiry) < new Date()) {
          console.log('🔓 Bloqueo expirado automáticamente');
          setLockState({
            isLocked: false,
            lockedBy: null,
            lockedAt: null,
            reason: null,
            lockId: null,
            requiresMFA: true,
            lockExpiry: null
          });
          return;
        }
        
        setLockState(parsedState);
      }
    } catch (error) {
      console.error('Error loading emergency lock state:', error);
    }
  }, []);

  // Guardar estado en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem(EMERGENCY_LOCK_KEY, JSON.stringify(lockState));
    } catch (error) {
      console.error('Error saving emergency lock state:', error);
    }
  }, [lockState]);

  // Generar ID único para el bloqueo
  const generateLockId = () => {
    return `lock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Generar token MFA simple (en producción usarías un servicio real)
  const generateMFAToken = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
  };

  const lockSystem = (lockedBy: string, reason?: string, mfaCode?: string) => {
    // Verificar MFA si está habilitado
    if (lockState.requiresMFA && !mfaCode) {
      const mfaToken = generateMFAToken();
      setLockState(prev => ({
        ...prev,
        mfaToken,
        requiresMFA: true
      }));
      return { requiresMFA: true, mfaToken };
    }

    // Verificar código MFA
    if (lockState.requiresMFA && mfaCode && mfaCode !== lockState.mfaToken) {
      return { error: 'Código MFA incorrecto' };
    }

    const lockId = generateLockId();
    const lockExpiry = new Date();
    lockExpiry.setHours(lockExpiry.getHours() + LOCK_EXPIRY_HOURS);

    const newState: EmergencyLockState = {
      isLocked: true,
      lockedBy,
      lockedAt: new Date().toISOString(),
      reason: reason || 'Sistema bloqueado por seguridad',
      lockId,
      requiresMFA: true,
      mfaToken: undefined,
      lockExpiry: lockExpiry.toISOString()
    };
    
    setLockState(newState);
    console.log('🚨 SISTEMA BLOQUEADO:', newState);
    
    // Enviar notificación de seguridad (en producción)
    sendSecurityNotification('LOCK', newState);
    
    return { success: true };
  };

  const unlockSystem = (unlockedBy: string, mfaCode?: string) => {
    // Verificar MFA si está habilitado
    if (lockState.requiresMFA && !mfaCode) {
      const mfaToken = generateMFAToken();
      setLockState(prev => ({
        ...prev,
        mfaToken,
        requiresMFA: true
      }));
      return { requiresMFA: true, mfaToken };
    }

    // Verificar código MFA
    if (lockState.requiresMFA && mfaCode && mfaCode !== lockState.mfaToken) {
      return { error: 'Código MFA incorrecto' };
    }

    const newState: EmergencyLockState = {
      isLocked: false,
      lockedBy: null,
      lockedAt: null,
      reason: null,
      lockId: null,
      requiresMFA: true,
      mfaToken: undefined,
      lockExpiry: null
    };
    
    setLockState(newState);
    console.log('✅ SISTEMA DESBLOQUEADO por:', unlockedBy);
    
    // Enviar notificación de seguridad (en producción)
    sendSecurityNotification('UNLOCK', { unlockedBy, timestamp: new Date().toISOString() });
    
    return { success: true };
  };

  const canManageLock = (userEmail: string) => {
    // Solo los maestros fundadores pueden gestionar el bloqueo
    return userEmail === 'coeurdeluke.js@gmail.com' || userEmail === 'infocryptoforce@gmail.com';
  };

  // Función para enviar notificaciones de seguridad (placeholder)
  const sendSecurityNotification = (action: 'LOCK' | 'UNLOCK', data: any) => {
    // En producción, aquí enviarías notificaciones a:
    // - Email de administradores
    // - Slack/Discord webhook
    // - Sistema de monitoreo
    // - Logs de seguridad
    console.log(`🔔 Notificación de seguridad: ${action}`, data);
  };

  // Verificar si el bloqueo está próximo a expirar
  const isLockExpiringSoon = () => {
    if (!lockState.lockExpiry) return false;
    const expiry = new Date(lockState.lockExpiry);
    const now = new Date();
    const hoursUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilExpiry <= 2; // Últimas 2 horas
  };

  return {
    lockState,
    lockSystem,
    unlockSystem,
    canManageLock,
    isLockExpiringSoon
  };
};