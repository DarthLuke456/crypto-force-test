'use client';

import { useEffect, useState } from 'react';
import { useSafeAuth } from '@/context/AuthContext-v4';
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
  const { userData, isReady, loading, error, retryAuth } = useSafeAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessCheckComplete, setAccessCheckComplete] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  layoutLog.info('MaestroLayoutContent rendered', { 
    hasUserData: !!userData, 
    isReady, 
    loading, 
    hasError: !!error,
    isAuthorized,
    accessCheckComplete
  });

  // Función para verificar acceso con logs detallados
  const checkAccess = async () => {
    try {
      layoutLog.info('Starting access check', { 
        isReady, 
        hasUserData: !!userData, 
        userEmail: userData?.email,
        userLevel: userData?.user_level 
      });

      if (!isReady) {
        layoutLog.debug('Auth not ready yet, waiting...');
        return;
      }

      if (loading) {
        layoutLog.debug('Auth still loading, waiting...');
        return;
      }

      if (error) {
        layoutLog.error('Auth error detected', { error });
        setIsAuthorized(false);
        setAccessCheckComplete(true);
        setIsLoading(false);
        return;
      }

      if (!userData) {
        layoutLog.warn('No user data available, redirecting to login');
        router.replace('/login/signin');
        return;
      }

      // Verificar si el email está en la lista de autorizados
      const userEmail = userData.email?.toLowerCase().trim();
      const clientAuthorized = userEmail && MAESTRO_AUTHORIZED_EMAILS.includes(userEmail);
      const isLevel6 = userData.user_level === 6;

      const debugData = {
        userEmail: userData.email,
        userEmailLower: userEmail,
        authorizedEmails: MAESTRO_AUTHORIZED_EMAILS,
        isAuthorizedByEmail: clientAuthorized,
        userLevel: userData.user_level,
        isLevel6,
        hasAccess: clientAuthorized || isLevel6,
        timestamp: new Date().toISOString()
      };

      setDebugInfo(debugData);
      layoutLog.info('Access check completed', debugData);

      if (!clientAuthorized && !isLevel6) {
        layoutLog.warn('Access denied - user not authorized', debugData);
        setIsAuthorized(false);
        setAccessCheckComplete(true);
        setIsLoading(false);
        return;
      }

      layoutLog.info('Access granted', debugData);
      setIsAuthorized(true);
      setAccessCheckComplete(true);
      setIsLoading(false);

    } catch (error) {
      layoutLog.error('Exception in access check', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      setIsAuthorized(false);
      setAccessCheckComplete(true);
      setIsLoading(false);
    }
  };

  // Efecto para verificar acceso
  useEffect(() => {
    layoutLog.debug('Access check effect triggered', { 
      isReady, 
      loading, 
      hasUserData: !!userData,
      accessCheckComplete 
    });

    if (!accessCheckComplete) {
      checkAccess();
    }
  }, [isReady, loading, userData, accessCheckComplete]);

  // Efecto para manejar cambios en el estado de autenticación
  useEffect(() => {
    layoutLog.debug('Auth state change effect triggered', { 
      isReady, 
      loading, 
      hasUserData: !!userData,
      hasError: !!error 
    });

    if (isReady && !loading && !error && userData) {
      layoutLog.info('Auth state ready, checking access');
      checkAccess();
    }
  }, [isReady, loading, error, userData]);

  // Mostrar loading mientras se verifica el acceso
  if (isLoading || !accessCheckComplete) {
    layoutLog.debug('Showing loading screen', { 
      isLoading, 
      accessCheckComplete,
      isReady,
      loading,
      hasUserData: !!userData 
    });

    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner message="Verificando acceso de maestro..." />
          <div className="mt-4 text-sm text-gray-400">
            <p>Estado: {isReady ? 'Listo' : 'Cargando'}</p>
            <p>Usuario: {userData ? 'Cargado' : 'No cargado'}</p>
            <p>Error: {error || 'Ninguno'}</p>
          </div>
          {error && (
            <button
              onClick={retryAuth}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }

  // Mostrar error si no está autorizado
  if (!isAuthorized) {
    layoutLog.warn('Access denied, showing error screen', { debugInfo });

    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-400 text-xl mb-4">Acceso Denegado</div>
          <p className="text-gray-400 mb-2">No tienes permisos para acceder al dashboard de maestro.</p>
          
          {userData && (
            <div className="text-gray-500 text-sm mb-4 text-left">
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Nivel:</strong> {userData.user_level}</p>
              <p><strong>Emails autorizados:</strong> {MAESTRO_AUTHORIZED_EMAILS.join(', ')}</p>
              <p><strong>Autorizado por email:</strong> {debugInfo.isAuthorizedByEmail ? 'Sí' : 'No'}</p>
              <p><strong>Nivel 6:</strong> {debugInfo.isLevel6 ? 'Sí' : 'No'}</p>
            </div>
          )}

          <div className="space-y-2">
            <button 
              onClick={() => window.location.href = '/login/dashboard-selection'}
              className="w-full px-6 py-3 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d43d48] transition-colors"
            >
              Volver a Selección de Dashboard
            </button>
            
            <button 
              onClick={retryAuth}
              className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reintentar Verificación
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar el dashboard si está autorizado
  layoutLog.info('Access granted, showing dashboard', { debugInfo });

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
