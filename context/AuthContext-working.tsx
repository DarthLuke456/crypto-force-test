'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

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
  created_at: string;
  updated_at: string;
  birthdate: string;
  country: string;
  bio: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isReady: boolean;
  refreshUserData: () => Promise<void>;
}

// Contexto
const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isReady: false,
  refreshUserData: async () => {},
});

// Hook
export const useAuth = () => useContext(AuthContext);

// Hook simplificado
export const useSafeAuth = () => {
  const { user, userData, loading, isReady, refreshUserData } = useAuth();
  return { user, userData, loading, isReady, refreshUserData };
};

// Provider que funciona con Supabase real
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setReady] = useState(false);

  // Función para crear datos de usuario básicos
  const createBasicUserData = (user: User): UserData => {
    return {
      id: user.id,
      email: user.email || '',
      nombre: '',
      apellido: '',
      nickname: user.email?.split('@')[0] || 'Usuario',
      movil: '',
      exchange: '',
      user_level: user.email === 'coeurdeluke.js@gmail.com' ? 0 : 1,
      referral_code: `CRYPTOFORCE_${user.email?.split('@')[0].toUpperCase().replace(/\s+/g, '_') || 'USER'}`,
      uid: user.id,
      codigo_referido: null,
      referred_by: null,
      total_referrals: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      birthdate: '',
      country: '',
      bio: ''
    };
  };

  // Función para obtener datos del usuario desde Supabase
  const fetchUserData = async (userId: string) => {
    try {
      // Intentar obtener datos con timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      );
      
      const fetchPromise = supabase
        .from('users')
        .select('*')
        .eq('uid', userId)
        .single();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error) {
        console.warn('Error fetching user data:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Error in fetchUserData:', error);
      return null;
    }
  };

  // Función para refrescar datos del usuario
  const refreshUserData = async () => {
    if (!user) return;
    
    try {
      console.log('🔄 AuthContext: Refrescando datos del usuario...');
      const userData = await fetchUserData(user.id);
      
      if (userData) {
        setUserData(userData);
        console.log('✅ AuthContext: Datos del usuario refrescados');
      } else {
        console.warn('⚠️ AuthContext: No se pudieron refrescar los datos del usuario');
      }
    } catch (error) {
      console.error('❌ AuthContext: Error refrescando datos del usuario:', error);
    }
  };

  // Inicialización con Supabase
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Obtener sesión actual con timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 5000)
        );
        
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (session?.user) {
          setUser(session.user);
          
          // Guardar email en localStorage para fallback
          if (session.user.email) {
            localStorage.setItem('crypto-force-user-email', session.user.email);
          }
          
          // Intentar obtener datos del usuario desde la base de datos
          const userData = await fetchUserData(session.user.id);
          
          if (userData) {
            setUserData(userData);
          } else {
            // Si no hay datos en la base de datos, crear datos básicos
            console.log('⚠️ AuthContext: No user data found in database, creating basic user data');
            const basicUserData = createBasicUserData(session.user);
            setUserData(basicUserData);
            
            // Intentar crear el usuario en la base de datos
            try {
              const { error: createError } = await supabase
                .from('users')
                .insert({
                  email: session.user.email,
                  uid: session.user.id,
                  nickname: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario',
                  user_level: basicUserData.user_level,
                  referral_code: basicUserData.referral_code,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                });
              
              if (createError) {
                console.warn('⚠️ AuthContext: Error creating user in database:', createError);
              } else {
                console.log('✅ AuthContext: User created in database successfully');
              }
            } catch (error) {
              console.warn('⚠️ AuthContext: Error creating user in database:', error);
            }
          }
        } else {
          // Si no hay sesión, crear datos básicos para usuarios autorizados
          const authorizedEmails = ['coeurdeluke.js@gmail.com', 'coeurdeluke@gmail.com', 'infocryptoforce@gmail.com'];
          const storedEmail = localStorage.getItem('crypto-force-user-email');
          
          if (storedEmail && authorizedEmails.includes(storedEmail)) {
            const mockUser: User = {
              id: `fallback-${Date.now()}`,
              email: storedEmail,
              created_at: new Date().toISOString(),
              aud: 'authenticated',
              role: 'authenticated',
              updated_at: new Date().toISOString(),
              app_metadata: {},
              user_metadata: {},
              identities: [],
              factors: []
            };
            
            setUser(mockUser);
            const basicUserData = createBasicUserData(mockUser);
            setUserData(basicUserData);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        
        // Fallback para usuarios autorizados
        const authorizedEmails = ['coeurdeluke.js@gmail.com', 'coeurdeluke@gmail.com', 'infocryptoforce@gmail.com'];
        const storedEmail = localStorage.getItem('crypto-force-user-email');
        
        if (storedEmail && authorizedEmails.includes(storedEmail)) {
          const mockUser: User = {
            id: `fallback-${Date.now()}`,
            email: storedEmail,
            created_at: new Date().toISOString(),
            aud: 'authenticated',
            role: 'authenticated',
            updated_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: {},
            identities: [],
            factors: []
          };
          
          setUser(mockUser);
          const basicUserData = createBasicUserData(mockUser);
          setUserData(basicUserData);
        }
      } finally {
        setLoading(false);
        setReady(true);
      }
    };

    initializeAuth();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          
          // Guardar email en localStorage para fallback
          if (session.user.email) {
            localStorage.setItem('crypto-force-user-email', session.user.email);
          }
          
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
          localStorage.removeItem('crypto-force-user-email');
        }
        
        setLoading(false);
        setReady(true);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, isReady, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

// Exportar
export { AuthProvider };