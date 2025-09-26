-- CORRECCIÓN INMEDIATA DE FRANCISCO
-- Este script corregirá todos los datos de Francisco de una vez

-- 1. Verificar estado actual
SELECT 
    'ANTES DE CORRECCIÓN' as status,
    id,
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    total_referrals,
    referred_by,
    updated_at
FROM public.users 
WHERE email = 'infocryptoforce@gmail.com';

-- 2. CORREGIR FRANCISCO COMPLETAMENTE
UPDATE public.users 
SET 
    user_level = 0,                           -- Fundador
    referral_code = 'CRYPTOFORCE_CRYPTOFORCE', -- Formato correcto
    nickname = 'CryptoForce',                 -- Nickname correcto
    nombre = 'Franc',                         -- Nombre correcto
    apellido = 'CryptoForce',                 -- Apellido correcto
    referred_by = NULL,                       -- Sin referidor (es fundador)
    updated_at = NOW()
WHERE email = 'infocryptoforce@gmail.com';

-- 3. Verificar corrección
SELECT 
    'DESPUÉS DE CORRECCIÓN' as status,
    id,
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    total_referrals,
    referred_by,
    updated_at
FROM public.users 
WHERE email = 'infocryptoforce@gmail.com';

-- 4. Verificar que Lucas siga correcto
SELECT 
    'VERIFICACIÓN LUCAS' as status,
    id,
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    total_referrals,
    referred_by,
    updated_at
FROM public.users 
WHERE email = 'coeurdeluke.js@gmail.com';

-- 5. Resumen final
SELECT 
    'RESUMEN FINAL' as tipo,
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    CASE 
        WHEN user_level = 0 THEN '✅ Fundador'
        WHEN user_level = 1 THEN '❌ Iniciado'
        ELSE '⚠️ Otro nivel'
    END as estado_fundador,
    referral_code,
    CASE 
        WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN '✅ Formato correcto'
        WHEN referral_code LIKE 'CRYPTOFORCE-%' THEN '❌ Formato incorrecto'
        ELSE '⚠️ Formato desconocido'
    END as formato_codigo
FROM public.users 
WHERE email IN ('infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com')
ORDER BY user_level ASC;
