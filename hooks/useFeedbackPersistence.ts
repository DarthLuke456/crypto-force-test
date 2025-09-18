'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface FeedbackData {
  subject: string;
  message: string;
  category: string;
}

const STORAGE_KEY = 'crypto-force-feedback-draft';

export function useFeedbackPersistence() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    subject: '',
    message: '',
    category: 'general'
  });

  // Ref para evitar re-renders innecesarios
  const lastSavedData = useRef<string>('');

  // Cargar datos guardados al montar el componente
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFeedbackData(parsed);
        lastSavedData.current = savedData;
        console.log('📝 Feedback cargado desde localStorage:', parsed);
      } catch (error) {
        console.error('❌ Error al cargar feedback guardado:', error);
      }
    }
  }, []);

  // Función para guardar datos (con debounce)
  const saveData = useCallback((data: FeedbackData) => {
    const dataString = JSON.stringify(data);
    
    // Solo guardar si hay cambios
    if (dataString !== lastSavedData.current && (data.subject || data.message)) {
      localStorage.setItem(STORAGE_KEY, dataString);
      lastSavedData.current = dataString;
      console.log('💾 Feedback guardado:', data);
    }
  }, []);

  // Función para actualizar datos
  const updateFeedback = useCallback((updates: Partial<FeedbackData>) => {
    setFeedbackData(prevData => {
      const newData = { ...prevData, ...updates };
      // Guardar inmediatamente
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  // Función para limpiar datos (después de envío exitoso)
  const clearFeedback = useCallback(() => {
    setFeedbackData({
      subject: '',
      message: '',
      category: 'general'
    });
    localStorage.removeItem(STORAGE_KEY);
    lastSavedData.current = '';
    console.log('🗑️ Feedback limpiado');
  }, []);

  // Función para verificar si hay datos guardados
  const hasSavedData = useCallback(() => {
    return !!(feedbackData.subject || feedbackData.message);
  }, [feedbackData.subject, feedbackData.message]);

  return {
    feedbackData,
    updateFeedback,
    clearFeedback,
    hasSavedData
  };
}
