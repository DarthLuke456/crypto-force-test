'use client';

import { useEffect } from 'react';
import { useSafeAuth } from '@/context/AuthContext-minimal';

export default function TestSimplePage() {
  console.log('🔍 [TEST-SIMPLE] Página TestSimple renderizando');
  
  const { user, userData, loading, isReady } = useSafeAuth();
  
  console.log('🔍 [TEST-SIMPLE] Estado del contexto:', { user, userData, loading, isReady });

  useEffect(() => {
    console.log('🔍 [TEST-SIMPLE] useEffect ejecutado');
    console.log('🔍 [TEST-SIMPLE] Estado en useEffect:', { user, userData, loading, isReady });
  }, [user, userData, loading, isReady]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Test Simple Context</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Estado del Contexto</h2>
          <p><strong>Loading:</strong> {loading ? 'Sí' : 'No'}</p>
          <p><strong>Ready:</strong> {isReady ? 'Sí' : 'No'}</p>
          <p><strong>Usuario:</strong> {user ? user.email : 'No hay usuario'}</p>
          <p><strong>Datos del usuario:</strong> {userData ? JSON.stringify(userData, null, 2) : 'No hay datos'}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Logs de Consola</h2>
          <p>Revisa la consola del navegador para ver los logs de debugging.</p>
          <p>Deberías ver mensajes que empiecen con "🔍 [SIMPLE-AUTH]" y "🔍 [TEST-SIMPLE]"</p>
        </div>
      </div>
    </div>
  );
}
