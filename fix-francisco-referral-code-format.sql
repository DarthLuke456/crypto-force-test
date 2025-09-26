-- Corregir el formato del código de referido de Francisco
-- Cambiar de CRYPTOFORCE-CRYPTOFORCE a CRYPTOFORCE_CRYPTOFORCE

-- 1. Verificar estado actual
SELECT 
    'ANTES DE CORRECCIÓN' as status,
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

-- 3. Verificar corrección
SELECT 
    'DESPUÉS DE CORRECCIÓN' as status,
    email,
    nickname,
    referral_code,
    user_level
FROM public.users 
WHERE email = 'infocryptoforce@gmail.com';

-- 4. Verificar todos los códigos de referido para asegurar formato consistente
SELECT 
    email,
    nickname,
    referral_code,
    CASE 
        WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN '✅ Formato correcto'
        WHEN referral_code LIKE 'CRYPTOFORCE-%' THEN '❌ Formato incorrecto (guión)'
        ELSE '⚠️ Formato desconocido'
    END as formato_status
FROM public.users 
ORDER BY email;
