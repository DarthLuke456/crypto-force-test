'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Save,
  CheckCircle
} from 'lucide-react';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaveMessage('Configuración guardada exitosamente');
    setIsSaving(false);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#8A8A8A] mb-2">
              Configuración del Sistema
            </h1>
            <p className="text-gray-400">
              Ajustes básicos de la plataforma
            </p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#8A8A8A] hover:bg-[#9A9A9A] disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
        
        {saveMessage && (
          <div className="mt-4 flex items-center gap-2 text-green-400 bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
            <CheckCircle className="w-4 h-4" />
            {saveMessage}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-12 text-center">
        <Settings className="w-16 h-16 text-[#8A8A8A] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Panel de Configuración
        </h3>
        <p className="text-gray-400 mb-6">
          Aquí podrás gestionar los ajustes del sistema
        </p>
        <p className="text-sm text-gray-500">
          Funcionalidad en desarrollo
        </p>
      </div>
    </div>
  );
}
