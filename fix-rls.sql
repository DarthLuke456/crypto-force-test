-- Script para configurar RLS (Row Level Security) en la tabla users
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar estado actual de RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'users';

-- 2. Habilitar RLS si no está habilitado
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Eliminar políticas existentes que puedan estar causando conflictos
DROP POLICY IF EXISTS public_insert_users ON public.users;
DROP POLICY IF EXISTS public_select_users ON public.users;
DROP POLICY IF EXISTS public_update_users ON public.users;
DROP POLICY IF EXISTS public_delete_users ON public.users;

-- 4. Crear política para INSERT (permitir registro de nuevos usuarios)
CREATE POLICY public_insert_users
ON public.users
FOR INSERT
TO anon
WITH CHECK (true);

-- 5. Crear política para SELECT (usuarios pueden ver solo sus propios datos)
CREATE POLICY public_select_users
ON public.users
FOR SELECT
TO anon
USING (auth.uid()::text = uid OR uid IS NULL);

-- 6. Crear política para UPDATE (usuarios pueden actualizar solo sus propios datos)
CREATE POLICY public_update_users
ON public.users
FOR UPDATE
TO anon
USING (auth.uid()::text = uid)
WITH CHECK (auth.uid()::text = uid);

-- 7. Verificar políticas creadas
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

-- 8. Verificar que RLS esté habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'users';
