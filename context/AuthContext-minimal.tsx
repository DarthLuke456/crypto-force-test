'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

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

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isReady: false,
  refreshUserData: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const useSafeAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSafeAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setReady] = useState(false);

  const refreshUserData = async () => {
    if (!user?.email) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (data && !error) {
        setUserData(data);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          setUser(session.user);
          
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .single();

          if (data && mounted) {
            setUserData(data);
          }
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          setReady(true);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          if (event === 'SIGNED_IN' && session?.user) {
            setUser(session.user);
            
            const { data } = await supabase
              .from('users')
              .select('*')
              .eq('email', session.user.email)
              .single();

            if (data) {
              setUserData(data);
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setUserData(null);
          }
          
          setLoading(false);
          setReady(true);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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
