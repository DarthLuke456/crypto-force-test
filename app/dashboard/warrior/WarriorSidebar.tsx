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
  Menu,
  X,
  Sword,
  Compass
} from 'lucide-react';
import { useSafeAuth } from '@/context/AuthContext';


export default function WarriorSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const { userData } = useSafeAuth();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard/warrior', icon: Home },
    { name: 'Cursos', href: '/dashboard/warrior/courses', icon: BookOpen },
    { name: 'Prácticas', href: '/dashboard/warrior/practices', icon: Target },
    { name: 'Comunidad', href: '/dashboard/warrior/community', icon: Users },
    { name: 'Configuración', href: '/dashboard/warrior/settings', icon: Settings },
  ];



  return (
    <>
      {/* Botón móvil para abrir sidebar */}
      <button
        onClick={() => setIsExpanded(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Overlay móvil */}
      {isExpanded && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        transform ${isExpanded ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        transition-transform duration-300 ease-in-out
        w-64 bg-[#1a1a1a] border-r border-[#2a2a2a]
        flex flex-col
      `}>
        
        {/* Header con insignia */}
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 relative">
              <Image
                src="/images/insignias/3-warriors.png"
                alt="Insignia de Warrior"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">WARRIOR</h2>
              <p className="text-[#8a8a8a] text-sm">Integración de disciplina y pasión</p>
            </div>
          </div>
        </div>

        {/* Botón cerrar móvil */}
        <button
          onClick={() => setIsExpanded(false)}
          className="md:hidden absolute top-4 right-4 p-2 text-[#8a8a8a] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

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


        </nav>

        {/* Footer con información del usuario */}
        <div className="p-4 border-t border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#3ed598] rounded-full flex items-center justify-center">
              <Sword className="w-4 h-4 text-[#1a1a1a]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {userData?.nickname || userData?.nombre || 'Usuario'}
              </p>
              <p className="text-[#8a8a8a] text-xs truncate">
                Nivel {userData?.user_level || 3}
              </p>
            </div>
          </div>
        </div>
      </div>


    </>
  );
}
