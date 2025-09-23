'use client';

import { useSafeAuth } from '@/context/AuthContext-offline';
import { MAESTRO_AUTHORIZED_EMAILS } from '@/utils/dashboardUtils';

export default function TestMaestroPage() {
  const { userData, isReady } = useSafeAuth();

  // Simple access check
  const hasAccess = () => {
    if (!userData) return false;
    
    const userEmail = userData.email.toLowerCase().trim();
    const isAuthorizedEmail = MAESTRO_AUTHORIZED_EMAILS.includes(userEmail);
    const isLevel0 = userData.user_level === 0;
    const isLevel6 = userData.user_level === 6;
    
    return isAuthorizedEmail || isLevel0 || isLevel6;
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">No User Data</div>
          <button
            onClick={() => window.location.href = '/login/signin'}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess()) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Access Denied</div>
          <div className="text-gray-400 mb-4">
            <p>Email: {userData.email}</p>
            <p>Level: {userData.user_level}</p>
            <p>Authorized: {MAESTRO_AUTHORIZED_EMAILS.includes(userData.email.toLowerCase().trim()) ? 'Yes' : 'No'}</p>
          </div>
          <button
            onClick={() => window.location.href = '/login/dashboard-selection'}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Dashboard Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Test Maestro Page</h1>
        <div className="bg-green-600 text-white p-4 rounded mb-4">
          ✅ SUCCESS: You have access to Maestro dashboard!
        </div>
        <div className="bg-[#1a1a1a] p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">User Info</h2>
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
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={() => window.location.href = '/login/dashboard-selection'}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 mr-4"
          >
            Back to Dashboard Selection
          </button>
          <button
            onClick={() => window.location.href = '/debug-auth'}
            className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Debug Auth
          </button>
        </div>
      </div>
    </div>
  );
}
