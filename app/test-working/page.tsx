'use client';

import { useEffect, useState } from 'react';
import { useSafeAuth } from '@/context/AuthContext-working';

export default function TestWorkingPage() {
  const { user, userData, loading, isReady } = useSafeAuth();
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const newLogs = [
      `🔍 [TEST-WORKING] Página renderizada`,
      `🔍 [TEST-WORKING] Estado del contexto: ${JSON.stringify({ user: !!user, userData: !!userData, loading, isReady })}`,
      `🔍 [TEST-WORKING] useEffect ejecutado`,
      `🔍 [TEST-WORKING] Usuario: ${user?.email || 'No hay usuario'}`,
      `🔍 [TEST-WORKING] Datos: ${userData ? 'Cargados' : 'No cargados'}`,
      `🔍 [TEST-WORKING] Loading: ${loading}`,
      `🔍 [TEST-WORKING] Ready: ${isReady}`
    ];
    setLogs(newLogs);
  }, [user, userData, loading, isReady]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Test Working Context</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Estado del Contexto</h2>
          <p><strong>Loading:</strong> {loading ? 'Sí' : 'No'}</p>
          <p><strong>Ready:</strong> {isReady ? 'Sí' : 'No'}</p>
          <p><strong>Usuario:</strong> {user ? user.email : 'No hay usuario'}</p>
          <p><strong>Datos del usuario:</strong> {userData ? JSON.stringify(userData, null, 2) : 'No hay datos'}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Logs de Debugging</h2>
          <div className="space-y-1">
            {logs.map((log, index) => (
              <p key={index} className="text-sm text-gray-300">{log}</p>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Acceso a Tribunal Imperial</h2>
          <p>Si el contexto funciona, deberías poder acceder a:</p>
          <a 
            href="/dashboard/maestro/courses/tribunal-imperial" 
            className="text-blue-400 hover:text-blue-300 underline"
          >
            /dashboard/maestro/courses/tribunal-imperial
          </a>
        </div>
      </div>
    </div>
  );
}
