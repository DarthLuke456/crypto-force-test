'use client';

import { useState, useEffect } from 'react';
import { useSafeAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

interface FormData {
  nombre: string;
  apellido: string;
  nickname: string;
  email: string;
  password: string;
  movil: string;
  exchange: string;
  codigo_referido: string;
}

interface SignUpResult {
  type: 'success' | 'error';
  message: string;
}

export default function SignUpPage() {
  const { user, loading, isReady } = useSafeAuth();
  
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    nickname: '',
    email: '',
    password: '',
    movil: '',
    exchange: '',
    codigo_referido: ''
  });

  // Cargar código de referido desde URL al montar el componente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');
      if (refCode) {
        console.log('🔍 Código de referido encontrado en URL:', refCode);
        // Remover caracteres especiales y convertir a mayúsculas
        const processedCode = refCode.replace(/[#@]/g, '').toUpperCase().replace(/\s+/g, '_');
        console.log('🔍 Código procesado:', processedCode);
        setFormData(prev => ({
          ...prev,
          codigo_referido: processedCode
        }));
      } else {
        // Para pruebas, usar un código de referido de prueba
        const testCode = 'CRYPTOFORCE-DARTHLUKE';
        console.log('🔍 Usando código de referido de prueba:', testCode);
        setFormData(prev => ({
          ...prev,
          codigo_referido: testCode
        }));
      }
    }
  }, []);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signUpResult, setSignUpResult] = useState<SignUpResult | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Convertir código de referido a mayúsculas y reemplazar espacios con guiones bajos
    if (field === 'codigo_referido') {
      console.log('🔍 [DEBUG] Input original:', value);
      // Remover caracteres especiales como # y convertir a mayúsculas
      value = value.replace(/[#@]/g, '').toUpperCase().replace(/\s+/g, '_');
      console.log('🔍 [DEBUG] Input procesado:', value);
    }
    
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.nickname.trim()) newErrors.nickname = 'El nickname es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!formData.password.trim()) newErrors.password = 'La contraseña es requerida';
    // movil ya no es requerido
    if (!formData.exchange.trim()) newErrors.exchange = 'El exchange es requerido';

    // Validar formato del código de referido si se proporciona
    if (formData.codigo_referido.trim()) {
      const codigo = formData.codigo_referido.trim().toUpperCase();
      // El código debe tener al menos 3 caracteres y solo letras, números y guiones bajos
      if (codigo.length < 3) {
        newErrors.codigo_referido = 'El código de invitación debe tener al menos 3 caracteres';
      } else if (!/^[A-Z0-9_]+$/.test(codigo)) {
        newErrors.codigo_referido = 'El código de invitación solo puede contener letras, números y guiones bajos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Mostrar loading solo mientras se inicializa la autenticación
  if (loading && !isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ec4d58] mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si el usuario ya está autenticado, redirigir inmediatamente
  if (user && isReady) {
    console.log('🔄 Usuario autenticado detectado en signup, redirigiendo...');
    // Redirigir al dashboard selection
    setTimeout(() => {
      window.location.href = '/login/dashboard-selection';
    }, 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ec4d58] mx-auto mb-4"></div>
          <p className="text-white text-lg">Usuario ya autenticado, redirigiendo...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSignUpResult(null);

    try {
      console.log('📝 Iniciando signup para:', formData.email);
      
      // Verificar si el código de referido existe (si se proporcionó)
      let referredBy = null;
      if (formData.codigo_referido.trim()) {
        console.log('🔍 [DEBUG] Verificando código de referido:', formData.codigo_referido);
        
        // Normalizar el código de referido (convertir espacios a guiones bajos)
        const normalizedCode = formData.codigo_referido.trim().toUpperCase().replace(/\s+/g, '_');
        console.log('🔍 [DEBUG] Código normalizado:', normalizedCode);
        
        // DEBUG: Listar todos los códigos de referido en la base de datos
        console.log('🔍 [DEBUG] Buscando todos los códigos de referido en la base de datos...');
        const { data: allCodes, error: allCodesError } = await supabase
          .from('users')
          .select('email, nickname, referral_code')
          .like('referral_code', 'CRYPTOFORCE-%');
        
        console.log('🔍 [DEBUG] Todos los códigos CRYPTOFORCE- en la base de datos:', allCodes);
        if (allCodesError) {
          console.error('❌ [DEBUG] Error obteniendo todos los códigos:', allCodesError);
        }
        
        // Usar la API pública para validar el código de referido
        console.log('🔍 [DEBUG] Validando código con API pública:', normalizedCode);
        try {
          const response = await fetch('/api/referrals/validate-public', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: normalizedCode })
          });

          const result = await response.json();
          console.log('🔍 [DEBUG] Resultado de validación pública:', result);

          if (!result.success) {
            console.error('❌ Error en validación pública:', result.error);
            setErrors({ codigo_referido: 'Error validando código de invitación' });
            setIsSubmitting(false);
            return;
          }

          if (!result.valid) {
            console.warn('⚠️ Código de referido no válido:', result.error);
            setErrors({ codigo_referido: 'Código de invitación no encontrado' });
            setIsSubmitting(false);
            return;
          }

          // Si el código es válido, buscar el ID del referidor en la base de datos
          const { data: referrerData, error: referrerError } = await supabase
            .from('users')
            .select('id, referral_code, email, nickname')
            .eq('referral_code', normalizedCode)
            .single();

          if (referrerError || !referrerData) {
            console.error('❌ Error obteniendo datos del referidor:', referrerError);
            setErrors({ codigo_referido: 'Error obteniendo datos del referidor' });
            setIsSubmitting(false);
            return;
          }

          referredBy = referrerData.id;
          console.log('✅ Código de referido válido, referido por:', referrerData.nickname || referrerData.email);
        } catch (apiError) {
          console.error('❌ Error en API de validación:', apiError);
          setErrors({ codigo_referido: 'Error validando código de invitación' });
          setIsSubmitting(false);
          return;
        }
      } else {
        // Si no hay código de referido, asignar a Franc (infocryptoforce@gmail.com)
        console.log('🔍 No hay código de referido, buscando a Franc...');
        const { data: francData, error: francError } = await supabase
          .from('users')
          .select('id, email')
          .eq('email', 'infocryptoforce@gmail.com')
          .single();
        
        if (francData && !francError) {
          referredBy = francData.id;
          console.log('✅ Asignado a Franc (infocryptoforce@gmail.com):', referredBy);
        } else {
          console.warn('⚠️ No se encontró a Franc en la base de datos, continuando sin referido');
        }
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          data: {
            nombre: formData.nombre.trim(),
            apellido: formData.apellido.trim(),
            nickname: formData.nickname.trim(),
            movil: formData.movil.trim(),
            exchange: formData.exchange.trim(),
            codigo_referido: formData.codigo_referido.trim()
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });

      console.log('📝 Resultado del signup:', { data, error });

      if (error) {
        console.error('❌ Error en signup:', error);
        setErrors({ general: error.message });
        setSignUpResult({ 
          type: 'error', 
          message: `Error al crear la cuenta: ${error.message}` 
        });
        setIsSubmitting(false);
        return;
      }

      if (data.user) {
        console.log('✅ Usuario creado en auth, creando perfil en users...');
        
        // Crear el perfil del usuario en la tabla users
        // El código de referido se generará automáticamente en la base de datos
        const userProfile = {
          email: formData.email.trim().toLowerCase(),
          nombre: formData.nombre.trim(),
          apellido: formData.apellido.trim(),
          nickname: formData.nickname.trim(),
          movil: formData.movil.trim(),
          exchange: formData.exchange.trim(),
          user_level: 1, // Nivel inicial
          referral_code: null, // Se generará automáticamente en la base de datos
          uid: data.user.id,
          codigo_referido: formData.codigo_referido.trim() || null,
          referred_by: referredBy,
          total_referrals: 0
        };
        
        console.log('📝 Intentando insertar perfil:', userProfile);
        
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert([userProfile])
          .select()
          .single();
        
        if (profileError) {
          console.error('❌ Error al crear perfil en users:', profileError);
          console.error('❌ Detalles del error:', {
            message: profileError.message,
            details: profileError.details,
            hint: profileError.hint,
            code: profileError.code
          });
          
          // Si es un error de conflicto, intentar obtener el usuario existente
          if (profileError.code === '23505') {
            console.log('🔄 Usuario ya existe, obteniendo datos existentes...');
            const { data: existingUser, error: fetchError } = await supabase
              .from('users')
              .select('*')
              .eq('email', formData.email.trim().toLowerCase())
              .single();
            
            if (existingUser && !fetchError) {
              console.log('✅ Usuario existente encontrado:', existingUser);
            } else {
              console.error('❌ Error al obtener usuario existente:', fetchError);
            }
          }
        } else {
          console.log('✅ Perfil creado exitosamente en users:', profileData);
        }
        
        // Si hay un referidor, incrementar su contador de referidos
        if (referredBy) {
          console.log('📈 Incrementando contador de referidos para:', referredBy);
          // Obtener el valor actual y incrementarlo
          const { data: currentUser, error: fetchError } = await supabase
            .from('users')
            .select('total_referrals')
            .eq('id', referredBy)
            .single();
          
          if (!fetchError && currentUser) {
            const { error: updateError } = await supabase
              .from('users')
              .update({ 
                total_referrals: (currentUser.total_referrals || 0) + 1,
                updated_at: new Date().toISOString()
              })
              .eq('id', referredBy);
          
            if (updateError) {
              console.warn('⚠️ Error al actualizar contador de referidos:', updateError);
            } else {
              console.log('✅ Contador de referidos actualizado');
            }
          } else {
            console.warn('⚠️ Error al obtener datos del referidor:', fetchError);
          }
        }
        
        if (!data.user.email_confirmed_at) {
        console.log('✅ Usuario creado, email de confirmación enviado');
        setSignUpResult({ 
          type: 'success', 
          message: '¡Cuenta creada exitosamente! Revisa tu email para confirmar tu cuenta.' 
        });
        } else {
          console.log('✅ Usuario creado y confirmado automáticamente');
          setSignUpResult({ 
            type: 'success', 
            message: '¡Cuenta creada y confirmada exitosamente!' 
          });
        }
        
        // Limpiar formulario
        setFormData({
          nombre: '',
          apellido: '',
          nickname: '',
          email: '',
          password: '',
          movil: '',
          exchange: '',
          codigo_referido: ''
        });
      }
    } catch (error) {
      console.error('❌ Error inesperado en signup:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setErrors({ general: errorMessage });
      setSignUpResult({ 
        type: 'error', 
        message: `Error inesperado: ${errorMessage}` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center p-6">
      <div className="bg-[#2a2a2a] p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
          <p className="text-[#a0a0a0]">Únete a Crypto Force y comienza tu viaje</p>
        </div>

        {/* Resultado del signup */}
        {signUpResult && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            signUpResult.type === 'success' 
              ? 'bg-green-600 bg-opacity-20 border border-green-600 text-green-400' 
              : 'bg-[#ec4d58] bg-opacity-20 border border-[#ec4d58] text-[#ec4d58]'
          }`}>
            {signUpResult.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span>{signUpResult.message}</span>
          </div>
        )}

        {/* Error general */}
        {errors.general && (
          <div className="mb-6 p-4 bg-[#ec4d58] bg-opacity-20 border border-[#ec4d58] text-[#ec4d58] rounded-lg">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-white mb-2">
                Nombre *
              </label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className={`w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ec4d58] ${
                  errors.nombre ? 'border-[#ec4d58]' : 'border-[#4a4a4a]'
                }`}
                placeholder="Tu nombre"
              />
              {errors.nombre && (
                <p className="text-[#ec4d58] text-sm mt-1">{errors.nombre}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-white mb-2">
                Apellido *
              </label>
              <input
                type="text"
                id="apellido"
                value={formData.apellido}
                onChange={(e) => handleInputChange('apellido', e.target.value)}
                className={`w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ec4d58] ${
                  errors.apellido ? 'border-[#ec4d58]' : 'border-[#4a4a4a]'
                }`}
                placeholder="Tu apellido"
              />
              {errors.apellido && (
                <p className="text-[#ec4d58] text-sm mt-1">{errors.apellido}</p>
              )}
            </div>
          </div>

          {/* Nickname */}
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-white mb-2">
              Nickname *
            </label>
            <input
              type="text"
              id="nickname"
              value={formData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              className={`w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ec4d58] ${
                errors.nickname ? 'border-[#ec4d58]' : 'border-[#4a4a4a]'
              }`}
              placeholder="Tu nickname"
            />
            {errors.nickname && (
              <p className="text-[#ec4d58] text-sm mt-1">{errors.nickname}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ec4d58] ${
                errors.email ? 'border-[#ec4d58]' : 'border-[#4a4a4a]'
              }`}
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="text-[#ec4d58] text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Contraseña *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-3 py-2 pr-10 bg-[#1a1a1a] text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ec4d58] ${
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

          {/* Móvil */}
          <div>
            <label htmlFor="movil" className="block text-sm font-medium text-white mb-2">
              Número Móvil (Opcional)
            </label>
            <input
              type="tel"
              id="movil"
              value={formData.movil}
              onChange={(e) => handleInputChange('movil', e.target.value)}
              className={`w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ec4d58] ${
                errors.movil ? 'border-[#ec4d58]' : 'border-[#4a4a4a]'
              }`}
              placeholder="+34 600 000 000"
            />
            {errors.movil && (
              <p className="text-[#ec4d58] text-sm mt-1">{errors.movil}</p>
            )}
          </div>

          {/* Exchange */}
          <div>
            <label htmlFor="exchange" className="block text-sm font-medium text-white mb-2">
              Exchange Preferido *
            </label>
            <select
              id="exchange"
              value={formData.exchange}
              onChange={(e) => handleInputChange('exchange', e.target.value)}
              className={`w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ec4d58] ${
                errors.exchange ? 'border-[#ec4d58]' : 'border-[#4a4a4a]'
              }`}
            >
              <option value="">Selecciona un exchange</option>
              <option value="ZoomEx">ZoomEx</option>
              <option value="Bitget">Bitget</option>
            </select>
            {errors.exchange && (
              <p className="text-[#ec4d58] text-sm mt-1">{errors.exchange}</p>
            )}
          </div>

          {/* Código de Referido */}
          <div>
            <label htmlFor="codigo_referido" className="block text-sm font-medium text-white mb-2">
              Código de Invitación (Opcional)
            </label>
            <input
              type="text"
              id="codigo_referido"
              value={formData.codigo_referido}
              onChange={(e) => handleInputChange('codigo_referido', e.target.value)}
              className={`w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ec4d58] ${
                errors.codigo_referido ? 'border-[#ec4d58]' : 'border-[#4a4a4a]'
              }`}
              placeholder="Ingresa el código de tu invitador"
            />
            {errors.codigo_referido && (
              <p className="text-[#ec4d58] text-sm mt-1">{errors.codigo_referido}</p>
            )}
            <p className="text-[#6a6a6a] text-xs mt-1">
              Si alguien te invitó, ingresa su código aquí para obtener beneficios
            </p>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isSubmitting
                ? 'bg-[#6a6a6a] cursor-not-allowed'
                : 'bg-[#ec4d58] hover:bg-[#d93c47]'
            } text-white`}
          >
            {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        {/* Enlace a login */}
        <div className="text-center mt-6">
          <p className="text-[#a0a0a0]">
            ¿Ya tienes una cuenta?{' '}
            <button
              onClick={() => window.location.href = '/login/signin'}
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
