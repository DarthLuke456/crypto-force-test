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
  created_at: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isReady: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, metadata: any) => Promise<{ success: boolean; error?: string }>;
  clearSession: () => Promise<void>;
  resetLoginState: () => void;
  isMaestroAuthorized: (email: string) => boolean;
}

// Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado
export function useSafeAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSafeAuth must be used within an AuthProvider');
  }
  return context;
}

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setReady] = useState(false);

  // Función simplificada para obtener datos del usuario
  const fetchUserData = async (userId: string): Promise<UserData | null> => {
    try {
      console.log('🔍 [AUTH] Fetching user data for:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('uid', userId)
        .single();

      if (error) {
        console.error('❌ [AUTH] Error fetching user data:', error);
        return null;
      }

      console.log('✅ [AUTH] User data fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ [AUTH] Exception fetching user data:', error);
      return null;
    }
  };

  // Función simplificada para crear usuario básico
  const createBasicUser = async (user: User): Promise<UserData | null> => {
    try {
      console.log('🔍 [AUTH] Creating basic user for:', user.email);
      
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

  // Inicialización simplificada
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔍 [AUTH] Initializing auth...');
        
        // Obtener sesión actual
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ [AUTH] Error getting session:', error);
          setReady(true);
          return;
        }

        if (session?.user) {
          console.log('✅ [AUTH] Session found, user:', session.user.email);
          setUser(session.user);
          
          // Intentar obtener datos del usuario
          const userData = await fetchUserData(session.user.id);
          if (userData) {
            setUserData(userData);
          } else {
            // Si no hay datos, crear usuario básico
            const newUserData = await createBasicUser(session.user);
            if (newUserData) {
              setUserData(newUserData);
            }
          }
        } else {
          console.log('ℹ️ [AUTH] No session found');
        }
      } catch (error) {
        console.error('❌ [AUTH] Error in initialization:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          setReady(true);
          console.log('✅ [AUTH] Auth initialization complete');
        }
      }
    };

    initializeAuth();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔍 [AUTH] Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        setUser(session.user);
        
        // Intentar obtener datos del usuario
        const userData = await fetchUserData(session.user.id);
        if (userData) {
          setUserData(userData);
        } else {
          // Si no hay datos, crear usuario básico
          const newUserData = await createBasicUser(session.user);
          if (newUserData) {
            setUserData(newUserData);
          }
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      
      setLoading(false);
      setReady(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Función de login simplificada
  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔍 [AUTH] Signing in:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ [AUTH] Sign in error:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ [AUTH] Sign in successful');
      return { success: true };
    } catch (error) {
      console.error('❌ [AUTH] Sign in exception:', error);
      return { success: false, error: 'Error inesperado' };
    }
  };

  // Función de logout simplificada
  const signOut = async () => {
    try {
      console.log('🔍 [AUTH] Signing out');
      await supabase.auth.signOut();
      setUser(null);
      setUserData(null);
      console.log('✅ [AUTH] Sign out successful');
    } catch (error) {
      console.error('❌ [AUTH] Sign out error:', error);
    }
  };

  // Función de registro simplificada
  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      console.log('🔍 [AUTH] Signing up:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) {
        console.error('❌ [AUTH] Sign up error:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ [AUTH] Sign up successful');
      return { success: true };
    } catch (error) {
      console.error('❌ [AUTH] Sign up exception:', error);
      return { success: false, error: 'Error inesperado' };
    }
  };

  // Función para limpiar sesión
  const clearSession = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserData(null);
      console.log('✅ [AUTH] Session cleared');
    } catch (error) {
      console.error('❌ [AUTH] Error clearing session:', error);
    }
  };

  // Función para resetear estado de login
  const resetLoginState = () => {
    console.log('🔍 [AUTH] Resetting login state');
    setLoading(false);
    setReady(true);
  };

  // Función para verificar autorización de maestro
  const isMaestroAuthorized = (email: string): boolean => {
    const authorizedEmails = [
      'infocryptoforce@gmail.com',
      'coeurdeluke.js@gmail.com'
    ];
    return authorizedEmails.includes(email.toLowerCase().trim());
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    isReady,
    signIn,
    signOut,
    signUp,
    clearSession,
    resetLoginState,
    isMaestroAuthorized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
