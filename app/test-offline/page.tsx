'use client';

import { useSafeAuth } from '@/context/AuthContext-minimal';

export default function TestOfflinePage() {
  const { user, userData, loading, isReady } = useSafeAuth();

  console.log('🔍 [TEST-OFFLINE] Estado actual:', { user, userData, loading, isReady });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Test Offline Authentication</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Estado de Autenticación</h2>
          <p><strong>Loading:</strong> {loading ? 'Sí' : 'No'}</p>
          <p><strong>Ready:</strong> {isReady ? 'Sí' : 'No'}</p>
          <p><strong>Usuario:</strong> {user ? user.email : 'No hay usuario'}</p>
          <p><strong>Datos del usuario:</strong> {userData ? JSON.stringify(userData, null, 2) : 'No hay datos'}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Controles de Test</h2>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mr-2"
          >
            Recargar Página
          </button>
          <button 
            onClick={() => {
              if (typeof window !== 'undefined' && (window as any).simulateLogin) {
                (window as any).simulateLogin('coeurdeluke.js@gmail.com');
              }
            }}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            Simular Login
          </button>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Logs de Consola</h2>
          <p>Revisa la consola del navegador para ver los logs de debugging.</p>
          <p>Deberías ver mensajes que empiecen con "🔍 [OFFLINE-AUTH]" y "✅ [OFFLINE-AUTH]"</p>
        </div>
      </div>
    </div>
  );
}
