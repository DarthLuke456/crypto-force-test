'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSafeAuth } from '@/context/AuthContext-working';
import { useAvatarUnified as useAvatarSync } from '@/hooks/useAvatarUnified';
import { 
  HomeIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  BookOpenIcon, 
  ChartPieIcon, 
  CogIcon,
  MapIcon
} from '@heroicons/react/24/outline';
import { MessageSquare } from 'lucide-react';
import DashboardSelectorModal from '@/components/DashboardSelectorModal';
import FeedbackModalWithTabs from '@/components/feedback/FeedbackModalWithTabs';

interface SidebarIniciadoProps {
  isCollapsed?: boolean;
}

export default function SidebarIniciado({ isCollapsed = false }: SidebarIniciadoProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { userData, loading } = useSafeAuth();
  const { avatar: userAvatar } = useAvatarSync();
  const [showCompass, setShowCompass] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Mostrar compass si el usuario es de nivel superior
  useEffect(() => {
    if (userData && !loading) {
      const userLevel = userData.user_level;
      const currentDashboardLevel = 1; // Iniciado = nivel 1
      
      // Verificar si es usuario fundador por email (backup)
      const isFundadorByEmail = Boolean(userData.email && ['infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com'].includes(userData.email.toLowerCase().trim()));
      
      // Mostrar compass si el usuario es Fundador (0), Maestro (6), o de nivel superior (2-5)
      // También incluir verificación por email como backup
      const shouldShowCompass = userLevel === 0 || userLevel === 6 || (userLevel !== undefined && userLevel > currentDashboardLevel) || isFundadorByEmail;
      
      setShowCompass(shouldShowCompass);
      
      console.log('🔍 Sidebar Iniciado - Debug:', {
        userLevel,
        currentDashboardLevel,
        email: userData.email,
        isFundadorByEmail,
        shouldShowCompass,
        showCompass: shouldShowCompass
      });
    }
  }, [userData, loading]);

  const navigationItems = [
    { name: 'Inicio', href: '/dashboard/iniciado', icon: HomeIcon },
    { name: 'Análisis', href: '/dashboard/iniciado/analytics', icon: ChartBarIcon },
    { name: 'Estudiantes', href: '/dashboard/iniciado/students', icon: UserGroupIcon },
    { name: 'Cursos', href: '/dashboard/iniciado/courses', icon: BookOpenIcon },
    { name: 'Gráfico', href: '/dashboard/iniciado/trading', icon: ChartPieIcon },
    { name: 'Niveles', href: '#', icon: MapIcon, isCompass: true },
    { name: 'Feedback', href: '#', icon: MessageSquare, isFeedback: true },
    { name: 'Configuración', href: '/dashboard/iniciado/settings', icon: CogIcon },
  ];

  const handleCompassClick = () => {
    console.log('🧭 [SIDEBAR] Navegando a dashboard-selection desde Iniciado');
    window.location.href = '/login/dashboard-selection';
  };

  const handleFeedbackClick = () => {
    setIsFeedbackModalOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-gray-900 text-white w-16 h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      <div className={`bg-gray-900 text-white transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-48'
      }`}>
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          {!isCollapsed && (
            <span className="text-xl font-bold text-white">Crypto Force</span>
          )}
          {isCollapsed && (
            <span className="text-xl font-bold text-white">CF</span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="mt-8">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const isCompassItem = item.isCompass;
              const isFeedbackItem = item.isFeedback;
              
              // Si es el botón de compass y no debe mostrarse, saltarlo
              if (isCompassItem && !showCompass) {
                return null;
              }
              
              return (
                <li key={item.name}>
                  {isCompassItem ? (
                    <button
                      onClick={handleCompassClick}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                      title="Seleccionar Dashboard"
                    >
                      <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </button>
                  ) : isFeedbackItem ? (
                    <button
                      onClick={handleFeedbackClick}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                      title="Enviar Feedback"
                    >
                      <item.icon className="h-5 w-5 mr-3 flex-shrink-0 text-[#ec4d58]" />
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-red-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>



        {/* User Info */}
        <div className="mt-auto p-4 border-t border-gray-700">
          {!isCollapsed && userData && (
            <div className="text-center">
              <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden border-2 border-red-600">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-red-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {userData.nickname?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-300 truncate px-2">
                {userData.nickname || 'Usuario'}
              </p>
            </div>
          )}
          {isCollapsed && userData && (
            <div className="text-center">
              <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden border-2 border-red-600">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-red-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {userData.nickname?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Selector Modal */}
      <DashboardSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentDashboardLevel={1}
      />

      {/* Feedback Modal */}
      <FeedbackModalWithTabs
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </>
  );
}
