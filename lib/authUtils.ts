/**
 * Utility functions for handling Supabase authentication errors
 */

export const isRefreshTokenError = (error: any): boolean => {
  if (!error || !error.message) return false;
  
  const message = error.message.toLowerCase();
  return message.includes('invalid refresh token') || 
         message.includes('refresh token not found') ||
         message.includes('refresh_token_not_found');
};

export const clearAuthStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Clear all Supabase-related storage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    console.log('🧹 Auth storage cleared');
  } catch (error) {
    console.error('Error clearing auth storage:', error);
  }
};

export const handleAuthError = (error: any): boolean => {
  if (isRefreshTokenError(error)) {
    console.log('🔄 Refresh token error detected, clearing session...');
    clearAuthStorage();
    return true; // Error was handled
  }
  return false; // Error was not handled
};
