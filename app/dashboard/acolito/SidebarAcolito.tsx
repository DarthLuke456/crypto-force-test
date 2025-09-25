'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSafeAuth } from '@/context/AuthContext-working';
import { useAvatarUnified as useAvatar } from '@/hooks/useAvatarUnified';
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

interface SidebarAcolitoProps {
  isCollapsed?: boolean;
}

export default function SidebarAcolito({ isCollapsed = false }: SidebarAcolitoProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { userData, loading } = useSafeAuth();
  const { avatar: userAvatar } = useAvatar();
  const [showCompass, setShowCompass] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Mostrar compass si el usuario es de nivel superior
  useEffect(() => {
    if (userData && !loading) {
      const userLevel = userData.user_level;
      const currentDashboardLevel = 2; // Acólito = nivel 2
      
      // Mostrar compass si el usuario es Fundador (0) o de nivel superior (3-6)
      setShowCompass(userLevel === 0 || (userLevel !== undefined && userLevel > currentDashboardLevel));
      
      console.log('🔍 Sidebar Acólito - Debug:', {
        userLevel,
        currentDashboardLevel,
        showCompass: userLevel === 0 || (userLevel !== undefined && userLevel > currentDashboardLevel)
      });
    }
  }, [userData, loading]);

  const navigationItems = [
    { name: 'Inicio', href: '/dashboard/acolito', icon: HomeIcon },
    { name: 'Análisis', href: '/dashboard/acolito/analytics', icon: ChartBarIcon },
    { name: 'Estudiantes', href: '/dashboard/acolito/students', icon: UserGroupIcon },
    { name: 'Cursos', href: '/dashboard/acolito/courses', icon: BookOpenIcon },
    { name: 'Gráfico', href: '/dashboard/acolito/trading', icon: ChartPieIcon },
    { name: 'Niveles', href: '#', icon: MapIcon, isCompass: true },
    { name: 'Feedback', href: '#', icon: MessageSquare, isFeedback: true },
    { name: 'Configuración', href: '/dashboard/acolito/settings', icon: CogIcon },
  ];

  const handleCompassClick = () => {
    setIsModalOpen(true);
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
                      className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 hover:bg-[#FFD447]/10 hover:text-[#FFD447] hover:border-l-2 hover:border-l-[#FFD447]/50 rounded-md transition-colors"
                      title="Enviar Feedback"
                    >
                      <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-[#FFD447] text-gray-900 shadow-lg shadow-[#FFD447]/25'
                          : 'text-gray-300 hover:bg-[#FFD447]/10 hover:text-[#FFD447] hover:border-l-2 hover:border-l-[#FFD447]/50'
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
              <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden border-2 border-[#FFD447]">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#FFD447] flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-900">
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
              <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden border-2 border-[#FFD447]">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#FFD447] flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-900">
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
        currentDashboardLevel={2}
      />

      {/* Feedback Modal */}
      <FeedbackModalWithTabs
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </>
  );
}
