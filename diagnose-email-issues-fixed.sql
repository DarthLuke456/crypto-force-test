-- ============================================
-- DIAGNOSE EMAIL CONFIRMATION ISSUES (FIXED)
-- ============================================

-- 1. Check current users table state
SELECT 
    'CURRENT USERS' as check_type,
    email,
    user_level,
    created_at
FROM users 
ORDER BY created_at DESC;

-- 2. Check for any auth.users entries (if accessible)
-- Note: This might not work if auth schema is not accessible
SELECT 
    'AUTH USERS CHECK' as check_type,
    email,
    email_confirmed_at,
    created_at
FROM auth.users 
WHERE email IN (
    'infocryptoforce@gmail.com',
    'coeurdeluke.js@gmail.com', 
    'josefranciscocastrosias@gmail.com'
)
ORDER BY created_at DESC;

-- 3. Summary of current users table state
SELECT 
    'USERS TABLE SUMMARY' as summary,
    COUNT(*) as total_users,
    COUNT(CASE WHEN user_level = 0 THEN 1 END) as fundadores,
    COUNT(CASE WHEN user_level = 1 THEN 1 END) as iniciados,
    COUNT(CASE WHEN user_level > 1 THEN 1 END) as other_levels
FROM users;

-- 4. Check for users created recently (last 24 hours)
SELECT 
    'RECENT USERS' as check_type,
    email,
    user_level,
    created_at
FROM users 
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
