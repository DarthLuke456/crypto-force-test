'use client';

import { useSafeAuth } from '@/context/AuthContext-working';
import { useState } from 'react';
import { Settings, User, Bell, Shield, Palette, Save, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const { userData } = useSafeAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: true,
    language: 'es',
    timezone: 'America/Argentina/Buenos_Aires'
  });

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-gray-400" />
            Configuración
          </h1>
          <p className="text-gray-400">Personaliza tu experiencia de aprendizaje</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-green-400">Configuración guardada exitosamente</span>
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-500" />
              Perfil
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre</label>
                <input
                  type="text"
                  value={userData.nombre || ''}
                  disabled
                  className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={userData.email}
                  disabled
                  className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-yellow-500" />
              Notificaciones
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Notificaciones del curso</label>
                  <p className="text-xs text-gray-400">Recibe alertas sobre nuevos contenidos</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Actualizaciones por email</label>
                  <p className="text-xs text-gray-400">Recibe resúmenes semanales de tu progreso</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailUpdates}
                    onChange={(e) => handleSettingChange('emailUpdates', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2 text-purple-500" />
              Apariencia
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Modo oscuro</label>
                  <p className="text-xs text-gray-400">Activar tema oscuro (recomendado)</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Idioma</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-red-500" />
              Seguridad
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Zona horaria</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white"
                >
                  <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
                  <option value="America/New_York">Nueva York (GMT-5)</option>
                  <option value="Europe/London">Londres (GMT+0)</option>
                  <option value="Asia/Tokyo">Tokio (GMT+9)</option>
                </select>
              </div>
              <div className="pt-4 border-t border-[#3a3a3a]">
                <button className="text-red-400 hover:text-red-300 text-sm">
                  Cambiar contraseña
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg flex items-center transition-colors"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

