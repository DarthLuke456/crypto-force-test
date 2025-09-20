'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

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

// Provider - VERSIÓN OFFLINE QUE FUNCIONA SIN SUPABASE
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

  // Función para reintentar autenticación
  const retryAuth = () => {
    setError(null);
    setLoading(true);
    setReady(false);
    setUser(null);
    setUserData(null);
    
    // Simular carga
    setTimeout(() => {
      setLoading(false);
      setReady(true);
    }, 1000);
  };

  // Función de inicialización OFFLINE
  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular verificación de sesión (sin Supabase)
      const storedUser = localStorage.getItem('crypto-force-user');
      
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setUser(user);
          
          const basicUserData = createBasicUserData(user);
          setUserData(basicUserData);
          
          console.log('✅ Usuario cargado desde localStorage:', user.email);
        } catch (e) {
          console.log('⚠️ Error parseando usuario almacenado');
          localStorage.removeItem('crypto-force-user');
        }
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

  // Función para simular login (para testing)
  const simulateLogin = (email: string) => {
    const mockUser: User = {
      id: 'mock-user-id',
      email: email,
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      aud: 'authenticated',
      app_metadata: {},
      user_metadata: {},
      role: 'authenticated'
    };

    setUser(mockUser);
    const basicUserData = createBasicUserData(mockUser);
    setUserData(basicUserData);
    
    // Guardar en localStorage
    localStorage.setItem('crypto-force-user', JSON.stringify(mockUser));
    
    console.log('✅ Login simulado para:', email);
  };

  // Exponer función de login simulado para testing
  (window as any).simulateLogin = simulateLogin;

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
