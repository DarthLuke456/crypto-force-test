# 🔧 Avatar Fix Plan - User-Specific Storage

## 🔍 **Problem Identified**

The avatar sharing issue is caused by **shared localStorage**:
- ❌ All users use the same `localStorage.getItem('user-avatar')` key
- ❌ When one user changes avatar, it affects all users
- ❌ No user-specific avatar storage

## 🛠️ **Solution: User-Specific Avatar Storage**

### **Current Code (Problematic):**
```javascript
// ❌ Shared across all users
localStorage.getItem('user-avatar')
localStorage.setItem('user-avatar', avatarUrl)
```

### **Fixed Code (User-Specific):**
```javascript
// ✅ User-specific storage
const userAvatarKey = `user-avatar-${userId}`;
localStorage.getItem(userAvatarKey)
localStorage.setItem(userAvatarKey, avatarUrl)
```

## 📋 **Files to Update**

### 1. **Avatar Hooks**
- `hooks/useAvatarStable.ts` → Update to use user-specific keys
- `hooks/useAvatarSimple.ts` → Update to use user-specific keys
- `hooks/useAvatar.ts` → Update to use user-specific keys

### 2. **Components Using Avatars**
- `components/profile/ProfileContent.tsx` → Pass userId to avatar functions
- `app/login/dashboard-selection/page.tsx` → Pass userId to avatar functions

### 3. **Migration Strategy**
- Detect existing shared avatar
- Migrate to user-specific storage
- Remove old shared avatar key

## 🔧 **Implementation Steps**

### **Step 1: Update Avatar Hooks**
```typescript
// Before (shared)
const storedAvatar = localStorage.getItem('user-avatar');

// After (user-specific)
const getUserAvatarKey = (userId: string) => `user-avatar-${userId}`;
const storedAvatar = localStorage.getItem(getUserAvatarKey(userId));
```

### **Step 2: Update Components**
```typescript
// Before
const { avatar, changeAvatar } = useAvatar();

// After
const { avatar, changeAvatar } = useAvatar();
changeAvatar(userData.id, newAvatarUrl);
```

### **Step 3: Add Migration Logic**
```typescript
// Migrate existing shared avatar to user-specific
const migrateAvatar = (userId: string) => {
  const oldAvatar = localStorage.getItem('user-avatar');
  if (oldAvatar && userId) {
    const newKey = `user-avatar-${userId}`;
    localStorage.setItem(newKey, oldAvatar);
    localStorage.removeItem('user-avatar');
  }
};
```

## ✅ **Expected Results**

After implementing the fix:

1. **✅ Each user has unique avatar** - No more sharing
2. **✅ Avatar persists per user** - User-specific storage
3. **✅ No conflicts between users** - Isolated storage
4. **✅ Migration handles existing data** - Smooth transition

## 🧪 **Testing Plan**

1. **Test with coeurdeluke.js@gmail.com** - Verify avatar works
2. **Create coeurdeluke@gmail.com account** - Verify unique avatar
3. **Switch between users** - Verify avatars don't interfere
4. **Test avatar changes** - Verify changes are user-specific

## 🚨 **Important Notes**

- **Backup localStorage** before making changes
- **Test thoroughly** with both user accounts
- **Ensure migration** handles existing avatars
- **Verify no data loss** during transition
