'use client';

import { useEffect } from 'react';

export default function Dashboard() {
  useEffect(() => {
    // Redirección directa usando window.location
    window.location.href = '/dashboard/iniciado';
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec4d58] mx-auto mb-4"></div>
        <p className="text-white">Redirigiendo al dashboard...</p>
      </div>
    </div>
  );
}