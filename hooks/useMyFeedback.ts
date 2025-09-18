import { useState, useEffect, useCallback, useRef } from 'react';
import { useSafeAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export interface FeedbackResponse {
  id: string;
  subject: string;
  message: string;
  response: string | null;
  response_by: string | null;
  response_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  feedback_responses?: {
    id: string;
    response_text: string;
    response_by: string;
    response_by_email: string;
    created_at: string;
  }[];
}

// Singleton para evitar múltiples instancias
let globalFeedbacks: FeedbackResponse[] = [];
let globalLoading = false;
let globalError: string | null = null;
let globalSession: any = null;
let globalListeners: Set<() => void> = new Set();

export function useMyFeedback() {
  const { user } = useSafeAuth();
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>(globalFeedbacks);
  const [loading, setLoading] = useState<boolean>(globalLoading);
  const [error, setError] = useState<string | null>(globalError);
  const updateRef = useRef<(() => void) | undefined>(undefined);

  // Función para notificar a todos los listeners
  const notifyListeners = useCallback(() => {
    globalListeners.forEach(listener => listener());
  }, []);

  // Función para actualizar el estado local
  const updateLocalState = useCallback(() => {
    setFeedbacks([...globalFeedbacks]);
    setLoading(globalLoading);
    setError(globalError);
  }, []);

  // Registrar listener
  useEffect(() => {
    updateRef.current = updateLocalState;
    globalListeners.add(updateLocalState);
    
    return () => {
      if (updateRef.current) {
        globalListeners.delete(updateRef.current);
      }
    };
  }, [updateLocalState]);

  const loadFeedbacks = useCallback(async (retryCount = 0) => {
    try {
      console.log('🔍 useMyFeedback - Iniciando carga de feedback... (intento:', retryCount + 1, ')');
      globalLoading = true;
      globalError = null;
      notifyListeners();

      // Verificar si hay usuario autenticado
      if (!user) {
        console.log('❌ useMyFeedback - No hay usuario autenticado');
        globalError = 'No hay sesión activa';
        globalLoading = false;
        notifyListeners();
        return;
      }

      // Obtener la sesión para obtener el token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.log('❌ useMyFeedback - Error al obtener sesión:', sessionError);
        globalError = 'Error al obtener sesión';
        globalLoading = false;
        notifyListeners();
        return;
      }

      if (!session?.access_token) {
        console.log('❌ useMyFeedback - No hay token de acceso en la sesión');
        console.log('🔍 useMyFeedback - Session object:', session);
        
        // Si es el primer intento y no hay token, esperar un poco y reintentar
        if (retryCount < 3) {
          console.log('🔄 useMyFeedback - Reintentando en 1 segundo...');
          setTimeout(() => {
            loadFeedbacks(retryCount + 1);
          }, 1000);
          return;
        }
        
        globalError = 'No hay sesión activa';
        globalLoading = false;
        notifyListeners();
        return;
      }

      console.log('🔍 useMyFeedback - Token encontrado, enviando request...');
      console.log('🔍 useMyFeedback - Token length:', session.access_token.length);
      console.log('🔍 useMyFeedback - Token preview:', session.access_token.substring(0, 20) + '...');

      const response = await fetch('/api/feedback/my-feedback', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        credentials: 'include', // Incluir cookies de autenticación
      });

      console.log('🔍 useMyFeedback - Response status:', response.status);
      const data = await response.json();
      console.log('🔍 useMyFeedback - Response data:', data);
      console.log('🔍 useMyFeedback - Response data type:', typeof data);
      console.log('🔍 useMyFeedback - Response data keys:', Object.keys(data));
      console.log('🔍 useMyFeedback - Feedbacks array length:', data.feedbacks?.length || 0);
      console.log('🔍 useMyFeedback - Feedbacks content:', data.feedbacks);
      console.log('🔍 useMyFeedback - Feedbacks is array:', Array.isArray(data.feedbacks));

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar feedback');
      }

      globalFeedbacks = data.feedbacks || [];
      console.log('✅ useMyFeedback - Feedback cargado exitosamente');
      console.log('🔍 useMyFeedback - Global feedbacks set to:', globalFeedbacks);
    } catch (err) {
      console.error('❌ useMyFeedback - Error al cargar feedback:', err);
      globalError = err instanceof Error ? err.message : 'Error desconocido';
    } finally {
      globalLoading = false;
      notifyListeners();
    }
  }, [notifyListeners, user]);

  const getUnreadCount = useCallback(() => {
    return feedbacks.filter(feedback => 
      feedback.response && 
      feedback.status !== 'resolved'
    ).length;
  }, [feedbacks]);

  const hasNewResponses = useCallback(() => {
    return feedbacks.some(feedback => 
      feedback.response && 
      feedback.status !== 'resolved'
    );
  }, [feedbacks]);

  // Cargar feedbacks cuando hay usuario
  useEffect(() => {
    if (user) {
      console.log('✅ useMyFeedback - Usuario autenticado, cargando feedback...');
      loadFeedbacks();
    }
  }, [user, loadFeedbacks]);

  return {
    feedbacks,
    loading,
    error,
    loadFeedbacks,
    getUnreadCount,
    hasNewResponses
  };
}
