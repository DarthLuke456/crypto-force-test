'use client';

import React from 'react';
import { useSafeAuth } from '@/context/AuthContext-offline';

export default function TestAuthPage() {
  const { user, userData, loading, isReady, login, logout } = useSafeAuth();

  const handleLogin = () => {
    login('coeurdeluke.js@gmail.com');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Test Authentication</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth Status */}
          <div className="bg-[#1e1e1e]/50 backdrop-blur-sm rounded-xl p-6 border border-[#2a2a2a]">
            <h2 className="text-xl font-semibold mb-4">Auth Status</h2>
            <div className="space-y-2">
              <p><span className="text-[#8a8a8a]">Loading:</span> {loading ? 'Yes' : 'No'}</p>
              <p><span className="text-[#8a8a8a]">Is Ready:</span> {isReady ? 'Yes' : 'No'}</p>
              <p><span className="text-[#8a8a8a]">Has User:</span> {user ? 'Yes' : 'No'}</p>
              <p><span className="text-[#8a8a8a]">Has UserData:</span> {userData ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {/* User Data */}
          <div className="bg-[#1e1e1e]/50 backdrop-blur-sm rounded-xl p-6 border border-[#2a2a2a]">
            <h2 className="text-xl font-semibold mb-4">User Data</h2>
            {userData ? (
              <div className="space-y-2">
                <p><span className="text-[#8a8a8a]">Email:</span> {userData.email}</p>
                <p><span className="text-[#8a8a8a]">Nickname:</span> {userData.nickname}</p>
                <p><span className="text-[#8a8a8a]">User Level:</span> {userData.user_level}</p>
                <p><span className="text-[#8a8a8a]">Referral Code:</span> {userData.referral_code}</p>
              </div>
            ) : (
              <p className="text-[#8a8a8a]">No user data available</p>
            )}
          </div>

          {/* Actions */}
          <div className="bg-[#1e1e1e]/50 backdrop-blur-sm rounded-xl p-6 border border-[#2a2a2a]">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-3">
              <button
                onClick={handleLogin}
                className="w-full px-4 py-2 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d43d48] transition-colors"
              >
                Login as coeurdeluke.js@gmail.com
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-[#8a8a8a] text-white rounded-lg hover:bg-[#6a6a6a] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Maestro Access Test */}
          <div className="bg-[#1e1e1e]/50 backdrop-blur-sm rounded-xl p-6 border border-[#2a2a2a]">
            <h2 className="text-xl font-semibold mb-4">Maestro Access Test</h2>
            {userData ? (
              (() => {
                const MAESTRO_AUTHORIZED_EMAILS = [
                  'infocryptoforce@gmail.com',
                  'coeurdeluke.js@gmail.com'
                ];
                
                const userEmail = userData.email.toLowerCase().trim();
                const clientAuthorized = MAESTRO_AUTHORIZED_EMAILS.includes(userEmail);
                const isLevel6 = userData.user_level === 6 || String(userData.user_level) === '6' || userData.user_level === 6.0;
                const isLevel0 = userData.user_level === 0 || String(userData.user_level) === '0' || userData.user_level === 0.0;
                const hasAccess = clientAuthorized || isLevel6 || isLevel0;
                
                return (
                  <div className="space-y-2">
                    <p><span className="text-[#8a8a8a]">Client Authorized:</span> {clientAuthorized ? 'Yes' : 'No'}</p>
                    <p><span className="text-[#8a8a8a]">Is Level 6:</span> {isLevel6 ? 'Yes' : 'No'}</p>
                    <p><span className="text-[#8a8a8a]">Is Level 0:</span> {isLevel0 ? 'Yes' : 'No'}</p>
                    <p className={`font-semibold ${hasAccess ? 'text-green-400' : 'text-red-400'}`}>
                      Has Maestro Access: {hasAccess ? 'YES' : 'NO'}
                    </p>
                  </div>
                );
              })()
            ) : (
              <p className="text-[#8a8a8a]">No user data to test</p>
            )}
          </div>
        </div>

        {/* Raw Data */}
        <div className="mt-8 bg-[#1e1e1e]/50 backdrop-blur-sm rounded-xl p-6 border border-[#2a2a2a]">
          <h2 className="text-xl font-semibold mb-4">Raw Data</h2>
          <pre className="text-sm text-[#8a8a8a] overflow-x-auto">
            {JSON.stringify({ user, userData, loading, isReady }, null, 2)}
          </pre>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          <a
            href="/dashboard/maestro"
            className="px-6 py-3 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d43d48] transition-colors"
          >
            Go to Maestro Dashboard
          </a>
          <a
            href="/login/dashboard-selection"
            className="px-6 py-3 bg-[#8a8a8a] text-white rounded-lg hover:bg-[#6a6a6a] transition-colors"
          >
            Go to Dashboard Selection
          </a>
        </div>
      </div>
    </div>
  );
}