'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Global cache for avatar with cleanup
let globalAvatarCache: string | null = null;
let isInitialized = false;
let avatarListeners = new Set<(avatar: string | null) => void>();

// Utility functions
const saveAvatarToStorage = (avatar: string | null) => {
  if (typeof window !== 'undefined') {
    if (avatar) {
      localStorage.setItem('user-avatar', avatar);
    } else {
      localStorage.removeItem('user-avatar');
    }
  }
};

const loadAvatarFromStorage = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user-avatar');
  }
  return null;
};

// Image compression utility
const compressImage = (base64: string, maxSizeKB: number = 25): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate new dimensions (max 150x150)
      const maxSize = 150;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Try different quality levels
      let quality = 0.8;
      let compressed = canvas.toDataURL('image/jpeg', quality);
      
      // If still too large, reduce quality
      while (compressed.length > maxSizeKB * 1024 && quality > 0.1) {
        quality -= 0.1;
        compressed = canvas.toDataURL('image/jpeg', quality);
      }
      
      resolve(compressed);
    };
    img.src = base64;
  });
};

// Cleanup old avatar from database
const cleanupOldAvatar = async (userEmail: string, newAvatar: string) => {
  try {
    console.log('🧹 useAvatarOptimized: Cleaning up old avatar...');
    
    // Get current avatar from database
    const { data: currentUser } = await supabase
      .from('users')
      .select('avatar')
      .eq('email', userEmail)
      .single();
    
    if (currentUser?.avatar && currentUser.avatar !== newAvatar) {
      console.log('🧹 useAvatarOptimized: Found old avatar, will be replaced');
      // The old avatar will be automatically replaced when we update
      // No need to manually delete since we're storing in the same field
    }
  } catch (error) {
    console.warn('⚠️ useAvatarOptimized: Could not cleanup old avatar:', error);
  }
};

export function useAvatarOptimized() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout>();

  const updateAvatar = useCallback((newAvatar: string | null) => {
    console.log('🔄 useAvatarOptimized: Updating avatar:', newAvatar ? 'Present' : 'Null');
    globalAvatarCache = newAvatar;
    saveAvatarToStorage(newAvatar);
    setAvatar(newAvatar);
    
    // Notify all listeners
    avatarListeners.forEach(listener => listener(newAvatar));
    
    // Dispatch global event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('avatarChanged', { 
        detail: { avatar: newAvatar } 
      }));
    }
  }, []);

  const loadAvatarFromDatabase = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.log('🔍 useAvatarOptimized: No session, setting avatar to null');
        updateAvatar(null);
        return;
      }

      console.log('🔍 useAvatarOptimized: Loading avatar from database for user:', session.user.email);
      
      const { data: profile, error } = await supabase
        .from('users')
        .select('avatar')
        .eq('email', session.user.email)
        .single();

      if (error) {
        console.error('❌ useAvatarOptimized: Error loading avatar from database:', error);
        return;
      }

      const avatarUrl = profile?.avatar || null;
      console.log('🔍 useAvatarOptimized: Avatar from database:', avatarUrl ? 'Present' : 'Null');
      
      // Check if there's a more recent avatar in localStorage
      const storedAvatar = loadAvatarFromStorage();
      if (storedAvatar && storedAvatar !== avatarUrl) {
        console.log('🔄 useAvatarOptimized: Using cached avatar (more recent)');
        updateAvatar(storedAvatar);
      } else {
        console.log('🔄 useAvatarOptimized: Using database avatar');
        updateAvatar(avatarUrl);
      }
    } catch (error) {
      console.error('❌ useAvatarOptimized: Error loading avatar:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, updateAvatar]);

  const changeAvatar = useCallback(async (newAvatar: string | null) => {
    if (!newAvatar) return;

    try {
      console.log('🔄 useAvatarOptimized: Changing avatar...');
      
      // Clear any pending cleanup
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
      
      // Compress image first
      setIsCompressing(true);
      console.log('🔄 useAvatarOptimized: Compressing image...');
      const compressedAvatar = await compressImage(newAvatar);
      console.log('🔄 useAvatarOptimized: Image compressed, size:', Math.round(compressedAvatar.length / 1024), 'KB');
      setIsCompressing(false);
      
      // Update local state immediately for visual feedback
      updateAvatar(compressedAvatar);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error('No active session');
      }

      console.log('🔄 useAvatarOptimized: Updating avatar in database...');
      
      // Cleanup old avatar before updating
      await cleanupOldAvatar(session.session.user.email, compressedAvatar);
      
      // Update in database
      const { error } = await supabase
        .from('users')
        .update({ 
          avatar: compressedAvatar,
          updated_at: new Date().toISOString()
        })
        .eq('email', session.session.user.email);

      if (error) {
        console.error('❌ useAvatarOptimized: Error updating avatar in database:', error);
        throw new Error(`Error updating avatar: ${error.message}`);
      }

      console.log('✅ useAvatarOptimized: Avatar updated in database successfully');
      
      // Confirm the avatar is saved
      updateAvatar(compressedAvatar);
      
      // Schedule cleanup of old avatar data from localStorage
      cleanupTimeoutRef.current = setTimeout(() => {
        console.log('🧹 useAvatarOptimized: Cleaning up old avatar data from localStorage');
        // Keep only the current avatar in localStorage
        saveAvatarToStorage(compressedAvatar);
      }, 1000);
      
    } catch (error) {
      console.error('❌ useAvatarOptimized: Error changing avatar:', error);
      // Revert to previous avatar on error
      const storedAvatar = loadAvatarFromStorage();
      updateAvatar(storedAvatar);
      throw error;
    } finally {
      setIsCompressing(false);
    }
  }, [updateAvatar]);

  const refreshAvatar = useCallback(async () => {
    console.log('🔄 useAvatarOptimized: Refreshing avatar...');
    globalAvatarCache = null;
    await loadAvatarFromDatabase();
  }, [loadAvatarFromDatabase]);

  const forceUpdate = useCallback(() => {
    console.log('🔄 useAvatarOptimized: Force updating avatar...');
    const storedAvatar = loadAvatarFromStorage();
    updateAvatar(storedAvatar);
  }, [updateAvatar]);

  // Initialize avatar
  useEffect(() => {
    const listener = (newAvatar: string | null) => {
      setAvatar(newAvatar);
    };

    avatarListeners.add(listener);

    // Initialize from cache if available
    if (!isInitialized) {
      const storedAvatar = loadAvatarFromStorage();
      if (storedAvatar) {
        console.log('🔄 useAvatarOptimized: Initializing from cache');
        globalAvatarCache = storedAvatar;
        setAvatar(storedAvatar);
      } else {
        console.log('🔄 useAvatarOptimized: No cache, loading from database');
        loadAvatarFromDatabase();
      }
      isInitialized = true;
    } else if (globalAvatarCache) {
      console.log('🔄 useAvatarOptimized: Using global cache');
      setAvatar(globalAvatarCache);
    }

    return () => {
      avatarListeners.delete(listener);
    };
  }, [loadAvatarFromDatabase]);

  // Handle storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user-avatar') {
        const newAvatar = e.newValue && e.newValue !== 'null' ? e.newValue : null;
        console.log('🔄 useAvatarOptimized: Storage changed, updating avatar');
        updateAvatar(newAvatar);
      }
    };

    const handleAvatarChanged = (event: CustomEvent) => {
      const newAvatar = event.detail.avatar;
      console.log('🔄 useAvatarOptimized: Avatar changed event received');
      updateAvatar(newAvatar);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && !globalAvatarCache) {
        console.log('🔄 useAvatarOptimized: Page visible, refreshing avatar');
        setTimeout(refreshAvatar, 500);
      }
    };

    // Event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('avatarChanged', handleAvatarChanged as EventListener);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('avatarChanged', handleAvatarChanged as EventListener);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updateAvatar, refreshAvatar]);

  // Handle auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('🔄 useAvatarOptimized: User signed in, loading avatar');
        setTimeout(loadAvatarFromDatabase, 500);
      } else if (event === 'SIGNED_OUT') {
        console.log('🔄 useAvatarOptimized: User signed out, clearing avatar');
        updateAvatar(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadAvatarFromDatabase, updateAvatar]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
    };
  }, []);

  return {
    avatar,
    isLoading: isLoading || isCompressing,
    changeAvatar,
    refreshAvatar,
    forceUpdate,
    reloadAvatar: refreshAvatar
  };
}
