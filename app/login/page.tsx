'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir automáticamente a la página de signin
    router.replace('/login/signin');
  }, [router]);

  // Mostrar un loading mientras se redirige
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ec4d58] mx-auto mb-4"></div>
        <p className="text-white text-lg">Redirigiendo al login...</p>
      </div>
    </div>
  );
}
