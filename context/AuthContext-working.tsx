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

// Provider - VERSIÓN ORIGINAL QUE FUNCIONABA
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Función para obtener datos del usuario desde Supabase
  const fetchUserData = async (userId: string): Promise<UserData | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('uid', userId)
        .single();

      if (error) {
        console.warn('Error fetching user data:', error.message);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Exception fetching user data:', error);
      return null;
    }
  };

  // Función para reintentar autenticación
  const retryAuth = () => {
    setError(null);
    setLoading(true);
    setReady(false);
    setUser(null);
    setUserData(null);
    
    // Re-inicializar
    initializeAuth();
  };

  // Función de inicialización
  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener sesión actual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        setError(`Error de sesión: ${sessionError.message}`);
        setReady(true);
        setLoading(false);
        return;
      }

      if (!session?.user) {
        setUser(null);
        setUserData(null);
        setReady(true);
        setLoading(false);
        return;
      }

      setUser(session.user);

      // Intentar obtener datos del usuario
      const userData = await fetchUserData(session.user.id);
      
      if (userData) {
        setUserData(userData);
      } else {
        // Usar datos básicos si no se pueden obtener de la base de datos
        const basicUserData = createBasicUserData(session.user);
        setUserData(basicUserData);
      }

      setReady(true);
      setLoading(false);

    } catch (error) {
      setError(`Error de inicialización: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setReady(true);
      setLoading(false);
    }
  };

  // Efecto para inicializar autenticación
  useEffect(() => {
    initializeAuth();
  }, []);

  // Listener para cambios de autenticación - SIMPLIFICADO
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        
        const userData = await fetchUserData(session.user.id);
        if (userData) {
          setUserData(userData);
        } else {
          const basicUserData = createBasicUserData(session.user);
          setUserData(basicUserData);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserData(null);
      }
      
      setReady(true);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
