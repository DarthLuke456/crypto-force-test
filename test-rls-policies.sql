-- Script para verificar que las políticas RLS estén funcionando correctamente
-- Ejecutar en Supabase SQL Editor DESPUÉS de aplicar fix-rls-complete.sql

-- ==========================================
-- VERIFICACIONES BÁSICAS
-- ==========================================

-- 1. Verificar que RLS esté habilitado
SELECT 
    'RLS Status Check' as test_name,
    CASE 
        WHEN rowsecurity = true THEN '✅ RLS está habilitado correctamente'
        ELSE '❌ RLS NO está habilitado - ejecuta fix-rls-complete.sql'
    END as result
FROM pg_tables 
WHERE tablename = 'users';

-- 2. Verificar que existan las políticas necesarias
SELECT 
    'Policy Count Check' as test_name,
    CASE 
        WHEN COUNT(*) >= 4 THEN '✅ Políticas encontradas: ' || COUNT(*)::text
        ELSE '❌ Faltan políticas - ejecuta fix-rls-complete.sql'
    END as result
FROM pg_policies 
WHERE tablename = 'users';

-- 3. Listar todas las políticas existentes
SELECT 
    'Policy Details' as section,
    policyname,
    cmd as operation,
    roles,
    CASE 
        WHEN cmd = 'INSERT' AND 'anon' = ANY(roles) THEN '✅'
        WHEN cmd = 'SELECT' AND 'authenticated' = ANY(roles) THEN '✅'
        WHEN cmd = 'UPDATE' AND 'authenticated' = ANY(roles) THEN '✅'
        WHEN cmd = 'DELETE' AND 'authenticated' = ANY(roles) THEN '✅'
        ELSE '⚠️'
    END as status
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY cmd, policyname;

-- 4. Verificar permisos de roles
SELECT 
    'Role Permissions' as section,
    grantee as role,
    privilege_type as permission,
    CASE 
        WHEN grantee = 'anon' AND privilege_type IN ('INSERT', 'SELECT') THEN '✅'
        WHEN grantee = 'authenticated' AND privilege_type IN ('SELECT', 'INSERT', 'UPDATE', 'DELETE') THEN '✅'
        ELSE '⚠️'
    END as status
FROM information_schema.table_privileges 
WHERE table_name = 'users' 
AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;

-- 5. Verificar estructura de la tabla
SELECT 
    'Table Structure' as section,
    column_name,
    data_type,
    is_nullable,
    CASE 
        WHEN column_name IN ('id', 'nombre', 'apellido', 'nickname', 'email') THEN '✅ Esencial'
        WHEN column_name IN ('created_at', 'updated_at') THEN '✅ Recomendado'
        ELSE '✅ Opcional'
    END as importance
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- ==========================================
-- TEST DE FUNCIONAMIENTO (COMENTADO)
-- ==========================================

-- Descomenta las siguientes líneas para probar la inserción
-- IMPORTANTE: Cambia el email por uno único antes de ejecutar

/*
-- Test de inserción (debería funcionar)
INSERT INTO public.users (nombre, apellido, nickname, email, movil, exchange, uid) 
VALUES (
    'Test', 
    'User', 
    'testuser_' || floor(random() * 1000)::text, 
    'test_' || floor(random() * 1000)::text || '@example.com', 
    '+1234567890', 
    'TestExchange', 
    'test_' || floor(random() * 1000)::text
);

-- Verificar que el registro se insertó
SELECT 'Insert Test' as test_name, COUNT(*) as records_inserted
FROM public.users 
WHERE email LIKE 'test_%@example.com';
*/

-- ==========================================
-- RESUMEN FINAL
-- ==========================================

SELECT 
    'RESUMEN' as section,
    'Si todos los tests muestran ✅, las políticas RLS están configuradas correctamente.' as status
UNION ALL
SELECT 
    'SIGUIENTE PASO' as section,
    'Prueba registrar un usuario desde la aplicación web.' as status;
