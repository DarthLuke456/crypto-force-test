-- Script para diagnosticar por qué Francisco sigue apareciendo como Iniciado
-- Verificar el estado actual y identificar el problema

-- 1. Verificar el estado actual de Francisco
SELECT 'Estado actual de Francisco' as check_type;
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

-- 2. Verificar si hay múltiples registros para Francisco
SELECT 'Verificación de duplicados para Francisco' as check_type;
SELECT 
    id,
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    created_at,
    updated_at
FROM public.users 
WHERE email = 'infocryptoforce@gmail.com'
ORDER BY created_at;

-- 3. Verificar todos los usuarios fundadores
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

-- 4. Verificar si hay usuarios con nivel 0 pero email diferente
SELECT 'Usuarios con nivel 0' as check_type;
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

-- 5. Verificar si Francisco tiene un registro con nivel 1
SELECT 'Francisco con nivel 1' as check_type;
SELECT 
    id,
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    created_at,
    updated_at
FROM public.users 
WHERE email = 'infocryptoforce@gmail.com' AND user_level = 1;

-- 6. Contar total de registros para Francisco
SELECT 'Conteo de registros para Francisco' as check_type;
SELECT 
    email,
    COUNT(*) as total_records,
    STRING_AGG(user_level::text, ', ') as user_levels,
    STRING_AGG(id::text, ', ') as ids
FROM public.users 
WHERE email = 'infocryptoforce@gmail.com'
GROUP BY email;
