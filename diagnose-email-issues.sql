-- ============================================
-- DIAGNOSE EMAIL CONFIRMATION ISSUES
-- ============================================

-- 1. Check if there are any auth.users entries that might conflict
-- Note: This queries the auth.users table (if accessible)
SELECT 
    'AUTH USERS CHECK' as check_type,
    email,
    email_confirmed_at,
    created_at,
    last_sign_in_at
FROM auth.users 
WHERE email IN (
    'infocryptoforce@gmail.com',
    'coeurdeluke.js@gmail.com', 
    'josefranciscocastrosias@gmail.com'
)
ORDER BY created_at DESC;

-- 2. Check for any email confirmation tokens or sessions
-- Note: This queries auth sessions (if accessible)
SELECT 
    'AUTH SESSIONS CHECK' as check_type,
    user_id,
    created_at,
    updated_at
FROM auth.sessions 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email IN (
        'infocryptoforce@gmail.com',
        'coeurdeluke.js@gmail.com', 
        'josefranciscocastrosias@gmail.com'
    )
)
ORDER BY created_at DESC;

-- 3. Check for any email confirmation attempts
-- Note: This queries auth confirmations (if accessible)
SELECT 
    'AUTH CONFIRMATIONS CHECK' as check_type,
    user_id,
    email,
    token_hash,
    created_at,
    confirmed_at
FROM auth.email_confirmations 
WHERE email IN (
    'infocryptoforce@gmail.com',
    'coeurdeluke.js@gmail.com', 
    'josefranciscocastrosias@gmail.com'
)
ORDER BY created_at DESC;

-- 4. Summary of current users table state
SELECT 
    'USERS TABLE SUMMARY' as summary,
    COUNT(*) as total_users,
    COUNT(CASE WHEN user_level = 0 THEN 1 END) as fundadores,
    COUNT(CASE WHEN user_level = 1 THEN 1 END) as iniciados,
    COUNT(CASE WHEN user_level > 1 THEN 1 END) as other_levels
FROM users;
