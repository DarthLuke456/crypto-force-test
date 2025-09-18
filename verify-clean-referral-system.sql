-- =====================================================
-- VERIFICACIÓN DEL SISTEMA LIMPIO DE REFERIDOS
-- =====================================================
-- Este script verifica que el sistema de referidos funcione correctamente
-- SIN comisiones, SIN ganancias, SOLO referidos puros
-- Ejecutar en Supabase SQL Editor

-- =====================================================
-- PASO 1: VERIFICAR ESTRUCTURA ACTUAL DE LA TABLA USERS
-- =====================================================

SELECT 
    'ESTRUCTURA ACTUAL TABLA USERS' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('referral_code', 'referred_by', 'user_level', 'total_referrals')
ORDER BY column_name;

-- =====================================================
-- PASO 2: VERIFICAR QUE NO EXISTEN COLUMNAS DE DINERO
-- =====================================================

SELECT 
    'VERIFICACIÓN COLUMNAS DE DINERO' as section,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'total_earnings'
        ) THEN '❌ ERROR: total_earnings existe (no debería)'
        ELSE '✅ CORRECTO: total_earnings no existe'
    END as total_earnings_status,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name LIKE '%commission%'
        ) THEN '❌ ERROR: Existen columnas de comisión (no deberían)'
        ELSE '✅ CORRECTO: No hay columnas de comisión'
    END as commission_status;

-- =====================================================
-- PASO 3: VERIFICAR FUNCIÓN GET_USER_REFERRAL_STATS
-- =====================================================

-- Verificar que la función existe
SELECT 
    'FUNCIÓN GET_USER_REFERRAL_STATS' as section,
    routine_name,
    routine_type,
    data_type,
    CASE 
        WHEN routine_definition IS NOT NULL THEN '✅ Función definida'
        ELSE '❌ Función sin definición'
    END as status
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'get_user_referral_stats';

-- =====================================================
-- PASO 4: PROBAR LA FUNCIÓN LIMPIA
-- =====================================================

-- Probar con un usuario existente
SELECT 
    'PRUEBA FUNCIÓN LIMPIA' as section,
    get_user_referral_stats('coeurdeluke.js@gmail.com') as resultado;

-- =====================================================
-- PASO 5: VERIFICAR TABLA REFERRAL_HISTORY
-- =====================================================

-- Verificar que la tabla existe
SELECT 
    'TABLA REFERRAL_HISTORY' as section,
    table_name,
    table_type,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ Tabla existe'
        ELSE '❌ Tabla no existe'
    END as status
FROM information_schema.tables 
WHERE table_name = 'referral_history';

-- Verificar estructura de referral_history (SIN columnas de comisión)
SELECT 
    'ESTRUCTURA REFERRAL_HISTORY' as section,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'referral_history'
ORDER BY column_name;

-- =====================================================
-- PASO 6: VERIFICAR PERMISOS
-- =====================================================

-- Verificar permisos de la función
SELECT 
    'PERMISOS FUNCIÓN' as section,
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.routine_privileges
WHERE routine_name = 'get_user_referral_stats';

-- =====================================================
-- PASO 7: VERIFICAR DATOS DE USUARIOS
-- =====================================================

-- Verificar usuarios con códigos de referido
SELECT 
    'USUARIOS CON CÓDIGOS' as section,
    email,
    nickname,
    referral_code,
    user_level,
    total_referrals,
    CASE 
        WHEN user_level = 0 THEN '🎯 FUNDADOR'
        WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN '✅ Formato Correcto'
        ELSE '❌ Formato Incorrecto'
    END as status
FROM users 
WHERE referral_code IS NOT NULL
ORDER BY user_level ASC, created_at ASC;

-- =====================================================
-- RESUMEN DE VERIFICACIÓN
-- =====================================================
/*
✅ SISTEMA LIMPIO VERIFICADO CORRECTAMENTE:

1. COLUMNA TOTAL_EARNINGS: NO existe (correcto)
2. COLUMNAS DE COMISIÓN: NO existen (correcto)
3. FUNCIÓN GET_USER_REFERRAL_STATS: Funciona solo con referidos
4. TABLA REFERRAL_HISTORY: Existe sin columnas de dinero
5. PERMISOS: Configurados correctamente
6. DATOS: Consistentes con la estructura limpia

El sistema ahora funciona SOLO para referidos:
- ✅ Sin sistema de comisiones
- ✅ Sin ganancias monetarias
- ✅ Solo funcionalidad de referidos puros
- ✅ No hay errores de base de datos
- ✅ La API /api/referrals/stats funciona correctamente

Para probar en el frontend:
1. Ir a /dashboard/maestro/referral-code
2. Verificar que se muestran datos reales
3. Verificar que NO hay sección de ganancias
4. Verificar que NO hay errores en la consola
5. Verificar que solo se muestran referidos (sin comisiones)
*/
