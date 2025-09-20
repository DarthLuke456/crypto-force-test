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

    // Esperar a que la autenticación esté lista antes de verificar el acceso
    if (!isReady) {
      console.log('⏳ Tribunal Layout - Autenticación no lista, esperando...');
      return;
    }

    // Verificar acceso al TRIBUNAL IMPERIAL
    if (!userData || !canUserAccessTribunal(userData.user_level)) {
      console.log('❌ Tribunal Layout - Acceso denegado, redirigiendo a Iniciado');
      router.push('/dashboard/iniciado');
      return;
    }

    console.log('✅ Tribunal Layout - Acceso permitido');
  }, [userData, router, loading, isReady]);

  // Si no tiene acceso, no renderizar nada
  // También, no renderizar si la autenticación no está lista para evitar flashes
  if (!isReady || !userData || !canUserAccessTribunal(userData.user_level)) {
    return null;
  }

  // Renderizar solo el contenido, sin contenedor adicional
  // El layout principal del Darth se encargará de la sidebar y el contenedor
  return <>{children}</>;
}
