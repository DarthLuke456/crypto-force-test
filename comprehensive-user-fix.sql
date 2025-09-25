-- ============================================
-- COMPREHENSIVE USER FIX - COEURDELUKE@GMAIL.COM
-- ============================================

-- 1. Check current state
SELECT 
    'CURRENT STATE CHECK' as status,
    COUNT(*) as total_users,
    COUNT(CASE WHEN email = 'coeurdeluke@gmail.com' THEN 1 END) as coeurdeluke_count,
    COUNT(CASE WHEN email = 'coeurdeluke.js@gmail.com' THEN 1 END) as coeurdeluke_js_count
FROM users;

-- 2. Show all current users
SELECT 
    'ALL CURRENT USERS' as status,
    id,
    email,
    uid,
    nickname,
    user_level,
    created_at
FROM users 
ORDER BY created_at DESC;

-- 3. Clean up any problematic coeurdeluke@gmail.com entries
DELETE FROM users 
WHERE email = 'coeurdeluke@gmail.com';

-- 4. Create the user with proper data structure
INSERT INTO users (
    email,
    uid,
    nickname,
    nombre,
    apellido,
    user_level,
    referral_code,
    codigo_referido,
    referred_by,
    total_referrals,
    created_at,
    updated_at
) VALUES (
    'coeurdeluke@gmail.com',
    gen_random_uuid(),
    'El Kuku',
    'Luke',
    'Rodriguez',
    1, -- Iniciado level (Level 1)
    'USER-409c36e2',
    NULL,
    NULL,
    0,
    NOW(),
    NOW()
);

-- 5. Verify the user was created correctly
SELECT 
    'VERIFICATION - NEW USER' as status,
    id,
    email,
    uid,
    nickname,
    nombre,
    apellido,
    user_level,
    referral_code,
    created_at
FROM users 
WHERE email = 'coeurdeluke@gmail.com';

-- 6. Final user count
SELECT 
    'FINAL USER COUNT' as status,
    COUNT(*) as total_users
FROM users;

-- 7. Show all users for final verification
SELECT 
    'FINAL USER LIST' as status,
    email,
    nickname,
    user_level,
    created_at
FROM users 
ORDER BY user_level, email;
