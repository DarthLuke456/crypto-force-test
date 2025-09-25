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
      referral_code: `CRYPTOFORCE_${user.email?.split('@')[0].toUpperCase().replace(/\s+/g, '_') || 'USER'}`,
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

  // Inicialización con Supabase
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔄 AuthContext: Initializing authentication...');
        
        // Obtener sesión actual sin timeout para evitar problemas
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.warn('⚠️ AuthContext: Session error:', sessionError);
        }
        
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
            const basicUserData = await createBasicUserData(session.user);
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
                  referred_by: basicUserData.referred_by,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                });
              
              if (createError) {
                console.warn('⚠️ AuthContext: Error creating user in database:', createError);
              } else {
                console.log('✅ AuthContext: User created in database successfully');
                
                // If user was referred by someone, increment their referral count
                if (basicUserData.referred_by) {
                  try {
                    const { data: currentUser, error: fetchError } = await supabase
                      .from('users')
                      .select('total_referrals')
                      .eq('id', basicUserData.referred_by)
                      .single();
                    
                    if (!fetchError && currentUser) {
                      await supabase
                        .from('users')
                        .update({ 
                          total_referrals: (currentUser.total_referrals || 0) + 1,
                          updated_at: new Date().toISOString()
                        })
                        .eq('id', basicUserData.referred_by);
                      
                      console.log('✅ Referral count updated for referrer');
                    }
                  } catch (error) {
                    console.warn('⚠️ Error updating referral count:', error);
                  }
                }
              }
            } catch (error) {
              console.warn('⚠️ AuthContext: Error creating user in database:', error);
            }
          }
        } else {
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
            
            // Try to fetch real data from database immediately
            console.log('🔄 AuthContext: Attempting to fetch real data from database...');
            const realUserData = await supabase
              .from('users')
              .select('*')
              .eq('email', storedEmail)
              .single();
            
            if (realUserData.data) {
              console.log('✅ AuthContext: Found real user data in database:', realUserData.data);
              setUserData(realUserData.data);
            } else {
              console.log('⚠️ AuthContext: No real data found, using fallback');
              const basicUserData = await createBasicUserData(mockUser);
              setUserData(basicUserData);
              
              // Try to create user in database
              try {
                const { error: createError } = await supabase
                  .from('users')
                  .insert({
                    email: mockUser.email,
                    uid: mockUser.id,
                    nickname: mockUser.email?.split('@')[0] || 'Usuario',
                    user_level: basicUserData.user_level,
                    referral_code: basicUserData.referral_code,
                    referred_by: basicUserData.referred_by,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  });
                
                if (!createError && basicUserData.referred_by) {
                  // Update referrer's count
                  try {
                    const { data: currentUser, error: fetchError } = await supabase
                      .from('users')
                      .select('total_referrals')
                      .eq('id', basicUserData.referred_by)
                      .single();
                    
                    if (!fetchError && currentUser) {
                      await supabase
                        .from('users')
                        .update({ 
                          total_referrals: (currentUser.total_referrals || 0) + 1,
                          updated_at: new Date().toISOString()
                        })
                        .eq('id', basicUserData.referred_by);
                    }
                  } catch (error) {
                    console.warn('⚠️ Error updating referral count:', error);
                  }
                }
              } catch (error) {
                console.warn('⚠️ Error creating user in database:', error);
              }
            }
          }
        }
      } catch (error) {
        console.error('❌ AuthContext: Error initializing auth:', error);
        
        // Try to recover with stored email
        const storedEmail = localStorage.getItem('crypto-force-user-email');
        if (storedEmail) {
          console.log('🔄 AuthContext: Attempting recovery with stored email:', storedEmail);
          
          const authorizedEmails = ['coeurdeluke.js@gmail.com', 'coeurdeluke@gmail.com', 'infocryptoforce@gmail.com'];
          if (authorizedEmails.includes(storedEmail)) {
            console.log('✅ AuthContext: Using fallback for authorized email:', storedEmail);
            
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
            
            // Try to fetch real data from database even with fallback user
            console.log('🔄 AuthContext: Attempting to fetch real data from database...');
            const realUserData = await supabase
              .from('users')
              .select('*')
              .eq('email', storedEmail)
              .single();
            
            if (realUserData.data) {
              console.log('✅ AuthContext: Found real user data in database:', realUserData.data);
              setUserData(realUserData.data);
            } else {
              console.log('⚠️ AuthContext: No real data found, using fallback');
              const basicUserData = await createBasicUserData(mockUser);
              setUserData(basicUserData);
              
              // Try to create user in database
              try {
                const { error: createError } = await supabase
                  .from('users')
                  .insert({
                    email: mockUser.email,
                    uid: mockUser.id,
                    nickname: mockUser.email?.split('@')[0] || 'Usuario',
                    user_level: basicUserData.user_level,
                    referral_code: basicUserData.referral_code,
                    referred_by: basicUserData.referred_by,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  });
                
                if (!createError && basicUserData.referred_by) {
                  // Update referrer's count
                  try {
                    const { data: currentUser, error: fetchError } = await supabase
                      .from('users')
                      .select('total_referrals')
                      .eq('id', basicUserData.referred_by)
                      .single();
                    
                    if (!fetchError && currentUser) {
                      await supabase
                        .from('users')
                        .update({ 
                          total_referrals: (currentUser.total_referrals || 0) + 1,
                          updated_at: new Date().toISOString()
                        })
                        .eq('id', basicUserData.referred_by);
                    }
                  } catch (error) {
                    console.warn('⚠️ Error updating referral count:', error);
                  }
                }
              } catch (error) {
                console.warn('⚠️ Error creating user in database:', error);
              }
            }
          }
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
            const basicUserData = await createBasicUserData(session.user);
            setUserData(basicUserData);
            
            // Try to create user in database
            try {
              const { error: createError } = await supabase
                .from('users')
                .insert({
                  email: session.user.email,
                  uid: session.user.id,
                  nickname: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario',
                  user_level: basicUserData.user_level,
                  referral_code: basicUserData.referral_code,
                  referred_by: basicUserData.referred_by,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                });
              
              if (!createError && basicUserData.referred_by) {
                // Update referrer's count
                try {
                  const { data: currentUser, error: fetchError } = await supabase
                    .from('users')
                    .select('total_referrals')
                    .eq('id', basicUserData.referred_by)
                    .single();
                  
                  if (!fetchError && currentUser) {
                    await supabase
                      .from('users')
                      .update({ 
                        total_referrals: (currentUser.total_referrals || 0) + 1,
                        updated_at: new Date().toISOString()
                      })
                      .eq('id', basicUserData.referred_by);
                  }
                } catch (error) {
                  console.warn('⚠️ Error updating referral count:', error);
                }
              }
            } catch (error) {
              console.warn('⚠️ Error creating user in database:', error);
            }
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