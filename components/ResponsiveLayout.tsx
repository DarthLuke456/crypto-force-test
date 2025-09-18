'use client';
import { useResponsive } from '@/hooks/useResponsive';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  mobileHeader?: React.ReactNode;
  className?: string;
}

export function ResponsiveLayout({ 
  children, 
  sidebar, 
  mobileHeader,
  className = '' 
}: ResponsiveLayoutProps) {
  const { isMobile, isTablet, isDesktop, mounted } = useResponsive();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Cerrar sidebar al cambiar de tamaño de pantalla
  useEffect(() => {
    if (isDesktop && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [isDesktop, sidebarOpen]);

  // Prevenir scroll del body cuando el sidebar está abierto en móvil
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, sidebarOpen]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ec4d58]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] text-white ${className}`}>
      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a] border-b border-[#333] shadow-lg">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-white hover:bg-[#333] rounded-lg transition-colors duration-200"
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {mobileHeader || (
              <h1 className="text-lg font-bold text-center flex-1">Crypto Force</h1>
            )}
            
            <div className="w-10" />
          </div>
        </header>
      )}

      {/* Sidebar */}
      {sidebar && (
        <aside className={`
          fixed top-0 left-0 h-full bg-[#1a1a1a] border-r border-[#333] z-40
          transition-transform duration-300 ease-in-out
          ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          ${isDesktop ? 'w-72' : 'w-64'}
          ${isMobile ? 'w-80' : ''}
        `}>
          <div className="h-full overflow-y-auto">
            {sidebar}
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className={`
        transition-all duration-300 ease-in-out
        ${isMobile ? 'pt-16' : ''}
        ${sidebar && isDesktop ? 'ml-72' : ''}
        ${sidebar && isTablet ? 'ml-0' : ''}
        ${sidebar && isMobile ? 'ml-0' : ''}
        min-h-screen
      `}>
        <div className={`
          ${isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8'}
          ${sidebar && isDesktop ? 'pl-6 pr-6' : ''}
        `}>
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar menú"
        />
      )}

      {/* Mobile Sidebar Close Button */}
      {isMobile && sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed top-4 right-4 z-50 p-2 bg-[#ec4d58] text-white rounded-full shadow-lg hover:bg-[#d43d4d] transition-colors duration-200"
          aria-label="Cerrar menú"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// Hook para controlar el sidebar desde componentes hijos
export function useSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMobile } = useResponsive();

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return {
    sidebarOpen: isMobile ? sidebarOpen : true, // Siempre abierto en desktop
    openSidebar,
    closeSidebar,
    toggleSidebar
  };
}
