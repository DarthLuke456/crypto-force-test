'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { authLog } from '@/lib/logger';

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
  const mountedRef = useRef(true);
  const initRef = useRef(false);

  authLog.info('AuthProvider initialized', { retryCount });

  // Función para crear datos de usuario básicos
  const createBasicUserData = useCallback((user: User): UserData => {
    authLog.debug('Creating basic user data', { userId: user.id, email: user.email });
    
    // Determinar nivel de usuario basado en email
    const email = user.email?.toLowerCase() || '';
    let userLevel = 1; // Nivel por defecto
    
    if (email === 'infocryptoforce@gmail.com' || email === 'coeurdeluke.js@gmail.com') {
      userLevel = 6; // Nivel maestro
    }
    
    return {
      id: user.id,
      email: user.email || '',
      nombre: '',
      apellido: '',
      nickname: user.email?.split('@')[0] || 'Usuario',
      movil: '',
      exchange: '',
      user_level: userLevel,
      referral_code: `BASIC-${user.id.slice(0, 8)}`,
      uid: user.id,
      codigo_referido: null,
      referred_by: null,
      total_referrals: 0
    };
  }, []);

  // Función para obtener datos del usuario desde Supabase (con fallback rápido)
  const fetchUserData = useCallback(async (userId: string): Promise<UserData | null> => {
    try {
      authLog.debug('Fetching user data from Supabase', { userId });
      
      // Crear una promesa con timeout muy corto (3 segundos)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Supabase query timeout after 3 seconds')), 3000);
      });
      
      // Intentar por UID primero
      const queryPromise = supabase
        .from('users')
        .select('*')
        .eq('uid', userId)
        .single();

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      if (error) {
        authLog.warn('Error fetching by UID, using basic data', { error: error.message, userId });
        return null; // Retornar null para usar datos básicos
      }

      authLog.info('User data fetched by UID', { userData: data });
      return data;
    } catch (error) {
      authLog.warn('Exception fetching user data, using basic data', { error: error instanceof Error ? error.message : 'Unknown error' });
      return null; // Retornar null para usar datos básicos
    }
  }, []);

  // Función para inicializar autenticación - SIMPLIFICADA
  const initializeAuth = useCallback(async () => {
    if (initRef.current) {
      authLog.debug('Auth already initialized, skipping');
      return;
    }

    initRef.current = true;
    
    try {
      authLog.info('Starting auth initialization', { retryCount });
      setLoading(true);
      setError(null);

      // Obtener sesión actual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (!mountedRef.current) return;
      
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

      // Crear datos básicos inmediatamente
      const basicUserData = createBasicUserData(session.user);
      setUserData(basicUserData);
      
      // Intentar obtener datos mejorados en background (sin bloquear)
      fetchUserData(session.user.id).then(userData => {
        if (!mountedRef.current) return;
        
        if (userData) {
          authLog.info('Enhanced user data loaded', { userLevel: userData.user_level });
          setUserData(userData);
        }
      }).catch(error => {
        authLog.warn('Background fetch failed, keeping basic data', { error: error.message });
      });

      setReady(true);
      setLoading(false);
      authLog.info('Auth initialization completed successfully');

    } catch (error) {
      if (!mountedRef.current) return;
      
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
    setLoading(true);
    setReady(false);
    initRef.current = false; // Reset initialization flag
    
    // Reiniciar el proceso de autenticación
    initializeAuth();
  }, [initializeAuth, retryCount]);

  // Efecto para inicializar autenticación - SOLO UNA VEZ
  useEffect(() => {
    if (initRef.current) {
      authLog.debug('Auth already initialized, skipping effect');
      return;
    }

    initializeAuth();
  }, []); // Empty dependency array - only run once

  // Listener para cambios de autenticación
  useEffect(() => {
    authLog.debug('Setting up auth state change listener');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      authLog.info('Auth state changed', { event, hasUser: !!session?.user, userEmail: session?.user?.email });

      if (event === 'SIGNED_IN' && session?.user) {
        authLog.info('User signed in', { userId: session.user.id, email: session.user.email });
        setUser(session.user);
        
        // Crear datos básicos inmediatamente
        const basicUserData = createBasicUserData(session.user);
        setUserData(basicUserData);
        
        // Intentar obtener datos mejorados en background
        fetchUserData(session.user.id).then(userData => {
          if (userData) {
            setUserData(userData);
          }
        }).catch(error => {
          authLog.warn('Background fetch failed, keeping basic data', { error: error.message });
        });
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

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
