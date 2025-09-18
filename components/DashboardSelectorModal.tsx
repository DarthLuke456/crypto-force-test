'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Crown,
  Shield,
  Sword,
  Eye,
  Flame,
  Star,
  Zap,
  Lock,
  Unlock
} from 'lucide-react';

interface DashboardSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDashboardLevel: number;
}

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
  requirements: string;
  benefits: string[];
}

export default function DashboardSelectorModal({ 
  isOpen, 
  onClose, 
  currentDashboardLevel 
}: DashboardSelectorModalProps) {
  const router = useRouter();

  const dashboardOptions: DashboardOption[] = [
    {
      id: 'iniciado',
      title: 'Iniciado',
      description: 'El primer paso en tu viaje hacia el dominio del trading',
      color: 'from-[#fafafa] to-[#e5e5e5]',
      icon: <Shield className="w-6 h-6 text-[#1a1a1a]" />,
      path: '/dashboard/iniciado',
      level: 1,
      emblem: 'I',
      philosophy: 'Fundamentos sólidos, mente clara',
      requirements: 'Nivel 1 o superior',
      benefits: [
        'Acceso a cursos básicos',
        'Comunidad de iniciados',
        'Herramientas fundamentales'
      ]
    },
    {
      id: 'acolito',
      title: 'Acólito',
      description: 'Desarrolla tu comprensión y habilidades avanzadas',
      color: 'from-[#ffd447] to-[#ffb347]',
      icon: <Eye className="w-6 h-6 text-[#1a1a1a]" />,
      path: '/dashboard/acolito',
      level: 2,
      emblem: 'A',
      philosophy: 'Observación aguda, análisis profundo',
      requirements: 'Nivel 2 o superior',
      benefits: [
        'Cursos intermedios',
        'Análisis técnico avanzado',
        'Mentoría personalizada'
      ]
    },
    {
      id: 'warrior',
      title: 'Warrior',
      description: 'Combate en los mercados con estrategias probadas',
      color: 'from-[#4671d5] to-[#2d5bb8]',
      icon: <Sword className="w-6 h-6 text-white" />,
      path: '/dashboard/warrior',
      level: 3,
      emblem: 'W',
      philosophy: 'Disciplina férrea, ejecución perfecta',
      requirements: 'Nivel 3 o superior',
      benefits: [
        'Estrategias de trading',
        'Gestión de riesgo',
        'Análisis fundamental'
      ]
    },
    {
      id: 'lord',
      title: 'Lord',
      description: 'Domina los mercados con sabiduría ancestral',
      color: 'from-[#8b5cf6] to-[#7c3aed]',
      icon: <Crown className="w-6 h-6 text-white" />,
      path: '/dashboard/lord',
      level: 4,
      emblem: 'L',
      philosophy: 'Sabiduría milenaria, poder supremo',
      requirements: 'Nivel 4 o superior',
      benefits: [
        'Estrategias avanzadas',
        'Análisis macroeconómico',
        'Mentoría exclusiva'
      ]
    },
    {
      id: 'darth',
      title: 'Darth',
      description: 'El lado oscuro del trading te hace más poderoso',
      color: 'from-[#ec4d58] to-[#dc2626]',
      icon: <Flame className="w-6 h-6 text-white" />,
      path: '/dashboard/darth',
      level: 5,
      emblem: 'D',
      philosophy: 'Poder absoluto, control total',
      requirements: 'Nivel 5 o superior',
      benefits: [
        'Estrategias oscuras',
        'Técnicas prohibidas',
        'Poder ilimitado'
      ]
    },
    {
      id: 'maestro',
      title: 'Maestro',
      description: 'La cúspide del conocimiento y poder en trading',
      color: 'from-[#f59e0b] to-[#d97706]',
      icon: <Star className="w-6 h-6 text-white" />,
      path: '/dashboard/maestro',
      level: 6,
      emblem: 'M',
      philosophy: 'Maestría total, iluminación completa',
      requirements: 'Nivel 6 o superior',
      benefits: [
        'Conocimiento supremo',
        'Acceso total',
        'Maestría absoluta'
      ]
    }
  ];

  const handleDashboardSelect = (path: string) => {
    router.push(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Seleccionar Dashboard
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-400 mt-2">
            Elige el dashboard que mejor se adapte a tu nivel actual
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardOptions.map((option) => {
              const isAccessible = option.level <= currentDashboardLevel;
              const isCurrent = option.level === currentDashboardLevel;
              
              return (
                <div
                  key={option.id}
                  className={`relative rounded-lg p-6 transition-all duration-300 ${
                    isAccessible 
                      ? 'cursor-pointer hover:scale-105 hover:shadow-2xl' 
                      : 'cursor-not-allowed opacity-50'
                  } ${
                    isCurrent 
                      ? 'ring-2 ring-yellow-500 ring-opacity-50' 
                      : ''
                  }`}
                  onClick={() => isAccessible && handleDashboardSelect(option.path)}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.color} rounded-lg opacity-10`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${option.color} flex items-center justify-center`}>
                        {option.icon}
                      </div>
                      <div className="text-right">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${option.color} flex items-center justify-center text-sm font-bold text-white`}>
                          {option.emblem}
                        </div>
                        <span className="text-xs text-gray-400">Nivel {option.level}</span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-bold text-white mb-2">{option.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{option.description}</p>

                    {/* Philosophy */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Filosofía</p>
                      <p className="text-sm text-gray-300 italic">"{option.philosophy}"</p>
                    </div>

                    {/* Requirements */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Requisitos</p>
                      <p className="text-sm text-gray-300">{option.requirements}</p>
                    </div>

                    {/* Benefits */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Beneficios</p>
                      <ul className="text-sm text-gray-300">
                        {option.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center">
                            <span className="text-yellow-500 mr-2">•</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between">
                      {isCurrent ? (
                        <span className="text-yellow-500 text-sm font-medium flex items-center">
                          <Zap className="w-4 h-4 mr-1" />
                          Dashboard Actual
                        </span>
                      ) : isAccessible ? (
                        <span className="text-green-500 text-sm font-medium flex items-center">
                          <Unlock className="w-4 h-4 mr-1" />
                          Accesible
                        </span>
                      ) : (
                        <span className="text-red-500 text-sm font-medium flex items-center">
                          <Lock className="w-4 h-4 mr-1" />
                          Bloqueado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#2a2a2a] bg-[#0f0f0f]">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Tu nivel actual: <span className="text-yellow-500 font-medium">{currentDashboardLevel}</span>
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Desbloquea nuevos dashboards subiendo de nivel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

