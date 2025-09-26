-- Script para corregir el formato de todos los códigos de referido
-- Formato correcto: CRYPTOFORCE_NICKNAME (con guión bajo)

-- 1. Actualizar todos los códigos de referido para usar el formato correcto
UPDATE public.users 
SET 
    referral_code = 'CRYPTOFORCE_' || UPPER(REPLACE(REPLACE(nickname, ' ', '_'), '-', '_')),
    updated_at = NOW()
WHERE referral_code IS NOT NULL 
  AND referral_code != 'CRYPTOFORCE_' || UPPER(REPLACE(REPLACE(nickname, ' ', '_'), '-', '_'));

-- 2. Casos especiales para usuarios fundadores
UPDATE public.users 
SET 
    referral_code = 'CRYPTOFORCE_CRYPTOFORCE',
    updated_at = NOW()
WHERE email = 'infocryptoforce@gmail.com';

UPDATE public.users 
SET 
    referral_code = 'CRYPTOFORCE_DARTHLUKE',
    updated_at = NOW()
WHERE email = 'coeurdeluke.js@gmail.com';

-- 3. Verificar todos los códigos de referido
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
ORDER BY user_level, email;

-- 4. Contar usuarios por nivel
SELECT 
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
