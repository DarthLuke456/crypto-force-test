// ============================================
// FIX AVATAR STORAGE - USER-SPECIFIC
// ============================================

// Current problematic code:
// localStorage.getItem('user-avatar') // ❌ Shared across all users

// Fixed code should be:
// localStorage.getItem(`user-avatar-${userId}`) // ✅ User-specific

// Example implementation:

function getUserSpecificAvatarKey(userId) {
  return `user-avatar-${userId}`;
}

function saveUserAvatar(userId, avatarUrl) {
  const key = getUserSpecificAvatarKey(userId);
  localStorage.setItem(key, avatarUrl);
}

function loadUserAvatar(userId) {
  const key = getUserSpecificAvatarKey(userId);
  return localStorage.getItem(key);
}

// Migration function to move existing avatar to user-specific key
function migrateAvatarToUserSpecific(userId) {
  const oldAvatar = localStorage.getItem('user-avatar');
  if (oldAvatar && userId) {
    const newKey = getUserSpecificAvatarKey(userId);
    localStorage.setItem(newKey, oldAvatar);
    localStorage.removeItem('user-avatar'); // Remove old shared key
    console.log('✅ Avatar migrated to user-specific storage');
  }
}
