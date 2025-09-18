-- Solución completa para los errores de RLS (Row Level Security)
-- Ejecutar en Supabase SQL Editor

-- ==========================================
-- PASO 1: Verificar el estado actual
-- ==========================================

-- Verificar si RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS_Enabled"
FROM pg_tables 
WHERE tablename = 'users';

-- Verificar políticas existentes
SELECT 
    policyname,
    cmd as "Operation",
    roles,
    with_check,
    qual as "condition"
FROM pg_policies 
WHERE tablename = 'users';

-- ==========================================
-- PASO 2: Limpiar políticas existentes
-- ==========================================

-- Eliminar todas las políticas existentes para empezar limpio
DROP POLICY IF EXISTS "Allow insert for all users" ON public.users;
DROP POLICY IF EXISTS "public_insert_users" ON public.users;
DROP POLICY IF EXISTS "public_select_users" ON public.users;
DROP POLICY IF EXISTS "public_update_users" ON public.users;
DROP POLICY IF EXISTS "public_delete_users" ON public.users;
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;
DROP POLICY IF EXISTS "users_delete_policy" ON public.users;

-- ==========================================
-- PASO 3: Configurar RLS y permisos básicos
-- ==========================================

-- Habilitar RLS en la tabla users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Otorgar permisos básicos al rol anon (requerido para las políticas)
GRANT SELECT, INSERT, UPDATE ON public.users TO anon;

-- Otorgar permisos al rol authenticated también
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;

-- ==========================================
-- PASO 4: Crear políticas RLS optimizadas
-- ==========================================

-- POLÍTICA 1: Permitir INSERT para usuarios anónimos (registro)
-- Esta política permite que cualquier usuario anónimo pueda registrarse
CREATE POLICY "users_insert_anon_policy"
ON public.users
FOR INSERT
TO anon
WITH CHECK (true);

-- POLÍTICA 2: Permitir INSERT para usuarios autenticados
CREATE POLICY "users_insert_auth_policy"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (true);

-- POLÍTICA 3: Permitir SELECT para usuarios autenticados (solo sus propios datos)
-- Permite que los usuarios vean solo sus propios registros
CREATE POLICY "users_select_own_policy"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid()::text = id::text);

-- POLÍTICA 4: Permitir UPDATE para usuarios autenticados (solo sus propios datos)
CREATE POLICY "users_update_own_policy"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);

-- POLÍTICA 5: Permitir DELETE para usuarios autenticados (solo sus propios datos)
CREATE POLICY "users_delete_own_policy"
ON public.users
FOR DELETE
TO authenticated
USING (auth.uid()::text = id::text);

-- ==========================================
-- PASO 5: Verificar configuración final
-- ==========================================

-- Verificar que RLS esté habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS_Enabled"
FROM pg_tables 
WHERE tablename = 'users';

-- Verificar las políticas creadas
SELECT 
    policyname,
    cmd as "Operation",
    roles,
    permissive,
    with_check,
    qual as "condition"
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY cmd, policyname;

-- Verificar permisos de roles
SELECT 
    grantee as "Role",
    table_name,
    privilege_type as "Permission",
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'users' 
AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;

-- ==========================================
-- PASO 6: Estructura de tabla recomendada
-- ==========================================

-- Verificar la estructura actual de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Agregar columna id si no existe (recomendado para RLS)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'id'
    ) THEN
        ALTER TABLE users ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
        RAISE NOTICE 'Columna id agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna id ya existe';
    END IF;
END $$;

-- Agregar columna created_at si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE users ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
        RAISE NOTICE 'Columna created_at agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna created_at ya existe';
    END IF;
END $$;

-- Agregar columna updated_at si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
        RAISE NOTICE 'Columna updated_at agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna updated_at ya existe';
    END IF;
END $$;

-- ==========================================
-- PASO 7: Test de funcionamiento
-- ==========================================

-- Este comentario muestra cómo probar la inserción
-- (Descomenta para probar, pero asegúrate de usar datos únicos)
/*
INSERT INTO public.users (nombre, apellido, nickname, email, movil, exchange, uid) 
VALUES ('Test', 'User', 'testuser123', 'test123@example.com', '+1234567890', 'TestExchange', 'test123');
*/

-- ==========================================
-- MENSAJE FINAL
-- ==========================================

SELECT 'RLS configurado exitosamente. Las políticas permiten:
- INSERT: Usuarios anónimos pueden registrarse
- SELECT: Usuarios autenticados pueden ver solo sus datos
- UPDATE: Usuarios autenticados pueden actualizar solo sus datos
- DELETE: Usuarios autenticados pueden eliminar solo sus datos' AS "Configuración Completada";
