import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface ProfileData {
  id: string;
  uid: string;
  nombre: string;
  apellido: string;
  nickname: string;
  email: string;
  movil: string;
  exchange: string;
  user_level: number;
  referral_code: string;
  referred_by: string;
  total_referrals: number;
  created_at: string;
  updated_at: string;
  avatar: string;
  birthdate: string;
  country: string;
  bio: string;
}

interface UseProfileReturn {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<ProfileData>) => Promise<boolean>;
  updateAvatar: (avatar: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
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
        if (data.profile) {
          setProfile(data.profile);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error cargando perfil');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<ProfileData>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success && responseData.profile) {
          setProfile(responseData.profile);
          return true;
        } else {
          setError(responseData.error || 'Error actualizando perfil');
          return false;
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error actualizando perfil');
        return false;
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAvatar = useCallback(async (avatar: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ avatar })
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          setProfile(prev => prev ? { ...prev, avatar } : null);
          return true;
        } else {
          setError(responseData.error || 'Error actualizando avatar');
          return false;
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error actualizando avatar');
        return false;
      }
    } catch (err) {
      console.error('Error updating avatar:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          return true;
        } else {
          setError(responseData.error || 'Error cambiando contraseña');
          return false;
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error cambiando contraseña');
        return false;
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    updateAvatar,
    changePassword,
    refetch
  };
}
