-- =====================================================
-- CORRECCIÓN URGENTE: COEURDELUKE.JS@GMAIL.COM
-- =====================================================
-- Este script corrige el nivel del usuario coeurdeluke.js@gmail.com
-- que debe ser nivel 0 (Maestro Fundador) pero aparece como nivel 1

-- =====================================================
-- PASO 1: DIAGNÓSTICO ACTUAL
-- =====================================================

-- Verificar estado actual del usuario
SELECT 
    'ESTADO ACTUAL DEL USUARIO' as section,
    id,
    email,
    nickname,
    user_level,
    referral_code,
    created_at,
    updated_at
FROM users 
WHERE email = 'coeurdeluke.js@gmail.com';

-- =====================================================
-- PASO 2: CORRECCIÓN INMEDIATA
-- =====================================================

-- Configurar coeurdeluke.js@gmail.com como Maestro Fundador (nivel 0)
UPDATE users 
SET 
    user_level = 0,
    referral_code = 'CRYPTOFORCE_LUKE',
    nickname = 'Darth Luke',
    updated_at = now()
WHERE email = 'coeurdeluke.js@gmail.com';

-- Configurar infocryptoforce@gmail.com como Maestro Fundador (nivel 0)
UPDATE users 
SET 
    user_level = 0,
    referral_code = 'CRYPTOFORCE_DARTH_NIHILUS',
    nickname = 'Darth Nihilus',
    updated_at = now()
WHERE email = 'infocryptoforce@gmail.com';

-- =====================================================
-- PASO 3: VERIFICACIÓN POST-CORRECCIÓN
-- =====================================================

-- Verificar que ambos usuarios tienen nivel 0
SELECT 
    'USUARIOS MAESTROS FUNDADORES (NIVEL 0)' as section,
    id,
    email,
    nickname,
    user_level,
    referral_code,
    created_at,
    updated_at
FROM users 
WHERE user_level = 0
ORDER BY created_at;

-- Verificar que no hay otros usuarios con nivel 0
SELECT 
    'TOTAL USUARIOS CON NIVEL 0' as section,
    COUNT(*) as total_fundadores
FROM users 
WHERE user_level = 0;

-- Mostrar todos los usuarios para verificar
SELECT 
    'TODOS LOS USUARIOS' as section,
    email,
    nickname,
    user_level,
    CASE user_level
        WHEN 0 THEN 'Maestro Fundador'
        WHEN 1 THEN 'Iniciado'
        WHEN 2 THEN 'Acólito'
        WHEN 3 THEN 'Warrior'
        WHEN 4 THEN 'Lord'
        WHEN 5 THEN 'Darth'
        WHEN 6 THEN 'Maestro'
        ELSE 'Desconocido'
    END as nivel_nombre,
    referral_code
FROM users 
ORDER BY user_level DESC, created_at;
