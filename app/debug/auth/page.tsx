'use client';

import { useState, useEffect } from 'react';
import { useSafeAuth } from '@/context/AuthContext-offline';
import { logger } from '@/lib/logger';

export default function AuthDebugPage() {
  const { user, userData, loading, isReady, error, retryAuth } = useSafeAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const updateLogs = () => {
      const allLogs = logger.getLogs();
      setLogs(allLogs.slice(-50)); // Mostrar últimos 50 logs
    };

    updateLogs();

    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(updateLogs, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const clearLogs = () => {
    logger.clear();
    setLogs([]);
  };

  const exportLogs = () => {
    const logsData = logger.exportLogs();
    const blob = new Blob([logsData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auth-logs-${new Date().toISOString().slice(0, 19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#121212] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Auth Debug Dashboard</h1>
        
        {/* Estado actual */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Estado Actual</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded ${
                autoRefresh 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              } text-white`}
            >
              {autoRefresh ? 'Pausar Auto-refresh' : 'Activar Auto-refresh'}
            </button>
            <button
              onClick={clearLogs}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Limpiar Logs
            </button>
            <button
              onClick={exportLogs}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Exportar Logs
            </button>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Logs ({logs.length})</h2>
          <div className="bg-black rounded p-4 h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-gray-500">No hay logs disponibles</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-2">
                  <span className="text-gray-500">[{log.timestamp}]</span>
                  <span className={`ml-2 ${
                    log.level === 0 ? 'text-gray-400' :
                    log.level === 1 ? 'text-blue-400' :
                    log.level === 2 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    [{log.component}]
                  </span>
                  <span className="ml-2 text-white">{log.message}</span>
                  {log.data && (
                    <div className="ml-4 text-gray-300">
                      <pre>{JSON.stringify(log.data, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
