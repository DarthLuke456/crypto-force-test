-- Script para verificar el estado final de Francisco
-- Después de ejecutar safe-fix-francisco.sql

-- 1. Verificar el estado actual de Francisco
SELECT 'Estado FINAL de Francisco' as check_type;
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

-- 3. Verificar usuarios que referencian a Francisco
SELECT 'Usuarios que referencian a Francisco' as check_type;
SELECT 
    id,
    email,
    nombre,
    apellido,
    nickname,
    referred_by,
    user_level
FROM public.users 
WHERE referred_by = 'e008315b-c159-4543-85e7-f8915f109e08';

-- 4. Verificar que no hay duplicados
SELECT 'Verificación de duplicados' as check_type;
SELECT 
    email,
    COUNT(*) as count
FROM public.users 
GROUP BY email
HAVING COUNT(*) > 1;

-- 5. Resumen de todos los usuarios
SELECT 'Resumen de todos los usuarios' as check_type;
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
ORDER BY user_level DESC, email;
