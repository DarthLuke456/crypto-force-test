'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Clock, 
  AlertTriangle, 
  RefreshCw,
  Mail,
  Phone
} from 'lucide-react';

export default function MaintenancePage() {
  const [lockState, setLockState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Obtener estado del bloqueo
    const fetchLockState = async () => {
      try {
        const response = await fetch('/api/security/emergency-lock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'STATUS'
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          setLockState(data.lockState);
        }
      } catch (error) {
        console.error('Error obteniendo estado del bloqueo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLockState();
    
    // Verificar cada 30 segundos si el sistema se ha desbloqueado
    const interval = setInterval(fetchLockState, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec4d58] mx-auto mb-4"></div>
          <p className="text-white">Verificando estado del sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-[#2a2a2a] rounded-lg p-8 text-center">
          {/* Icono principal */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-red-400" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-white mb-4">
            🚨 Sistema en Mantenimiento
          </h1>

          {/* Descripción */}
          <p className="text-[#a0a0a0] mb-6">
            El sistema está temporalmente bloqueado por seguridad. 
            Solo está disponible el modo de solo lectura.
          </p>

          {/* Información del bloqueo */}
          {lockState && (
            <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6 text-left">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Información del Bloqueo
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#a0a0a0]">Bloqueado por:</span>
                  <span className="text-white font-medium">{lockState.lockedBy || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-[#a0a0a0]">Fecha y hora:</span>
                  <span className="text-white font-medium">
                    {lockState.lockedAt ? new Date(lockState.lockedAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
                
                {lockState.reason && (
                  <div className="flex justify-between">
                    <span className="text-[#a0a0a0]">Motivo:</span>
                    <span className="text-white font-medium">{lockState.reason}</span>
                  </div>
                )}
                
                {lockState.lockExpiry && (
                  <div className="flex justify-between">
                    <span className="text-[#a0a0a0]">Expira:</span>
                    <span className="text-white font-medium">
                      {new Date(lockState.lockExpiry).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Funciones disponibles */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
            <h3 className="text-green-400 font-semibold mb-2">✅ Funciones Disponibles</h3>
            <ul className="text-sm text-[#a0a0a0] space-y-1">
              <li>• Visualización de usuarios (solo lectura)</li>
              <li>• Consulta de información del sistema</li>
              <li>• Navegación básica</li>
            </ul>
          </div>

          {/* Funciones bloqueadas */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <h3 className="text-red-400 font-semibold mb-2">❌ Funciones Bloqueadas</h3>
            <ul className="text-sm text-[#a0a0a0] space-y-1">
              <li>• Creación de usuarios</li>
              <li>• Edición de usuarios</li>
              <li>• Eliminación de usuarios</li>
              <li>• Cualquier modificación de datos</li>
            </ul>
          </div>

          {/* Botón de actualización */}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-6 py-3 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d93c47] transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Verificar Estado del Sistema
          </button>

          {/* Información de contacto */}
          <div className="mt-8 pt-6 border-t border-[#4a4a4a]">
            <h3 className="text-white font-semibold mb-3">¿Necesitas ayuda?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-[#a0a0a0]">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>admin@cryptoforce.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Auto-refresh info */}
          <div className="mt-4 text-xs text-[#6a6a6a]">
            Esta página se actualiza automáticamente cada 30 segundos
          </div>
        </div>
      </div>
    </div>
  );
}
