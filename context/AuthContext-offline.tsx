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
  const { user, userData, loading, isReady } = useAuth();
  return { user, userData, loading, isReady };
};

// Provider completamente offline
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setReady] = useState(false);

  // Función para crear datos de usuario
  const createUserData = (email: string): UserData => {
    const isFounder = email === 'coeurdeluke.js@gmail.com' || email === 'infocryptoforce@gmail.com';
    
    return {
      id: `user-${Date.now()}`,
      email: email,
      nombre: 'Usuario',
      apellido: 'Crypto Force',
      nickname: email.split('@')[0],
      movil: '',
      exchange: '',
      user_level: isFounder ? 6 : 1,
      referral_code: `USER-${email.split('@')[0].toUpperCase()}`,
      uid: `uid-${Date.now()}`,
      codigo_referido: null,
      referred_by: null,
      total_referrals: 0
    };
  };

  // Función para crear usuario mock
  const createMockUser = (email: string): User => {
    return {
      id: `user-${Date.now()}`,
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
  };

  // Inicialización offline
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Verificar si hay email guardado
        const storedEmail = localStorage.getItem('crypto-force-user-email');
        const authorizedEmails = ['coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com'];
        
        if (storedEmail && authorizedEmails.includes(storedEmail)) {
          console.log('✅ AuthContext: Usando email guardado:', storedEmail);
          
          const mockUser = createMockUser(storedEmail);
          const userData = createUserData(storedEmail);
          
          setUser(mockUser);
          setUserData(userData);
          
          console.log('✅ AuthContext: Usuario autenticado offline:', userData);
        } else {
          console.log('⚠️ AuthContext: No hay email guardado, creando usuario por defecto');
          
          // Crear usuario por defecto para coeurdeluke.js@gmail.com
          const defaultEmail = 'coeurdeluke.js@gmail.com';
          const mockUser = createMockUser(defaultEmail);
          const userData = createUserData(defaultEmail);
          
          setUser(mockUser);
          setUserData(userData);
          
          // Guardar en localStorage
          localStorage.setItem('crypto-force-user-email', defaultEmail);
          
          console.log('✅ AuthContext: Usuario por defecto creado:', userData);
        }
      } catch (error) {
        console.error('❌ AuthContext: Error inicializando:', error);
      } finally {
        setLoading(false);
        setReady(true);
        console.log('✅ AuthContext: Inicialización completada');
      }
    };

    // Simular un pequeño delay para que parezca real
    setTimeout(initializeAuth, 100);
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

// Exportar
export { AuthProvider };