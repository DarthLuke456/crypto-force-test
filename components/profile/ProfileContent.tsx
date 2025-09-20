'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Edit3, Save, Camera, CheckCircle, Phone, Mail, User as UserIcon, Calendar, Globe, Lock, Eye, EyeOff, AlertCircle, Loader2, Users } from 'lucide-react';
import { useSafeAuth } from '@/context/AuthContext';
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
  const { user, userData } = useSafeAuth();
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
    referral_code: '', referred_by: '', total_referrals: 0, created_at: '', updated_at: ''
  });

  const [avatarPreview, setAvatarPreview] = useState(userAvatar || profileData.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAvatarPreview(userAvatar || profileData.avatar);
  }, [userAvatar, profileData.avatar]);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) throw new Error('No hay sesión activa');
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            const sanitizedData = {
              nombre: data.data.nombre || '', apellido: data.data.apellido || '', nickname: data.data.nickname || '',
              email: data.data.email || '', movil: data.data.movil || '', exchange: data.data.exchange || '',
              avatar: data.data.avatar || '/images/default-avatar.png',
              user_level: data.data.user_level || 1,
              referral_code: data.data.referral_code || '', referred_by: data.data.referred_by || '',
              total_referrals: data.data.total_referrals || 0, created_at: data.data.created_at || '',
              updated_at: data.data.updated_at || ''
            };
            setProfileData(sanitizedData);
          }
        }
      } catch (e) {
        console.error('Error cargando datos del perfil:', e);
        setError('Error cargando datos del perfil');
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, [user]);

  const saveProfile = async (newData: typeof profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar que el usuario esté autenticado
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }
      
      // Obtener la sesión actual
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No hay sesión activa');
      }
      
      const cleanedData = {
        nombre: newData.nombre || '', apellido: newData.apellido || '', nickname: newData.nickname || '',
        email: newData.email || '', movil: newData.movil || '', exchange: newData.exchange || '',
        avatar: newData.avatar || '/images/default-avatar.png', user_level: newData.user_level || 1
      };
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify(cleanedData)
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfileData(data.profile);
          setIsEditing(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
          
          // Emitir evento de actualización de perfil
          emitUserDataUpdate({
            type: 'profile_updated',
            userId: user?.id || '',
            userData: data.profile,
            timestamp: new Date().toISOString()
          });
        } else {
          setError(data.error || 'Error actualizando perfil');
        }
      } else {
        try {
          const errorData = await response.json();
          setError(errorData.error || 'Error actualizando perfil');
        } catch (parseError) {
          setError(`Error ${response.status}: ${response.statusText}`);
        }
      }
    } catch (e) {
      console.error('Error en saveProfile:', e);
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
            userId: user?.id || '',
            userData: updatedProfile,
            timestamp: new Date().toISOString()
          });
        } catch (err) {
          console.error('Error actualizando avatar:', err);
          setError('Error de conexión');
        } finally { setLoading(false); }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) setPasswordErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};
    if (!passwordData.currentPassword.trim()) newErrors.currentPassword = 'La contraseña actual es requerida';
    if (!passwordData.newPassword.trim()) newErrors.newPassword = 'La nueva contraseña es requerida';
    else if (passwordData.newPassword.length < 6) newErrors.newPassword = 'La nueva contraseña debe tener al menos 6 caracteres';
    if (!passwordData.confirmPassword.trim()) newErrors.confirmPassword = 'Confirma la nueva contraseña';
    else if (passwordData.newPassword !== passwordData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;
    setIsChangingPassword(true);
    setPasswordErrors({});
    try {
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: userData?.email || profileData.email,
        password: passwordData.currentPassword
      });
      if (reauthError) { setPasswordErrors({ currentPassword: 'La contraseña actual es incorrecta' }); return; }
      const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
      if (error) { setPasswordErrors({ general: error.message }); return; }
      setShowSuccess(true);
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setPasswordErrors({ general: errorMessage });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-8 max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Sesión Expirada</h2>
            <p className="text-gray-400 mb-6">Tu sesión ha expirado. Por favor, inicia sesión nuevamente.</p>
            <button onClick={() => window.location.href = '/login/signin'} className="bg-[#8a8a8a] hover:bg-[#6a6a6a] text-white px-6 py-2 rounded-lg transition-colors">Ir al Login</button>
          </div>
        </div>
      </div>
    );
  }

  const userActualLevel = userData?.user_level || profileData.user_level || 1;
  const currentRoleName = getRoleName(userActualLevel);
  const currentRoleColor = getLevelColor(userActualLevel);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] text-white">
      <main className="flex-1 flex flex-col items-center justify-start pt-24 pb-8 px-4 transition-all duration-300">
        <div className="w-full max-w-md bg-[#181818] rounded-2xl shadow-lg p-8 border border-[#232323] flex flex-col items-center relative">
          {showSuccess && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-green-600/90 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out z-20">
              <CheckCircle className="w-5 h-5 text-white" />
              <span>¡Perfil actualizado!</span>
            </div>
          )}
          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-red-600/90 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out z-20">
              <AlertCircle className="w-5 h-5 text-white" />
              <span>{error}</span>
            </div>
          )}

          <div className="relative mb-4">
            <Image src={avatarPreview} alt="Tu foto de perfil" width={128} height={128} className="w-32 h-32 rounded-full object-cover border-4 border-[#8a8a8a] shadow-lg" />
            <button className="absolute bottom-2 right-2 bg-[#8a8a8a] p-2 rounded-full hover:bg-[#6a6a6a] transition-colors" onClick={() => fileInputRef.current && fileInputRef.current.click()} aria-label="Cambiar foto de perfil">
              <Camera className="w-5 h-5 text-white" />
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>

          <div className="w-full text-center mb-6">
            {isEditing ? (
              <>
                <div className="relative mb-2 flex items-center">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input name="nombre" value={profileData.nombre} onChange={handleChange} className="w-full bg-[#232323] border border-[#333] rounded-lg px-8 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] text-center" placeholder="Tu nombre" />
                </div>
                <div className="relative mb-2 flex items-center">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input name="apellido" value={profileData.apellido} onChange={handleChange} className="w-full bg-[#232323] border border-[#333] rounded-lg px-8 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] text-center" placeholder="Tu apellido" />
                </div>
                <div className="relative mb-2 flex items-center">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input name="nickname" value={profileData.nickname} onChange={handleChange} className="w-full bg-[#232323] border border-[#333] rounded-lg px-8 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] text-center" placeholder="Tu nickname" />
                </div>
                <div className="relative mb-2 flex items-center">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input name="email" value={profileData.email} onChange={handleChange} className="w-full bg-[#232323] border border-[#333] rounded-lg px-8 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] text-center" placeholder="Tu correo" type="email" />
                </div>
                <div className="relative mb-2 flex items-center">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input name="movil" value={profileData.movil} onChange={handleChange} className="w-full bg-[#232323] border border-[#333] rounded-lg px-8 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] text-center" placeholder="Teléfono (opcional)" type="tel" />
                </div>
                <div className="relative mb-2 flex items-center">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select name="exchange" value={profileData.exchange} onChange={handleChange} className="w-full bg-[#232323] border border-[#333] rounded-lg px-8 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] appearance-none text-center" style={{ backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat' }}>
                    <option value="">Selecciona Exchange</option>
                    <option value="ZoomEx">ZoomEx</option>
                    <option value="Bitget">Bitget</option>
                  </select>
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-1">{profileData.nombre} {profileData.apellido}</h2>
                <p className="text-gray-400 text-sm mb-1">@{profileData.nickname}</p>
                <p className="text-gray-400 text-sm mb-1">{profileData.email}</p>
                {profileData.movil && (<p className="text-gray-400 text-xs mb-1">Teléfono: {profileData.movil}</p>)}
                {profileData.exchange && (<p className="text-gray-400 text-xs mb-1">Exchange: {profileData.exchange}</p>)}
                {profileData.referral_code && (<p className="text-gray-400 text-xs mb-1">Código de Referido: <span className="text-[#8a8a8a] font-mono">{profileData.referral_code}</span></p>)}
                {profileData.referred_by && (<p className="text-gray-400 text-xs mb-1">Referido por: <span className="text-[#8a8a8a]">{profileData.referred_by}</span></p>)}
                {profileData.total_referrals > 0 && (<p className="text-gray-400 text-xs mb-1">Total de Referidos: <span className="text-[#3ED598] font-bold">{profileData.total_referrals}</span></p>)}
              </>
            )}
            <p className="text-gray-500 text-xs">Miembro desde {profileData.created_at ? new Date(profileData.created_at).toLocaleDateString('es-ES') : 'Fecha no disponible'}</p>
            {profileData.updated_at && (<p className="text-gray-500 text-xs">Última actualización: {new Date(profileData.updated_at).toLocaleDateString('es-ES')}</p>)}
          </div>

          <button className="bg-[#8a8a8a] hover:bg-[#6a6a6a] text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center mb-4 w-full disabled:opacity-50" onClick={() => { if (isEditing) saveProfile(profileData); else setIsEditing(true); }} disabled={loading}>
            {loading ? (<Loader2 className="w-4 h-4 mr-2 animate-spin" />) : isEditing ? (<Save className="w-4 h-4 mr-2" />) : (<Edit3 className="w-4 h-4 mr-2" />)}
            {loading ? 'Guardando...' : isEditing ? 'Guardar' : 'Editar perfil'}
          </button>

          <button className="bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center mb-6 w-full" onClick={() => setShowChangePassword(!showChangePassword)}>
            <Lock className="w-4 h-4 mr-2" />
            {showChangePassword ? 'Cancelar' : 'Cambiar Contraseña'}
          </button>

          {showChangePassword && (
            <div className="w-full bg-[#232323] rounded-lg p-4 mb-6 border border-[#333]">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Cambiar Contraseña
              </h3>
              {passwordErrors.general && (<div className="mb-4 p-3 bg-[#ec4d58] bg-opacity-20 border border-[#ec4d58] text-[#ec4d58] rounded-lg text-sm">{passwordErrors.general}</div>)}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Contraseña Actual</label>
                  <div className="relative">
                    <input type={showPasswords.current ? 'text' : 'password'} value={passwordData.currentPassword} onChange={(e) => handlePasswordChange('currentPassword', e.target.value)} className={`w-full px-3 py-2 pr-10 bg-[#1a1a1a] text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] ${passwordErrors.currentPassword ? 'border-[#8a8a8a]' : 'border-[#4a4a4a]'}`} placeholder="Tu contraseña actual" />
                    <button type="button" onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6a6a6a] hover:text-white transition-colors">{showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                  {passwordErrors.currentPassword && (<p className="text-[#ec4d58] text-sm mt-1">{passwordErrors.currentPassword}</p>)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Nueva Contraseña</label>
                  <div className="relative">
                    <input type={showPasswords.new ? 'text' : 'password'} value={passwordData.newPassword} onChange={(e) => handlePasswordChange('newPassword', e.target.value)} className={`w-full px-3 py-2 pr-10 bg-[#1a1a1a] text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] ${passwordErrors.newPassword ? 'border-[#8a8a8a]' : 'border-[#4a4a4a]'}`} placeholder="Mínimo 6 caracteres" />
                    <button type="button" onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6a6a6a] hover:text-white transition-colors">{showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                  {passwordErrors.newPassword && (<p className="text-[#ec4d58] text-sm mt-1">{passwordErrors.newPassword}</p>)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Confirmar Nueva Contraseña</label>
                  <div className="relative">
                    <input type={showPasswords.confirm ? 'text' : 'password'} value={passwordData.confirmPassword} onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)} className={`w-full px-3 py-2 pr-10 bg-[#1a1a1a] text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#8a8a8a] ${passwordErrors.confirmPassword ? 'border-[#8a8a8a]' : 'border-[#4a4a4a]'}`} placeholder="Repite la nueva contraseña" />
                    <button type="button" onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6a6a6a] hover:text-white transition-colors">{showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                  {passwordErrors.confirmPassword && (<p className="text-[#ec4d58] text-sm mt-1">{passwordErrors.confirmPassword}</p>)}
                </div>
                <div className="flex gap-3">
                  <button onClick={handleChangePassword} disabled={isChangingPassword} className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${isChangingPassword ? 'bg-[#6a6a6a] cursor-not-allowed' : 'bg-[#8a8a8a] hover:bg-[#6a6a6a]'} text-white`}>{isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}</button>
                  <button onClick={() => { setShowChangePassword(false); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); setPasswordErrors({}); }} className="px-4 py-2 bg-[#6a6a6a] hover:bg-[#5a5a5a] text-white rounded-lg transition-colors">Cancelar</button>
                </div>
              </div>
            </div>
          )}

          <div className="w-full mb-6">
            <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: currentRoleColor }}>{currentRoleName}</div>
              <div className="text-xs text-[#a0a0a0]">Rol Actual</div>
            </div>
          </div>

          {referralStats && referralStats.recent_referrals && referralStats.recent_referrals.length > 0 && (
            <div className="w-full mb-6">
              <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-[#8a8a8a]" />
                  <h3 className="text-lg font-semibold text-white">Invitados Recientes</h3>
                </div>
                <div className="space-y-2">
                  {referralStats.recent_referrals.slice(0, 3).map((referral: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-[#232323] rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#8a8a8a] rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{referral.email?.charAt(0).toUpperCase() || 'U'}</span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{referral.email}</p>
                          <p className="text-xs text-gray-400">{new Date(referral.date).toLocaleDateString('es-ES')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#3ED598] text-xs font-bold">Invitado</p>
                      </div>
                    </div>
                  ))}
                </div>
                {referralStats.total_referrals > 3 && (
                  <p className="text-xs text-gray-400 text-center mt-2">Y {referralStats.total_referrals - 3} más...</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


