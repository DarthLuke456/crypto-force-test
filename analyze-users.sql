-- ============================================
-- ANALYZE USERS TABLE - CRYPTO FORCE
-- ============================================

-- 1. Check total number of users
SELECT COUNT(*) as total_users FROM users;

-- 2. List all users with their details
SELECT 
    id,
    email,
    uid,
    nickname,
    user_level,
    referral_code,
    codigo_referido,
    referred_by,
    total_referrals,
    created_at,
    updated_at
FROM users 
ORDER BY created_at DESC;

-- 3. Check for duplicate emails
SELECT 
    email, 
    COUNT(*) as count
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- 4. Check for users with specific authorized emails
SELECT 
    email,
    user_level,
    created_at
FROM users 
WHERE email IN (
    'infocryptoforce@gmail.com',
    'coeurdeluke.js@gmail.com', 
    'josefranciscocastrosias@gmail.com'
)
ORDER BY email;

-- 5. Check for test users (emails containing test, temp, etc.)
SELECT 
    email,
    user_level,
    created_at
FROM users 
WHERE email LIKE '%test%' 
   OR email LIKE '%temp%'
   OR email LIKE '%kuro%'
   OR email LIKE '%darth%'
ORDER BY created_at DESC;

-- 6. Check user levels distribution
SELECT 
    user_level,
    COUNT(*) as count
FROM users 
GROUP BY user_level 
ORDER BY user_level;

-- 7. Check for users created in the last 24 hours
SELECT 
    email,
    user_level,
    created_at
FROM users 
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
