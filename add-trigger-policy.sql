-- Script para agregar política que permita inserción desde el trigger
-- Ejecutar en el SQL Editor de Supabase

-- 1. Agregar política especial para el trigger (permite inserción desde funciones)
CREATE POLICY "Allow trigger insertions" ON public.users
  FOR INSERT WITH CHECK (true);

-- 2. Verificar todas las políticas existentes
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users' 
AND schemaname = 'public'
ORDER BY policyname;

-- 3. Verificar que RLS esté habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'users' 
AND schemaname = 'public';
