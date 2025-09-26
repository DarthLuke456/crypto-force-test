-- Script final para corregir TODOS los códigos de referido al formato correcto
-- Cambiar de CRYPTOFORCE-NICKNAME a CRYPTOFORCE_NICKNAME

-- 1. Verificar estado actual de todos los códigos
SELECT 
    'ESTADO ACTUAL' as status,
    email,
    nickname,
    referral_code,
    user_level,
    CASE 
        WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN '✅ Formato correcto'
        WHEN referral_code LIKE 'CRYPTOFORCE-%' THEN '❌ Formato incorrecto (guión)'
        ELSE '⚠️ Formato desconocido'
    END as formato_status
FROM public.users 
ORDER BY email;

-- 2. Corregir Francisco específicamente
UPDATE public.users 
SET 
    referral_code = 'CRYPTOFORCE_CRYPTOFORCE',
    updated_at = NOW()
WHERE email = 'infocryptoforce@gmail.com';

-- 3. Corregir todos los códigos que tengan guión en lugar de guión bajo
UPDATE public.users 
SET 
    referral_code = REPLACE(referral_code, 'CRYPTOFORCE-', 'CRYPTOFORCE_'),
    updated_at = NOW()
WHERE referral_code LIKE 'CRYPTOFORCE-%';

-- 4. Verificar corrección final
SELECT 
    'DESPUÉS DE CORRECCIÓN' as status,
    email,
    nickname,
    referral_code,
    user_level,
    CASE 
        WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN '✅ Formato correcto'
        WHEN referral_code LIKE 'CRYPTOFORCE-%' THEN '❌ Formato incorrecto (guión)'
        ELSE '⚠️ Formato desconocido'
    END as formato_status
FROM public.users 
ORDER BY email;

-- 5. Resumen de correcciones
SELECT 
    'RESUMEN' as tipo,
    COUNT(*) as total_usuarios,
    COUNT(CASE WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN 1 END) as formato_correcto,
    COUNT(CASE WHEN referral_code LIKE 'CRYPTOFORCE-%' THEN 1 END) as formato_incorrecto
FROM public.users;
