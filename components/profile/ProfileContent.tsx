'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Edit3, Save, Camera, CheckCircle, Phone, Mail, User as UserIcon, Calendar, Globe, Lock, Eye, EyeOff, AlertCircle, Loader2, Users } from 'lucide-react';
import { useSafeAuth } from '@/context/AuthContext-offline';
import { supabase } from '@/lib/supabaseClient';
import { useAvatarSimple as useAvatar } from '@/hooks/useAvatarSimple';
import { useReferralDataSimple } from '@/hooks/useReferralDataSimple';
import { useUserDataSync } from '@/hooks/useUserDataSync';

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
    case 0: return '#FF8C42';
    case 1: return '#fafafa';
    case 2: return '#FFD447';
    case 3: return '#3ED598';
    case 4: return '#4671D5';
    case 5: return '#ec4d58';
    case 6: return '#8a8a8a';
    default: return '#fafafa';
  }
};

export default function ProfileContent() {
  const { userData } = useSafeAuth();
  const { avatar: userAvatar, changeAvatar } = useAvatar();
  const { stats: referralStats } = useReferralDataSimple();
  const { emitUserDataUpdate } = useUserDataSync();

  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  const [profileData, setProfileData] = useState({
    nombre: '', apellido: '', nickname: '', email: '', movil: '', exchange: '',
    avatar: '/images/default-avatar.png', user_level: 1,
    referral_code: '', referred_by: '', total_referrals: 0, created_at: '', updated_at: '',
    birthdate: '', country: '', bio: ''
  });

  const [avatarPreview, setAvatarPreview] = useState(userAvatar || profileData.avatar);

  // Update avatar preview when userAvatar changes
  useEffect(() => {
    setAvatarPreview(userAvatar || profileData.avatar);
  }, [userAvatar, profileData.avatar]);

  // Load profile data when userData changes - SIMPLIFIED VERSION
  useEffect(() => {
    if (!userData) {
      console.log('🔍 ProfileContent: No userData available');
      return;
    }
    
    console.log('🔍 ProfileContent: Loading profile data...');
    console.log('🔍 ProfileContent: Current userData:', userData);
    
    // Use userData directly without any sync calls
    const sanitizedData = {
      nombre: userData.nombre || '', 
      apellido: userData.apellido || '', 
      nickname: userData.nickname || '',
      email: userData.email || '', 
      movil: userData.movil || '', 
      exchange: userData.exchange || '',
      avatar: userAvatar || '/images/default-avatar.png',
      user_level: userData.user_level || 1,
      referral_code: userData.referral_code || '', 
      referred_by: userData.referred_by || '',
      total_referrals: userData.total_referrals || 0, 
      created_at: userData.created_at || new Date().toISOString(),
      updated_at: userData.updated_at || new Date().toISOString(),
      birthdate: userData.birthdate || '',
      country: userData.country || '',
      bio: userData.bio || ''
    };
    
    console.log('🔍 ProfileContent: Sanitized data:', sanitizedData);
    setProfileData(sanitizedData);
    setAvatarPreview(sanitizedData.avatar);
    console.log('✅ ProfileContent: Datos del perfil cargados');
  }, [userData, userAvatar]);

  const saveProfile = async (newData: typeof profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar que el usuario esté autenticado
      if (!userData) {
        throw new Error('No hay usuario autenticado');
      }
      
      console.log('🔍 ProfileContent: Iniciando saveProfile');
      console.log('🔍 ProfileContent: Datos recibidos:', newData);
      
      // Preparar datos para enviar a la base de datos (solo campos que existen en BD)
      const cleanedData = {
        nombre: newData.nombre || '', 
        apellido: newData.apellido || '', 
        nickname: newData.nickname || '',
        email: newData.email || '', 
        movil: newData.movil || '', 
        exchange: newData.exchange || '',
        avatar: newData.avatar || '/images/default-avatar.png', 
        user_level: newData.user_level || 1
      };
      
      console.log('🔍 ProfileContent: Datos limpios:', cleanedData);
      
      // Guardar en la base de datos usando la API offline
      const response = await fetch('/api/profile/update-offline', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cleanedData)
      });
      
      console.log('🔍 ProfileContent: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 ProfileContent: Response data:', data);
        
        if (data.success) {
          // Actualizar los datos en localStorage
          const updatedUserData = { ...userData, ...cleanedData };
          localStorage.setItem('crypto-force-user-data', JSON.stringify(updatedUserData));
          
          // Actualizar el estado local
          setProfileData({ ...profileData, ...cleanedData });
          setIsEditing(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
          
          console.log('✅ ProfileContent: Perfil actualizado correctamente en BD y localStorage');
        } else {
          console.error('❌ ProfileContent: Error en response data:', data.error);
          setError(data.error || 'Error actualizando perfil');
        }
      } else {
        console.error('❌ ProfileContent: Response no ok, status:', response.status);
        try {
          const errorData = await response.json();
          console.error('❌ ProfileContent: Error data:', errorData);
          setError(errorData.error || 'Error actualizando perfil');
        } catch (parseError) {
          console.error('❌ ProfileContent: Error parsing error response:', parseError);
          setError(`Error ${response.status}: ${response.statusText}`);
        }
      }
    } catch (e) {
      console.error('❌ ProfileContent: Error en saveProfile:', e);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Por favor selecciona un archivo de imagen válido'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('La imagen debe ser menor a 5MB'); return; }
    const reader = new FileReader();
    reader.onload = async (ev: ProgressEvent<FileReader>) => {
      if (ev.target && typeof ev.target.result === 'string') {
        setAvatarPreview(ev.target.result);
        try {
          setLoading(true);
          setError(null);
          await changeAvatar(ev.target.result);
          const updatedProfile = { ...profileData, avatar: ev.target?.result as string };
          setProfileData(updatedProfile);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
          
          // Emitir evento de actualización de perfil (avatar)
          emitUserDataUpdate({
            type: 'profile_updated',
            userId: userData?.id || '',
            userData: {
              ...userData,
              avatar: ev.target?.result as string
            },
            timestamp: new Date().toISOString()
          });
        } catch (e) {
          console.error('❌ ProfileContent: Error cambiando avatar:', e);
          setError('Error cambiando avatar');
        } finally {
          setLoading(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(profileData);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordErrors({});

    // Validaciones
    const errors: Record<string, string> = {};
    if (!passwordData.currentPassword) errors.currentPassword = 'Contraseña actual requerida';
    if (!passwordData.newPassword) errors.newPassword = 'Nueva contraseña requerida';
    if (passwordData.newPassword.length < 6) errors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    if (passwordData.newPassword !== passwordData.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden';

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      setIsChangingPassword(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Error cambiando contraseña');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-[#fafafa] text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-[#fafafa] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#fafafa] mb-2">Mi Perfil</h1>
          <p className="text-[#8a8a8a]">Gestiona tu información personal y configuración</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-green-400">Perfil actualizado correctamente</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#fafafa]">Información Personal</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#8a8a8a] text-[#121212] rounded-lg hover:bg-[#999] transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                    Editar
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-[#333] text-[#fafafa] rounded-lg hover:bg-[#444] transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-[#8a8a8a] text-[#121212] rounded-lg hover:bg-[#999] transition-colors disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Guardar
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Image
                      src={avatarPreview}
                      alt="Avatar"
                      width={80}
                      height={80}
                      className="rounded-full border-2 border-[#333]"
                    />
                    {isEditing && (
                      <label className="absolute -bottom-2 -right-2 bg-[#8a8a8a] text-[#121212] p-2 rounded-full cursor-pointer hover:bg-[#999] transition-colors">
                        <Camera className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#fafafa]">{profileData.nombre} {profileData.apellido}</h3>
                    <p className="text-[#8a8a8a]">{getRoleName(profileData.user_level)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: getLevelColor(profileData.user_level) }}
                      />
                      <span className="text-sm text-[#8a8a8a]">Nivel {profileData.user_level}</span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#fafafa] mb-2">Nombre</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        className="w-full px-3 py-2 bg-[#121212] border border-[#333] rounded-lg text-[#fafafa] focus:border-[#8a8a8a] focus:outline-none"
                      />
                    ) : (
                      <p className="text-[#8a8a8a]">{profileData.nombre || 'No especificado'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#fafafa] mb-2">Apellido</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.apellido}
                        onChange={(e) => handleInputChange('apellido', e.target.value)}
                        className="w-full px-3 py-2 bg-[#121212] border border-[#333] rounded-lg text-[#fafafa] focus:border-[#8a8a8a] focus:outline-none"
                      />
                    ) : (
                      <p className="text-[#8a8a8a]">{profileData.apellido || 'No especificado'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#fafafa] mb-2">Nickname</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.nickname}
                        onChange={(e) => handleInputChange('nickname', e.target.value)}
                        className="w-full px-3 py-2 bg-[#121212] border border-[#333] rounded-lg text-[#fafafa] focus:border-[#8a8a8a] focus:outline-none"
                      />
                    ) : (
                      <p className="text-[#8a8a8a]">{profileData.nickname || 'No especificado'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#fafafa] mb-2">Email</label>
                    <p className="text-[#8a8a8a]">{profileData.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#fafafa] mb-2">Teléfono</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.movil}
                        onChange={(e) => handleInputChange('movil', e.target.value)}
                        className="w-full px-3 py-2 bg-[#121212] border border-[#333] rounded-lg text-[#fafafa] focus:border-[#8a8a8a] focus:outline-none"
                      />
                    ) : (
                      <p className="text-[#8a8a8a]">{profileData.movil || 'No especificado'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#fafafa] mb-2">Exchange</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.exchange}
                        onChange={(e) => handleInputChange('exchange', e.target.value)}
                        className="w-full px-3 py-2 bg-[#121212] border border-[#333] rounded-lg text-[#fafafa] focus:border-[#8a8a8a] focus:outline-none"
                      />
                    ) : (
                      <p className="text-[#8a8a8a]">{profileData.exchange || 'No especificado'}</p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Stats */}
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333]">
              <h3 className="text-lg font-semibold text-[#fafafa] mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#8a8a8a]">Nivel</span>
                  <span className="text-[#fafafa] font-medium">{getRoleName(profileData.user_level)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8a8a8a]">Referidos</span>
                  <span className="text-[#fafafa] font-medium">{profileData.total_referrals}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8a8a8a]">Miembro desde</span>
                  <span className="text-[#fafafa] font-medium">
                    {new Date(profileData.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Referral Code */}
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333]">
              <h3 className="text-lg font-semibold text-[#fafafa] mb-4">Código de Referido</h3>
              <div className="bg-[#121212] rounded-lg p-4 border border-[#333]">
                <p className="text-[#8a8a8a] text-sm mb-2">Tu código de referido:</p>
                <p className="text-[#fafafa] font-mono text-lg">{profileData.referral_code}</p>
              </div>
            </div>

            {/* Security */}
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333]">
              <h3 className="text-lg font-semibold text-[#fafafa] mb-4">Seguridad</h3>
              <button
                onClick={() => setShowChangePassword(true)}
                className="w-full flex items-center gap-2 px-4 py-2 bg-[#333] text-[#fafafa] rounded-lg hover:bg-[#444] transition-colors"
              >
                <Lock className="h-4 w-4" />
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md border border-[#333]">
              <h3 className="text-xl font-semibold text-[#fafafa] mb-4">Cambiar Contraseña</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#fafafa] mb-2">Contraseña Actual</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#333] rounded-lg text-[#fafafa] focus:border-[#8a8a8a] focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8a8a8a]"
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-red-400 text-sm mt-1">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#fafafa] mb-2">Nueva Contraseña</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#333] rounded-lg text-[#fafafa] focus:border-[#8a8a8a] focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8a8a8a]"
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-red-400 text-sm mt-1">{passwordErrors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#fafafa] mb-2">Confirmar Nueva Contraseña</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#333] rounded-lg text-[#fafafa] focus:border-[#8a8a8a] focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8a8a8a]"
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    className="flex-1 px-4 py-2 bg-[#333] text-[#fafafa] rounded-lg hover:bg-[#444] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#8a8a8a] text-[#121212] rounded-lg hover:bg-[#999] transition-colors disabled:opacity-50"
                  >
                    {isChangingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cambiar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}