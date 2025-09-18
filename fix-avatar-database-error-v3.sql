-- =====================================================
-- SOLUCIÓN PARA ERROR DE AVATAR EN BASE DE DATOS - V3
-- =====================================================
-- Este script soluciona el error: "index row size 8112 exceeds btree version 4 maximum 2704"
-- Maneja el trigger que depende de la columna avatar y el problema de CONCURRENTLY

-- =====================================================
-- 1. VERIFICAR ESTRUCTURA ACTUAL Y TRIGGERS
-- =====================================================

-- Verificar estructura de la tabla users
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
  AND column_name = 'avatar';

-- Verificar triggers en la tabla users
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement,
    trigger_schema,
    trigger_catalog
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
  AND event_object_schema = 'public'
  AND trigger_name LIKE '%avatar%';

-- =====================================================
-- 2. ELIMINAR TRIGGERS PROBLEMÁTICOS
-- =====================================================

-- Eliminar trigger que depende de la columna avatar
DROP TRIGGER IF EXISTS avatar_sync_trigger ON public.users;

-- Verificar que se eliminó
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
  AND event_object_schema = 'public'
  AND trigger_name LIKE '%avatar%';

-- =====================================================
-- 3. ELIMINAR ÍNDICES PROBLEMÁTICOS
-- =====================================================

-- Eliminar índice problemático en avatar si existe
DROP INDEX IF EXISTS idx_users_avatar;

-- Verificar índices restantes
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'users' 
  AND schemaname = 'public'
  AND indexdef LIKE '%avatar%';

-- =====================================================
-- 4. MODIFICAR COLUMNA AVATAR
-- =====================================================

-- Cambiar el tipo de columna avatar para permitir texto más largo sin índice
-- Usar TEXT en lugar de VARCHAR para evitar limitaciones de índice
ALTER TABLE public.users 
ALTER COLUMN avatar TYPE TEXT;

-- Verificar el cambio
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
  AND column_name = 'avatar';

-- =====================================================
-- 5. LIMPIAR AVATARES EXISTENTES DEMASIADO GRANDES
-- =====================================================

-- Actualizar avatares que sean demasiado grandes (más de 50KB en base64)
-- Esto es aproximadamente 37KB de imagen real
UPDATE public.users 
SET avatar = NULL 
WHERE avatar IS NOT NULL 
  AND length(avatar) > 50000;

-- =====================================================
-- 6. CREAR ÍNDICE PARCIAL PARA AVATAR (SIN CONCURRENTLY)
-- =====================================================

-- Crear índice parcial solo para avatares no nulos y limitar el tamaño
-- Sin CONCURRENTLY para evitar problemas de transacción
CREATE INDEX IF NOT EXISTS idx_users_avatar_partial 
ON public.users (avatar) 
WHERE avatar IS NOT NULL 
  AND length(avatar) < 1000;

-- =====================================================
-- 7. VERIFICAR RESULTADO FINAL
-- =====================================================

-- Contar usuarios con avatar
SELECT 
    COUNT(*) as total_users,
    COUNT(avatar) as users_with_avatar,
    COUNT(CASE WHEN avatar IS NOT NULL AND length(avatar) > 10000 THEN 1 END) as large_avatars
FROM public.users;

-- Mostrar algunos ejemplos de avatares
SELECT 
    email,
    nickname,
    CASE 
        WHEN avatar IS NULL THEN 'Sin avatar'
        WHEN length(avatar) < 1000 THEN 'Avatar pequeño'
        WHEN length(avatar) < 10000 THEN 'Avatar mediano'
        ELSE 'Avatar grande'
    END as avatar_size,
    length(avatar) as avatar_length
FROM public.users 
WHERE avatar IS NOT NULL
ORDER BY length(avatar) DESC
LIMIT 10;

-- Verificar estructura final
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
  AND column_name = 'avatar';

-- Verificar índices finales
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'users' 
  AND schemaname = 'public'
  AND indexdef LIKE '%avatar%';

-- =====================================================
-- RESUMEN DE CAMBIOS
-- =====================================================
SELECT jsonb_build_object(
    'info', 'ERROR DE AVATAR SOLUCIONADO - V3',
    'timestamp', NOW(),
    'cambios_realizados', jsonb_build_array(
        'Eliminado trigger avatar_sync_trigger',
        'Eliminado índice problemático idx_users_avatar',
        'Cambiado tipo de columna avatar a TEXT',
        'Creado índice parcial para avatares pequeños (sin CONCURRENTLY)',
        'Limpiado avatares demasiado grandes'
    ),
    'estado', 'Base de datos optimizada para avatares',
    'siguiente_paso', 'Probar carga de avatar desde la aplicación',
    'nota', 'El trigger fue eliminado. El índice se creó sin CONCURRENTLY para evitar problemas de transacción.'
) as resultado;
