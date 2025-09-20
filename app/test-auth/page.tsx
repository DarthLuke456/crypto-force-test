'use client';

import { useSafeAuth } from '@/context/AuthContext-v5';

export default function TestAuthPage() {
  const { user, userData, loading, isReady, error, retryAuth } = useSafeAuth();

  return (
    <div className="min-h-screen bg-[#121212] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Test de Autenticación</h1>
        
        {/* Estado actual */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Estado Actual</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Loading:</span>
                <span className={loading ? 'text-yellow-400' : 'text-green-400'}>
                  {loading ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ready:</span>
                <span className={isReady ? 'text-green-400' : 'text-red-400'}>
                  {isReady ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">User:</span>
                <span className={user ? 'text-green-400' : 'text-red-400'}>
                  {user ? 'Conectado' : 'No conectado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">UserData:</span>
                <span className={userData ? 'text-green-400' : 'text-red-400'}>
                  {userData ? 'Cargado' : 'No cargado'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Error:</span>
                <span className={error ? 'text-red-400' : 'text-green-400'}>
                  {error || 'Ninguno'}
                </span>
              </div>
              {user && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white text-sm">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ID:</span>
                    <span className="text-white text-xs">{user.id}</span>
                  </div>
                </>
              )}
              {userData && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nivel:</span>
                    <span className="text-white">{userData.user_level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nickname:</span>
                    <span className="text-white">{userData.nickname}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Controles</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={retryAuth}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reintentar Auth
            </button>
            <button
              onClick={() => window.location.href = '/login/signin'}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Ir a Login
            </button>
            <button
              onClick={() => window.location.href = '/dashboard/maestro'}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Ir a Maestro
            </button>
          </div>
        </div>

        {/* Información detallada */}
        {userData && (
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Datos del Usuario</h2>
            <div className="bg-black rounded p-4 font-mono text-sm">
              <pre>{JSON.stringify(userData, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
