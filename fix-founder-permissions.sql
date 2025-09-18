-- =====================================================
-- CORRECCIÓN DE PERMISOS DE USUARIO FUNDADOR
-- =====================================================
-- Este script corrige específicamente el problema del usuario coeurdeluke.js@gmail.com
-- que debería tener nivel 0 (fundador) pero tiene nivel 1

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

-- Verificar todos los usuarios con nivel 0
SELECT 
    'USUARIOS CON NIVEL 0 (FUNDADORES)' as section,
    id,
    email,
    nickname,
    user_level,
    referral_code
FROM users 
WHERE user_level = 0
ORDER BY created_at;

-- =====================================================
-- PASO 2: CORRECCIÓN INMEDIATA
-- =====================================================

-- Resetear todos los usuarios a nivel 1 por seguridad
UPDATE users 
SET user_level = 1 
WHERE user_level = 0;

-- Configurar coeurdeluke.js@gmail.com como fundador (nivel 0)
UPDATE users 
SET 
    user_level = 0,
    referral_code = 'CRYPTOFORCE_LUKE',
    nickname = 'Luke',
    updated_at = now()
WHERE email = 'coeurdeluke.js@gmail.com';

-- Configurar infocryptoforce@gmail.com como fundador (nivel 0)
UPDATE users 
SET 
    user_level = 0,
    referral_code = 'CRYPTOFORCE_INFOCRYPTOFORCE',
    nickname = 'INFOCRYPTOFORCE',
    updated_at = now()
WHERE email = 'infocryptoforce@gmail.com';

-- =====================================================
-- PASO 3: VERIFICACIÓN POST-CORRECCIÓN
-- =====================================================

-- Verificar que solo existen 2 fundadores
DO $$
DECLARE
    founder_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO founder_count
    FROM users 
    WHERE user_level = 0;
    
    IF founder_count != 2 THEN
        RAISE EXCEPTION '❌ ERROR DE SEGURIDAD: Deben existir exactamente 2 usuarios fundadores (nivel 0), actualmente hay %', founder_count;
    END IF;
    
    RAISE NOTICE '✅ Verificación de seguridad: % usuarios fundadores confirmados', founder_count;
END $$;

-- Mostrar estado final
SELECT 
    'ESTADO FINAL DEL USUARIO FUNDADOR' as section,
    id,
    email,
    nickname,
    user_level,
    referral_code,
    updated_at
FROM users 
WHERE email = 'coeurdeluke.js@gmail.com';

-- Mostrar todos los fundadores
SELECT 
    'TODOS LOS FUNDADORES CONFIRMADOS' as section,
    id,
    email,
    nickname,
    user_level,
    referral_code
FROM users 
WHERE user_level = 0
ORDER BY created_at;

-- Mostrar estadísticas finales
SELECT 
    'ESTADÍSTICAS FINALES' as section,
    COUNT(*) as total_users,
    COUNT(CASE WHEN user_level = 0 THEN 1 END) as founders,
    COUNT(CASE WHEN user_level = 1 THEN 1 END) as regular_users,
    COUNT(CASE WHEN user_level > 1 THEN 1 END) as other_levels
FROM users;

SELECT '🎯 Permisos de usuario fundador corregidos correctamente!' as final_message;
