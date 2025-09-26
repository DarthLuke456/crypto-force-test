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
  avatar: string;
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSafeAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Función para crear datos básicos del usuario
  const createBasicUserData = async (user: User): Promise<UserData> => {
    // Determinar el referidor por defecto
    const authorizedEmails = ['coeurdeluke.js@gmail.com', 'coeurdeluke@gmail.com'];
    const isAuthorized = authorizedEmails.includes(user.email || '');
    
    let referredBy = null;
    if (!isAuthorized) {
      // Para usuarios no autorizados, asignar infocryptoforce@gmail.com como referidor
      referredBy = 'infocryptoforce@gmail.com';
    }

    return {
      id: user.id,
      email: user.email || '',
      nombre: '',
      apellido: '',
      nickname: user.user_metadata?.nickname || user.email?.split('@')[0] || 'USER',
      movil: '',
      exchange: '',
      avatar: '/images/default-avatar.png',
      user_level: isAuthorized ? 0 : 1, // 0 para fundadores, 1 para otros
      referral_code: `CRYPTOFORCE_${(user.user_metadata?.nickname || user.email?.split('@')[0] || 'USER').toUpperCase().replace(/\s+/g, '_')}`,
      uid: user.id,
      codigo_referido: null,
      referred_by: referredBy,
      total_referrals: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      birthdate: '',
      country: '',
      bio: ''
    };
  };

  // Función para obtener datos del usuario desde Supabase (SIMPLIFICADA)
  const fetchUserData = async (userId: string) => {
    try {
      console.log('🔍 AuthContext: Fetching user data for userId:', userId);
      
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ AuthContext: Session error:', sessionError);
        return null;
      }
      
      if (!session?.user) {
        console.warn('⚠️ AuthContext: No active session for fetchUserData');
        return null;
      }

      console.log('🔍 AuthContext: Session found, querying database...');

      // Try with email first (more reliable)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (error) {
        console.log('🔄 AuthContext: Email query failed, trying with UID:', userId);
        const { data: uidData, error: uidError } = await supabase
          .from('users')
          .select('*')
          .eq('uid', userId)
          .single();
        
        if (uidError) {
          console.error('❌ AuthContext: Error fetching user data:', uidError);
          return null;
        }
        
        console.log('✅ AuthContext: User data fetched successfully (UID):', uidData);
        return uidData;
      }

      console.log('✅ AuthContext: User data fetched successfully (email):', data);
      return data;
    } catch (error) {
      console.error('❌ AuthContext: Exception in fetchUserData:', error);
      return null;
    }
  };

  // Función para refrescar datos del usuario
  const refreshUserData = async () => {
    if (!user) {
      console.log('⚠️ AuthContext: No user available for refresh');
      return;
    }
    
    try {
      console.log('🔄 AuthContext: Refrescando datos del usuario...', user.id);
      const userData = await fetchUserData(user.id);
      
      if (userData) {
        console.log('🔍 AuthContext: Fresh userData from database:', userData);
        setUserData(userData);
        console.log('✅ AuthContext: Datos del usuario refrescados y estado actualizado');
      } else {
        console.warn('⚠️ AuthContext: No se pudieron refrescar los datos del usuario');
      }
    } catch (error) {
      console.error('❌ AuthContext: Error refrescando datos del usuario:', error);
    }
  };

  // Inicialización SIMPLIFICADA
  useEffect(() => {
    let isMounted = true;
    let authStateChangeSubscription: any = null;
    
    const initializeAuth = async () => {
      if (isInitializing) {
        console.log('🔄 AuthContext: Already initializing, skipping...');
        return;
      }
      
      try {
        setIsInitializing(true);
        console.log('🔄 AuthContext: Initializing authentication...');
        
        // Obtener sesión actual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.warn('⚠️ AuthContext: Session error:', sessionError);
        }
        
        if (session?.user && isMounted) {
          console.log('✅ AuthContext: Session found, user:', session.user.email);
          setUser(session.user);
          
          // Intentar obtener datos del usuario desde la base de datos
          const userData = await fetchUserData(session.user.id);
          
          if (userData && isMounted) {
            console.log('✅ AuthContext: User data loaded from database');
            setUserData(userData);
          } else if (isMounted) {
            console.log('⚠️ AuthContext: No user data found, creating basic data');
            const basicUserData = await createBasicUserData(session.user);
            setUserData(basicUserData);
          }
        } else if (isMounted) {
          console.log('⚠️ AuthContext: No session found');
        }
      } catch (error) {
        console.error('❌ AuthContext: Error initializing auth:', error);
      } finally {
        if (isMounted) {
          console.log('✅ AuthContext: Initialization complete, setting ready state');
          setLoading(false);
          setReady(true);
          setIsInitializing(false);
        }
      }
    };

    // Configurar listener de auth state changes DESPUÉS de la inicialización
    const setupAuthListener = () => {
      if (authStateChangeSubscription) {
        authStateChangeSubscription.unsubscribe();
      }
      
      authStateChangeSubscription = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔄 AuthContext: Auth state change:', event);
          
          if (isMounted) {
            if (event === 'SIGNED_IN' && session?.user) {
              console.log('✅ AuthContext: User signed in:', session.user.email);
              setUser(session.user);
              
              // Solo obtener datos si no los tenemos
              if (!userData) {
                try {
                  const userData = await fetchUserData(session.user.id);
                  if (userData && isMounted) {
                    setUserData(userData);
                  } else if (isMounted) {
                    const basicUserData = await createBasicUserData(session.user);
                    setUserData(basicUserData);
                  }
                } catch (error) {
                  console.warn('⚠️ AuthContext: Error in auth state change:', error);
                }
              }
            } else if (event === 'SIGNED_OUT') {
              console.log('🚪 AuthContext: User signed out');
              setUser(null);
              setUserData(null);
            }
            
            setLoading(false);
            setReady(true);
          }
        }
      );
    };

    // Inicializar
    initializeAuth().then(() => {
      if (isMounted) {
        setupAuthListener();
      }
    });

    return () => {
      isMounted = false;
      if (authStateChangeSubscription) {
        authStateChangeSubscription.unsubscribe();
      }
    };
  }, []); // Solo ejecutar una vez

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      loading,
      isReady,
      refreshUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};
