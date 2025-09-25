-- ============================================
-- FIX COEURDELUKE@GMAIL.COM USER DATA
-- ============================================

-- 1. First, check if the user exists
SELECT 
    'BEFORE FIX - USER CHECK' as status,
    id,
    email,
    uid,
    nickname,
    user_level,
    created_at
FROM users 
WHERE email = 'coeurdeluke@gmail.com';

-- 2. Delete any existing coeurdeluke@gmail.com user to start fresh
DELETE FROM users 
WHERE email = 'coeurdeluke@gmail.com';

-- 3. Insert the user with correct data
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

-- 4. Verify the fix
SELECT 
    'AFTER FIX - USER VERIFICATION' as status,
    id,
    email,
    uid,
    nickname,
    user_level,
    referral_code,
    created_at
FROM users 
WHERE email = 'coeurdeluke@gmail.com';

-- 5. Check final user count
SELECT COUNT(*) as total_users FROM users;
