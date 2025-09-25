'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Global cache for avatar
let globalAvatarCache: string | null = null;
let isInitialized = false;

// Listeners for avatar changes
const avatarListeners = new Set<(avatar: string | null) => void>();

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

const notifyAvatarChange = (avatar: string | null) => {
  // Notify all listeners
  avatarListeners.forEach(listener => listener(avatar));
  
  // Dispatch global event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('avatarChanged', { 
      detail: { avatar } 
    }));
  }
};

export function useAvatarUnified() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateAvatar = useCallback((newAvatar: string | null) => {
    console.log('🔄 useAvatarUnified: Updating avatar:', newAvatar ? 'Present' : 'Null');
    globalAvatarCache = newAvatar;
    saveAvatarToStorage(newAvatar);
    setAvatar(newAvatar);
    notifyAvatarChange(newAvatar);
  }, []);

  const loadAvatarFromDatabase = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.log('🔍 useAvatarUnified: No session, setting avatar to null');
        updateAvatar(null);
        return;
      }

      console.log('🔍 useAvatarUnified: Loading avatar from database for user:', session.user.email);
      
      const { data: profile, error } = await supabase
        .from('users')
        .select('avatar')
        .eq('email', session.user.email)
        .single();

      if (error) {
        console.error('❌ useAvatarUnified: Error loading avatar from database:', error);
        return;
      }

      const avatarUrl = profile?.avatar || null;
      console.log('🔍 useAvatarUnified: Avatar from database:', avatarUrl ? 'Present' : 'Null');
      
      // Check if there's a more recent avatar in localStorage
      const storedAvatar = loadAvatarFromStorage();
      if (storedAvatar && storedAvatar !== avatarUrl) {
        console.log('🔄 useAvatarUnified: Using cached avatar (more recent)');
        updateAvatar(storedAvatar);
      } else {
        console.log('🔄 useAvatarUnified: Using database avatar');
        updateAvatar(avatarUrl);
      }
    } catch (error) {
      console.error('❌ useAvatarUnified: Error loading avatar:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, updateAvatar]);

  const changeAvatar = useCallback(async (newAvatar: string | null) => {
    if (!newAvatar) return;

    try {
      console.log('🔄 useAvatarUnified: Changing avatar...');
      
      // Update local state immediately for visual feedback
      updateAvatar(newAvatar);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error('No active session');
      }

      console.log('🔄 useAvatarUnified: Updating avatar in database...');
      
      // Update in database
      const { error } = await supabase
        .from('users')
        .update({ 
          avatar: newAvatar,
          updated_at: new Date().toISOString()
        })
        .eq('email', session.session.user.email);

      if (error) {
        console.error('❌ useAvatarUnified: Error updating avatar in database:', error);
        throw new Error(`Error updating avatar: ${error.message}`);
      }

      console.log('✅ useAvatarUnified: Avatar updated in database successfully');
      
      // Confirm the avatar is saved
      updateAvatar(newAvatar);
      
    } catch (error) {
      console.error('❌ useAvatarUnified: Error changing avatar:', error);
      // Revert to previous avatar on error
      const storedAvatar = loadAvatarFromStorage();
      updateAvatar(storedAvatar);
      throw error;
    }
  }, [updateAvatar]);

  const refreshAvatar = useCallback(async () => {
    console.log('🔄 useAvatarUnified: Refreshing avatar...');
    globalAvatarCache = null;
    await loadAvatarFromDatabase();
  }, [loadAvatarFromDatabase]);

  const forceUpdate = useCallback(() => {
    console.log('🔄 useAvatarUnified: Force updating avatar...');
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
        console.log('🔄 useAvatarUnified: Initializing from cache');
        globalAvatarCache = storedAvatar;
        setAvatar(storedAvatar);
      } else {
        console.log('🔄 useAvatarUnified: No cache, loading from database');
        loadAvatarFromDatabase();
      }
      isInitialized = true;
    } else if (globalAvatarCache) {
      console.log('🔄 useAvatarUnified: Using global cache');
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
        console.log('🔄 useAvatarUnified: Storage changed, updating avatar');
        updateAvatar(newAvatar);
      }
    };

    const handleAvatarChanged = (event: CustomEvent) => {
      const newAvatar = event.detail.avatar;
      console.log('🔄 useAvatarUnified: Avatar changed event received');
      updateAvatar(newAvatar);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && !globalAvatarCache) {
        console.log('🔄 useAvatarUnified: Page visible, refreshing avatar');
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
        console.log('🔄 useAvatarUnified: User signed in, loading avatar');
        setTimeout(loadAvatarFromDatabase, 500);
      } else if (event === 'SIGNED_OUT') {
        console.log('🔄 useAvatarUnified: User signed out, clearing avatar');
        updateAvatar(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadAvatarFromDatabase, updateAvatar]);

  return {
    avatar,
    isLoading,
    changeAvatar,
    refreshAvatar,
    forceUpdate,
    reloadAvatar: refreshAvatar
  };
}
