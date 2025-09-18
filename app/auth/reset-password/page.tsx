'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

// Componente que usa useSearchParams
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isValidToken, setIsValidToken] = useState(false);

  // Verificar token al cargar la página
  useEffect(() => {
    const checkToken = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error al verificar sesión:', error);
          setMessage({ 
            type: 'error', 
            text: 'Error al verificar el enlace. El enlace puede haber expirado.' 
          });
          return;
        }

        if (session?.user) {
          setIsValidToken(true);
          console.log('✅ Token válido, usuario autenticado');
        } else {
          setMessage({ 
            type: 'error', 
            text: 'Enlace inválido o expirado. Solicita un nuevo enlace de restablecimiento.' 
          });
        }
      } catch (error) {
        console.error('Error al verificar token:', error);
        setMessage({ 
          type: 'error', 
          text: 'Error al verificar el enlace. Inténtalo de nuevo.' 
        });
      }
    };

    checkToken();
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      setMessage({ 
        type: 'success', 
        text: 'Contraseña actualizada exitosamente. Serás redirigido en unos segundos...' 
      });
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        router.push('/login/signin');
      }, 3000);
    } catch (error: any) {
      console.error('Error al actualizar contraseña:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error al actualizar la contraseña' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken && message?.type === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center p-6">
        <div className="bg-[#2a2a2a] p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-[#ec4d58] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Enlace Inválido</h1>
          <p className="text-[#a0a0a0] mb-6">{message.text}</p>
          <Link 
            href="/login/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#ec4d58] hover:bg-[#d93c47] text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center p-6">
      <div className="bg-[#2a2a2a] p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Restablecer Contraseña</h1>
          <p className="text-[#a0a0a0]">Ingresa tu nueva contraseña</p>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-600 bg-opacity-20 border border-green-600 text-green-400' 
              : 'bg-[#ec4d58] bg-opacity-20 border border-[#ec4d58] text-[#ec4d58]'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordReset} className="space-y-4">
          {/* Nueva contraseña */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-white mb-2">
              Nueva Contraseña *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 bg-[#1a1a1a] text-white rounded-lg border border-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#ec4d58]"
                placeholder="Mínimo 6 caracteres"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6a6a6a] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border border-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#ec4d58]"
              placeholder="Repite tu contraseña"
              required
            />
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
            {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>

        {/* Enlace de regreso */}
        <div className="text-center mt-6">
          <Link 
            href="/login/signin"
            className="text-[#ec4d58] hover:text-[#d93c47] transition-colors font-medium"
          >
            ← Volver al Login
          </Link>
        </div>
      </div>
    </div>
  );
}

// Componente principal con Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ec4d58] mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
