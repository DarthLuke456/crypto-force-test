-- Script para corregir el estado de Francisco como Fundador
-- y verificar todos los usuarios fundadores

-- 1. Verificar el estado actual de Francisco
SELECT 'Estado actual de Francisco' as check_type;
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
WHERE email = 'infocryptoforce@gmail.com';

-- 2. Verificar todos los usuarios fundadores
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

-- 3. Corregir Francisco como Fundador (nivel 0)
UPDATE public.users 
SET 
    user_level = 0,
    referral_code = 'CRYPTOFORCE_CRYPTOFORCE',
    nickname = 'CryptoForce',
    nombre = 'Franc',
    apellido = 'CryptoForce',
    referred_by = NULL
WHERE email = 'infocryptoforce@gmail.com';

-- 4. Verificar la corrección
SELECT 'Estado después de la corrección' as check_type;
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
WHERE email = 'infocryptoforce@gmail.com';

-- 5. Verificar todos los usuarios fundadores después de la corrección
SELECT 'Usuarios fundadores después de la corrección' as check_type;
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

-- 6. Verificar que no hay usuarios duplicados
SELECT 'Verificación de usuarios duplicados' as check_type;
SELECT 
    email,
    COUNT(*) as count
FROM public.users 
GROUP BY email
HAVING COUNT(*) > 1;
