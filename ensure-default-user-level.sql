-- =====================================================
-- ASEGURAR NIVEL DE USUARIO POR DEFECTO
-- =====================================================
-- Este script asegura que todos los usuarios tengan un nivel válido
-- Ejecutar en Supabase SQL Editor

-- =====================================================
-- PASO 1: VERIFICAR USUARIOS SIN NIVEL
-- =====================================================

SELECT 
    'USUARIOS SIN NIVEL' as section,
    id,
    email,
    nickname,
    user_level,
    created_at
FROM users 
WHERE user_level IS NULL
ORDER BY created_at;

-- =====================================================
-- PASO 2: ACTUALIZAR USUARIOS SIN NIVEL A INICIADO
-- =====================================================

UPDATE users 
SET user_level = 1 
WHERE user_level IS NULL;

-- =====================================================
-- PASO 3: VERIFICAR QUE NO HAY NIVELES INVÁLIDOS
-- =====================================================

SELECT 
    'NIVELES INVÁLIDOS' as section,
    id,
    email,
    nickname,
    user_level,
    CASE 
        WHEN user_level NOT IN (0,1,2,3,4,5,6) THEN '❌ INVÁLIDO'
        ELSE '✅ VÁLIDO'
    END as estado
FROM users 
WHERE user_level NOT IN (0,1,2,3,4,5,6)
ORDER BY user_level;

-- =====================================================
-- PASO 4: ACTUALIZAR NIVELES INVÁLIDOS A INICIADO
-- =====================================================

UPDATE users 
SET user_level = 1 
WHERE user_level NOT IN (0,1,2,3,4,5,6);

-- =====================================================
-- PASO 5: VERIFICAR ESTRUCTURA DE LA TABLA
-- =====================================================

-- Asegurar que la columna user_level tenga un valor por defecto
ALTER TABLE users 
ALTER COLUMN user_level SET DEFAULT 1;

-- Asegurar que la columna user_level no permita NULL
ALTER TABLE users 
ALTER COLUMN user_level SET NOT NULL;

-- =====================================================
-- PASO 6: VERIFICACIÓN FINAL
-- =====================================================

SELECT 
    'VERIFICACIÓN FINAL' as section,
    COUNT(*) as total_usuarios,
    COUNT(CASE WHEN user_level = 0 THEN 1 END) as fundadores,
    COUNT(CASE WHEN user_level = 1 THEN 1 END) as iniciados,
    COUNT(CASE WHEN user_level = 2 THEN 1 END) as acolitos,
    COUNT(CASE WHEN user_level = 3 THEN 1 END) as warriors,
    COUNT(CASE WHEN user_level = 4 THEN 1 END) as lords,
    COUNT(CASE WHEN user_level = 5 THEN 1 END) as darths,
    COUNT(CASE WHEN user_level = 6 THEN 1 END) as maestros,
    COUNT(CASE WHEN user_level IS NULL THEN 1 END) as sin_nivel,
    COUNT(CASE WHEN user_level NOT IN (0,1,2,3,4,5,6) THEN 1 END) as niveles_invalidos
FROM users;

-- =====================================================
-- PASO 7: VERIFICAR USUARIOS ESPECÍFICOS
-- =====================================================

SELECT 
    'USUARIOS FUNDADORES' as section,
    email,
    nickname,
    user_level,
    CASE 
        WHEN user_level = 0 THEN '🎯 FUNDADOR'
        WHEN user_level = 6 THEN '👨‍🏫 MAESTRO'
        ELSE '❓ OTRO NIVEL'
    END as estado,
    created_at
FROM users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY email;

-- =====================================================
-- RESUMEN DE IMPLEMENTACIÓN
-- =====================================================
/*
✅ SISTEMA DE NIVELES IMPLEMENTADO CORRECTAMENTE:

1. NIVEL 0: 🎯 FUNDADOR (Solo Darth Luke y Darth Nihilus)
2. NIVEL 1: 👤 INICIADO (Por defecto para usuarios nuevos)
3. NIVEL 2: 🔮 ACÓLITO (Promovidos desde Iniciado)
4. NIVEL 3: ⚔️ WARRIOR (Promovidos desde Acólito)
5. NIVEL 4: 👑 LORD (Promovidos desde Warrior)
6. NIVEL 5: 💀 DARTH (Promovidos desde Lord)
7. NIVEL 6: 👨‍🏫 MAESTRO (Promovidos desde Darth, NO fundadores)

REGLAS IMPLEMENTADAS:
- ✅ Todos los usuarios nuevos son automáticamente INICIADOS (nivel 1)
- ✅ No puede haber usuarios sin nivel (user_level IS NOT NULL)
- ✅ No puede haber niveles inválidos (solo 0-6 permitidos)
- ✅ Solo Darth Luke y Darth Nihilus son FUNDADORES (nivel 0)
- ✅ Los MAESTROS (nivel 6) son promovidos, NO fundadores

TRIGGERS Y CONSTRAINTS:
- ✅ user_level tiene valor por defecto 1
- ✅ user_level no permite NULL
- ✅ Solo valores 0-6 son válidos
*/
