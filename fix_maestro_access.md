# 🔧 Fix Maestro Access Issue

## Problem Analysis
The user cannot access the Maestro dashboard. After investigation, I found several issues:

1. **Inconsistent AuthContext Usage**: Different Maestro pages were using different authentication contexts:
   - Some used `AuthContext-offline`
   - Some used `AuthContext-working` 
   - Some used `AuthContext-v2`

2. **Authentication Context Mismatch**: This caused authentication to fail because the contexts weren't synchronized.

## Solutions Applied

### 1. ✅ Fixed AuthContext Consistency
Updated all Maestro pages to use `AuthContext-offline`:
- `app/dashboard/maestro/layout-v2.tsx`
- `app/dashboard/maestro/courses/tribunal-imperial/page.tsx`
- `app/dashboard/maestro/users/page.tsx`
- `app/dashboard/maestro/dashboard-selection/page.tsx`
- `app/dashboard/maestro/courses/tribunal-imperial-simple/page.tsx`

### 2. ✅ Created Debug Tools
- `debug_maestro_access.html` - Standalone debug tool
- `app/test-auth/page.tsx` - Authentication test page

## Next Steps for User

1. **Clear Browser Data**:
   ```javascript
   // Open browser console and run:
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

2. **Test Authentication**:
   - Go to `/test-auth` to verify authentication is working
   - Check if user data is properly loaded
   - Verify Maestro access logic

3. **Login Again**:
   - Go to `/login/signin`
   - Login with `coeurdeluke.js@gmail.com`
   - Try accessing `/dashboard/maestro`

## Expected Behavior
- User should be able to access Maestro dashboard
- Authentication should be consistent across all pages
- User level 0 (Fundador) should have full access

## Debug Information
The authentication logic checks:
- Email in `MAESTRO_AUTHORIZED_EMAILS` array
- User level 0 (Fundador) or 6 (Maestro)
- Proper localStorage authentication state
