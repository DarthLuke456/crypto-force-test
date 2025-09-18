'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Phone, Building, Hash, ArrowLeft } from 'lucide-react';
import CountryPhoneInput from '@/components/ui/CountryPhoneInput';
import ReferralCode from '@/components/ui/ReferralCode';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useSafeAuth } from '@/context/AuthContext';

// Componente separado para manejar search params
function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isReady } = useSafeAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [referralInfo, setReferralInfo] = useState<{nickname?: string; valid?: boolean} | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    nickname: '',
    email: '',
    numeroMovil: '+54 ',
    exchange: '',
    uid: '',
    codigoReferido: '',
    password: '',
    confirmPassword: ''
  });
  
  // Auto-llenar código de referido desde URL
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode && isReady) {
      console.log('🔍 [DEBUG] Código de URL original:', refCode);
      // Procesar el código igual que en signup
      const processedCode = refCode.replace(/[#@]/g, '').toUpperCase().replace(/\s+/g, '_');
      console.log('🔍 [DEBUG] Código procesado:', processedCode);
      setFormData(prev => ({ ...prev, codigoReferido: processedCode }));
      validateReferralCode(processedCode);
    }
  }, [searchParams, isReady]);

  // Función para validar código de referido
  const validateReferralCode = async (code: string) => {
    if (!code.trim()) {
      setReferralInfo(null);
      return;
    }

    try {
      const response = await fetch('/api/referrals/validate-public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() })
      });

      const result = await response.json();
      
      if (result.success && result.valid) {
        setReferralInfo({
          nickname: result.referrer.nickname,
          valid: true
        });
      } else {
        setReferralInfo({ valid: false });
      }
    } catch (error) {
      console.error('Error validando código:', error);
      setReferralInfo({ valid: false });
    }
  };

  // Mostrar loading mientras no esté listo
  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#121212] text-white font-inter flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    // Procesar código de referido igual que en signup
    if (field === 'codigoReferido') {
      console.log('🔍 [DEBUG] Input original:', value);
      value = value.replace(/[#@]/g, '').toUpperCase().replace(/\s+/g, '_');
      console.log('🔍 [DEBUG] Input procesado:', value);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validación en tiempo real del código de referido
    if (field === 'codigoReferido') {
      if (value.trim()) {
        validateReferralCode(value.trim());
      } else {
        setReferralInfo(null);
      }
    }
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validaciones básicas
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.nickname.trim()) newErrors.nickname = 'El nickname es requerido';
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    // Validar password
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar número de móvil si se proporciona
    if (formData.numeroMovil && formData.numeroMovil.trim() !== '+54 ') {
      const phoneRegex = /^\+\d{8,15}$/;
      const cleanPhone = formData.numeroMovil.replace(/\s/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.numeroMovil = 'Formato de teléfono inválido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Preparar datos para enviar
      const dataToSend = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        nickname: formData.nickname.trim(),
        email: formData.email.toLowerCase().trim(),
        movil: formData.numeroMovil.trim() !== '+54 ' ? formData.numeroMovil.trim() : null,
        exchange: formData.exchange || null,
        uid: formData.uid || null,
        codigoReferido: formData.codigoReferido || null,
        password: formData.password
      };

      console.log('📤 Enviando datos:', dataToSend);

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();
      console.log('📥 Respuesta del servidor:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear cuenta');
      }

      // Éxito - Usuario registrado correctamente
      setErrors({ submit: '¡Cuenta creada exitosamente! Redirigiendo...' });
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        apellido: '',
        nickname: '',
        email: '',
        numeroMovil: '+54 ',
        exchange: '',
        uid: '',
        codigoReferido: '',
        password: '',
        confirmPassword: ''
      });

      // Redirigir después de 2 segundos al selector de dashboard
      setTimeout(() => {
        router.push('/login/dashboard-selection');
      }, 2000);

    } catch (error: any) {
      console.error('❌ Error en el formulario:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-inter">
      {/* Header con botón de volver */}
      <div className="absolute top-8 left-8">
        <Link href="/login" className="flex items-center gap-3 text-[#8A8A8A] hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Volver al login</span>
        </Link>
      </div>

      {/* Contenedor principal con scroll */}
      <div className="flex items-center justify-center px-4 py-6 min-h-screen">
        <div className="w-full max-w-md">
          {/* Logo y título */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#ec4d58] rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <User size={32} className="sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Crear Cuenta</h1>
            <p className="text-sm sm:text-base text-white/70">Únete a Crypto Force</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1 sm:mb-2">
                  Nombre *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#2a2d36] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec4d58] transition-all text-sm sm:text-base ${
                      errors.nombre ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="Tu nombre"
                  />
                  {errors.nombre && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.nombre}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1 sm:mb-2">
                  Apellido *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => handleInputChange('apellido', e.target.value)}
                    className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#2a2d36] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec4d58] transition-all text-sm sm:text-base ${
                      errors.apellido ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="Tu apellido"
                  />
                  {errors.apellido && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.apellido}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Nickname */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1 sm:mb-2">
                Nickname *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#2a2d36] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec4d58] transition-all text-sm sm:text-base ${
                    errors.nickname ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Tu nickname"
                />
                {errors.nickname && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.nickname}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1 sm:mb-2">
                Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#2a2d36] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec4d58] transition-all text-sm sm:text-base ${
                    errors.email ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1 sm:mb-2">
                Número de móvil (opcional)
              </label>
              <CountryPhoneInput
                value={formData.numeroMovil}
                onChange={(value) => handleInputChange('numeroMovil', value)}
                placeholder="Número de teléfono"
              />
              {errors.numeroMovil && (
                <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.numeroMovil}</p>
              )}
            </div>

            {/* Exchange y UID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1 sm:mb-2">
                  Exchange (opcional)
                </label>
                <select
                  value={formData.exchange}
                  onChange={(e) => handleInputChange('exchange', e.target.value)}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#2a2d36] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec4d58] transition-all text-sm sm:text-base"
                >
                  <option value="">Seleccionar</option>
                  <option value="ZoomEx">ZoomEx</option>
                  <option value="Bitget">Bitget</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1 sm:mb-2">
                  UID (opcional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.uid}
                    onChange={(e) => handleInputChange('uid', e.target.value)}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#2a2d36] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec4d58] transition-all text-sm sm:text-base"
                    placeholder="Tu UID"
                  />
                </div>
              </div>
            </div>

            {/* Código de referido */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1 sm:mb-2">
                Código de referido (opcional)
              </label>
              <div className="relative">
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    value={formData.codigoReferido}
                    onChange={(e) => handleInputChange('codigoReferido', e.target.value)}
                    className={`w-full pl-10 sm:pl-11 pr-3 py-2.5 sm:px-4 sm:py-3 bg-[#2a2d36] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec4d58] transition-all text-sm sm:text-base ${
                      referralInfo?.valid === true ? 'border-green-500' : 
                      referralInfo?.valid === false ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="Código de referido"
                  />
                  {referralInfo?.valid === true && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                      ✓
                    </div>
                  )}
                  {referralInfo?.valid === false && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                      ✗
                    </div>
                  )}
                </div>
                {referralInfo?.valid === true && referralInfo.nickname && (
                  <p className="text-green-400 text-xs sm:text-sm mt-1">
                    ✓ Código válido - Referido por: <strong>{referralInfo.nickname}</strong>
                  </p>
                )}
                {referralInfo?.valid === false && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">
                    ✗ Código de referido no válido
                  </p>
                )}
                {formData.codigoReferido && (
                  <p className="text-[#ec4d58] text-xs mt-1">
                    Código procesado: {formData.codigoReferido}
                  </p>
                )}
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1 sm:mb-2">
                Contraseña *
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#2a2d36] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec4d58] transition-all text-sm sm:text-base ${
                    errors.password ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.password && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1 sm:mb-2">
                Confirmar contraseña *
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#2a2d36] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec4d58] transition-all text-sm sm:text-base ${
                    errors.confirmPassword ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Repite tu contraseña"
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Mensaje de error/éxito */}
            {errors.submit && (
              <div className={`p-2.5 sm:p-3 rounded-lg text-xs sm:text-sm ${
                errors.submit.includes('exitosamente') 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                  : 'bg-red-500/20 border border-red-500/30 text-red-400'
              }`}>
                {errors.submit}
              </div>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#ec4d58] hover:bg-[#d43d47] disabled:bg-[#ec4d58]/50 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base mt-4 sm:mt-6"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-sm sm:text-base">Creando cuenta...</span>
                </>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </form>

          {/* Enlaces */}
          <div className="mt-4 sm:mt-6 text-center space-y-2">
            <p className="text-xs sm:text-sm text-white/70">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login/signin" className="text-[#ec4d58] hover:text-[#d43d47] font-medium transition-colors">
                Inicia sesión aquí
              </Link>
            </p>
            <p className="text-xs sm:text-sm text-white/70">
              <Link href="/login/forgot-password" className="text-[#ec4d58] hover:text-[#d43d47] font-medium transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente principal con Suspense
export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#121212] text-white font-inter flex items-center justify-center">
        <LoadingSpinner />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
