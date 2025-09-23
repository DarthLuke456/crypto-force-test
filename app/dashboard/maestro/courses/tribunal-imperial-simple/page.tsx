'use client';

import { useState } from 'react';
import { Crown, FileText, Plus, Eye, Save, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useSafeAuth } from '@/context/AuthContext-offline';
import MinimalContentCreator from '@/components/tribunal/MinimalContentCreator';

export default function TribunalImperialSimplePage() {
  const { userData } = useSafeAuth();
  const [showCreator, setShowCreator] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#333] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-[#333] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                <Crown className="w-8 h-8 text-[#ec4d58]" />
                <span>Tribunal Imperial</span>
              </h1>
              <p className="text-gray-400">Gestión de contenido para Maestros</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowCreator(true)}
            className="px-6 py-3 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d63e4a] transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Crear Contenido</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Propuestas Pendientes</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-600 rounded-lg">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Propuestas Aprobadas</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-600 rounded-lg">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Propuestas Rechazadas</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <div className="text-center py-12">
              <FileText size={64} className="text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No hay propuestas</h3>
              <p className="text-gray-500 mb-6">Crea tu primera propuesta para comenzar</p>
              <button
                onClick={() => setShowCreator(true)}
                className="px-6 py-3 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d63e4a] transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Crear Primera Propuesta</span>
              </button>
            </div>
          </div>

          {/* User Info Debug */}
          <div className="mt-6 bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Debug Info:</h4>
            <p className="text-gray-400 text-sm">Usuario: {userData?.email || 'No cargado'}</p>
            <p className="text-gray-400 text-sm">Nivel: {userData?.user_level || 'No cargado'}</p>
          </div>
        </div>
      </div>

      {/* Creator Modal */}
      {showCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Crear Contenido</h2>
                <button
                  onClick={() => setShowCreator(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <MinimalContentCreator
                onSave={(blocks, metadata) => {
                  console.log('Contenido guardado:', { blocks, metadata });
                  setShowCreator(false);
                }}
                onPreview={(blocks) => {
                  console.log('Vista previa:', blocks);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
