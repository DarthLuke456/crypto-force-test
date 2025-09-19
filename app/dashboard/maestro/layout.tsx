'use client';

import { useEffect, useState } from 'react';
import { useSafeAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import MaestroSidebar from '@/components/layout/MaestroSidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { MaestroSidebarProvider, useMaestroSidebar } from './MaestroSidebarContext';

// Lista de emails autorizados para acceder a la dashboard de Maestro
const MAESTRO_AUTHORIZED_EMAILS = [
  'infocryptoforce@gmail.com',
  'coeurdeluke.js@gmail.com'
];

function MaestroLayoutContent({
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
      console.log('🔍 MAESTRO LAYOUT: checkAccess ejecutándose...', {
        isReady,
        hasUserData: !!userData,
        userEmail: userData?.email,
        userLevel: userData?.user_level,
        timestamp: new Date().toISOString()
      });

      if (isReady) {
        if (!userData) {
          console.log('🚫 MAESTRO LAYOUT: No hay usuario, redirigiendo a login');
          router.replace('/login/signin');
          return;
        }

        console.log('👤 MAESTRO LAYOUT: Verificando acceso para:', userData.email);
        console.log('📋 MAESTRO LAYOUT: Emails autorizados:', MAESTRO_AUTHORIZED_EMAILS);

        // Verificar si el email está en la lista de autorizados
        const userEmail = userData.email.toLowerCase().trim();
        const clientAuthorized = MAESTRO_AUTHORIZED_EMAILS.includes(userEmail);

        console.log('🔍 MAESTRO LAYOUT: Email procesado:', userEmail);
        console.log('✅ MAESTRO LAYOUT: ¿Autorizado por lista?:', clientAuthorized);

        // Verificar autorización real para producción
        if (!clientAuthorized) {
          console.log('🚫 MAESTRO LAYOUT: Acceso denegado - Email no autorizado para maestro');
          // En lugar de redirigir, mostrar mensaje de error
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        console.log('✅ MAESTRO LAYOUT: Acceso autorizado por email');
        setIsAuthorized(true);
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [isReady, userData, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <LoadingSpinner message="Verificando acceso de maestro..." />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Acceso Denegado</div>
          <p className="text-gray-400 mb-2">No tienes permisos para acceder al dashboard de maestro.</p>
          {userData && (
            <div className="text-gray-500 text-sm mb-4">
              <p>Email: {userData.email}</p>
              <p>Nivel: {userData.user_level}</p>
              <p>Emails autorizados: {MAESTRO_AUTHORIZED_EMAILS.join(', ')}</p>
            </div>
          )}
          <button 
            onClick={() => window.location.href = '/login/dashboard-selection'}
            className="px-6 py-3 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d43d48] transition-colors"
          >
            Volver a Selección de Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] mobile-container">
      {/* Layout container con flexbox - Responsive */}
      <div className="flex min-h-screen">
        {/* Sidebar - Responsive con ancho fijo */}
        <div className="flex-shrink-0">
          <MaestroSidebar />
        </div>
        
        {/* Main Content Area - Responsive con overflow controlado */}
        <div className="flex-1 min-w-0 transition-all duration-300 overflow-hidden">
          <main 
            className="min-h-screen p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 w-full max-w-none main-content-maestro"
          >
            <div className="w-full max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>

    </div>
  );
}

export default function MaestroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MaestroSidebarProvider>
      <MaestroLayoutContent>
        {children}
      </MaestroLayoutContent>
    </MaestroSidebarProvider>
  );
}
