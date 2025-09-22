'use client';

import React from 'react';
import { useSafeAuth } from '@/context/AuthContext-offline';
import { getUserProfilePath } from '@/utils/dashboardUtils';

export default function TestProfilePage() {
  const { userData } = useSafeAuth();

  const handleProfileAccess = () => {
    console.log('🧪 [TEST PROFILE] Click en botón de prueba');
    console.log('🧪 [TEST PROFILE] userData:', userData);
    
    const profilePath = getUserProfilePath(userData);
    console.log('🧪 [TEST PROFILE] ProfilePath calculado:', profilePath);
    
    console.log('🧪 [TEST PROFILE] Redirigiendo a perfil...');
    window.location.href = profilePath;
  };

  const handleMaestroAccess = () => {
    console.log('🧪 [TEST MAESTRO] Click en botón de prueba');
    console.log('🧪 [TEST MAESTRO] Redirigiendo a maestro...');
    window.location.href = '/dashboard/maestro';
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8 max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Test Profile Access</h1>
        
        <div className="space-y-4">
          <div className="text-white">
            <p><strong>User Data:</strong></p>
            <pre className="text-xs bg-[#0a0a0a] p-2 rounded overflow-auto">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
          
          <button
            onClick={handleProfileAccess}
            className="w-full px-4 py-3 bg-[#ec4d58] hover:bg-[#d43d48] text-white rounded-lg transition-all duration-200 font-medium"
          >
            Test Profile Access
          </button>
          
          <button
            onClick={handleMaestroAccess}
            className="w-full px-4 py-3 bg-[#8a8a8a] hover:bg-[#6a6a6a] text-white rounded-lg transition-all duration-200 font-medium"
          >
            Test Maestro Dashboard Access
          </button>
          
          <button
            onClick={() => window.location.href = '/login/dashboard-selection'}
            className="w-full px-4 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-all duration-200 font-medium"
          >
            Back to Dashboard Selection
          </button>
        </div>
      </div>
    </div>
  );
}
