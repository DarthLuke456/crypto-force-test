'use client';

import { useEffect } from 'react';
import { useSafeAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function LogoutPage() {
  const { user } = useSafeAuth();

  useEffect(() => {
    const handleLogout = async () => {
      // Ejecutar logout usando Supabase directamente
      await supabase.auth.signOut();
      
      // Pequeña pausa para asegurar que el logout se complete
      setTimeout(() => {
        // Redirigir a la página principal
        window.location.href = 'https://thecryptoforce.com';
      }, 1000);
    };

    handleLogout();
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white font-inter flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-white/80">Cerrando sesión...</p>
        <p className="mt-2 text-sm text-white/60">Te redirigiremos a Crypto Force</p>
      </div>
    </div>
  );
}

