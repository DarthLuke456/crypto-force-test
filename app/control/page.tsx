'use client';

import { useSafeAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function ControlPage() {
  const { user, userData, loading, isReady, clearSession } = useSafeAuth();
  const [status, setStatus] = useState('');

  const handleClearSession = async () => {
    setStatus('Limpiando sesión...');
    try {
      await clearSession();
      setStatus('Sesión limpiada exitosamente');
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  const navigateTo = (path: string) => {
    setStatus(`Navegando a ${path}...`);
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
      <div className="bg-[#2a2a2a] p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          🎮 Control Manual
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Estado Actual */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Estado Actual:</h2>
            <div className="space-y-2 text-[#a0a0a0]">
              <p>Loading: {loading ? 'Sí' : 'No'}</p>
              <p>Ready: {isReady ? 'Sí' : 'No'}</p>
              <p>Usuario: {user ? `${user.email}` : 'No autenticado'}</p>
              <p>UserData: {userData ? `${userData.nickname} (Nivel ${userData.user_level})` : 'No disponible'}</p>
            </div>
          </div>

          {/* Acciones de Sesión */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Sesión:</h2>
            <div className="space-y-2">
              <button
                onClick={handleClearSession}
                className="w-full py-2 px-4 bg-[#ec4d58] text-white rounded hover:bg-[#d93c47] transition-colors"
              >
                🧹 Limpiar Sesión
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2 px-4 bg-[#6a6a6a] text-white rounded hover:bg-[#5a5a5a] transition-colors"
              >
                🔄 Recargar Página
              </button>
            </div>
          </div>

          {/* Navegación */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Navegación:</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigateTo('/')}
                className="w-full py-2 px-4 bg-[#4a4a4a] text-white rounded hover:bg-[#3a3a3a] transition-colors"
              >
                🏠 Inicio
              </button>
              
              <button
                onClick={() => navigateTo('/signup')}
                className="w-full py-2 px-4 bg-[#4a4a4a] text-white rounded hover:bg-[#3a3a3a] transition-colors"
              >
                📝 Signup
              </button>
              
              <button
                onClick={() => navigateTo('/login/signin')}
                className="w-full py-2 px-4 bg-[#4a4a4a] text-white rounded hover:bg-[#3a3a3a] transition-colors"
              >
                🔐 Login
              </button>
            </div>
          </div>

          {/* Dashboards */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Dashboards:</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigateTo('/login/dashboard-selection')}
                className="w-full py-2 px-4 bg-[#4a4a4a] text-white rounded hover:bg-[#3a3a3a] transition-colors"
              >
                🎯 Dashboard Selection
              </button>
              
              <button
                onClick={() => navigateTo('/dashboard/iniciado')}
                className="w-full py-2 px-4 bg-[#4a4a4a] text-white rounded hover:bg-[#3a3a3a] transition-colors"
              >
                🛡️ Iniciado
              </button>
              
              <button
                onClick={() => navigateTo('/dashboard/maestro')}
                className="w-full py-2 px-4 bg-[#4a4a4a] text-white rounded hover:bg-[#3a3a3a] transition-colors"
              >
                👑 Maestro
              </button>
            </div>
          </div>
        </div>

        {/* Status */}
        {status && (
          <div className="mt-6 bg-[#1a1a1a] p-4 rounded-lg">
            <h2 className="text-white font-semibold mb-2">Status:</h2>
            <p className="text-[#a0a0a0]">{status}</p>
          </div>
        )}

        {/* Información */}
        <div className="mt-6 text-center text-[#6a6a6a] text-sm">
          <p>🚫 Todas las redirecciones automáticas están deshabilitadas</p>
          <p>🎮 Usa esta página para navegar manualmente</p>
        </div>
      </div>
    </div>
  );
}

