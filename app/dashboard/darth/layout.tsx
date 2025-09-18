'use client';

import { useEffect, useState } from 'react';
import { useSafeAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Lista de emails autorizados para acceder a la dashboard de Darth
const DARTH_AUTHORIZED_EMAILS = [
  'infocryptoforce@gmail.com',
  'coeurdeluke.js@gmail.com'
];

function DarthLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData, isReady } = useSafeAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (isReady) {
        if (!userData) {
          console.log('🚫 No hay usuario, redirigiendo a login');
          router.replace('/login/signin');
          return;
        }

        console.log('👤 DARTH LAYOUT: Verificando acceso para:', userData.email);
        console.log('📋 DARTH LAYOUT: Emails autorizados:', DARTH_AUTHORIZED_EMAILS);

        // Verificar si el email está en la lista de autorizados
        const userEmail = userData.email.toLowerCase().trim();
        const clientAuthorized = DARTH_AUTHORIZED_EMAILS.includes(userEmail);

        console.log('🔍 DARTH LAYOUT: Email procesado:', userEmail);
        console.log('✅ DARTH LAYOUT: ¿Autorizado por lista?:', clientAuthorized);

        // Verificar autorización real para producción
        if (!clientAuthorized) {
          console.log('🚫 DARTH LAYOUT: Acceso denegado - Email no autorizado para darth');
          router.replace('/login/dashboard-selection');
          return;
        }

        console.log('✅ DARTH LAYOUT: Acceso autorizado por email');
        setIsAuthorized(true);

        setIsLoading(false);
      }
    };

    checkAccess();
  }, [isReady, userData, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <LoadingSpinner message="Verificando acceso de darth..." />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Acceso Denegado</div>
          <p className="text-gray-400">No tienes permisos para acceder al dashboard de darth.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Main Content Area - El sidebar principal se maneja desde el layout general */}
      <main className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-none scrollbar-darth">
        {children}
      </main>
    </div>
  );
}

export default function DarthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DarthLayoutContent>
      {children}
    </DarthLayoutContent>
  );
}
