-- Script para corregir el formato del código de referido de infocryptoforce@gmail.com
-- Cambiar de CRYPTOFORCE-CRYPTOFORCE a CRYPTOFORCE_CRYPTOFORCE

-- 1. Corregir el código de referido de infocryptoforce@gmail.com
UPDATE public.users 
SET 
    referral_code = 'CRYPTOFORCE_CRYPTOFORCE',  -- Formato correcto con guión bajo
    updated_at = NOW()
WHERE email = 'infocryptoforce@gmail.com';

-- 2. Verificar el resultado
SELECT 
    email,
    nickname,
    referral_code,
    user_level,
    CASE 
        WHEN user_level = 0 THEN 'Fundador'
        WHEN user_level = 1 THEN 'Iniciado'
        WHEN user_level = 2 THEN 'Acólito'
        WHEN user_level = 3 THEN 'Warrior'
        WHEN user_level = 4 THEN 'Lord'
        WHEN user_level = 5 THEN 'Darth'
        WHEN user_level = 6 THEN 'Maestro'
        ELSE 'Desconocido'
    END as nivel_display
FROM public.users 
WHERE email = 'infocryptoforce@gmail.com';

-- 3. Verificar que ambos fundadores tengan el formato correcto
SELECT 
    email,
    nickname,
    referral_code,
    CASE 
        WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN 'Formato Correcto'
        WHEN referral_code LIKE 'CRYPTOFORCE-%' THEN 'Formato Incorrecto (guión)'
        WHEN referral_code LIKE 'CRYPTOFORCE %' THEN 'Formato Incorrecto (espacio)'
        ELSE 'Otro Formato'
    END as formato_status
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY email;
