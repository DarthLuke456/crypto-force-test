'use client';

import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Por favor ingresa tu email');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Usar el API real de reset de contraseña
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
      } else {
        setError(data.error || 'Error al enviar el email de recuperación');
      }
    } catch (err) {
      console.error('Error enviando reset:', err);
      setError('Error al enviar el email de recuperación');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-[#1a1a1a] p-8 rounded-xl border border-[#333] text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Email Enviado</h1>
            <p className="text-[#a0a0a0] mb-6">
              Te hemos enviado un enlace para restablecer tu contraseña a <strong>{email}</strong>
            </p>
            <p className="text-sm text-[#6a6a6a] mb-6">
              Revisa tu bandeja de entrada y sigue las instrucciones del email.
            </p>
            <Link 
              href="/login/signin"
              className="inline-flex items-center gap-2 text-[#ec4d58] hover:text-[#d93c47] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1a1a] p-8 rounded-xl border border-[#333]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Recuperar Contraseña</h1>
            <p className="text-[#a0a0a0]">Ingresa tu email para recibir un enlace de recuperación</p>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#2a2a2a] border rounded-lg focus:outline-none focus:ring-2 transition-all pl-12"
                  placeholder="tu@email.com"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6a6a6a] w-5 h-5" />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-400">{error}</span>
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-[#ec4d58] to-[#d93c47] hover:from-[#d93c47] hover:to-[#ec4d58] text-white hover:shadow-lg hover:shadow-[#ec4d58]/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enviando...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Mail size={20} />
                  Enviar Email de Recuperación
                </div>
              )}
            </button>

            {/* Enlaces */}
            <div className="text-center space-y-2">
              <Link 
                href="/login/signin" 
                className="block text-[#6a6a6a] hover:text-[#a0a0a0] transition-colors"
              >
                <ArrowLeft className="w-4 h-4 inline mr-1" />
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}