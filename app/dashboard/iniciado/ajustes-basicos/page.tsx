'use client';
import React, { useState, useEffect } from 'react';
import { Bell, Volume2, Eye, Shield, Clock, Globe, Zap, Save } from 'lucide-react';

export default function AjustesBasicosPage() {
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem('ajustes_notifications');
    return stored === null ? true : stored === 'true';
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const stored = localStorage.getItem('ajustes_sound');
    return stored === null ? true : stored === 'true';
  });
  const [autoSave, setAutoSave] = useState(() => {
    const stored = localStorage.getItem('ajustes_autoSave');
    return stored === null ? true : stored === 'true';
  });
  const [privacyMode, setPrivacyMode] = useState(() => {
    const stored = localStorage.getItem('ajustes_privacyMode');
    return stored === null ? false : stored === 'true';
  });
  const [sessionTimeout, setSessionTimeout] = useState(() => {
    const stored = localStorage.getItem('ajustes_sessionTimeout');
    return stored || '30';
  });
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem('ajustes_language');
    return stored || 'es';
  });
  const [performanceMode, setPerformanceMode] = useState(() => {
    const stored = localStorage.getItem('ajustes_performanceMode');
    return stored === null ? false : stored === 'true';
  });

  // Guardar en localStorage cuando cambien los valores
  useEffect(() => {
    localStorage.setItem('ajustes_notifications', notifications ? 'true' : 'false');
  }, [notifications]);
  
  useEffect(() => {
    localStorage.setItem('ajustes_sound', soundEnabled ? 'true' : 'false');
  }, [soundEnabled]);
  
  useEffect(() => {
    localStorage.setItem('ajustes_autoSave', autoSave ? 'true' : 'false');
  }, [autoSave]);
  
  useEffect(() => {
    localStorage.setItem('ajustes_privacyMode', privacyMode ? 'true' : 'false');
  }, [privacyMode]);
  
  useEffect(() => {
    localStorage.setItem('ajustes_sessionTimeout', sessionTimeout);
  }, [sessionTimeout]);
  
  useEffect(() => {
    localStorage.setItem('ajustes_language', language);
  }, [language]);
  
  useEffect(() => {
    localStorage.setItem('ajustes_performanceMode', performanceMode ? 'true' : 'false');
  }, [performanceMode]);

  const SettingCard = ({ 
    icon: Icon, 
    title, 
    description, 
    children, 
    className = "" 
  }: {
    icon: any;
    title: string;
    description: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={`bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] hover:border-[#ec4d58] transition-all duration-300 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-[#ec4d58] to-[#ff6b6b] rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <p className="text-gray-400 text-sm mb-4">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );

  const ToggleSwitch = ({ 
    enabled, 
    onChange, 
    label 
  }: {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-gray-300 text-sm">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ec4d58] focus:ring-offset-2 focus:ring-offset-[#1a1a1a] ${
          enabled ? 'bg-[#ec4d58]' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ec4d58] to-[#ff6b6b] bg-clip-text text-transparent mb-2">
            Ajustes Básicos
          </h1>
          <p className="text-gray-400 text-lg">
            Personaliza tu experiencia de aprendizaje y trading
          </p>
        </div>

        {/* Grid de ajustes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Notificaciones */}
          <SettingCard
            icon={Bell}
            title="Notificaciones"
            description="Recibe alertas sobre nuevos módulos, actualizaciones y recordatorios importantes"
          >
            <ToggleSwitch
              enabled={notifications}
              onChange={setNotifications}
              label="Activar notificaciones"
            />
          </SettingCard>

          {/* Sonidos */}
          <SettingCard
            icon={Volume2}
            title="Sonidos"
            description="Efectos de sonido para mejorar la interactividad de la plataforma"
          >
            <ToggleSwitch
              enabled={soundEnabled}
              onChange={setSoundEnabled}
              label="Activar efectos de sonido"
            />
          </SettingCard>

          {/* Auto-guardado */}
          <SettingCard
            icon={Save}
            title="Auto-guardado"
            description="Guarda automáticamente tu progreso en los módulos y ejercicios"
          >
            <ToggleSwitch
              enabled={autoSave}
              onChange={setAutoSave}
              label="Activar auto-guardado"
            />
          </SettingCard>

          {/* Modo privacidad */}
          <SettingCard
            icon={Shield}
            title="Privacidad"
            description="Oculta información sensible y mejora la seguridad de tu sesión"
          >
            <ToggleSwitch
              enabled={privacyMode}
              onChange={setPrivacyMode}
              label="Activar modo privacidad"
            />
          </SettingCard>

          {/* Tiempo de sesión */}
          <SettingCard
            icon={Clock}
            title="Tiempo de Sesión"
            description="Define cuánto tiempo permanecerás conectado antes de cerrar sesión automáticamente"
          >
            <div className="space-y-3">
              <select
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ec4d58] text-sm"
                value={sessionTimeout}
                onChange={e => setSessionTimeout(e.target.value)}
              >
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="60">1 hora</option>
                <option value="120">2 horas</option>
                <option value="0">Nunca (no recomendado)</option>
              </select>
            </div>
          </SettingCard>

          {/* Idioma */}
          <SettingCard
            icon={Globe}
            title="Idioma"
            description="Selecciona el idioma preferido para la interfaz de usuario"
          >
            <div className="space-y-3">
              <select
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ec4d58] text-sm"
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>
          </SettingCard>

          {/* Modo rendimiento */}
          <SettingCard
            icon={Zap}
            title="Modo Rendimiento"
            description="Optimiza la plataforma para mejor rendimiento en dispositivos menos potentes"
            className="lg:col-span-2"
          >
            <div className="space-y-4">
              <ToggleSwitch
                enabled={performanceMode}
                onChange={setPerformanceMode}
                label="Activar modo rendimiento optimizado"
              />
              <div className="bg-[#2a2a2a] rounded-lg p-4">
                <p className="text-gray-400 text-sm">
                  <strong>Modo rendimiento:</strong> Reduce animaciones, optimiza carga de imágenes y mejora la velocidad general de la plataforma.
                </p>
              </div>
            </div>
          </SettingCard>

        </div>

        {/* Botón de guardar */}
        <div className="mt-8 text-center">
          <button
            className="bg-gradient-to-r from-[#ec4d58] to-[#ff6b6b] hover:from-[#ff6b6b] hover:to-[#ec4d58] text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#ec4d58] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
            onClick={() => {
              // Aquí se pueden agregar funcionalidades adicionales al guardar
              console.log('Ajustes guardados');
            }}
          >
            Guardar Cambios
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
          <h3 className="text-lg font-semibold text-white mb-3">Información Importante</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
            <div>
              <p>• Los cambios se guardan automáticamente en tu navegador</p>
              <p>• Algunas configuraciones pueden requerir recargar la página</p>
            </div>
            <div>
              <p>• El modo privacidad oculta información sensible</p>
              <p>• El auto-guardado protege tu progreso</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 