'use client';

import React, { useState } from 'react';
import { useSafeAuth } from '@/context/AuthContext-working';
import { 
  Crown,
  Shield,
  Sword,
  Eye,
  Flame,
  Star,
  Zap,
  Lock,
  Unlock,
  User,
  Users,
  Settings,
  ChevronDown,
  Edit,
  Key,
  Mail,
  Phone,
  Globe,
  Camera,
  MessageSquare,
  Share2,
  CheckCircle,
  Award,
  Target
} from 'lucide-react';
import Image from 'next/image';
import { getUserProfilePath, getLevelDisplayName, MAESTRO_AUTHORIZED_EMAILS } from '@/utils/dashboardUtils';

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

export default function MaestroLevelsPage() {
  const { userData } = useSafeAuth();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  // Opciones de dashboard
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
      requirements: 'Registro en la plataforma',
      benefits: ['Acceso a contenido básico', 'Soporte comunitario']
    },
    {
      id: 'acolito',
      title: 'ACÓLITO',
      color: '#3B82F6',
      icon: <Sword className="w-8 h-8" />,
      path: '/dashboard/acolito',
      level: 2,
      emblem: '🔵',
      description: 'El aprendiz que comienza a dominar las artes',
      philosophy: 'Disciplina y aprendizaje constante',
      image: '/images/insignias/2-acolitos.png',
      requirements: 'Completar 5 trades exitosos',
      benefits: ['Estrategias básicas', 'Análisis técnico']
    },
    {
      id: 'warrior',
      title: 'WARRIOR',
      color: '#EF4444',
      icon: <Flame className="w-8 h-8" />,
      path: '/dashboard/warrior',
      level: 3,
      emblem: '🔴',
      description: 'El guerrero que domina el campo de batalla',
      philosophy: 'Valor y determinación en cada movimiento',
      image: '/images/insignias/3-warriors.png',
      requirements: 'Completar 20 trades exitosos',
      benefits: ['Estrategias avanzadas', 'Gestión de riesgo']
    },
    {
      id: 'lord',
      title: 'LORD',
      color: '#8B5CF6',
      icon: <Crown className="w-8 h-8" />,
      path: '/dashboard/lord',
      level: 4,
      emblem: '🟣',
      description: 'El señor que comanda con sabiduría',
      philosophy: 'Liderazgo y visión estratégica',
      image: '/images/insignias/4-lords.png',
      requirements: 'Completar 50 trades exitosos',
      benefits: ['Estrategias de alto nivel', 'Mentoría']
    },
    {
      id: 'darth',
      title: 'DARTH',
      color: '#F59E0B',
      icon: <Eye className="w-8 h-8" />,
      path: '/dashboard/darth',
      level: 5,
      emblem: '🟠',
      description: 'El maestro oscuro del poder',
      philosophy: 'Dominio absoluto de las fuerzas del mercado',
      image: '/images/insignias/5-darths.png',
      requirements: 'Completar 100 trades exitosos',
      benefits: ['Estrategias exclusivas', 'Acceso VIP']
    },
    {
      id: 'maestro',
      title: 'MAESTRO',
      color: '#8a8a8a',
      icon: <Star className="w-8 h-8" />,
      path: '/dashboard/maestro',
      level: 6,
      emblem: '⭐',
      description: 'El maestro supremo del conocimiento',
      philosophy: 'Sabiduría infinita y enseñanza a otros',
      image: '/images/insignias/6-maestros.png',
      requirements: 'Ser invitado por un Maestro existente',
      benefits: ['Acceso total', 'Poder de enseñanza']
    }
  ];

  // Funciones de cálculo
  const calculateUserLevel = () => {
    if (!userData) return 1;
    if (userData.user_level === 0) return 0; // Fundadores
    return userData.user_level || 1;
  };

  const calculateRoleDisplayText = () => {
    if (!userData) return 'Iniciado';
    if (userData.user_level === 0) return 'Fundador';
    return getLevelDisplayName(userData);
  };

  const calculateRoleColor = () => {
    if (!userData) return '#8a8a8a';
    
    const isMaestroFundador = userData.email && MAESTRO_AUTHORIZED_EMAILS.includes(userData.email.toLowerCase().trim());
    
    if (isMaestroFundador) {
      return '#FF8C42'; // Color naranja para Maestros Fundadores
    }
    
    if (userData.user_level === 6) {
      return '#8a8a8a'; // Color gris para otros maestros
    }
    
    const option = dashboardOptions.find(o => o.level === userData.user_level);
    return option?.color || '#8a8a8a';
  };

  const userLevel = calculateUserLevel();
  const roleDisplayText = calculateRoleDisplayText();
  const getRoleColor = calculateRoleColor();

  // Función para verificar acceso a roles
  const canAccessRole = (roleLevel: number) => {
    if (!userData) return false;
    
    const currentUserEmail = userData.email;
    const isFundadorByEmail = currentUserEmail && MAESTRO_AUTHORIZED_EMAILS.includes(currentUserEmail.toLowerCase().trim());
    
    if (isFundadorByEmail) {
      return true;
    }
    
    const currentUserLevel = userData.user_level || 1;
    
    if (currentUserLevel === 6) {
      return true;
    }
    
    return roleLevel <= currentUserLevel;
  };

  // Verificar si es el nivel actual
  const isCurrentLevel = (option: DashboardOption) => {
    if (userData?.user_level === 0) {
      return option.level === 6; // Fundadores ven Maestro como actual
    }
    return option.level === userLevel;
  };

  // Obtener color de la opción
  const getOptionColor = (option: DashboardOption) => {
    if (isCurrentLevel(option)) {
      return getRoleColor;
    }
    if (option.level === 6) {
      const isMaestroFundador = userData?.email && MAESTRO_AUTHORIZED_EMAILS.includes(userData.email.toLowerCase().trim());
      return isMaestroFundador ? '#FF8C42' : '#8a8a8a';
    }
    return option.color;
  };

  // Función para navegar a dashboard específico
  const handleDashboardNavigation = (option: DashboardOption) => {
    console.log('🚀 Navegando a:', option.path);
    window.location.href = option.path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f]">
      {/* Header */}
      <div className="bg-[#1e1e1e]/50 backdrop-blur-sm border-b border-[#2a2a2a] mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#ec4d58] to-[#d43d48] rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#fafafa]">Sistema de Niveles</h1>
                <p className="text-[#8a8a8a]">Gestiona y supervisa todos los niveles de poder</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#fafafa] mb-4">
            Bienvenido, <span className="text-[#ec4d58]">{userData?.nickname || 'Maestro'}</span>
          </h2>
          <p className="text-xl text-[#8a8a8a] mb-6">
            Tu nivel actual: <span className="text-[#ec4d58] font-bold">{roleDisplayText}</span>
          </p>
          <p className="text-[#8a8a8a] text-lg max-w-3xl mx-auto">
            Como Maestro, tienes acceso completo a todos los niveles del sistema. Puedes supervisar, gestionar y guiar a los usuarios en su camino hacia el poder.
          </p>
        </div>

        {/* Estadísticas de niveles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#1e1e1e]/50 backdrop-blur-sm rounded-xl p-6 border border-[#2a2a2a]">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#ec4d58]/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-[#ec4d58]" />
              </div>
              <div>
                <p className="text-[#8a8a8a] text-sm">Total de Niveles</p>
                <p className="text-2xl font-bold text-[#fafafa]">6</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1e1e1e]/50 backdrop-blur-sm rounded-xl p-6 border border-[#2a2a2a]">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#ec4d58]/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#ec4d58]" />
              </div>
              <div>
                <p className="text-[#8a8a8a] text-sm">Niveles Desbloqueados</p>
                <p className="text-2xl font-bold text-[#fafafa]">6</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1e1e1e]/50 backdrop-blur-sm rounded-xl p-6 border border-[#2a2a2a]">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#ec4d58]/20 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-[#ec4d58]" />
              </div>
              <div>
                <p className="text-[#8a8a8a] text-sm">Tu Nivel</p>
                <p className="text-2xl font-bold text-[#fafafa]">{roleDisplayText}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de opciones de dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardOptions.map((option) => {
            const isCurrent = isCurrentLevel(option);
            const isAccessible = canAccessRole(option.level);
            const optionColor = getOptionColor(option);
            
            return (
              <div
                key={option.id}
                className={`group relative overflow-hidden rounded-xl border transition-all duration-300 transform hover:scale-105 ${
                  isCurrent
                    ? 'shadow-lg'
                    : isAccessible
                    ? 'border-[#2a2a2a] hover:border-[#3a3a3a]'
                    : 'border-[#1a1a1a] opacity-60'
                } ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                style={{
                  borderColor: isCurrent ? optionColor : undefined,
                  boxShadow: isCurrent ? `0 0 20px ${optionColor}20` : undefined
                }}
                onClick={() => isAccessible && handleDashboardNavigation(option)}
              >
                {/* Fondo con gradiente */}
                <div 
                  className="absolute inset-0 opacity-10 transition-opacity duration-300 group-hover:opacity-20"
                  style={{ background: `linear-gradient(135deg, ${optionColor}20, ${optionColor}10)` }}
                />
                
                {/* Contenido */}
                <div className="relative p-6">
                  {/* Emblema y nivel */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-4xl">{option.emblem}</div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#fafafa]">{option.title}</div>
                      <div className="text-sm text-[#8a8a8a]">Nivel {option.level}</div>
                    </div>
                  </div>

                  {/* Icono */}
                  <div className="flex justify-center mb-6">
                    <div
                      className="p-4 rounded-full"
                      style={{ backgroundColor: `${optionColor}20` }}
                    >
                      {option.icon}
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-[#fafafa] mb-2">{option.title}</h3>
                    <p className="text-[#8a8a8a] text-sm">{option.description}</p>
                  </div>

                  {/* Filosofía */}
                  <div className="mb-6">
                    <p className="text-[#8a8a8a] text-sm italic text-center">"{option.philosophy}"</p>
                  </div>

                  {/* Estado */}
                  <div className="text-center">
                    {isCurrent ? (
                      <div 
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
                        style={{ 
                          backgroundColor: `${optionColor}20`, 
                          color: optionColor 
                        }}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Nivel Actual
                      </div>
                    ) : isAccessible ? (
                      <div className="inline-flex items-center px-4 py-2 bg-[#ec4d58]/20 text-[#ec4d58] rounded-full text-sm font-medium">
                        <Unlock className="w-4 h-4 mr-2" />
                        Accesible
                      </div>
                    ) : (
                      <div className="inline-flex items-center px-4 py-2 bg-[#8a8a8a]/20 text-[#8a8a8a] rounded-full text-sm font-medium">
                        <Lock className="w-4 h-4 mr-2" />
                        Bloqueado
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Información adicional para Maestros */}
        <div className="mt-12 bg-[#1e1e1e]/50 backdrop-blur-sm rounded-xl p-8 border border-[#2a2a2a]">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#fafafa] mb-4">Poderes de Maestro</h3>
            <p className="text-[#8a8a8a] mb-6">
              Como Maestro, tienes acceso completo a todos los niveles y puedes supervisar el progreso de todos los usuarios.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-[#2a2a2a]/50 rounded-lg">
                <Target className="w-5 h-5 text-[#ec4d58]" />
                <span className="text-[#fafafa] text-sm">Supervisión Total</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-[#2a2a2a]/50 rounded-lg">
                <Settings className="w-5 h-5 text-[#ec4d58]" />
                <span className="text-[#fafafa] text-sm">Gestión Avanzada</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-[#2a2a2a]/50 rounded-lg">
                <Users className="w-5 h-5 text-[#ec4d58]" />
                <span className="text-[#fafafa] text-sm">Control de Usuarios</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-[#2a2a2a]/50 rounded-lg">
                <Crown className="w-5 h-5 text-[#ec4d58]" />
                <span className="text-[#fafafa] text-sm">Autoridad Suprema</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
