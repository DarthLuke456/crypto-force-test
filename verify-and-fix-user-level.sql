-- =====================================================
-- VERIFICAR Y CORREGIR NIVEL DE USUARIO MAESTRO
-- =====================================================
-- Este script verifica y corrige el nivel del usuario maestro

-- =====================================================
-- PASO 1: VERIFICAR USUARIOS EXISTENTES
-- =====================================================

-- Mostrar todos los usuarios con sus niveles
SELECT 
    'USUARIOS EXISTENTES' as section,
    id,
    email,
    nickname,
    user_level,
    referral_code,
    created_at
FROM users 
ORDER BY created_at DESC;

-- =====================================================
-- PASO 2: VERIFICAR ESTRUCTURA DE COLUMNAS
-- =====================================================

-- Verificar columnas de la tabla users
SELECT 
    'ESTRUCTURA DE COLUMNAS' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY column_name;

-- =====================================================
-- PASO 3: CORREGIR NIVEL DE USUARIO MAESTRO
-- =====================================================

-- Corregir el nivel del usuario coeurdeluke.js@gmail.com a 0 (maestro)
UPDATE users 
SET user_level = 0, updated_at = now()
WHERE email = 'coeurdeluke.js@gmail.com';

-- Verificar que se actualizó correctamente
SELECT 
    'USUARIO MAESTRO ACTUALIZADO' as section,
    email,
    nickname,
    user_level,
    referral_code,
    updated_at
FROM users 
WHERE email = 'coeurdeluke.js@gmail.com';

-- =====================================================
-- PASO 4: VERIFICAR FUNCIONES Y TRIGGERS
-- =====================================================

-- Verificar funciones disponibles
SELECT 
    'FUNCIONES DISPONIBLES' as section,
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%referral%'
ORDER BY routine_name;

-- Verificar triggers activos
SELECT 
    'TRIGGERS ACTIVOS' as section,
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND trigger_name LIKE '%referral%';

-- =====================================================
-- PASO 5: ESTADO FINAL
-- =====================================================

-- Mostrar estado final de usuarios
SELECT 
    'ESTADO FINAL' as section,
    COUNT(*) as total_users,
    COUNT(CASE WHEN user_level = 0 THEN 1 END) as maestros,
    COUNT(CASE WHEN user_level = 1 THEN 1 END) as usuarios_normales
FROM users;

-- Mostrar usuarios por nivel
SELECT 
    'USUARIOS POR NIVEL' as section,
    user_level,
    COUNT(*) as cantidad,
    STRING_AGG(email, ', ') as emails
FROM users 
GROUP BY user_level
ORDER BY user_level;
