'use client';

import { useState, useEffect, useCallback } from 'react';

// User-specific avatar storage to prevent sharing between users
export function useAvatarFixed() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get user-specific avatar key
  const getUserAvatarKey = (userId: string) => `user-avatar-${userId}`;

  // Load avatar from user-specific storage
  const loadUserAvatar = useCallback((userId: string) => {
    if (typeof window !== 'undefined' && userId) {
      const key = getUserAvatarKey(userId);
      const storedAvatar = localStorage.getItem(key);
      
      if (storedAvatar) {
        setAvatar(storedAvatar);
        console.log('✅ useAvatarFixed: Avatar loaded for user:', userId);
        return storedAvatar;
      } else {
        // Set default avatar for this user
        const defaultAvatar = '/images/default-avatar.png';
        localStorage.setItem(key, defaultAvatar);
        setAvatar(defaultAvatar);
        console.log('✅ useAvatarFixed: Default avatar set for user:', userId);
        return defaultAvatar;
      }
    }
    return null;
  }, []);

  // Save avatar to user-specific storage
  const saveUserAvatar = useCallback((userId: string, avatarUrl: string) => {
    if (typeof window !== 'undefined' && userId) {
      const key = getUserAvatarKey(userId);
      localStorage.setItem(key, avatarUrl);
      setAvatar(avatarUrl);
      console.log('✅ useAvatarFixed: Avatar saved for user:', userId);
    }
  }, []);

  // Change avatar for specific user
  const changeAvatar = useCallback(async (userId: string, newAvatar: string | null) => {
    if (!newAvatar || !userId) return;

    try {
      setIsLoading(true);
      
      // Save to user-specific storage
      saveUserAvatar(userId, newAvatar);
      
      // Simulate success
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error changing avatar:', error);
      setIsLoading(false);
      throw error;
    }
  }, [saveUserAvatar]);

  // Force update avatar for specific user
  const forceUpdate = useCallback((userId: string) => {
    if (typeof window !== 'undefined' && userId) {
      const key = getUserAvatarKey(userId);
      const storedAvatar = localStorage.getItem(key);
      setAvatar(storedAvatar);
    }
  }, []);

  // Migrate old shared avatar to user-specific storage
  const migrateOldAvatar = useCallback((userId: string) => {
    if (typeof window !== 'undefined' && userId) {
      const oldAvatar = localStorage.getItem('user-avatar');
      if (oldAvatar) {
        const newKey = getUserAvatarKey(userId);
        localStorage.setItem(newKey, oldAvatar);
        localStorage.removeItem('user-avatar'); // Remove old shared key
        setAvatar(oldAvatar);
        console.log('✅ useAvatarFixed: Migrated old avatar to user-specific storage');
      }
    }
  }, []);

  return {
    avatar,
    isLoading,
    loadUserAvatar,
    saveUserAvatar,
    changeAvatar,
    forceUpdate,
    migrateOldAvatar
  };
}
