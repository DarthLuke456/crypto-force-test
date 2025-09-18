'use client';

import { useSafeAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useFeedbackAuth() {
  const { user, isReady } = useSafeAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  // Verificar si el usuario está autenticado
  const isAuthenticated = !!user && isReady;

  // Función para manejar el envío de feedback
  const handleFeedbackSubmit = async (feedbackData: any) => {
    console.log('🔍 useFeedbackAuth - handleFeedbackSubmit iniciado');
    console.log('🔍 useFeedbackAuth - isAuthenticated:', isAuthenticated);
    console.log('🔍 useFeedbackAuth - user:', user);
    
    if (!isAuthenticated) {
      console.log('🔍 useFeedbackAuth - Usuario no autenticado, devolviendo requiresAuth');
      // Si no está autenticado, mostrar opciones de login/registro
      return { requiresAuth: true };
    }

    try {
      setIsChecking(true);
      
      // Obtener el token de la sesión actual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        console.error('❌ useFeedbackAuth - Error al obtener sesión:', sessionError);
        return { error: 'Error de autenticación' };
      }

      // Obtener datos del perfil del usuario para conseguir el WhatsApp
      let userProfile = null;
      try {
        const profileResponse = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          userProfile = profileData.data;
          console.log('🔍 useFeedbackAuth - Perfil obtenido:', userProfile);
        } else {
          console.log('⚠️ useFeedbackAuth - No se pudo obtener perfil, usando datos básicos');
        }
      } catch (profileError) {
        console.log('⚠️ useFeedbackAuth - Error obteniendo perfil:', profileError);
      }
      
      // Enviar feedback a la API con token de autorización
      const requestBody = {
        subject: feedbackData.subject,
        message: feedbackData.message,
        category: feedbackData.category,
        user_id: user?.id || null,
        email: user?.email || 'unknown@example.com',
        nickname: userProfile?.nickname || user?.user_metadata?.display_name || null,
        whatsapp: userProfile?.whatsapp || null
      };
      
      console.log('🔍 useFeedbackAuth - user.id:', user?.id);
      console.log('🔍 useFeedbackAuth - user.email:', user?.email);
      console.log('🔍 useFeedbackAuth - user.user_metadata:', user?.user_metadata);
      
      console.log('🔍 useFeedbackAuth - Enviando request a API...');
      console.log('🔍 useFeedbackAuth - Request body:', requestBody);
      console.log('🔍 useFeedbackAuth - URL:', '/api/feedback');
      console.log('🔍 useFeedbackAuth - Method:', 'POST');
      console.log('🔍 useFeedbackAuth - Headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      });
      console.log('🔍 useFeedbackAuth - Session access_token length:', session.access_token?.length);
      console.log('🔍 useFeedbackAuth - Session access_token preview:', session.access_token?.substring(0, 20) + '...');
      
      let response;
      try {
        response = await fetch('/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(requestBody),
        });
        console.log('🔍 useFeedbackAuth - Response recibida exitosamente');
      } catch (fetchError: any) {
        console.error('❌ useFeedbackAuth - Error en fetch:', fetchError);
        throw new Error(`Error de red: ${fetchError.message || 'Error desconocido'}`);
      }

      console.log('🔍 useFeedbackAuth - Response status:', response.status);
      console.log('🔍 useFeedbackAuth - Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar feedback');
      }

      const result = await response.json();
      console.log('✅ Feedback enviado exitosamente:', result);
      
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Error al enviar feedback:', error);
      return { error: error instanceof Error ? error.message : 'Error desconocido' };
    } finally {
      setIsChecking(false);
    }
  };

  // Función para redirigir a login
  const redirectToLogin = () => {
    // Guardar la URL actual para redirigir después del login
    const currentUrl = window.location.href;
    localStorage.setItem('feedback_redirect_url', currentUrl);
    router.push('/login/signin');
  };

  // Función para redirigir a registro
  const redirectToSignup = () => {
    // Guardar la URL actual para redirigir después del signup
    const currentUrl = window.location.href;
    localStorage.setItem('feedback_redirect_url', currentUrl);
    router.push('/signup');
  };

  return {
    isAuthenticated,
    isChecking,
    handleFeedbackSubmit,
    redirectToLogin,
    redirectToSignup
  };
}
