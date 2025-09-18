-- Script para corregir el nivel de Darth Nihilus a Maestro
-- Ejecutar en Supabase SQL Editor

-- Verificar el estado actual
SELECT 
    nickname,
    email,
    user_level,
    CASE 
        WHEN user_level = 0 THEN 'Maestro'
        WHEN user_level = 1 THEN 'Iniciado'
        WHEN user_level = 2 THEN 'Acólito'
        WHEN user_level = 3 THEN 'Warrior'
        WHEN user_level = 4 THEN 'Lord'
        WHEN user_level = 5 THEN 'Darth'
        ELSE 'Desconocido'
    END as nivel_texto
FROM users 
WHERE email = 'infocryptoforce@gmail.com' OR nickname = 'Darth_Nihilus';

-- Actualizar Darth Nihilus a nivel Maestro (0)
UPDATE users 
SET user_level = 0 
WHERE email = 'infocryptoforce@gmail.com' AND nickname = 'Darth_Nihilus';

-- Verificar el cambio
SELECT 
    nickname,
    email,
    user_level,
    CASE 
        WHEN user_level = 0 THEN 'Maestro'
        WHEN user_level = 1 THEN 'Iniciado'
        WHEN user_level = 2 THEN 'Acólito'
        WHEN user_level = 3 THEN 'Warrior'
        WHEN user_level = 4 THEN 'Lord'
        WHEN user_level = 5 THEN 'Darth'
        ELSE 'Desconocido'
    END as nivel_texto
FROM users 
WHERE email = 'infocryptoforce@gmail.com' OR nickname = 'Darth_Nihilus';

-- Verificar que ambos fundadores tengan nivel 0
SELECT 
    nickname,
    email,
    user_level,
    CASE 
        WHEN user_level = 0 THEN 'Maestro'
        WHEN user_level = 1 THEN 'Iniciado'
        WHEN user_level = 2 THEN 'Acólito'
        WHEN user_level = 3 THEN 'Warrior'
        WHEN user_level = 4 THEN 'Lord'
        WHEN user_level = 5 THEN 'Darth'
        ELSE 'Desconocido'
    END as nivel_texto
FROM users 
WHERE user_level = 0;
