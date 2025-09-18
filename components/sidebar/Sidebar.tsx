"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { sidebarItems, sidebarItemsAcolito, sidebarItemsWarrior, sidebarItemsLord, sidebarItemsDarth, sidebarItemsMaestro } from "./sidebarItems";
import SidebarToggle from "./SidebarToggle";
import { useSidebar } from "./SidebarContext";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Menu, LogOut, Compass, MessageSquare } from 'lucide-react';
import { useSafeAuth } from '@/context/AuthContext';
import { useAvatarSync } from '@/hooks/useAvatarSync';
import { useMyFeedback } from '@/hooks/useMyFeedback';
// Removed FeedbackModalEnhanced import - now using dedicated page

export default function Sidebar() {
  const { isExpanded, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const authContext = useSafeAuth();
  const authUserData = authContext?.userData;
  const loading = authContext?.loading;
  const [isClient, setIsClient] = useState(false);
  // Removed feedback modal state - now using dedicated page
  const { avatar: userAvatar } = useAvatarSync();
  const { hasNewResponses } = useMyFeedback();
  
  // Verificar si estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Removed handleFeedbackClick - now using Link navigation
  

  
  const isAcolito = pathname.startsWith("/dashboard/acolito");
  const isWarrior = pathname.startsWith("/dashboard/warrior");
  const isLord = pathname.startsWith("/dashboard/lord");
  const isDarth = pathname.startsWith("/dashboard/darth");
  const isMaestro = pathname.startsWith("/dashboard/maestro");
  
  // Seleccionar items según el nivel del usuario
  let items = sidebarItems; // Por defecto
  if (isAcolito) {
    items = sidebarItemsAcolito;
  } else if (isWarrior) {
    items = sidebarItemsWarrior;
  } else if (isLord) {
    items = sidebarItemsLord;
  } else if (isDarth) {
    items = sidebarItemsDarth;
  } else if (isMaestro) {
    items = sidebarItemsMaestro;
  } else if (pathname === '/dashboard/perfil') {
    // Si estamos en el perfil, usar el sidebar basado en el nivel del usuario autenticado
    // Esto asegura que el sidebar mantenga el nivel correcto del usuario
    console.log('🔍 Sidebar - En perfil, usando nivel de usuario autenticado');
    console.log('🔍 Sidebar - authUserData:', authUserData);
    console.log('🔍 Sidebar - user_level:', authUserData?.user_level);
    
    // Usar el nivel del usuario autenticado como prioridad
    if (authUserData?.user_level) {
      switch (authUserData.user_level) {
        case 6:
          console.log('🔍 Sidebar - Usando sidebar de Maestro para perfil (nivel 6)');
          items = sidebarItemsMaestro;
          break;
        case 5:
          console.log('🔍 Sidebar - Usando sidebar de Darth para perfil (nivel 5)');
          items = sidebarItemsDarth;
          break;
        case 4:
          console.log('🔍 Sidebar - Usando sidebar de Lord para perfil (nivel 4)');
          items = sidebarItemsLord;
          break;
        case 3:
          console.log('🔍 Sidebar - Usando sidebar de Warrior para perfil (nivel 3)');
          items = sidebarItemsWarrior;
          break;
        case 2:
          console.log('🔍 Sidebar - Usando sidebar de Acolito para perfil (nivel 2)');
          items = sidebarItemsAcolito;
          break;
        default:
          console.log('🔍 Sidebar - Usando sidebar de Iniciado para perfil (nivel 1)');
          items = sidebarItems;
      }
    } else {
      // Fallback: usar el dashboard actual desde localStorage
      console.log('🔍 Sidebar - Fallback: usando dashboard actual desde localStorage');
      
      let currentDashboard = 'iniciado'; // Por defecto
      if (typeof window !== 'undefined') {
        try {
          const storedDashboard = localStorage.getItem('currentDashboard');
          if (storedDashboard) {
            currentDashboard = storedDashboard;
            console.log('🔍 Sidebar - Dashboard detectado desde localStorage:', currentDashboard);
          }
        } catch (error) {
          console.warn('⚠️ Sidebar - Error al leer dashboard desde localStorage:', error);
        }
      }
      
      // Usar el sidebar correspondiente al dashboard actual
      switch (currentDashboard) {
        case 'maestro':
          console.log('🔍 Sidebar - Usando sidebar de Maestro para perfil');
          items = sidebarItemsMaestro;
          break;
        case 'darth':
          console.log('🔍 Sidebar - Usando sidebar de Darth para perfil');
          items = sidebarItemsDarth;
          break;
        case 'lord':
          console.log('🔍 Sidebar - Usando sidebar de Lord para perfil');
          items = sidebarItemsLord;
          break;
        case 'warrior':
          console.log('🔍 Sidebar - Usando sidebar de Warrior para perfil');
          items = sidebarItemsWarrior;
          break;
        case 'acolito':
          console.log('🔍 Sidebar - Usando sidebar de Acolito para perfil');
          items = sidebarItemsAcolito;
          break;
        default:
          console.log('🔍 Sidebar - Usando sidebar de Iniciado para perfil');
          items = sidebarItems;
      }
    }
  }
  
  // Debug: Log de los items que se van a usar
  console.log('🔍 Sidebar Debug - items seleccionados:', items);
  console.log('🔍 Sidebar Debug - items length:', items.length);
  
  // Remover el estado local de avatar ya que usamos el hook global

  
  // Verificar si el usuario puede navegar a dashboards inferiores (solo en el cliente)
  const canNavigateDashboards = isClient && authUserData && authUserData.user_level !== undefined;
  
  // Determinar el nivel del dashboard actual basado en la ruta
  const getCurrentDashboardLevel = () => {
    if (pathname?.startsWith('/dashboard/iniciado')) return 1;
    if (pathname?.startsWith('/dashboard/acolito')) return 2;
    if (pathname?.startsWith('/dashboard/warrior')) return 3;
    if (pathname?.startsWith('/dashboard/lord')) return 4;
    if (pathname?.startsWith('/dashboard/darth')) return 5;
    if (pathname?.startsWith('/dashboard/maestro')) return 6;
  if (pathname === '/dashboard/perfil') {
    // Para el perfil, usar el nivel del usuario autenticado como prioridad
    if (authUserData?.user_level) {
      console.log('🔍 Sidebar - Usando nivel de usuario autenticado para perfil:', authUserData.user_level);
      return authUserData.user_level;
    }
    
    // Fallback: usar el dashboard actual desde localStorage
    if (typeof window !== 'undefined') {
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
          console.log('🔍 Sidebar - Fallback: usando dashboard desde localStorage para perfil:', storedDashboard);
          return dashboardLevels[storedDashboard] || 1;
        }
      } catch (error) {
        console.warn('⚠️ Error al leer dashboard desde localStorage:', error);
      }
    }
  }
    return 1; // Por defecto
  };
  
  const currentDashboardLevel = getCurrentDashboardLevel();
  const userLevel = authUserData?.user_level || 1;
  
  // Guardar el dashboard actual en localStorage para usar en el perfil
  useEffect(() => {
    if (typeof window !== 'undefined' && pathname) {
      if (pathname.startsWith('/dashboard/maestro')) {
        localStorage.setItem('currentDashboard', 'maestro');
      } else if (pathname.startsWith('/dashboard/darth')) {
        localStorage.setItem('currentDashboard', 'darth');
      } else if (pathname.startsWith('/dashboard/lord')) {
        localStorage.setItem('currentDashboard', 'lord');
      } else if (pathname.startsWith('/dashboard/warrior')) {
        localStorage.setItem('currentDashboard', 'warrior');
      } else if (pathname.startsWith('/dashboard/acolito')) {
        localStorage.setItem('currentDashboard', 'acolito');
      } else if (pathname.startsWith('/dashboard/iniciado')) {
        localStorage.setItem('currentDashboard', 'iniciado');
      }
    }
  }, [pathname]);

  // Debug: Log del nivel actual
  console.log('🔍 Sidebar Debug - currentDashboardLevel:', currentDashboardLevel);
  console.log('🔍 Sidebar Debug - pathname:', pathname);
  console.log('🔍 Sidebar Debug - authUserData:', authUserData);
  console.log('🔍 Sidebar Debug - user_level:', authUserData?.user_level);
  console.log('🔍 Body classes:', document.body.className);
  
  // Mostrar ícono compass si el usuario tiene un rol superior al dashboard actual
  // Fundador (0) siempre puede navegar, Maestro (6) puede navegar a niveles inferiores
  // También mostrar para usuarios Maestros (nivel 6) independientemente del dashboard actual
  const shouldShowCompass = userLevel === 0 || userLevel === 6 || userLevel > currentDashboardLevel;
  
  console.log('🔍 [SIDEBAR] Compass Debug:', {
    userLevel,
    currentDashboardLevel,
    shouldShowCompass,
    isMaestro: userLevel === 6,
    isFundador: userLevel === 0,
    canNavigate: userLevel > currentDashboardLevel,
    userEmail: authUserData?.email
  });
  
  // Debug: Log detallado para entender por qué no aparece el ícono
  console.log('🔍 Sidebar - Compass Logic Debug:', {
    pathname,
    currentDashboardLevel,
    userLevel,
    shouldShowCompass,
    isFundador: userLevel === 0,
    isMaestro: userLevel === 6,
    userEmail: authUserData?.email
  });
  
  // Debug logs
  useEffect(() => {
    if (isClient) {
      console.log('🔍 Sidebar - AuthContext completo:', authContext);
      console.log('🔍 Sidebar - UserData del contexto:', authUserData);
      console.log('🔍 Sidebar - ¿Es cliente?:', isClient);
      console.log('🔍 Sidebar - user_level específico:', authUserData?.user_level);
      console.log('🔍 Sidebar - ¿Puede navegar dashboards?:', canNavigateDashboards);
      console.log('🔍 Sidebar - Condición completa:', {
        isClient,
        hasUserData: !!authUserData,
        userLevel: authUserData?.user_level,
        canNavigate: canNavigateDashboards,
        currentDashboardLevel,
        shouldShowCompass
      });
    }
  }, [isClient, authContext, authUserData, canNavigateDashboards, currentDashboardLevel, userLevel, shouldShowCompass]);

  // Get user data from profile
  // Ya no necesitamos cargar datos del perfil localmente

  // Determinar si mostrar footer (solo si no están en la lista principal)
  const showFooter = !items.some(item => item.label === "Perfil" || item.label === "Salir");
  
  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gradient-to-b from-[#121212] to-[#0a0a0a] shadow-2xl z-40 flex flex-col border-r border-gray-800/50 transition-all duration-300 ease-in-out rounded-r-xl ${
        isExpanded ? "w-48" : "w-16"
      }`}
    >
      {/* Header del sidebar - Compacto */}
      <div className="flex-shrink-0 p-2 border-b border-gray-800/30">
        {isExpanded ? (
          /* Layout expandido: Logo, nombre y botón en una línea - alineado con botones */
          <div className="flex items-center justify-between px-3">
            {/* Logo y nombre - alineado con el padding de los botones */}
            <div className="flex items-center space-x-3">
              <div className="relative w-6 h-6">
                <Image
                  src={`/images/insignias/${currentDashboardLevel}-${
                    currentDashboardLevel === 1 ? 'iniciados' :
                    currentDashboardLevel === 2 ? 'acolitos' :
                    currentDashboardLevel === 3 ? 'warriors' :
                    currentDashboardLevel === 4 ? 'lords' :
                    currentDashboardLevel === 5 ? 'darths' :
                    currentDashboardLevel === 6 ? 'maestros' : 'iniciados'
                  }.png?v=2`}
                  alt={`Insignia ${currentDashboardLevel}`}
                  width={24}
                  height={24}
                  className="rounded-lg"
                />
              </div>
              <span className={`text-base font-medium ${
                currentDashboardLevel === 1 ? 'text-[#fafafa]' :
                currentDashboardLevel === 2 ? 'text-[#FFD447]' :
                currentDashboardLevel === 3 ? 'text-green-400' :
                currentDashboardLevel === 4 ? 'text-blue-400' :
                currentDashboardLevel === 5 ? 'text-red-500' :
                currentDashboardLevel === 6 ? 'text-[#8a8a8a]' : 'text-gray-400'
              }`}>
                {currentDashboardLevel === 1 ? 'Iniciado' :
                 currentDashboardLevel === 2 ? 'Acólito' :
                 currentDashboardLevel === 3 ? 'Warrior' :
                 currentDashboardLevel === 4 ? 'Lord' :
                 currentDashboardLevel === 5 ? 'Darth' :
                 currentDashboardLevel === 6 ? 'Maestro' : 'Iniciado'}
              </span>
            </div>

            {/* Botón de toggle - mismo tamaño que otros botones */}
            <button
              onClick={toggleSidebar}
              className="group relative flex items-center justify-center py-2 px-3 text-gray-300 hover:bg-[#232323] rounded-lg transition-all duration-200 ease-in-out"
              title="Contraer sidebar"
            >
              <span className={`flex items-center justify-center text-xl w-6 h-6 transition-all duration-200 text-white ${
                currentDashboardLevel === 1 ? 'group-hover:text-[#fafafa]' :
                currentDashboardLevel === 2 ? 'group-hover:text-[#FFD447]' :
                currentDashboardLevel === 3 ? 'group-hover:text-green-400' :
                currentDashboardLevel === 4 ? 'group-hover:text-blue-400' :
                currentDashboardLevel === 5 ? 'group-hover:text-red-500' :
                currentDashboardLevel === 6 ? 'group-hover:text-[#8a8a8a]' :
                'group-hover:text-[#ec4d58]'
              }`}>
                <Menu size={20} />
              </span>
            </button>
          </div>
        ) : (
          /* Layout colapsado: Logo centrado arriba, botón centrado abajo */
          <div className="flex flex-col items-center space-y-3">
            {/* Logo centrado - mismo tamaño que en expandido */}
            <div className="relative w-6 h-6">
              <Image
                src={`/images/insignias/${currentDashboardLevel}-${
                  currentDashboardLevel === 1 ? 'iniciados' :
                  currentDashboardLevel === 2 ? 'acolitos' :
                  currentDashboardLevel === 3 ? 'warriors' :
                  currentDashboardLevel === 4 ? 'lords' :
                  currentDashboardLevel === 5 ? 'darths' :
                  currentDashboardLevel === 6 ? 'maestros' : 'iniciados'
                }.png?v=2`}
                alt={`Insignia ${currentDashboardLevel}`}
                width={24}
                height={24}
                className="rounded-lg"
              />
            </div>

            {/* Botón de toggle centrado - mismo tamaño que otros botones */}
            <button
              onClick={toggleSidebar}
              className="group relative flex items-center justify-center py-2 px-3 text-gray-300 hover:bg-[#232323] rounded-lg transition-all duration-200 ease-in-out w-full"
              title="Expandir sidebar"
            >
              <span className={`flex items-center justify-center text-xl w-6 h-6 transition-all duration-200 text-white ${
                currentDashboardLevel === 1 ? 'group-hover:text-[#fafafa]' :
                currentDashboardLevel === 2 ? 'group-hover:text-[#FFD447]' :
                currentDashboardLevel === 3 ? 'group-hover:text-green-400' :
                currentDashboardLevel === 4 ? 'group-hover:text-blue-400' :
                currentDashboardLevel === 5 ? 'group-hover:text-red-500' :
                currentDashboardLevel === 6 ? 'group-hover:text-[#8a8a8a]' :
                'group-hover:text-[#ec4d58]'
              }`}>
                <Menu size={20} />
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Navegación principal */}
      <nav className={`flex-1 overflow-y-auto py-2 ${
        currentDashboardLevel === 1 ? 'scrollbar-iniciado' :
        currentDashboardLevel === 2 ? 'scrollbar-acolito' :
        currentDashboardLevel === 3 ? 'scrollbar-warrior' :
        currentDashboardLevel === 4 ? 'scrollbar-lord' :
        currentDashboardLevel === 5 ? 'scrollbar-darth' :
        currentDashboardLevel === 6 ? 'scrollbar-maestro' :
        'scrollbar-default'
      }`}>
        <ul className="space-y-1 px-3">

          

          

          
          {/* Resto de elementos de navegación */}
          {items.map((item, index) => {
            const isActive = pathname === item.href;
            const isCompassItem = item.isCompass;
            const isFeedbackItem = item.isFeedback;
            
            // Si es el botón de compass y no debe mostrarse, saltarlo
            if (isCompassItem && !shouldShowCompass) {
              return null;
            }
            
            return (
              <li key={item.label}>
                {isFeedbackItem ? (
                  <Link
                    href={
                      currentDashboardLevel === 1 ? "/dashboard/iniciado/feedback" :
                      currentDashboardLevel === 2 ? "/dashboard/acolito/feedback" :
                      currentDashboardLevel === 3 ? "/dashboard/warrior/feedback" :
                      currentDashboardLevel === 4 ? "/dashboard/lord/feedback" :
                      currentDashboardLevel === 5 ? "/dashboard/darth/feedback" :
                      "/dashboard/iniciado/feedback"
                    }
                    className={`group relative flex items-center py-2 px-3 hover:bg-[#232323] rounded-lg transition-all duration-200 ease-in-out w-full ${
                      isExpanded ? 'justify-start text-left gap-x-3' : 'justify-center'
                    } text-gray-300`}
                    title={!isExpanded ? item.label : undefined}
                  >
                    {/* Active indicator - línea lateral */}
                    <span
                      className={`flex items-center justify-center text-xl w-6 h-6 transition-all duration-200 ${
                        currentDashboardLevel === 1 ? 'text-[#fafafa] group-hover:text-[#fafafa]' :
                        currentDashboardLevel === 2 ? 'text-[#FFD447] group-hover:text-[#FFD447]' :
                        currentDashboardLevel === 3 ? 'text-[#3ED598] group-hover:text-[#3ED598]' :
                        currentDashboardLevel === 4 ? 'text-[#4671D5] group-hover:text-[#4671D5]' :
                        currentDashboardLevel === 5 ? 'text-[#EC4D58] group-hover:text-[#EC4D58]' :
                        currentDashboardLevel === 6 ? 'text-[#8A8A8A] group-hover:text-[#8A8A8A]' :
                        'text-[#ec4d58] group-hover:text-[#ec4d58]'
                      } ${isExpanded ? 'mr-3' : ''}`}
                    >
                      {typeof item.icon === 'string' ? item.icon : React.createElement(item.icon)}
                    </span>
                    
                    {isExpanded && (
                      <span className="font-medium whitespace-nowrap sidebar-text text-white group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                    )}
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                  className={`group relative flex items-center py-2 px-3 hover:bg-[#232323] rounded-lg transition-all duration-200 ease-in-out w-full ${
                    isExpanded ? 'justify-start text-left gap-x-3' : 'justify-center'
                  } ${isActive ? (
                    currentDashboardLevel === 1 ? 'bg-[#fafafa]' :
                    currentDashboardLevel === 2 ? 'bg-[#FFD447]' :
                    currentDashboardLevel === 3 ? 'bg-green-500' :
                    currentDashboardLevel === 4 ? 'bg-blue-500' :
                    currentDashboardLevel === 5 ? 'bg-red-500' :
                    currentDashboardLevel === 6 ? 'bg-[#8a8a8a]' :
                    'bg-[#ec4d58]'
                  ) : 'text-gray-300'}`}
                  title={!isExpanded ? item.label : undefined}
                  onMouseEnter={() => {
                    if (isActive) {
                      console.log('🔍 Mouse enter on active button:', item.label, 'level:', currentDashboardLevel);
                    }
                  }}
                >
                  {/* Active indicator - línea lateral */}
                  {isActive && (
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${
                      currentDashboardLevel === 1 ? 'bg-[#fafafa]' :
                      currentDashboardLevel === 2 ? 'bg-[#FFD447]' :
                      currentDashboardLevel === 3 ? 'bg-green-500' :
                      currentDashboardLevel === 4 ? 'bg-blue-500' :
                      currentDashboardLevel === 5 ? 'bg-red-500' :
                      currentDashboardLevel === 6 ? 'bg-[#8a8a8a]' :
                      'bg-[#ec4d58]'
                    }`}></div>
                  )}
                  
                  <span
                    className={`flex items-center justify-center text-xl w-6 h-6 transition-all duration-200 ${
                      isActive 
                        ? (() => {
                            const hoverColor = currentDashboardLevel === 1 ? '[#fafafa]' :
                                              currentDashboardLevel === 2 ? '[#FFD447]' :
                                              currentDashboardLevel === 3 ? '[#3ED598]' :
                                              currentDashboardLevel === 4 ? '[#4671D5]' :
                                              currentDashboardLevel === 5 ? '[#EC4D58]' :
                                              currentDashboardLevel === 6 ? '[#8A8A8A]' :
                                              '[#ec4d58]';
                            console.log('🔍 Active button hover color:', hoverColor, 'for level:', currentDashboardLevel);
                            return `text-[#121212] group-hover:!text-${hoverColor}`;
                          })()
                        : `text-white group-hover:${
                            currentDashboardLevel === 1 ? 'text-[#fafafa]' :
                            currentDashboardLevel === 2 ? 'text-[#FFD447]' :
                            currentDashboardLevel === 3 ? 'text-[#3ED598]' :
                            currentDashboardLevel === 4 ? 'text-[#4671D5]' :
                            currentDashboardLevel === 5 ? 'text-[#EC4D58]' :
                            currentDashboardLevel === 6 ? 'text-[#8A8A8A]' :
                            'text-[#ec4d58]'
                          }`
                    } ${isExpanded ? 'mr-3' : ''}`}
                  >
                    {typeof item.icon === 'string' ? item.icon : React.createElement(item.icon)}
                  </span>
                  
                  {isExpanded && (
                    <span 
                      className={`font-medium whitespace-nowrap sidebar-text ${
                        isActive 
                          ? (() => {
                              const hoverColor = currentDashboardLevel === 1 ? '[#fafafa]' :
                                                currentDashboardLevel === 2 ? '[#FFD447]' :
                                                currentDashboardLevel === 3 ? '[#3ED598]' :
                                                currentDashboardLevel === 4 ? '[#4671D5]' :
                                                currentDashboardLevel === 5 ? '[#EC4D58]' :
                                                currentDashboardLevel === 6 ? '[#8A8A8A]' :
                                                '[#ec4d58]';
                              console.log('🔍 Active text hover color:', hoverColor, 'for level:', currentDashboardLevel, 'item:', item.label);
                              return `text-[#121212] group-hover:!text-${hoverColor}`;
                            })()
                          : `text-white group-hover:${
                              currentDashboardLevel === 1 ? 'text-[#fafafa]' :
                              currentDashboardLevel === 2 ? 'text-[#FFD447]' :
                              currentDashboardLevel === 3 ? 'text-[#3ED598]' :
                              currentDashboardLevel === 4 ? 'text-[#4671D5]' :
                              currentDashboardLevel === 5 ? 'text-[#EC4D58]' :
                              currentDashboardLevel === 6 ? 'text-[#8A8A8A]' :
                              'text-[#ec4d58]'
                            }`
                      } ${isExpanded ? 'visible' : ''} delayed-${Math.min(index + 1, 6)}`}
                    >
                      {item.label}
                      {/* Notificación de nuevas respuestas */}
                      {item.label === 'Feedback' && hasNewResponses() && (
                        <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      )}
                    </span>
                  )}
                  </Link>
                )}
              </li>
            );
          })}


        </ul>
      </nav>

      {/* Footer - estilo WhatsApp */}
      {showFooter && (
        <div className="flex-shrink-0 p-2 border-t border-gray-800/30 rounded-b-xl">
          <div className="space-y-1">
            <Link 
              href={
                currentDashboardLevel === 6 ? '/dashboard/maestro/perfil' :
                currentDashboardLevel === 5 ? '/dashboard/darth/perfil' :
                currentDashboardLevel === 4 ? '/dashboard/lord/perfil' :
                currentDashboardLevel === 3 ? '/dashboard/warrior/perfil' :
                currentDashboardLevel === 2 ? '/dashboard/acolito/perfil' :
                '/dashboard/iniciado/perfil'
              } 
              className="group relative flex items-center py-2 px-3 text-gray-300 hover:bg-[#232323] rounded-lg transition-all duration-200 ease-in-out w-full"
              title={!isExpanded ? "Perfil" : undefined}
            >
              <span className={`text-xl w-6 h-6 flex items-center justify-center transition-all duration-200 text-white overflow-hidden ${
                currentDashboardLevel === 1 ? 'group-hover:text-[#fafafa]' :
                currentDashboardLevel === 2 ? 'group-hover:text-[#FFD447]' :
                currentDashboardLevel === 3 ? 'group-hover:text-green-400' :
                currentDashboardLevel === 4 ? 'group-hover:text-blue-400' :
                currentDashboardLevel === 5 ? 'group-hover:text-red-500' :
                currentDashboardLevel === 6 ? 'group-hover:text-[#8a8a8a]' :
                'group-hover:text-[#ec4d58]'
              } ${isExpanded ? 'mr-3' : ''}`}>
                {userAvatar ? (
                  <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-[#1a1a1a] relative">
                    <img 
                      src={userAvatar}
                      alt="Avatar"
                      className="absolute inset-0 w-full h-full object-cover object-center"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        aspectRatio: '1 / 1'
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#ec4d58] to-[#d43d48] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">U</span>
                  </div>
                )}
              </span>
              {isExpanded && (
                <span className="font-medium text-white group-hover:text-white transition-colors">
                  Perfil
                </span>
              )}
            </Link>
            

            
            <button 
              onClick={async () => {
                if (typeof window !== 'undefined') {
                  // Usar la función de logout del AuthContext
                  if (authContext?.signOut) {
                    await authContext.signOut();
                  }
                  // Redirigir a signin
                  window.location.href = '/login/signin';
                }
              }}
              className="group relative flex items-center py-2 px-3 text-gray-300 hover:bg-[#232323] rounded-lg transition-all duration-200 ease-in-out w-full"
              title={!isExpanded ? "Salir" : undefined}
            >
              <span className={`text-xl w-6 h-6 flex items-center justify-center transition-all duration-200 text-white ${
                currentDashboardLevel === 1 ? 'group-hover:text-[#fafafa]' :
                currentDashboardLevel === 2 ? 'group-hover:text-[#FFD447]' :
                currentDashboardLevel === 3 ? 'group-hover:text-green-400' :
                currentDashboardLevel === 4 ? 'group-hover:text-blue-400' :
                currentDashboardLevel === 5 ? 'group-hover:text-red-500' :
                currentDashboardLevel === 6 ? 'group-hover:text-[#8a8a8a]' :
                'group-hover:text-[#ec4d58]'
              } ${isExpanded ? 'mr-3' : ''}`}>
                <LogOut size={24} />
              </span>
              {isExpanded && (
                <span className="font-medium text-white group-hover:text-white transition-colors">
                  Salir
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Removed FeedbackModalEnhanced - now using dedicated page */}

    </aside>
  );
}