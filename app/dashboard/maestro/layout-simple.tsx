'use client';

import { useSafeAuth } from '@/context/AuthContext-offline';
import { useRouter } from 'next/navigation';
import MaestroSidebar from '@/components/layout/MaestroSidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { MaestroSidebarProvider, useMaestroSidebar } from './MaestroSidebarContext';
import { MAESTRO_AUTHORIZED_EMAILS } from '@/utils/dashboardUtils';

function MaestroLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData, isReady } = useSafeAuth();
  const router = useRouter();

  // Si no está listo, mostrar loading
  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <LoadingSpinner message="Cargando..." />
      </div>
    );
  }

  // Si no hay datos del usuario, redirigir a login
  if (!userData) {
    router.replace('/login/signin');
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white">Redirigiendo al login...</div>
      </div>
    );
  }

  // Verificar acceso de forma simple
  const userEmail = userData.email.toLowerCase().trim();
  const isAuthorizedEmail = MAESTRO_AUTHORIZED_EMAILS.includes(userEmail);
  const isLevel0 = userData.user_level === 0;
  const isLevel6 = userData.user_level === 6;
  const hasAccess = isAuthorizedEmail || isLevel0 || isLevel6;

  // Si no tiene acceso, mostrar error
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-400 text-xl mb-4">Acceso Denegado</div>
          <p className="text-gray-400 mb-2">No tienes permisos para acceder al dashboard de maestro.</p>
          <div className="text-gray-500 text-sm mb-4">
            <p>Email: {userData.email}</p>
            <p>Nivel: {userData.user_level}</p>
          </div>
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

  // Si tiene acceso, mostrar el dashboard
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
