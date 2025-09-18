'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Edit3, Save, Camera, Star, CheckCircle, Phone, Mail, User as UserIcon, Calendar, Globe, Lock, Eye, EyeOff, AlertCircle, Loader2, Users, Crown } from 'lucide-react';
import Image from 'next/image';
import { useSafeAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useAvatar } from '@/hooks/useAvatar';
import { useReferralDataSimple } from '@/hooks/useReferralDataSimple';

const countries = [
  '', 'Argentina', 'México', 'España', 'Colombia', 'Chile', 'Perú', 'Uruguay', 'Venezuela', 'Ecuador', 'Otro'
];

const getRoleName = (level: number) => {
  switch (level) {
    case 0: return 'Fundador';
    case 1: return 'Iniciado';
    case 2: return 'Acólito';
    case 3: return 'Warrior';
    case 4: return 'Lord';
    case 5: return 'Darth';
    case 6: return 'Maestro';
    default: return 'Iniciado';
  }
};

const getLevelColor = (level: number) => {
  switch (level) {
    case 0: return '#FF8C42'; // Fundador - Naranja
    case 1: return '#fafafa'; // Iniciado - Blanco
    case 2: return '#FFD447'; // Acólito - Amarillo
    case 3: return '#3ED598'; // Warrior - Verde
    case 4: return '#4671D5'; // Lord - Azul
    case 5: return '#ec4d58'; // Darth - Rojo
    case 6: return '#8a8a8a'; // Maestro - Gris
    default: return '#fafafa'; // Iniciado por defecto
  }
};

export default function PerfilPage() {
  const { user, userData } = useSafeAuth();
  const { avatar: userAvatar, changeAvatar } = useAvatar();
  const { stats: referralStats, loading: referralLoading } = useReferralDataSimple();
  
  // Estado para dashboard level (debe estar al inicio)
  const [currentDashboardLevel, setCurrentDashboardLevel] = useState(1);
  
  // Estado para datos personales
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para cambiar contraseña
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Estado para datos del perfil (sincronizado con la base de datos)
  const [profileData, setProfileData] = useState({
    nombre: '',
    apellido: '',
    nickname: '',
    email: '',
    movil: '',
    exchange: '',
    avatar: '/images/default-avatar.png',
    birthdate: '',
    country: '',
    bio: '',
    user_level: 1,
    referral_code: '',
    referred_by: '',
    total_referrals: 0,
    created_at: '',
    updated_at: ''
  });

  // Debug log for profileData changes (removed to prevent infinite re-renders)

  // useEffect para detectar dashboard actual
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedDashboard = localStorage.getItem('currentDashboard');
        if (storedDashboard) {
          // Convert dashboard name to level
          const dashboardLevels: { [key: string]: number } = {
            'iniciado': 1,
            'acolito': 2,
            'warrior': 3,
            'lord': 4,
            'darth': 5,
            'maestro': 6
          };
          setCurrentDashboardLevel(dashboardLevels[storedDashboard] || 1);
        }
      } catch (error) {
        console.warn('⚠️ Error al leer dashboard desde localStorage:', error);
      }
    }
  }, []);

  // Cargar datos del perfil desde la base de datos
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          throw new Error('No hay sesión activa');
        }

        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('🔍 Profile API Response:', data);
          if (data.data) {
            console.log('📱 Profile data movil field:', {
              movil: data.data.movil,
              type: typeof data.data.movil,
              length: data.data.movil?.length || 0,
              isEmpty: !data.data.movil || data.data.movil.trim() === ''
            });
            // Ensure all fields have proper default values to avoid null value warnings
            const sanitizedData = {
              nombre: data.data.nombre || '',
              apellido: data.data.apellido || '',
              nickname: data.data.nickname || '',
              email: data.data.email || '',
              movil: data.data.movil || '',
              exchange: data.data.exchange || '',
              avatar: data.data.avatar || '/images/default-avatar.png',
              birthdate: data.data.birthdate || '',
              country: data.data.country || '',
              bio: data.data.bio || '',
              user_level: data.data.user_level || 1,
              referral_code: data.data.referral_code || '',
              referred_by: data.data.referred_by || '',
              total_referrals: data.data.total_referrals || 0,
              created_at: data.data.created_at || '',
              updated_at: data.data.updated_at || ''
            };
            setProfileData(sanitizedData);
          }
        } else {
          console.error('Error cargando perfil:', response.status);
        }
      } catch (error) {
        console.error('Error cargando datos del perfil:', error);
        setError('Error cargando datos del perfil');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user]);
  
  const [avatarPreview, setAvatarPreview] = useState(userAvatar || profileData.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Actualizar avatar preview cuando cambie el avatar global o profileData
  useEffect(() => {
    setAvatarPreview(userAvatar || profileData.avatar);
  }, [userAvatar, profileData.avatar]);

  // Guardar cambios en la base de datos
  const saveProfile = async (newData: typeof profileData) => {
    try {
      console.log('🔍 Profile - Iniciando saveProfile');
      console.log('🔍 Profile - Datos recibidos:', newData);
      console.log('🔍 Profile - Tipo de datos:', typeof newData);
      console.log('🔍 Profile - Keys de datos:', Object.keys(newData));
      
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔍 Profile - Session obtenida:', session ? 'Sí' : 'No');
      console.log('🔍 Profile - Access token:', session?.access_token ? 'Presente' : 'Ausente');
      
      if (!session?.access_token) {
        throw new Error('No hay sesión activa');
      }

      // Clean the data before sending - remove null/undefined values and empty strings for required fields
      const cleanedData = {
        nombre: newData.nombre || '',
        apellido: newData.apellido || '',
        nickname: newData.nickname || '',
        email: newData.email || '',
        movil: newData.movil || '',
        exchange: newData.exchange || '',
        birthdate: newData.birthdate || '',
        country: newData.country || '',
        bio: newData.bio || '',
        avatar: newData.avatar || '/images/default-avatar.png',
        user_level: newData.user_level || 1
      };

      console.log('🔍 Profile - Datos originales:', newData);
      console.log('🔍 Profile - Datos limpios:', cleanedData);
      console.log('🔍 Profile - JSON stringificado:', JSON.stringify(cleanedData));
      console.log('🔍 Profile - Longitud del JSON:', JSON.stringify(cleanedData).length);

      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(cleanedData)
      });

      console.log('🔍 Profile - Response status:', response.status);
      console.log('🔍 Profile - Response ok:', response.ok);
      console.log('🔍 Profile - Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Profile - Response data:', data);
        if (data.success) {
          console.log('✅ Profile - Perfil actualizado correctamente');
          setProfileData(data.profile);
          setIsEditing(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        } else {
          console.error('❌ Profile - Error en response data:', data.error);
          setError(data.error || 'Error actualizando perfil');
        }
      } else {
        console.error('❌ Profile - Response no ok, status:', response.status);
        try {
        const errorData = await response.json();
          console.error('❌ Profile - Error data:', errorData);
        setError(errorData.error || 'Error actualizando perfil');
        } catch (parseError) {
          console.error('❌ Profile - Error parsing error response:', parseError);
          setError(`Error ${response.status}: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('❌ Profile - Error en saveProfile:', error);
      console.error('❌ Profile - Error stack:', error instanceof Error ? error.stack : 'No stack');
      setError('Error de conexión');
    } finally {
      console.log('🔍 Profile - Finalizando saveProfile');
      setLoading(false);
    }
  };

  // Manejar cambio de imagen usando el hook global
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen debe ser menor a 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev: ProgressEvent<FileReader>) => {
      if (ev.target && typeof ev.target.result === 'string') {
        setAvatarPreview(ev.target.result);
        
        try {
          setLoading(true);
          setError(null);
          
          await changeAvatar(ev.target.result);
          
          setProfileData(prev => ({ ...prev, avatar: ev.target?.result as string }));
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
          console.error('Error actualizando avatar:', error);
          setError('Error de conexión');
        } finally {
          setLoading(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Manejar edición de datos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Funciones para cambiar contraseña
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empieza a escribir
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }
    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'La nueva contraseña debe tener al menos 6 caracteres';
    }
    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma la nueva contraseña';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    setIsChangingPassword(true);
    setPasswordErrors({});

    try {
      console.log('🔐 Cambiando contraseña...');
      
      // Verificar la contraseña actual reautenticando al usuario
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: userData?.email || profileData.email,
        password: passwordData.currentPassword
      });

      if (reauthError) {
        console.error('❌ Contraseña actual incorrecta:', reauthError);
        setPasswordErrors({ currentPassword: 'La contraseña actual es incorrecta' });
        return;
      }

      // Actualizar la contraseña en Supabase
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) {
        console.error('❌ Error al cambiar contraseña:', error);
        setPasswordErrors({ general: error.message });
        return;
      }

      console.log('✅ Contraseña cambiada exitosamente');
      setShowSuccess(true);
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error('❌ Error inesperado al cambiar contraseña:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setPasswordErrors({ general: errorMessage });
    } finally {
      setIsChangingPassword(false);
    }
  };


  // Loading state
  if (loading && !profileData.email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8a8a8a] mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Authentication check
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-8 max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Sesión Expirada</h2>
            <p className="text-gray-400 mb-6">Tu sesión ha expirado. Por favor, inicia sesión nuevamente.</p>
            <button
              onClick={() => window.location.href = '/login/signin'}
              className="bg-[#8a8a8a] hover:bg-[#6a6a6a] text-white px-6 py-2 rounded-lg transition-colors"
            >
              Ir al Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get current role name and color based on user's actual level
  const userActualLevel = userData?.user_level || profileData.user_level || 1;
  const currentRoleName = getRoleName(userActualLevel);
  const currentRoleColor = getLevelColor(userActualLevel);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] text-white">
      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center justify-start pt-24 pb-8 px-4 transition-all duration-300">
        <div className="w-full max-w-md bg-[#181818] rounded-2xl shadow-lg p-8 border border-[#232323] flex flex-col items-center relative">
          {/* Mensaje de éxito */}
          {showSuccess && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-green-600/90 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out z-20">
              <CheckCircle className="w-5 h-5 text-white" />
              <span>¡Perfil actualizado!</span>
            </div>
          )}
          
          {/* Mensaje de error */}
          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-red-600/90 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out z-20">
              <AlertCircle className="w-5 h-5 text-white" />
              <span>{error}</span>
            </div>
          )}
          {/* Avatar y botón de cambio */}
          <div className="relative mb-4">
            <Image
              src={avatarPreview}
              alt="Tu foto de perfil"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover border-4 border-[#8a8a8a] shadow-lg"
            />
            <button
              className="absolute bottom-2 right-2 bg-[#8a8a8a] p-2 rounded-full hover:bg-[#6a6a6a] transition-colors"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              aria-label="Cambiar foto de perfil"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>
          {/* Datos personales */}
          <div className="w-full text-center mb-6">
            {isEditing ? (
              <>
                <div className="relative mb-2 flex items-center">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="nombre"
                    value={profileData.nombre}
                    onChange={handleChange}
                    className="w-full bg-[#232323] border border-[#333] rounded-lg px-8 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] text-center"
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="relative mb-2 flex items-center">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="apellido"
                    value={profileData.apellido}
                    onChange={handleChange}
                    className="w-full bg-[#232323] border border-[#333] rounded-lg px-8 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] text-center"
                    placeholder="Tu apellido"
                  />
                </div>
                <div className="relative mb-2 flex items-center">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="nickname"
                    value={profileData.nickname}
                    onChange={handleChange}
                    className="w-full bg-[#232323] border border-[#333] rounded-lg px-8 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] text-center"
                    placeholder="Tu nickname"
                  />
                </div>
                <div className="relative mb-2 flex items-center">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="w-full bg-[#232323] border border-[#333] rounded-lg px-8 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] text-center"
                    placeholder="Tu correo"
                    type="email"
                  />
                </div>
                <div className="relative mb-2 flex items-center">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="movil"
                    value={profileData.movil}
                    onChange={handleChange}
                    className="w-full bg-[#232323] border border-[#333] rounded-lg px-8 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] text-center"
                    placeholder="Teléfono (opcional)"
                    type="tel"
                  />
                </div>
                <div className="relative mb-2 flex items-center">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    name="exchange"
                    value={profileData.exchange}
                    onChange={handleChange}
                    className="w-full bg-[#232323] border border-[#333] rounded-lg px-8 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] appearance-none text-center"
                    style={{ backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat' }}
                  >
                    <option value="">Selecciona Exchange</option>
                    <option value="ZoomEx">ZoomEx</option>
                    <option value="Bitget">Bitget</option>
                  </select>
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    ▼
                  </span>
                </div>
                <div className="relative mb-2 flex items-center">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="birthdate"
                    value={profileData.birthdate}
                    onChange={(e) => {
                      let value = e.target.value;
                      
                      // Remove any non-numeric characters except slashes
                      value = value.replace(/[^0-9/]/g, '');
                      
                      // Handle backspace and deletion
                      if (value.length < profileData.birthdate.length) {
                        // User is deleting, allow it
                        setProfileData({ ...profileData, birthdate: value });
                        return;
                      }
                      
                      // Auto-format as mm/dd/yyyy with character limits
                      if (value.length === 1) {
                        // First character: only allow 0-1 for month
                        if (value > '1') {
                          value = '0' + value + '/';
                        }
                      } else if (value.length === 2) {
                        // Second character: validate month (01-12)
                        const month = parseInt(value);
                        if (month > 12) {
                          value = '12/';
                        } else if (month === 0) {
                          value = '01/';
                        } else if (!value.includes('/')) {
                          value = value + '/';
                        }
                      } else if (value.length === 3 && value.includes('/')) {
                        // Third character: only allow 0-3 for day
                        const dayPart = value.split('/')[1];
                        if (dayPart > '3') {
                          value = value.substring(0, 3) + '0' + dayPart;
                        }
                      } else if (value.length === 4 && value.includes('/')) {
                        // Fourth character: validate day (01-31)
                        const parts = value.split('/');
                        const day = parseInt(parts[1]);
                        if (day > 31) {
                          value = parts[0] + '/31/';
                        } else if (day === 0) {
                          value = parts[0] + '/01/';
                        } else if (parts[1].length === 2 && !value.endsWith('/')) {
                          value = value + '/';
                        }
                      } else if (value.length === 5 && value.includes('/')) {
                        // Fifth character: add slash if not present
                        if (!value.endsWith('/')) {
                          value = value + '/';
                        }
                      } else if (value.length > 5 && value.includes('/')) {
                        // Year part: limit to 4 digits
                        const parts = value.split('/');
                        if (parts[2] && parts[2].length > 4) {
                          value = parts[0] + '/' + parts[1] + '/' + parts[2].substring(0, 4);
                        }
                      }
                      
                      // Limit to mm/dd/yyyy format (10 characters)
                      if (value.length > 10) {
                        value = value.substring(0, 10);
                      }
                      
                      setProfileData({ ...profileData, birthdate: value });
                    }}
                    onKeyDown={(e) => {
                      // Allow backspace, delete, arrow keys, tab, and escape
                      if ([8, 9, 27, 37, 38, 39, 40, 46].includes(e.keyCode)) {
                        return;
                      }
                      // Allow numbers and forward slash
                      if (!/[0-9/]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full bg-[#232323] border border-[#333] rounded-lg px-8 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] text-center font-mono"
                    placeholder="mm/dd/yyyy"
                    maxLength={10}
                    style={{ letterSpacing: '0.1em' }}
                  />
                </div>
                <div className="relative mb-2 flex items-center">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    name="country"
                    value={profileData.country}
                    onChange={handleChange}
                    className="w-full bg-[#232323] border border-[#333] rounded-lg px-8 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] appearance-none text-center"
                    style={{ backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat' }}
                  >
                    {countries.map((c) => (
                      <option key={c} value={c}>{c ? c : 'Selecciona tu país'}</option>
                    ))}
                  </select>
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    ▼
                  </span>
                </div>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                    className="w-full bg-[#232323] border border-[#333] rounded-lg px-4 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] text-center resize-none"
                  placeholder="Cuéntanos algo sobre ti, tus intereses o lo que esperas aprender..."
                  rows={2}
                />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-1">{profileData.nombre} {profileData.apellido}</h2>
                <p className="text-gray-400 text-sm mb-1">@{profileData.nickname}</p>
                <p className="text-gray-400 text-sm mb-1">{profileData.email}</p>
                {profileData.movil && (
                  <p className="text-gray-400 text-xs mb-1">Teléfono: {profileData.movil}</p>
                )}
                {profileData.exchange && (
                  <p className="text-gray-400 text-xs mb-1">Exchange: {profileData.exchange}</p>
                )}
                {profileData.birthdate && (
                  <p className="text-gray-400 text-xs mb-1">Nacimiento: {profileData.birthdate}</p>
                )}
                {profileData.country && (
                  <p className="text-gray-400 text-xs mb-1">País: {profileData.country}</p>
                )}
                {profileData.bio && (
                  <p className="text-gray-300 text-xs mb-1 italic">{profileData.bio}</p>
                )}
                {profileData.referral_code && (
                  <p className="text-gray-400 text-xs mb-1">Código de Referido: <span className="text-[#8a8a8a] font-mono">{profileData.referral_code}</span></p>
                )}
                {profileData.referred_by && (
                  <p className="text-gray-400 text-xs mb-1">Referido por: <span className="text-[#8a8a8a]">{profileData.referred_by}</span></p>
                )}
                {profileData.total_referrals > 0 && (
                  <p className="text-gray-400 text-xs mb-1">Total de Referidos: <span className="text-[#3ED598] font-bold">{profileData.total_referrals}</span></p>
                )}
              </>
            )}
            <p className="text-gray-500 text-xs">Miembro desde {profileData.created_at ? new Date(profileData.created_at).toLocaleDateString('es-ES') : 'Fecha no disponible'}</p>
            {profileData.updated_at && (
              <p className="text-gray-500 text-xs">Última actualización: {new Date(profileData.updated_at).toLocaleDateString('es-ES')}</p>
            )}
          </div>
          {/* Botón editar/guardar */}
          <button
            className="bg-[#8a8a8a] hover:bg-[#6a6a6a] text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center mb-4 w-full disabled:opacity-50"
            onClick={() => {
              if (isEditing) saveProfile(profileData);
              else setIsEditing(true);
            }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : isEditing ? (
              <Save className="w-4 h-4 mr-2" />
            ) : (
              <Edit3 className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Guardando...' : isEditing ? 'Guardar' : 'Editar perfil'}
          </button>

          {/* Botón cambiar contraseña */}
          <button
            className="bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center mb-6 w-full"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            <Lock className="w-4 h-4 mr-2" />
            {showChangePassword ? 'Cancelar' : 'Cambiar Contraseña'}
          </button>

          {/* Formulario de cambio de contraseña */}
          {showChangePassword && (
            <div className="w-full bg-[#232323] rounded-lg p-4 mb-6 border border-[#333]">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Cambiar Contraseña
              </h3>
              
              {/* Error general */}
              {passwordErrors.general && (
                <div className="mb-4 p-3 bg-[#ec4d58] bg-opacity-20 border border-[#ec4d58] text-[#ec4d58] rounded-lg text-sm">
                  {passwordErrors.general}
                </div>
              )}

              <div className="space-y-4">
                {/* Contraseña actual */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Contraseña Actual
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 bg-[#1a1a1a] text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] ${
                        passwordErrors.currentPassword ? 'border-[#8a8a8a]' : 'border-[#4a4a4a]'
                      }`}
                      placeholder="Tu contraseña actual"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6a6a6a] hover:text-white transition-colors"
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-[#ec4d58] text-sm mt-1">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                {/* Nueva contraseña */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 bg-[#1a1a1a] text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] ${
                        passwordErrors.newPassword ? 'border-[#8a8a8a]' : 'border-[#4a4a4a]'
                      }`}
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6a6a6a] hover:text-white transition-colors"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-[#ec4d58] text-sm mt-1">{passwordErrors.newPassword}</p>
                  )}
                </div>

                {/* Confirmar contraseña */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 bg-[#1a1a1a] text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] ${
                        passwordErrors.confirmPassword ? 'border-[#8a8a8a]' : 'border-[#4a4a4a]'
                      }`}
                      placeholder="Repite la nueva contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6a6a6a] hover:text-white transition-colors"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-[#ec4d58] text-sm mt-1">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Botones */}
                <div className="flex gap-3">
                  <button
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      isChangingPassword
                        ? 'bg-[#6a6a6a] cursor-not-allowed'
                        : 'bg-[#8a8a8a] hover:bg-[#6a6a6a]'
                    } text-white`}
                  >
                    {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
                  </button>
                  <button
                    onClick={() => {
                      setShowChangePassword(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setPasswordErrors({});
                    }}
                    className="px-4 py-2 bg-[#6a6a6a] hover:bg-[#5a5a5a] text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Estadísticas del usuario */}
          <div className="w-full mb-6">
            <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: currentRoleColor }}>
                {currentRoleName}
            </div>
              <div className="text-xs text-[#a0a0a0]">Rol Actual</div>
            </div>
          </div>

          {/* Recent Guest Section */}
          {referralStats && referralStats.recent_referrals && referralStats.recent_referrals.length > 0 && (
            <div className="w-full mb-6">
              <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-[#8a8a8a]" />
                  <h3 className="text-lg font-semibold text-white">Invitados Recientes</h3>
                </div>
                <div className="space-y-2">
                  {referralStats.recent_referrals.slice(0, 3).map((referral, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-[#232323] rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#8a8a8a] rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {referral.email?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{referral.email}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(referral.date).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#3ED598] text-xs font-bold">Invitado</p>
                      </div>
                    </div>
                  ))}
                </div>
                {referralStats.total_referrals > 3 && (
                  <p className="text-xs text-gray-400 text-center mt-2">
                    Y {referralStats.total_referrals - 3} más...
                  </p>
                )}
        </div>
        </div>
          )}
        </div>
      </main>
    </div>
  );
} 