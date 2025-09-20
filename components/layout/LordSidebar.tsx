'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Home, 
  BookOpen, 
  Target, 
  Users, 
  Settings,
  Crown,
  Compass
} from 'lucide-react';
import { useSafeAuth } from '@/context/AuthContext-working';
import DashboardSelectorModal from '@/components/DashboardSelectorModal';

export default function LordSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDashboardSelector, setShowDashboardSelector] = useState(false);
  const { userData } = useSafeAuth();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard/lord', icon: Home },
    { name: 'Contenido', href: '/dashboard/lord/courses', icon: BookOpen },
    { name: 'Prácticas', href: '/dashboard/lord/practices', icon: Target },
    { name: 'Comunidad', href: '/dashboard/lord/community', icon: Users },
    { name: 'Configuración', href: '/dashboard/lord/settings', icon: Settings },
  ];

  // Mostrar compass si el usuario es Fundador (0) o de nivel superior (5-6)
  const shouldShowCompass = userData?.user_level === 0 || (userData?.user_level && userData.user_level > 4);

  return (
    <>
      {/* Sidebar */}
      <div className="w-48 bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col">
        
        {/* Header con insignia */}
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 relative">
              <Image
                src="/images/insignias/4-lords.png"
                alt="Insignia de Lord"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">LORD</h2>
              <p className="text-[#8a8a8a] text-sm">Visión estratégica y patrones elevados</p>
            </div>
          </div>
        </div>


        {/* Navegación */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-[#8a8a8a] hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
                    onClick={() => setIsExpanded(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Botón Cambiar Dashboard - solo visible si el usuario puede navegar */}
          {shouldShowCompass && (
            <div className="mt-6 pt-4 border-t border-[#2a2a2a]">
              <button
                onClick={() => setShowDashboardSelector(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-[#ec4d58] hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors group"
              >
                <Compass className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Cambiar Dashboard</span>
              </button>
            </div>
          )}
        </nav>

        {/* Footer con información del usuario */}
        <div className="p-4 border-t border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#4671d5] rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {userData?.nickname || userData?.nombre || 'Usuario'}
              </p>
              <p className="text-[#8a8a8a] text-xs truncate">
                Nivel {userData?.user_level || 4}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de selección de dashboard */}
      <DashboardSelectorModal
        isOpen={showDashboardSelector}
        onClose={() => setShowDashboardSelector(false)}
        currentDashboardLevel={4}
      />
    </>
  );
}
