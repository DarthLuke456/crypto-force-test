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
  const createBasicUserData = async (user: User): Promise<UserData> => {
    // Check if user should be referred by infocryptoforce@gmail.com
    let referredBy = null;
    const isFounder = user.email === 'coeurdeluke.js@gmail.com' || user.email === 'coeurdeluke@gmail.com' || user.email === 'infocryptoforce@gmail.com';
    
    if (!isFounder) {
      // For non-founders, assign to infocryptoforce@gmail.com as default referrer
      try {
        const { data: francData, error: francError } = await supabase
          .from('users')
          .select('id, email')
          .eq('email', 'infocryptoforce@gmail.com')
          .single();
        
        if (francData && !francError) {
          referredBy = francData.id;
          console.log('✅ New user assigned to infocryptoforce@gmail.com as default referrer');
        } else {
          console.warn('⚠️ infocryptoforce@gmail.com not found in database, user will have no referrer');
        }
      } catch (error) {
        console.warn('⚠️ Error finding default referrer:', error);
      }
    }

    return {
      id: user.id,
      email: user.email || '',
      nombre: '',
      apellido: '',
      nickname: user.email?.split('@')[0] || 'Usuario',
      movil: '',
      exchange: '',
      avatar: '/images/default-avatar.png',
      user_level: user.email === 'coeurdeluke.js@gmail.com' ? 0 : 1,
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

  // Función para obtener datos del usuario desde Supabase
  const fetchUserData = async (userId: string) => {
    try {
      console.log('🔍 AuthContext: Fetching user data for userId:', userId);
      
      // Get current session first
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        console.warn('⚠️ AuthContext: No active session for fetchUserData');
        return null;
      }

      // Try with email first (more reliable)
      let { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.session.user.email)
        .single();

      // If email query fails, try with uid as fallback
      if (error) {
        console.log('🔄 AuthContext: Email query failed, trying with UID:', userId);
        const uidResult = await supabase
          .from('users')
          .select('*')
          .eq('uid', userId)
          .single();
        
        data = uidResult.data;
        error = uidResult.error;
      }

      if (error) {
        console.error('❌ AuthContext: Error fetching user data:', error);
        console.error('❌ AuthContext: Error details:', JSON.stringify(error, null, 2));
        return null;
      }

      console.log('✅ AuthContext: User data fetched successfully:', data);
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

  // Inicialización con Supabase - SIMPLIFICADA
  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('🔄 AuthContext: Initializing authentication...');
        
        // Obtener sesión actual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.warn('⚠️ AuthContext: Session error:', sessionError);
        }
        
        if (session?.user && isMounted) {
          console.log('✅ AuthContext: Session found, user:', session.user.email);
          setUser(session.user);
          
          // Guardar email en localStorage para fallback
          if (session.user.email) {
            localStorage.setItem('crypto-force-user-email', session.user.email);
          }
          
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
          console.log('⚠️ AuthContext: No session found, checking for stored email...');
          // Si no hay sesión, crear datos básicos para usuarios autorizados
          const authorizedEmails = ['coeurdeluke.js@gmail.com', 'coeurdeluke@gmail.com', 'infocryptoforce@gmail.com'];
          const storedEmail = localStorage.getItem('crypto-force-user-email');
          
          if (storedEmail && authorizedEmails.includes(storedEmail)) {
            console.log('✅ AuthContext: Using stored email for fallback:', storedEmail);
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
            
            // Try to fetch real data from database
            const realUserData = await supabase
              .from('users')
              .select('*')
              .eq('email', storedEmail)
              .single();
            
            if (realUserData.data && isMounted) {
              console.log('✅ AuthContext: Found real user data in database');
              setUserData(realUserData.data);
            } else if (isMounted) {
              console.log('⚠️ AuthContext: No real data found, using fallback');
              const basicUserData = await createBasicUserData(mockUser);
              setUserData(basicUserData);
            }
          }
        }
      } catch (error) {
        console.error('❌ AuthContext: Error initializing auth:', error);
      } finally {
        if (isMounted) {
          console.log('✅ AuthContext: Initialization complete, setting ready state');
          setLoading(false);
          setReady(true);
        }
      }
    };

    initializeAuth();

    // Escuchar cambios en la autenticación - SIMPLIFICADO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 AuthContext: Auth state change:', event);
        
        if (event === 'SIGNED_IN' && session?.user && isMounted) {
          console.log('✅ AuthContext: User signed in:', session.user.email);
          setUser(session.user);
          
          // Guardar email en localStorage para fallback
          if (session.user.email) {
            localStorage.setItem('crypto-force-user-email', session.user.email);
          }
          
          const userData = await fetchUserData(session.user.id);
          if (userData && isMounted) {
            setUserData(userData);
          } else if (isMounted) {
            const basicUserData = await createBasicUserData(session.user);
            setUserData(basicUserData);
          }
        } else if (event === 'SIGNED_OUT' && isMounted) {
          console.log('🚪 AuthContext: User signed out');
          setUser(null);
          setUserData(null);
          localStorage.removeItem('crypto-force-user-email');
        }
        
        if (isMounted) {
          setLoading(false);
          setReady(true);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, isReady, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

// Exportar
export { AuthProvider };