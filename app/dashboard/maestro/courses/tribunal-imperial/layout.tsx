'use client';

import { useSafeAuth } from '@/context/AuthContext-working';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { canUserAccessTribunal } from '@/lib/tribunal/permissions';

export default function TribunalImperialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData, loading, isReady } = useSafeAuth();
  const router = useRouter();

  useEffect(() => {
    // Debug: Log para entender qué está pasando
    console.log('🔍 Tribunal Layout - Debug:', {
      hasUserData: !!userData,
      userLevel: userData?.user_level,
      canAccess: userData ? canUserAccessTribunal(userData.user_level) : false,
      loading: loading,
      isReady: isReady,
      pathname: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
    });

    // Verificación simplificada para AuthContext offline
    if (userData && userData.email) {
      console.log('✅ Tribunal Layout - Usuario detectado, permitiendo acceso');
    } else if (!loading) {
      console.log('🚫 Tribunal Layout - No hay usuario, redirigiendo');
      router.replace('/login/dashboard-selection');
    }
  }, [userData, loading, router]);

  // Mostrar loading si no hay datos del usuario
  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ec4d58] mx-auto mb-4"></div>
          <p className="text-white mt-4">Cargando Tribunal Imperial...</p>
        </div>
      </div>
    );
  }

  // Renderizar solo el contenido, sin contenedor adicional
  // El layout principal del Maestro se encargará de la sidebar y el contenedor
  return <>{children}</>;
}
