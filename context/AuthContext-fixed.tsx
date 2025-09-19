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
    throw new Error('useSafeAuth must be used within an AuthProvider');
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
    
    try {
      console.log('📡 [USERDATA] Consultando base de datos...');
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', userEmail)
        .maybeSingle();
      
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
      console.log('🔄 [USERDATA] Creando usuario básico como fallback...');
      try {
        await createBasicUser(userEmail);
      } catch (createError) {
        console.error('❌ [USERDATA] Error creando usuario básico:', createError);
      }
    }
  };

  // Función para crear usuario básico
  const createBasicUser = async (userEmail: string) => {
    console.log('👤 [CREATEUSER] Creando usuario básico para:', userEmail);
    
    try {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: userEmail,
          nombre: '',
          apellido: '',
          nickname: userEmail.split('@')[0],
          movil: '',
          exchange: '',
          user_level: 1,
          referral_code: `CRYPTOFORCE-${userEmail.split('@')[0].toUpperCase()}`,
          uid: user?.id || '',
          codigo_referido: null,
          referred_by: null,
          total_referrals: 0
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ [CREATEUSER] Error creando usuario:', createError);
        return;
      }

      console.log('✅ [CREATEUSER] Usuario básico creado:', newUser);
      setUserData(newUser);
      userDataFetched.current = true;
    } catch (error) {
      console.error('❌ [CREATEUSER] Error inesperado:', error);
    }
  };

  // Función de login
  const signIn = async (email: string, password: string) => {
    if (loginInProgress.current) {
      console.warn('⚠️ [LOGIN] Login ya en progreso, ignorando solicitud');
      return { success: false, error: 'Login ya en progreso' };
    }

    loginInProgress.current = true;
    setLoading(true);

    try {
      console.log('🔐 [LOGIN] Iniciando proceso de login para:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ [LOGIN] Error en login:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('✅ [LOGIN] Login exitoso:', data.user.email);
        setUser(data.user);
        
        try {
          await fetchUserData(data.user.email!);
        } catch (error) {
          console.error('❌ [LOGIN] Error obteniendo datos del usuario:', error);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('❌ [LOGIN] Error inesperado en login:', error);
      return { success: false, error: 'Error inesperado' };
    } finally {
      loginInProgress.current = false;
      setLoading(false);
    }
  };

  // Función de logout
  const signOut = async () => {
    console.log('🚪 [LOGOUT] Iniciando logout...');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ [LOGOUT] Error en logout:', error);
      }
    } catch (error) {
      console.error('❌ [LOGOUT] Error inesperado en logout:', error);
    } finally {
      setUser(null);
      setUserData(null);
      userDataFetched.current = false;
      setLoading(false);
      setIsReady(true);
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
      return { success: false, error: 'Error inesperado' };
    }
  };

  // Función para limpiar sesión
  const clearSession = async () => {
    console.log('🧹 [CLEAR] Limpiando sesión...');
    setUser(null);
    setUserData(null);
    userDataFetched.current = false;
    setLoading(false);
    setIsReady(true);
  };

  // Función para resetear estado de login
  const resetLoginState = () => {
    console.log('🔄 [RESET] Reseteando estado de login...');
    loginInProgress.current = false;
    if (loginTimeoutRef.current) {
      clearTimeout(loginTimeoutRef.current);
      loginTimeoutRef.current = null;
    }
    setLoading(false);
    setIsReady(true);
  };

  // Función para verificar si un email está autorizado para Maestro
  const isMaestroAuthorized = (email: string) => {
    return MAESTRO_AUTHORIZED_EMAILS.includes(email);
  };

  // Efecto para verificar sesión al cargar - VERSIÓN SIMPLIFICADA
  useEffect(() => {
    console.log('🔄 [SESSION] Iniciando verificación de sesión...');
    
    const checkSession = async () => {
      try {
        console.log('📡 [SESSION] Consultando sesión actual...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ [SESSION] Error obteniendo sesión:', error);
          return;
        }

        if (session?.user) {
          console.log('✅ [SESSION] Sesión activa encontrada:', {
            id: session.user.id,
            email: session.user.email
          });
          
          setUser(session.user);
          
          try {
            await fetchUserData(session.user.email!);
          } catch (error) {
            console.error('❌ [SESSION] Error obteniendo datos del usuario:', error);
          }
        } else {
          console.log('ℹ️ [SESSION] No hay sesión activa');
        }
      } catch (error) {
        console.error('❌ [SESSION] Error inesperado en checkSession:', error);
      }
    };

    // Timeout de seguridad MUY CORTO
    const safetyTimeout = setTimeout(() => {
      console.log('⏰ [SESSION] Timeout de seguridad alcanzado, estableciendo isReady=true');
      setLoading(false);
      setIsReady(true);
    }, 2000); // Solo 2 segundos

    mounted.current = true;
    checkSession().finally(() => {
      clearTimeout(safetyTimeout);
      // GARANTIZAR que isReady se establezca SIEMPRE
      console.log('✅ [SESSION] Estableciendo isReady=true y loading=false');
      setLoading(false);
      setIsReady(true);
    });
  }, []);

  // Listener para cambios de autenticación
  useEffect(() => {
    console.log('🔄 [AUTHSTATE] Configurando listener de cambios de autenticación...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 [AUTHSTATE] Evento de autenticación detectado:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ [AUTHSTATE] Usuario firmado:', session.user.email);
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
      }
    });

    return () => {
      console.log('🧹 [AUTHSTATE] Limpiando listener de autenticación...');
      subscription.unsubscribe();
    };
  }, []);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      console.log('🧹 [CLEANUP] Desmontando AuthProvider...');
      mounted.current = false;
      if (loginTimeoutRef.current) {
        clearTimeout(loginTimeoutRef.current);
      }
    };
  }, []);

  const value: AuthContextType = {
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
