'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'form' | 'success' | 'error'>('form');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Verificar si hay un token válido en la URL
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    if (!token || type !== 'recovery') {
      setStatus('error');
      setMessage('Enlace de recuperación inválido o expirado');
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      console.log('🔐 Actualizando contraseña...');
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('❌ Error actualizando contraseña:', error);
        setStatus('error');
        setMessage('Error al actualizar la contraseña. Intenta nuevamente.');
        return;
      }

      console.log('✅ Contraseña actualizada exitosamente');
      setStatus('success');
      setMessage('¡Contraseña actualizada exitosamente!');
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/login/signin');
      }, 2000);

    } catch (error) {
      console.error('❌ Error inesperado:', error);
      setStatus('error');
      setMessage('Error inesperado. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center p-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">¡Contraseña Actualizada!</h2>
          <p className="text-[#8a8a8a] mb-4">{message}</p>
          <p className="text-sm text-[#6a6a6a]">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center p-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error</h2>
          <p className="text-[#8a8a8a] mb-4">{message}</p>
          <button
            onClick={() => router.push('/login/signin')}
            className="px-6 py-2 bg-[#ec4d58] hover:bg-[#d43d48] text-white rounded-lg transition-colors"
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center p-6">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Nueva Contraseña</h1>
          <p className="text-[#8a8a8a]">Ingresa tu nueva contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nueva Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 pr-10 bg-[#0f0f0f] text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ec4d58] ${
                  errors.password ? 'border-[#ec4d58]' : 'border-[#4a4a4a]'
                }`}
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6a6a6a] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[#ec4d58] text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 pr-10 bg-[#0f0f0f] text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ec4d58] ${
                  errors.confirmPassword ? 'border-[#ec4d58]' : 'border-[#4a4a4a]'
                }`}
                placeholder="Repite tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6a6a6a] hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[#ec4d58] text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isLoading
                ? 'bg-[#6a6a6a] cursor-not-allowed'
                : 'bg-[#ec4d58] hover:bg-[#d93c47]'
            } text-white`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Actualizando...
              </div>
            ) : (
              'Actualizar Contraseña'
            )}
          </button>
        </form>

        {/* Enlace a login */}
        <div className="text-center mt-6">
          <p className="text-[#8a8a8a]">
            ¿Recordaste tu contraseña?{' '}
            <button
              onClick={() => router.push('/login/signin')}
              className="text-[#ec4d58] hover:text-[#d93c47] transition-colors font-medium"
            >
              Iniciar Sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center p-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 max-w-md w-full text-center">
          <Loader2 className="w-16 h-16 text-[#8a8a8a] animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Cargando</h2>
          <p className="text-[#a0a0a0]">Procesando solicitud...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}