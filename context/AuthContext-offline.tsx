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
  created_at?: string;
  updated_at?: string;
  avatar?: string;
  birthdate?: string;
  country?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isReady: boolean;
  login: (email: string) => void;
  logout: () => void;
  updateInvitationCode: (newNickname: string) => void;
  syncUserData: () => Promise<void>;
}

// Contexto
const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isReady: false,
  login: () => {},
  logout: () => {},
  updateInvitationCode: () => {},
  syncUserData: async () => {},
});

// Hook
export const useAuth = () => useContext(AuthContext);

// Hook simplificado
export const useSafeAuth = () => {
  const { user, userData, loading, isReady, login, logout, updateInvitationCode, syncUserData } = useAuth();
  return { user, userData, loading, isReady, login, logout, updateInvitationCode, syncUserData };
};

// Provider completamente offline
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setReady] = useState(false);

  // Función de login
  const login = (email: string) => {
    const authorizedEmails = ['coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com'];
    
    if (authorizedEmails.includes(email)) {
      console.log('✅ AuthContext: Login exitoso para:', email);
      
      const mockUser = createMockUser(email);
      const userData = createUserData(email);
      
      setUser(mockUser);
      setUserData(userData);
      
      // Guardar en localStorage
      localStorage.setItem('crypto-force-user-email', email);
      localStorage.removeItem('crypto-force-logged-out');
      
      console.log('✅ AuthContext: Usuario autenticado:', userData);
    } else {
      console.log('❌ AuthContext: Email no autorizado:', email);
    }
  };

  // Función de logout
  const logout = () => {
    console.log('🚪 AuthContext: Logout ejecutado');
    
    setUser(null);
    setUserData(null);
    
    // Preservar el avatar antes de limpiar localStorage
    const savedAvatar = localStorage.getItem('user-avatar');
    console.log('🔍 AuthContext: Avatar preservado:', savedAvatar?.substring(0, 50) + '...');
    
    // Limpiar localStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Restaurar el avatar después de limpiar
    if (savedAvatar) {
      localStorage.setItem('user-avatar', savedAvatar);
      console.log('✅ AuthContext: Avatar restaurado después del logout');
    }
    
    // Establecer flag de logout
    localStorage.setItem('crypto-force-logged-out', 'true');
    
    console.log('🚪 AuthContext: Usuario deslogueado, avatar preservado');
  };

  // Función para actualizar el código de invitación cuando cambia el nickname
  const updateInvitationCode = (newNickname: string) => {
    if (userData) {
      const updatedUserData = {
        ...userData,
        nickname: newNickname,
        referral_code: `CRYPTOFORCE${newNickname.toUpperCase()}`
      };
      setUserData(updatedUserData);
      console.log('🔄 AuthContext: Código de invitación actualizado:', updatedUserData.referral_code);
    }
  };

  // Función para sincronizar datos del usuario con la base de datos
  const syncUserData = async () => {
    if (!userData?.email) {
      console.log('🔍 AuthContext: No hay userData para sincronizar');
      return;
    }
    
    try {
      console.log('🔄 AuthContext: Sincronizando datos del usuario con la BD');
      console.log('🔄 AuthContext: Email del usuario:', userData.email);
      
      const response = await fetch('/api/profile/get-offline', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userData.email })
      });
      
      console.log('🔄 AuthContext: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔄 AuthContext: Response data:', data);
        
        if (data.success && data.profile) {
          const updatedUserData = { ...userData, ...data.profile };
          console.log('🔄 AuthContext: Datos actualizados desde BD:', updatedUserData);
          
          setUserData(updatedUserData);
          localStorage.setItem('crypto-force-user-data', JSON.stringify(updatedUserData));
          console.log('✅ AuthContext: Datos sincronizados con la BD y localStorage');
        } else {
          console.log('⚠️ AuthContext: Response no exitosa:', data);
        }
      } else {
        console.error('❌ AuthContext: Error en response:', response.status);
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ AuthContext: Error data:', errorData);
      }
    } catch (error) {
      console.error('❌ AuthContext: Error sincronizando datos:', error);
    }
  };

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
      user_level: isFounder ? 0 : 1, // Level 0 for founders (Fundador)
      referral_code: `CRYPTOFORCE${email.split('@')[0].toUpperCase()}`,
      uid: `uid-${Date.now()}`,
      codigo_referido: null,
      referred_by: null,
      total_referrals: 0,
      avatar: '/images/default-avatar.png',
      birthdate: '',
      country: '',
      bio: ''
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
        // Verificar si el usuario se ha deslogueado
        const isLoggedOut = localStorage.getItem('crypto-force-logged-out');
        if (isLoggedOut === 'true') {
          console.log('🚪 AuthContext: Usuario deslogueado, no creando sesión');
          setUser(null);
          setUserData(null);
          setLoading(false);
          setReady(true);
          return;
        }

        // Verificar si hay email guardado
        const storedEmail = localStorage.getItem('crypto-force-user-email');
        const authorizedEmails = ['coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com'];
        
        if (storedEmail && authorizedEmails.includes(storedEmail)) {
          console.log('✅ AuthContext: Usando email guardado:', storedEmail);
          
          const mockUser = createMockUser(storedEmail);
          const userData = createUserData(storedEmail);
          
          setUser(mockUser);
          setUserData(userData);
          
          // Sincronizar con la base de datos después de cargar desde localStorage
          console.log('🔄 AuthContext: Sincronizando con BD después de carga inicial');
          fetch('/api/profile/get-offline', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: storedEmail })
          })
          .then(response => response.json())
          .then(data => {
            if (data.success && data.profile) {
              const updatedUserData = { ...userData, ...data.profile };
              setUserData(updatedUserData);
              localStorage.setItem('crypto-force-user-data', JSON.stringify(updatedUserData));
              console.log('✅ AuthContext: Datos sincronizados con BD en carga inicial');
            }
          })
          .catch(syncError => {
            console.error('❌ AuthContext: Error en sincronización inicial:', syncError);
          });
          
          console.log('✅ AuthContext: Usuario autenticado offline:', userData);
        } else {
          console.log('⚠️ AuthContext: No hay email guardado, usuario no autenticado');
          
          // NO crear usuario por defecto - dejar sin autenticar
          setUser(null);
          setUserData(null);
          
          console.log('🚫 AuthContext: Usuario no autenticado');
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
    <AuthContext.Provider value={{ user, userData, loading, isReady, login, logout, updateInvitationCode, syncUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

// Exportar
export { AuthProvider };