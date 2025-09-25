-- ============================================
-- INVESTIGATE USER DATA MISMATCH
-- ============================================

-- 1. Check current users in database
SELECT 
    'CURRENT USERS IN DATABASE' as check_type,
    id,
    email,
    uid,
    nickname,
    user_level,
    created_at,
    updated_at
FROM users 
ORDER BY created_at DESC;

-- 2. Check for coeurdeluke@gmail.com specifically
SELECT 
    'COEURDELUKE@GMAIL.COM CHECK' as check_type,
    id,
    email,
    uid,
    nickname,
    user_level,
    created_at,
    updated_at
FROM users 
WHERE email = 'coeurdeluke@gmail.com';

-- 3. Check for any users with similar emails
SELECT 
    'SIMILAR EMAILS CHECK' as check_type,
    id,
    email,
    uid,
    nickname,
    user_level,
    created_at
FROM users 
WHERE email LIKE '%coeurdeluke%'
ORDER BY created_at DESC;

-- 4. Check for any users created recently (last 24 hours)
SELECT 
    'RECENT USERS' as check_type,
    id,
    email,
    uid,
    nickname,
    user_level,
    created_at
FROM users 
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- 5. Check for any duplicate UIDs
SELECT 
    'DUPLICATE UIDS CHECK' as check_type,
    uid,
    COUNT(*) as count,
    STRING_AGG(email, ', ') as emails
FROM users 
GROUP BY uid 
HAVING COUNT(*) > 1;

-- 6. Check for any users with missing required fields
SELECT 
    'MISSING FIELDS CHECK' as check_type,
    id,
    email,
    uid,
    CASE 
        WHEN nickname IS NULL OR nickname = '' THEN 'Missing nickname'
        WHEN user_level IS NULL THEN 'Missing user_level'
        WHEN referral_code IS NULL OR referral_code = '' THEN 'Missing referral_code'
        ELSE 'OK'
    END as missing_fields
FROM users 
WHERE nickname IS NULL OR nickname = '' 
   OR user_level IS NULL 
   OR referral_code IS NULL OR referral_code = '';
