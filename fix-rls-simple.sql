-- SOLUCIÓN RÁPIDA para el error RLS
-- Ejecutar en Supabase SQL Editor

-- 1. Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Crear política simple para INSERT (permitir registro)
CREATE POLICY "Allow insert for all users" 
ON public.users 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- 3. Verificar que la política se creó
SELECT policyname, cmd, roles, with_check 
FROM pg_policies 
WHERE tablename = 'users';
