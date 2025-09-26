-- Script de verificación final para infocryptoforce@gmail.com
-- Este script verifica que todos los cambios se hayan aplicado correctamente

-- 1. Verificar el estado de infocryptoforce@gmail.com
SELECT 
    'infocryptoforce@gmail.com Status' as check_type,
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

-- 2. Verificar que ambos fundadores tengan el mismo nivel
SELECT 
    'Fundadores Comparison' as check_type,
    email,
    nickname,
    user_level,
    referral_code,
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
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY user_level, email;

-- 3. Verificar el formato de todos los códigos de referido
SELECT 
    'Referral Codes Format Check' as check_type,
    email,
    nickname,
    referral_code,
    CASE 
        WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN 'Correct Format'
        WHEN referral_code LIKE 'CRYPTOFORCE-%' THEN 'Wrong Format (hyphen)'
        WHEN referral_code LIKE 'CRYPTOFORCE %' THEN 'Wrong Format (space)'
        ELSE 'Other Format'
    END as format_status
FROM public.users 
WHERE referral_code IS NOT NULL
ORDER BY email;

-- 4. Contar usuarios por nivel
SELECT 
    'Users by Level' as check_type,
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
    END as nivel_display,
    COUNT(*) as total_usuarios
FROM public.users 
GROUP BY user_level
ORDER BY user_level;

-- 5. Verificar que no haya usuarios con nivel 0 que no sean fundadores
SELECT 
    'Non-Founder Level 0 Check' as check_type,
    email,
    nickname,
    user_level,
    CASE 
        WHEN email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com') THEN 'Authorized Founder'
        ELSE 'Unauthorized Level 0'
    END as status
FROM public.users 
WHERE user_level = 0
ORDER BY email;
