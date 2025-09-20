'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { authLog, supabaseLog } from '@/lib/logger';

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
  error: string | null;
  retryAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isReady: false,
  error: null,
  retryAuth: () => {}
});

export const useAuth = () => useContext(AuthContext);
export const useSafeAuth = () => {
  const { user, userData, loading, isReady, error, retryAuth } = useAuth();
  return { user, userData, loading, isReady, error, retryAuth };
};

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  authLog.info('AuthProvider initialized', { retryCount });

  // Función para crear datos de usuario básicos
  const createBasicUserData = useCallback((user: User): UserData => {
    authLog.debug('Creating basic user data', { userId: user.id, email: user.email });
    
    return {
      id: user.id,
      email: user.email || '',
      nombre: '',
      apellido: '',
      nickname: user.email?.split('@')[0] || 'Usuario',
      movil: '',
      exchange: '',
      user_level: 1,
      referral_code: `BASIC-${user.id.slice(0, 8)}`,
      uid: user.id,
      codigo_referido: null,
      referred_by: null,
      total_referrals: 0
    };
  }, []);

  // Función para obtener datos del usuario desde Supabase
  const fetchUserData = useCallback(async (userId: string): Promise<UserData | null> => {
    try {
      authLog.debug('Fetching user data from Supabase', { userId });
      
      // Intentar por UID primero
      let { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('uid', userId)
        .single();

      if (error) {
        supabaseLog.warn('Error fetching by UID, trying by email', { error: error.message, userId });
        
        // Fallback: buscar por email
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user?.email) {
          const { data: emailData, error: emailError } = await supabase
            .from('users')
            .select('*')
            .eq('email', sessionData.session.user.email)
            .single();
          
          if (emailError) {
            supabaseLog.error('Error fetching by email', { error: emailError.message, email: sessionData.session.user.email });
            return null;
          }
          
          authLog.info('User data fetched by email', { userData: emailData });
          return emailData;
        }
        
        return null;
      }

      authLog.info('User data fetched by UID', { userData: data });
      return data;
    } catch (error) {
      authLog.error('Exception fetching user data', { error: error instanceof Error ? error.message : 'Unknown error' });
      return null;
    }
  }, []);

  // Función para inicializar autenticación
  const initializeAuth = useCallback(async () => {
    try {
      authLog.info('Starting auth initialization', { retryCount });
      setLoading(true);
      setError(null);

      // Obtener sesión actual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        authLog.error('Error getting session', { error: sessionError.message });
        setError(`Error de sesión: ${sessionError.message}`);
        setReady(true);
        setLoading(false);
        return;
      }

      if (!session?.user) {
        authLog.info('No active session found');
        setUser(null);
        setUserData(null);
        setReady(true);
        setLoading(false);
        return;
      }

      authLog.info('Active session found', { 
        userId: session.user.id, 
        email: session.user.email,
        emailConfirmed: session.user.email_confirmed_at ? 'Yes' : 'No'
      });

      setUser(session.user);

      // Intentar obtener datos del usuario
      const userData = await fetchUserData(session.user.id);
      
      if (userData) {
        authLog.info('User data loaded successfully', { userLevel: userData.user_level });
        setUserData(userData);
      } else {
        authLog.warn('No user data found, creating basic data');
        const basicUserData = createBasicUserData(session.user);
        setUserData(basicUserData);
      }

      setReady(true);
      setLoading(false);
      authLog.info('Auth initialization completed successfully');

    } catch (error) {
      authLog.error('Exception in auth initialization', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      setError(`Error de inicialización: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setReady(true);
      setLoading(false);
    }
  }, [fetchUserData, createBasicUserData, retryCount]);

  // Función para reintentar autenticación
  const retryAuth = useCallback(() => {
    authLog.info('Retrying authentication', { currentRetryCount: retryCount });
    setRetryCount(prev => prev + 1);
    setError(null);
    initializeAuth();
  }, [initializeAuth, retryCount]);

  // Efecto para inicializar autenticación
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Listener para cambios de autenticación
  useEffect(() => {
    authLog.debug('Setting up auth state change listener');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      authLog.info('Auth state changed', { event, hasUser: !!session?.user, userEmail: session?.user?.email });

      if (event === 'SIGNED_IN' && session?.user) {
        authLog.info('User signed in', { userId: session.user.id, email: session.user.email });
        setUser(session.user);
        
        const userData = await fetchUserData(session.user.id);
        if (userData) {
          setUserData(userData);
        } else {
          const basicUserData = createBasicUserData(session.user);
          setUserData(basicUserData);
        }
      } else if (event === 'SIGNED_OUT') {
        authLog.info('User signed out');
        setUser(null);
        setUserData(null);
      }
      
      setReady(true);
      setLoading(false);
    });

    return () => {
      authLog.debug('Cleaning up auth state change listener');
      subscription.unsubscribe();
    };
  }, [fetchUserData, createBasicUserData]);

  const value: AuthContextType = {
    user,
    userData,
    loading,
    isReady,
    error,
    retryAuth
  };

  authLog.debug('AuthProvider render', { 
    hasUser: !!user, 
    hasUserData: !!userData, 
    loading, 
    isReady, 
    hasError: !!error 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
