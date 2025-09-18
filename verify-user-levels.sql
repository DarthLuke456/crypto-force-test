-- =====================================================
-- VERIFICACIÓN DE NIVELES DE USUARIO
-- =====================================================
-- Este script verifica que los niveles de usuario sean correctos
-- Ejecutar en Supabase SQL Editor

-- =====================================================
-- PASO 1: VERIFICAR ESTRUCTURA DE LA TABLA USERS
-- =====================================================

SELECT 
    'ESTRUCTURA TABLA USERS' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('user_level', 'referral_code', 'total_referrals')
ORDER BY column_name;

-- =====================================================
-- PASO 2: VERIFICAR NIVELES DE USUARIO ACTUALES
-- =====================================================

SELECT 
    'NIVELES DE USUARIO ACTUALES' as section,
    id,
    email,
    nickname,
    user_level,
    CASE 
        WHEN user_level = 0 THEN '🎯 FUNDADOR/MAESTRO'
        WHEN user_level = 1 THEN '👤 INICIADO'
        WHEN user_level = 2 THEN '🔮 ACÓLITO'
        WHEN user_level = 3 THEN '⚔️ WARRIOR'
        WHEN user_level = 4 THEN '👑 LORD'
        WHEN user_level = 5 THEN '💀 DARTH'
        ELSE '❓ DESCONOCIDO'
    END as nivel_descripcion,
    referral_code,
    total_referrals,
    created_at
FROM users 
ORDER BY user_level ASC, created_at ASC;

-- =====================================================
-- PASO 3: VERIFICAR USUARIOS ESPECÍFICOS
-- =====================================================

SELECT 
    'USUARIOS ESPECÍFICOS' as section,
    email,
    nickname,
    user_level,
    CASE 
        WHEN user_level = 0 THEN '🎯 FUNDADOR/MAESTRO'
        WHEN user_level = 1 THEN '👤 INICIADO'
        WHEN user_level = 2 THEN '🔮 ACÓLITO'
        WHEN user_level = 3 THEN '⚔️ WARRIOR'
        WHEN user_level = 4 THEN '👑 LORD'
        WHEN user_level = 5 THEN '💀 DARTH'
        ELSE '❓ DESCONOCIDO'
    END as nivel_descripcion,
    referral_code,
    total_referrals
FROM users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY email;

-- =====================================================
-- PASO 4: VERIFICAR CONSISTENCIA DE DATOS
-- =====================================================

SELECT 
    'VERIFICACIÓN DE CONSISTENCIA' as section,
    COUNT(*) as total_usuarios,
    COUNT(CASE WHEN user_level = 0 THEN 1 END) as fundadores_maestros,
    COUNT(CASE WHEN user_level = 1 THEN 1 END) as iniciados,
    COUNT(CASE WHEN user_level = 2 THEN 1 END) as acolitos,
    COUNT(CASE WHEN user_level = 3 THEN 1 END) as warriors,
    COUNT(CASE WHEN user_level = 4 THEN 1 END) as lords,
    COUNT(CASE WHEN user_level = 5 THEN 1 END) as darths,
    COUNT(CASE WHEN user_level IS NULL THEN 1 END) as sin_nivel,
    COUNT(CASE WHEN user_level NOT IN (0,1,2,3,4,5) THEN 1 END) as niveles_invalidos
FROM users;

-- =====================================================
-- PASO 5: VERIFICAR QUE NO HAY DUPLICADOS
-- =====================================================

SELECT 
    'VERIFICACIÓN DE DUPLICADOS' as section,
    email,
    COUNT(*) as cantidad_registros,
    CASE 
        WHEN COUNT(*) > 1 THEN '❌ DUPLICADO'
        ELSE '✅ ÚNICO'
    END as estado
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1
ORDER BY cantidad_registros DESC;

-- =====================================================
-- RESUMEN DE VERIFICACIÓN
-- =====================================================
/*
✅ VERIFICACIÓN COMPLETA DE NIVELES DE USUARIO:

1. ESTRUCTURA: Verificar que user_level existe y es integer
2. NIVELES ACTUALES: Ver todos los usuarios y sus niveles
3. USUARIOS ESPECÍFICOS: Verificar Darth Luke y Darth Nihilus
4. CONSISTENCIA: Verificar que no hay niveles inválidos
5. DUPLICADOS: Verificar que no hay emails duplicados

RESULTADO ESPERADO:
- Darth Luke (coeurdeluke.js@gmail.com): user_level = 0 (FUNDADOR/MAESTRO)
- Darth Nihilus (infocryptoforce@gmail.com): user_level = 0 (FUNDADOR/MAESTRO)

Si los niveles son correctos en la base de datos pero incorrectos en la interfaz,
el problema está en el frontend, no en la base de datos.
*/
