'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { isRefreshTokenError, clearAuthStorage, handleAuthError } from '@/lib/authUtils';

// Lista de emails autorizados para acceder a la dashboard de Maestro
const MAESTRO_AUTHORIZED_EMAILS = [
  'infocryptoforce@gmail.com',
  'coeurdeluke.js@gmail.com'
];

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
  created_at: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isReady: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, metadata: any) => Promise<{ success: boolean; error?: string }>;
  clearSession: () => Promise<void>;
  resetLoginState: () => void;
  isMaestroAuthorized: (email: string) => boolean;
}

// Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado
export function useSafeAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSafeAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const mounted = useRef(false);
  const userDataFetched = useRef(false);
  const loginInProgress = useRef(false);
  const loginTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Función para obtener datos del usuario
  const fetchUserData = async (userEmail: string) => {
    console.log('📊 [USERDATA] Iniciando fetchUserData para:', userEmail);
    
    if (!mounted.current) {
      console.warn('⚠️ [USERDATA] Componente no montado, cancelando fetch');
      return;
    }
    
    if (userDataFetched.current) {
      console.warn('⚠️ [USERDATA] Datos ya obtenidos, cancelando fetch duplicado');
      return;
    }
    
    // Timeout de 5 segundos para evitar que se cuelgue
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 5000);
    });
    
    try {
      console.log('📡 [USERDATA] Consultando base de datos...');
      
      const fetchPromise = supabase
        .from('users')
        .select('*')
        .eq('email', userEmail)
        .maybeSingle();
      
      const { data: userData, error: userError } = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]) as any;
      
      if (userError) {
        console.error('❌ [USERDATA] Error al obtener datos de users:', userError);
        console.log('🔄 [USERDATA] Creando usuario básico...');
        await createBasicUser(userEmail);
        return;
      }
      
      if (userData) {
        console.log('✅ [USERDATA] Datos del usuario obtenidos:', {
          id: userData.id,
          email: userData.email,
          nickname: userData.nickname,
          user_level: userData.user_level,
          referral_code: userData.referral_code
        });
        
        console.log('🔄 [USERDATA] Estableciendo datos en contexto...');
        setUserData(userData);
        userDataFetched.current = true;
        
        console.log('✅ [USERDATA] Datos del usuario establecidos exitosamente');
        return;
      }
      
      console.log('⚠️ [USERDATA] No se encontraron datos, creando usuario básico...');
      // Si no hay datos, crear un usuario básico
      await createBasicUser(userEmail);
      
    } catch (error) {
      console.error('❌ [USERDATA] Error inesperado en fetchUserData:', error);
      if (error instanceof Error && error.message === 'Timeout') {
        console.error('⏰ [USERDATA] Timeout obteniendo datos del usuario');
      }
      console.log('🔄 [USERDATA] Creando usuario básico como fallback...');
      try {
        await createBasicUser(userEmail);
      } catch (createError) {
        console.error('❌ [USERDATA] Error creando usuario básico:', createError);
        // Si todo falla, al menos marcar como listo
        console.log('🔄 [USERDATA] Estableciendo isReady=true como último recurso');
        setLoading(false);
        setIsReady(true);
      }
    }
  };

  // Función para crear un usuario básico
  const createBasicUser = async (userEmail: string) => {
    console.log('👤 [CREATEUSER] Creando usuario básico para:', userEmail);
    
    const basicUser = {
      email: userEmail,
      nombre: '',
      apellido: '',
      nickname: userEmail.split('@')[0],
      movil: '',
      exchange: '',
      user_level: 1,
      referral_code: `REF${Date.now()}`,
      uid: '',
      codigo_referido: null,
      referred_by: null,
      total_referrals: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📝 [CREATEUSER] Datos del usuario básico:', {
      email: basicUser.email,
      nickname: basicUser.nickname,
      user_level: basicUser.user_level,
      referral_code: basicUser.referral_code
    });
    
    // Timeout de 5 segundos para evitar que se cuelgue
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 5000);
    });
    
    try {
      console.log('📡 [CREATEUSER] Insertando usuario en base de datos...');
      
      const insertPromise = supabase
        .from('users')
        .insert([basicUser])
        .select()
        .single();
      
      const { data: insertedUser, error: insertError } = await Promise.race([
        insertPromise,
        timeoutPromise
      ]) as any;

      if (insertError) {
        console.warn('⚠️ [CREATEUSER] Error al insertar usuario:', insertError.message);
        
        if (insertError.code === '23505') {
          console.log('🔄 [CREATEUSER] Usuario ya existe, obteniendo datos existentes...');
          // Usuario ya existe, obtener datos existentes
          try {
            const { data: existingUser, error: fetchError } = await supabase
              .from('users')
              .select('*')
              .eq('email', userEmail)
              .single();

            if (existingUser && !fetchError) {
              console.log('✅ [CREATEUSER] Usuario existente encontrado:', {
                id: existingUser.id,
                email: existingUser.email,
                user_level: existingUser.user_level
              });
              setUserData(existingUser);
              userDataFetched.current = true;
              return;
            }
          } catch (fetchError) {
            console.error('❌ [CREATEUSER] Error obteniendo usuario existente:', fetchError);
          }
        }
        throw insertError;
      } else {
        console.log('✅ [CREATEUSER] Usuario creado exitosamente:', {
          id: insertedUser.id,
          email: insertedUser.email,
          user_level: insertedUser.user_level
        });
        setUserData(insertedUser);
        userDataFetched.current = true;
      }
    } catch (error) {
      console.error('❌ [CREATEUSER] Error creando usuario básico:', error);
      if (error instanceof Error && error.message === 'Timeout') {
        console.error('⏰ [CREATEUSER] Timeout creando usuario básico');
      }
      // Si todo falla, al menos marcar como listo
      console.log('🔄 [CREATEUSER] Estableciendo isReady=true como último recurso');
      setLoading(false);
      setIsReady(true);
    }
    
    console.log('🔄 [CREATEUSER] Marcando datos como obtenidos');
    userDataFetched.current = true;
  };

  // Función de login
  const signIn = async (email: string, password: string) => {
    console.log('🔐 [AUTH] Iniciando proceso de login para:', email);
    
    if (loginInProgress.current) {
      console.warn('⚠️ [AUTH] Login ya en progreso, bloqueando intento duplicado');
      return { success: false, error: 'Login ya en progreso' };
    }

    loginInProgress.current = true;
    console.log('🔄 [AUTH] Marcando login en progreso');
    
    // Timeout de seguridad para resetear el estado si se queda bloqueado
    loginTimeoutRef.current = setTimeout(() => {
      console.warn('⚠️ [AUTH] Timeout de login alcanzado, reseteando estado');
      resetLoginState();
    }, 30000); // 30 segundos timeout
    
    try {
      console.log('📡 [AUTH] Enviando credenciales a Supabase...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ [AUTH] Error de autenticación:', error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('✅ [AUTH] Usuario autenticado exitosamente:', {
          id: data.user.id,
          email: data.user.email,
          created_at: data.user.created_at
        });
        
        console.log('🔄 [AUTH] Estableciendo usuario en contexto...');
        setUser(data.user);
        
        try {
          console.log('📊 [AUTH] Obteniendo datos del usuario...');
          await fetchUserData(data.user.email!);
          console.log('✅ [AUTH] Login completado exitosamente');
          return { success: true };
        } catch (fetchError) {
          console.error('❌ [AUTH] Error obteniendo datos del usuario:', fetchError);
          // Aún así consideramos el login exitoso si la autenticación fue correcta
          console.log('✅ [AUTH] Login completado (datos de usuario pendientes)');
          return { success: true };
        }
      }

      console.error('❌ [AUTH] No se pudo obtener información del usuario');
      return { success: false, error: 'No se pudo obtener información del usuario' };
    } catch (error) {
      console.error('❌ [AUTH] Error inesperado durante el login:', error);
      return { success: false, error: 'Error inesperado durante el login' };
    } finally {
      // CRÍTICO: Siempre resetear el flag de login en progreso
      console.log('🔄 [AUTH] Reseteando flag de login en progreso');
      loginInProgress.current = false;
      
      // Limpiar timeout
      if (loginTimeoutRef.current) {
        clearTimeout(loginTimeoutRef.current);
        loginTimeoutRef.current = null;
      }
    }
  };

  // Función para resetear el estado de login
  const resetLoginState = () => {
    console.log('🔄 [AUTH] Reseteando estado de login manualmente');
    loginInProgress.current = false;
    userDataFetched.current = false;
    
    // Limpiar timeout si existe
    if (loginTimeoutRef.current) {
      clearTimeout(loginTimeoutRef.current);
      loginTimeoutRef.current = null;
    }
  };

  // Función de logout
  const signOut = async () => {
    try {
      console.log('🚪 [AUTH] Iniciando logout...');
      resetLoginState();
      await supabase.auth.signOut();
      setUser(null);
      setUserData(null);
      userDataFetched.current = false;
      router.push('/login/signin');
    } catch (error) {
      console.error('Error durante logout:', error);
    }
  };

  // Función para limpiar sesión completamente
  const clearSession = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserData(null);
      userDataFetched.current = false;
      await clearAuthStorage();
      router.push('/login/signin');
    } catch (error) {
      console.error('Error limpiando sesión:', error);
    }
  };

  // Función de registro
  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error inesperado durante el registro' };
    }
  };

  // Verificar si el email está autorizado para Maestro
  const isMaestroAuthorized = (email: string) => {
    return MAESTRO_AUTHORIZED_EMAILS.includes(email);
  };

  // Efecto para verificar sesión al cargar
  useEffect(() => {
    console.log('🔄 [SESSION] Iniciando verificación de sesión...');
    
    const checkSession = async () => {
      try {
        console.log('📡 [SESSION] Consultando sesión actual...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ [SESSION] Error obteniendo sesión:', error);
          setLoading(false);
          setIsReady(true);
          return;
        }

        if (session?.user) {
          console.log('✅ [SESSION] Sesión activa encontrada:', {
            id: session.user.id,
            email: session.user.email,
            hasAccessToken: !!session.access_token,
            hasRefreshToken: !!session.refresh_token
          });
          
          console.log('🔄 [SESSION] Estableciendo usuario en contexto...');
          setUser(session.user);
          
        console.log('📊 [SESSION] Obteniendo datos del usuario...');
        try {
          await fetchUserData(session.user.email!);
        } catch (error) {
          console.error('❌ [SESSION] Error obteniendo datos del usuario:', error);
          // Continuar aunque falle fetchUserData
          console.log('🔄 [SESSION] Estableciendo isReady=true a pesar del error');
          setLoading(false);
          setIsReady(true);
        }
        } else {
          console.log('⚠️ [SESSION] No hay sesión activa, verificando almacenamiento local...');
          // Verificar si hay una sesión almacenada localmente
          const storedSession = localStorage.getItem('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token');
          if (storedSession) {
            try {
              const parsedSession = JSON.parse(storedSession);
              console.log('🔍 [SESSION] Sesión almacenada encontrada:', {
                hasAccessToken: !!parsedSession.access_token,
                hasRefreshToken: !!parsedSession.refresh_token
              });
              
              if (!parsedSession.refresh_token || parsedSession.refresh_token === '') {
                console.log('🧹 [SESSION] Limpiando sesión inválida...');
                localStorage.removeItem('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token');
              }
            } catch (e) {
              console.log('🧹 [SESSION] Error parseando sesión almacenada, limpiando...');
              localStorage.removeItem('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token');
            }
          } else {
            console.log('ℹ️ [SESSION] No hay sesión almacenada localmente');
          }
        }
      } catch (error) {
        console.error('❌ [SESSION] Error verificando sesión:', error);
      } finally {
        console.log('✅ [SESSION] Verificación de sesión completada');
        setLoading(false);
        setIsReady(true);
      }
    };

    // Timeout de seguridad para asegurar que isReady se establezca
    const safetyTimeout = setTimeout(() => {
      console.log('⏰ [SESSION] Timeout de seguridad - estableciendo isReady=true');
      setLoading(false);
      setIsReady(true);
    }, 8000); // 8 segundos de timeout

    console.log('🔄 [SESSION] Marcando componente como montado');
    mounted.current = true;
    checkSession().finally(() => {
      clearTimeout(safetyTimeout);
    });
  }, []);

  // Listener para cambios de autenticación
  useEffect(() => {
    console.log('🔄 [AUTHSTATE] Configurando listener de cambios de autenticación...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 [AUTHSTATE] Evento de autenticación detectado:', event, {
        hasSession: !!session,
        hasUser: !!session?.user,
        userEmail: session?.user?.email,
        timestamp: new Date().toISOString()
      });
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ [AUTHSTATE] Usuario firmado:', {
          id: session.user.id,
          email: session.user.email
        });
        setUser(session.user);
        try {
          await fetchUserData(session.user.email!);
        } catch (error) {
          console.error('❌ [AUTHSTATE] Error obteniendo datos del usuario:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 [AUTHSTATE] Usuario cerrado sesión, limpiando datos...');
        setUser(null);
        setUserData(null);
        userDataFetched.current = false;
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 [AUTHSTATE] Token refrescado');
      } else if (event === 'USER_UPDATED') {
        console.log('🔄 [AUTHSTATE] Usuario actualizado');
      } else {
        console.log('ℹ️ [AUTHSTATE] Otro evento:', event);
      }
    });

    return () => {
      console.log('🧹 [AUTHSTATE] Limpiando listener de autenticación');
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    userData,
    loading,
    isReady,
    signIn,
    signOut,
    signUp,
    clearSession,
    resetLoginState,
    isMaestroAuthorized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}