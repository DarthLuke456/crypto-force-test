-- FORZAR ACTUALIZACIÓN INMEDIATA DE FRANCISCO
-- Este script corregirá TODOS los datos de Francisco de una vez

-- 1. Verificar estado actual ANTES de la corrección
SELECT 
    'ANTES DE CORRECCIÓN FORZADA' as status,
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

-- 2. FORZAR ACTUALIZACIÓN COMPLETA DE FRANCISCO
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

-- 3. Verificar corrección INMEDIATAMENTE
SELECT 
    'DESPUÉS DE CORRECCIÓN FORZADA' as status,
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

-- 4. Verificar que no haya usuarios duplicados
SELECT 
    'VERIFICACIÓN DE DUPLICADOS' as tipo,
    email,
    COUNT(*) as total_registros,
    STRING_AGG(id::text, ', ') as ids,
    STRING_AGG(user_level::text, ', ') as niveles
FROM public.users 
WHERE email = 'infocryptoforce@gmail.com'
GROUP BY email;

-- 5. Resumen final de ambos fundadores
SELECT 
    'RESUMEN FINAL DE FUNDADORES' as tipo,
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    CASE 
        WHEN user_level = 0 THEN '✅ Fundador'
        WHEN user_level = 1 THEN '❌ Iniciado'
        ELSE '⚠️ Otro nivel'
    END as estado_fundador,
    CASE 
        WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN '✅ Formato correcto'
        WHEN referral_code LIKE 'CRYPTOFORCE-%' THEN '❌ Formato incorrecto'
        ELSE '⚠️ Formato desconocido'
    END as formato_codigo
FROM public.users 
WHERE email IN ('infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com')
ORDER BY user_level ASC, email ASC;
