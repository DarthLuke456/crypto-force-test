'use client';

import { useSafeAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function ClearSessionPage() {
  const { user, loading } = useSafeAuth();
  const [status, setStatus] = useState('');

  const handleClearSession = async () => {
    setStatus('Limpiando sesión...');
    try {
      await supabase.auth.signOut();
      setStatus('Sesión limpiada exitosamente, recargando...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  const handleManualClear = () => {
    setStatus('Limpiando manualmente...');
    
    // Limpiar localStorage
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      
      // Limpiar cookies de Supabase
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      setStatus('Limpieza manual completada, recargando...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
      <div className="bg-[#2a2a2a] p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          🧹 Debug: Limpiar Sesión
        </h1>
        
        <div className="space-y-4">
          <div className="bg-[#1a1a1a] p-4 rounded-lg">
            <h2 className="text-white font-semibold mb-2">Estado Actual:</h2>
            <p className="text-[#a0a0a0]">Loading: {loading ? 'Sí' : 'No'}</p>
            <p className="text-[#a0a0a0]">Usuario: {user ? `${user.email}` : 'No autenticado'}</p>
          </div>

          <div className="bg-[#1a1a1a] p-4 rounded-lg">
            <h2 className="text-white font-semibold mb-2">Acciones:</h2>
            <div className="space-y-2">
              <button
                onClick={handleClearSession}
                className="w-full py-2 px-4 bg-[#ec4d58] text-white rounded hover:bg-[#d93c47] transition-colors"
              >
                Limpiar Sesión (AuthContext)
              </button>
              
              <button
                onClick={handleManualClear}
                className="w-full py-2 px-4 bg-[#6a6a6a] text-white rounded hover:bg-[#5a5a5a] transition-colors"
              >
                Limpiar Manualmente (LocalStorage)
              </button>
            </div>
          </div>

          {status && (
            <div className="bg-[#1a1a1a] p-4 rounded-lg">
              <h2 className="text-white font-semibold mb-2">Status:</h2>
              <p className="text-[#a0a0a0]">{status}</p>
            </div>
          )}

          <div className="text-center">
            <a 
              href="/"
              className="text-[#6a6a6a] hover:text-[#a0a0a0] transition-colors"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

