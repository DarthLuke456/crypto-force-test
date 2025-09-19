'use client';

import { useSafeAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

export default function DebugAuthSimple() {
  const { user, userData, loading, isReady } = useSafeAuth();
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const addLog = (message: string) => {
      setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    addLog(`Loading: ${loading}`);
    addLog(`IsReady: ${isReady}`);
    addLog(`User: ${user ? 'Present' : 'Null'}`);
    addLog(`UserData: ${userData ? 'Present' : 'Null'}`);
    
    if (user) {
      addLog(`User ID: ${user.id}`);
      addLog(`User Email: ${user.email}`);
    }
    
    if (userData) {
      addLog(`UserData Level: ${userData.user_level}`);
      addLog(`UserData Email: ${userData.email}`);
    }
  }, [user, userData, loading, isReady]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">🔍 Debug Auth Simple</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Estado Actual</h2>
          <p><strong>Loading:</strong> {loading ? '✅ True' : '❌ False'}</p>
          <p><strong>IsReady:</strong> {isReady ? '✅ True' : '❌ False'}</p>
          <p><strong>User:</strong> {user ? '✅ Present' : '❌ Null'}</p>
          <p><strong>UserData:</strong> {userData ? '✅ Present' : '❌ Null'}</p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Datos del Usuario</h2>
          {user ? (
            <>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Created:</strong> {user.created_at}</p>
            </>
          ) : (
            <p>No hay usuario autenticado</p>
          )}
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-2">Datos de Usuario (Base de Datos)</h2>
        {userData ? (
          <>
            <p><strong>ID:</strong> {userData.id}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Nickname:</strong> {userData.nickname}</p>
            <p><strong>User Level:</strong> {userData.user_level}</p>
            <p><strong>Referral Code:</strong> {userData.referral_code}</p>
          </>
        ) : (
          <p>No hay datos de usuario en la base de datos</p>
        )}
      </div>

      <div className="bg-gray-800 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Logs de Debug</h2>
        <div className="max-h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="text-sm text-gray-300 mb-1">
              {log}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => window.location.href = '/dashboard/maestro/courses/tribunal-imperial'}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mr-4"
        >
          Ir a Tribunal Imperial
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
        >
          Recargar Página
        </button>
      </div>
    </div>
  );
}
