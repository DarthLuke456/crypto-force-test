import { useState, useEffect, useCallback } from 'react';

interface RememberedCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
  timestamp: string;
}

export const useRememberMe = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState<RememberedCredentials | null>(null);

  // Cargar credenciales guardadas al montar el hook
  useEffect(() => {
    loadSavedCredentials();
  }, []);

  // Cargar credenciales desde localStorage
  const loadSavedCredentials = useCallback(() => {
    try {
      const saved = localStorage.getItem('rememberedCredentials');
      if (saved) {
        const credentials: RememberedCredentials = JSON.parse(saved);
        
        // Verificar que las credenciales no sean muy antiguas (máximo 30 días)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        if (new Date(credentials.timestamp) > thirtyDaysAgo) {
          setSavedCredentials(credentials);
          setRememberMe(credentials.rememberMe);
          return credentials;
        } else {
          // Credenciales muy antiguas, limpiarlas
          clearSavedCredentials();
        }
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error);
      clearSavedCredentials();
    }
    return null;
  }, []);

  // Guardar credenciales en localStorage
  const saveCredentials = useCallback((email: string, password: string, shouldRemember: boolean) => {
    if (shouldRemember) {
      const credentials: RememberedCredentials = {
        email,
        password,
        rememberMe: true,
        timestamp: new Date().toISOString()
      };
      
      try {
        localStorage.setItem('rememberedCredentials', JSON.stringify(credentials));
        setSavedCredentials(credentials);
        setRememberMe(true);
        console.log('Credenciales guardadas para recordar');
        return true;
      } catch (error) {
        console.error('Error saving credentials:', error);
        return false;
      }
    } else {
      clearSavedCredentials();
      return true;
    }
  }, []);

  // Limpiar credenciales guardadas
  const clearSavedCredentials = useCallback(() => {
    try {
      localStorage.removeItem('rememberedCredentials');
      setSavedCredentials(null);
      setRememberMe(false);
      console.log('Credenciales guardadas eliminadas');
      return true;
    } catch (error) {
      console.error('Error clearing credentials:', error);
      return false;
    }
  }, []);

  // Obtener credenciales guardadas
  const getSavedCredentials = useCallback(() => {
    return savedCredentials;
  }, [savedCredentials]);

  // Verificar si hay credenciales guardadas
  const hasSavedCredentials = useCallback(() => {
    return savedCredentials !== null;
  }, [savedCredentials]);

  // Actualizar estado de "Recordarme"
  const updateRememberMe = useCallback((checked: boolean) => {
    setRememberMe(checked);
    
    // Si se desmarca, limpiar credenciales
    if (!checked) {
      clearSavedCredentials();
    }
  }, [clearSavedCredentials]);

  return {
    rememberMe,
    savedCredentials,
    hasSavedCredentials: hasSavedCredentials(),
    saveCredentials,
    clearSavedCredentials,
    getSavedCredentials,
    updateRememberMe,
    loadSavedCredentials
  };
};

