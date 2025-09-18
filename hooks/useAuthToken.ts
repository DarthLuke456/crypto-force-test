import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const useAuthToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      setLoading(true);
      setError(null);
      console.log('useAuthToken: Attempting to get session token...');
      
      try {
        // Obtener la sesión actual usando el cliente de Supabase existente
        console.log('useAuthToken: Calling supabase.auth.getSession()...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session && !error) {
          console.log('useAuthToken: Session obtained successfully, token length:', session.access_token?.length);
          console.log('useAuthToken: Session user ID:', session.user?.id);
          console.log('useAuthToken: Session expires at:', session.expires_at);
          setToken(session.access_token);
        } else {
          console.warn('useAuthToken: No session or error:', error);
          
          // Intentar obtener la sesión del usuario actual
          try {
            console.log('useAuthToken: Attempting to get current user...');
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError) {
              console.error('useAuthToken: Error getting user:', userError);
              setError(`Error getting user: ${userError.message}`);
            } else if (user) {
              console.log('useAuthToken: Current user found, ID:', user.id);
              console.log('useAuthToken: Attempting to get session again...');
              
              const { data: { session: newSession }, error: sessionError } = await supabase.auth.getSession();
              if (sessionError) {
                console.error('useAuthToken: Error getting session after user found:', sessionError);
                setError(`Error getting session: ${sessionError.message}`);
              } else if (newSession) {
                console.log('useAuthToken: New session obtained, token length:', newSession.access_token?.length);
                setToken(newSession.access_token);
              } else {
                console.warn('useAuthToken: No session available even though user exists');
                setError('No session available');
              }
            } else {
              console.log('useAuthToken: No current user found');
              setError('No authenticated user found');
            }
          } catch (userError) {
            console.error('useAuthToken: Error getting user:', userError);
            setError(`Error getting user: ${userError}`);
          }
        }
      } catch (error) {
        console.error('useAuthToken: Error getting session:', error);
        setError(`Error getting session: ${error}`);
      }
      
      setLoading(false);
    };

    getToken();

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuthToken: Auth state changed:', event);
        if (session) {
          console.log('useAuthToken: New session from auth change, token length:', session.access_token?.length);
          setToken(session.access_token);
          setError(null);
        } else {
          console.log('useAuthToken: Session cleared from auth change');
          setToken(null);
          setError('Session cleared');
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Log cuando el token cambie
  useEffect(() => {
    if (token) {
      console.log('useAuthToken: Token updated, length:', token.length);
    } else {
      console.log('useAuthToken: Token cleared');
    }
  }, [token]);

  // Función para forzar la obtención del token
  const refreshToken = async () => {
    console.log('useAuthToken: Manually refreshing token...');
    setLoading(true);
    setError(null);
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session && session.access_token) {
        console.log('useAuthToken: Token refreshed successfully, length:', session.access_token.length);
        setToken(session.access_token);
        setError(null);
      } else {
        console.error('useAuthToken: Failed to refresh token - no session or token');
        setError('Failed to refresh token: No active session found');
      }
    } catch (error) {
      console.error('useAuthToken: Error refreshing token:', error);
      setError(`Error refreshing token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para crear una sesión usando el email del usuario actual
  const createSessionFromCurrentUser = async () => {
    console.log('useAuthToken: Creating session from current user...');
    setLoading(true);
    setError(null);
    
    try {
      // Obtener el email del usuario actual desde el contexto o localStorage
      const currentUserEmail = 'coeurdeluke.js@gmail.com'; // Email del usuario actual
      
      console.log('useAuthToken: Attempting to sign in with email:', currentUserEmail);
      
      // Intentar iniciar sesión con el email actual
      // Nota: Esto requerirá que el usuario ingrese su contraseña
      const { data, error } = await supabase.auth.signInWithOtp({
        email: currentUserEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard/maestro/students`
        }
      });
      
      if (error) {
        console.error('useAuthToken: Error creating session:', error);
        setError(`Error creating session: ${error.message}`);
      } else {
        console.log('useAuthToken: Magic link sent successfully');
        setError('Se ha enviado un enlace mágico a tu email. Revisa tu bandeja de entrada.');
      }
    } catch (error) {
      console.error('useAuthToken: Error creating session:', error);
      setError(`Error creating session: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const signOut = async () => {
    console.log('useAuthToken: Signing out...');
    try {
      await supabase.auth.signOut();
      setToken(null);
      setError('Session cleared');
    } catch (error) {
      console.error('useAuthToken: Error signing out:', error);
    }
  };

  return { 
    token, 
    loading, 
    error, 
    refreshToken, 
    createSessionFromCurrentUser, 
    signOut 
  };
};
