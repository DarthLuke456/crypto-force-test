"use client";
import React, { useState } from 'react';
import { useSafeAuth } from '@/context/AuthContext';

export default function ReferralDebug() {
  const { userData } = useSafeAuth();
  const [debugData, setDebugData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testReferralStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/referrals/stats');
      const data = await response.json();
      
      setDebugData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const testDebugAPI = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/debug/referral-stats');
      const data = await response.json();
      
      setDebugData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#8A8A8A] mb-8">Debug de Referidos</h1>
        
        {/* Información del usuario */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Datos del Usuario</h2>
          <pre className="bg-[#0a0a0a] p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>

        {/* Botones de prueba */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={testReferralStats}
            disabled={loading}
            className="px-6 py-3 bg-[#8A8A8A] hover:bg-[#7a7a7a] disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            {loading ? 'Probando...' : 'Probar API de Referidos'}
          </button>
          
          <button
            onClick={testDebugAPI}
            disabled={loading}
            className="px-6 py-3 bg-[#3a3a3a] hover:bg-[#4a4a4a] disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            {loading ? 'Probando...' : 'Probar API Debug'}
          </button>
        </div>

        {/* Resultados */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
            <h3 className="font-semibold mb-2">Error:</h3>
            <p>{error}</p>
          </div>
        )}

        {debugData && (
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Resultados de la Prueba</h2>
            <pre className="bg-[#0a0a0a] p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
