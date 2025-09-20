'use client';

import { useEffect, useState } from 'react';
import { useSafeAuth } from '@/context/AuthContext-offline';
import { useRouter } from 'next/navigation';
import MaestroSidebar from '@/components/layout/MaestroSidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { MaestroSidebarProvider, useMaestroSidebar } from './MaestroSidebarContext';
import { layoutLog } from '@/lib/logger';

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
  const [accessChecked, setAccessChecked] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Timeout para evitar carga infinita
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!accessChecked) {
        console.log('⏰ MAESTRO LAYOUT: Timeout alcanzado, forzando verificación');
        setTimeoutReached(true);
        setIsLoading(false);
        setAccessChecked(true);
      }
    }, 5000); // 5 segundos

    return () => clearTimeout(timeout);
  }, [accessChecked]);

  useEffect(() => {
    const checkAccess = async () => {
      console.log('🔍 MAESTRO LAYOUT: useEffect ejecutado', {
        isReady,
        hasUserData: !!userData,
        userEmail: userData?.email,
        accessChecked,
        timeoutReached,
        timestamp: new Date().toISOString()
      });

      // Si ya se verificó el acceso, no hacer nada
      if (accessChecked) {
        console.log('🔍 MAESTRO LAYOUT: Acceso ya verificado, saltando');
        return;
      }

      // Si se alcanzó el timeout, permitir acceso para usuarios autorizados
      if (timeoutReached) {
        console.log('⏰ MAESTRO LAYOUT: Timeout alcanzado, verificando acceso básico');
        
        if (!userData) {
          console.log('🚫 MAESTRO LAYOUT: No hay usuario, redirigiendo a login');
          router.replace('/login/signin');
          return;
        }

        // Verificar si el email está en la lista de autorizados
        const userEmail = userData.email.toLowerCase().trim();
        const clientAuthorized = MAESTRO_AUTHORIZED_EMAILS.includes(userEmail);
        
        if (clientAuthorized) {
          console.log('✅ MAESTRO LAYOUT: Acceso autorizado por timeout (email autorizado)');
          setIsAuthorized(true);
          setIsLoading(false);
        } else {
          console.log('🚫 MAESTRO LAYOUT: Acceso denegado por timeout (email no autorizado)');
          setIsAuthorized(false);
          setIsLoading(false);
        }
        return;
      }

      // Si no está listo, esperar
      if (!isReady) {
        console.log('🔍 MAESTRO LAYOUT: Aún no está listo, esperando...');
        return;
      }

      // Si no hay datos del usuario, redirigir a login
      if (!userData) {
        console.log('🚫 MAESTRO LAYOUT: No hay usuario, redirigiendo a login');
        router.replace('/login/signin');
        setAccessChecked(true);
        return;
      }

      // Verificar si el email está en la lista de autorizados
      const userEmail = userData.email.toLowerCase().trim();
      const clientAuthorized = MAESTRO_AUTHORIZED_EMAILS.includes(userEmail);

      console.log('🔍 MAESTRO LAYOUT: Verificando acceso:', {
        userEmail: userData.email,
        userEmailLower: userEmail,
        authorizedEmails: MAESTRO_AUTHORIZED_EMAILS,
        isAuthorized: clientAuthorized,
        userLevel: userData.user_level,
        userLevelType: typeof userData.user_level,
        timestamp: new Date().toISOString()
      });

      console.log('🔍 MAESTRO LAYOUT: Datos completos del usuario:', {
        userData: userData,
        userDataKeys: Object.keys(userData),
        userDataStringified: JSON.stringify(userData, null, 2)
      });

      // Permitir acceso si es autorizado O si es nivel 6 (maestro)
      // Verificar tanto número como string para mayor compatibilidad
      const isLevel6 = userData.user_level === 6 || String(userData.user_level) === '6' || userData.user_level === 6.0;
      const hasAccess = clientAuthorized || isLevel6;
      
      console.log('🔍 MAESTRO LAYOUT: Verificación de nivel:', {
        userLevel: userData.user_level,
        isLevel6: isLevel6,
        clientAuthorized: clientAuthorized,
        hasAccess: hasAccess
      });

      if (!hasAccess) {
        console.log('🚫 MAESTRO LAYOUT: Acceso denegado - Email no autorizado para maestro');
        setIsAuthorized(false);
        setIsLoading(false);
        setAccessChecked(true);
        return;
      }

      console.log('✅ MAESTRO LAYOUT: Acceso autorizado');
      setIsAuthorized(true);
      setIsLoading(false);
      setAccessChecked(true);
    };

    checkAccess();
  }, [isReady, userData, router, accessChecked, timeoutReached]);

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
        <div className="text-center max-w-md mx-auto p-6">
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
  layoutLog.info('MaestroLayout rendered');

  return (
    <MaestroSidebarProvider>
      <MaestroLayoutContent>
        {children}
      </MaestroLayoutContent>
    </MaestroSidebarProvider>
  );
}
