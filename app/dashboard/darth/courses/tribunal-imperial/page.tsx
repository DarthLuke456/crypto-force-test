'use client';

import { useState, useEffect } from 'react';
import { Crown, FileText, CheckCircle, XCircle, Clock, Users, BarChart3, Plus, Eye, Save, ArrowLeft } from 'lucide-react';
import { useSafeAuth } from '@/context/AuthContext';
import { canUserAccessTribunal } from '@/lib/tribunal/permissions';
import ContentEditor from '@/components/tribunal/ContentEditor';
import { ContentBlock } from '@/lib/tribunal/types';
import { getTotalSystemUsers } from '@/lib/tribunal/system-users';

interface TribunalStats {
  propuestasPendientes: number;
  propuestasAprobadas: number;
  propuestasRechazadas: number;
  maestrosActivos: number;
}

export default function TribunalImperialPage() {
  const { userData, loading, isReady } = useSafeAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'propuestas' | 'crear' | 'votacion' | 'aprobados' | 'rechazados'>('overview');
  const [stats, setStats] = useState<TribunalStats>({
    propuestasPendientes: 0,
    propuestasAprobadas: 0,
    propuestasRechazadas: 0,
    maestrosActivos: 0
  });

  useEffect(() => {
    if (!isReady || !userData || !canUserAccessTribunal(userData.user_level)) {
      return;
    }

    // Cargar estadísticas de usuarios del sistema de forma asíncrona
    const loadUserStats = async () => {
      try {
        const totalUsers = await getTotalSystemUsers();
        setStats({
          propuestasPendientes: 3,
          propuestasAprobadas: 12,
          propuestasRechazadas: 2,
          maestrosActivos: totalUsers
        });
      } catch (error) {
        console.error('Error al cargar estadísticas de usuarios:', error);
        // Fallback a estadísticas básicas
    setStats({
      propuestasPendientes: 3,
      propuestasAprobadas: 12,
      propuestasRechazadas: 2,
          maestrosActivos: 0
    });
      }
    };

    loadUserStats();
  }, [userData, isReady]);

  // Si no tiene acceso, no renderizar nada
  if (!isReady || !userData || !canUserAccessTribunal(userData.user_level)) {
    return null;
  }

  const handleSaveProposal = (content: ContentBlock[]) => {
    console.log('Contenido guardado:', content);
    alert('Propuesta guardada exitosamente. Será enviada al Tribunal para votación.');
    setActiveTab('propuestas');
  };

  const handlePreviewContent = (content: ContentBlock[]) => {
    console.log('Vista previa:', content);
    // La vista previa se maneja internamente en el ContentEditor
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header del Tribunal Imperial */}
      <div className="bg-gradient-to-r from-[#121212] to-[#2a2a2a] border-b border-[#333] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-[#fafafa] to-[#8a8a8a] rounded-lg">
              <Crown size={32} className="text-[#121212]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#fafafa]">TRIBUNAL IMPERIAL</h1>
              <p className="text-gray-300">Sistema de Creación y Aprobación de Contenido Educativo</p>
              <p className="text-sm text-gray-400 mt-1">
                Accediendo como: {userData.user_level === 5 ? 'Darth' : 'Maestro'} - {userData.email}
              </p>
            </div>
          </div>
          
          {/* Botón Volver a Courses */}
          <a
            href="/dashboard/darth/courses"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver a Courses</span>
          </a>
        </div>
      </div>

      {/* Navegación Principal - Tabs Consolidados */}
      <div className="bg-[#121212] border-b border-[#333] p-4">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Vista General', icon: <BarChart3 size={20} /> },
            { id: 'propuestas', label: 'Propuestas', icon: <FileText size={20} /> },
            { id: 'crear', label: 'Crear', icon: <Plus size={20} /> },
            { id: 'votacion', label: 'Votación', icon: <Users size={20} /> },
            { id: 'aprobados', label: 'Aprobados', icon: <CheckCircle size={20} /> },
            { id: 'rechazados', label: 'Rechazados', icon: <XCircle size={20} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 min-w-[120px] ${
                activeTab === tab.id
                  ? 'bg-[#fafafa] text-[#121212] font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-[#333]'
              }`}
            >
              <div className="flex items-center justify-center w-5 h-5">
              {tab.icon}
              </div>
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="p-6">
        {/* TAB: Vista General */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Estadísticas del Tribunal */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-[#fafafa] to-[#8a8a8a] p-6 rounded-lg text-[#121212]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-80">Propuestas Pendientes</p>
                    <p className="text-3xl font-bold">{stats.propuestasPendientes}</p>
                  </div>
                  <Clock size={32} />
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#10B981] to-[#059669] p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-80">Aprobadas</p>
                    <p className="text-3xl font-bold">{stats.propuestasAprobadas}</p>
                  </div>
                  <CheckCircle size={32} />
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-80">Rechazadas</p>
                    <p className="text-3xl font-bold">{stats.propuestasRechazadas}</p>
                  </div>
                  <XCircle size={32} />
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#8a8a8a] to-[#6a6a6a] p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-90">Maestros Activos</p>
                    <p className="text-3xl font-bold">{stats.maestrosActivos}</p>
                  </div>
                  <Users size={32} />
                </div>
              </div>
            </div>

            {/* Información del Sistema */}
            <div className="bg-[#121212] border border-[#333] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#fafafa] mb-4">¿Cómo Funciona el Tribunal Imperial?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#fafafa] rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText size={24} className="text-[#121212]" />
                  </div>
                  <h3 className="font-semibold mb-2">1. Creación de Propuestas</h3>
                  <p className="text-gray-400 text-sm">Darths y Maestros crean contenido educativo usando el editor visual</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#fafafa] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users size={24} className="text-[#121212]" />
                  </div>
                  <h3 className="font-semibold mb-2">2. Votación Unánime</h3>
                  <p className="text-gray-400 text-sm">TODOS los Maestros deben aprobar para que el contenido se publique</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#fafafa] rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle size={24} className="text-[#121212]" />
                  </div>
                  <h3 className="font-semibold mb-2">3. Despliegue Automático</h3>
                  <p className="text-gray-400 text-sm">Una vez aprobado, se genera automáticamente el carrousel en las dashboards</p>
                </div>
              </div>
            </div>

            {/* Acciones Rápidas - Consolidadas */}
            <div className="bg-[#121212] border border-[#333] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#fafafa] mb-4">Acciones Rápidas</h2>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setActiveTab('crear')}
                  className="px-6 py-3 bg-[#fafafa] text-[#121212] rounded-lg font-semibold hover:bg-[#8a8a8a] transition-colors flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Crear Nueva Propuesta</span>
                </button>
                <button 
                  onClick={() => setActiveTab('propuestas')}
                  className="px-6 py-3 bg-[#333] text-white rounded-lg font-semibold hover:bg-[#444] transition-colors flex items-center space-x-2"
                >
                  <FileText size={20} />
                  <span>Ver Propuestas Pendientes</span>
                </button>
                <button 
                  onClick={() => setActiveTab('votacion')}
                  className="px-6 py-3 bg-[#333] text-white rounded-lg font-semibold hover:bg-[#444] transition-colors flex items-center space-x-2"
                >
                  <Users size={20} />
                  <span>Ir a Votación</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Propuestas */}
        {activeTab === 'propuestas' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#fafafa]">Propuestas Pendientes</h2>
              <button 
                onClick={() => setActiveTab('crear')}
                className="px-6 py-3 bg-[#fafafa] text-[#121212] rounded-lg font-semibold hover:bg-[#8a8a8a] transition-colors flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Nueva Propuesta</span>
              </button>
            </div>
            
            <div className="bg-[#121212] border border-[#333] rounded-lg p-6">
              <div className="text-center py-12">
                <FileText size={64} className="text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Sistema de Propuestas</h3>
                <p className="text-gray-500 mb-4">Sistema de creación y gestión de propuestas en desarrollo...</p>
                <button 
                  onClick={() => setActiveTab('crear')}
                  className="px-6 py-3 bg-[#fafafa] text-[#121212] rounded-lg font-semibold hover:bg-[#8a8a8a] transition-colors flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Crear Primera Propuesta</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Crear */}
        {activeTab === 'crear' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('propuestas')}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#333] rounded-lg transition-colors"
              >
                ← Volver
              </button>
              <h2 className="text-2xl font-bold text-[#fafafa]">Crear Nueva Propuesta</h2>
            </div>
            
            <ContentEditor
              onSave={handleSaveProposal}
              onPreview={handlePreviewContent}
            />
          </div>
        )}

        {/* TAB: Votación */}
        {activeTab === 'votacion' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#fafafa]">Sistema de Votación</h2>
            <div className="bg-[#121212] border border-[#333] rounded-lg p-6">
              <div className="text-center py-12">
                <Users size={64} className="text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Sistema de Votación</h3>
                <p className="text-gray-500">Sistema de votación unánime en desarrollo...</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Aprobados */}
        {activeTab === 'aprobados' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#fafafa]">Contenido Aprobado</h2>
            <div className="bg-[#121212] border border-[#333] rounded-lg p-6">
              <div className="text-center py-12">
                <CheckCircle size={64} className="text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Contenido Aprobado</h3>
                <p className="text-gray-500">Lista de contenido aprobado en desarrollo...</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Rechazados */}
        {activeTab === 'rechazados' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#fafafa]">Contenido Rechazado</h2>
            <div className="bg-[#121212] border border-[#333] rounded-lg p-6">
              <div className="text-center py-12">
                <XCircle size={64} className="text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Contenido Rechazado</h3>
                <p className="text-gray-500">Lista de contenido rechazado en desarrollo...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
