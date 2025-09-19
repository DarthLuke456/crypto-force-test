-- Script para diagnosticar errores 406/409 de Supabase
-- Estos errores suelen estar relacionados con RLS policies o configuración de API

-- 1. Verificar políticas RLS en la tabla users
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users';

-- 2. Verificar si RLS está habilitado en la tabla users
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    forcerowsecurity
FROM pg_tables 
WHERE tablename = 'users';

-- 3. Verificar permisos de la tabla users
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'users';

-- 4. Verificar si hay conflictos de restricciones
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    confrelid::regclass as referenced_table,
    confkey as referenced_columns
FROM pg_constraint 
WHERE conrelid = 'users'::regclass;

-- 5. Verificar índices únicos
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'users';

-- 6. Verificar si hay datos que violen restricciones
SELECT 
    'Duplicados por uid:' as check_type,
    COUNT(*) as count
FROM (
    SELECT uid, COUNT(*) 
    FROM users 
    GROUP BY uid 
    HAVING COUNT(*) > 1
) as duplicates;

SELECT 
    'Duplicados por email:' as check_type,
    COUNT(*) as count
FROM (
    SELECT email, COUNT(*) 
    FROM users 
    GROUP BY email 
    HAVING COUNT(*) > 1
) as duplicates;

-- 7. Verificar tipos de datos en columnas críticas
SELECT 
    'uid' as column_name,
    pg_typeof(uid) as data_type,
    COUNT(*) as total_rows,
    COUNT(uid) as non_null_count
FROM users
UNION ALL
SELECT 
    'email' as column_name,
    pg_typeof(email) as data_type,
    COUNT(*) as total_rows,
    COUNT(email) as non_null_count
FROM users;

-- 8. Verificar si hay valores NULL en columnas que no deberían tenerlos
SELECT 
    'uid_nulls' as check_name,
    COUNT(*) as count
FROM users 
WHERE uid IS NULL
UNION ALL
SELECT 
    'email_nulls' as check_name,
    COUNT(*) as count
FROM users 
WHERE email IS NULL;
