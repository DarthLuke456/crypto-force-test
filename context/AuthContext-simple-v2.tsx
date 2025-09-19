'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

// Tipos
export interface UserData {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  nickname: string;
  movil: string;
  exchange: string;
  user_level: number;
  referral_code: string;
  uid: string;
  codigo_referido: string | null;
  referred_by: string | null;
  total_referrals: number;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isReady: false,
});

export const useAuth = () => useContext(AuthContext);

// Hook simplificado para compatibilidad
export const useSafeAuth = () => {
  const { user, userData, loading, isReady } = useAuth();
  return { user, userData, loading, isReady };
};

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setReady] = useState(false);

  // Función para obtener datos del usuario con fallback
  const fetchUserData = async (userId: string): Promise<UserData | null> => {
    try {
      console.log('🔍 [AUTH] Fetching user data for:', userId);
      
      // Intentar por UID primero
      let { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('uid', userId)
        .single();

      if (error) {
        console.log('⚠️ [AUTH] Error fetching by UID, trying by email...', error.message);
        
        // Fallback: buscar por email
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user?.email) {
          const { data: emailData, error: emailError } = await supabase
            .from('users')
            .select('*')
            .eq('email', sessionData.session.user.email)
            .single();
          
          if (emailError) {
            console.error('❌ [AUTH] Error fetching by email:', emailError);
            return null;
          }
          
          console.log('✅ [AUTH] User data fetched by email:', emailData);
          return emailData;
        }
        
        return null;
      }

      console.log('✅ [AUTH] User data fetched by UID:', data);
      return data;
    } catch (error) {
      console.error('❌ [AUTH] Exception fetching user data:', error);
      return null;
    }
  };

  // Función para crear usuario básico (solo usuarios autorizados)
  const createBasicUser = async (user: User): Promise<UserData | null> => {
    try {
      console.log('🔍 [AUTH] Creating basic user for:', user.email);
      
      const authorizedEmails = ['infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com'];
      if (!user.email || !authorizedEmails.includes(user.email.toLowerCase().trim())) {
        console.log('❌ [AUTH] User not authorized:', user.email);
        return null;
      }
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          uid: user.id,
          email: user.email || '',
          nombre: '',
          apellido: '',
          nickname: user.email?.split('@')[0] || 'Usuario',
          movil: '',
          exchange: '',
          user_level: 1,
          referral_code: `CRYPTOFORCE-${user.email?.split('@')[0]?.toUpperCase() || 'USER'}`,
          codigo_referido: null,
          referred_by: null,
          total_referrals: 0
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [AUTH] Error creating user:', error);
        return null;
      }

      console.log('✅ [AUTH] User created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ [AUTH] Exception creating user:', error);
      return null;
    }
  };

  // Inicialización
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔍 [AUTH] Initializing auth...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ [AUTH] Error getting session:', error);
          if (mounted) {
            setReady(true);
            setLoading(false);
          }
          return;
        }

        if (session?.user) {
          console.log('✅ [AUTH] Session found, user:', session.user.email);
          
          const authorizedEmails = ['infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com'];
          const isAuthorized = session.user.email && authorizedEmails.includes(session.user.email.toLowerCase().trim());
          
          if (!isAuthorized) {
            console.log('⚠️ [AUTH] User not in authorized list, but allowing access:', session.user.email);
          }

          if (mounted) {
            setUser(session.user);
          }

          // Intentar obtener datos del usuario
          const userData = await fetchUserData(session.user.id);
          
          if (userData) {
            if (mounted) {
              setUserData(userData);
            }
          } else {
            // Si no se encuentran datos, crear usuario básico
            const newUserData = await createBasicUser(session.user);
            if (newUserData && mounted) {
              setUserData(newUserData);
            }
          }
        }

        if (mounted) {
          setReady(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ [AUTH] Exception in initializeAuth:', error);
        if (mounted) {
          setReady(true);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listener para cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 [AUTH] Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        
        const userData = await fetchUserData(session.user.id);
        if (userData) {
          setUserData(userData);
        } else {
          const newUserData = await createBasicUser(session.user);
          if (newUserData) {
            setUserData(newUserData);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserData(null);
      }
      
      setReady(true);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}
