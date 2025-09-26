-- Script para corregir el problema de visualización de Francisco
-- Verificar y corregir el estado de Francisco como Fundador

-- 1. Verificar estado actual de Francisco
SELECT 
    'ESTADO ACTUAL' as status,
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

-- 2. Corregir Francisco a Fundador (nivel 0)
UPDATE public.users 
SET 
    user_level = 0,
    referral_code = 'CRYPTOFORCE_CRYPTOFORCE',
    nickname = 'CryptoForce',
    nombre = 'Franc',
    apellido = 'CryptoForce',
    referred_by = NULL,
    updated_at = NOW()
WHERE email = 'infocryptoforce@gmail.com';

-- 3. Verificar corrección
SELECT 
    'DESPUÉS DE CORRECCIÓN' as status,
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

-- 4. Verificar todos los usuarios para confirmar
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
ORDER BY user_level ASC, email ASC;
