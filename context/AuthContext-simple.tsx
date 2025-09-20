'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';

// Tipos
interface UserData {
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

// Contexto
const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isReady: false,
});

// Hook
export const useAuth = () => useContext(AuthContext);

// Hook simplificado
export const useSafeAuth = () => {
  console.log('🔍 [SIMPLE-AUTH] useSafeAuth llamado');
  const { user, userData, loading, isReady } = useAuth();
  console.log('🔍 [SIMPLE-AUTH] useSafeAuth retornando:', { user, userData, loading, isReady });
  return { user, userData, loading, isReady };
};

// Provider simple
function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log('🔍 [SIMPLE-AUTH] AuthProvider renderizando');
  console.log('🔍 [SIMPLE-AUTH] AuthProvider renderizando - TIMESTAMP:', new Date().toISOString());
  
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setReady] = useState(false);
  
  console.log('🔍 [SIMPLE-AUTH] AuthProvider estado inicial:', { user, userData, loading, isReady });

  // Función para crear datos de usuario básicos
  const createBasicUserData = (email: string): UserData => {
    const timestamp = Date.now();
    return {
      id: `simple-${timestamp}`,
      email: email,
      nombre: '',
      apellido: '',
      nickname: email.split('@')[0],
      movil: '',
      exchange: '',
      user_level: email === 'coeurdeluke.js@gmail.com' ? 6 : 1,
      referral_code: `SIMPLE-${timestamp.toString().slice(-8)}`,
      uid: `simple-${timestamp}`,
      codigo_referido: null,
      referred_by: null,
      total_referrals: 0
    };
  };

  // Inicialización inmediata
  useEffect(() => {
    console.log('🔍 [SIMPLE-AUTH] useEffect ejecutado');
    console.log('🔍 [SIMPLE-AUTH] Inicializando autenticación simple');
    
    const defaultEmail = 'coeurdeluke.js@gmail.com';
    const userData = createBasicUserData(defaultEmail);
    const mockUser: User = {
      id: `simple-${Date.now()}`,
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
    
    console.log('✅ [SIMPLE-AUTH] Usuario simulado creado:', mockUser.email);
    console.log('✅ [SIMPLE-AUTH] Datos del usuario:', userData);
    
    setUser(mockUser);
    setUserData(userData);
    setLoading(false);
    setReady(true);
    
    console.log('✅ [SIMPLE-AUTH] Inicialización completada');
  }, []);

  console.log('🔍 [SIMPLE-AUTH] AuthProvider renderizando con estado final:', { 
    hasUser: !!user, 
    hasUserData: !!userData, 
    loading, 
    isReady 
  });

  return (
    <AuthContext.Provider value={{ user, userData, loading, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

// Exportar
export { AuthProvider };