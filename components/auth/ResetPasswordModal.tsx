'use client';

import { useState } from 'react';
import { X, Mail, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export default function ResetPasswordModal({ isOpen, onClose, userEmail }: ResetPasswordModalProps) {
  const [email, setEmail] = useState(userEmail || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');



  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Por favor ingresa tu email' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw error;
      }

      setMessage({ 
        type: 'success', 
        text: 'Se ha enviado un enlace de restablecimiento a tu email. Revisa tu bandeja de entrada.' 
      });
      
      // Cambiar al paso de reset si el usuario ya está autenticado
      if (userEmail) {
        setStep('reset');
      }
    } catch (error: any) {
      console.error('Error al solicitar restablecimiento:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error al enviar el email de restablecimiento' 
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        window.location.href = '/login/dashboard-selection';
      }, 2000);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {step === 'request' ? 'Restablecer Contraseña' : 'Nueva Contraseña'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#8a8a8a] hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Paso 1: Solicitar restablecimiento */}
        {step === 'request' && (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8a8a8a] w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-[#8a8a8a] focus:outline-none focus:border-[#ec4d58] transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#ec4d58] hover:bg-[#d43d48] disabled:bg-[#6a6a6a] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Mail size={16} />
                  Enviar Email de Restablecimiento
                </>
              )}
            </button>
          </form>
        )}

        {/* Paso 2: Establecer nueva contraseña */}
        {step === 'reset' && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pr-10 pl-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-[#8a8a8a] focus:outline-none focus:border-[#ec4d58] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8a8a8a] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-[#8a8a8a] focus:outline-none focus:border-[#ec4d58] transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#ec4d58] hover:bg-[#d43d48] disabled:bg-[#6a6a6a] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Actualizando...
                </>
              ) : (
                'Actualizar Contraseña'
              )}
            </button>
          </form>
        )}

        {/* Mensajes */}
        {message && (
          <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-900/20 border border-green-700/50 text-green-400' 
              : 'bg-red-900/20 border border-red-700/50 text-red-400'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-6 text-center">
          <p className="text-[#8a8a8a] text-sm">
            {step === 'request' 
              ? 'Se enviará un enlace seguro a tu email para restablecer tu contraseña.'
              : 'Asegúrate de que tu nueva contraseña sea segura y fácil de recordar.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
