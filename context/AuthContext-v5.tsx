'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
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

// Provider - VERSIÓN ULTRA SIMPLIFICADA
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);

  authLog.info('AuthProvider-v5 initialized');

  // Función para crear datos de usuario básicos
  const createBasicUserData = (user: User): UserData => {
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
  };

  // Función para reintentar autenticación
  const retryAuth = () => {
    authLog.info('Retrying authentication');
    setError(null);
    setLoading(true);
    setReady(false);
    initialized.current = false;
    
    // Reiniciar completamente
    setUser(null);
    setUserData(null);
    
    // Re-inicializar después de un breve delay
    setTimeout(() => {
      initializeAuth();
    }, 100);
  };

  // Función de inicialización ULTRA SIMPLIFICADA
  const initializeAuth = async () => {
    if (initialized.current) {
      authLog.debug('Auth already initialized, skipping');
      return;
    }

    initialized.current = true;
    
    try {
      authLog.info('Starting simplified auth initialization');
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
        email: session.user.email
      });

      // Establecer usuario y datos básicos INMEDIATAMENTE
      setUser(session.user);
      const basicUserData = createBasicUserData(session.user);
      setUserData(basicUserData);

      // Marcar como listo INMEDIATAMENTE
      setReady(true);
      setLoading(false);
      
      authLog.info('Auth initialization completed successfully', {
        userLevel: basicUserData.user_level,
        email: basicUserData.email
      });

    } catch (error) {
      authLog.error('Exception in auth initialization', { 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      setError(`Error de inicialización: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setReady(true);
      setLoading(false);
    }
  };

  // Efecto para inicializar UNA SOLA VEZ
  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initializeAuth();
  }, []); // Solo se ejecuta una vez

  // Listener de cambios de autenticación SIMPLIFICADO
  useEffect(() => {
    authLog.debug('Setting up simplified auth state change listener');

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      authLog.info('Auth state changed', { event, hasUser: !!session?.user });

      if (event === 'SIGNED_IN' && session?.user) {
        authLog.info('User signed in', { userId: session.user.id, email: session.user.email });
        setUser(session.user);
        
        const basicUserData = createBasicUserData(session.user);
        setUserData(basicUserData);
        
        setReady(true);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        authLog.info('User signed out');
        setUser(null);
        setUserData(null);
        setReady(true);
        setLoading(false);
      }
    });

    return () => {
      authLog.debug('Cleaning up auth state change listener');
      subscription.unsubscribe();
    };
  }, []); // Solo se ejecuta una vez

  const value: AuthContextType = {
    user,
    userData,
    loading,
    isReady,
    error,
    retryAuth
  };

  authLog.debug('AuthProvider-v5 render', { 
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
