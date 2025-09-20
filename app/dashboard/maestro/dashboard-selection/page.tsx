'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Crown,
  Shield,
  Sword,
  Eye,
  Flame,
  Star,
  Zap,
  Unlock
} from 'lucide-react';
import { useSafeAuth } from '@/context/AuthContext-working';

interface DashboardOption {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  path: string;
  level: number;
  emblem: string;
  philosophy: string;
  image: string;
  requirements: string;
  benefits: string[];
}

export default function MaestroDashboardSelectionPage() {
  const router = useRouter();
  const { userData, isReady } = useSafeAuth();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  // Mostrar loading mientras se verifica el acceso
  if (!isReady || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec4d58] mx-auto mb-4"></div>
          <p className="text-white">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Verificar que el usuario tenga user_level definido
  if (userData.user_level === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Error de Autenticación</h2>
          <p className="text-red-400 mb-4">No se pudo determinar tu nivel de usuario</p>
          <p className="text-gray-400 text-sm mb-6">Email: {userData.email}</p>
          <p className="text-gray-400 text-sm">Problema: user_level es undefined</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d43d48] transition-colors"
          >
            Recargar Página
          </button>
        </div>
      </div>
    );
  }

  // Debug: Verificar qué rol está detectando el sistema
  console.log('🔍 Dashboard Selection - Debug Info:', {
    userData: userData,
    userLevel: userData.user_level,
    userLevelType: typeof userData.user_level,
    userEmail: userData.email,
    isReady: isReady,
    fullUserData: JSON.stringify(userData, null, 2)
  });



  const dashboardOptions: DashboardOption[] = [
    {
      id: 'iniciado',
      title: 'INICIADO',
      color: '#FAFAFA',
      icon: <Shield className="w-8 h-8" />,
      path: '/dashboard/iniciado',
      level: 1,
      emblem: '⚪',
      description: 'El primer paso en el camino del poder',
      philosophy: 'Apertura al conocimiento y primeros pasos en el trading',
      image: '/images/insignias/1-iniciados.png',
      requirements: 'Acceso completo como Maestro',
      benefits: [
        'Explorar funcionalidades básicas',
        'Entender la experiencia del usuario',
        'Proporcionar mejor soporte'
      ]
    },
    {
      id: 'acolito',
      title: 'ACÓLITO',
      color: '#FFD447',
      icon: <Eye className="w-8 h-8" />,
      path: '/dashboard/acolito',
      level: 2,
      emblem: '🟡',
      description: 'Despertar de la sombra interior',
      philosophy: 'Iluminación de verdades ocultas y curiosidad por el poder',
      image: '/images/insignias/2-acolitos.png',
      requirements: 'Acceso completo como Maestro',
      benefits: [
        'Contenido avanzado',
        'Herramientas de análisis',
        'Acceso a mentorías'
      ]
    },
    {
      id: 'warrior',
      title: 'WARRIOR',
      color: '#3ED598',
      icon: <Sword className="w-8 h-8" />,
      path: '/dashboard/warrior',
      level: 3,
      emblem: '🟢',
      description: 'Integración de disciplina y pasión',
      philosophy: 'Energía controlada y crecimiento en habilidad y conciencia',
      image: '/images/insignias/3-warriors.png',
      requirements: 'Acceso completo como Maestro',
      benefits: [
        'Estrategias avanzadas',
        'Acceso a operaciones reales',
        'Comunidad exclusiva'
      ]
    },
    {
      id: 'lord',
      title: 'LORD',
      color: '#4671D5',
      icon: <Crown className="w-8 h-8" />,
      path: '/dashboard/lord',
      level: 4,
      emblem: '🔵',
      description: 'Visión estratégica y patrones elevados',
      philosophy: 'Autoridad, planificación y percepción elevada',
      image: '/images/insignias/4-lords.png',
      requirements: 'Acceso completo como Maestro',
      benefits: [
        'Liderazgo de equipos',
        'Estrategias maestras',
        'Acceso VIP completo'
      ]
    },
    {
      id: 'darth',
      title: 'DARTH',
      color: '#EC4D58',
      icon: <Flame className="w-8 h-8" />,
      path: '/dashboard/darth',
      level: 5,
      emblem: '🔴',
      description: 'Transmutación de la sombra en poder',
      philosophy: 'Dominio de la energía destructiva y creativa',
      image: '/images/insignias/5-darths.png',
      requirements: 'Acceso completo como Maestro',
      benefits: [
        'Poder máximo',
        'Control total',
        'Maestría absoluta'
      ]
    },
    {
      id: 'maestro',
      title: 'MAESTRO',
      color: '#8A8A8A',
      icon: <Star className="w-8 h-8" />,
      path: '/dashboard/maestro',
      level: 6,
      emblem: '⚫',
      description: 'Equilibrio, control absoluto y presencia silenciosa',
      philosophy: 'Maestría completa y autoridad sobre todos los niveles',
      image: '/images/insignias/6-maestros.png',
      requirements: 'Acceso completo como Maestro',
      benefits: [
        'Control total del sistema',
        'Acceso a todos los dashboards',
        'Autoridad máxima'
      ]
    }
  ];

  // Lista de emails autorizados para acceder a la dashboard de Maestro
  const MAESTRO_AUTHORIZED_EMAILS = [
    'infocryptoforce@gmail.com',
    'coeurdeluke.js@gmail.com'
  ];



  // Funciones helper para obtener información del nivel
  const getLevelName = (level: number): string => {
    // Para usuarios fundadores específicos, mostrar "Fundador" aunque tengan nivel 6
    if (userData.email && MAESTRO_AUTHORIZED_EMAILS.includes(userData.email.toLowerCase().trim())) {
      return 'Fundador';
    }
    
    switch (level) {
      case 0: return 'Fundador';
      case 1: return 'Iniciado';
      case 2: return 'Acólito';
      case 3: return 'Warrior';
      case 4: return 'Lord';
      case 5: return 'Darth';
      case 6: return 'Maestro';
      default: return 'Iniciado';
    }
  };

  const getLevelDescription = (level: number): string => {
    switch (level) {
      case 0: return 'Fundador del sistema con acceso completo a todos los niveles.';
      case 1: return 'Primer paso en el camino del poder. Acceso a funcionalidades básicas.';
      case 2: return 'Despertar de la sombra interior. Contenido avanzado y herramientas de análisis.';
      case 3: return 'Integración de disciplina y pasión. Estrategias avanzadas y operaciones reales.';
      case 4: return 'Visión estratégica y patrones elevados. Liderazgo de equipos y estrategias maestras.';
      case 5: return 'Transmutación de la sombra en poder. Poder máximo y control total.';
      case 6: return 'Equilibrio, control absoluto y presencia silenciosa. Acceso completo a todos los dashboards.';
      default: return 'Primer paso en el camino del poder.';
    }
  };

  // Filtrar dashboards según el nivel del usuario
  const getUserAccessibleDashboards = () => {
    // NO usar fallback si user_level es undefined - esto indica un problema de autenticación
    if (userData.user_level === undefined) {
      console.error('❌ ERROR: user_level es undefined - Problema de autenticación');
      console.log('🔍 Datos completos del usuario:', userData);
      return []; // No mostrar nada hasta que se resuelva el problema
    }
    
    const userLevel = userData.user_level;
    
    console.log('🔍 getUserAccessibleDashboards - Debug:', {
      userLevel,
      userLevelType: typeof userLevel,
      userEmail: userData.email,
      isFundador: userLevel === 0,
      isMaestro: userLevel === 6,
      isAuthorizedEmail: MAESTRO_AUTHORIZED_EMAILS.includes(userData.email?.toLowerCase().trim() || ''),
      totalOptions: dashboardOptions.length
    });
    
    // Fundador (0), Maestro (6) y usuarios con emails autorizados tienen acceso a TODOS los niveles
    if (userLevel === 0 || userLevel === 6 || MAESTRO_AUTHORIZED_EMAILS.includes(userData.email?.toLowerCase().trim() || '')) {
      console.log('🔍 Acceso completo - Mostrando todos los dashboards');
      return dashboardOptions;
    }
    
    // Para otros roles, solo mostrar su nivel y los inferiores
    const accessibleOptions = dashboardOptions.filter(option => option.level <= userLevel);
    console.log('🔍 Acceso limitado - Dashboards accesibles:', accessibleOptions.length);
    return accessibleOptions;
  };

  const accessibleDashboards = getUserAccessibleDashboards();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f]">
      {/* Header */}
      <div className="relative z-10 pt-8 pb-6 px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Navegación por <span className="text-[#8A8A8A]">Dashboards</span>
            </h1>
            <p className="text-[#8a8a8a] text-lg max-w-3xl mx-auto">
              Puedes explorar tu nivel actual y todos los niveles inferiores para entender 
              mejor la experiencia de cada usuario y proporcionar mejor soporte.
            </p>
          </div>

          {/* Información del Usuario */}
          <div className="bg-[#1e1e1e]/50 backdrop-blur-sm rounded-xl p-6 border border-[#2a2a2a] mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 relative">
                <Image
                  src={
                    userData.email && MAESTRO_AUTHORIZED_EMAILS.includes(userData.email.toLowerCase().trim())
                      ? '/images/insignias/6-founder.png'
                      : `/images/insignias/${userData.user_level || 1}-${getLevelName(userData.user_level || 1).toLowerCase()}s.png`
                  }
                  alt={`Insignia de ${getLevelName(userData.user_level || 1)}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />

              </div>
              <div className="text-center">
                <h3 className={`text-xl font-semibold ${
                  userData.email && MAESTRO_AUTHORIZED_EMAILS.includes(userData.email.toLowerCase().trim())
                    ? 'text-orange-500' // Naranja para Fundadores
                    : 'text-white'
                }`}>
                  Tu Rol: {getLevelName(userData.user_level || 1)}
                </h3>
                <p className="text-[#8a8a8a]">
                  Nivel {userData.user_level || 1}: {getLevelName(userData.user_level || 1).toUpperCase()}
                </p>
              </div>
            </div>
            <p className="text-[#a0a0a0] text-center text-sm">
              {getLevelDescription(userData.user_level || 1)}
            </p>
          </div>
        </div>
      </div>

      {/* Grid de roles */}
      <div className="relative z-10 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accessibleDashboards.map((option) => (
              <div
                key={option.id}
                className="group relative overflow-hidden rounded-xl border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => router.push(option.path)}
                onMouseEnter={() => setHoveredRole(option.id)}
                onMouseLeave={() => setHoveredRole(null)}
              >
                {/* Fondo con gradiente */}
                <div 
                  className="absolute inset-0 opacity-10 transition-opacity duration-300 group-hover:opacity-20"
                  style={{ background: `linear-gradient(135deg, ${option.color}20, ${option.color}10)` }}
                />
                
                {/* Contenido */}
                <div className="relative p-6">
                  {/* Header del emblema */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 relative">
                      <Image
                        src={option.image}
                        alt={`Insignia ${option.title}`}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Unlock className="w-5 h-5 text-green-400" />
                    </div>
                  </div>

                  {/* Título y descripción */}
                  <h3 className="text-white text-xl font-semibold mb-2">{option.title}</h3>
                  <p className="text-[#8a8a8a] text-sm mb-4">{option.description}</p>

                  {/* Filosofía */}
                  <div className="bg-[#1a1a1a]/50 rounded-lg p-3 border border-[#2a2a2a] mb-4">
                    <p className="text-[#a0a0a0] text-xs leading-relaxed">
                      {option.philosophy}
                    </p>
                  </div>

                  {/* Requisitos */}
                  <div className="mb-4">
                    <h4 className="text-[#8a8a8a] text-xs font-semibold mb-2">REQUISITOS</h4>
                    <p className="text-[#a0a0a0] text-xs">{option.requirements}</p>
                  </div>

                  {/* Beneficios */}
                  <div className="mb-4">
                    <h4 className="text-[#8a8a8a] text-xs font-semibold mb-2">BENEFICIOS</h4>
                    <ul className="space-y-1">
                      {option.benefits.map((benefit, index) => (
                        <li key={index} className="text-[#a0a0a0] text-xs flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: option.color }}></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Botón de acceso */}
                  <button
                    onClick={() => router.push(option.path)}
                    className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-105 cursor-pointer"
                    style={{
                      backgroundColor: option.color + '20',
                      border: `1px solid ${option.color}40`,
                      // Asegurar contraste adecuado para el texto
                      color: '#FFFFFF'
                    }}
                  >
                    Explorar Dashboard
                  </button>
                </div>

                {/* Borde de color sutil */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300"
                  style={{ backgroundColor: option.color }}
                />
              </div>
            ))}
          </div>

          {/* Mensaje informativo */}
          <div className="text-center mt-8">
            <div className="bg-[#1e1a1a]/50 border border-[#2a2a2a] rounded-xl p-6 max-w-2xl mx-auto">
              <Star className="w-8 h-8 text-[#8A8A8A] mx-auto mb-3" />
              <h3 className="text-white text-lg font-semibold mb-2">Navegación Inteligente</h3>
              <p className="text-[#8a8a8a] text-sm">
                Puedes explorar tu nivel actual y todos los niveles inferiores. Esto te permite entender 
                mejor la experiencia de cada usuario y proporcionar mejor soporte según sea necesario.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fondo con elementos sutiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 border border-[#2a2a2a] transform rotate-45 opacity-20"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-[#2a2a2a] transform -rotate-45 opacity-20"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 border border-[#2a2a2a] transform rotate-12 opacity-20"></div>
        <div className="absolute bottom-40 right-1/4 w-28 h-28 border border-[#2a2a2a] transform -rotate-12 opacity-20"></div>
      </div>
    </div>
  );
}
