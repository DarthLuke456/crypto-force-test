# 🧹 Cleanup and Debug Plan - coeurdeluke@gmail.com

## 📋 **Step 1: Delete coeurdeluke@gmail.com User Data**

### Run these SQL queries in Supabase:

1. **`delete-coeurdeluke-user.sql`** - Delete the user from database
2. **`cleanup-coeurdeluke-complete.sql`** - Complete cleanup and verification

### Expected Result:
- ✅ `coeurdeluke@gmail.com` user deleted from database
- ✅ Only authorized users remain: `infocryptoforce@gmail.com`, `coeurdeluke.js@gmail.com`, `josefranciscocastrosias@gmail.com`

## 🔍 **Step 2: Investigate Avatar Issue**

### Run these SQL queries:

1. **`investigate-avatar-issue.sql`** - Check database structure and relationships
2. **`debug-avatar-issue.html`** - Open in browser to check localStorage

### Possible Causes of Avatar Sharing:

1. **localStorage sharing** - Both users might be using the same localStorage keys
2. **Database relationship** - Avatar might be stored globally instead of per-user
3. **Frontend caching** - Browser might be caching the same avatar
4. **AuthContext issue** - Same AuthContext instance serving both users

## 🧪 **Step 3: Test Clean Signup**

After cleanup:

1. **Clear browser data** (localStorage, sessionStorage, cookies)
2. **Create new account** with `coeurdeluke@gmail.com`
3. **Check email confirmation** works
4. **Verify avatar is unique** to this user
5. **Test dashboard access** with correct user level (Level 1 - Iniciado)

## 🔧 **Step 4: Fix Avatar Issue (if found)**

### If localStorage is the issue:
- Clear all avatar-related localStorage keys
- Ensure each user has unique avatar storage

### If database is the issue:
- Check if avatars are stored in a shared table
- Update to per-user avatar storage

### If frontend is the issue:
- Check AuthContext for shared state
- Ensure avatar state is properly isolated per user

## 📊 **Expected Results**

### After Cleanup:
- ✅ `coeurdeluke@gmail.com` completely removed
- ✅ Only 3 authorized users in database
- ✅ Clean slate for testing

### After Signup Test:
- ✅ Email confirmation works
- ✅ User gets Level 1 (Iniciado)
- ✅ Avatar is unique to this user
- ✅ No shared data between users

## 🚨 **Important Notes**

1. **Backup first** - Make sure you have a backup before deleting
2. **Test thoroughly** - Verify each step works before proceeding
3. **Check both users** - Ensure `coeurdeluke.js@gmail.com` still works correctly
4. **Monitor logs** - Watch console for any errors during testing

## 🎯 **Success Criteria**

- ✅ `coeurdeluke@gmail.com` user deleted
- ✅ Avatar sharing issue identified and fixed
- ✅ Clean signup flow works
- ✅ Both email variations work with correct user levels
- ✅ No data conflicts between users
