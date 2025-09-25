'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider, useSidebar } from '@/components/sidebar/SidebarContext';
import { useSafeAuth } from '@/context/AuthContext-working';
import { ControlPointProvider } from '@/context/ControlPointContext';
import { ProgressProvider } from '@/context/ProgressContext';
import Sidebar from '@/components/sidebar/Sidebar';

function DashboardContent({ children }: { children: ReactNode }) {
  const { isExpanded, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);
  const { userData } = useSafeAuth();

  // Determinar el nivel del dashboard actual basado en la ruta
  const getCurrentDashboardLevel = (): number => {
    if (pathname?.startsWith('/dashboard/iniciado')) return 1;
    if (pathname?.startsWith('/dashboard/acolito')) return 2;
    if (pathname?.startsWith('/dashboard/warrior')) return 3;
    if (pathname?.startsWith('/dashboard/lord')) return 4;
    if (pathname?.startsWith('/dashboard/darth')) return 5;
    if (pathname?.startsWith('/dashboard/maestro')) return 6;
    if (pathname?.startsWith('/login/dashboard-selection')) return 0; // Dashboard selection
    if (pathname === '/dashboard/perfil') {
      // Prioridad absoluta: nivel del usuario autenticado desde el contexto
      if (userData?.user_level) {
        return userData.user_level as number;
      }
      // Para el perfil, determinar el nivel real del usuario.
      // 1) Prioridad: localStorage.userData.user_level
      // 2) Fallback: localStorage.currentDashboard → mapa a nivel
      if (typeof window !== 'undefined') {
        try {
          const userData = localStorage.getItem('userData');
          if (userData) {
            const parsed = JSON.parse(userData);
            if (parsed?.user_level) {
              return parsed.user_level as number;
            }
          }
        } catch (error) {
          console.error('Error parsing userData from localStorage:', error);
        }
        try {
          const storedDashboard = localStorage.getItem('currentDashboard');
          if (storedDashboard) {
            const dashboardLevels: { [key: string]: number } = {
              'iniciado': 1,
              'acolito': 2,
              'warrior': 3,
              'lord': 4,
              'darth': 5,
              'maestro': 6
            };
            return dashboardLevels[storedDashboard] || 1;
          }
        } catch (error) {
          console.warn('⚠️ Error leyendo currentDashboard de localStorage:', error);
        }
      }
    }
    return 1; // Por defecto
  };
  
  const currentDashboardLevel = getCurrentDashboardLevel();
  
  // Determinar la clase CSS para el scrollbar
  const scrollbarClass = currentDashboardLevel === 0 ? 'main-content-dashboard-selection' :
                        currentDashboardLevel === 1 ? 'main-content-iniciado' :
                        currentDashboardLevel === 2 ? 'main-content-acolito' :
                        currentDashboardLevel === 3 ? 'main-content-warrior' :
                        currentDashboardLevel === 4 ? 'main-content-lord' :
                        currentDashboardLevel === 5 ? 'main-content-darth' :
                        currentDashboardLevel === 6 ? 'main-content-maestro' :
                        'main-content-iniciado';

  // Aplicar clase CSS al body para scrollbars específicas
  useEffect(() => {
    const body = document.body;
    
    // Remover clases anteriores
    body.classList.remove('body-dashboard-selection', 'body-iniciado', 'body-acolito', 'body-warrior', 'body-lord', 'body-darth', 'body-maestro');
    
    // Aplicar clase según el nivel
    const level = currentDashboardLevel as number;
    if (level === 0) {
      body.classList.add('body-dashboard-selection');
    } else if (level === 1) {
      body.classList.add('body-iniciado');
    } else if (level === 2) {
      body.classList.add('body-acolito');
    } else if (level === 3) {
      body.classList.add('body-warrior');
    } else if (level === 4) {
      body.classList.add('body-lord');
    } else if (level === 5) {
      body.classList.add('body-darth');
    } else if (level === 6) {
      body.classList.add('body-maestro');
    }
    
    // Debug para Acólito
    if (level === 2) {
      console.log('🟡 ACOLITO SCROLLBAR DEBUG:');
      console.log('🟡 Current level:', level);
      console.log('🟡 Scrollbar class:', scrollbarClass);
      console.log('🟡 Body classes:', body.className);
      if (mainRef.current) {
        console.log('🟡 Main element classes:', mainRef.current.className);
        
        // Verificar estilos computados
        const computedStyle = window.getComputedStyle(mainRef.current);
        console.log('🟡 Computed scrollbar-color:', (computedStyle as any).scrollbarColor);
        console.log('🟡 Computed scrollbar-width:', (computedStyle as any).scrollbarWidth);
        
        // Verificar si hay estilos inline
        console.log('🟡 Inline style:', mainRef.current.style.cssText);
        
        // Verificar overflow y dimensiones
        console.log('🟡 Overflow:', computedStyle.overflow);
        console.log('🟡 OverflowY:', computedStyle.overflowY);
        console.log('🟡 ScrollHeight:', mainRef.current.scrollHeight);
        console.log('🟡 ClientHeight:', mainRef.current.clientHeight);
        console.log('🟡 OffsetHeight:', mainRef.current.offsetHeight);
        console.log('🟡 Has overflow:', mainRef.current.scrollHeight > mainRef.current.clientHeight);
        
        // Verificar viewport
        console.log('🟡 Window innerHeight:', window.innerHeight);
        console.log('🟡 Document body height:', document.body.scrollHeight);
        
        // Verificar si hay scrollbar visible
        const hasVisibleScrollbar = mainRef.current.scrollHeight > mainRef.current.clientHeight;
        console.log('🟡 Has visible scrollbar:', hasVisibleScrollbar);
        
        // Verificar si ya se agregó contenido forzado
        const existingForceContent = mainRef.current.querySelector('.force-scrollbar-content');
        
        // Forzar scrollbar si no hay overflow y no se ha agregado contenido
        if (!hasVisibleScrollbar && !existingForceContent) {
          console.log('🟡 FORZANDO SCROLLBAR - Agregando más contenido...');
          const extraContent = document.createElement('div');
          extraContent.style.height = '200vh';
          extraContent.style.background = 'transparent';
          extraContent.className = 'force-scrollbar-content';
          mainRef.current.appendChild(extraContent);
          
          // Verificar después de agregar contenido
          setTimeout(() => {
            const newScrollHeight = mainRef.current?.scrollHeight;
            const newClientHeight = mainRef.current?.clientHeight;
            console.log('🟡 DESPUÉS DE FORZAR - ScrollHeight:', newScrollHeight, 'ClientHeight:', newClientHeight);
            console.log('🟡 NUEVO OVERFLOW:', (newScrollHeight || 0) > (newClientHeight || 0));
          }, 100);
        } else if (hasVisibleScrollbar) {
          console.log('🟡 ✅ SCROLLBAR VISIBLE - No se necesita forzar');
        } else if (existingForceContent) {
          console.log('🟡 ⚠️ CONTENIDO YA AGREGADO - Esperando overflow...');
        }
      }
    }
    
    // Cleanup al desmontar
    return () => {
      body.classList.remove('body-dashboard-selection', 'body-iniciado', 'body-acolito', 'body-warrior', 'body-lord', 'body-darth', 'body-maestro');
    };
  }, [currentDashboardLevel, scrollbarClass]);

  // Si es la ruta de maestro, no aplicar sidebar ni layout
  if (pathname?.startsWith('/dashboard/maestro')) {
    return (
      <div className="min-h-screen bg-[#121212]">
        {children}
      </div>
    );
  }

  // Debug para scrollbar
  console.log('🔍 SCROLLBAR DEBUG:');
  console.log('🔍 isExpanded:', isExpanded);
  console.log('🔍 pathname:', pathname);
  console.log('🔍 currentDashboardLevel:', currentDashboardLevel);

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Sidebar - Siempre visible */}
      <Sidebar />
      
      {/* Main Content */}
      <main 
        ref={mainRef}
        className={`${isExpanded ? 'ml-48' : 'ml-16'} transition-all duration-300 h-screen overflow-auto ${scrollbarClass}`}
        style={{
          marginLeft: isExpanded ? '192px' : '64px', // w-48 = 192px, w-16 = 64px
          ...(currentDashboardLevel === 2 ? {
            scrollbarWidth: 'thin',
            scrollbarColor: '#fafafa #f0f0f0'
          } : {})
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <ControlPointProvider>
        <ProgressProvider>
          <DashboardContent>{children}</DashboardContent>
        </ProgressProvider>
      </ControlPointProvider>
    </SidebarProvider>
  );
}