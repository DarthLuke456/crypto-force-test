'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

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

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setReady] = useState(false);

  // Función para obtener datos del usuario con fallback
  const fetchUserData = async (userId: string): Promise<UserData | null> => {
    try {
      console.log('🔍 [AUTH] Fetching user data for:', userId);
      
      // Intentar por UID primero con timeout
      try {
        const { data, error } = await Promise.race([
          supabase
            .from('users')
            .select('*')
            .eq('uid', userId)
            .single(),
          new Promise<{data: null, error: {message: string}}>((_, reject) => 
            setTimeout(() => reject({data: null, error: {message: 'Timeout'}}), 3000)
          )
        ]);

        if (!error && data) {
          console.log('✅ [AUTH] User data fetched by UID');
          return data;
        }

        console.log('⚠️ [AUTH] Error fetching by UID, trying by email...', error?.message);
      } catch (timeoutError) {
        console.log('⏰ [AUTH] Timeout fetching by UID, trying by email...');
      }
      
      // Fallback: buscar por email
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user?.email) {
        try {
          const { data: emailData, error: emailError } = await Promise.race([
            supabase
              .from('users')
              .select('*')
              .eq('email', sessionData.session.user.email)
              .single(),
            new Promise<{data: null, error: {message: string}}>((_, reject) => 
              setTimeout(() => reject({data: null, error: {message: 'Timeout'}}), 3000)
            )
          ]);

          if (!emailError && emailData) {
            console.log('✅ [AUTH] User data fetched by email');
            return emailData;
          }

          console.log('⚠️ [AUTH] Error fetching by email:', emailError?.message);
        } catch (timeoutError) {
          console.log('⏰ [AUTH] Timeout fetching by email');
        }
      }

      console.log('❌ [AUTH] All fetch methods failed, returning null');
      return null;
    } catch (error) {
      console.error('❌ [AUTH] Exception fetching user data:', error);
      return null;
    }
  };

  // Función para crear usuario básico (solo usuarios autorizados)
  const createBasicUser = async (user: User): Promise<UserData | null> => {
    try {
      console.log('🔍 [AUTH] Creating basic user for:', user.email);
      
      const authorizedEmails = ['infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com'];
      if (!user.email || !authorizedEmails.includes(user.email.toLowerCase().trim())) {
        console.log('❌ [AUTH] User not authorized:', user.email);
        return null;
      }
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          uid: user.id,
          email: user.email || '',
          nombre: '',
          apellido: '',
          nickname: user.email?.split('@')[0] || 'Usuario',
          movil: '',
          exchange: '',
          user_level: 1,
          referral_code: `CRYPTOFORCE-${user.email?.split('@')[0]?.toUpperCase() || 'USER'}`,
          codigo_referido: null,
          referred_by: null,
          total_referrals: 0
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [AUTH] Error creating user:', error);
        return null;
      }

      console.log('✅ [AUTH] User created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ [AUTH] Exception creating user:', error);
      return null;
    }
  };

  // Inicialización
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔍 [AUTH] Initializing auth...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ [AUTH] Error getting session:', error);
          if (mounted) {
            setReady(true);
            setLoading(false);
          }
          return;
        }

        if (session?.user) {
          console.log('✅ [AUTH] Session found, user:', session.user.email);
          
          if (mounted) {
            setUser(session.user);
          }

          // Intentar obtener datos del usuario con timeout
          try {
            const userData = await Promise.race([
              fetchUserData(session.user.id),
              new Promise<null>((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 2000)
              )
            ]);
            
            if (userData) {
              if (mounted) {
                setUserData(userData);
              }
            } else {
              console.log('⚠️ [AUTH] No user data found, creating fallback');
              // Crear datos básicos como fallback inmediato
              const authorizedEmails = ['infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com'];
              const isAuthorized = session.user.email && authorizedEmails.includes(session.user.email.toLowerCase().trim());
              
              const fallbackUserData: UserData = {
                id: session.user.id,
                email: session.user.email || '',
                nombre: '',
                apellido: '',
                nickname: session.user.email?.split('@')[0] || 'Usuario',
                movil: '',
                exchange: '',
                user_level: isAuthorized ? 6 : 1, // Nivel 6 para usuarios autorizados
                referral_code: `AUTH-${session.user.id.slice(0, 8)}`,
                uid: session.user.id,
                codigo_referido: null,
                referred_by: null,
                total_referrals: 0
              };
              
              if (mounted) {
                setUserData(fallbackUserData);
              }
            }
          } catch (fetchError) {
            console.warn('⚠️ [AUTH] Error fetching user data, using fallback:', fetchError);
            
            // Fallback: crear datos básicos
            const fallbackUserData: UserData = {
              id: session.user.id,
              email: session.user.email || '',
              nombre: '',
              apellido: '',
              nickname: session.user.email?.split('@')[0] || 'Usuario',
              movil: '',
              exchange: '',
              user_level: 1,
              referral_code: `FALLBACK-${session.user.id.slice(0, 8)}`,
              uid: session.user.id,
              codigo_referido: null,
              referred_by: null,
              total_referrals: 0
            };
            
            if (mounted) {
              setUserData(fallbackUserData);
            }
          }
        }

        if (mounted) {
          setReady(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ [AUTH] Exception in initializeAuth:', error);
        if (mounted) {
          setReady(true);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listener para cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 [AUTH] Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        
        try {
          const userData = await fetchUserData(session.user.id);
          if (userData) {
            setUserData(userData);
          } else {
            // Fallback para usuarios no encontrados
            const fallbackUserData: UserData = {
              id: session.user.id,
              email: session.user.email || '',
              nombre: '',
              apellido: '',
              nickname: session.user.email?.split('@')[0] || 'Usuario',
              movil: '',
              exchange: '',
              user_level: 1,
              referral_code: `AUTH-${session.user.id.slice(0, 8)}`,
              uid: session.user.id,
              codigo_referido: null,
              referred_by: null,
              total_referrals: 0
            };
            setUserData(fallbackUserData);
          }
        } catch (error) {
          console.warn('⚠️ [AUTH] Error in auth state change, using fallback:', error);
          const fallbackUserData: UserData = {
            id: session.user.id,
            email: session.user.email || '',
            nombre: '',
            apellido: '',
            nickname: session.user.email?.split('@')[0] || 'Usuario',
            movil: '',
            exchange: '',
            user_level: 1,
            referral_code: `AUTH-${session.user.id.slice(0, 8)}`,
            uid: session.user.id,
            codigo_referido: null,
            referred_by: null,
            total_referrals: 0
          };
          setUserData(fallbackUserData);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserData(null);
      }
      
      setReady(true);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}
