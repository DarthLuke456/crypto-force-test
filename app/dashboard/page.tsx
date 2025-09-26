'use client';

import { useEffect } from 'react';
import { useSafeAuth } from '@/context/AuthContext-working';
import { getHighestLevelDashboard } from '@/utils/dashboardUtils';

export default function Dashboard() {
  const { userData, isReady } = useSafeAuth();

  useEffect(() => {
    if (isReady) {
      // Get the appropriate dashboard based on user level
      const dashboardPath = getHighestLevelDashboard(userData);
      console.log('🔍 Dashboard: Redirecting to:', dashboardPath);
      window.location.href = dashboardPath;
    }
  }, [isReady, userData]);

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec4d58] mx-auto mb-4"></div>
        <p className="text-white">Redirigiendo al dashboard...</p>
      </div>
    </div>
  );
}