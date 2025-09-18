'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldOff, 
  AlertTriangle, 
  Lock, 
  Unlock,
  X,
  Check,
  Clock,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { useEmergencyLock } from '@/hooks/useEmergencyLock';

interface EmergencyLockButtonProps {
  userEmail: string;
  onLockChange?: (isLocked: boolean) => void;
}

export default function EmergencyLockButton({ userEmail, onLockChange }: EmergencyLockButtonProps) {
  const { lockState, lockSystem, unlockSystem, canManageLock, isLockExpiringSoon } = useEmergencyLock();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [lockReason, setLockReason] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMfaCode, setShowMfaCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mfaToken, setMfaToken] = useState<string | null>(null);

  // Solo mostrar si el usuario puede gestionar el bloqueo
  if (!canManageLock(userEmail)) {
    return null;
  }

  const handleLockToggle = () => {
    if (lockState.isLocked) {
      // Desbloquear
      setShowConfirmModal(true);
    } else {
      // Mostrar modal de confirmación para bloquear
      setShowConfirmModal(true);
    }
  };

  const handleConfirmAction = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      if (lockState.isLocked) {
        // Desbloquear
        const result = unlockSystem(userEmail, mfaCode || undefined);
        
        if (result.error) {
          setError(result.error);
          setIsProcessing(false);
          return;
        }
        
        if (result.requiresMFA) {
          setMfaToken(result.mfaToken || null);
          setError(null);
          setIsProcessing(false);
          return;
        }
        
        onLockChange?.(false);
        setTimeout(() => {
          setIsProcessing(false);
          setShowConfirmModal(false);
          setMfaCode('');
          setMfaToken(null);
        }, 1000);
      } else {
        // Bloquear
        const result = lockSystem(userEmail, lockReason, mfaCode || undefined);
        
        if (result.error) {
          setError(result.error);
          setIsProcessing(false);
          return;
        }
        
        if (result.requiresMFA) {
          setMfaToken(result.mfaToken || null);
          setError(null);
          setIsProcessing(false);
          return;
        }
        
        onLockChange?.(true);
        setTimeout(() => {
          setIsProcessing(false);
          setShowConfirmModal(false);
          setLockReason('');
          setMfaCode('');
          setMfaToken(null);
        }, 1000);
      }
    } catch (error) {
      setError('Error inesperado. Intenta nuevamente.');
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setLockReason('');
    setMfaCode('');
    setMfaToken(null);
    setError(null);
  };

  // Verificar si el bloqueo está próximo a expirar
  const lockExpiringSoon = isLockExpiringSoon();

  return (
    <>
      {/* Botón de emergencia */}
      <div className="relative">
        <button
          onClick={handleLockToggle}
          disabled={isProcessing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            lockState.isLocked
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
              : 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : lockState.isLocked ? (
            <Unlock className="w-4 h-4" />
          ) : (
            <Lock className="w-4 h-4" />
          )}
          {lockState.isLocked ? 'Desbloquear Sistema' : 'Bloqueo de Emergencia'}
        </button>

        {/* Indicadores de estado */}
        {lockState.isLocked && (
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        )}
        
        {lockExpiringSoon && (
          <div className="absolute -top-2 -left-2 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
        )}
      </div>

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2a2a2a] rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium text-white mb-2">
                  {lockState.isLocked ? '🔓 Desbloquear Sistema' : '🚨 Bloqueo de Emergencia'}
                </h3>
                
                {lockState.isLocked && (
                  <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-3 rounded-lg mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Información del Bloqueo</span>
                    </div>
                    <p className="text-sm mt-1">
                      Bloqueado por: <strong>{lockState.lockedBy}</strong>
                    </p>
                    <p className="text-sm">
                      Fecha: <strong>{lockState.lockedAt ? new Date(lockState.lockedAt).toLocaleString() : 'N/A'}</strong>
                    </p>
                    {lockState.reason && (
                      <p className="text-sm">
                        Motivo: <strong>{lockState.reason}</strong>
                      </p>
                    )}
                    {lockExpiringSoon && (
                      <p className="text-sm text-orange-400 mt-2">
                        ⚠️ El bloqueo expirará pronto
                      </p>
                    )}
                  </div>
                )}
                
                {!lockState.isLocked && (
                  <p className="text-sm text-[#a0a0a0] mb-4">
                    ¿Estás seguro de que quieres bloquear el sistema? Esto deshabilitará:
                  </p>
                )}
                
                {!lockState.isLocked && (
                  <ul className="text-xs text-[#6a6a6a] mb-4 space-y-1">
                    <li>• Creación de nuevos usuarios</li>
                    <li>• Edición de usuarios existentes</li>
                    <li>• Eliminación de usuarios</li>
                  </ul>
                )}
                
                {!lockState.isLocked && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                      Motivo del bloqueo (opcional):
                    </label>
                    <input
                      type="text"
                      value={lockReason}
                      onChange={(e) => setLockReason(e.target.value)}
                      placeholder="Ej: Mantenimiento del sistema"
                      className="w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border border-[#4a4a4a] focus:border-[#ec4d58] focus:outline-none"
                    />
                  </div>
                )}
                
                {/* Código MFA */}
                {mfaToken && (
                  <div className="mb-4">
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg mb-3">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        <span className="font-medium">Código de Verificación</span>
                      </div>
                      <p className="text-sm mt-1">
                        Ingresa el código de 6 dígitos que se envió a tu email:
                      </p>
                      <p className="text-lg font-mono font-bold mt-2">
                        {mfaToken}
                      </p>
                    </div>
                    
                    <div className="relative">
                      <input
                        type={showMfaCode ? "text" : "password"}
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value)}
                        placeholder="Código de 6 dígitos"
                        className="w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border border-[#4a4a4a] focus:border-[#ec4d58] focus:outline-none pr-10"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowMfaCode(!showMfaCode)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6a6a6a] hover:text-white"
                      >
                        {showMfaCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Error message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4" />
                      <span className="font-medium">Error</span>
                    </div>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-[#a0a0a0] hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={isProcessing || (mfaToken && mfaCode ? mfaCode.length !== 6 : false)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {lockState.isLocked ? 'Desbloqueando...' : 'Bloqueando...'}
                    </>
                  ) : (
                    <>
                      {lockState.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      {lockState.isLocked ? 'Desbloquear Sistema' : 'Bloquear Sistema'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner de estado bloqueado */}
      {lockState.isLocked && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-40">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="font-medium">
              🚨 SISTEMA BLOQUEADO - Solo lectura disponible
            </span>
            <span className="text-xs opacity-75">
              (Bloqueado por: {lockState.lockedBy} - {lockState.lockedAt ? new Date(lockState.lockedAt).toLocaleString() : 'N/A'})
            </span>
            {lockExpiringSoon && (
              <span className="text-xs bg-orange-500 px-2 py-1 rounded ml-2">
                ⚠️ Expira pronto
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}