'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { supabase } from '@/lib/supabaseClient';
import { 
  Home, 
  BarChart3, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut,
  Menu,
  User,
  TrendingUp,
  Activity,
  Database,
  CheckCircle,
  Clock,
  Target,
  Award,
  Calendar,
  LineChart,
  UserPlus,
  Compass
} from 'lucide-react';
import { useSafeAuth } from '@/context/AuthContext';
import { useDarthSidebar } from '@/app/dashboard/darth/DarthSidebarContext';
import { useAvatar } from '@/hooks/useAvatar';
import { supabase } from '@/lib/supabaseClient';

interface MenuItem {
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
}

const menuItems: MenuItem[] = [
  {
    label: 'Inicio',
    href: '/dashboard/darth',
    icon: Home
  },
  {
    label: 'Analytics',
    href: '/dashboard/darth/analytics',
    icon: TrendingUp
  },
  {
    label: 'Usuarios',
    href: '/dashboard/darth/users',
    icon: Users
  },
  {
    label: 'Contenido',
    href: '/dashboard/darth/courses',
    icon: BookOpen
  },
  {
    label: 'Gráfico',
    href: '/dashboard/darth/trading',
    icon: LineChart
  },
  {
    label: 'Compartí',
    href: '/dashboard/darth/referral-code',
    icon: UserPlus
  },
  {
    label: 'Niveles',
    href: '/dashboard/darth/dashboard-selection',
    icon: Compass
  },
  {
    label: 'Configuración',
    href: '/dashboard/darth/settings',
    icon: Settings
  }
];

export default function DarthSidebar() {
  const { isExpanded, toggleSidebar } = useDarthSidebar();
  const pathname = usePathname();
  const { userData } = useSafeAuth();
  const { avatar: userAvatar } = useAvatar();
  const [mounted, setMounted] = useState(false);

  // Only after mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <aside className="h-full bg-gradient-to-b from-[#121212] to-[#0a0a0a] shadow-2xl flex flex-col border-r border-gray-800/50 transition-all duration-300 ease-in-out rounded-r-xl w-16">
        <div className="flex-shrink-0 h-16 flex items-center justify-center border-b border-gray-800/30 bg-transparent px-4 rounded-t-xl">
          <div className="w-12 h-12 rounded-full bg-gray-700 animate-pulse"></div>
        </div>
      </aside>
    );
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <aside
      className={`h-full bg-gradient-to-b from-[#121212] to-[#0a0a0a] shadow-2xl flex flex-col border-r border-gray-800/50 transition-all duration-300 ease-in-out rounded-r-xl ${
        isExpanded ? "w-48" : "w-16"
      }`}
    >
      <style jsx>{`
        .sidebar-text {
          transition: all 0.3s ease-in-out;
          opacity: 0;
          transform: translateX(-10px);
        }
        
        .sidebar-text.visible {
          opacity: 1;
          transform: translateX(0);
        }
        
        .sidebar-text.delayed-1 {
          transition-delay: 0.05s;
        }
        
        .sidebar-text.delayed-2 {
          transition-delay: 0.1s;
        }
        
        .sidebar-text.delayed-3 {
          transition-delay: 0.15s;
        }
        
        .sidebar-text.delayed-4 {
          transition-delay: 0.2s;
        }
        
        .sidebar-text.delayed-5 {
          transition-delay: 0.25s;
        }
        
        .sidebar-text.delayed-6 {
          transition-delay: 0.3s;
        }
        
        .sidebar-text.delayed-footer-1 {
          transition-delay: 0.35s;
        }
        
        .sidebar-text.delayed-footer-2 {
          transition-delay: 0.4s;
        }
      `}</style>
      
      {/* Header con imagen circular de Darth */}
      <div className="flex-shrink-0 h-16 flex items-center justify-center border-b border-gray-800/30 bg-transparent px-4 rounded-t-xl">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <Image
            src="/images/insignias/5-darths.png"
            alt="Darth"
            width={48}
            height={48}
            className="w-full h-full object-cover"
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        </div>
      </div>


      {/* Toggle button separado arriba */}
      <div className="flex-shrink-0 p-3 border-b border-gray-800/30">
        <button
          onClick={toggleSidebar}
          className="group relative flex items-center py-3 px-3 text-gray-400 hover:bg-[#232323] rounded-lg transition-all duration-200 ease-in-out w-full justify-center"
          title={isExpanded ? "Contraer" : "Expandir"}
        >
          <span className="flex items-center justify-center text-xl w-6 h-6 transition-all duration-200 text-gray-400 group-hover:text-[#8A8A8A]">
            <Menu size={20} />
          </span>
        </button>
      </div>

      {/* Navigation - estilo WhatsApp */}
      <nav className="flex-1 py-4 px-3">
        <ul className="space-y-1">
          {/* Elementos de navegación */}
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`group relative flex items-center py-3 px-3 text-gray-300 hover:bg-[#232323] rounded-lg transition-all duration-200 ease-in-out w-full ${
                    isExpanded ? 'justify-start text-left gap-x-3' : 'justify-center'
                  } ${isActive ? 'bg-[#8A8A8A] text-white' : ''}`}
                  title={!isExpanded ? item.label : undefined}
                >
                  {/* Active indicator - línea gris como Darth */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#8A8A8A] rounded-r-full"></div>
                  )}
                  
                  <span
                    className={`flex items-center justify-center text-xl w-6 h-6 transition-all duration-200 ${
                      isActive 
                        ? 'text-white' 
                        : 'text-gray-400 group-hover:text-[#8A8A8A]'
                    } ${isExpanded ? 'mr-3' : ''}`}
                  >
                    <item.icon size={20} />
                  </span>
                  
                  {isExpanded && (
                    <span 
                      className={`font-medium whitespace-nowrap sidebar-text ${
                        isActive 
                          ? 'text-white' 
                          : 'text-gray-300 group-hover:text-[#8A8A8A]'
                      } ${isExpanded ? 'visible' : ''} delayed-${Math.min(index + 1, 6)}`}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Separador */}
        <div className="my-4 border-t border-gray-800/30"></div>

        {/* Botones de Perfil y Salir - movidos aquí para mejor accesibilidad */}
        <div className="space-y-1">
          <Link 
            href="/dashboard/darth/perfil" 
            className="group relative flex items-center py-3 px-3 text-gray-300 hover:bg-[#232323] rounded-lg transition-all duration-200 ease-in-out w-full"
            title={!isExpanded ? "Perfil" : undefined}
          >
            <span className={`text-xl w-6 h-6 flex items-center justify-center transition-all duration-200 text-gray-400 group-hover:text-[#8A8A8A] ${isExpanded ? 'mr-3' : ''}`}>
              <Image
                src={userAvatar || '/images/default-avatar.png'}
                alt="Perfil"
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover"
              />
            </span>
            {isExpanded && (
              <span 
                className={`font-medium text-gray-300 group-hover:text-[#8A8A8A] sidebar-text ${isExpanded ? 'visible' : ''} delayed-profile`}
              >
                Perfil
              </span>
            )}
          </Link>
          
          <button 
            onClick={handleSignOut}
            className="group relative flex items-center py-3 px-3 text-gray-300 hover:bg-[#232323] rounded-lg transition-all duration-200 ease-in-out w-full"
            title={!isExpanded ? "Salir" : undefined}
          >
            <span className={`text-xl w-6 h-6 flex items-center justify-center transition-all duration-200 text-gray-400 group-hover:text-[#8A8A8A] ${isExpanded ? 'mr-3' : ''}`}>
              <LogOut size={20} />
            </span>
            {isExpanded && (
              <span 
                className={`font-medium text-gray-300 group-hover:text-[#8A8A8A] sidebar-text ${isExpanded ? 'visible' : ''} delayed-logout`}
              >
                Salir
              </span>
            )}
          </button>
        </div>
      </nav>
    </aside>
    </>
  );
}
