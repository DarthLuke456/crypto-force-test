'use client';

import { useSafeAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

export default function AuthDebugger() {
  const { user, userData, loading, isReady } = useSafeAuth();
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const addLog = (message: string) => {
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    };

    addLog(`Auth State Changed - Loading: ${loading}, IsReady: ${isReady}`);
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
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg max-w-md max-h-64 overflow-y-auto text-xs">
      <h3 className="font-bold mb-2">🔍 Auth Debug</h3>
      <div className="space-y-1">
        <div>Loading: {loading ? '✅' : '❌'}</div>
        <div>IsReady: {isReady ? '✅' : '❌'}</div>
        <div>User: {user ? '✅' : '❌'}</div>
        <div>UserData: {userData ? '✅' : '❌'}</div>
        {userData && (
          <div>Level: {userData.user_level}</div>
        )}
      </div>
      <div className="mt-2 max-h-32 overflow-y-auto">
        {logs.slice(-5).map((log, index) => (
          <div key={index} className="text-gray-300 text-xs">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
