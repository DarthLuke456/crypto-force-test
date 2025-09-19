'use client';

import React, { useState } from 'react';
import { useSafeAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function SignInPage() {
  const { user, userData, loading, isReady } = useSafeAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!formData.password.trim()) newErrors.password = 'La contraseña es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      console.log('🔐 Iniciando login para:', formData.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });
      
      if (error) {
        console.warn('⚠️ Error en login:', error.message);
        
        // Mejorar el mensaje de error para el usuario
        let errorMessage = 'Error al iniciar sesión';
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email o contraseña incorrectos. Verifica tus credenciales.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Por favor, confirma tu email antes de iniciar sesión.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Demasiados intentos. Espera unos minutos antes de intentar nuevamente.';
        } else {
          errorMessage = error.message;
        }
        
        setErrors({ general: errorMessage });
      } else {
        console.log('✅ Login exitoso, mostrando mensaje de éxito');
        setErrors({ general: '¡Login exitoso! Redirigiendo al dashboard...' });
        setTimeout(() => {
          window.location.href = '/login/dashboard-selection';
        }, 1500);
      }
    } catch (error: any) {
      console.error('❌ Error inesperado en login:', error);
      setErrors({ general: 'Error inesperado. Por favor, intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const { user, loading, isReady } = useSafeAuth();

  // Solo mostrar loading durante la inicialización
  if (loading && !isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ec4d58] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si el usuario está autenticado y listo, redirigir inmediatamente
  if (user && isReady) {
    console.log('🔄 Usuario autenticado detectado en signin, redirigiendo...');
    // Redirigir inmediatamente sin mostrar loading
    setTimeout(() => {
      window.location.href = '/login/dashboard-selection';
    }, 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ec4d58] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Redirigiendo al dashboard...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, mostrar formulario de login
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1a1a] p-8 rounded-xl border border-[#333]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Iniciar Sesión</h1>
            <p className="text-[#a0a0a0]">Accede a tu cuenta de Crypto Force</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-[#2a2a2a] border rounded-lg focus:outline-none focus:ring-2 transition-all pl-12"
                  placeholder="tu@email.com"
                />
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6a6a6a]" />
              </div>
              {errors.email && (
                <p className="text-[#ec4d58] text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 bg-[#2a2a2a] border rounded-lg focus:outline-none focus:ring-2 transition-all pl-12 pr-12"
                  placeholder="Tu contraseña"
                />
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6a6a6a]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6a6a6a] hover:text-[#a0a0a0] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[#ec4d58] text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Error general */}
            {errors.general && (
              <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                errors.general.includes('¡Login exitoso!') 
                  ? 'bg-green-500/10 border border-green-500/20 text-green-500'
                  : 'bg-[#ec4d58]/10 border border-[#ec4d58]/20 text-[#ec4d58]'
              }`}>
                <AlertCircle size={16} />
                {errors.general}
              </div>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-[#ec4d58] to-[#d93c47] hover:from-[#d93c47] hover:to-[#ec4d58] text-white hover:shadow-lg hover:shadow-[#ec4d58]/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Iniciando sesión...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Lock size={20} />
                  Iniciar Sesión
                </div>
              )}
            </button>

            {/* Enlaces */}
            <div className="text-center space-y-2">
              <a 
                href="/signup" 
                className="block text-[#6a6a6a] hover:text-[#a0a0a0] transition-colors"
              >
                ¿No tienes cuenta? Regístrate
              </a>
              <a 
                href="/login/forgot-password" 
                className="block text-[#6a6a6a] hover:text-[#a0a0a0] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
              
              {/* Botón de emergencia para resetear estado de login */}
              <button
                type="button"
                onClick={() => {
                  console.log('🔄 Reseteando estado de login manualmente');
                  resetLoginState();
                  setErrors({ general: 'Estado de login reseteado. Intenta nuevamente.' });
                }}
                className="block mx-auto text-xs text-[#8a8a8a] hover:text-[#ec4d58] transition-colors underline"
              >
                ¿Problemas de login? Resetear estado
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

