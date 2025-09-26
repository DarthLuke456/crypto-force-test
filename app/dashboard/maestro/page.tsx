'use client';

import React, { useState, useEffect } from 'react';
import { useSafeAuth } from '@/context/AuthContext-working';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  TrendingUp, 
  BarChart3, 
  Target,
  Award,
  Calendar,
  Clock,
  Activity,
  LineChart
} from 'lucide-react';
import Link from 'next/link';

export default function MaestroDashboardPage() {
  const [systemStats, setSystemStats] = useState({
    totalModules: 18, // 8 teóricos + 10 prácticos
    theoreticalModules: 8,
    practicalModules: 10,
    totalCheckpoints: 9,
    systemUptime: '99.8%',
    lastBackup: new Date().toLocaleDateString('es-ES'),
    activeSessions: 0,
    totalStorage: '2.4 GB'
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemStats = async () => {
      try {
        // Para AuthContext offline, no necesitamos token de Supabase
        // Simular datos del sistema
        setSystemStats(prev => ({
          ...prev,
          activeSessions: 1, // Usuario actual
          totalStorage: '2.4 GB'
        }));
      } catch (error) {
        console.error('Error fetching system stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemStats();
  }, []);

  const quickStats = [
    {
      title: 'Módulos Teóricos',
      value: systemStats.theoreticalModules,
      icon: BookOpen,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      href: '/dashboard/maestro/courses'
    },
    {
      title: 'Módulos Prácticos',
      value: systemStats.practicalModules,
      icon: Target,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      href: '/dashboard/maestro/courses'
    },
    {
      title: 'Puntos de Control',
      value: systemStats.totalCheckpoints,
      icon: Award,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      href: '/dashboard/maestro/courses'
    },
    {
      title: 'Sesiones Activas',
      value: systemStats.activeSessions,
      icon: Activity,
      color: 'text-[#8A8A8A]',
      bgColor: 'bg-[#8A8A8A]/20',
      href: '/dashboard/maestro/students'
    }
  ];

  const quickActions = [
    {
      title: 'Analytics',
      description: 'Métricas y estadísticas del sistema',
      icon: BarChart3,
      href: '/dashboard/maestro/analytics',
      color: 'text-[#8A8A8A]',
      bgColor: 'bg-[#8A8A8A]/20'
    },
    {
      title: 'Estudiantes',
      description: 'Gestión de usuarios del sistema',
      icon: Users,
      href: '/dashboard/maestro/students',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Cursos',
      description: 'Administración de contenido educativo',
      icon: BookOpen,
      href: '/dashboard/maestro/courses',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Configuración',
      description: 'Ajustes del sistema',
      icon: Users, // Changed from Settings to Users as Settings icon is not imported
      href: '/dashboard/maestro/settings',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8A8A8A]"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none min-w-0">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#8A8A8A] mb-2">
          Dashboard Maestro
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-400">
          Panel de control y gestión del sistema educativo Crypto Force
        </p>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        {quickStats.map((stat, index) => (
          <Link key={index} href={stat.href}>
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-3 sm:p-4 lg:p-6 hover:border-[#8A8A8A] transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3">
                <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-white font-medium text-sm sm:text-base mb-1">
                    {stat.title}
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#8A8A8A]">
                    {stat.value}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Acciones Rápidas */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-3 sm:mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-4 sm:p-5 lg:p-6 hover:border-[#8A8A8A] transition-all duration-300 hover:scale-105">
                <div className="flex items-start gap-3">
                  <div className={`p-2 sm:p-3 rounded-lg ${action.bgColor}`}>
                    <action.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${action.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-medium text-sm sm:text-base mb-1">
                      {action.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Estado del Sistema */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-3 sm:mb-4">
          Estado del Sistema
        </h2>
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-3 sm:p-4 lg:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-400 mb-1">
                {systemStats.systemUptime}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Uptime del Sistema</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-400 mb-1">
                {systemStats.lastBackup}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Último Backup</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-400 mb-1">
                {systemStats.totalStorage}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Almacenamiento</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#8A8A8A] mb-1">
                {systemStats.totalModules}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Total Módulos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Información del Sistema */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-3 sm:mb-4">
          Información del Sistema
        </h2>
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-3 sm:p-4 lg:p-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-[#2a2a2a] rounded-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                <span className="text-white text-sm sm:text-base">Base de Datos</span>
              </div>
              <span className="text-green-400 text-sm sm:text-base">Operativa</span>
            </div>
            
            <div className="flex items-center justify-between p-3 sm:p-4 bg-[#2a2a2a] rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                <span className="text-white text-sm sm:text-base">Autenticación</span>
              </div>
              <span className="text-green-400 text-sm sm:text-base">Activa</span>
            </div>
            
            <div className="flex items-center justify-between p-3 sm:p-4 bg-[#2a2a2a] rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                <span className="text-white text-sm sm:text-base">Última Actualización</span>
              </div>
              <span className="text-gray-400 text-sm sm:text-base">
                {new Date().toLocaleTimeString('es-ES')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional del sistema */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-3 sm:mb-4">
          Información Adicional
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-[#1a1a1a] border border-[#232323] rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#fafafa]">Sistema de Usuarios</h3>
              <Users className="w-6 h-6 text-[#8A8A8A]" />
            </div>
            <p className="text-[#8A8A8A] text-sm mb-4">
              Gestiona estudiantes, monitorea progreso y asigna roles en la plataforma.
            </p>
            <Link 
              href="/dashboard/maestro/students"
              className="inline-flex items-center text-[#8A8A8A] hover:text-[#fafafa] transition-colors"
            >
              Ver Estudiantes →
            </Link>
          </div>

          <div className="p-6 bg-[#1a1a1a] border border-[#232323] rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#fafafa]">Análisis de Datos</h3>
              <BarChart3 className="w-6 h-6 text-[#8A8A8A]" />
            </div>
            <p className="text-[#8A8A8A] text-sm mb-4">
              Accede a estadísticas detalladas y métricas de rendimiento del sistema.
            </p>
            <Link 
              href="/dashboard/maestro/analytics"
              className="inline-flex items-center text-[#8A8A8A] hover:text-[#fafafa] transition-colors"
            >
              Ver Analytics →
            </Link>
          </div>

          <div className="p-6 bg-[#1a1a1a] border border-[#232323] rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#fafafa]">TradingView Pro</h3>
              <LineChart className="w-6 h-6 text-[#8A8A8A]" />
            </div>
            <p className="text-[#8A8A8A] text-sm mb-4">
              Acceso completo a gráficos profesionales y herramientas de análisis técnico.
            </p>
            <Link 
              href="/dashboard/maestro/trading"
              className="inline-flex items-center text-[#8A8A8A] hover:text-[#fafafa] transition-colors"
            >
              Ir a TradingView →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
