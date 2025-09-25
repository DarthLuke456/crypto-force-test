-- ============================================
-- COMPLETE CLEANUP OF COEURDELUKE@GMAIL.COM
-- ============================================

-- 1. Show current state before cleanup
SELECT 
    'BEFORE CLEANUP' as status,
    email,
    user_level,
    nickname,
    created_at
FROM users 
WHERE email IN ('coeurdeluke@gmail.com', 'coeurdeluke.js@gmail.com')
ORDER BY email;

-- 2. Delete coeurdeluke@gmail.com user
DELETE FROM users 
WHERE email = 'coeurdeluke@gmail.com';

-- 3. Verify deletion
SELECT 
    'AFTER CLEANUP' as status,
    email,
    user_level,
    nickname,
    created_at
FROM users 
ORDER BY email;

-- 4. Check for any remaining references
SELECT 
    'REMAINING USERS COUNT' as check_type,
    COUNT(*) as total_users
FROM users;

-- 5. Show final authorized users only
SELECT 
    'AUTHORIZED USERS ONLY' as status,
    email,
    user_level,
    nickname,
    created_at
FROM users 
WHERE email IN ('infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com', 'josefranciscocastrosias@gmail.com')
ORDER BY user_level, email;
