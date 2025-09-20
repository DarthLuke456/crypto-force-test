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

// Provider offline que funciona sin Supabase
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setReady] = useState(false);

  // Emails autorizados
  const authorizedEmails = ['infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com'];

  // Función para crear datos de usuario básicos
  const createBasicUserData = (email: string): UserData => {
    const isAuthorized = authorizedEmails.includes(email.toLowerCase().trim());
    
    return {
      id: `offline-${Date.now()}`,
      email: email,
      nombre: '',
      apellido: '',
      nickname: email.split('@')[0] || 'Usuario',
      movil: '',
      exchange: '',
      user_level: isAuthorized ? 6 : 1, // Nivel 6 para usuarios autorizados
      referral_code: `OFFLINE-${Date.now().toString().slice(-8)}`,
      uid: `offline-${Date.now()}`,
      codigo_referido: null,
      referred_by: null,
      total_referrals: 0
    };
  };

  // Función para simular login
  const simulateLogin = (email: string) => {
    console.log('🔍 [OFFLINE-AUTH] Simulando login para:', email);
    
    const mockUser: User = {
      id: `offline-${Date.now()}`,
      email: email,
      created_at: new Date().toISOString(),
      aud: 'authenticated',
      role: 'authenticated',
      updated_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      identities: [],
      factors: []
    };

    const userData = createBasicUserData(email);
    
    setUser(mockUser);
    setUserData(userData);
    setLoading(false);
    setReady(true);
    
    // Guardar en localStorage para persistencia
    if (typeof window !== 'undefined') {
      localStorage.setItem('crypto-force-user', JSON.stringify(mockUser));
      localStorage.setItem('crypto-force-user-data', JSON.stringify(userData));
    }
    
    console.log('✅ [OFFLINE-AUTH] Login simulado exitoso:', {
      email: email,
      userLevel: userData.user_level,
      isAuthorized: authorizedEmails.includes(email.toLowerCase().trim())
    });
  };

  // Función para logout
  const logout = () => {
    console.log('🔍 [OFFLINE-AUTH] Logout');
    setUser(null);
    setUserData(null);
    setLoading(false);
    setReady(true);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('crypto-force-user');
      localStorage.removeItem('crypto-force-user-data');
    }
  };

  // Inicialización inmediata y robusta
  useEffect(() => {
    console.log('🔍 [OFFLINE-AUTH] Inicializando autenticación offline');
    
    const defaultEmail = 'coeurdeluke.js@gmail.com';
    const userData = createBasicUserData(defaultEmail);
    const mockUser: User = {
      id: `offline-${Date.now()}`,
      email: defaultEmail,
      created_at: new Date().toISOString(),
      aud: 'authenticated',
      role: 'authenticated',
      updated_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      identities: [],
      factors: []
    };
    
    console.log('✅ [OFFLINE-AUTH] Usuario simulado creado:', mockUser.email);
    console.log('✅ [OFFLINE-AUTH] Datos del usuario:', userData);
    
    setUser(mockUser);
    setUserData(userData);
    setLoading(false);
    setReady(true);
    
    // Guardar en localStorage si estamos en el cliente
    if (typeof window !== 'undefined') {
      localStorage.setItem('crypto-force-user', JSON.stringify(mockUser));
      localStorage.setItem('crypto-force-user-data', JSON.stringify(userData));
      console.log('✅ [OFFLINE-AUTH] Usuario guardado en localStorage');
    }
  }, []);

  // Exponer funciones de simulación para debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).simulateLogin = simulateLogin;
      (window as any).logout = logout;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

// Exportar el AuthProvider
export { AuthProvider };