'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Edit3, Save, Camera, CheckCircle, Phone, Mail, User as UserIcon, Calendar, Globe, Lock, Eye, EyeOff, AlertCircle, Loader2, Users } from 'lucide-react';
import { useSafeAuth } from '@/context/AuthContext-working';
import { supabase } from '@/lib/supabaseClient';
import { useAvatarOptimized as useAvatar } from '@/hooks/useAvatarOptimized';
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
    case 0: return '#FF8C42'; // Fundador - Orange
    case 1: return '#8a8a8a'; // Iniciado - Gray
    case 2: return '#FFD447'; // Acólito - Yellow
    case 3: return '#3ED598'; // Warrior - Green
    case 4: return '#4671D5'; // Lord - Blue
    case 5: return '#ec4d58'; // Darth - Red
    case 6: return '#8a8a8a'; // Maestro - Gray
    default: return '#8a8a8a';
  }
};

export default function ProfileContent() {
  const { userData, refreshUserData } = useSafeAuth();
  const { avatar: userAvatar, changeAvatar, isLoading: avatarLoading } = useAvatar();
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

  // Ref to track the last processed userData to prevent unnecessary re-renders
  const lastProcessedUserData = useRef<string>('');

  const [avatarPreview, setAvatarPreview] = useState(userAvatar || profileData.avatar);

  // Update avatar preview when userAvatar changes
  useEffect(() => {
    setAvatarPreview(userAvatar || profileData.avatar);
  }, [userAvatar, profileData.avatar]);

  // Load profile data when userData changes - OPTIMIZED WITH REF
  useEffect(() => {
    console.log('🔍 ProfileContent: useEffect triggered');
    console.log('🔍 ProfileContent: userData exists:', !!userData);
    console.log('🔍 ProfileContent: userData ID:', userData?.id);
    console.log('🔍 ProfileContent: userData email:', userData?.email);
    console.log('🔍 ProfileContent: userData nombre:', userData?.nombre);
    console.log('🔍 ProfileContent: userData apellido:', userData?.apellido);
    console.log('🔍 ProfileContent: userData nickname:', userData?.nickname);
    console.log('🔍 ProfileContent: userData user_level:', userData?.user_level);
    
    if (!userData) {
      console.log('🔍 ProfileContent: No userData available');
      return;
    }
    
    // Create a hash of the current userData to check if it has actually changed
    // Include bio field and exclude avatar to prevent issues with large base64 strings
    const currentUserDataHash = JSON.stringify({
      id: userData.id,
      email: userData.email,
      nombre: userData.nombre,
      apellido: userData.apellido,
      nickname: userData.nickname,
      user_level: userData.user_level,
      bio: userData.bio
      // Excluded avatar to prevent hash issues with large base64 strings
    });
    
    console.log('🔍 ProfileContent: Current hash:', currentUserDataHash);
    console.log('🔍 ProfileContent: Last processed hash:', lastProcessedUserData.current);
    
    // Check if the data has actually changed
    if (currentUserDataHash === lastProcessedUserData.current) {
      console.log('🔍 ProfileContent: No significant changes detected, skipping update');
      return;
    }
    
    console.log('🔄 ProfileContent: userData changed, updating profile data...');
    console.log('🔍 ProfileContent: Current userData:', userData);
    console.log('🔍 ProfileContent: User level from database:', userData.user_level);
    console.log('🔍 ProfileContent: User email:', userData.email);
    console.log('🔍 ProfileContent: User nombre:', userData.nombre);
    console.log('🔍 ProfileContent: User apellido:', userData.apellido);
    console.log('🔍 ProfileContent: User nickname:', userData.nickname);
    
    // Use userData directly without any sync calls
    // Fix: Ensure correct user level for authorized emails
    let correctUserLevel = userData.user_level || 1;
    if (userData.email === 'coeurdeluke.js@gmail.com' || userData.email === 'infocryptoforce@gmail.com') {
      correctUserLevel = 0; // Fundador level for authorized emails
    } else if (userData.email === 'coeurdeluke@gmail.com') {
      correctUserLevel = 1; // Iniciado level for coeurdeluke@gmail.com
    }
    
    const sanitizedData = {
      nombre: userData.nombre || '', 
      apellido: userData.apellido || '', 
      nickname: userData.nickname || '',
      email: userData.email || '', 
      movil: userData.movil || '', 
      exchange: userData.exchange || '',
      avatar: userData.avatar || '/images/default-avatar.png',
      user_level: correctUserLevel,
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
    console.log('🔍 ProfileContent: Calculated role name:', getRoleName(sanitizedData.user_level));
    console.log('🔍 ProfileContent: Calculated role color:', getLevelColor(sanitizedData.user_level));
    setProfileData(sanitizedData);
    setAvatarPreview(sanitizedData.avatar);
    
    // Update the ref to track that we've processed this userData
    lastProcessedUserData.current = currentUserDataHash;
    console.log('✅ ProfileContent: Datos del perfil cargados');
  }, [userData?.id, userData?.email, userData?.nombre, userData?.apellido, userData?.nickname, userData?.user_level, userData?.avatar]); // Include avatar in dependencies

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
        user_level: newData.user_level || 1,
        bio: newData.bio || ''
      };
      
      console.log('🔍 ProfileContent: Datos limpios:', cleanedData);
      
      // Guardar en la base de datos usando Supabase directamente
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error('No hay sesión activa');
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          nombre: cleanedData.nombre,
          apellido: cleanedData.apellido,
          nickname: cleanedData.nickname,
          email: cleanedData.email,
          movil: cleanedData.movil,
          exchange: cleanedData.exchange,
          avatar: cleanedData.avatar,
          user_level: cleanedData.user_level,
          bio: cleanedData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('email', session.session.user.email);

      if (error) {
        console.error('❌ ProfileContent: Error actualizando perfil:', error);
        throw new Error(`Error actualizando perfil: ${error.message}`);
      }

      console.log('✅ ProfileContent: Perfil actualizado exitosamente:', data);
      
      // Refrescar los datos del usuario usando AuthContext
      console.log('🔄 ProfileContent: Calling refreshUserData...');
      await refreshUserData();
      console.log('✅ ProfileContent: refreshUserData completed');
      
      // Actualizar el estado local
      setProfileData({ ...profileData, ...cleanedData });
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
      console.log('✅ ProfileContent: Perfil actualizado correctamente en BD y localStorage');
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
    if (!file.type.startsWith('image/')) { 
      setError('Por favor selecciona un archivo de imagen válido'); 
      return; 
    }
    if (file.size > 5 * 1024 * 1024) { 
      setError('La imagen debe ser menor a 5MB'); 
      return; 
    }
    
    const reader = new FileReader();
    
    reader.onload = async (ev: ProgressEvent<FileReader>) => {
      if (ev.target && typeof ev.target.result === 'string') {
        try {
          setError(null);
          setAvatarPreview(ev.target.result);
          
          console.log('🔄 ProfileContent: Starting avatar change process...');
          await changeAvatar(ev.target.result);
          
          const updatedProfile = { ...profileData, avatar: ev.target.result };
          setProfileData(updatedProfile);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
          
          console.log('✅ ProfileContent: Avatar changed successfully');
          
          // Avatar changes are handled by useAvatarOptimized hook
          // The hook will automatically sync the avatar across components
        } catch (error) {
          console.error('❌ ProfileContent: Error cambiando avatar:', error);
          setError(`Error cambiando avatar: ${error instanceof Error ? error.message : 'Error desconocido'}`);
          // Revert preview on error
          setAvatarPreview(userAvatar || profileData.avatar);
        }
      }
    };
    
    reader.onerror = (error) => {
      console.error('❌ ProfileContent: Error reading file:', error);
      setError('Error leyendo el archivo de imagen');
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
          <div className="lg:col-span-2 order-2 lg:order-1">
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
                      disabled={loading || avatarLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-[#8a8a8a] text-[#121212] rounded-lg hover:bg-[#999] transition-colors disabled:opacity-50"
                    >
                      {(loading || avatarLoading) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
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
                      <label className={`absolute -bottom-2 -right-2 bg-[#8a8a8a] text-[#121212] p-2 rounded-full cursor-pointer hover:bg-[#999] transition-colors ${avatarLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {avatarLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          disabled={avatarLoading}
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

                {/* Bio Field - Full Width */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-[#fafafa] mb-2">Biografía</label>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Cuéntanos algo sobre ti..."
                      rows={4}
                      maxLength={500}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#333] rounded-lg text-[#fafafa] focus:border-[#8a8a8a] focus:outline-none resize-none"
                    />
                  ) : (
                    <div className="bg-[#121212] border border-[#333] rounded-lg p-4">
                      <p className="text-[#fafafa] italic">
                        {profileData.bio || 'No hay biografía disponible'}
                      </p>
                    </div>
                  )}
                  {isEditing && (
                    <p className="text-xs text-[#8a8a8a] mt-1">
                      {profileData.bio?.length || 0}/500 caracteres
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 order-1 lg:order-2">
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md border border-[#333] max-h-[90vh] overflow-y-auto">
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