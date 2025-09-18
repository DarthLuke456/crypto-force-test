'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BarChart3, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useSafeAuth } from '@/context/AuthContext';
import { useAvatar } from '@/hooks/useAvatar';

interface MenuItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
}

const menuItems: MenuItem[] = [
  {
    href: '/dashboard/maestro',
    icon: Home,
    label: 'Dashboard',
    description: 'Vista general'
  },
  {
    href: '/dashboard/maestro/analytics',
    icon: BarChart3,
    label: 'Análisis',
    description: 'Métricas y reportes'
  },
  {
    href: '/dashboard/maestro/users',
    icon: Users,
    label: 'Usuarios',
    description: 'Gestión de usuarios'
  },
  {
    href: '/dashboard/maestro/courses',
    icon: BookOpen,
    label: 'Contenido',
    description: 'Material educativo'
  },
  {
    href: '/dashboard/maestro/settings',
    icon: Settings,
    label: 'Configuración',
    description: 'Ajustes del sistema'
  }
];

export default function MaestroSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { signOut, userData } = useSafeAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={`
      fixed left-0 top-0 h-full bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-r border-[#333] z-40
      transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-72'}
    `}>
      {/* Header con insignia de maestro */}
      <div className="p-4 border-b border-[#333]">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/insignias/6-maestros.png"
                  alt="Maestro"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm">
                  Panel Maestro
                </span>
                <span className="text-[#ec4d58] text-xs font-medium">
                  CRYPTO FORCE
                </span>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Información del usuario */}
      {!isCollapsed && userData && (
        <div className="p-4 border-b border-[#333]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#ec4d58] to-[#f73b3b] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {userData.nombre?.charAt(0)?.toUpperCase() || 'M'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {userData.nombre || 'Maestro'}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {userData.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center px-3 py-3 rounded-lg transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-[#ec4d58] to-[#f73b3b] text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-medium">
                        {item.label}
                      </span>
                      {item.description && (
                        <span className="block text-xs opacity-75 truncate">
                          {item.description}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {isActive && !isCollapsed && (
                    <div className="w-2 h-2 bg-white rounded-full ml-auto" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer con logout */}
      <div className="p-4 border-t border-[#333]">
        <button
          onClick={handleSignOut}
          className={`
            w-full flex items-center px-3 py-3 rounded-lg text-gray-300 
            hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
          {!isCollapsed && (
            <span className="text-sm font-medium">Cerrar Sesión</span>
          )}
        </button>
      </div>
    </div>
  );
}
