'use client';

import { useSafeAuth } from '@/context/AuthContext-offline';
import { MAESTRO_AUTHORIZED_EMAILS } from '@/utils/dashboardUtils';

export default function DebugAuthPage() {
  const { user, userData, loading, isReady } = useSafeAuth();

  return (
    <div className="min-h-screen bg-[#121212] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Debug Authentication</h1>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth Context Status */}
      <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Auth Context Status</h2>
        <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Loading:</span>
                <span className={loading ? 'text-red-400' : 'text-green-400'}>{loading ? 'Yes' : 'No'}</span>
          </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Is Ready:</span>
                <span className={isReady ? 'text-green-400' : 'text-red-400'}>{isReady ? 'Yes' : 'No'}</span>
          </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Has User:</span>
                <span className={user ? 'text-green-400' : 'text-red-400'}>{user ? 'Yes' : 'No'}</span>
          </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Has UserData:</span>
                <span className={userData ? 'text-green-400' : 'text-red-400'}>{userData ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

          {/* User Data */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">User Data</h2>
            {userData ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{userData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Nickname:</span>
                  <span className="text-white">{userData.nickname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">User Level:</span>
                  <span className="text-white">{userData.user_level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">User Level Type:</span>
                  <span className="text-white">{typeof userData.user_level}</span>
                </div>
              </div>
            ) : (
              <p className="text-red-400">No user data available</p>
            )}
          </div>

          {/* Authorization Check */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Authorization Check</h2>
            {userData ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email in MAESTRO_AUTHORIZED_EMAILS:</span>
                  <span className={MAESTRO_AUTHORIZED_EMAILS.includes(userData.email.toLowerCase().trim()) ? 'text-green-400' : 'text-red-400'}>
                    {MAESTRO_AUTHORIZED_EMAILS.includes(userData.email.toLowerCase().trim()) ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Is Level 0:</span>
                  <span className={userData.user_level === 0 ? 'text-green-400' : 'text-red-400'}>
                    {userData.user_level === 0 ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Is Level 6:</span>
                  <span className={userData.user_level === 6 ? 'text-green-400' : 'text-red-400'}>
                    {userData.user_level === 6 ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Authorized Emails:</span>
                  <span className="text-white text-xs">{MAESTRO_AUTHORIZED_EMAILS.join(', ')}</span>
                </div>
              </div>
            ) : (
              <p className="text-red-400">No user data to check</p>
            )}
      </div>

          {/* Navigation Test */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Navigation Test</h2>
            <div className="space-y-3">
          <button
                onClick={() => window.location.href = '/login/dashboard-selection'}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
                Go to Dashboard Selection
          </button>
          <button
                onClick={() => window.location.href = '/dashboard/maestro'}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
                Go to Maestro Dashboard
          </button>
          <button
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.reload();
                }}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Clear Storage & Reload
          </button>
            </div>
          </div>
        </div>

        {/* Raw Data */}
        <div className="mt-8 bg-[#1a1a1a] p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Raw Data</h2>
          <pre className="text-xs text-gray-400 overflow-auto">
            {JSON.stringify({ user, userData, loading, isReady }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}