-- ============================================
-- SETUP AUTHORIZED USERS - CRYPTO FORCE
-- ============================================

-- 1. First, delete any existing entries for these emails to avoid conflicts
DELETE FROM users 
WHERE email IN (
    'infocryptoforce@gmail.com',
    'coeurdeluke.js@gmail.com', 
    'josefranciscocastrosias@gmail.com'
);

-- 2. Insert infocryptoforce@gmail.com (Fundador - Level 0)
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
    'infocryptoforce@gmail.com',
    gen_random_uuid(),
    'CryptoForce',
    'Crypto',
    'Force',
    0, -- Fundador level
    'CRYPTOFORCE-FUNDADOR',
    NULL,
    NULL,
    0,
    NOW(),
    NOW()
);

-- 3. Insert coeurdeluke.js@gmail.com (Fundador - Level 0)
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
    'coeurdeluke.js@gmail.com',
    gen_random_uuid(),
    'DarthLuke',
    'Luke',
    'Coeur',
    0, -- Fundador level
    'CRYPTOFORCE-DARTHLUKE',
    NULL,
    NULL,
    0,
    NOW(),
    NOW()
);

-- 4. Insert josefranciscocastrosias@gmail.com (Iniciado - Level 1)
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
    'josefranciscocastrosias@gmail.com',
    gen_random_uuid(),
    'JoseFrancisco',
    'Jose',
    'Francisco',
    1, -- Iniciado level
    'CRYPTOFORCE-JOSEFRANCISCO',
    NULL,
    NULL,
    0,
    NOW(),
    NOW()
);

-- 5. Verify the setup
SELECT 
    'AUTHORIZED USERS SETUP' as status,
    email,
    nickname,
    user_level,
    referral_code,
    created_at
FROM users 
WHERE email IN (
    'infocryptoforce@gmail.com',
    'coeurdeluke.js@gmail.com', 
    'josefranciscocastrosias@gmail.com'
)
ORDER BY user_level, email;
