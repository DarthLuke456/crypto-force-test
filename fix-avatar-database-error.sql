-- =====================================================
-- SOLUCIÓN PARA ERROR DE AVATAR EN BASE DE DATOS
-- =====================================================
-- Este script soluciona el error: "index row size 8112 exceeds btree version 4 maximum 2704"

-- =====================================================
-- 1. VERIFICAR ESTRUCTURA ACTUAL DE LA TABLA USERS
-- =====================================================

-- Verificar si existe la columna avatar y su tipo
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
-- 2. VERIFICAR ÍNDICES PROBLEMÁTICOS
-- =====================================================

-- Verificar índices en la columna avatar
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'users' 
  AND schemaname = 'public'
  AND indexdef LIKE '%avatar%';

-- =====================================================
-- 3. ELIMINAR ÍNDICES PROBLEMÁTICOS EN AVATAR
-- =====================================================

-- Eliminar índice problemático en avatar si existe
DROP INDEX IF EXISTS idx_users_avatar;

-- =====================================================
-- 4. MODIFICAR COLUMNA AVATAR PARA OPTIMIZAR TAMAÑO
-- =====================================================

-- Cambiar el tipo de columna avatar para permitir texto más largo sin índice
-- Usar TEXT en lugar de VARCHAR para evitar limitaciones de índice
ALTER TABLE public.users 
ALTER COLUMN avatar TYPE TEXT;

-- =====================================================
-- 5. CREAR ÍNDICE PARCIAL PARA AVATAR (SOLO SI NO ES NULL)
-- =====================================================

-- Crear índice parcial solo para avatares no nulos y limitar el tamaño
-- Esto evita el problema de tamaño del índice
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_avatar_partial 
ON public.users (avatar) 
WHERE avatar IS NOT NULL 
  AND length(avatar) < 1000;

-- =====================================================
-- 6. VERIFICAR CAMBIOS APLICADOS
-- =====================================================

-- Verificar la nueva estructura
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
  AND column_name = 'avatar';

-- Verificar índices actuales
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'users' 
  AND schemaname = 'public'
  AND indexdef LIKE '%avatar%';

-- =====================================================
-- 7. LIMPIAR AVATARES EXISTENTES DEMASIADO GRANDES
-- =====================================================

-- Actualizar avatares que sean demasiado grandes (más de 50KB en base64)
-- Esto es aproximadamente 37KB de imagen real
UPDATE public.users 
SET avatar = NULL 
WHERE avatar IS NOT NULL 
  AND length(avatar) > 50000;

-- =====================================================
-- 8. VERIFICAR RESULTADO FINAL
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

-- =====================================================
-- RESUMEN DE CAMBIOS
-- =====================================================
SELECT jsonb_build_object(
    'info', 'ERROR DE AVATAR SOLUCIONADO',
    'timestamp', NOW(),
    'cambios_realizados', jsonb_build_array(
        'Eliminado índice problemático idx_users_avatar',
        'Cambiado tipo de columna avatar a TEXT',
        'Creado índice parcial para avatares pequeños',
        'Limpiado avatares demasiado grandes'
    ),
    'estado', 'Base de datos optimizada para avatares',
    'siguiente_paso', 'Probar carga de avatar desde la aplicación'
) as resultado;
