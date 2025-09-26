-- Script para FORZAR la corrección de Francisco como Fundador
-- Este script elimina duplicados y establece el estado correcto

-- 1. Verificar el estado antes de la corrección
SELECT 'Estado ANTES de la corrección' as check_type;
SELECT 
    id,
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    total_referrals,
    referred_by,
    created_at,
    updated_at
FROM public.users 
WHERE email = 'infocryptoforce@gmail.com'
ORDER BY created_at;

-- 2. Eliminar TODOS los registros de Francisco
DELETE FROM public.users 
WHERE email = 'infocryptoforce@gmail.com';

-- 3. Insertar Francisco como Fundador (nivel 0)
INSERT INTO public.users (
    id,
    email,
    nombre,
    apellido,
    nickname,
    movil,
    exchange,
    avatar,
    user_level,
    referral_code,
    uid,
    codigo_referido,
    referred_by,
    total_referrals,
    created_at,
    updated_at,
    birthdate,
    country,
    bio
) VALUES (
    gen_random_uuid(),
    'infocryptoforce@gmail.com',
    'Franc',
    'CryptoForce',
    'CryptoForce',
    '',
    '',
    '/images/default-avatar.png',
    0, -- Fundador
    'CRYPTOFORCE_CRYPTOFORCE',
    gen_random_uuid(),
    null,
    null, -- No referido por nadie
    0,
    NOW(),
    NOW(),
    '',
    '',
    ''
);

-- 4. Verificar el estado después de la corrección
SELECT 'Estado DESPUÉS de la corrección' as check_type;
SELECT 
    id,
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    total_referrals,
    referred_by,
    created_at,
    updated_at
FROM public.users 
WHERE email = 'infocryptoforce@gmail.com';

-- 5. Verificar todos los usuarios fundadores
SELECT 'Todos los usuarios fundadores' as check_type;
SELECT 
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    total_referrals,
    referred_by
FROM public.users 
WHERE user_level = 0
ORDER BY email;

-- 6. Verificar que no hay duplicados
SELECT 'Verificación de duplicados' as check_type;
SELECT 
    email,
    COUNT(*) as count
FROM public.users 
GROUP BY email
HAVING COUNT(*) > 1;
