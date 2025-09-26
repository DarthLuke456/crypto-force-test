-- Script para corregir el formato del código de referido de Francisco
-- Cambiar de CRYPTOFORCE-CRYPTOFORCE a CRYPTOFORCE_CRYPTOFORCE

-- 1. Verificar el estado actual
SELECT 'Estado actual de Francisco' as check_type;
SELECT 
    email,
    nickname,
    referral_code,
    user_level
FROM public.users 
WHERE email = 'infocryptoforce@gmail.com';

-- 2. Corregir el formato del código de referido
UPDATE public.users 
SET 
    referral_code = 'CRYPTOFORCE_CRYPTOFORCE',
    updated_at = NOW()
WHERE email = 'infocryptoforce@gmail.com';

-- 3. Verificar la corrección
SELECT 'Estado después de la corrección' as check_type;
SELECT 
    email,
    nickname,
    referral_code,
    user_level
FROM public.users 
WHERE email = 'infocryptoforce@gmail.com';

-- 4. Verificar todos los usuarios fundadores
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
