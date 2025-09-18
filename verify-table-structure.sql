-- =====================================================
-- SCRIPT PARA VERIFICAR ESTRUCTURA DE TABLAS
-- =====================================================
-- Ejecutar este script ANTES de aplicar las políticas RLS

-- 1. Verificar estructura de la tabla referral_history
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'referral_history' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar si existe la tabla referral_history
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_name = 'referral_history' 
      AND table_schema = 'public'
) as table_exists;

-- 3. Verificar estructura de la tabla users
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Verificar si RLS está habilitado en referral_history
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'referral_history' 
  AND schemaname = 'public';

-- 5. Verificar políticas existentes en referral_history
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
WHERE tablename = 'referral_history' 
  AND schemaname = 'public';



