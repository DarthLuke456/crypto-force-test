'use client';

import { useSafeAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

export default function DebugAuthPage() {
  const { userData, loading, isReady, user } = useSafeAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const info = {
      timestamp: new Date().toISOString(),
      loading,
      isReady,
      user: user ? {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      } : null,
      userData: userData ? {
        id: userData.id,
        email: userData.email,
        user_level: userData.user_level,
        nickname: userData.nickname
      } : null
    };
    
    setDebugInfo(info);
    console.log('🔍 DEBUG AUTH:', info);
  }, [loading, isReady, user, userData]);

  return (
    <div className="min-h-screen bg-[#121212] p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Debug Authentication</h1>
      
      <div className="bg-[#1a1a1a] p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-white mb-4">Estado Actual:</h2>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="text-gray-400 w-32">Loading:</span>
            <span className={loading ? 'text-red-400' : 'text-green-400'}>{loading ? 'true' : 'false'}</span>
          </div>
          <div className="flex">
            <span className="text-gray-400 w-32">IsReady:</span>
            <span className={isReady ? 'text-green-400' : 'text-red-400'}>{isReady ? 'true' : 'false'}</span>
          </div>
          <div className="flex">
            <span className="text-gray-400 w-32">User:</span>
            <span className={user ? 'text-green-400' : 'text-red-400'}>{user ? 'Present' : 'null'}</span>
          </div>
          <div className="flex">
            <span className="text-gray-400 w-32">UserData:</span>
            <span className={userData ? 'text-green-400' : 'text-red-400'}>{userData ? 'Present' : 'null'}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] p-6 rounded-lg mt-6">
        <h2 className="text-lg font-semibold text-white mb-4">Información Detallada:</h2>
        <pre className="text-xs text-gray-300 overflow-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      <div className="bg-[#1a1a1a] p-6 rounded-lg mt-6">
        <h2 className="text-lg font-semibold text-white mb-4">Acciones:</h2>
        <div className="space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Recargar Página
          </button>
          <button
            onClick={() => window.location.href = '/login/signin'}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Ir a Login
          </button>
          <button
            onClick={() => window.location.href = '/dashboard/maestro/courses/tribunal-imperial'}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Ir a Tribunal Imperial
          </button>
        </div>
      </div>
    </div>
  );
}
